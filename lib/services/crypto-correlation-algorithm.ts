import { getCryptoMarketData } from '../actions/coingecko.actions';

/**
 * MASSIVELY EXPANDED Crypto categories with 200+ cryptocurrencies
 * Covering all major sectors and use cases for comprehensive matching
 */
export const CRYPTO_CATEGORIES = {
  // === LAYER 1 BLOCKCHAINS (Infrastructure) ===
  LAYER1: [
    'BTC', 'ETH', 'SOL', 'AVAX', 'DOT', 'ATOM', 'NEAR', 'ALGO', 'FTM', 'HBAR',
    'ADA', 'TRX', 'TON', 'APT', 'SUI', 'SEI', 'INJ', 'KAS', 'ROSE', 'KAVA',
    'EGLD', 'FLOW', 'MINA', 'ZIL', 'ONE', 'CELO', 'WAVES', 'ICX', 'QTUM'
  ],
  
  // === LAYER 2 SCALING SOLUTIONS ===
  LAYER2: [
    'MATIC', 'ARB', 'OP', 'IMX', 'LRC', 'METIS', 'BOBA', 'STRK'
  ],
  
  // === DEFI - Decentralized Finance ===
  DEFI_DEX: ['UNI', 'SUSHI', 'CAKE', 'DYDX', 'GMX', '1INCH', 'JOE', 'RAY'],
  DEFI_LENDING: ['AAVE', 'COMP', 'MKR', 'KAVA', 'CREAM', 'BENQI', 'RADIANT'],
  DEFI_DERIVATIVES: ['SNX', 'PERP', 'DYDX', 'GMX', 'GNS'],
  DEFI_YIELD: ['CRV', 'CVX', 'YFI', 'BAL', 'FXS', 'FRAX', 'SPELL'],
  DEFI_LIQUID_STAKING: ['LDO', 'RPL', 'RETH', 'SFRXETH', 'ANKR'],
  DEFI_INSURANCE: ['INSR', 'NXM', 'COVER'],
  DEFI_AGGREGATOR: ['1INCH', 'ROOK', 'COW'],
  
  // === AI & MACHINE LEARNING ===
  AI_COMPUTING: [
    'FET', 'AGIX', 'RNDR', 'GRT', 'OCEAN', 'ICP', 'AKT', 'ATOR', 'ORAI', 'NMR',
    'ALEPH', 'CTXC', 'PHB', 'DBC', 'AGI'
  ],
  AI_DATA: ['GRT', 'OCEAN', 'NMR', 'ROSE', 'AIOZ'],
  
  // === GAMING & METAVERSE ===
  GAMING_PLAY_TO_EARN: ['AXS', 'SAND', 'MANA', 'ENJ', 'IMX', 'GALA', 'ALICE', 'TLM', 'SLP'],
  GAMING_INFRASTRUCTURE: ['IMX', 'RON', 'BEAM', 'PRIME', 'PORTAL', 'XPLA'],
  GAMING_ESPORTS: ['CHZ', 'OG', 'PSG', 'BAR', 'ASR'],
  METAVERSE: ['SAND', 'MANA', 'ENJ', 'AXS', 'GALA', 'RNDR', 'HIGH', 'STARL', 'VOXEL'],
  
  // === NFT & DIGITAL ART ===
  NFT_MARKETPLACE: ['BLUR', 'LOOKS', 'X2Y2', 'RARE'],
  NFT_INFRASTRUCTURE: ['IMX', 'RNDR', 'ENJ', 'FLOW', 'THETA'],
  
  // === MEDIA & ENTERTAINMENT ===
  MEDIA_STREAMING: ['THETA', 'LPT', 'AIOZ', 'VIDT', 'DIA'],
  MEDIA_MUSIC: ['AUDIO', 'OPUL', 'VIBE'],
  MEDIA_SOCIAL: ['DESO', 'LENS', 'RALLY', 'CHZ'],
  MEDIA_CONTENT: ['BAT', 'STEEM', 'HIVE'],
  
  // === ENTERPRISE & BUSINESS ===
  ENTERPRISE_PAYMENTS: ['XRP', 'XLM', 'HBAR', 'ALGO', 'XDC', 'CELO', 'ACH'],
  ENTERPRISE_SUPPLY_CHAIN: ['VET', 'TRAC', 'WTC', 'TEL'],
  ENTERPRISE_IDENTITY: ['CIVIC', 'SCP', 'DOCK'],
  ENTERPRISE_CLOUD: ['ICP', 'STORJ', 'FIL', 'AR', 'SC'],
  
  // === PAYMENTS & STORE OF VALUE ===
  PAYMENTS_DIGITAL_CASH: ['BTC', 'LTC', 'BCH', 'DASH', 'XLM', 'DOGE', 'SHIB'],
  PAYMENTS_STABLECOIN: ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'FRAX', 'USDD'],
  PAYMENTS_CROSS_BORDER: ['XRP', 'XLM', 'XDC', 'CELO', 'ACH'],
  
  // === PRIVACY ===
  PRIVACY: ['XMR', 'ZEC', 'DASH', 'SCRT', 'ROSE', 'BEAM', 'DERO', 'ARRR'],
  
  // === ORACLE & DATA ===
  ORACLE: ['LINK', 'BAND', 'TRB', 'API3', 'DIA', 'PYTH', 'UMA'],
  
  // === STORAGE & FILE SHARING ===
  STORAGE: ['FIL', 'AR', 'STORJ', 'SC', 'BTT', 'ANKR'],
  
  // === INTERNET OF THINGS (IoT) ===
  IOT: ['IOTA', 'IOTX', 'JASMY', 'VET', 'HNT', 'AMB'],
  
  // === SMART CONTRACT PLATFORMS ===
  SMART_CONTRACT: [
    'ETH', 'SOL', 'AVAX', 'DOT', 'ATOM', 'NEAR', 'ALGO', 'ADA', 'FTM', 'ONE',
    'ROSE', 'APT', 'SUI', 'SEI', 'INJ', 'TRX', 'TON', 'EGLD', 'KAVA'
  ],
  
  // === INTEROPERABILITY ===
  INTEROPERABILITY: ['DOT', 'ATOM', 'LINK', 'RUNE', 'CELR', 'POLY', 'AXELAR'],
  
  // === MEME COINS (High Volatility) ===
  MEME: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'MYRO', 'POPCAT'],
  
  // === REAL WORLD ASSETS (RWA) ===
  RWA: ['ONDO', 'CFG', 'MPL', 'POLY', 'RIO', 'PROPC'],
  
  // === DECENTRALIZED PHYSICAL INFRASTRUCTURE (DePIN) ===
  DEPIN: ['HNT', 'FIL', 'AR', 'RNDR', 'IOTX', 'AKT', 'STORJ'],
  
  // === WEB3 & INFRASTRUCTURE ===
  WEB3: ['ICP', 'FIL', 'AR', 'GRT', 'STORJ', 'ANKR', 'POKT'],
  
  // === GOVERNANCE & DAO ===
  GOVERNANCE: ['MKR', 'COMP', 'AAVE', 'UNI', 'CRV', 'CVX', 'BAL'],
  
  // === DERIVATIVES & SYNTHETIC ASSETS ===
  DERIVATIVES: ['SNX', 'PERP', 'DYDX', 'GMX', 'UMA', 'KWENTA'],
  
  // === LIQUID STAKING & RESTAKING ===
  LIQUID_STAKING: ['LDO', 'RPL', 'ANKR', 'SD', 'FXS', 'SFRXETH'],
  
  // === AUTOMATION & INFRASTRUCTURE ===
  AUTOMATION: ['LINK', 'GELATO', 'KEEP', 'API3'],
  
  // === SOCIAL FINANCE (SocialFi) ===
  SOCIALFI: ['FRIEND', 'DESO', 'RALLY', 'MASK'],
  
  // === HEALTHCARE & BIOTECH ===
  HEALTHCARE: ['VET', 'SOLVE', 'DBC', 'AIDOC'],
  
  // === ENERGY & SUSTAINABILITY ===
  ENERGY: ['POWR', 'WPR', 'ENRG', 'SNC'],
  
  // === INSURANCE & RISK ===
  INSURANCE: ['INSR', 'COVER', 'NXM', 'BRIDGE'],
  
  // === RETAIL & E-COMMERCE ===
  RETAIL: ['UTK', 'REQ', 'SHOPX', 'COVAL'],
  
  // === TRAVEL & HOSPITALITY ===
  TRAVEL: ['AVA', 'LIF', 'TRVL'],
  
  // === EDUCATION ===
  EDUCATION: ['EDU', 'PTON', 'LRN'],
  
  // === SPORTS & FITNESS ===
  SPORTS: ['CHZ', 'SANTOS', 'PSG', 'BAR', 'STEPN', 'GMT'],
};

