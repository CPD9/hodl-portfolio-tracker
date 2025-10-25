import { Address } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import swapRouterAbi from '@/lib/swap/abis/swapRouter.json';

export type SwapV3Params = {
  routerAddress?: Address; // If not provided, will try env var
  tokenIn: Address;
  tokenOut: Address;
  fee: number; // 500, 3000, 10000
  amountIn: bigint;
  amountOutMin: bigint;
  deadline: bigint; // seconds timestamp
};

export function getSwapRouterFromEnv(): Address | undefined {
  const v = process.env.NEXT_PUBLIC_UNISWAP_V3_SWAP_ROUTER_ADDRESS as Address | undefined;
  return v;
}

export function useSwapV3() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash });

  function execute(params: SwapV3Params) {
    const router = (params.routerAddress || getSwapRouterFromEnv());
    if (!router) throw new Error('Swap Router address not configured');
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: router,
      abi: swapRouterAbi as any,
      functionName: 'exactInputSingle',
      value: 0n,
      args: [
        {
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          fee: BigInt(params.fee),
          recipient: address,
          deadline: params.deadline,
          amountIn: params.amountIn,
          amountOutMinimum: params.amountOutMin,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });
  }

  return {
    execute,
    txHash: hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || confirmError,
  };
}
