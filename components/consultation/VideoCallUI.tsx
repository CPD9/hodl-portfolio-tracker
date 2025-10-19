'use client';

import { StreamTheme, useCall } from '@stream-io/video-react-sdk';

import VideoActive from './VideoActive';
import VideoEnded from './VideoEnded';
import VideoLobby from './VideoLobby';
import { useState } from 'react';

interface VideoCallUIProps {
  consultationName: string;
}

export default function VideoCallUI({ consultationName }: VideoCallUIProps) {
  const call = useCall();
  const [view, setView] = useState<'lobby' | 'call' | 'ended'>('lobby');

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setView('call');
  };

  const handleLeave = () => {
    if (!call) return;
    call.endCall();
    setView('ended');
  };

  return (
    <StreamTheme className="h-full">
      {view === 'lobby' && <VideoLobby onJoin={handleJoin} />}
      {view === 'call' && (
        <VideoActive onLeave={handleLeave} consultationName={consultationName} />
      )}
      {view === 'ended' && <VideoEnded />}
    </StreamTheme>
  );
}

