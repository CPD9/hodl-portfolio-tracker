import VideoCallView from '@/components/consultation/VideoCallView';
import { auth } from '@/lib/better-auth/auth';
import { getConsultation } from '@/lib/actions/consultation.actions';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface CallPageProps {
  params: Promise<{ id: string }>;
}

export default async function CallPage({ params }: CallPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in');
  }

  const consultation = await getConsultation(id, userId);

  if (!consultation) {
    redirect('/dashboard/consultation');
  }

  return (
    <VideoCallView
      consultationId={id}
      consultationName={consultation.name}
      consultation={consultation}
    />
  );
}

