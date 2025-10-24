import { NextResponse } from 'next/server';

// Extract base URL to avoid duplication
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_FRAME_URL || 'https://hodl-portfolio-tracker.vercel.app';

export async function GET() {
  // NOTE: This is a simplified version. The canonical manifest is at /.well-known/farcaster.json
  // which follows the complete Base Build specification
  const config = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    frame: {
      version: "next",
      imageUrl: `${BASE_URL}/api/frame/portfolio/image`,
      button: {
        title: "Launch HODL",
        action: {
          type: "launch_frame",
          name: "HODL Portfolio",
          url: `${BASE_URL}/miniapp`,
          splashImageUrl: `${BASE_URL}/favicon.ico`,
          splashBackgroundColor: "#0F0F0F"
        }
      }
    },
    miniapp: {
      name: "HODL Portfolio Tracker",
      description: "Unified stock and crypto portfolio tracker with cross-asset swaps on Base Sepolia testnet",
      icon: `${BASE_URL}/favicon.ico`,
      url: `${BASE_URL}/miniapp`,
      homeUrl: `${BASE_URL}/`,
      version: "1.0.0",
      categories: ["finance", "defi", "portfolio"],
      chain: "base-sepolia",
      screenshots: [],
      // Base Sepolia deployed contracts
      contracts: [
        {
          address: "0x334dFeb48aEC27fCb75249e77F546B687cC6aB94",
          chainId: 84532,
          name: "AAPL Stock Token"
        },
        {
          address: "0x3FF7a28970832F0B31ba496545a000971becFCC2",
          chainId: 84532,
          name: "TSLA Stock Token"
        },
        {
          address: "0x4833D6D51b64f93B6708088c90aB6E138b6A1547",
          chainId: 84532,
          name: "StockCryptoSwap"
        }
      ]
    },
    baseBuilder: {
      ownerAddress: "0x55345C8B7F6Fcd3b7366bE7A941C02e2003B2F52"
    }
  };

  return NextResponse.json(config, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