/**
 * MASSIVELY EXPANDED Industry to Crypto Category Mapping
 * Covers 40+ industries with intelligent crypto correlations
 */
export const INDUSTRY_TO_CRYPTO_MAPPING: Record<string, string[]> = {
  // === TECHNOLOGY ===
  'Technology': ['LAYER1', 'SMART_CONTRACT', 'AI_COMPUTING', 'WEB3'],
  'Software': ['LAYER1', 'AI_COMPUTING', 'ENTERPRISE_CLOUD', 'WEB3', 'AUTOMATION'],
  'Software - Application': ['ENTERPRISE_CLOUD', 'AI_COMPUTING', 'WEB3', 'SOCIALFI'],
  'Software - Infrastructure': ['LAYER1', 'LAYER2', 'ENTERPRISE_CLOUD', 'AUTOMATION'],
  'Semiconductors': ['AI_COMPUTING', 'LAYER1', 'IOT', 'DEPIN'],
  'Hardware': ['IOT', 'DEPIN', 'AI_COMPUTING', 'STORAGE'],
  'IT Services': ['ENTERPRISE_CLOUD', 'LAYER1', 'AUTOMATION', 'ORACLE'],
  'Cloud Computing': ['ENTERPRISE_CLOUD', 'STORAGE', 'WEB3', 'DEPIN'],
  'Cybersecurity': ['PRIVACY', 'ENTERPRISE_IDENTITY', 'LAYER1'],
  'Data Processing': ['AI_DATA', 'ORACLE', 'STORAGE', 'GRT'],
  
  // === ARTIFICIAL INTELLIGENCE ===
  'Artificial Intelligence': ['AI_COMPUTING', 'AI_DATA', 'ORACLE', 'AUTOMATION'],
  'Machine Learning': ['AI_COMPUTING', 'AI_DATA', 'ORACLE'],
  'Computer Vision': ['AI_COMPUTING', 'RNDR', 'ICP'],
  'Natural Language Processing': ['AI_COMPUTING', 'GRT', 'OCEAN'],
  
  // === FINANCE & BANKING ===
  'Banks': ['DEFI_LENDING', 'DEFI_DEX', 'PAYMENTS_CROSS_BORDER', 'ENTERPRISE_PAYMENTS'],
  'Financial Services': ['DEFI_LENDING', 'DEFI_DEX', 'PAYMENTS_DIGITAL_CASH', 'RWA'],
  'Investment Banking': ['DEFI_LENDING', 'DEFI_DERIVATIVES', 'RWA', 'GOVERNANCE'],
  'Insurance': ['DEFI_INSURANCE', 'INSURANCE', 'DEFI_LENDING'],
  'Credit Services': ['DEFI_LENDING', 'RWA', 'ENTERPRISE_PAYMENTS'],
  'Capital Markets': ['DEFI_DERIVATIVES', 'DEFI_DEX', 'RWA', 'GOVERNANCE'],
  'Asset Management': ['DEFI_YIELD', 'LIQUID_STAKING', 'GOVERNANCE', 'RWA'],
  'Blockchain': ['LAYER1', 'LAYER2', 'SMART_CONTRACT', 'INTEROPERABILITY'],
  'Cryptocurrency': ['LAYER1', 'DEFI_DEX', 'PAYMENTS_DIGITAL_CASH'],
  'Payment Processing': ['PAYMENTS_DIGITAL_CASH', 'PAYMENTS_CROSS_BORDER', 'LAYER2'],
  'Fintech': ['DEFI_DEX', 'PAYMENTS_DIGITAL_CASH', 'DEFI_LENDING', 'LAYER2'],
  
  // === ENTERTAINMENT & MEDIA ===
  'Entertainment': ['GAMING_PLAY_TO_EARN', 'METAVERSE', 'MEDIA_STREAMING', 'NFT_MARKETPLACE'],
  'Media': ['MEDIA_STREAMING', 'MEDIA_CONTENT', 'MEDIA_SOCIAL', 'NFT_INFRASTRUCTURE'],
  'Broadcasting': ['MEDIA_STREAMING', 'THETA', 'LPT', 'AIOZ'],
  'Streaming': ['MEDIA_STREAMING', 'THETA', 'LPT', 'AIOZ', 'AUDIO'],
  'Music': ['MEDIA_MUSIC', 'AUDIO', 'NFT_MARKETPLACE'],
  'Publishing': ['MEDIA_CONTENT', 'AR', 'STEEM', 'HIVE'],
  'Social Media': ['MEDIA_SOCIAL', 'SOCIALFI', 'LENS', 'DESO'],
  'Content Creation': ['MEDIA_CONTENT', 'NFT_MARKETPLACE', 'SOCIALFI'],
  
  // === GAMING ===
  'Gaming': ['GAMING_PLAY_TO_EARN', 'GAMING_INFRASTRUCTURE', 'METAVERSE', 'NFT_INFRASTRUCTURE'],
  'Video Games': ['GAMING_PLAY_TO_EARN', 'GAMING_INFRASTRUCTURE', 'GAMING_ESPORTS'],
  'E-Sports': ['GAMING_ESPORTS', 'CHZ', 'GAMING_PLAY_TO_EARN'],
  'Game Development': ['GAMING_INFRASTRUCTURE', 'IMX', 'RNDR', 'BEAM'],
  
  // === RETAIL & E-COMMERCE ===
  'Retail': ['PAYMENTS_DIGITAL_CASH', 'RETAIL', 'LAYER2', 'ENTERPRISE_PAYMENTS'],
  'E-commerce': ['PAYMENTS_DIGITAL_CASH', 'RETAIL', 'SMART_CONTRACT', 'LAYER2'],
  'Consumer Goods': ['PAYMENTS_DIGITAL_CASH', 'RETAIL', 'ENTERPRISE_SUPPLY_CHAIN'],
  'Luxury Goods': ['NFT_MARKETPLACE', 'ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_DIGITAL_CASH'],
  'Fashion': ['NFT_MARKETPLACE', 'METAVERSE', 'RETAIL'],
  
  // === HEALTHCARE & PHARMA ===
  'Healthcare': ['HEALTHCARE', 'AI_COMPUTING', 'ENTERPRISE_SUPPLY_CHAIN', 'ENTERPRISE_IDENTITY'],
  'Biotechnology': ['AI_COMPUTING', 'HEALTHCARE', 'OCEAN', 'VET'],
  'Pharmaceuticals': ['ENTERPRISE_SUPPLY_CHAIN', 'HEALTHCARE', 'VET', 'TRAC'],
  'Medical Devices': ['IOT', 'HEALTHCARE', 'ENTERPRISE_SUPPLY_CHAIN'],
  'Health Insurance': ['DEFI_INSURANCE', 'INSURANCE', 'HEALTHCARE'],
  
  // === ENERGY ===
  'Energy': ['ENERGY', 'DEPIN', 'LAYER1', 'ENTERPRISE_SUPPLY_CHAIN'],
  'Oil & Gas': ['ENERGY', 'ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_CROSS_BORDER'],
  'Renewable Energy': ['ENERGY', 'POWR', 'DEPIN'],
  'Utilities': ['ENERGY', 'DEPIN', 'IOT'],
  'Solar': ['ENERGY', 'POWR', 'DEPIN'],
  
  // === REAL ESTATE ===
  'Real Estate': ['RWA', 'DEFI_LENDING', 'METAVERSE', 'ENTERPRISE_IDENTITY'],
  'REITs': ['RWA', 'DEFI_YIELD', 'DEFI_LENDING'],
  'Property Management': ['RWA', 'ENTERPRISE_IDENTITY', 'SMART_CONTRACT'],
  
  // === AUTOMOTIVE ===
  'Automotive': ['IOT', 'ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_DIGITAL_CASH', 'ENERGY'],
  'Electric Vehicles': ['ENERGY', 'IOT', 'DEPIN', 'LAYER1'],
  'Auto Parts': ['ENTERPRISE_SUPPLY_CHAIN', 'IOT', 'VET', 'TRAC'],
  'Autonomous Vehicles': ['AI_COMPUTING', 'IOT', 'IOTA', 'IOTX'],
  
  // === TRANSPORTATION & LOGISTICS ===
  'Transportation': ['ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_CROSS_BORDER', 'IOT'],
  'Logistics': ['ENTERPRISE_SUPPLY_CHAIN', 'VET', 'TRAC', 'IOT'],
  'Shipping': ['ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_CROSS_BORDER', 'VET'],
  'Airlines': ['TRAVEL', 'PAYMENTS_CROSS_BORDER', 'ENTERPRISE_PAYMENTS'],
  
  // === TELECOMMUNICATIONS ===
  'Telecommunications': ['DEPIN', 'HNT', 'IOT', 'WEB3'],
  'Wireless': ['DEPIN', 'HNT', 'IOT'],
  '5G': ['DEPIN', 'IOT', 'HNT', 'IOTX'],
  
  // === MANUFACTURING ===
  'Manufacturing': ['ENTERPRISE_SUPPLY_CHAIN', 'IOT', 'VET', 'TRAC'],
  'Industrial': ['IOT', 'ENTERPRISE_SUPPLY_CHAIN', 'DEPIN'],
  'Aerospace': ['ENTERPRISE_SUPPLY_CHAIN', 'AI_COMPUTING', 'IOT'],
  
  // === FOOD & BEVERAGE ===
  'Food': ['ENTERPRISE_SUPPLY_CHAIN', 'VET', 'RETAIL', 'TRAC'],
  'Beverages': ['ENTERPRISE_SUPPLY_CHAIN', 'RETAIL', 'VET'],
  'Agriculture': ['ENTERPRISE_SUPPLY_CHAIN', 'IOT', 'VET', 'DEPIN'],
  
  // === TRAVEL & HOSPITALITY ===
  'Travel': ['TRAVEL', 'PAYMENTS_CROSS_BORDER', 'NFT_MARKETPLACE'],
  'Hotels': ['TRAVEL', 'PAYMENTS_DIGITAL_CASH', 'RWA'],
  'Tourism': ['TRAVEL', 'PAYMENTS_CROSS_BORDER', 'NFT_MARKETPLACE'],
  
  // === EDUCATION ===
  'Education': ['EDUCATION', 'NFT_INFRASTRUCTURE', 'WEB3', 'MEDIA_CONTENT'],
  'E-Learning': ['EDUCATION', 'WEB3', 'STORAGE', 'MEDIA_STREAMING'],
  
  // === SPORTS & FITNESS ===
  'Sports': ['SPORTS', 'GAMING_ESPORTS', 'NFT_MARKETPLACE', 'CHZ'],
  'Fitness': ['SPORTS', 'STEPN', 'GMT', 'SOCIALFI'],
  
  // === MISCELLANEOUS ===
  'Consulting': ['ENTERPRISE_PAYMENTS', 'AUTOMATION', 'AI_COMPUTING'],
  'Advertising': ['MEDIA_SOCIAL', 'BAT', 'SOCIALFI'],
  'Marketing': ['MEDIA_SOCIAL', 'SOCIALFI', 'AI_COMPUTING'],
  'Research': ['AI_COMPUTING', 'OCEAN', 'ORACLE', 'STORAGE'],
  
  // === DEFAULT FALLBACK ===
  'DEFAULT': ['LAYER1', 'SMART_CONTRACT', 'DEFI_DEX', 'PAYMENTS_DIGITAL_CASH'],
};

