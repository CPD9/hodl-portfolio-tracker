import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';
import { getPortfolioSummary } from '@/lib/actions/portfolio.actions';

// Force dynamic rendering (don't try to statically analyze during build)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const data = await getPortfolioSummary(userId);
    if (!data) {
      return NextResponse.json({ success: false, message: 'Failed to load portfolio' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/portfolio/summary error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
