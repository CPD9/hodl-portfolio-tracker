import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const step = searchParams.get('step') || 'select';
    const from = searchParams.get('from') || 'BTC';
    const to = searchParams.get('to') || 'AAPL';
    const amount = searchParams.get('amount') || '0.5';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #1a1a1a, #0a0a0a)',
            padding: '60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '50px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #10B981, #3B82F6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              HODL Swap
            </div>
          </div>

          {/* Swap Visual */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              marginBottom: '50px',
            }}
          >
            {/* From Token */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px',
                background: 'rgba(138, 77, 255, 0.1)',
                borderRadius: '30px',
                border: '3px solid rgba(138, 77, 255, 0.3)',
              }}
            >
              <div style={{ fontSize: 32, color: '#8A4DFF', marginBottom: '16px' }}>
                From
              </div>
              <div style={{ fontSize: 72, fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                {from}
              </div>
              <div style={{ fontSize: 40, color: '#ccc' }}>
                {amount}
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                fontSize: 80,
                color: '#0FEDBE',
              }}
            >
              →
            </div>

            {/* To Token */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px',
                background: 'rgba(255, 184, 0, 0.1)',
                borderRadius: '30px',
                border: '3px solid rgba(255, 184, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: 32, color: '#FFB800', marginBottom: '16px' }}>
                To
              </div>
              <div style={{ fontSize: 72, fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                {to}
              </div>
              <div style={{ fontSize: 40, color: '#0FEDBE' }}>
                ≈ {(parseFloat(amount) * 250).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '30px 60px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
            }}
          >
            <div style={{ fontSize: 28, color: '#888', marginBottom: '12px' }}>
              Exchange Rate
            </div>
            <div style={{ fontSize: 40, fontWeight: 'bold', color: '#fff' }}>
              1 {from} = 250 {to}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              fontSize: 24,
              color: '#666',
            }}
          >
            Cross-Asset Swaps • Built on Base Sepolia
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Swap image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

