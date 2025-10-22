"use server";

import OpenAI from 'openai';
import { buyCrypto, sellCrypto } from '@/lib/actions/crypto-trading.actions';
import { buyStock, sellStock } from '@/lib/actions/stock-trading.actions';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type TradeSide = 'BUY' | 'SELL';
export type AssetType = 'STOCK' | 'CRYPTO' | 'CASH';

export interface TradeOrderSpec {
  side: TradeSide;
  from: { type: AssetType; symbol: string; amount: number };
  to: { type: AssetType; symbol: string; amount: number };
}

export interface TradeProposal {
  orders: TradeOrderSpec[];
  note?: string;
}

const systemGuard = `You transform the user's chat intent into concrete trade orders.
Return ONLY valid JSON: { "orders": [ { "side": "BUY|SELL", "from": {"type": "STOCK|CRYPTO|CASH", "symbol": "USD|AAPL|BTC|...", "amount": number}, "to": {"type": "STOCK|CRYPTO|CASH", "symbol": "USD|AAPL|BTC|...", "amount": number} } ], "note"?: string }.
- Support multiple orders per request.
- Infer quantities and direction from message and PRICE_CONTEXT if present. If user specifies a cash budget (e.g., $500), set from.type=CASH symbol=USD amount to that budget and compute to.amount using price. If selling holdings, set from to the asset with the quantity and compute the USD in to side.
- Round: cash 2 decimals; crypto quantity up to 8; stocks 4.
- If nothing actionable, return {"orders": []}.`;

export async function decideTrades(userInput: string, userContext?: string | null, priceContextJSON?: any): Promise<TradeProposal | null> {
  try {
    if (!process.env.OPENAI_API_KEY) return null;
    const priceCtxStr = priceContextJSON ? JSON.stringify(priceContextJSON).slice(0, 8000) : 'N/A';
    const prompt = `USER MESSAGE:\n${userInput}\n\nUSER PROFILE:\n${userContext ?? 'N/A'}\n\nPRICE_CONTEXT:\n${priceCtxStr}\n\nRespond with JSON only.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemGuard },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content || '';
    // Try to extract JSON if model wrapped it
    const jsonMatch = raw.match(/\{[\s\S]*\}$/);
    const jsonStr = jsonMatch ? jsonMatch[0] : raw;
    const parsed = JSON.parse(jsonStr) as TradeProposal;
    if (!parsed || !Array.isArray(parsed.orders)) return null;
  parsed.orders = parsed.orders
      .filter(o => o && o.side && o.from && o.to)
      .map(o => ({
    side: (o.side === 'SELL' ? 'SELL' : 'BUY') as TradeSide,
        from: { type: (o.from.type || 'CASH') as AssetType, symbol: String(o.from.symbol).toUpperCase(), amount: Number(o.from.amount) },
        to: { type: (o.to.type || 'CASH') as AssetType, symbol: String(o.to.symbol).toUpperCase(), amount: Number(o.to.amount) },
      }))
      .filter(o => Number.isFinite(o.from.amount) && Number.isFinite(o.to.amount));
    if (parsed.orders.length === 0) return null;
    return parsed;
  } catch (e) {
    console.error('decideTrades error:', e);
    return null;
  }
}

export async function executeTradeOrders(userId: string, orders: TradeOrderSpec[]): Promise<{ success: boolean; message: string }> {
  try {
    for (const o of orders) {
      if (o.side === 'BUY') {
        if (o.to.type === 'CRYPTO') {
          const qty = o.to.amount;
          const res = await buyCrypto(userId, o.to.symbol, qty);
          if (!res.success) return { success: false, message: res.message };
        } else if (o.to.type === 'STOCK') {
          const qty = o.to.amount;
          const res = await buyStock(userId, o.to.symbol, qty);
          if (!res.success) return { success: false, message: res.message };
        }
      } else if (o.side === 'SELL') {
        if (o.from.type === 'CRYPTO') {
          const qty = o.from.amount;
          const res = await sellCrypto(userId, o.from.symbol, qty);
          if (!res.success) return { success: false, message: res.message };
        } else if (o.from.type === 'STOCK') {
          const qty = o.from.amount;
          const res = await sellStock(userId, o.from.symbol, qty);
          if (!res.success) return { success: false, message: res.message };
        }
      }
    }
    return { success: true, message: 'All orders executed' };
  } catch (e: any) {
    console.error('executeTradeOrders error:', e);
    return { success: false, message: e?.message || 'Execution failed' };
  }
}
