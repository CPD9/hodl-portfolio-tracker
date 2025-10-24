import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_FRAME_URL || 'https://hodl-portfolio-tracker.vercel.app';
  
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NTUzNDVDMEI4N0Y2Q2QzMDdDZDNCMkU3QTA5NDFDMDA2QjNCMkY1MiJ9"
    },
    frame: {
      version: "next",
      imageUrl: `${baseUrl}/api/frame/portfolio/image`,
      button: {
        title: "Launch HODL",
        action: {
          type: "launch_frame",
          name: "HODL Portfolio",
          url: `${baseUrl}/miniapp`,
          splashImageUrl: `${baseUrl}/favicon.ico`,
          splashBackgroundColor: "#0F0F0F"
        }
      }
    },
    miniapp: {
      name: "HODL Portfolio Tracker",
      description: "Unified stock and crypto portfolio tracker with cross-asset swaps on Base",
      icon: `${baseUrl}/favicon.ico`,
      url: `${baseUrl}/miniapp`,
      homeUrl: `${baseUrl}`,
      version: "1.0.0",
      categories: ["finance", "defi", "portfolio", "trading"],
      chain: "base-sepolia",
      // Note: Contract addresses are for Base Sepolia testnet (chainId: 84532)
      // Verify at: https://base-sepolia.blockscout.com/address/[ADDRESS]
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
      ownerAddress: "0x55345C8B7F6Fcd3b7366bE7A941C02e2003B2F52",
      networkId: 84532,
      networkName: "base-sepolia"
    }
  };

  return NextResponse.json(config, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

