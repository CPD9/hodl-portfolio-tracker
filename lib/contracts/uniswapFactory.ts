/**
 * Uniswap V2 Factory Contract Integration
 * 
 * Using Uniswap V2 on Ethereum Sepolia (already deployed)
 * 
 * Official Deployment on Ethereum Sepolia:
 * - Factory: 0xF62c03E08ada871A0bEb309762E260a7a6a880E6
 * 
 * Documentation: https://docs.uniswap.org/contracts/v2/reference/smart-contracts/factory
 */

// Uniswap V2 Factory on Ethereum Sepolia (already deployed!)
export const UNISWAP_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_FACTORY || '0xF62c03E08ada871A0bEb309762E260a7a6a880E6';

// Uniswap V2 Factory ABI (essential functions)
export const UNISWAP_FACTORY_ABI = [
  {
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' }
    ],
    name: 'getPair',
    outputs: [{ name: 'pair', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' }
    ],
    name: 'createPair',
    outputs: [{ name: 'pair', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'allPairs',
    outputs: [{ name: 'pair', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'allPairsLength',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

