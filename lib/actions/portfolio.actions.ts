'use server';

import Portfolio from '@/database/models/portfolio.model';
import Transaction from '@/database/models/transaction.model';
import UserBalance from '@/database/models/user-balance.model';
import { connectToDatabase } from '@/database/mongoose';
import { getCryptoPrice } from './coingecko.actions';
import { getStockQuote } from './finnhub.actions';
import { serializeMongoObject } from '@/lib/utils';

export async function getPortfolioSummary(userId: string): Promise<{
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercentage: number;
  cashBalance: number;
  stats: any;
} | null> {
  try {
    await connectToDatabase();

    // Get user balance
    const userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      return {
        holdings: [],
        totalValue: 0,
        totalInvested: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        cashBalance: 100000,
        stats: {
          totalTrades: 0,
          successfulTrades: 0,
          winRate: 0,
          totalPnL: 0,
        },
      };
    }

    // Get all portfolio positions
    const positions = await Portfolio.find({ userId });

    // Update current values with latest prices
    const holdings: PortfolioHolding[] = await Promise.all(
      positions.map(async (position) => {
        let currentPrice = position.avgPrice;

        try {
          if (position.type === 'STOCK') {
            const quote = await getStockQuote(position.symbol);
            currentPrice = quote?.c || position.avgPrice;
          } else if (position.type === 'CRYPTO') {
            const price = await getCryptoPrice(position.symbol);
            currentPrice = price || position.avgPrice;
          }
        } catch (error) {
          console.error(`Error fetching price for ${position.symbol}:`, error);
        }

        const currentValue = position.quantity * currentPrice;
        const pnl = currentValue - position.totalInvested;
        const pnlPercentage = position.totalInvested > 0 
          ? (pnl / position.totalInvested) * 100 
          : 0;

        return {
          symbol: position.symbol,
          type: position.type,
          quantity: position.quantity,
          avgPrice: position.avgPrice,
          currentPrice,
          totalInvested: position.totalInvested,
          currentValue,
          pnl,
          pnlPercentage,
          lastUpdated: position.lastUpdated.toISOString(),
        };
      })
    );

    // Calculate totals
    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    const totalPnL = totalValue - totalInvested;
    const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return {
      holdings,
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercentage,
      cashBalance: userBalance.paperBalance,
      stats: {
        totalTrades: userBalance.totalTrades,
        successfulTrades: userBalance.successfulTrades,
        winRate: userBalance.winRate,
        totalPnL: userBalance.totalPnL,
        lastTradeDate: userBalance.lastTradeDate,
      },
    };
  } catch (error) {
    console.error('getPortfolioSummary error:', error);
    return null;
  }
}

export async function getTransactionHistory(
  userId: string,
  filter: 'ALL' | 'STOCK' | 'CRYPTO' = 'ALL',
  limit: number = 50
): Promise<TradeTransaction[]> {
  try {
    await connectToDatabase();

    const query: any = { userId };
    if (filter !== 'ALL') {
      query.type = filter;
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);

    return transactions.map((tx) => ({
      id: tx._id.toString(),
      symbol: tx.symbol,
      type: tx.type,
      action: tx.action,
      quantity: tx.quantity,
      price: tx.price,
      total: tx.total,
      fee: tx.fee,
      timestamp: tx.timestamp.toISOString(),
      txHash: tx.txHash,
      status: tx.status,
    }));
  } catch (error) {
    console.error('getTransactionHistory error:', error);
    return [];
  }
}

export async function getPerformanceMetrics(userId: string): Promise<{
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  bestTrade: any;
  worstTrade: any;
} | null> {
  try {
    await connectToDatabase();

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get transactions for each period
    const dailyTxs = await Transaction.find({
      userId,
      timestamp: { $gte: dayAgo },
      status: 'COMPLETED',
    });

    const weeklyTxs = await Transaction.find({
      userId,
      timestamp: { $gte: weekAgo },
      status: 'COMPLETED',
    });

    const monthlyTxs = await Transaction.find({
      userId,
      timestamp: { $gte: monthAgo },
      status: 'COMPLETED',
    });

    // Calculate P&L for each period (simplified)
    const calculatePnL = (transactions: any[]) => {
      return transactions.reduce((sum, tx) => {
        if (tx.action === 'SELL') {
          // For sells, add profit/loss
          return sum + tx.total;
        }
        return sum - tx.total;
      }, 0);
    };

    const dailyPnL = calculatePnL(dailyTxs);
    const weeklyPnL = calculatePnL(weeklyTxs);
    const monthlyPnL = calculatePnL(monthlyTxs);

    // Get best and worst trades
    const allTrades = await Transaction.find({
      userId,
      action: 'SELL',
      status: 'COMPLETED',
    }).sort({ total: -1 });

    const bestTrade = allTrades[0] ? serializeMongoObject(allTrades[0]) : null;
    const worstTrade = allTrades[allTrades.length - 1] 
      ? serializeMongoObject(allTrades[allTrades.length - 1]) 
      : null;

    return {
      dailyPnL,
      weeklyPnL,
      monthlyPnL,
      bestTrade,
      worstTrade,
    };
  } catch (error) {
    console.error('getPerformanceMetrics error:', error);
    return null;
  }
}

