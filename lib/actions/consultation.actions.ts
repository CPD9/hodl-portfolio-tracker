'use server';

import AIAdvisor from '@/database/models/ai-advisor.model';
import Consultation from '@/database/models/consultation.model';
import { connectToDatabase } from '@/database/mongoose';
import { serializeMongoObject } from '@/lib/utils';
import { streamChat, isStreamChatConfigured } from '@/lib/stream/chat';
import { streamVideo, isStreamVideoConfigured } from '@/lib/stream/video';

export async function generateStreamVideoToken(userId: string): Promise<string> {
  try {
    if (!isStreamVideoConfigured || !streamVideo) {
      throw new Error('Video calling is not configured');
    }
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: userId,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });

    return token;
  } catch (error) {
    console.error('Error generating Stream video token:', error);
    throw new Error('Failed to generate video token');
  }
}

export async function generateStreamChatToken(userId: string): Promise<string> {
  try {
    if (!isStreamChatConfigured || !streamChat) {
      throw new Error('Chat is not configured');
    }
    const token = streamChat.createToken(userId);
    await streamChat.upsertUser({
      id: userId,
      role: 'admin',
    });

    return token;
  } catch (error) {
    console.error('Error generating Stream chat token:', error);
    throw new Error('Failed to generate chat token');
  }
}

export async function createConsultation(
  userId: string,
  data: ConsultationFormData
): Promise<Consultation> {
  try {
    await connectToDatabase();

    // Verify advisor exists and belongs to user
    const advisor = await AIAdvisor.findOne({
      _id: data.advisorId,
      userId,
    });

    if (!advisor) {
      throw new Error('Advisor not found');
    }

    // Create consultation
    const consultation = await Consultation.create({
      ...data,
      userId,
      status: 'upcoming',
    });

    // Create Stream video call (optional)
    if (isStreamVideoConfigured && streamVideo) {
      const call = streamVideo.video.call('default', consultation._id);
      await call.create({
        data: {
          created_by_id: userId,
          custom: {
            consultationId: consultation._id,
            consultationName: consultation.name,
          },
          settings_override: {
            transcription: {
              language: 'en',
              mode: 'auto-on',
              closed_caption_mode: 'auto-on',
            },
            recording: {
              mode: 'auto-on',
              quality: '1080p',
            },
          },
        },
      });

      // Upsert AI advisor as Stream user
      await streamVideo.upsertUsers([
        {
          id: advisor._id.toString(),
          name: advisor.name,
          role: 'user',
          image: `https://api.dicebear.com/9/bottts-neutral/svg?seed=${advisor.name}`,
        },
      ]);
    } else {
      console.warn('[consultation] Stream Video disabled; created consultation without video call.');
    }

    return serializeMongoObject(consultation);
  } catch (error) {
    console.error('Error creating consultation:', error);
    throw new Error('Failed to create consultation');
  }
}

export async function getConsultations(
  userId: string,
  filters?: {
    status?: ConsultationStatus;
    search?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<{ consultations: Consultation[]; total: number; totalPages: number }> {
  try {
    await connectToDatabase();

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const query: any = { userId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Consultation.countDocuments(query),
    ]);

    // Populate advisor data
    const consultationsWithAdvisors = await Promise.all(
      consultations.map(async (consultation: any) => {
        const advisor = await AIAdvisor.findById(consultation.advisorId).lean();
        return {
          ...consultation,
          advisor: advisor ? serializeMongoObject(advisor) : undefined,
        };
      })
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      consultations: consultationsWithAdvisors.map(serializeMongoObject),
      total,
      totalPages,
    };
  } catch (error) {
    console.error('Error getting consultations:', error);
    throw new Error('Failed to get consultations');
  }
}

export async function getConsultation(
  consultationId: string,
  userId: string
): Promise<Consultation | null> {
  try {
    await connectToDatabase();

    const consultation: any = await Consultation.findOne({
      _id: consultationId,
      userId,
    }).lean();

    if (!consultation) {
      return null;
    }

    // Populate advisor data
    const advisor = await AIAdvisor.findById(consultation.advisorId).lean();

    return serializeMongoObject({
      ...consultation,
      advisor: advisor ? serializeMongoObject(advisor) : undefined,
    });
  } catch (error) {
    console.error('Error getting consultation:', error);
    throw new Error('Failed to get consultation');
  }
}

export async function updateConsultationStatus(
  consultationId: string,
  userId: string,
  status: ConsultationStatus,
  additionalData?: {
    startedAt?: Date;
    endedAt?: Date;
    transcriptUrl?: string;
    recordingUrl?: string;
    summary?: string;
    duration?: number;
  }
): Promise<Consultation | null> {
  try {
    await connectToDatabase();

    const consultation = await Consultation.findOneAndUpdate(
      { _id: consultationId, userId },
      {
        status,
        ...additionalData,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    if (!consultation) {
      return null;
    }

    return serializeMongoObject(consultation);
  } catch (error) {
    console.error('Error updating consultation status:', error);
    throw new Error('Failed to update consultation status');
  }
}

export async function cancelConsultation(
  consultationId: string,
  userId: string
): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await Consultation.updateOne(
      {
        _id: consultationId,
        userId,
        status: 'upcoming',
      },
      {
        status: 'cancelled',
        updatedAt: new Date(),
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error cancelling consultation:', error);
    throw new Error('Failed to cancel consultation');
  }
}

export async function deleteConsultation(
  consultationId: string,
  userId: string
): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await Consultation.deleteOne({
      _id: consultationId,
      userId,
    });

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting consultation:', error);
    throw new Error('Failed to delete consultation');
  }
}

export async function getTranscript(
  consultationId: string,
  userId: string
): Promise<TranscriptItem[]> {
  try {
    await connectToDatabase();

    const consultation: any = await Consultation.findOne({
      _id: consultationId,
      userId,
    }).lean();

    if (!consultation || !consultation.transcriptUrl) {
      return [];
    }

    const JSONL = (await import('jsonl-parse-stringify')).default;

    const response = await fetch(consultation.transcriptUrl);
    const text = await response.text();
    const transcript = JSONL.parse(text);

    // Get speaker IDs
    const speakerIds = [...new Set(transcript.map((item: any) => item.speaker_id))];

    // Fetch user data (could be AI advisors or human users)
    const advisor: any = await AIAdvisor.findById(consultation.advisorId).lean();

    const transcriptWithSpeakers = transcript.map((item: any) => {
      let user;

      if (advisor && item.speaker_id === advisor._id.toString()) {
        user = {
          name: advisor.name,
          image: `https://api.dicebear.com/9/bottts-neutral/svg?seed=${advisor.name}`,
        };
      } else if (item.speaker_id === userId) {
        user = {
          name: 'You',
          image: undefined,
        };
      } else {
        user = {
          name: 'Unknown',
          image: undefined,
        };
      }

      return {
        ...item,
        user,
      };
    });

    return transcriptWithSpeakers;
  } catch (error) {
    console.error('Error getting transcript:', error);
    return [];
  }
}

