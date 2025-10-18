'use server';

import { getCorrelatedCryptoSymbols, getCryptoName, getSectorDescription, getStockSector } from '@/lib/services/sector-correlation';

import { getMultipleCryptoData } from './coingecko.actions';

export async function getCorrelatedCrypto(stockSymbol: string): Promise<{
  sector: string | null;
  sectorDescription: string;
  cryptos: CorrelatedCrypto[];
}> {
  try {
    const sector = getStockSector(stockSymbol);
    
    if (!sector) {
      return {
        sector: null,
        sectorDescription: 'No sector mapping found',
        cryptos: [],
      };
    }

    const cryptoSymbols = getCorrelatedCryptoSymbols(stockSymbol);
    
    if (!cryptoSymbols || cryptoSymbols.length === 0) {
      return {
        sector,
        sectorDescription: getSectorDescription(sector),
        cryptos: [],
      };
    }

    // Fetch market data for all correlated cryptos
    const cryptos = await getMultipleCryptoData(cryptoSymbols);

    // Fill in any missing data with fallback
    const result = cryptoSymbols.map(symbol => {
      const existingData = cryptos.find(c => c.symbol === symbol);
      if (existingData) return existingData;

      // Fallback if API fails
      return {
        symbol: symbol.toUpperCase(),
        name: getCryptoName(symbol),
        price: 0,
        change24h: 0,
        marketCap: 0,
        sector: getSectorDescription(sector),
      };
    });

    return {
      sector,
      sectorDescription: getSectorDescription(sector),
      cryptos: result.slice(0, 5), // Return top 5
    };
  } catch (error) {
    console.error('getCorrelatedCrypto error:', error);
    return {
      sector: null,
      sectorDescription: 'Error fetching data',
      cryptos: [],
    };
  }
}

export async function getStockCryptoComparison(stockSymbol: string): Promise<{
  stockSymbol: string;
  sector: string | null;
  comparisonSymbols: string[];
}> {
  const sector = getStockSector(stockSymbol);
  const cryptoSymbols = getCorrelatedCryptoSymbols(stockSymbol) || [];

  // Format symbols for TradingView comparison
  // TradingView uses format like "BINANCE:BTCUSD" for crypto
  const comparisonSymbols = cryptoSymbols
    .slice(0, 3) // Limit to 3 for better visualization
    .map(symbol => `BINANCE:${symbol}USD`);

  return {
    stockSymbol,
    sector,
    comparisonSymbols,
  };
}