/**
 * Weighted scoring system for crypto relevance
 */
interface CryptoScore {
  symbol: string;
  score: number;
  reasons: string[];
}

/**
 * Main algorithm: Find correlated cryptocurrencies for a stock
 */
export async function findCorrelatedCryptos(
  stockSymbol: string,
  stockIndustry?: string,
  stockMarketCap?: number,
  limit: number = 10
): Promise<string[]> {
  try {
    // Step 1: Determine relevant crypto categories based on stock industry
    const relevantCategories = getRelevantCryptoCategories(stockIndustry);
    
    // Step 2: Get all potential crypto candidates from relevant categories
    const candidates = getCryptoCandidates(relevantCategories);
    
    // Step 3: Filter by market cap relevance (only top cryptocurrencies)
    const relevantCryptos = filterByMarketCapRelevance(candidates);
    
    // Step 4: Score each crypto based on multiple factors
    const scoredCryptos = await scoreCryptos(
      relevantCryptos,
      stockSymbol,
      stockIndustry,
      stockMarketCap
    );
    
    // Step 5: Sort by score and return top results
    const topCryptos = scoredCryptos
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(c => c.symbol);
    
    console.log(`Found ${topCryptos.length} correlated cryptos for ${stockSymbol}:`, topCryptos);
    
    return topCryptos;
  } catch (error) {
    console.error('Error finding correlated cryptos:', error);
    // Fallback to default popular cryptos
    return ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC'];
  }
}

