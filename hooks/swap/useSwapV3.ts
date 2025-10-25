import { Address } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import swapRouterAbi from '@/lib/swap/abis/swapRouter.json';
import { NATIVE_ETH, getUniversalRouter } from '@/lib/swap/addresses';

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
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash });

  function execute(params: SwapV3Params) {
    // Use Universal Router from addresses config as fallback
    const universalRouter = getUniversalRouter(chainId);
    const router = (params.routerAddress || getSwapRouterFromEnv() || universalRouter);
    if (!router) throw new Error('Swap Router address not configured');
    if (!address) throw new Error('Wallet not connected');

    // Check if swapping native ETH - if so, send ETH as msg.value
    const isNativeETH = params.tokenIn.toLowerCase() === NATIVE_ETH.toLowerCase();
    const txValue = isNativeETH ? params.amountIn : 0n;

    writeContract({
      address: router,
      abi: swapRouterAbi,
      functionName: 'exactInputSingle',
      value: txValue,
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
