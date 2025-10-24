import { NextRequest, NextResponse } from 'next/server';

const FRAME_URL = process.env.NEXT_PUBLIC_FRAME_URL || 'https://hodl-portfolio-tracker.vercel.app';

interface SwapState {
  step: 'select' | 'amount' | 'confirm';
  fromToken: string;
  toToken: string;
  amount: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract Farcaster frame data
    const { untrustedData, trustedData } = body;
    const { fid, buttonIndex, inputText } = untrustedData || {};

    // Parse state from URL or initialize
    const { searchParams } = new URL(req.url);
    const state: SwapState = {
      step: (searchParams.get('step') as SwapState['step']) || 'select',
      fromToken: searchParams.get('from') || 'BTC',
      toToken: searchParams.get('to') || 'AAPL',
      amount: searchParams.get('amount') || '0.5',
    };

    // Handle button interactions
    let newState = { ...state };

    if (state.step === 'select') {
      // Button 1: Stock → Crypto
      // Button 2: Crypto → Stock
      if (buttonIndex === 1) {
        newState = { ...state, step: 'amount', fromToken: 'AAPL', toToken: 'ETH' };
      } else if (buttonIndex === 2) {
        newState = { ...state, step: 'amount', fromToken: 'BTC', toToken: 'NVDA' };
      }
    } else if (state.step === 'amount') {
      // User entered amount, move to confirm
      if (inputText) {
        newState = { ...state, step: 'confirm', amount: inputText };
      }
    } else if (state.step === 'confirm') {
      // Execute swap
      if (buttonIndex === 1) {
        // Confirmed - would execute on-chain swap here
        // For demo, just show success
        return generateSuccessFrame(newState, fid);
      } else if (buttonIndex === 2) {
        // Cancel - go back to select
        newState = { ...state, step: 'select' };
      }
    }

    return generateFrame(newState);
  } catch (error) {
    console.error('Swap frame error:', error);
    return NextResponse.json({ error: 'Frame processing failed' }, { status: 500 });
  }
}

function generateFrame(state: SwapState): NextResponse {
  const { step, fromToken, toToken, amount } = state;
  const stateParams = new URLSearchParams({
    step,
    from: fromToken,
    to: toToken,
    amount,
  }).toString();

  let buttons = '';
  let input = '';

  if (step === 'select') {
    buttons = `
      <meta property="fc:frame:button:1" content="Stock → Crypto" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:2" content="Crypto → Stock" />
      <meta property="fc:frame:button:2:action" content="post" />
      <meta property="fc:frame:button:3" content="Open Full App" />
      <meta property="fc:frame:button:3:action" content="link" />
      <meta property="fc:frame:button:3:target" content="${FRAME_URL}/dashboard/trade" />
    `;
  } else if (step === 'amount') {
    buttons = `
      <meta property="fc:frame:button:1" content="Continue" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:2" content="Cancel" />
      <meta property="fc:frame:button:2:action" content="post" />
      <meta property="fc:frame:button:2:target" content="${FRAME_URL}/api/frame/swap" />
    `;
    input = `<meta property="fc:frame:input:text" content="Enter amount (e.g., 0.5)" />`;
  } else if (step === 'confirm') {
    buttons = `
      <meta property="fc:frame:button:1" content="✓ Confirm Swap" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:2" content="Cancel" />
      <meta property="fc:frame:button:2:action" content="post" />
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/swap/image?${stateParams}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    ${input}
    ${buttons}
    <meta property="fc:frame:post_url" content="${FRAME_URL}/api/frame/swap?${stateParams}" />
  </head>
  <body>
    <p>Swap ${fromToken} for ${toToken}</p>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

function generateSuccessFrame(state: SwapState, fid: string | undefined): NextResponse {
  const { fromToken, toToken, amount } = state;

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_URL}/api/frame/swap/success?from=${fromToken}&to=${toToken}&amount=${amount}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="View Portfolio" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${FRAME_URL}/miniapp" />
    <meta property="fc:frame:button:2" content="Swap Again" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${FRAME_URL}/frame/swap" />
  </head>
  <body>
    <p>Swap successful! {amount} ${fromToken} → ${toToken}</p>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

