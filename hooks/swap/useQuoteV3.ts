import { useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import quoterAbi from '@/lib/swap/abis/quoterV2.json';
import { getQuoterAddress } from '@/lib/swap/addresses';

export type QuoteParams = {
  tokenIn: Address | undefined;
  tokenOut: Address | undefined;
  amountIn: string; // human string (e.g., '1.0')
  decimalsIn: number;
  fee?: number; // 500, 3000, 10000; default 3000
};

export type QuoteResult = {
  amountOut: bigint | null;
  amountOutFormatted: string | null;
  loading: boolean;
  error?: string;
};

// Single-hop quote using Uniswap V3 QuoterV2's quoteExactInputSingle
export function useQuoteV3Single({ tokenIn, tokenOut, amountIn, decimalsIn, fee = 3000 }: QuoteParams): QuoteResult {
  const chainId = useChainId();
  const [error, setError] = useState<string | undefined>();
  const quoter = getQuoterAddress(chainId);

  const amountInWei = useMemo(() => {
    try {
      if (!amountIn) return BigInt(0);
      return parseUnits(amountIn, decimalsIn);
    } catch {
      return BigInt(0);
    }
  }, [amountIn, decimalsIn]);

  const enabled = Boolean(quoter && tokenIn && tokenOut && amountInWei > BigInt(0));

  const { data, isLoading, error: wagmiError } = useReadContract({
    address: (quoter as Address) || undefined,
    abi: quoterAbi as unknown as any,
    functionName: 'quoteExactInputSingle',
    args: enabled
      ? [
          {
            tokenIn: tokenIn as Address,
            tokenOut: tokenOut as Address,
            fee: BigInt(fee),
            amountIn: amountInWei,
            sqrtPriceLimitX96: BigInt(0),
          },
        ]
      : undefined,
    query: {
      enabled,
    },
  });

  useEffect(() => {
    setError(undefined);
    if (!quoter) setError('Quoter address not configured for this chain');
    if (wagmiError) setError(wagmiError.message);
  }, [quoter, wagmiError]);

  const amountOut = (data && Array.isArray(data) ? (data[0] as bigint) : null) ?? null;

  return {
    amountOut,
    amountOutFormatted: amountOut ? amountOut.toString() : null,
    loading: isLoading,
    error,
  };
}
