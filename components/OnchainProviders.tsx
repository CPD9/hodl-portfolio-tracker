'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ReactNode, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { wagmiConfig } from '@/lib/wagmi/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function OnchainProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Suppress Coinbase Wallet SDK telemetry errors in development
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('telemetry') || 
         args[0].includes('Failed to execute inlined telemetry'))
      ) {
        // Suppress telemetry errors
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

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

