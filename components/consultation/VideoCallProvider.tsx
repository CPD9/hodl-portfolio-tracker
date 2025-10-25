'use client';

import '@stream-io/video-react-sdk/dist/css/styles.css';

import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import VideoCallUI from './VideoCallUI';
import { auth } from '@/lib/better-auth/auth-client';
import { generateStreamVideoToken } from '@/lib/actions/consultation.actions';
import { useMutation } from '@tanstack/react-query';

interface VideoCallProviderProps {
  consultationId: string;
  consultationName: string;
}

export default function VideoCallProvider({
  consultationId,
  consultationName,
}: VideoCallProviderProps) {
  const { data: session } = auth.useSession();
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  // Generate token mutation
  const generateToken = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('No user ID');
      return await generateStreamVideoToken(session.user.id);
    },
  });

  // Initialize Stream Video client
  useEffect(() => {
    if (!session?.user) return;

    const initClient = async () => {
      const _client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
        user: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image || undefined,
        },
        tokenProvider: async () => {
          return await generateToken.mutateAsync();
        },
      });

      setClient(_client);
    };

    initClient();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(undefined);
      }
    };
  }, [session?.user]);

  // Initialize call
  useEffect(() => {
    if (!client) return;

    const _call = client.call('default', consultationId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, consultationId]);

  if (!client || !call || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <Loader2 className="size-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <VideoCallUI consultationName={consultationName} />
      </StreamCall>
    </StreamVideo>
  );
}

