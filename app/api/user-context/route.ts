import { NextRequest, NextResponse } from 'next/server';
import { getUserContext, refreshUserContext } from '@/lib/actions/user-context.actions';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const context = await getUserContext(userId);
    return NextResponse.json({ context });
  } catch (error: any) {
    console.error('getUserContext error:', error);
    return NextResponse.json({ error: 'failed', message: String(error?.message || error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, action } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (action === 'refresh') {
      const context = await refreshUserContext(userId);
      return NextResponse.json({ context, refreshed: true });
    }
    return NextResponse.json({ error: 'unsupported action' }, { status: 400 });
  } catch (error: any) {
    console.error('user-context POST error:', error);
    return NextResponse.json({ error: 'failed', message: String(error?.message || error) }, { status: 500 });
  }
}
