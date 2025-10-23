import { NextRequest, NextResponse } from 'next/server';

import Portfolio from '@/database/models/portfolio.model';
import { connectToDatabase } from '@/database/mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all portfolio positions for this user
    const holdings = await Portfolio.find({ userId });

    // Format holdings for response
    const formattedHoldings = holdings.map(holding => ({
      symbol: holding.symbol,
      type: holding.type,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      totalInvested: holding.totalInvested,
    }));

    return NextResponse.json({
      success: true,
      holdings: formattedHoldings,
    });
  } catch (error: any) {
    console.error('Get portfolio balance error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

