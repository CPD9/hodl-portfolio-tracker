import { base, baseSepolia } from 'wagmi/chains';

// Native ETH sentinel address used in swap operations
export const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const;

// Uniswap Universal Router deployments (sourced from Uniswap/universal-router deploy-addresses)
// Base mainnet and Base Sepolia testnet
export const UNIVERSAL_ROUTER: Record<number, string> = {
  [base.id]: '0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC', // UniversalRouterV2 on Base
  [baseSepolia.id]: '0x95273d871c8156636e114b63797d78D7E1720d81', // UniversalRouterV2 on Base Sepolia
};

// Optional: Uniswap V3 Quoter (V2) address per chain.
// If not provided here, set NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS in env.
// Leaving undefined until verified to avoid accidental misuse.
export const V3_QUOTER: Partial<Record<number, string>> = {
  // [base.id]: '',
  // [baseSepolia.id]: '',
};

// Common token addresses on Base. Extend as needed with your RWA stock tokens.
export const TOKENS = {
  BASE: {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    CBBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  },
  BASE_SEPOLIA: {
    // Fill with test token addresses you control/liquidity exists for
  },
} as const;

export function getQuoterAddress(chainId: number): string | undefined {
  return (
    V3_QUOTER[chainId] ||
    process.env.NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS ||
    undefined
  );
}

export function getUniversalRouter(chainId: number): string | undefined {
  return UNIVERSAL_ROUTER[chainId];
}
