"use server";

import OpenAI from 'openai';
import { buyCrypto, sellCrypto } from '@/lib/actions/crypto-trading.actions';
import { buyStock, sellStock } from '@/lib/actions/stock-trading.actions';
import { refreshUserContext } from '@/lib/actions/user-context.actions';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

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

CRITICAL CONSTRAINTS (must ALWAYS be respected):
- Allowed trade shapes only:
  - BUY: from.type must be CASH with symbol "USD"; to.type must be STOCK or CRYPTO (not CASH).
  - SELL: from.type must be STOCK or CRYPTO; to.type must be CASH with symbol "USD".
- Do NOT produce asset-to-asset swaps (e.g., BTC -> ETH) or cash-to-cash; every order MUST start or end with USD as above.
- If the user asks for multiple transactions, you may return multiple orders, but EACH order must follow the above USD rule.

Quantities and pricing:
- You will receive USER_CONTEXT_JSON which includes the user's exact portfolio quantities; ALWAYS use it to infer amounts when the user doesn't specify a quantity (e.g., "sell my NVDA" -> set from.amount to the held quantity from USER_CONTEXT_JSON; "sell half my NVDA" -> from.amount = held quantity * 0.5).
- Infer quantities and direction from the message and PRICE_CONTEXT if present. If user specifies a cash budget (e.g., $500), set from.type=CASH symbol=USD amount to that budget and compute to.amount using price. If selling holdings, set from to the asset with the quantity and compute the USD in the to side (but USD amount may be left implicit if not needed by the system).

Rounding:
- cash 2 decimals; crypto quantity up to 8; stocks 4.

