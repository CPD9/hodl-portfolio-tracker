// Base Chain Configuration for HODL Portfolio Tracker
// START HACK 2025 - Team HODL

export const BASE_CONFIG = {
  // Base Mainnet
  MAINNET: {
    chainId: parseInt(process.env.NEXT_PUBLIC_BASE_CHAIN_ID || '8453'),
    chainName: 'Base',
    rpcUrls: [process.env.NEXT_PUBLIC_BASE_RPC_URL || process.env.BASE_RPC_URL || 'https://mainnet.base.org'],
    blockExplorerUrls: [process.env.NEXT_PUBLIC_BASE_EXPLORER_URL || 'https://basescan.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  
  // Base Sepolia Testnet
  TESTNET: {
    chainId: 84532,
    chainName: 'Base Sepolia',
    rpcUrls: [process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

// Popular Base tokens for portfolio tracking
export const BASE_TOKENS = {
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  WETH: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
  },
  // Add more Base tokens as needed
} as const;

// Base DeFi protocols integration points
export const BASE_DEFI_PROTOCOLS = {
  UNISWAP_V3: {
    name: 'Uniswap V3',
    router: '0x2626664c2603336E57B271c5C0b26F421741e481',
    factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
  },
  AAVE_V3: {
    name: 'Aave V3',
    pool: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
  },
  // Add more protocols as needed
} as const;

export type BaseNetwork = keyof typeof BASE_CONFIG;
export type BaseToken = keyof typeof BASE_TOKENS;
