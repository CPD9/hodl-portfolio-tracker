/**
 * Environment Configuration Validation
 * Validates and exports all environment variables used in the HODL Portfolio Tracker
 */

// Server-side environment variables
export const serverEnv = {
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  
  // Authentication
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  
  // Email
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  
  // AI Services
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // API Keys (Server-side)
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,
  
  // Stream Video & Chat (Secret Keys - Server only)
  STREAM_CHAT_API_KEY: process.env.STREAM_CHAT_API_KEY,
  STREAM_VIDEO_SECRET_KEY: process.env.STREAM_VIDEO_SECRET_KEY,
  STREAM_CHAT_SECRET_KEY: process.env.STREAM_CHAT_SECRET_KEY,
  
  // Blockchain (Private Key - Server only)
  PRIVATE_KEY: process.env.PRIVATE_KEY,
} as const;

// Client-side environment variables (NEXT_PUBLIC_* are exposed to browser)
export const clientEnv = {
  // Base URLs
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // API Keys (Public)
  NEXT_PUBLIC_FINNHUB_API_KEY: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
  
  // Base Chain Configuration
  NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  NEXT_PUBLIC_BASE_CHAIN_ID: process.env.NEXT_PUBLIC_BASE_CHAIN_ID,
  NEXT_PUBLIC_BASE_EXPLORER_URL: process.env.NEXT_PUBLIC_BASE_EXPLORER_URL,
  
  // Alchemy
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_ALCHEMY_HTTPS: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS,
  
  // Coinbase OnchainKit
  NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  
  // Stream Video & Chat (Public Keys)
  NEXT_PUBLIC_STREAM_VIDEO_API_KEY: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
} as const;

// Additional RPC URLs
export const rpcUrls = {
  BASE_RPC_URL: process.env.BASE_RPC_URL,
  BASE_SEPOLIA_RPC_URL: process.env.BASE_SEPOLIA_RPC_URL,
} as const;

// Validation functions
export function validateServerEnv() {
  const required = [
    'MONGODB_URI',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
  ];

  const missing = required.filter(key => !serverEnv[key as keyof typeof serverEnv]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required server environment variables: ${missing.join(', ')}`);
  }

  // Optional but recommended
  const recommended = [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'COINGECKO_API_KEY',
    'STREAM_VIDEO_SECRET_KEY',
    'STREAM_CHAT_SECRET_KEY',
  ];

  const missingRecommended = recommended.filter(key => !serverEnv[key as keyof typeof serverEnv]);
  
  if (missingRecommended.length > 0) {
    console.info(`ℹ️ Optional environment variables not set: ${missingRecommended.join(', ')}`);
  }

  return missing.length === 0;
}

export function validateClientEnv() {
  const required = [
    'NEXT_PUBLIC_BASE_URL',
  ];

  const missing = required.filter(key => !clientEnv[key as keyof typeof clientEnv]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required client environment variables: ${missing.join(', ')}`);
  }

  return missing.length === 0;
}

// Feature flags based on environment variables
export const features = {
  hasAIChat: !!serverEnv.OPENAI_API_KEY || !!serverEnv.GEMINI_API_KEY,
  hasVideoConsultation: !!serverEnv.STREAM_VIDEO_SECRET_KEY && !!clientEnv.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
  hasEmailNotifications: !!serverEnv.NODEMAILER_EMAIL && !!serverEnv.NODEMAILER_PASSWORD,
  hasBaseIntegration: !!clientEnv.NEXT_PUBLIC_BASE_RPC_URL && !!clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY,
  hasCryptoData: !!serverEnv.COINGECKO_API_KEY,
  hasStockData: !!serverEnv.FINNHUB_API_KEY || !!clientEnv.NEXT_PUBLIC_FINNHUB_API_KEY,
} as const;

// API Base URLs
export const apiUrls = {
  FINNHUB: process.env.FINNHUB_BASE_URL || 'https://finnhub.io/api/v1',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  ALCHEMY: clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY
    ? `https://base-mainnet.g.alchemy.com/v2/${clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : '',
  BASE_SEPOLIA: clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY
    ? `https://base-sepolia.g.alchemy.com/v2/${clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : '',
} as const;

// Export all as a single config object
export const env = {
  server: serverEnv,
  client: clientEnv,
  rpc: rpcUrls,
  features,
  apiUrls,
} as const;

export default env;