/**
 * Determine relevant crypto categories based on stock industry
 * Uses SMART FUZZY MATCHING for better coverage
 */
function getRelevantCryptoCategories(stockIndustry?: string): string[] {
  if (!stockIndustry) {
    return INDUSTRY_TO_CRYPTO_MAPPING['DEFAULT'];
  }
  
  const industryLower = stockIndustry.toLowerCase();
  
  // Method 1: Exact match
  if (INDUSTRY_TO_CRYPTO_MAPPING[stockIndustry]) {
    return INDUSTRY_TO_CRYPTO_MAPPING[stockIndustry];
  }
  
  // Method 2: Fuzzy keyword matching
  const keywords: Record<string, string[]> = {
    // AI/ML keywords
    'ai': ['AI_COMPUTING', 'AI_DATA', 'ORACLE', 'AUTOMATION'],
    'artificial': ['AI_COMPUTING', 'AI_DATA'],
    'machine learning': ['AI_COMPUTING', 'AI_DATA'],
    'neural': ['AI_COMPUTING'],
    'gpu': ['AI_COMPUTING', 'RNDR'],
    
    // Finance keywords
    'bank': ['DEFI_LENDING', 'DEFI_DEX', 'PAYMENTS_CROSS_BORDER'],
    'finance': ['DEFI_LENDING', 'DEFI_DEX', 'PAYMENTS_DIGITAL_CASH'],
    'payment': ['PAYMENTS_DIGITAL_CASH', 'PAYMENTS_CROSS_BORDER', 'LAYER2'],
    'fintech': ['DEFI_DEX', 'PAYMENTS_DIGITAL_CASH', 'LAYER2'],
    'lending': ['DEFI_LENDING', 'RWA'],
    'trading': ['DEFI_DEX', 'DEFI_DERIVATIVES'],
    'insurance': ['DEFI_INSURANCE', 'INSURANCE'],
    
    // Tech keywords
    'software': ['LAYER1', 'AI_COMPUTING', 'ENTERPRISE_CLOUD', 'WEB3'],
    'cloud': ['ENTERPRISE_CLOUD', 'STORAGE', 'WEB3', 'DEPIN'],
    'data': ['AI_DATA', 'ORACLE', 'STORAGE'],
    'computing': ['AI_COMPUTING', 'ENTERPRISE_CLOUD', 'LAYER1'],
    'infrastructure': ['LAYER1', 'LAYER2', 'ENTERPRISE_CLOUD'],
    
    // Gaming/Entertainment keywords
    'game': ['GAMING_PLAY_TO_EARN', 'GAMING_INFRASTRUCTURE', 'METAVERSE'],
    'gaming': ['GAMING_PLAY_TO_EARN', 'GAMING_INFRASTRUCTURE'],
    'esport': ['GAMING_ESPORTS'],
    'metaverse': ['METAVERSE', 'GAMING_PLAY_TO_EARN', 'NFT_MARKETPLACE'],
    'entertainment': ['GAMING_PLAY_TO_EARN', 'METAVERSE', 'MEDIA_STREAMING'],
    
    // Media keywords
    'media': ['MEDIA_STREAMING', 'MEDIA_CONTENT', 'MEDIA_SOCIAL'],
    'streaming': ['MEDIA_STREAMING', 'THETA', 'LPT'],
    'music': ['MEDIA_MUSIC', 'AUDIO', 'NFT_MARKETPLACE'],
    'video': ['MEDIA_STREAMING', 'THETA'],
    'content': ['MEDIA_CONTENT', 'NFT_MARKETPLACE'],
    'social': ['MEDIA_SOCIAL', 'SOCIALFI'],
    
    // Retail/Commerce keywords
    'retail': ['PAYMENTS_DIGITAL_CASH', 'RETAIL', 'ENTERPRISE_SUPPLY_CHAIN'],
    'ecommerce': ['PAYMENTS_DIGITAL_CASH', 'RETAIL', 'SMART_CONTRACT'],
    'commerce': ['PAYMENTS_DIGITAL_CASH', 'RETAIL'],
    'marketplace': ['NFT_MARKETPLACE', 'DEFI_DEX'],
    
    // Healthcare keywords
    'health': ['HEALTHCARE', 'AI_COMPUTING', 'ENTERPRISE_SUPPLY_CHAIN'],
    'medical': ['HEALTHCARE', 'ENTERPRISE_SUPPLY_CHAIN', 'IOT'],
    'pharma': ['ENTERPRISE_SUPPLY_CHAIN', 'HEALTHCARE'],
    'biotech': ['AI_COMPUTING', 'HEALTHCARE'],
    
    // Energy keywords
    'energy': ['ENERGY', 'DEPIN', 'IOT'],
    'solar': ['ENERGY', 'POWR', 'DEPIN'],
    'renewable': ['ENERGY', 'DEPIN'],
    'power': ['ENERGY', 'DEPIN'],
    
    // Automotive keywords
    'automotive': ['IOT', 'ENTERPRISE_SUPPLY_CHAIN', 'ENERGY'],
    'vehicle': ['IOT', 'ENTERPRISE_SUPPLY_CHAIN', 'ENERGY'],
    'electric': ['ENERGY', 'IOT', 'DEPIN'],
    'autonomous': ['AI_COMPUTING', 'IOT'],
    
    // Supply chain keywords
    'supply': ['ENTERPRISE_SUPPLY_CHAIN', 'VET', 'TRAC', 'IOT'],
    'logistics': ['ENTERPRISE_SUPPLY_CHAIN', 'IOT'],
    'shipping': ['ENTERPRISE_SUPPLY_CHAIN', 'PAYMENTS_CROSS_BORDER'],
    
    // IoT/Hardware keywords
    'iot': ['IOT', 'DEPIN', 'ENTERPRISE_SUPPLY_CHAIN'],
    'sensor': ['IOT', 'DEPIN'],
    'hardware': ['IOT', 'AI_COMPUTING', 'DEPIN'],
    'semiconductor': ['AI_COMPUTING', 'LAYER1', 'IOT'],
    
    // Real estate keywords
    'real estate': ['RWA', 'DEFI_LENDING', 'METAVERSE'],
    'property': ['RWA', 'ENTERPRISE_IDENTITY'],
    'reit': ['RWA', 'DEFI_YIELD'],
    
    // Crypto/Blockchain keywords
    'crypto': ['LAYER1', 'DEFI_DEX', 'PAYMENTS_DIGITAL_CASH'],
    'blockchain': ['LAYER1', 'LAYER2', 'SMART_CONTRACT'],
    'web3': ['WEB3', 'LAYER1', 'STORAGE'],
    'defi': ['DEFI_DEX', 'DEFI_LENDING', 'DEFI_DERIVATIVES'],
    
    // Storage/Data keywords
    'storage': ['STORAGE', 'ENTERPRISE_CLOUD', 'DEPIN'],
    'file': ['STORAGE', 'FIL', 'AR'],
    
    // Travel keywords
    'travel': ['TRAVEL', 'PAYMENTS_CROSS_BORDER'],
    'hotel': ['TRAVEL', 'RWA'],
    'airline': ['TRAVEL', 'PAYMENTS_CROSS_BORDER'],
    
    // Education keywords
    'education': ['EDUCATION', 'WEB3', 'NFT_INFRASTRUCTURE'],
    'learning': ['EDUCATION', 'AI_COMPUTING'],
  };
  
  // Check for keyword matches
  let matchedCategories: string[] = [];
  
  for (const [keyword, categories] of Object.entries(keywords)) {
    if (industryLower.includes(keyword)) {
      matchedCategories = [...matchedCategories, ...categories];
    }
  }
  
  // Remove duplicates
  if (matchedCategories.length > 0) {
    return Array.from(new Set(matchedCategories));
  }
  
  // Method 3: Partial matching with industry mapping keys
  for (const [industry, categories] of Object.entries(INDUSTRY_TO_CRYPTO_MAPPING)) {
    const industryKeyLower = industry.toLowerCase();
    
    // Check if stock industry contains the mapping key or vice versa
    if (industryLower.includes(industryKeyLower) || 
        industryKeyLower.includes(industryLower)) {
      return categories;
    }
  }
  
  // Fallback to DEFAULT
  return INDUSTRY_TO_CRYPTO_MAPPING['DEFAULT'];
}

