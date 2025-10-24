import { NextRequest, NextResponse } from 'next/server';

const FRAME_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'https://hodl-portfolio-tracker.vercel.app';

export async function GET(req: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HODL Swap - Cross-Asset Trading</title>
    
    <!-- Farcaster Frame Meta Tags -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/swap/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="Swap Stock → Crypto" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:2" content="Swap Crypto → Stock" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:3" content="Open Full App" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="${FRAME_URL}/dashboard/trade" />
    <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame/swap" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="HODL Swap - Cross-Asset Trading" />
    <meta property="og:description" content="Swap between stocks and crypto seamlessly on Base" />
    <meta property="og:image" content="${FRAME_URL}/api/frame/swap/image" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HODL Swap" />
    <meta name="twitter:description" content="Cross-asset swaps on Base" />
    <meta name="twitter:image" content="${FRAME_URL}/api/frame/swap/image" />
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
        <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(to right, #10B981, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          HODL Swap
        </h1>
        <p style="font-size: 1.25rem; color: #888; margin-bottom: 2rem;">
          Cross-Asset Trading on Base
        </p>
        <p style="color: #666;">
          View this frame in Farcaster to start swapping
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

