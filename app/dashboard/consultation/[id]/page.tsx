import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Play,
  User,
  Video,
} from 'lucide-react';
import { getConsultation, getTranscript } from '@/lib/actions/consultation.actions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PixelCharacter from '@/components/PixelCharacter';
import { auth } from '@/lib/better-auth/auth';
import { format } from 'date-fns';
import { headers } from 'next/headers';
import humanizeDuration from 'humanize-duration';
import { redirect } from 'next/navigation';

const STATUS_COLORS = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  active: 'bg-green-500/20 text-green-400 border-green-500/50',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const STATUS_LABELS = {
  upcoming: 'Scheduled',
  active: 'In Progress',
  completed: 'Completed',
  processing: 'Processing',
  cancelled: 'Cancelled',
};

interface ConsultationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationDetailPage({
  params,
}: ConsultationDetailPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const consultation = await getConsultation(id, userId);

  if (!consultation) {
    redirect('/consultation');
  }

  const transcript =
    consultation.status === 'completed' && consultation.transcriptUrl
      ? await getTranscript(id, userId)
      : [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/consultation"
            className="inline-flex items-center text-gray-400 hover:text-yellow-500 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Consultations
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                {consultation.name}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={STATUS_COLORS[consultation.status]}>
                  {STATUS_LABELS[consultation.status]}
                </Badge>
                {consultation.advisor && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{consultation.advisor.name}</span>
                  </div>
                )}
              </div>
            </div>

            {consultation.status === 'upcoming' && (
              <Button
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Link href={`/call/${consultation._id}`}>
                  <Video className="w-4 h-4 mr-2" />
                  Join Consultation
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-100">Date & Time</h3>
            </div>
            <p className="text-gray-400">
              {consultation.startedAt
                ? format(new Date(consultation.startedAt), 'PPPpp')
                : format(new Date(consultation.createdAt), 'PPP')}
            </p>
          </div>

          {consultation.duration && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-100">Duration</h3>
              </div>
              <p className="text-gray-400">
                {humanizeDuration(consultation.duration * 1000, {
                  largest: 2,
                  round: true,
                })}
              </p>
            </div>
          )}

          {consultation.advisor && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <PixelCharacter variant="hero" size="sm" />
                <h3 className="font-semibold text-gray-100">AI Advisor</h3>
              </div>
              <p className="text-gray-400">{consultation.advisor.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {consultation.advisor.personality} Personality
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {consultation.summary && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-100">AI Summary</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">
                {consultation.summary}
              </div>
            </div>
          </div>
        )}

        {/* Recording */}
        {consultation.recordingUrl && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Play className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-100">Recording</h3>
            </div>
            <video
              src={consultation.recordingUrl}
              controls
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-100">Transcript</h3>
            </div>
            <div className="space-y-4">
              {transcript.map((item, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      {item.user?.image ? (
                        <img
                          src={item.user.image}
                          alt={item.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="font-semibold text-gray-100">
                        {item.user?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.floor(item.start_time / 60)}:
                        {String(Math.floor(item.start_time % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-gray-300">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {consultation.status === 'processing' && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6 text-center">
            <div className="inline-flex items-center space-x-3 text-yellow-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400" />
              <span className="font-semibold">
                Processing consultation transcript and summary...
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              This usually takes 1-2 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

