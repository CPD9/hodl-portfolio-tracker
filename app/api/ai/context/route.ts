import { NextRequest, NextResponse } from 'next/server';
import { runAIContextAgent } from '@/lib/actions/ai-agent.actions';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, userContext } = await req.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }
    const result = await runAIContextAgent(messages, userId, userContext ?? null);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('context agent error:', error);
    return NextResponse.json(
      { error: 'context agent failed', message: String(error?.message || error) },
      { status: 500 }
    );
  }
}