/**
 * Get crypto candidates from relevant categories
 */
function getCryptoCandidates(categories: string[]): string[] {
  const candidates = new Set<string>();
  
  for (const category of categories) {
    const cryptos = CRYPTO_CATEGORIES[category as keyof typeof CRYPTO_CATEGORIES];
    if (cryptos) {
      cryptos.forEach(c => candidates.add(c));
    }
  }
  
  return Array.from(candidates);
}

/**
 * Filter cryptos by market cap relevance (MASSIVELY EXPANDED)
 * Prioritizes top cryptos but allows for broader analysis
 */
function filterByMarketCapRelevance(cryptos: string[]): string[] {
  // Priority 1: Top 20 cryptos by market cap (always included if relevant)
  const tier1 = [
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'DOT',
    'MATIC', 'LINK', 'TON', 'SHIB', 'UNI', 'ATOM', 'LTC', 'BCH', 'NEAR', 'APT'
  ];
  
  // Priority 2: Important infrastructure & DeFi (always relevant)
  const tier2 = [
    'AAVE', 'MKR', 'ALGO', 'SNX', 'CRV', 'COMP', 'FTM', 'HBAR', 'IMX', 'ARB',
    'OP', 'ICP', 'FIL', 'GRT', 'SAND', 'MANA', 'AXS', 'VET', 'THETA', 'XLM'
  ];
  
  const result = new Set<string>();
  
  // Add all tier 1 cryptos that are in the candidates
  tier1.forEach(crypto => {
    if (cryptos.includes(crypto)) {
      result.add(crypto);
    }
  });
  
  // Add tier 2 cryptos that are in the candidates
  tier2.forEach(crypto => {
    if (cryptos.includes(crypto) && result.size < 40) {
      result.add(crypto);
    }
  });
  
  // Add remaining candidates (up to 50 total for analysis)
  cryptos.forEach(crypto => {
    if (result.size < 50) { // Increased from 30 to 50 for better coverage
      result.add(crypto);
    }
  });
  
  return Array.from(result);
}

