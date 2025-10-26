import { base, baseSepolia } from 'wagmi/chains';

// Native ETH sentinel address used in swap operations
export const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const;

// Uniswap V3 SwapRouter deployments
// These routers support exactInputSingle and exactInput functions
export const SWAP_ROUTER: Record<number, string> = {
  [base.id]: '0x2626664c2603336E57B271c5C0b26F421741e481', // SwapRouter on Base mainnet
  [baseSepolia.id]: '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4', // SwapRouter on Base Sepolia
};

// Uniswap Universal Router deployments (sourced from Uniswap/universal-router deploy-addresses)
// Base mainnet and Base Sepolia testnet
export const UNIVERSAL_ROUTER: Record<number, string> = {
  [base.id]: '0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC', // UniversalRouterV2 on Base
  [baseSepolia.id]: '0x95273d871c8156636e114b63797d78D7E1720d81', // UniversalRouterV2 on Base Sepolia
};

// Uniswap V3 Quoter (V2) addresses per chain
export const V3_QUOTER: Partial<Record<number, string>> = {
  [base.id]: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a', // QuoterV2 on Base mainnet
  [baseSepolia.id]: '0xC5290058841028F1614F3A6F0F5816cAd0df5E27', // QuoterV2 on Base Sepolia
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

export function getSwapRouter(chainId: number): string | undefined {
  return SWAP_ROUTER[chainId];
}

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
