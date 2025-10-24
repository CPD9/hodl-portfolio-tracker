# Environment Variables Documentation

This document describes all environment variables used in the HODL Portfolio Tracker application.

## Required Environment Variables

### Core Application
```env
NODE_ENV=development                    # Application environment (development/production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Application base URL
```

### Database
```env
MONGODB_URI=mongodb+srv://...          # MongoDB connection string
```

### Authentication (Better Auth)
```env
BETTER_AUTH_SECRET=your-secret-key     # Secret key for authentication
BETTER_AUTH_URL=http://localhost:3000  # Base URL for auth callbacks
```

## Optional but Recommended

### Email Notifications (Nodemailer)
```env
NODEMAILER_EMAIL=your-email@gmail.com          # Email address for sending notifications
NODEMAILER_PASSWORD=your-app-password          # App-specific password
```

### AI Services
```env
OPENAI_API_KEY=sk-...                  # OpenAI API key for AI chat features
GEMINI_API_KEY=AIza...                 # Google Gemini API key (alternative AI)
```

### Market Data APIs
```env
# Finnhub (Stock Data)
NEXT_PUBLIC_FINNHUB_API_KEY=your-key   # Finnhub API key (public)
FINNHUB_API_KEY=your-key               # Finnhub API key (server-side, optional)
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# CoinGecko (Crypto Data)
COINGECKO_API_KEY=CG-...               # CoinGecko API key
```

### Base Chain Integration
```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_CHAIN_ID=8453
NEXT_PUBLIC_BASE_EXPLORER_URL=https://basescan.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your-key
```

### Alchemy (Blockchain Data Provider)
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your-key
NEXT_PUBLIC_ALCHEMY_HTTPS=https://base-sepolia.g.alchemy.com/v2/your-key
```

### Coinbase OnchainKit
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-key
```

### Stream (Video & Chat)
```env
# Video Consultations
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your-key
STREAM_VIDEO_SECRET_KEY=your-secret-key

# Chat Features
STREAM_CHAT_API_KEY=your-key
STREAM_CHAT_SECRET_KEY=your-secret-key
```

### Smart Contract Deployment (Development Only)
```env
PRIVATE_KEY=your-private-key           # ⚠️ NEVER commit this in production!
```

## Feature Flags

The application automatically enables/disables features based on available environment variables:

- **AI Chat**: Enabled if `OPENAI_API_KEY` or `GEMINI_API_KEY` is set
- **Video Consultations**: Enabled if Stream Video keys are configured
- **Email Notifications**: Enabled if Nodemailer credentials are set
- **Base Integration**: Enabled if Base RPC and Alchemy keys are configured
- **Crypto Data**: Enabled if `COINGECKO_API_KEY` is set
- **Stock Data**: Enabled if Finnhub API key is set

## Security Best Practices

### Public vs Private Variables
- **`NEXT_PUBLIC_*` variables**: Exposed to browser, safe for client-side use
- **Without prefix**: Server-side only, never sent to browser

### Sensitive Keys (Server-side only)
These should NEVER have `NEXT_PUBLIC_` prefix:
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `NODEMAILER_PASSWORD`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `STREAM_VIDEO_SECRET_KEY`
- `STREAM_CHAT_SECRET_KEY`
- `PRIVATE_KEY`
- `BASESCAN_API_KEY`
- `COINGECKO_API_KEY`

### API Keys (Can be public)
These can safely use `NEXT_PUBLIC_` prefix as they're rate-limited and domain-restricted:
- `NEXT_PUBLIC_FINNHUB_API_KEY`
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_STREAM_VIDEO_API_KEY`

## Setup Instructions

1. Copy `.env.example` to `.env` (or create `.env` if it doesn't exist)
2. Fill in all required variables
3. Add optional variables for features you want to enable
4. Restart your development server to apply changes

```bash
npm run dev
```

## Environment Validation

The application validates environment variables on startup. Check the console for:
- ⚠️ Missing required variables
- ℹ️ Missing optional variables

## Production Deployment

When deploying to production:

1. Set all environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Update `NEXT_PUBLIC_BASE_URL` to your production domain
3. Update `BETTER_AUTH_URL` to your production domain
4. Ensure `NODE_ENV=production`
5. Use production API keys (not development/test keys)
6. NEVER commit `.env` files to version control

## Troubleshooting

### Feature Not Working
1. Check if required environment variables are set
2. Restart development server after changing `.env`
3. Check browser console and server logs for validation warnings

### API Rate Limits
- Finnhub: 60 calls/minute (free tier)
- CoinGecko: 10-50 calls/minute (varies by plan)
- Alchemy: 330 compute units/second (free tier)

### Connection Issues
- Verify MongoDB URI is correct and database is accessible
- Check API keys are valid and not expired
- Ensure Base RPC URLs are responsive

## Need Help?

- MongoDB Issues: Check connection string format
- Auth Issues: Verify BETTER_AUTH_SECRET is set and BETTER_AUTH_URL matches your domain
- API Issues: Check API key validity and rate limits
- Base Chain: Ensure Alchemy API key is configured for Base network
