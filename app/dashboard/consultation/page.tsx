import ConsultationsTable from '@/components/consultation/ConsultationsTable';
import NewConsultationButton from '@/components/consultation/NewConsultationButton';
import PixelCharacter from '@/components/PixelCharacter';
import { Suspense } from 'react';
import { Video } from 'lucide-react';
import { auth } from '@/lib/better-auth/auth';
import { getAdvisors } from '@/lib/actions/ai-advisor.actions';
import { getConsultations } from '@/lib/actions/consultation.actions';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function ConsultationsContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const [advisorsData, consultationsData] = await Promise.all([
    getAdvisors(userId),
    getConsultations(userId),
  ]);

  // Serialize data for client components
  const serializedAdvisors = JSON.parse(JSON.stringify(advisorsData));
  const serializedConsultations = JSON.parse(JSON.stringify(consultationsData.consultations));

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 home-wrapper">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-500 mb-2 flex items-center">
              <PixelCharacter variant="hero" size="lg" className="mr-3" />
              AI Consultations
            </h1>
            <p className="text-gray-400">
              Schedule and manage video consultations with your AI financial advisors
            </p>
          </div>

          <NewConsultationButton advisors={serializedAdvisors} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-100">
                  {consultationsData.total}
                </p>
              </div>
              <Video className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {
                    consultationsData.consultations.filter(
                      (c) => c.status === 'completed'
                    ).length
                  }
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-blue-400">
                  {
                    consultationsData.consultations.filter(
                      (c) => c.status === 'upcoming'
                    ).length
                  }
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-500 font-bold">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Advisors</p>
                <p className="text-2xl font-bold text-purple-400">
                  {advisorsData.length}
                </p>
              </div>
              <PixelCharacter variant="walk" size="md" />
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <ConsultationsTable consultations={serializedConsultations} />
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
        </div>
      }
    >
      <ConsultationsContent />
    </Suspense>
  );
}


