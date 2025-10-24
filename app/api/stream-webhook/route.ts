import {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from '@stream-io/node-sdk';
import { NextRequest, NextResponse } from 'next/server';

import AIAdvisor from '@/database/models/ai-advisor.model';
import Consultation from '@/database/models/consultation.model';
import { connectToDatabase } from '@/database/mongoose';
import { inngest } from '@/lib/inngest/client';
import { streamVideo, isStreamVideoConfigured } from '@/lib/stream/video';

function verifySignature(body: string, signature: string): boolean {
  if (!isStreamVideoConfigured || !streamVideo) return false;
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  if (!isStreamVideoConfigured || !streamVideo) {
    return NextResponse.json(
      { error: 'Stream Video is not configured' },
      { status: 503 }
    );
  }
  const signature = req.headers.get('x-signature');
  const apiKey = req.headers.get('x-api-key');

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: 'Missing signature or API key' },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  // Handle: Call session started - Connect AI advisor to the call
  if (eventType === 'call.session_started') {
    const event = payload as CallSessionStartedEvent;
    const consultationId = event.call.custom?.consultationId;

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultationId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const consultation = await Consultation.findOne({
      _id: consultationId,
      status: { $nin: ['completed', 'active', 'cancelled', 'processing'] },
    });

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    // Update status to active
    await Consultation.updateOne(
      { _id: consultation._id },
      {
        status: 'active',
        startedAt: new Date(),
      }
    );

    // Get AI advisor
    const advisor = await AIAdvisor.findById(consultation.advisorId);

    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    // Connect OpenAI Realtime API to the call
    try {
      const call = streamVideo.video.call('default', consultationId);
      const realtimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY!,
        agentUserId: advisor._id.toString(),
      });

      // Update AI session with advisor instructions
      realtimeClient.updateSession({
        instructions: advisor.instructions,
      });

      console.log(`AI advisor ${advisor.name} connected to consultation ${consultationId}`);
    } catch (error) {
      console.error('Error connecting OpenAI:', error);
      // Don't fail the webhook - call can still proceed
    }
  }

  // Handle: Participant left - End call if user leaves
  else if (eventType === 'call.session_participant_left') {
    const event = payload as CallSessionParticipantLeftEvent;
    const consultationId = event.call_cid.split(':')[1];

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultationId' },
        { status: 400 }
      );
    }

    try {
      const call = streamVideo.video.call('default', consultationId);
      await call.end();
      console.log(`Call ended for consultation ${consultationId}`);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }

  // Handle: Call session ended
  else if (eventType === 'call.session_ended') {
    const event = payload as CallEndedEvent;
    const consultationId = event.call.custom?.consultationId;

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultationId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await Consultation.updateOne(
      { _id: consultationId, status: 'active' },
      {
        status: 'processing',
        endedAt: new Date(),
      }
    );

    console.log(`Consultation ${consultationId} marked as processing`);
  }

  // Handle: Transcription ready - Trigger AI summary generation
  else if (eventType === 'call.transcription_ready') {
    const event = payload as CallTranscriptionReadyEvent;
    const consultationId = event.call_cid.split(':')[1];

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultationId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const consultation = await Consultation.findByIdAndUpdate(
      consultationId,
      {
        transcriptUrl: event.call_transcription.url,
      },
      { new: true }
    );

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Calculate duration
    if (consultation.startedAt && consultation.endedAt) {
      const duration = Math.floor(
        (consultation.endedAt.getTime() - consultation.startedAt.getTime()) / 1000
      );
      await Consultation.updateOne(
        { _id: consultationId },
        { duration }
      );
    }

    // Trigger Inngest function to process transcript
    await inngest.send({
      name: 'consultation/processing',
      data: {
        consultationId: consultation._id,
        transcriptUrl: consultation.transcriptUrl!,
      },
    });

    console.log(`Triggered processing for consultation ${consultationId}`);
  }

  // Handle: Recording ready
  else if (eventType === 'call.recording_ready') {
    const event = payload as CallRecordingReadyEvent;
    const consultationId = event.call_cid.split(':')[1];

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Missing consultationId' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await Consultation.updateOne(
      { _id: consultationId },
      {
        recordingUrl: event.call_recording.url,
      }
    );

    console.log(`Recording saved for consultation ${consultationId}`);
  }

  return NextResponse.json({ status: 'ok' });
}

