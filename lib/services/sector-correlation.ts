// Sector mapping for stocks to crypto correlation
export const STOCK_SECTOR_MAP: Record<string, string> = {
  // Technology - AI/Computing
  NVDA: 'AI',
  AMD: 'AI',
  INTC: 'AI',
  GOOGL: 'AI',
  MSFT: 'AI',
  META: 'AI',
  
  // Technology - General
  AAPL: 'TECH',
  TSLA: 'TECH',
  NFLX: 'TECH',
  
  // Finance
  JPM: 'FINANCE',
  BAC: 'FINANCE',
  GS: 'FINANCE',
  MS: 'FINANCE',
  WFC: 'FINANCE',
  C: 'FINANCE',
  
  // Gaming
  RBLX: 'GAMING',
  EA: 'GAMING',
  ATVI: 'GAMING',
  TTWO: 'GAMING',
  
  // Real Estate
  AMT: 'REAL_ESTATE',
  PLD: 'REAL_ESTATE',
  CCI: 'REAL_ESTATE',
  
  // Media/Entertainment
  DIS: 'MEDIA',
  NFLX: 'MEDIA',
  SPOT: 'MEDIA',
};

// Crypto tokens mapped to sectors
export const SECTOR_CRYPTO_MAP: Record<string, string[]> = {
  AI: [
    'FET',    // Fetch.ai
    'AGIX',   // SingularityNET
    'RNDR',   // Render
    'GRT',    // The Graph
    'OCEAN',  // Ocean Protocol
  ],
  TECH: [
    'BTC',    // Bitcoin
    'ETH',    // Ethereum
    'SOL',    // Solana
    'AVAX',   // Avalanche
    'MATIC',  // Polygon
  ],
  FINANCE: [
    'AAVE',   // Aave
    'UNI',    // Uniswap
    'COMP',   // Compound
    'MKR',    // Maker
    'SNX',    // Synthetix
  ],
  GAMING: [
    'AXS',    // Axie Infinity
    'SAND',   // The Sandbox
    'MANA',   // Decentraland
    'ENJ',    // Enjin
    'IMX',    // Immutable X
  ],
  REAL_ESTATE: [
    'LAND',   // LandWorks
    'REAL',   // RealT
    'PROPS',  // Props
  ],
  MEDIA: [
    'AUDIO',  // Audius
    'THETA',  // Theta
    'LPT',    // Livepeer
    'CHZ',    // Chiliz
  ],
};

// Crypto name mapping
export const CRYPTO_NAMES: Record<string, string> = {
  FET: 'Fetch.ai',
  AGIX: 'SingularityNET',
  RNDR: 'Render Token',
  GRT: 'The Graph',
  OCEAN: 'Ocean Protocol',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  AVAX: 'Avalanche',
  MATIC: 'Polygon',
  AAVE: 'Aave',
  UNI: 'Uniswap',
  COMP: 'Compound',
  MKR: 'Maker',
  SNX: 'Synthetix',
  AXS: 'Axie Infinity',
  SAND: 'The Sandbox',
  MANA: 'Decentraland',
  ENJ: 'Enjin Coin',
  IMX: 'Immutable X',
  LAND: 'LandWorks',
  REAL: 'RealT',
  PROPS: 'Props Token',
  AUDIO: 'Audius',
  THETA: 'Theta Network',
  LPT: 'Livepeer',
  CHZ: 'Chiliz',
};

// CoinGecko ID mapping (some symbols differ on CoinGecko)
export const COINGECKO_ID_MAP: Record<string, string> = {
  FET: 'fetch-ai',
  AGIX: 'singularitynet',
  RNDR: 'render-token',
  GRT: 'the-graph',
  OCEAN: 'ocean-protocol',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  AAVE: 'aave',
  UNI: 'uniswap',
  COMP: 'compound-governance-token',
  MKR: 'maker',
  SNX: 'havven',
  AXS: 'axie-infinity',
  SAND: 'the-sandbox',
  MANA: 'decentraland',
  ENJ: 'enjincoin',
  IMX: 'immutable-x',
  AUDIO: 'audius',
  THETA: 'theta-token',
  LPT: 'livepeer',
  CHZ: 'chiliz',
};

export function getStockSector(symbol: string): string | null {
  return STOCK_SECTOR_MAP[symbol.toUpperCase()] || null;
}

export function getCorrelatedCryptoSymbols(stockSymbol: string): string[] | null {
  const sector = getStockSector(stockSymbol);
  if (!sector) return null;
  
  return SECTOR_CRYPTO_MAP[sector] || null;
}

export function getCryptoName(symbol: string): string {
  return CRYPTO_NAMES[symbol.toUpperCase()] || symbol;
}

export function getCoinGeckoId(symbol: string): string {
  return COINGECKO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
}

export function getSectorDescription(sector: string): string {
  const descriptions: Record<string, string> = {
    AI: 'Artificial Intelligence & Machine Learning',
    TECH: 'Technology & Infrastructure',
    FINANCE: 'Decentralized Finance (DeFi)',
    GAMING: 'Gaming & Metaverse',
    REAL_ESTATE: 'Real Estate & Property',
    MEDIA: 'Media & Entertainment',
  };
  
  return descriptions[sector] || sector;
}

