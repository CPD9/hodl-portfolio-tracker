'use server';

import { getCoinGeckoId } from '@/lib/services/sector-correlation';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';

// Cache for API responses (in-memory cache, simple implementation)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

async function fetchCoinGecko(endpoint: string): Promise<any> {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
  }

  try {
    const response = await fetch(`${COINGECKO_API_BASE}${endpoint}`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw error;
  }
}

export async function getCryptoPrice(symbol: string): Promise<number | null> {
  try {
    const coinId = getCoinGeckoId(symbol);
    const data = await fetchCoinGecko(`/simple/price?ids=${coinId}&vs_currencies=usd`);
    
    return data[coinId]?.usd || null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function getCryptoMarketData(symbol: string): Promise<CorrelatedCrypto | null> {
  try {
    const coinId = getCoinGeckoId(symbol);
    const data = await fetchCoinGecko(
      `/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    if (!data || !data.market_data) return null;

    return {
      symbol: symbol.toUpperCase(),
      name: data.name,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h || 0,
      marketCap: data.market_data.market_cap.usd || 0,
      sector: data.categories?.[0] || '',
    };
  } catch (error) {
    console.error(`Error fetching market data for ${symbol}:`, error);
    return null;
  }
}

export async function getMultipleCryptoData(symbols: string[]): Promise<CorrelatedCrypto[]> {
  try {
    const coinIds = symbols.map(s => getCoinGeckoId(s)).join(',');
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((coin: any) => coin.current_price !== null && coin.current_price !== undefined)
      .map((coin: any) => ({
        symbol: symbols.find(s => getCoinGeckoId(s) === coin.id)?.toUpperCase() || coin.symbol.toUpperCase(),
        name: coin.name || 'Unknown',
        price: coin.current_price || 0,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap || 0,
        sector: coin.category || '',
      }));
  } catch (error) {
    console.error('Error fetching multiple crypto data:', error);
    return [];
  }
}

export async function getCryptoByCategory(category: string): Promise<CorrelatedCrypto[]> {
  try {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&per_page=5&sparkline=false&price_change_percentage=24h`
    );

    if (!data || !Array.isArray(data)) return [];

    return data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap || 0,
      sector: category,
    }));
  } catch (error) {
    console.error(`Error fetching crypto by category ${category}:`, error);
    return [];
  }
}

export async function searchCrypto(query: string): Promise<any[]> {
  try {
    const data = await fetchCoinGecko(`/search?query=${encodeURIComponent(query)}`);
    
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error searching crypto:', error);
    return [];
  }
}

