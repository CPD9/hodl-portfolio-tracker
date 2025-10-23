import { useState, useEffect } from 'react';
import { swapService, type QuoteResult } from '@/lib/web3/swapService';

export interface UseSwapQuoteResult {
  quote: QuoteResult | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get swap quote for token exchange
 * @param fromToken - Address of token to swap from
 * @param toToken - Address of token to swap to
 * @param amount - Amount to swap (in wei/smallest unit)
 * @param enabled - Whether to fetch quote automatically
 */
export function useSwapQuote(
  fromToken: string | null,
  toToken: string | null,
  amount: bigint | null,
  enabled: boolean = true
): UseSwapQuoteResult {
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !amount || amount === BigInt(0)) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await swapService.getQuote(fromToken, toToken, amount);
      setQuote(result);
    } catch (err) {
      setError(err as Error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, amount?.toString(), enabled]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote
  };
}

