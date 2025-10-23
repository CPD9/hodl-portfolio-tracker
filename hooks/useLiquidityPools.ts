import { UNISWAP_FACTORY_ABI, UNISWAP_FACTORY_ADDRESS } from '@/lib/contracts/uniswapFactory';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

export interface LiquidityPool {
  address: string;
  token0: string;
  token1: string;
}

export interface UseLiquidityPoolsResult {
  pools: LiquidityPool[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getPair: (token0: string, token1: string) => Promise<string | null>;
}

/**
 * Hook to interact with Uniswap V2 Factory and pairs
 * V2 pairs can be enumerated via allPairs() function
 */
export function useLiquidityPools(): UseLiquidityPoolsResult {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get pair address for specific token pair
   */
  const getPair = async (token0: string, token1: string): Promise<string | null> => {
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

      const pairAddress = await factoryContract.getPair(token0, token1);
      
      // V2 returns zero address if pair doesn't exist
      if (pairAddress === ethers.constants.AddressZero) {
        return null;
      }

      return pairAddress;
    } catch (err) {
      console.error('Error fetching pair:', err);
      return null;
    }
  };

  /**
   * Fetch pairs from factory (V2 allows enumeration)
   */
  const fetchPools = async () => {
    setLoading(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        setPools([]);
        return;
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const factoryContract = new ethers.Contract(
        UNISWAP_FACTORY_ADDRESS,
        UNISWAP_FACTORY_ABI,
        provider
      );

      // Get total number of pairs
      const allPairsLength = await factoryContract.allPairsLength();
      const pairsToFetch = Math.min(Number(allPairsLength), 50); // Limit to first 50 pairs

      const poolPromises = [];
      for (let i = 0; i < pairsToFetch; i++) {
        poolPromises.push(factoryContract.allPairs(i));
      }

      const pairAddresses = await Promise.all(poolPromises);
      const poolsData: LiquidityPool[] = pairAddresses.map((address: string) => ({
        address,
        token0: '', // Would need pair contract to fetch token addresses
        token1: '', // Would need pair contract to fetch token addresses
      }));

      setPools(poolsData);
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
    getPair
  };
}

