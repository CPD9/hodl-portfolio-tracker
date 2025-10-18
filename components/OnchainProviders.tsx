'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { wagmiConfig } from '@/lib/wagmi/config';

const queryClient = new QueryClient();

export function OnchainProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

