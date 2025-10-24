import { NextRequest, NextResponse } from 'next/server';
import { decideTrades } from '@/lib/actions/ai-trade-agent.actions';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userInput, userContext, priceContextJSON } = await req.json();
    if (typeof userInput !== 'string' || !userInput.trim()) {
      return NextResponse.json({ error: 'userInput is required' }, { status: 400 });
    }
    const proposal = await decideTrades(userInput, userContext ?? null, priceContextJSON);
    return NextResponse.json({ proposal });
  } catch (error: any) {
    console.error('trade agent error:', error);
    return NextResponse.json(
      { error: 'trade agent failed', message: String(error?.message || error) },
      { status: 500 }
    );
  }
}
