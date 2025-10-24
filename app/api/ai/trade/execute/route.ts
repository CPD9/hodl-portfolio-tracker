import { NextRequest, NextResponse } from 'next/server';
import { executeTradeOrders } from '@/lib/actions/ai-trade-agent.actions';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId, orders } = await req.json();
    if (!userId || !Array.isArray(orders)) {
      return NextResponse.json({ error: 'userId and orders are required' }, { status: 400 });
    }
    const res = await executeTradeOrders(userId, orders);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error('execute trade error:', error);
    return NextResponse.json(
      { error: 'execute trade failed', message: String(error?.message || error) },
      { status: 500 }
    );
  }
}