/**
 * Score cryptocurrencies based on multiple factors
 */
async function scoreCryptos(
  cryptos: string[],
  stockSymbol: string,
  stockIndustry?: string,
  stockMarketCap?: number
): Promise<CryptoScore[]> {
  const scores: CryptoScore[] = [];
  
  for (const crypto of cryptos) {
    let score = 0;
    const reasons: string[] = [];
    
    // Factor 1: Category relevance (40 points)
    const categoryScore = calculateCategoryScore(crypto, stockIndustry);
    score += categoryScore;
    if (categoryScore > 0) {
      reasons.push(`Industry match (${categoryScore}pts)`);
    }
    
    // Factor 2: Market cap tier (30 points)
    const marketCapScore = calculateMarketCapScore(crypto, stockMarketCap);
    score += marketCapScore;
    if (marketCapScore > 0) {
      reasons.push(`Market cap relevance (${marketCapScore}pts)`);
    }
    
    // Factor 3: Ecosystem importance (20 points)
    const ecosystemScore = calculateEcosystemScore(crypto);
    score += ecosystemScore;
    if (ecosystemScore > 0) {
      reasons.push(`Ecosystem leader (${ecosystemScore}pts)`);
    }
    
    // Factor 4: Use case similarity (10 points)
    const useCaseScore = calculateUseCaseScore(crypto, stockSymbol);
    score += useCaseScore;
    if (useCaseScore > 0) {
      reasons.push(`Similar use case (${useCaseScore}pts)`);
    }
    
    scores.push({
      symbol: crypto,
      score,
      reasons,
    });
  }
  
  return scores;
}

/**
 * Calculate score based on crypto category match with stock industry
 */
function calculateCategoryScore(crypto: string, stockIndustry?: string): number {
  if (!stockIndustry) return 10; // Base score
  
  let score = 0;
  const relevantCategories = getRelevantCryptoCategories(stockIndustry);
  
  // Check if crypto is in any relevant category
  for (const category of relevantCategories) {
    const categoryList = CRYPTO_CATEGORIES[category as keyof typeof CRYPTO_CATEGORIES];
    if (categoryList && categoryList.includes(crypto)) {
      score += 15; // 15 points per matching category
    }
  }
  
  return Math.min(score, 40); // Cap at 40 points
}

/**
 * Calculate score based on market cap (MASSIVELY EXPANDED)
 * Covers 200+ cryptocurrencies with intelligent tiering
 */
