/**
 * Uniswap V2 Router Contract Integration
 * 
 * Using Uniswap V2 on Ethereum Sepolia (already deployed)
 * 
 * Official Deployments on Ethereum Sepolia:
 * - Factory: 0xF62c03E08ada871A0bEb309762E260a7a6a880E6
 * - Router02: 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3
 * 
 * Documentation: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02
 */

// Uniswap V2 Router on Ethereum Sepolia (already deployed!)
export const UNISWAP_ROUTER_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_ROUTER || '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';

// Uniswap V2 Router02 ABI (essential functions)
export const UNISWAP_ROUTER_ABI = [
  {
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'WETH',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    name: 'swapExactTokensForTokens',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' }
    ],
    name: 'getAmountsOut',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'amountOut', type: 'uint256' },
      { name: 'path', type: 'address[]' }
    ],
    name: 'getAmountsIn',
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

