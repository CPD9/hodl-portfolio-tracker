'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { base } from 'wagmi/chains';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useBaseNetwork() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    // Auto-switch to Base if connected to wrong network
    if (isConnected && chainId !== base.id) {
      toast.info('Switching to Base network...', {
        description: 'HODL works best on Base L2'
      });
      switchChain?.({ chainId: base.id });
    }
  }, [chainId, isConnected, switchChain]);

  return {
    isOnBase: chainId === base.id,
    switchToBase: () => {
      if (switchChain) {
        switchChain({ chainId: base.id });
      }
    },
    currentChainId: chainId,
  };
}

