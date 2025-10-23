'use server';

import { getCryptoPrice } from '@/lib/actions/coingecko.actions';
import { getStockQuote } from '@/lib/actions/finnhub.actions';

export interface RealtimeQuote {
  fromAmount: number;
  toAmount: number;
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: number;
  fromPrice: number;
  toPrice: number;
  priceImpact: number;
  timestamp: number;
}

/**
 * Get real-time quote for stock/crypto swap using live market prices
 * This simulates what a real exchange like Binance does
 */
export async function getRealtimeSwapQuote(
  fromSymbol: string,
  toSymbol: string,
  fromAmount: number,
  fromType: 'stock' | 'crypto',
  toType: 'stock' | 'crypto'
): Promise<RealtimeQuote | null> {
  try {
    // Get real-time prices from APIs
    const fromPrice = await getAssetPrice(fromSymbol, fromType);
    const toPrice = await getAssetPrice(toSymbol, toType);

    if (!fromPrice || !toPrice || fromPrice <= 0 || toPrice <= 0) {
      console.warn(`Invalid prices: ${fromSymbol}=$${fromPrice}, ${toSymbol}=$${toPrice}`);
      return null;
    }

    // Calculate conversion
    // fromAmount * fromPrice = USD value
    // USD value / toPrice = toAmount
    const usdValue = fromAmount * fromPrice;
    const toAmount = usdValue / toPrice;
    const exchangeRate = fromPrice / toPrice;

    // Calculate price impact (for display purposes, typically 0.1-0.5%)
    // In a real DEX, this would be based on liquidity pool depth
    const priceImpact = 0.3; // 0.3% fee simulation

    return {
      fromAmount,
      toAmount,
      fromSymbol,
      toSymbol,
      exchangeRate,
      fromPrice,
      toPrice,
      priceImpact,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting realtime quote:', error);
    return null;
  }
}

/**
 * Get current price for an asset (stock or crypto)
 */
async function getAssetPrice(symbol: string, type: 'stock' | 'crypto'): Promise<number | null> {
  try {
    if (type === 'stock') {
      // Get stock price from Finnhub
      const quote = await getStockQuote(symbol);
      if (quote && quote.c) {
        return quote.c; // Current price
      }
      return null;
    } else {
      // Get crypto price from CoinGecko
      const price = await getCryptoPrice(symbol);
      return price;
    }
  } catch (error) {
    console.error(`Error fetching ${type} price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get multiple prices at once (for optimization)
 */
export async function getBatchPrices(
  assets: Array<{ symbol: string; type: 'stock' | 'crypto' }>
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  await Promise.all(
    assets.map(async ({ symbol, type }) => {
      const price = await getAssetPrice(symbol, type);
      if (price) {
        results[symbol] = price;
      }
    })
  );

  return results;
}

