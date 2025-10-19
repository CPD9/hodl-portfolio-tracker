'use server';

import { connectToDatabase } from "@/database/mongoose";
import Portfolio from "@/database/models/portfolio.model";
import Transaction from "@/database/models/transaction.model";
import UserBalance from "@/database/models/user-balance.model";
import { getCryptoPrice } from "./coingecko.actions";

interface TradeResult {
  success: boolean;
  message: string;
}

/**
 * Buy cryptocurrency - simulated paper trading on Base network
 */
export async function buyCrypto(
  userId: string,
  symbol: string,
  quantity: number
): Promise<TradeResult> {
  try {
    await connectToDatabase();

    // Get current price
    const currentPrice = await getCryptoPrice(symbol.toLowerCase());
    
    if (!currentPrice) {
      return {
        success: false,
        message: 'Failed to fetch crypto price',
      };
    }

    const totalCost = currentPrice * quantity;
    const fee = totalCost * 0.003; // 0.3% network fee
    const totalWithFee = totalCost + fee;

    // Check user balance
    let userBalance = await UserBalance.findOne({ userId });
    
    if (!userBalance) {
      // Create new balance for user
      userBalance = await UserBalance.create({
        userId,
        paperBalance: 100000, // Start with $100k
      });
    }
    
    if (userBalance.paperBalance < totalWithFee) {
      return {
        success: false,
        message: 'Insufficient balance',
      };
    }

    // Update or create portfolio holding
    const existingHolding = await Portfolio.findOne({ 
      userId, 
      symbol: symbol.toUpperCase(), 
      type: 'CRYPTO' 
    });

    if (existingHolding) {
      // Update existing position
      const newTotalQuantity = existingHolding.quantity + quantity;
      const newTotalInvested = existingHolding.totalInvested + totalCost;
      const newAvgPrice = newTotalInvested / newTotalQuantity;
      const newCurrentValue = newTotalQuantity * currentPrice;
      const newPnl = newCurrentValue - newTotalInvested;
      const newPnlPercentage = (newPnl / newTotalInvested) * 100;

      existingHolding.quantity = newTotalQuantity;
      existingHolding.avgPrice = newAvgPrice;
      existingHolding.totalInvested = newTotalInvested;
      existingHolding.currentValue = newCurrentValue;
      existingHolding.pnl = newPnl;
      existingHolding.pnlPercentage = newPnlPercentage;
      existingHolding.lastUpdated = new Date();
      await existingHolding.save();
    } else {
      // Create new position
      await Portfolio.create({
        userId,
        symbol: symbol.toUpperCase(),
        quantity,
        avgPrice: currentPrice,
        totalInvested: totalCost,
        currentValue: quantity * currentPrice,
        pnl: 0,
        pnlPercentage: 0,
        type: 'CRYPTO',
        lastUpdated: new Date(),
      });
    }

    // Update user balance
    userBalance.paperBalance -= totalWithFee;
    userBalance.totalTrades = (userBalance.totalTrades || 0) + 1;
    userBalance.lastTradeDate = new Date();
    await userBalance.save();

    // Record transaction
    await Transaction.create({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'CRYPTO',
      action: 'BUY',
      quantity,
      price: currentPrice,
      total: totalWithFee,
      fee,
      status: 'COMPLETED',
      timestamp: new Date(),
    });

    return {
      success: true,
      message: `Successfully bought ${quantity.toFixed(8)} ${symbol} on Base network`,
    };
  } catch (error) {
    console.error('Buy crypto error:', error);
    return {
      success: false,
      message: 'Failed to execute buy order',
    };
  }
}

/**
 * Sell cryptocurrency - simulated paper trading on Base network
 */
export async function sellCrypto(
  userId: string,
  symbol: string,
  quantity: number
): Promise<TradeResult> {
  try {
    await connectToDatabase();

    // Check if user has the crypto
    const holding = await Portfolio.findOne({ 
      userId, 
      symbol: symbol.toUpperCase(), 
      type: 'CRYPTO' 
    });

    if (!holding || holding.quantity < quantity) {
      return {
        success: false,
        message: 'Insufficient crypto balance',
      };
    }

    // Get current price
    const currentPrice = await getCryptoPrice(symbol.toLowerCase());
    
    if (!currentPrice) {
      return {
        success: false,
        message: 'Failed to fetch crypto price',
      };
    }

    const totalValue = currentPrice * quantity;
    const fee = totalValue * 0.003; // 0.3% network fee
    const proceeds = totalValue - fee;

    // Update user balance
    const userBalance = await UserBalance.findOne({ userId });
    
    if (!userBalance) {
      return {
        success: false,
        message: 'User balance not found',
      };
    }

    userBalance.paperBalance += proceeds;
    userBalance.totalTrades = (userBalance.totalTrades || 0) + 1;
    userBalance.lastTradeDate = new Date();
    
    // Calculate if this trade was profitable
    const costBasis = holding.avgPrice * quantity;
    const profit = proceeds - costBasis;
    if (profit > 0) {
      userBalance.successfulTrades = (userBalance.successfulTrades || 0) + 1;
    }
    userBalance.winRate = ((userBalance.successfulTrades || 0) / (userBalance.totalTrades || 1)) * 100;
    userBalance.totalPnL = (userBalance.totalPnL || 0) + profit;
    
    await userBalance.save();

    // Record transaction
    await Transaction.create({
      userId,
      symbol: symbol.toUpperCase(),
      type: 'CRYPTO',
      action: 'SELL',
      quantity,
      price: currentPrice,
      total: proceeds,
      fee,
      status: 'COMPLETED',
      timestamp: new Date(),
    });

    // Update portfolio holding
    if (holding.quantity === quantity) {
      // Sell all - remove from portfolio
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      // Partial sell
      const remainingQuantity = holding.quantity - quantity;
      const remainingInvested = holding.totalInvested * (remainingQuantity / holding.quantity);
      const newCurrentValue = remainingQuantity * currentPrice;
      const newPnl = newCurrentValue - remainingInvested;
      const newPnlPercentage = (newPnl / remainingInvested) * 100;

      holding.quantity = remainingQuantity;
      holding.totalInvested = remainingInvested;
      holding.currentValue = newCurrentValue;
      holding.pnl = newPnl;
      holding.pnlPercentage = newPnlPercentage;
      holding.lastUpdated = new Date();
      await holding.save();
    }

    return {
      success: true,
      message: `Successfully sold ${quantity.toFixed(8)} ${symbol} on Base network`,
    };
  } catch (error) {
    console.error('Sell crypto error:', error);
    return {
      success: false,
      message: 'Failed to execute sell order',
    };
  }
}

/**
 * Get user's crypto position
 */
export async function getUserCryptoPosition(userId: string, symbol: string) {
  try {
    await connectToDatabase();

    const holding = await Portfolio.findOne({ 
      userId, 
      symbol: symbol.toUpperCase(), 
      type: 'CRYPTO' 
    });

    if (!holding) {
      return null;
    }

    // Get current price
    const currentPrice = await getCryptoPrice(symbol.toLowerCase());
    
    if (!currentPrice) {
      return null;
    }

    const currentValue = holding.quantity * currentPrice;
    const pnl = currentValue - holding.totalInvested;
    const pnlPercentage = (pnl / holding.totalInvested) * 100;

    return {
      symbol: holding.symbol,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      currentPrice,
      totalInvested: holding.totalInvested,
      currentValue,
      pnl,
      pnlPercentage,
      type: 'CRYPTO',
      lastUpdated: holding.lastUpdated.toISOString(),
    };
  } catch (error) {
    console.error('Get crypto position error:', error);
    return null;
  }
}
