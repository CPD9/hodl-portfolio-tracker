/**
 * Portfolio Rebalancer Contract Integration
 * 
 * This file contains ABI and helper functions to interact with the PortfolioRebalancer contract
 * deployed on Base blockchain.
 */

export const PORTFOLIO_REBALANCER_ABI = [
  {
    type: "constructor",
    inputs: [{ name: "_swapRouter", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPortfolio",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_tokens", type: "address[]", internalType: "address[]" },
      {
        name: "_targetPercentages",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateAllocation",
    inputs: [
      { name: "_portfolioId", type: "uint256", internalType: "uint256" },
      { name: "_tokenIndex", type: "uint256", internalType: "uint256" },
      { name: "_newPercentage", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rebalance",
    inputs: [
      { name: "_portfolioId", type: "uint256", internalType: "uint256" },
      { name: "_totalValue", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPortfolio",
    inputs: [{ name: "_portfolioId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "owner", type: "address", internalType: "address" },
      {
        name: "allocations",
        type: "tuple[]",
        internalType: "struct PortfolioRebalancer.TokenAllocation[]",
        components: [
          { name: "token", type: "address", internalType: "address" },
          {
            name: "targetPercentage",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "currentAmount", type: "uint256", internalType: "uint256" },
        ],
      },
      { name: "lastRebalanced", type: "uint256", internalType: "uint256" },
      { name: "active", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserPortfolios",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "portfolioCounter",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "portfolios",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "owner", type: "address", internalType: "address" },
      { name: "lastRebalanced", type: "uint256", internalType: "uint256" },
      { name: "active", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "swapRouter",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract ISwapRouter" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_POOL_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint24", internalType: "uint24" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "AllocationUpdated",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "portfolioId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "token",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "targetPercentage",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PortfolioCreated",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "portfolioId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Rebalanced",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "portfolioId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAllocation",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidToken",
    inputs: [],
  },
  {
    type: "error",
    name: "SwapFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "Unauthorized",
    inputs: [],
  },
] as const;

// Contract addresses (update after deployment)
export const PORTFOLIO_REBALANCER_ADDRESSES = {
  // Base Mainnet
  8453: process.env.NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE || "",
  // Base Sepolia
  84532: process.env.NEXT_PUBLIC_PORTFOLIO_REBALANCER_BASE_SEPOLIA || "",
} as const;

// Helper function to convert percentage to basis points
export function percentageToBasisPoints(percentage: number): bigint {
  return BigInt(Math.round(percentage * 100));
}

// Helper function to convert basis points to percentage
export function basisPointsToPercentage(basisPoints: bigint): number {
  return Number(basisPoints) / 100;
}

// Token addresses on Base Mainnet
export const BASE_TOKENS = {
  ETH: "0x0000000000000000000000000000000000000000",
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  cbBTC: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
} as const;