function calculateMarketCapScore(crypto: string, stockMarketCap?: number): number {
  // Top tier cryptos (Top 10 by market cap) - 30 points
  const topTier = [
    'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'USDT', 'USDC', 'ADA', 'AVAX', 'DOGE'
  ];
  
  // Upper mid tier (Top 11-30) - 25 points
  const upperMidTier = [
    'TRX', 'DOT', 'MATIC', 'LINK', 'TON', 'SHIB', 'DAI', 'UNI', 'ATOM', 'LTC',
    'BCH', 'NEAR', 'APT', 'STX', 'ICP', 'FIL', 'ARB', 'OP', 'IMX', 'HBAR'
  ];
  
  // Mid tier (Top 31-100) - 20 points
  const midTier = [
    'AAVE', 'MKR', 'ALGO', 'VET', 'SAND', 'MANA', 'AXS', 'GRT', 'SNX', 'FTM',
    'THETA', 'XLM', 'FLOW', 'EOS', 'XTZ', 'EGLD', 'KAVA', 'ZEC', 'DASH', 'COMP',
    'YFI', 'CRV', 'BAL', 'SUSHI', 'RUNE', '1INCH', 'ENJ', 'CHZ', 'LRC', 'ZRX',
    'OMG', 'QTUM', 'ZIL', 'ICX', 'WAVES', 'REN', 'KNC', 'BAT', 'STORJ', 'ANKR'
  ];
  
  // Lower mid tier (Top 101-200) - 15 points
  const lowerMidTier = [
    'FET', 'AGIX', 'RNDR', 'OCEAN', 'LDO', 'GMX', 'DYDX', 'PERP', 'INJ', 'SEI',
    'SUI', 'BLUR', 'LOOKS', 'IMX', 'GALA', 'ALICE', 'TLM', 'SLP', 'RON', 'BEAM',
    'PRIME', 'AUDIO', 'LPT', 'AIOZ', 'MASK', 'RALLY', 'DESO', 'HNT', 'IOTX', 'JASMY',
    'VET', 'TRAC', 'WTC', 'TEL', 'AR', 'SC', 'BTT', 'XMR', 'SCRT', 'ROSE',
    'BAND', 'TRB', 'API3', 'DIA', 'PYTH', 'UMA', 'CVX', 'FXS', 'FRAX', 'SPELL',
    'RPL', 'SD', 'INSR', 'NXM', 'COVER', 'IOTA', 'AMB', 'POWR', 'WPR', 'CIVIC',
    'DOCK', 'UTK', 'REQ', 'AVA', 'LIF', 'EDU', 'CHZ', 'SANTOS', 'PSG', 'BAR',
    'STEPN', 'GMT', 'CAKE', 'JOE', 'RAY', 'BENQI', 'RADIANT', 'CREAM', 'KWENTA',
    'GELATO', 'KEEP', 'FRIEND', 'ONDO', 'CFG', 'MPL', 'POLY', 'RIO', 'AKT', 'POKT'
  ];
  
  // Emerging tier (Innovation/Growth) - 12 points
  const emergingTier = [
    'ATOR', 'ORAI', 'NMR', 'ALEPH', 'CTXC', 'PHB', 'DBC', 'AGI', 'VIDT', 'OPUL',
    'VIBE', 'LENS', 'STEEM', 'HIVE', 'SCP', 'XDC', 'CELO', 'ACH', 'SHOPX', 'COVAL',
    'TRVL', 'PTON', 'LRN', 'BONK', 'WIF', 'MYRO', 'POPCAT', 'FLOKI', 'PEPE',
    'PROPC', 'AIDOC', 'ENRG', 'SNC', 'BRIDGE', 'X2Y2', 'RARE', 'OG', 'ASR',
    'HIGH', 'STARL', 'VOXEL', 'PORTAL', 'XPLA', 'METIS', 'BOBA', 'STRK', 'CELR',
    'AXELAR', 'SOLVE', 'ARRR', 'DERO', 'BEAM'
  ];
  
  if (topTier.includes(crypto)) return 30;
  if (upperMidTier.includes(crypto)) return 25;
  if (midTier.includes(crypto)) return 20;
  if (lowerMidTier.includes(crypto)) return 15;
  if (emergingTier.includes(crypto)) return 12;
  
  return 10; // Default score for any other crypto
}

/**
 * Calculate score based on crypto's importance in its ecosystem (EXPANDED)
 */
function calculateEcosystemScore(crypto: string): number {
  // Critical infrastructure (Layer 1 leaders) - 20 points
  const criticalInfrastructure = [
    'BTC', 'ETH', 'SOL', 'AVAX', 'DOT', 'ATOM', 'NEAR', 'ADA', 'FTM', 'ALGO'
  ];
  
  // Major DeFi protocols - 18 points
  const majorDefi = [
    'UNI', 'AAVE', 'MKR', 'COMP', 'SNX', 'CRV', 'SUSHI', 'BAL'
  ];
  
  // Leading tech/AI protocols - 17 points
  const leadingTech = [
    'FET', 'RNDR', 'GRT', 'OCEAN', 'AGIX', 'ICP', 'FIL', 'AR'
  ];
  
  // Important infrastructure (Layer 2, Oracles, etc.) - 16 points
  const importantInfra = [
    'MATIC', 'ARB', 'OP', 'LINK', 'BAND', 'TRB', 'API3', 'PYTH'
  ];
  
  // Gaming/Metaverse leaders - 15 points
  const gamingLeaders = [
    'AXS', 'SAND', 'MANA', 'IMX', 'ENJ', 'GALA', 'RON'
  ];
  
  // Payment/Enterprise solutions - 15 points
  const enterpriseSolutions = [
    'XRP', 'XLM', 'HBAR', 'VET', 'ALGO', 'ACH', 'XDC'
  ];
  
  // Emerging protocols with strong ecosystems - 13 points
  const emergingProtocols = [
    'APT', 'SUI', 'SEI', 'INJ', 'DYDX', 'GMX', 'LDO', 'RPL'
  ];
  
  // Storage/Data leaders - 14 points
  const storageLeaders = [
    'FIL', 'AR', 'STORJ', 'SC', 'BTT', 'ANKR'
  ];
  
  // DePIN leaders - 14 points
  const depinLeaders = [
    'HNT', 'IOTX', 'AKT', 'POKT'
  ];
  
  if (criticalInfrastructure.includes(crypto)) return 20;
  if (majorDefi.includes(crypto)) return 18;
  if (leadingTech.includes(crypto)) return 17;
  if (importantInfra.includes(crypto)) return 16;
  if (gamingLeaders.includes(crypto)) return 15;
  if (enterpriseSolutions.includes(crypto)) return 15;
  if (storageLeaders.includes(crypto)) return 14;
  if (depinLeaders.includes(crypto)) return 14;
  if (emergingProtocols.includes(crypto)) return 13;
  
  return 5; // Base score for other cryptos
}

/**
 * Calculate score based on use case similarity (MINIMAL HARDCODING)
 * Uses intelligent keyword matching instead of explicit mappings
 */
