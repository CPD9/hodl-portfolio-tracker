import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/actions/finnhub.actions';
import { getCryptoPrice } from '@/lib/actions/coingecko.actions';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type ReqSymbol = { symbol: string; type: 'STOCK' | 'CRYPTO' };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { symbols: ReqSymbol[] };
    const symbols = Array.isArray(body?.symbols) ? body.symbols : [];
    const trimmed = symbols
      .map((s) => ({ symbol: String(s.symbol || '').toUpperCase(), type: s.type === 'CRYPTO' ? 'CRYPTO' : 'STOCK' }))
      .filter((s) => !!s.symbol);

    const results: Record<string, { price: number | null; currency: string }> = {};

    await Promise.all(
      trimmed.map(async (s) => {
        try {
          if (s.type === 'STOCK') {
            const q = await getStockQuote(s.symbol);
            const price = q?.c ?? null;
            results[`${s.type}:${s.symbol}`] = { price, currency: 'USD' };
          } else {
            const price = await getCryptoPrice(s.symbol);
            results[`${s.type}:${s.symbol}`] = { price, currency: 'USD' };
          }
        } catch (e) {
          results[`${s.type}:${s.symbol}`] = { price: null, currency: 'USD' };
        }
      })
    );

    return NextResponse.json({ updatedAt: new Date().toISOString(), results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 });
  }
}
