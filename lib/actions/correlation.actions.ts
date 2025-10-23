'use server';

import { findCorrelatedCryptos, findCorrelatedCryptosWithScores, getStockIndustry } from '@/lib/services/crypto-correlation-algorithm';
import { getMultipleCryptoData } from './coingecko.actions';
import { getCryptoName } from '@/lib/services/sector-correlation';

export async function getCorrelatedCrypto(stockSymbol: string): Promise<{
  sector: string | null;
  sectorDescription: string;
  cryptos: CorrelatedCrypto[];
}> {
  try {
    // Step 1: Get stock industry information
    const industry = await getStockIndustry(stockSymbol);
    
    // Step 2: Use AI algorithm to find correlated cryptos
    const correlated = await findCorrelatedCryptosWithScores(
      stockSymbol,
      industry,
      undefined,
      10
    );

    if (!correlated || correlated.length === 0) {
      return {
        sector: industry || null,
        sectorDescription: industry ? `${industry} sector` : 'No industry mapping found',
        cryptos: [],
      };
    }

    // Step 3: Fetch market data for all correlated cryptos
    const symbols = correlated.map((c) => c.symbol);
    const cryptos = await getMultipleCryptoData(symbols);

    // Step 4: Fill in any missing data with fallback
    const result = symbols.map(symbol => {
      const existingData = cryptos.find(c => c.symbol === symbol);
      if (existingData) {
        const corr = correlated.find((c) => c.symbol === symbol)?.correlation ?? 0;
        return { ...existingData, correlation: corr } as CorrelatedCrypto;
      }

      // Fallback if API fails
      return {
        symbol: symbol.toUpperCase(),
        name: getCryptoName(symbol),
        price: 0,
        change24h: 0,
        marketCap: 0,
        sector: industry || 'Technology',
        correlation: correlated.find((c) => c.symbol === symbol)?.correlation ?? 0,
      };
    });

    return {
      sector: industry || null,
      sectorDescription: industry 
        ? `Cryptocurrencies correlated with ${stockSymbol} (${industry} sector)`
        : `Cryptocurrencies correlated with ${stockSymbol}`,
      cryptos: result.slice(0, 10), // Ensure max 10
    };
  } catch (error) {
    console.error('getCorrelatedCrypto error:', error);
    return {
      sector: null,
      sectorDescription: 'Error fetching correlation data',
      cryptos: [],
    };
  }
}

export async function getStockCryptoComparison(stockSymbol: string): Promise<{
  stockSymbol: string;
  sector: string | null;
  comparisonSymbols: string[];
}> {
  try {
    const industry = await getStockIndustry(stockSymbol);
    const cryptoSymbols = await findCorrelatedCryptos(stockSymbol, industry, undefined, 3);

    // Format symbols for TradingView comparison
    // TradingView uses format like "BINANCE:BTCUSD" for crypto
    const comparisonSymbols = cryptoSymbols.map((symbol: string) => `BINANCE:${symbol}USD`);

    return {
      stockSymbol,
      sector: industry || null,
      comparisonSymbols,
    };
  } catch (error) {
    console.error('getStockCryptoComparison error:', error);
    return {
      stockSymbol,
      sector: null,
      comparisonSymbols: [],
    };
  }
}