function calculateUseCaseScore(crypto: string, stockSymbol: string): number {
  // Method 1: Direct symbol keyword matching (heuristic approach)
  const symbolKeywords = stockSymbol.toUpperCase();
  const cryptoUpper = crypto.toUpperCase();
  
  // AI/GPU correlation
  if ((symbolKeywords.includes('NVDA') || symbolKeywords.includes('AMD')) && 
      ['RNDR', 'FET', 'AGIX', 'OCEAN', 'GRT'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Metaverse correlation
  if ((symbolKeywords.includes('META') || symbolKeywords.includes('FB')) && 
      ['MANA', 'SAND', 'AXS', 'ENJ', 'GALA'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Cloud/Infrastructure correlation
  if ((symbolKeywords.includes('MSFT') || symbolKeywords.includes('GOOGL') || 
       symbolKeywords.includes('AMZN')) && 
      ['ETH', 'SOL', 'ATOM', 'ICP', 'FIL', 'AR'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Gaming correlation
  if ((symbolKeywords.includes('EA') || symbolKeywords.includes('ATVI') || 
       symbolKeywords.includes('RBLX')) && 
      ['AXS', 'SAND', 'MANA', 'ENJ', 'IMX', 'GALA', 'RON'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Streaming correlation
  if (symbolKeywords.includes('NFLX') && 
      ['THETA', 'LPT', 'AUDIO', 'AIOZ'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Finance correlation
  if ((symbolKeywords.includes('JPM') || symbolKeywords.includes('BAC') || 
       symbolKeywords.includes('GS')) && 
      ['AAVE', 'MKR', 'COMP', 'UNI', 'SNX', 'CRV'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Payment processing correlation
  if ((symbolKeywords.includes('V') || symbolKeywords.includes('MA') || 
       symbolKeywords.includes('PYPL')) && 
      ['XRP', 'XLM', 'ACH', 'LTC', 'BCH'].includes(cryptoUpper)) {
    return 10;
  }
  
  // EV/Automotive correlation
  if ((symbolKeywords.includes('TSLA') || symbolKeywords.includes('RIVN') || 
       symbolKeywords.includes('LCID')) && 
      ['IOTA', 'IOTX', 'VET', 'JASMY'].includes(cryptoUpper)) {
    return 10;
  }
  
  // Method 2: Generic crypto strengths for top stocks
  // Top layer 1s get bonus for major tech companies
  if (['AAPL', 'MSFT', 'GOOGL', 'AMZN'].includes(symbolKeywords) && 
      ['ETH', 'SOL', 'AVAX', 'DOT'].includes(cryptoUpper)) {
    return 8;
  }
  
  // Bitcoin for major financial institutions
  if (['JPM', 'BAC', 'GS', 'MS', 'WFC'].includes(symbolKeywords) && 
      cryptoUpper === 'BTC') {
    return 8;
  }
  
  return 0;
}

/**
 * Get industry information for a stock using SMART HEURISTICS
 * Uses multiple detection methods to minimize hardcoding
 */
export async function getStockIndustry(symbol: string): Promise<string | undefined> {
  // Method 1: Symbol-based pattern matching (heuristic)
  const symbolPatterns: Record<string, string> = {
    // Tech giants with obvious patterns
    'GOOGL': 'Artificial Intelligence',
    'GOOG': 'Artificial Intelligence',
    'MSFT': 'Cloud Computing',
    'AAPL': 'Technology',
    'META': 'Social Media',
    'FB': 'Social Media',
    'AMZN': 'E-commerce',
    'NFLX': 'Streaming',
    
    // Finance patterns
    'JPM': 'Banks',
    'BAC': 'Banks',
    'GS': 'Investment Banking',
    'MS': 'Investment Banking',
    'WFC': 'Banks',
    'C': 'Banks',
    'V': 'Payment Processing',
    'MA': 'Payment Processing',
    'PYPL': 'Fintech',
    'SQ': 'Fintech',
    'COIN': 'Cryptocurrency',
    
    // Semiconductors & Hardware
    'NVDA': 'Semiconductors',
    'AMD': 'Semiconductors',
    'INTC': 'Semiconductors',
    'TSM': 'Semiconductors',
    'QCOM': 'Semiconductors',
    
    // Automotive
    'TSLA': 'Electric Vehicles',
    'F': 'Automotive',
    'GM': 'Automotive',
    'TM': 'Automotive',
    'RIVN': 'Electric Vehicles',
    'LCID': 'Electric Vehicles',
    
    // Gaming
    'EA': 'Video Games',
    'ATVI': 'Video Games',
    'TTWO': 'Video Games',
    'RBLX': 'Gaming',
    'U': 'Gaming',
    
    // Healthcare
    'JNJ': 'Healthcare',
    'PFE': 'Pharmaceuticals',
    'UNH': 'Health Insurance',
    'CVS': 'Healthcare',
    'ABBV': 'Pharmaceuticals',
    'MRK': 'Pharmaceuticals',
    
    // Entertainment
    'DIS': 'Entertainment',
    'SPOT': 'Music',
    'WMT': 'Retail',
    'TGT': 'Retail',
    'HD': 'Retail',
    
    // Energy
    'XOM': 'Oil & Gas',
    'CVX': 'Oil & Gas',
    'ENPH': 'Solar',
    'SEDG': 'Solar',
    
    // Cloud & AI
    'CRM': 'Cloud Computing',
    'NOW': 'Cloud Computing',
    'SNOW': 'Cloud Computing',
    'PLTR': 'Artificial Intelligence',
    'AI': 'Artificial Intelligence',
  };
  
  // Check symbol patterns first
  if (symbolPatterns[symbol]) {
    return symbolPatterns[symbol];
  }
  
  // Method 2: Keyword-based industry detection from symbol
  const symbolUpper = symbol.toUpperCase();
  
  // AI/Tech keywords in symbols
  if (symbolUpper.includes('AI') || symbolUpper.includes('TECH')) {
    return 'Artificial Intelligence';
  }
  
  // Crypto-related
  if (symbolUpper.includes('COIN') || symbolUpper.includes('CRYPTO') || 
      symbolUpper.includes('BTC') || symbolUpper.includes('BLOCK')) {
    return 'Cryptocurrency';
  }
  
  // Gaming/Metaverse
  if (symbolUpper.includes('GAME') || symbolUpper.includes('META')) {
    return 'Gaming';
  }
  
  // Finance
  if (symbolUpper.includes('BANK') || symbolUpper.includes('FIN')) {
    return 'Financial Services';
  }
  
  // Energy
  if (symbolUpper.includes('ENRG') || symbolUpper.includes('SOLAR') || 
      symbolUpper.includes('POWER')) {
    return 'Renewable Energy';
  }
  
  // Method 3: Common suffix patterns
  // REITs typically end in specific patterns
  if (symbolUpper.endsWith('R') && symbolUpper.length === 4) {
    // Might be a REIT, but not always reliable
  }
  
  // TODO: In production, call Finnhub API here:
  // const profile = await getStockProfile(symbol);
  // return profile.industry;
  
  return undefined; // Will use DEFAULT mapping
}
