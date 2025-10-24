// Base Sepolia Smart Contract Addresses for HODL
// Deployed for START HACK 2025 Buildathon

export const BASE_SEPOLIA_STOCK_TOKENS = {
  AAPL: '0x334dFeb48aEC27fCb75249e77F546B687cC6aB94',
  TSLA: '0x3FF7a28970832F0B31ba496545a000971becFCC2',
  NVDA: '0x7c57A5BD9942e82Ba61C27B6141c6228c38c7487',
  MSFT: '0x532995D5C698a725B590550F67F9f90A00b352d8',
  AMZN: '0x8Fe92F95f0E4CAeE9494341C2B0Fbd93A2BE89A4',
  GOOGL: '0x75687E5c95e15Ba306b49869e49F017b3103AbF2',
} as const;

export const BASE_SEPOLIA_CONTRACTS = {
  STOCK_CRYPTO_SWAP: '0x4833D6D51b64f93B6708088c90aB6E138b6A1547',
} as const;

// Block explorer base URL
export const BASE_SEPOLIA_EXPLORER = 'https://base-sepolia.blockscout.com';

// Helper function to get block explorer link
export function getExplorerLink(address: string, type: 'address' | 'tx' = 'address'): string {
  return `${BASE_SEPOLIA_EXPLORER}/${type}/${address}`;
}

// Get all token addresses as array
export function getAllTokenAddresses(): string[] {
  return Object.values(BASE_SEPOLIA_STOCK_TOKENS);
}

// Get token symbol by address
export function getTokenSymbol(address: string): string | undefined {
  const entry = Object.entries(BASE_SEPOLIA_STOCK_TOKENS).find(
    ([_, addr]) => addr.toLowerCase() === address.toLowerCase()
  );
  return entry?.[0];
}

// Minimal ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

