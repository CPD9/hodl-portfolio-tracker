'use server';

import Portfolio from '@/database/models/portfolio.model';
import Transaction from '@/database/models/transaction.model';
import UserBalance from '@/database/models/user-balance.model';
import { connectToDatabase } from '@/database/mongoose';
import { getStockQuote } from './finnhub.actions';

export async function buyStock(
  userId: string,
  symbol: string,
  quantity: number
): Promise<{ success: boolean; message: string; transaction?: any }> {
  if (!userId || !symbol || quantity <= 0) {
    return { success: false, message: 'Invalid parameters' };
  }

  try {
    await connectToDatabase();

    // Get current stock price
    const quote = await getStockQuote(symbol);
    if (!quote || !quote.c) {
      return { success: false, message: 'Unable to fetch stock price' };
    }

    const price = quote.c;
    const total = price * quantity;
    const fee = total * 0.001; // 0.1% trading fee
    const totalCost = total + fee;

    // Check user balance
    let userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      // Create new balance for user
      userBalance = await UserBalance.create({
        userId,
        paperBalance: 100000, // Start with $100k
      });
    }

    if (userBalance.paperBalance < totalCost) {
      return { success: false, message: 'Insufficient funds' };
    }

    // Update user balance
    userBalance.paperBalance -= totalCost;
    userBalance.totalTrades += 1;
    userBalance.lastTradeDate = new Date();
    await userBalance.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'STOCK',
      action: 'BUY',
      quantity,
      price,
      total: totalCost,
      fee,
      status: 'COMPLETED',
      timestamp: new Date(),
    });

    // Update or create portfolio position
    const existingPosition = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'STOCK',
    });

    if (existingPosition) {
      // Update existing position - calculate new average price
      const totalQuantity = existingPosition.quantity + quantity;
      const totalInvested = existingPosition.totalInvested + totalCost;
      const newAvgPrice = totalInvested / totalQuantity;

      existingPosition.quantity = totalQuantity;
      existingPosition.avgPrice = newAvgPrice;
      existingPosition.totalInvested = totalInvested;
      existingPosition.currentValue = totalQuantity * price;
      existingPosition.pnl = existingPosition.currentValue - existingPosition.totalInvested;
      existingPosition.pnlPercentage = (existingPosition.pnl / existingPosition.totalInvested) * 100;
      existingPosition.lastUpdated = new Date();
      await existingPosition.save();
    } else {
      // Create new position
      await Portfolio.create({
        userId,
        symbol: symbol.toUpperCase(),
        type: 'STOCK',
        quantity,
        avgPrice: price,
        totalInvested: totalCost,
        currentValue: quantity * price,
        pnl: 0,
        pnlPercentage: 0,
        lastUpdated: new Date(),
      });
    }

    return {
      success: true,
      message: `Successfully bought ${quantity} shares of ${symbol}`,
      transaction: {
        id: transaction._id.toString(),
        symbol: transaction.symbol,
        quantity: transaction.quantity,
        price: transaction.price,
        total: transaction.total,
      },
    };
  } catch (error) {
    console.error('buyStock error:', error);
    return { success: false, message: 'Failed to execute buy order' };
  }
}

export async function sellStock(
  userId: string,
  symbol: string,
  quantity: number
): Promise<{ success: boolean; message: string; transaction?: any }> {
  if (!userId || !symbol || quantity <= 0) {
    return { success: false, message: 'Invalid parameters' };
  }

  try {
    await connectToDatabase();

    // Check if user has the position
    const position = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'STOCK',
    });

    if (!position) {
      return { success: false, message: 'You do not own this stock' };
    }

    if (position.quantity < quantity) {
      return { success: false, message: `Insufficient shares. You own ${position.quantity} shares` };
    }

    // Get current stock price
    const quote = await getStockQuote(symbol);
    if (!quote || !quote.c) {
      return { success: false, message: 'Unable to fetch stock price' };
    }

    const price = quote.c;
    const total = price * quantity;
    const fee = total * 0.001; // 0.1% trading fee
    const proceeds = total - fee;

    // Update user balance
    const userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      return { success: false, message: 'User balance not found' };
    }

    userBalance.paperBalance += proceeds;
    userBalance.totalTrades += 1;
    userBalance.lastTradeDate = new Date();

    // Calculate if this trade was profitable
    const costBasis = position.avgPrice * quantity;
    const profit = proceeds - costBasis;
    if (profit > 0) {
      userBalance.successfulTrades += 1;
    }
    userBalance.winRate = (userBalance.successfulTrades / userBalance.totalTrades) * 100;
    userBalance.totalPnL += profit;

    await userBalance.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'STOCK',
      action: 'SELL',
      quantity,
      price,
      total: proceeds,
      fee,
      status: 'COMPLETED',
      timestamp: new Date(),
    });

    // Update portfolio position
    if (position.quantity === quantity) {
      // Sold entire position
      await Portfolio.deleteOne({ _id: position._id });
    } else {
      // Partial sell
      const remainingQuantity = position.quantity - quantity;
      const remainingInvested = position.totalInvested * (remainingQuantity / position.quantity);

      position.quantity = remainingQuantity;
      position.totalInvested = remainingInvested;
      position.currentValue = remainingQuantity * price;
      position.pnl = position.currentValue - position.totalInvested;
      position.pnlPercentage = (position.pnl / position.totalInvested) * 100;
      position.lastUpdated = new Date();
      await position.save();
    }

    return {
      success: true,
      message: `Successfully sold ${quantity} shares of ${symbol}`,
      transaction: {
        id: transaction._id.toString(),
        symbol: transaction.symbol,
        quantity: transaction.quantity,
        price: transaction.price,
        total: transaction.total,
        profit: profit.toFixed(2),
      },
    };
  } catch (error) {
    console.error('sellStock error:', error);
    return { success: false, message: 'Failed to execute sell order' };
  }
}

export async function getUserBalance(userId: string): Promise<{ balance: number; stats: any } | null> {
  try {
    await connectToDatabase();

    let userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      // Create new balance for user
      userBalance = await UserBalance.create({
        userId,
        paperBalance: 100000,
      });
    }

    return {
      balance: userBalance.paperBalance,
      stats: {
        totalTrades: userBalance.totalTrades,
        successfulTrades: userBalance.successfulTrades,
        winRate: userBalance.winRate,
        totalPnL: userBalance.totalPnL,
        lastTradeDate: userBalance.lastTradeDate,
      },
    };
  } catch (error) {
    console.error('getUserBalance error:', error);
    return null;
  }
}

export async function getUserPosition(
  userId: string,
  symbol: string
): Promise<PortfolioHolding | null> {
  try {
    await connectToDatabase();

    const position = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'STOCK',
    });

    if (!position) return null;

    // Get current price
    const quote = await getStockQuote(symbol);
    const currentPrice = quote?.c || position.avgPrice;

    const currentValue = position.quantity * currentPrice;
    const pnl = currentValue - position.totalInvested;
    const pnlPercentage = (pnl / position.totalInvested) * 100;

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
  } catch (error) {
    console.error('getUserPosition error:', error);
    return null;
  }
}

