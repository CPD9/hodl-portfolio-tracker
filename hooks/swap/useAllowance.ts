import { useMemo } from 'react';
import { Address, erc20Abi, maxUint256 } from 'viem';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import erc20Json from '@/lib/swap/abis/erc20.json';

type UseAllowanceParams = {
  token: Address | undefined;
  spender: Address | undefined;
};

export function useAllowance({ token, spender }: UseAllowanceParams) {
  const { address } = useAccount();
  const { data: allowance, refetch } = useReadContract({
    address: token,
    abi: erc20Json as unknown as typeof erc20Abi,
    functionName: 'allowance',
    args: address && spender ? [address as Address, spender as Address] : undefined,
    query: {
      enabled: Boolean(address && token && spender),
    },
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  const isApproving = isPending || isConfirming;
  const approveError = writeError || confirmError;

  function approve(amount: bigint = maxUint256) {
    if (!token || !spender) return;
    writeContract({
      address: token,
      abi: erc20Json as unknown as typeof erc20Abi,
      functionName: 'approve',
      args: [spender as Address, amount],
    });
  }

  return useMemo(
    () => ({
  allowance: (allowance as bigint | undefined) ?? BigInt(0),
      isApproving,
      isApprovedTxSuccess: isConfirmed,
      approve,
      approveTxHash: hash,
      approveError,
      refetchAllowance: refetch,
    }),
    [allowance, isApproving, isConfirmed, hash, approveError, refetch]
  );
}
