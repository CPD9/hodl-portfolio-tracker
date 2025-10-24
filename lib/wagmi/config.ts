import { base, baseSepolia } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';

import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'HODL Portfolio Tracker',
      preference: 'smartWalletOnly', // Base mini apps use Smart Wallets
      headlessMode: false,
      reloadOnDisconnect: false,
      enableMobileWalletLink: true,
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || process.env.BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.BASE_SEPOLIA_RPC_URL),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

