import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { inngest } from '@/lib/inngest/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Trigger the Inngest event
    await inngest.send({
      name: 'app/send.daily.news',
      data: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Daily news summary triggered! Check your email in a few moments.',
    });
  } catch (error) {
    console.error('Error triggering news summary:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to trigger news summary' },
      { status: 500 }
    );
  }
}

