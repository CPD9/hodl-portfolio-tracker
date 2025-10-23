/**
 * StockCryptoSwap Contract Integration
 * 
 * This file exports the deployed contract address and ABI for the StockCryptoSwap contract.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Deploy the contract using: forge script script/DeployStockCryptoSwap.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast
 * 2. Copy the deployed contract address below
 * 3. The ABI is automatically generated from the Solidity contract
 */

// TODO: Replace with actual deployed contract address after running deployment script
export const STOCK_CRYPTO_SWAP_ADDRESS = process.env.NEXT_PUBLIC_STOCK_CRYPTO_SWAP_ADDRESS || '0x0000000000000000000000000000000000000000';

// Stock token addresses (deployed on Ethereum Sepolia via Remix)
export const STOCK_TOKENS = {
  AAPL: process.env.NEXT_PUBLIC_TOKEN_AAPL || '',
  TSLA: process.env.NEXT_PUBLIC_TOKEN_TSLA || '',
  NVDA: process.env.NEXT_PUBLIC_TOKEN_NVDA || '',
  MSFT: process.env.NEXT_PUBLIC_TOKEN_MSFT || '',
  AMZN: process.env.NEXT_PUBLIC_TOKEN_AMZN || '',
  GOOGL: process.env.NEXT_PUBLIC_TOKEN_GOOGL || '',
} as const;

// Ethereum Sepolia USDC address
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

// Ethereum Sepolia WETH address (Wrapped ETH)
export const WETH_ADDRESS = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';

// Minimal ABI for StockCryptoSwap contract
// TODO: Replace with full ABI from artifacts after compilation
export const STOCK_CRYPTO_SWAP_ABI = [
  // Stock management functions
  {
    inputs: [
      { name: '_symbol', type: 'string' },
      { name: '_tokenAddress', type: 'address' },
      { name: '_initialPriceUSD', type: 'uint256' }
    ],
    name: 'listStock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: '_symbol', type: 'string' },
      { name: '_newPriceUSD', type: 'uint256' }
    ],
    name: 'updateStockPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Swap functions
  {
    inputs: [
      { name: '_stockSymbol', type: 'string' },
      { name: '_stockAmount', type: 'uint256' },
      { name: '_cryptoToken', type: 'address' },
      { name: '_minCryptoAmount', type: 'uint256' }
    ],
    name: 'swapStockForCrypto',
    outputs: [{ name: 'cryptoAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: '_cryptoToken', type: 'address' },
      { name: '_cryptoAmount', type: 'uint256' },
      { name: '_stockSymbol', type: 'string' },
      { name: '_minStockAmount', type: 'uint256' }
    ],
    name: 'swapCryptoForStock',
    outputs: [{ name: 'stockAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Quote functions
  {
    inputs: [
      { name: '_stockSymbol', type: 'string' },
      { name: '_stockAmount', type: 'uint256' }
    ],
    name: 'getStockToCryptoQuote',
    outputs: [{ name: 'usdValue', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_cryptoAmount', type: 'uint256' },
      { name: '_stockSymbol', type: 'string' }
    ],
    name: 'getCryptoToStockQuote',
    outputs: [{ name: 'stockAmount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  // View functions
  {
    inputs: [{ name: '_symbol', type: 'string' }],
    name: 'getStockInfo',
    outputs: [
      {
        components: [
          { name: 'symbol', type: 'string' },
          { name: 'tokenAddress', type: 'address' },
          { name: 'priceUSD', type: 'uint256' },
          { name: 'totalSupply', type: 'uint256' },
          { name: 'active', type: 'bool' },
          { name: 'lastUpdated', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_symbol', type: 'string' }
    ],
    name: 'getUserStockBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'symbol', type: 'string' },
      { indexed: true, name: 'tokenAddress', type: 'address' },
      { indexed: false, name: 'initialPrice', type: 'uint256' }
    ],
    name: 'StockListed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'stockSymbol', type: 'string' },
      { indexed: false, name: 'stockAmount', type: 'uint256' },
      { indexed: false, name: 'cryptoToken', type: 'address' },
      { indexed: false, name: 'cryptoAmount', type: 'uint256' }
    ],
    name: 'StockToCryptoSwap',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'cryptoToken', type: 'address' },
      { indexed: false, name: 'cryptoAmount', type: 'uint256' },
      { indexed: false, name: 'stockSymbol', type: 'string' },
      { indexed: false, name: 'stockAmount', type: 'uint256' }
    ],
    name: 'CryptoToStockSwap',
    type: 'event'
  }
] as const;

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export type StockSymbol = keyof typeof STOCK_TOKENS;

export interface StockInfo {
  symbol: string;
  tokenAddress: string;
  priceUSD: bigint;
  totalSupply: bigint;
  active: boolean;
  lastUpdated: bigint;
}

