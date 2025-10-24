'use client';

import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import VideoCallProvider from './VideoCallProvider';

interface VideoCallViewProps {
  consultationId: string;
  consultationName: string;
  consultation: Consultation;
}

export default function VideoCallView({
  consultationId,
  consultationName,
  consultation,
}: VideoCallViewProps) {
  if (consultation.status === 'completed') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Consultation Has Ended</h2>
          <p className="text-gray-400 mb-6">This consultation is no longer active.</p>
          <a
            href={`/consultation/${consultationId}`}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition"
          >
            View Details
          </a>
        </div>
      </div>
    );
  }

  if (consultation.status === 'cancelled') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Consultation Cancelled</h2>
          <p className="text-gray-400 mb-6">This consultation has been cancelled.</p>
          <a
            href="/dashboard/consultation"
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition"
          >
            Back to Consultations
          </a>
        </div>
      </div>
    );
  }

  return (
    <VideoCallProvider
      consultationId={consultationId}
      consultationName={consultationName}
    />
  );
}

