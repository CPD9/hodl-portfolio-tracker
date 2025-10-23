import { UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ADDRESS } from '@/lib/contracts/uniswapFactory';
import { useEffect, useState } from 'react';

import { FEE_TIERS } from '@/lib/contracts/uniswapRouter';
import { ethers } from 'ethers';

export interface LiquidityPool {
  address: string;
  token0: string;
  token1: string;
  fee: number;
}

export interface UseLiquidityPoolsResult {
  pools: LiquidityPool[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getPool: (token0: string, token1: string, fee?: number) => Promise<string | null>;
}

/**
 * Hook to interact with Uniswap V3 Factory and pools
 * Note: V3 doesn't have an enumerable list of pools like V2
 * Pools are queried by token pair + fee tier
 */
export function useLiquidityPools(): UseLiquidityPoolsResult {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get pool address for specific token pair and fee tier
   */
  const getPool = async (token0: string, token1: string, fee: number = FEE_TIERS.MEDIUM): Promise<string | null> => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const factoryContract = new ethers.Contract(
        UNISWAP_FACTORY_ADDRESS,
        UNISWAP_FACTORY_ABI,
        provider
      );

      const poolAddress = await factoryContract.getPool(token0, token1, fee);
      
      // V3 returns zero address if pool doesn't exist
      if (poolAddress === ethers.constants.AddressZero) {
        return null;
      }

      return poolAddress;
    } catch (err) {
      console.error('Error fetching pool:', err);
      return null;
    }
  };

  /**
   * Fetch common pools (not exhaustive like V2)
   * V3 pools are queried on-demand by token pair + fee
   */
  const fetchPools = async () => {
    setLoading(true);
    setError(null);

    try {
      // In Uniswap V3, we can't enumerate all pools
      // Instead, we'll maintain a list of known/common pools
      // Or query specific pools when needed via getPool()
      
      // For now, return empty array
      // Pools will be discovered dynamically when users try to swap
      setPools([]);
    } catch (err) {
      setError(err as Error);
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return {
    pools,
    loading,
    error,
    refetch: fetchPools,
    getPool
  };
}

