import { NextRequest, NextResponse } from 'next/server';

import Portfolio from '@/database/models/portfolio.model';
import Transaction from '@/database/models/transaction.model';
import UserBalance from '@/database/models/user-balance.model';
import { connectToDatabase } from '@/database/mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      userId,
      fromSymbol,
      toSymbol,
      fromAmount,
      toAmount,
      fromType,
      toType,
      exchangeRate,
    } = body;

    // Validation
    if (!userId || !fromSymbol || !toSymbol || !fromAmount || !toAmount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user balance
    const userBalance = await UserBalance.findOne({ userId });
    if (!userBalance) {
      return NextResponse.json(
        { success: false, message: 'User balance not found' },
        { status: 404 }
      );
    }

    // Check if user has enough of the "from" asset
    const fromPosition = await Portfolio.findOne({ userId, symbol: fromSymbol });
    
    if (!fromPosition || fromPosition.quantity < fromAmount) {
      // If they don't have the asset, they can only buy (use cash)
      // For paper trading, let's allow this if they have enough cash
      const requiredCash = fromAmount; // In paper trading, 1:1 for simplicity
      
      if (userBalance.paperBalance < requiredCash) {
        return NextResponse.json(
          { success: false, message: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // Deduct cash
      userBalance.paperBalance -= requiredCash;
    } else {
      // They have the asset, reduce their position
      fromPosition.quantity -= fromAmount;
      fromPosition.totalInvested -= fromAmount * fromPosition.avgPrice;
      
      if (fromPosition.quantity <= 0) {
        // Remove position if quantity is 0
        await Portfolio.deleteOne({ _id: fromPosition._id });
      } else {
        await fromPosition.save();
      }
    }

    // Add or update the "to" asset position
    let toPosition = await Portfolio.findOne({ userId, symbol: toSymbol });
    
    if (!toPosition) {
      // Create new position
      toPosition = await Portfolio.create({
        userId,
        symbol: toSymbol,
        type: toType.toUpperCase(),
        quantity: toAmount,
        avgPrice: 1, // Will be updated based on real price
        totalInvested: toAmount,
        currentValue: toAmount,
        lastUpdated: new Date(),
      });
    } else {
      // Update existing position
      const newQuantity = toPosition.quantity + toAmount;
      const newInvested = toPosition.totalInvested + toAmount;
      toPosition.quantity = newQuantity;
      toPosition.totalInvested = newInvested;
      toPosition.avgPrice = newInvested / newQuantity;
      toPosition.lastUpdated = new Date();
      await toPosition.save();
    }

    // Update user balance stats
    userBalance.totalTrades += 1;
    await userBalance.save();

    // Record transaction
    await Transaction.create({
      userId,
      symbol: toSymbol,
      type: toType.toUpperCase(),
      action: 'SWAP',
      quantity: toAmount,
      price: 1,
      total: toAmount,
      fee: 0,
      timestamp: new Date(),
      status: 'COMPLETED',
      metadata: {
        swapFrom: fromSymbol,
        swapFromAmount: fromAmount,
        exchangeRate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Swap executed successfully',
      data: {
        fromSymbol,
        toSymbol,
        fromAmount,
        toAmount,
        exchangeRate,
      },
    });
  } catch (error: any) {
    console.error('Swap execution error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

