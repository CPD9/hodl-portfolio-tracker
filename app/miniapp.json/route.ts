import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NTUzNDVDMEI4N0Y2Q2QzMDdDZDNCMkU3QTA5NDFDMDA2QjNCMkY1MiJ9"
    },
    frame: {
      version: "next",
      imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hodl-portfolio-tracker.vercel.app'}/api/frame/portfolio/image`,
      button: {
        title: "Launch HODL",
        action: {
          type: "launch_frame",
          name: "HODL Portfolio",
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hodl-portfolio-tracker.vercel.app'}/miniapp`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hodl-portfolio-tracker.vercel.app'}/favicon.ico`,
          splashBackgroundColor: "#0F0F0F"
        }
      }
    },
    miniapp: {
      name: "HODL Portfolio Tracker",
      description: "Unified stock and crypto portfolio tracker with cross-asset swaps on Base",
      icon: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hodl-portfolio-tracker.vercel.app'}/favicon.ico`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hodl-portfolio-tracker.vercel.app'}/miniapp`,
      version: "1.0.0",
      categories: ["finance", "defi", "portfolio"],
      screenshots: []
    },
    baseBuilder: {
      ownerAddress: "0x55345C0B87F6Cd307Cd3B2E7A0941C002B3B2F52"
    }
  };

  return NextResponse.json(config, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

