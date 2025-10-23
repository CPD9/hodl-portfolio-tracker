/**
 * Uniswap V3 Factory Contract Integration
 * 
 * Uniswap V3 is officially deployed on Base mainnet and testnet.
 * Using official deployment addresses from Uniswap documentation.
 * 
 * Official Deployments:
 * - Base Mainnet Factory: 0x33128a8fC17869897dcE68Ed026d694621f6FDfD
 * 
 * Documentation: https://docs.uniswap.org/contracts/v3/reference/deployments
 */

// Uniswap V3 Factory on Base (mainnet - can use for testing with small amounts)
export const UNISWAP_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_UNISWAP_FACTORY || '0x33128a8fC17869897dcE68Ed026d694621f6FDfD';

// Uniswap V3 Factory ABI (essential functions)
export const UNISWAP_FACTORY_ABI = [
  {
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' }
    ],
    name: 'getPool',
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' }
    ],
    name: 'createPool',
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token0', type: 'address' },
      { indexed: true, name: 'token1', type: 'address' },
      { indexed: true, name: 'fee', type: 'uint24' },
      { indexed: false, name: 'tickSpacing', type: 'int24' },
      { indexed: false, name: 'pool', type: 'address' }
    ],
    name: 'PoolCreated',
    type: 'event'
  }
] as const;

