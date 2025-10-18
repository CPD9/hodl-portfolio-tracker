'use server';

import { BASE_CONFIG, BASE_TOKENS } from '@/lib/base/config';
import {
  BasePortfolioSummary,
  BaseTokenBalance,
  BaseTransaction
} from '@/lib/base/types';

const ALCHEMY_BASE_URL = 'https://base-mainnet.g.alchemy.com/v2';

async function fetchAlchemy<T>(endpoint: string, body: any): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!apiKey) {
    throw new Error('Alchemy API key not found');
  }

  const response = await fetch(`${ALCHEMY_BASE_URL}/${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Alchemy API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || 'Alchemy API error');
  }

  return data.result;
}

export async function getTokenBalances(address: string): Promise<BaseTokenBalance[]> {
  try {
    const result = await fetchAlchemy('', {
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address],
      id: 1,
    });

    return formatTokenBalances(result.tokenBalances);
  } catch (error) {
    console.error('getTokenBalances error:', error);
    return [];
  }
}

export async function getRecentTransactions(address: string, limit: number = 10): Promise<BaseTransaction[]> {
  try {
    const result = await fetchAlchemy('', {
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromAddress: address,
        toAddress: address,
        category: ['erc20', 'external'],
        maxCount: limit,
        order: 'desc'
      }],
      id: 1,
    });

    return formatTransactions(result.transfers);
  } catch (error) {
    console.error('getRecentTransactions error:', error);
    return [];
  }
}

export async function getPortfolioSummary(address: string): Promise<BasePortfolioSummary> {
  try {
    const [balances, transactions] = await Promise.all([
      getTokenBalances(address),
      getRecentTransactions(address, 20)
    ]);

    const totalValueUSD = balances.reduce((sum, token) => sum + (token.valueUSD || 0), 0);
    const gasSpentUSD = calculateGasSpent(transactions);
    
    // Mock DeFi positions for now
    const defiPositions: any[] = [];

    return {
      totalValueUSD,
      tokenCount: balances.length,
      defiPositions,
      recentTransactions: transactions.slice(0, 10),
      gasSpentUSD,
      netWorthChange24h: 0,
      netWorthChangePercentage: 0,
    };
  } catch (error) {
    console.error('getPortfolioSummary error:', error);
    throw error;
  }
}

// Helper functions
function formatTokenBalances(tokenBalances: any[]): BaseTokenBalance[] {
  return tokenBalances
    .filter(token => token.tokenBalance !== '0x0')
    .map(token => {
      const tokenInfo = Object.values(BASE_TOKENS).find(
        t => t.address.toLowerCase() === token.contractAddress.toLowerCase()
      );
      
      return {
        address: token.contractAddress,
        symbol: tokenInfo?.symbol || 'UNKNOWN',
        name: tokenInfo?.name || 'Unknown Token',
        balance: token.tokenBalance,
        decimals: tokenInfo?.decimals || 18,
        priceUSD: 0,
        valueUSD: 0,
      };
    });
}

function formatTransactions(transfers: any[]): BaseTransaction[] {
  return transfers.map(transfer => ({
    hash: transfer.hash,
    from: transfer.from,
    to: transfer.to,
    value: transfer.value || '0',
    gasUsed: transfer.gasUsed || '0',
    gasPrice: transfer.gasPrice || '0',
    timestamp: parseInt(transfer.blockNum, 16) * 1000,
    blockNumber: parseInt(transfer.blockNum, 16),
    tokenTransfers: transfer.tokenTransfers || [],
  }));
}

function calculateGasSpent(transactions: BaseTransaction[]): number {
  return transactions.reduce((total, tx) => {
    const gasUsed = parseInt(tx.gasUsed, 16);
    const gasPrice = parseInt(tx.gasPrice, 16);
    const gasCost = gasUsed * gasPrice;
    return total + (gasCost / 1e18) * 2000; // Assuming $2000 ETH
  }, 0);
}
