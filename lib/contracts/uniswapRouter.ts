/**
 * Uniswap V3 SwapRouter Contract Integration
 * 
 * Uniswap V3 is officially deployed on Base mainnet and testnet.
 * We're using the official deployment addresses.
 * 
 * Official Deployments:
 * - Base Mainnet SwapRouter: 0x2626664c2603336E57B271c5C0b26F421741e481
 * - Base Sepolia SwapRouter: Use same or deploy via Foundry
 * 
 * Documentation: https://docs.uniswap.org/contracts/v3/reference/deployments
 */

// Uniswap V3 SwapRouter on Base Sepolia
// If not available on testnet, we'll deploy via Foundry or use mainnet for testing with small amounts
export const UNISWAP_ROUTER_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_ROUTER || '0x2626664c2603336E57B271c5C0b26F421741e481';

// Uniswap V3 SwapRouter ABI (essential functions)
// Full ABI: https://github.com/Uniswap/v3-periphery/blob/main/contracts/SwapRouter.sol
export const UNISWAP_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' }
        ],
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'exactInputSingle',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { name: 'path', type: 'bytes' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' }
        ],
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'exactInput',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: 'amountMinimum', type: 'uint256' }, { name: 'recipient', type: 'address' }],
    name: 'unwrapWETH9',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;

// Uniswap V3 Quoter for getting quotes (read-only)
export const UNISWAP_QUOTER_ADDRESS = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3'; // Base mainnet
export const UNISWAP_QUOTER_ABI = [
  {
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'sqrtPriceLimitX96', type: 'uint160' }
    ],
    name: 'quoteExactInputSingle',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Uniswap V3 fee tiers (in hundredths of a bip, i.e. 1e-6)
export const FEE_TIERS = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.3%
  HIGH: 10000     // 1%
} as const;

