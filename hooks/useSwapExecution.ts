import { useState } from 'react';
import { swapService, type SwapParams } from '@/lib/web3/swapService';
import { ethers } from 'ethers';

export type SwapStatus = 'idle' | 'approving' | 'swapping' | 'success' | 'error';

export interface UseSwapExecutionResult {
  approve: (tokenAddress: string, amount: bigint) => Promise<void>;
  swap: (params: SwapParams) => Promise<void>;
  status: SwapStatus;
  error: Error | null;
  txHash: string | null;
  reset: () => void;
}

/**
 * Hook to handle swap execution (approval + swap)
 */
export function useSwapExecution(): UseSwapExecutionResult {
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const approve = async (tokenAddress: string, amount: bigint) => {
    setStatus('approving');
    setError(null);
    setTxHash(null);

    try {
      // Get the spender address (either StockCryptoSwap or Uniswap Router)
      // For now, we'll use StockCryptoSwap as default spender
      const spenderAddress = process.env.NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS || '';
      
      const tx = await swapService.approveToken(tokenAddress, spenderAddress, amount);
      setTxHash(tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      setStatus('idle');
    } catch (err) {
      setError(err as Error);
      setStatus('error');
      throw err;
    }
  };

  const swap = async (params: SwapParams) => {
    setStatus('swapping');
    setError(null);
    setTxHash(null);

    try {
      const tx = await swapService.executeSwap(params);
      setTxHash(tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      setStatus('success');
    } catch (err) {
      setError(err as Error);
      setStatus('error');
      throw err;
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
    setTxHash(null);
  };

  return {
    approve,
    swap,
    status,
    error,
    txHash,
    reset
  };
}

