# AI Chat Feature Setup

## Overview

The AI Chat feature provides an interactive assistant called "Hodlini" that helps users:
- Get personalized crypto recommendations based on stock interests
- Receive portfolio management advice
- Learn about Base blockchain and DeFi
- Navigate the platform

## Installation Complete ✅

The `openai` package has been installed automatically.

## Environment Variable Required

Add this to your `.env` file:

```env
# OpenAI API (for AI Chat Assistant - Hodlini)
OPENAI_API_KEY=your_openai_api_key_here
```

## How to Get OpenAI API Key

### Option 1: OpenAI API (Recommended)

1. Go to https://platform.openai.com/signup
2. Sign up or log in
3. Navigate to API Keys: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. Add to `.env`: `OPENAI_API_KEY=sk-...`

**Cost**: 
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Very affordable for hackathon/demo purposes
- You get $5 free credits initially

### Option 2: Use Gemini Instead (Alternative)

Since you already have a Gemini API key, you could modify the chat to use Gemini instead of OpenAI. This would save costs!

To do this, update `app/api/chat/route.ts` to use Google's Gemini API (similar to how it's used in other parts of the app).

## Chat Feature Details

**Model Used**: `gpt-4o-mini` (fast and cost-effective)
**Max Tokens**: 500 per response
**Character**: "Hodlini" - Your crypto portfolio assistant

**Features**:
- Personalized crypto recommendations
- Portfolio advice
- Trading insights
- Base blockchain info
- Platform navigation help

## Testing the Chat

Once you add the API key:

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Look for the chat overlay icon (usually bottom-right)
3. Click to open the chat
4. Start asking questions!

**Example Questions**:
- "What crypto is similar to NVIDIA stock?"
- "How does Base blockchain work?"
- "Should I invest in AI tokens?"
- "Explain my portfolio performance"

## If You Don't Want the Chat Feature

If you prefer to skip this feature for the demo:

1. **Option A**: Add a dummy key to prevent errors:
   ```env
   OPENAI_API_KEY=sk-dummy-key-for-testing
   ```
   The chat will show but won't work.

2. **Option B**: Remove the chat component:
   - Remove `components/AIChatOverlay.tsx` import from layouts
   - The app will work without the chat feature

## Cost Estimation for Demo

For a hackathon demo:
- ~100 chat messages
- Average 300 tokens per response
- Cost: ~$0.02 (2 cents)

Very affordable! But you can also use the free Gemini API if you prefer.

## Current Status

- ✅ Package installed (`openai`)
- ⏳ Needs API key in `.env`
- ⏳ Restart dev server after adding key

## Summary

**Required**: `OPENAI_API_KEY` in your `.env` file

**Where to get it**: https://platform.openai.com/api-keys

**Alternative**: Use Gemini instead (you already have the key)

---

Need help? Check the main README.md or let me know!

