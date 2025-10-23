/**
 * Uniswap V2 Factory Contract Integration
 * 
 * This file exports the deployed Uniswap V2 Factory address and ABI.
 * 
 * DEPLOYMENT INSTRUCTIONS (via CRANQ):
 * 1. Follow tutorial timestamp 00:20:03 - 00:30:58
 * 2. Set up CRANQ project with Uniswap V2 Factory compilation
 * 3. Deploy to Base Sepolia testnet
 * 4. Copy the deployed factory address below
 */

// TODO: Replace with actual deployed Uniswap V2 Factory address from CRANQ
export const UNISWAP_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_FACTORY || '0x0000000000000000000000000000000000000000';

// Minimal Uniswap V2 Factory ABI
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
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token0', type: 'address' },
      { indexed: true, name: 'token1', type: 'address' },
      { indexed: false, name: 'pair', type: 'address' },
      { indexed: false, name: '', type: 'uint256' }
    ],
    name: 'PairCreated',
    type: 'event'
  }
] as const;

