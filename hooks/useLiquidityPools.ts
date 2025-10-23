import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { UNISWAP_FACTORY_ADDRESS, UNISWAP_FACTORY_ABI } from '@/lib/contracts/uniswapFactory';

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
}

/**
 * Hook to fetch all liquidity pools from Uniswap V2 Factory
 */
export function useLiquidityPools(): UseLiquidityPoolsResult {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPools = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if factory address is deployed
      if (UNISWAP_FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
        // Not deployed yet, return empty array
        setPools([]);
        setLoading(false);
        return;
      }

      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const factoryContract = new ethers.Contract(
        UNISWAP_FACTORY_ADDRESS,
        UNISWAP_FACTORY_ABI,
        provider
      );

      // Get all pairs count
      const pairsCount = await factoryContract.allPairsLength();
      
      // Fetch all pair addresses
      const poolPromises: Promise<LiquidityPool>[] = [];
      
      for (let i = 0; i < pairsCount.toNumber(); i++) {
        poolPromises.push(
          (async () => {
            const pairAddress = await factoryContract.allPairs(i);
            // In a real implementation, we would fetch token0 and token1 from the pair contract
            // For now, we'll return minimal info
            return {
              address: pairAddress,
              token0: '', // TODO: Fetch from pair contract
              token1: '', // TODO: Fetch from pair contract
            };
          })()
        );
      }

      const fetchedPools = await Promise.all(poolPromises);
      setPools(fetchedPools);
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
    refetch: fetchPools
  };
}

