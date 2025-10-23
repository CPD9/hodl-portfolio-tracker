'use client';

import { useCallback, useEffect, useState } from 'react';
import { getRealtimeSwapQuote, type RealtimeQuote } from '@/lib/services/realtime-quote.service';

interface UseRealtimeQuoteProps {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
  fromType: 'stock' | 'crypto';
  toType: 'stock' | 'crypto';
  enabled?: boolean;
}

export function useRealtimeQuote({
  fromSymbol,
  toSymbol,
  fromAmount,
  fromType,
  toType,
  enabled = true,
}: UseRealtimeQuoteProps) {
  const [quote, setQuote] = useState<RealtimeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!enabled || !fromAmount || parseFloat(fromAmount) <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(fromAmount);
      const result = await getRealtimeSwapQuote(
        fromSymbol,
        toSymbol,
        amount,
        fromType,
        toType
      );

      if (result) {
        setQuote(result);
      } else {
        setError('Unable to fetch quote. Please try again.');
        setQuote(null);
      }
    } catch (err: any) {
      console.error('Quote fetch error:', err);
      setError(err.message || 'Failed to get quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [fromSymbol, toSymbol, fromAmount, fromType, toType, enabled]);

  // Fetch quote with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [fetchQuote]);

  // Refresh quote every 10 seconds
  useEffect(() => {
    if (!enabled || !fromAmount || parseFloat(fromAmount) <= 0) return;

    const interval = setInterval(() => {
      fetchQuote();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [fetchQuote, enabled, fromAmount]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
  };
}

