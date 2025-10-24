import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get('fid') || 'demo';

    // Mock portfolio data
    // In production, fetch from database based on FID
    const portfolioData = {
      totalValue: '$124,450',
      change24h: '+5.2%',
      stockValue: '$74,680',
      cryptoValue: '$49,770',
      topHoldings: [
        { symbol: 'AAPL', value: '$28,340', change: '+3.2%' },
        { symbol: 'ETH', value: '$24,880', change: '+6.1%' },
        { symbol: 'NVDA', value: '$18,560', change: '+8.4%' },
      ],
    };

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
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #FFB800, #FFA000)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              HODL
            </div>
          </div>

          {/* Total Value */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div style={{ fontSize: 32, color: '#888', marginBottom: '12px' }}>
              Total Portfolio Value
            </div>
            <div style={{ fontSize: 96, fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
              {portfolioData.totalValue}
            </div>
            <div
              style={{
                fontSize: 40,
                color: '#0FEDBE',
                fontWeight: 'bold',
              }}
            >
              {portfolioData.change24h} 24h
            </div>
          </div>

          {/* Split */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '30px',
                background: 'rgba(255, 184, 0, 0.1)',
                borderRadius: '20px',
                border: '2px solid rgba(255, 184, 0, 0.3)',
              }}
            >
              <div style={{ fontSize: 24, color: '#FFB800', marginBottom: '8px' }}>
                Stocks
              </div>
              <div style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
                {portfolioData.stockValue}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '30px',
                background: 'rgba(138, 77, 255, 0.1)',
                borderRadius: '20px',
                border: '2px solid rgba(138, 77, 255, 0.3)',
              }}
            >
              <div style={{ fontSize: 24, color: '#8A4DFF', marginBottom: '8px' }}>
                Crypto
              </div>
              <div style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
                {portfolioData.cryptoValue}
              </div>
            </div>
          </div>

          {/* Top Holdings */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
            }}
          >
            {portfolioData.topHoldings.map((holding, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 30px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                  {holding.symbol}
                </div>
                <div style={{ fontSize: 24, color: '#ccc', marginBottom: '4px' }}>
                  {holding.value}
                </div>
                <div style={{ fontSize: 20, color: '#0FEDBE' }}>
                  {holding.change}
                </div>
              </div>
            ))}
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
            Built on Base • Powered by OnchainKit
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

