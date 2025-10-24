import { NextRequest, NextResponse } from 'next/server';

const FRAME_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'https://hodl-portfolio-tracker.vercel.app';

export async function GET(req: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HODL Portfolio Tracker</title>
    
    <!-- Farcaster Frame Meta Tags -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/portfolio/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="View Portfolio" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${FRAME_URL}/miniapp" />
    <meta property="fc:frame:button:2" content="Swap Assets" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:3" content="Refresh" />
    <meta property="fc:frame:button:3:action" content="post" />
    <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame/portfolio" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="HODL Portfolio Tracker" />
    <meta property="og:description" content="Track stocks and crypto, execute cross-asset swaps on Base" />
    <meta property="og:image" content="${FRAME_URL}/api/frame/portfolio/image" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HODL Portfolio Tracker" />
    <meta name="twitter:description" content="Unified portfolio tracker on Base" />
    <meta name="twitter:image" content="${FRAME_URL}/api/frame/portfolio/image" />
  </head>
  <body>
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-center;
      background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      text-align: center;
    ">
      <div>
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(to right, #FFB800, #FFA000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          HODL
        </h1>
        <p style="font-size: 1.25rem; color: #888; margin-bottom: 2rem;">
          Portfolio Tracker on Base
        </p>
        <p style="color: #666;">
          View this frame in Farcaster to interact
        </p>
      </div>
    </div>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract Farcaster frame data
    const { untrustedData } = body;
    const { fid, buttonIndex } = untrustedData || {};

    // Handle button clicks
    if (buttonIndex === 2) {
      // Redirect to swap frame
      const swapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/swap/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="Stock → Crypto" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:2" content="Crypto → Stock" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:3" content="Open Full App" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="${FRAME_URL}/dashboard/trade" />
    <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame/swap" />
  </head>
  <body>
    <p>Ready to swap assets</p>
  </body>
</html>
      `;
      
      return new NextResponse(swapHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Button 3 or default: Refresh portfolio view
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/portfolio/image?fid=${fid || 'demo'}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="Open App" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${FRAME_URL}/miniapp" />
    <meta property="fc:frame:button:2" content="Swap Assets" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame/portfolio" />
  </head>
  <body>
    <p>Portfolio updated for user ${fid || 'demo'}</p>
  </body>
</html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Frame processing failed' }, { status: 500 });
  }
}

