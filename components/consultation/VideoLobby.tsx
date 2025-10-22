'use client';

import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  VideoPreview,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { auth } from '@/lib/better-auth/auth-client';

interface VideoLobbyProps {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = auth.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? '',
          image: data?.user.image ?? undefined,
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermissions = () => {
  return (
    <div className="text-center p-8">
      <p className="text-sm text-gray-300">
        Please grant your browser permission to access your camera and microphone.
      </p>
    </div>
  );
};

export default function VideoLobby({ onJoin }: VideoLobbyProps) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-gray-800 rounded-lg p-10 shadow-xl border border-gray-700 max-w-2xl">
          {/* Header */}
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-2xl font-bold text-yellow-500">Ready to Join?</h6>
            <p className="text-sm text-gray-400">
              Set up your camera and microphone before joining the consultation
            </p>
          </div>

          {/* Video Preview */}
          <div className="w-full">
            <VideoPreview
              DisabledVideoPreview={
                hasBrowserMediaPermission
                  ? DisabledVideoPreview
                  : AllowBrowserPermissions
              }
            />
          </div>

          {/* Controls */}
          <div className="flex gap-x-4">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          {/* Actions */}
          <div className="flex gap-x-4 justify-between w-full">
            <Button asChild variant="ghost" className="flex-1">
              <Link href="/dashboard/consultation">Cancel</Link>
            </Button>
            <Button
              onClick={onJoin}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

