// Base Chain Types for HODL Portfolio Tracker
// START HACK 2025 - Team HODL

export interface BaseTokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  priceUSD?: number;
  valueUSD?: number;
}

export interface BaseTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  blockNumber: number;
  tokenTransfers?: BaseTokenTransfer[];
}

export interface BaseTokenTransfer {
  tokenAddress: string;
  from: string;
  to: string;
  value: string;
  symbol?: string;
  name?: string;
  decimals?: number;
}

export interface BaseDeFiPosition {
  protocol: string;
  type: 'liquidity' | 'lending' | 'borrowing' | 'staking';
  tokenAddress: string;
  amount: string;
  valueUSD: number;
  apy?: number;
  rewards?: BaseTokenBalance[];
}

export interface BasePortfolioSummary {
  totalValueUSD: number;
  tokenCount: number;
  defiPositions: BaseDeFiPosition[];
  recentTransactions: BaseTransaction[];
  gasSpentUSD: number;
  netWorthChange24h: number;
  netWorthChangePercentage: number;
}

export interface BaseNetworkInfo {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  isTestnet: boolean;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  network: BaseNetworkInfo;
  balance: BaseTokenBalance[];
}
