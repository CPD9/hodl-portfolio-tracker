import { useState, useEffect } from 'react';
import { swapService } from '@/lib/web3/swapService';

export interface UseTokenBalanceResult {
  balance: bigint | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get ERC20 token balance for a user
 * @param tokenAddress - Address of the ERC20 token
 * @param userAddress - Address of the user
 * @param refreshInterval - Optional auto-refresh interval in ms
 */
export function useTokenBalance(
  tokenAddress: string | null,
  userAddress: string | null,
  refreshInterval?: number
): UseTokenBalanceResult {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = async () => {
    if (!tokenAddress || !userAddress) {
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await swapService.getTokenBalance(tokenAddress, userAddress);
      setBalance(result);
    } catch (err) {
      setError(err as Error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    // Set up auto-refresh if interval provided
    if (refreshInterval) {
      const interval = setInterval(fetchBalance, refreshInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, userAddress, refreshInterval]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance
  };
}

