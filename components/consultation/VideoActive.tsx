'use client';

import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk';

import Image from 'next/image';
import Link from 'next/link';

interface VideoActiveProps {
  onLeave: () => void;
  consultationName: string;
}

export default function VideoActive({
  onLeave,
  consultationName,
}: VideoActiveProps) {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 rounded-full p-4 flex items-center gap-4 border border-gray-700">
        <Link
          href="/"
          className="flex items-center justify-center p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full w-fit transition"
        >
          <Image
            src="/assets/icons/logo.svg"
            width={24}
            height={24}
            alt="HODL Logo"
          />
        </Link>
        <div>
          <h4 className="text-base font-semibold text-gray-100">
            {consultationName}
          </h4>
          <p className="text-xs text-gray-400">AI Financial Consultation</p>
        </div>
      </div>

      {/* Video Layout */}
      <SpeakerLayout />

      {/* Controls */}
      <div className="bg-gray-800 rounded-full px-4 border border-gray-700">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
}