If nothing actionable or constraints would be violated, return {"orders": []} and add a helpful note explaining that only USD<->asset trades are supported.`;

export async function decideTrades(userInput: string, userContext?: string | null, priceContextJSON?: any): Promise<TradeProposal | null> {
  try {
    if (!process.env.OPENAI_API_KEY || !openai) return null;
    const priceCtxStr = priceContextJSON ? JSON.stringify(priceContextJSON).slice(0, 8000) : 'N/A';
    // Extract structured context JSON block if present in userContext
    let userSummary = userContext || 'N/A';
    let userContextJSON: any = null;
    if (userContext) {
      const m = userContext.match(/BEGIN_USER_CONTEXT_JSON\n([\s\S]*?)\nEND_USER_CONTEXT_JSON/);
      if (m && m[1]) {
        try {
          userContextJSON = JSON.parse(m[1]);
          // keep the human-readable summary by stripping the JSON block
          userSummary = userContext.replace(m[0], '').trim();
        } catch {}
      }
    }
    const userCtxStr = userContextJSON ? JSON.stringify(userContextJSON).slice(0, 8000) : 'N/A';

    const prompt = `USER MESSAGE:\n${userInput}\n\nUSER PROFILE (summary):\n${userSummary}\n\nUSER_CONTEXT_JSON:\n${userCtxStr}\n\nPRICE_CONTEXT:\n${priceCtxStr}\n\nRespond with JSON only.`;

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
      .filter(o => Number.isFinite(o.from.amount) || o.side === 'BUY');

    // Normalize CASH symbol variants to USD
    for (const o of parsed.orders) {
      if (o.from.type === 'CASH') o.from.symbol = 'USD';
      if (o.to.type === 'CASH') o.to.symbol = 'USD';
    }

    // Backfill missing SELL quantities from user's portfolio JSON if available
    if (userContextJSON && Array.isArray(userContextJSON.portfolio)) {
      for (const o of parsed.orders) {
        if (o.side === 'SELL' && (!Number.isFinite(o.from.amount) || o.from.amount <= 0)) {
          const holding = userContextJSON.portfolio.find((h: any) => String(h.symbol).toUpperCase() === o.from.symbol && h.type === o.from.type);
          if (holding && Number.isFinite(holding.quantity)) {
            o.from.amount = Number(holding.quantity);
          }
        }
      }
    }

    // Apply rounding rules
    const round = (val: number, decimals: number) => {
      const f = Math.pow(10, decimals);
      return Math.round(val * f) / f;
    };
    for (const o of parsed.orders) {
      if (o.from.type === 'CASH') o.from.amount = round(o.from.amount, 2);
      if (o.to.type === 'CASH') o.to.amount = round(o.to.amount, 2);
      if (o.from.type === 'CRYPTO') o.from.amount = round(o.from.amount, 8);
      if (o.to.type === 'CRYPTO') o.to.amount = round(o.to.amount, 8);
      if (o.from.type === 'STOCK') o.from.amount = round(o.from.amount, 4);
      if (o.to.type === 'STOCK') o.to.amount = round(o.to.amount, 4);
    }

    // Enforce USD-only trade constraint and filter invalid after rounding
    const isValidOrder = (o: TradeOrderSpec): boolean => {
      if (o.side === 'BUY') {
        // USD -> Asset
        return (
          o.from.type === 'CASH' && o.from.symbol === 'USD' &&
          (o.to.type === 'STOCK' || o.to.type === 'CRYPTO') && o.to.symbol !== 'USD' &&
          Number.isFinite(o.to.amount) && o.to.amount > 0
        );
      } else {
        // Asset -> USD
        return (
          (o.from.type === 'STOCK' || o.from.type === 'CRYPTO') && o.from.symbol !== 'USD' && o.from.amount > 0 &&
          o.to.type === 'CASH' && o.to.symbol === 'USD'
        );
      }
    };

    const originalCount = parsed.orders.length;
    parsed.orders = parsed.orders.filter(isValidOrder);

    // If we dropped any orders, add an explanatory note
    if (parsed.orders.length < originalCount) {
      const dropped = originalCount - parsed.orders.length;
      const msg = `${dropped} request(s) were omitted because only USD <-> (STOCK|CRYPTO) trades are supported (no direct asset-to-asset).`;
      parsed.note = parsed.note ? `${parsed.note} ${msg}` : msg;
    }

    // Final sanity: BUY must have to.amount; SELL must have from.amount
    parsed.orders = parsed.orders.filter(o => (o.side === 'SELL' ? o.from.amount > 0 : Number.isFinite(o.to.amount)));
    if (parsed.orders.length === 0) return null;
    return parsed;
  } catch (e) {
    console.error('decideTrades error:', e);
    return null;
  }
}

export async function executeTradeOrders(userId: string, orders: TradeOrderSpec[]): Promise<{ success: boolean; message: string }> {
  try {
    // Guardrail: enforce USD-only constraint at execution time as well
    for (const o of orders) {
      const buyValid = o.side === 'BUY' && o.from.type === 'CASH' && o.from.symbol === 'USD' && (o.to.type === 'STOCK' || o.to.type === 'CRYPTO') && o.to.symbol !== 'USD' && Number.isFinite(o.to.amount) && o.to.amount > 0;
      const sellValid = o.side === 'SELL' && (o.from.type === 'STOCK' || o.from.type === 'CRYPTO') && o.from.symbol !== 'USD' && o.from.amount > 0 && o.to.type === 'CASH' && o.to.symbol === 'USD';
      if (!(buyValid || sellValid)) {
        return { success: false, message: 'Invalid order: only USD <-> (STOCK|CRYPTO) trades are allowed.' };
      }
    }

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
    // All orders executed successfully; refresh the user's AI context summary so chat has fresh data
    try {
      await refreshUserContext(userId);
    } catch (err) {
      console.warn('refreshUserContext failed (non-fatal):', err);
    }
    return { success: true, message: 'All orders executed' };
  } catch (e: any) {
    console.error('executeTradeOrders error:', e);
    return { success: false, message: e?.message || 'Execution failed' };
  }
}
