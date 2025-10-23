import { useState, useEffect } from 'react';
import { swapService } from '@/lib/web3/swapService';

export interface UseTokenAllowanceResult {
  allowance: bigint | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  needsApproval: (amount: bigint) => boolean;
}

/**
 * Hook to check ERC20 token allowance
 * @param tokenAddress - Address of the ERC20 token
 * @param ownerAddress - Address of the token owner
 * @param spenderAddress - Address of the spender (contract)
 */
export function useTokenAllowance(
  tokenAddress: string | null,
  ownerAddress: string | null,
  spenderAddress: string | null
): UseTokenAllowanceResult {
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllowance = async () => {
    if (!tokenAddress || !ownerAddress || !spenderAddress) {
      setAllowance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await swapService.checkAllowance(
        tokenAddress,
        ownerAddress,
        spenderAddress
      );
      setAllowance(result);
    } catch (err) {
      setError(err as Error);
      setAllowance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, ownerAddress, spenderAddress]);

  const needsApproval = (amount: bigint): boolean => {
    if (!allowance) return true;
    return allowance < amount;
  };

  return {
    allowance,
    loading,
    error,
    refetch: fetchAllowance,
    needsApproval
  };
}

