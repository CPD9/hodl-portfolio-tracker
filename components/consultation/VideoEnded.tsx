'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VideoEnded() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-center max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Consultation Complete!
        </h2>

        <p className="text-gray-400 mb-2">
          Your AI consultation has ended successfully.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          The transcript and summary will be available shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full"
          >
            <Link href="/consultation">View All Consultations</Link>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

