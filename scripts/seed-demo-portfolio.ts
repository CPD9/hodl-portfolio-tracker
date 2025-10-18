/**
 * Demo Portfolio Seed Script
 * 
 * This script creates demo trading data for testing the portfolio feature.
 * Run with: npx ts-node scripts/seed-demo-portfolio.ts
 * 
 * Note: Replace 'DEMO_USER_ID' with an actual user ID from your database
 */

import Portfolio from '../database/models/portfolio.model';
import Transaction from '../database/models/transaction.model';
import UserBalance from '../database/models/user-balance.model';
import { connectToDatabase } from '../database/mongoose';

const DEMO_USER_ID = 'demo-user-123'; // Replace with actual user ID

async function seedDemoPortfolio() {
  try {
    await connectToDatabase();
    console.log('✅ Connected to database');

    // Clear existing demo data
    await Portfolio.deleteMany({ userId: DEMO_USER_ID });
    await Transaction.deleteMany({ userId: DEMO_USER_ID });
    await UserBalance.deleteOne({ userId: DEMO_USER_ID });
    console.log('🧹 Cleared existing demo data');

    // Create user balance
    const userBalance = await UserBalance.create({
      userId: DEMO_USER_ID,
      paperBalance: 75000, // $75k remaining after trades
      totalTrades: 8,
      successfulTrades: 6,
      winRate: 75,
      totalPnL: 5000,
    });
    console.log('💰 Created user balance');

    // Create demo portfolio positions
    const positions = [
      {
        userId: DEMO_USER_ID,
        symbol: 'AAPL',
        type: 'STOCK' as const,
        quantity: 50,
        avgPrice: 180.00,
        totalInvested: 9000,
        currentValue: 9500,
        pnl: 500,
        pnlPercentage: 5.56,
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'NVDA',
        type: 'STOCK' as const,
        quantity: 30,
        avgPrice: 450.00,
        totalInvested: 13500,
        currentValue: 15000,
        pnl: 1500,
        pnlPercentage: 11.11,
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'MSFT',
        type: 'STOCK' as const,
        quantity: 25,
        avgPrice: 380.00,
        totalInvested: 9500,
        currentValue: 10000,
        pnl: 500,
        pnlPercentage: 5.26,
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'TSLA',
        type: 'STOCK' as const,
        quantity: 20,
        avgPrice: 250.00,
        totalInvested: 5000,
        currentValue: 4800,
        pnl: -200,
        pnlPercentage: -4.00,
      },
    ];

    await Portfolio.insertMany(positions);
    console.log('📊 Created portfolio positions');

    // Create demo transactions
    const transactions = [
      {
        userId: DEMO_USER_ID,
        symbol: 'AAPL',
        type: 'STOCK' as const,
        action: 'BUY' as const,
        quantity: 50,
        price: 180.00,
        total: 9000,
        fee: 9,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'NVDA',
        type: 'STOCK' as const,
        action: 'BUY' as const,
        quantity: 30,
        price: 450.00,
        total: 13500,
        fee: 13.5,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'MSFT',
        type: 'STOCK' as const,
        action: 'BUY' as const,
        quantity: 25,
        price: 380.00,
        total: 9500,
        fee: 9.5,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'TSLA',
        type: 'STOCK' as const,
        action: 'BUY' as const,
        quantity: 20,
        price: 250.00,
        total: 5000,
        fee: 5,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'GOOGL',
        type: 'STOCK' as const,
        action: 'BUY' as const,
        quantity: 10,
        price: 140.00,
        total: 1400,
        fee: 1.4,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: DEMO_USER_ID,
        symbol: 'GOOGL',
        type: 'STOCK' as const,
        action: 'SELL' as const,
        quantity: 10,
        price: 145.00,
        total: 1450,
        fee: 1.45,
        status: 'COMPLETED' as const,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    await Transaction.insertMany(transactions);
    console.log('📝 Created transaction history');

    console.log('\n✅ Demo portfolio seeded successfully!');
    console.log(`User ID: ${DEMO_USER_ID}`);
    console.log(`Balance: $${userBalance.paperBalance.toLocaleString()}`);
    console.log(`Positions: ${positions.length}`);
    console.log(`Transactions: ${transactions.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo portfolio:', error);
    process.exit(1);
  }
}

seedDemoPortfolio();

