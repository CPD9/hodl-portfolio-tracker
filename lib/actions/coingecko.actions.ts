
'use server';

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
    Accept: 'application/json',
  };

  if (COINGECKO_API_KEY) {
    (headers as any)['x-cg-demo-api-key'] = COINGECKO_API_KEY;
  }

  const response = await fetch(`${COINGECKO_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`CoinGecko API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// Resolve a symbol or name to a CoinGecko id dynamically using /search
async function resolveCoinGeckoId(symbolOrName: string): Promise<string | null> {
  try {
    const q = (symbolOrName || '').trim();
    if (!q) return null;
    const search = await fetchCoinGecko(`/search?query=${encodeURIComponent(q)}`);
    const coins: any[] = search?.coins || [];
    if (!Array.isArray(coins) || coins.length === 0) return null;
    const upper = q.toUpperCase();
    // Prefer exact symbol match, then exact name, else first result
    const bySymbol = coins.find((c) => (c?.symbol || '').toUpperCase() === upper);
    if (bySymbol?.id) return bySymbol.id as string;
    const byName = coins.find((c) => (c?.name || '').toUpperCase() === upper);
    if (byName?.id) return byName.id as string;
    return coins[0]?.id || null;
  } catch (e) {
    console.error('resolveCoinGeckoId error:', e);
    return null;
  }
}

export async function getCryptoPrice(symbol: string): Promise<number | null> {
  try {
    const coinId = await resolveCoinGeckoId(symbol);
    if (!coinId) return null;
    const data = await fetchCoinGecko(`/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=usd`);
    return data?.[coinId]?.usd ?? null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function getCryptoMarketData(symbol: string): Promise<CorrelatedCrypto | null> {
  try {
    const coinId = await resolveCoinGeckoId(symbol);
    if (!coinId) return null;
    const data = await fetchCoinGecko(
      `/coins/${encodeURIComponent(coinId)}?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    if (!data || !data.market_data) return null;

    return {
      symbol: symbol.toUpperCase(),
      name: data.name,
  price: data.market_data.current_price?.usd ?? null,
  change24h: data.market_data.price_change_percentage_24h ?? null,
  marketCap: data.market_data.market_cap?.usd ?? null,
      sector: data.categories?.[0] || '',
    };
  } catch (error) {
    console.error(`Error fetching market data for ${symbol}:`, error);
    return null;
  }
}

export async function getMultipleCryptoData(symbols: string[]): Promise<CorrelatedCrypto[]> {
  try {
    const idMap: Record<string, string> = {};
    await Promise.all(
      symbols.map(async (sym) => {
        const id = await resolveCoinGeckoId(sym);
        if (id) idMap[sym] = id;
      })
    );

    const ids = Object.values(idMap);
    if (ids.length === 0) return [];

    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids.join(','))}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!Array.isArray(data)) return [];

    return data
      .filter((coin: any) => coin?.current_price != null)
      .map((coin: any) => {
        const original = Object.keys(idMap).find((k) => idMap[k] === coin.id) || coin.symbol?.toUpperCase();
        return {
          symbol: (original || '').toUpperCase(),
          name: coin.name || 'Unknown',
          price: coin.current_price ?? null,
          change24h: coin.price_change_percentage_24h ?? null,
          marketCap: coin.market_cap ?? null,
          sector: coin.category || '',
        } as CorrelatedCrypto;
      });
  } catch (error) {
    console.error('Error fetching multiple crypto data:', error);
    return [];
  }
}

export async function getCryptoByCategory(category: string): Promise<CorrelatedCrypto[]> {
  try {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&category=${encodeURIComponent(category)}&order=market_cap_desc&per_page=5&sparkline=false&price_change_percentage=24h`
    );

    if (!Array.isArray(data)) return [];

    return data.map((coin: any) => ({
      symbol: (coin.symbol || '').toUpperCase(),
      name: coin.name,
      price: coin.current_price ?? null,
      change24h: coin.price_change_percentage_24h ?? null,
      marketCap: coin.market_cap ?? null,
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
    return data?.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error searching crypto:', error);
    return [];
  }
}

