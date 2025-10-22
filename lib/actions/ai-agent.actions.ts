"use server";

import OpenAI from 'openai';
import { getStockQuote, getStockKeyMetrics } from '@/lib/actions/finnhub.actions';
import { getMultipleCryptoData, getCryptoMarketData } from '@/lib/actions/coingecko.actions';
import { sendChatMessage } from '@/lib/actions/chat.actions';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type PriceEntry = {
  symbol: string;
  type: 'STOCK' | 'CRYPTO';
  price: number | null;
  currency?: string;
  marketCap?: number | null;
  // Optional enriched metrics
  metrics?: Record<string, number | string | null>;
};

type PriceContext = {
  generatedAt: string;
  prices: Array<{ symbol: string; type: 'STOCK' | 'CRYPTO'; price: number | null; currency: string; marketCap: number | null }>;
};

/**
 * Ask a lightweight assistant if realtime prices should be included and which symbols.
 * Returns a JSON array specification like: [{ symbol: 'AAPL', type: 'STOCK' }, ...]
 */
export async function decideIfPricesNeeded(userInput: string, userContext?: string | null): Promise<{ includePrices: boolean; symbols: { symbol: string; type: 'STOCK' | 'CRYPTO' }[] }> {
  const prompt = `You are a decision agent.
Given the user's request and profile, decide whether fresh realtime market prices are required and which symbols to fetch.

USER REQUEST:\n"""
${userInput}
"""

USER PROFILE CONTEXT (may include holdings, watchlist, preferences):\n"""
${userContext ?? 'N/A'}
"""

Guidelines:
- If the user asks about "my portfolio" or their current holdings, infer up to 10 relevant symbols directly from the profile context.
- Prefer exact tickers/symbols mentioned in the profile (e.g., AAPL, NVDA, BTC, ETH).
- If the user asks about a specific asset, include that symbol.
- Only include symbols that are necessary for the answer.

Return ONLY valid JSON of the form:
{
  "includePrices": boolean,
  "symbols": [ { "symbol": "AAPL", "type": "STOCK" }, { "symbol": "BTC", "type": "CRYPTO" } ]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You decide whether realtime market prices are required for a user request.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 200,
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content || '';

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.includePrices === 'boolean' && Array.isArray(parsed.symbols)) {
      // Basic validation
      const symbols = parsed.symbols.slice(0, 10).map((s: any) => ({ symbol: String(s.symbol).toUpperCase(), type: s.type === 'CRYPTO' ? 'CRYPTO' : 'STOCK' }));
      return { includePrices: parsed.includePrices, symbols };
    }
  } catch (e) {
    console.error('Failed to parse decision agent response:', e, raw);
  }

  // Fallback: don't include prices
  return { includePrices: false, symbols: [] };
}

/**
 * Fetch prices for a batch of symbols using existing actions.
 */
export async function fetchPricesBatch(symbols: { symbol: string; type: 'STOCK' | 'CRYPTO' }[]): Promise<PriceEntry[]> {
  const results: PriceEntry[] = [];

  for (const s of symbols) {
    try {
      if (s.type === 'STOCK') {
        const quote = await getStockQuote(s.symbol);
        const price = quote?.c ?? null; // finnhub quote current price `c`
        const metrics = await getStockKeyMetrics(s.symbol);
        results.push({
          symbol: s.symbol,
          type: 'STOCK',
          price,
          currency: 'USD',
          marketCap: metrics?.marketCap ?? null,
          metrics: metrics
            ? {
                peRatio: metrics.peRatio ?? null,
                epsTtm: metrics.epsTtm ?? null,
                beta: metrics.beta ?? null,
                dividendYield: metrics.dividendYield ?? null,
                week52High: metrics.week52High ?? null,
                week52Low: metrics.week52Low ?? null,
              }
            : undefined,
        });
      } else {
        // coingecko functions use ids/names; assume symbol works with helper which maps
        const data = await getMultipleCryptoData([s.symbol]);
        const coin = data?.[0] as any;
  const price = coin?.price ?? coin?.current_price ?? null;
        const marketCap = coin?.market_cap ?? coin?.marketCap ?? null;
        // fetch richer market data for single symbol for extra metrics (24h change already in coin)
        const detail = await getCryptoMarketData(s.symbol);
        results.push({
          symbol: s.symbol,
          type: 'CRYPTO',
          price: price ?? null,
          currency: 'USD',
          marketCap,
          metrics: {
            change24h: (coin?.price_change_percentage_24h ?? detail?.change24h ?? null) as number | null,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching price for', s.symbol, error);
      results.push({ symbol: s.symbol, type: s.type, price: null });
    }
  }

  return results;
}

/**
 * Build a compact JSON context payload from price entries.
 */
export async function buildPriceContextJSON(entries: PriceEntry[]): Promise<PriceContext> {
  const now = new Date().toISOString();
  return {
    generatedAt: now,
    prices: entries.map(e => ({
      symbol: e.symbol,
      type: e.type,
      price: e.price,
      currency: e.currency ?? 'USD',
      marketCap: e.marketCap ?? null,
      metrics: e.metrics ?? undefined,
    })),
  };
}

/**
 * Main agent: given user messages, decide if prices are needed, fetch them, then call chat service with enriched context.
 */
export async function runAIContextAgent(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userId?: string | null,
  userContext?: string | null
): Promise<{ assistantMessage: { role: 'assistant'; content: string } | null; priceContext?: PriceContext | null }> {
  // Use last user message to decide
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const userInput = lastUser?.content ?? '';

  const decision = await decideIfPricesNeeded(userInput, userContext);

  let priceContext: PriceContext | null = null;

  if (decision.includePrices && decision.symbols.length > 0) {
  const entries = await fetchPricesBatch(decision.symbols);
  priceContext = await buildPriceContextJSON(entries);
  }

  // Call existing chat API with optional priceContext serialized into a system prompt
  const systemContext = priceContext ? `REALTIMES_PRICES_JSON:\n${JSON.stringify(priceContext)}` : undefined;

  // Reuse sendChatMessage which hits /api/chat; prepend system message if needed
  const toSend = [...messages];
  if (systemContext) {
    toSend.unshift({ role: 'assistant', content: systemContext });
  }

  // sendChatMessage expects ChatMessage[] with timestamps
  const now = new Date();
  const chatMessages = toSend.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content, timestamp: new Date(now.getTime()) }));
  const assistant = await sendChatMessage(chatMessages, userContext ?? undefined);

  if (!assistant) return { assistantMessage: null, priceContext };

  return { assistantMessage: { role: 'assistant', content: assistant.content }, priceContext };
}
