'use server';

import { Watchlist } from '@/database/models/watchlist.model';
import { connectToDatabase } from '@/database/mongoose';
import { serializeMongoObject } from '@/lib/utils';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getWatchlistByUserId(userId: string): Promise<any[]> {
  if (!userId) return [];

  try {
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    // Serialize MongoDB objects to plain objects
    return items.map(item => serializeMongoObject(item));
  } catch (err) {
    console.error('getWatchlistByUserId error:', err);
    return [];
  }
}

export async function addToWatchlist(userId: string, symbol: string, company: string): Promise<{ success: boolean; message: string }> {
  if (!userId || !symbol || !company) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    // Check if already exists
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return { success: false, message: 'Stock already in watchlist' };
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, message: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<{ success: boolean; message: string }> {
  if (!userId || !symbol) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    
    if (result.deletedCount === 0) {
      return { success: false, message: 'Stock not found in watchlist' };
    }

    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, message: 'Failed to remove from watchlist' };
  }
}

export async function isInWatchlist(userId: string, symbol: string): Promise<boolean> {
  if (!userId || !symbol) return false;

  try {
    const item = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    return !!item;
  } catch (err) {
    console.error('isInWatchlist error:', err);
    return false;
  }
}

export async function triggerDailyNewsSummary(userId: string): Promise<{ success: boolean; message: string }> {
  if (!userId) {
    return { success: false, message: 'User not authenticated' };
  }

  try {
    // Call our API endpoint which will trigger the Inngest event
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/trigger-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to trigger news summary');
    }

    return { success: true, message: data.message };
  } catch (err) {
    console.error('triggerDailyNewsSummary error:', err);
    return { 
      success: false, 
      message: err instanceof Error ? err.message : 'Failed to trigger news summary. Make sure Inngest dev server is running.' 
    };
  }
}

export async function exportWatchlistToCSV(watchlist: StockWithData[]): Promise<string> {
  const headers = ['Symbol', 'Company', 'Price', 'Change', 'Change %', 'Market Cap', 'P/E Ratio'];
  const rows = watchlist.map(stock => [
    stock.symbol,
    stock.company,
    stock.currentPrice?.toFixed(2) || 'N/A',
    stock.change?.toFixed(2) || 'N/A',
    stock.changePercent?.toFixed(2) || 'N/A',
    stock.marketCap?.toString() || 'N/A',
    stock.pe?.toFixed(2) || 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}
