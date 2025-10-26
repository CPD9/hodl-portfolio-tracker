# Farcaster Mini App Setup Guide

## Overview
This guide walks you through setting up HODL as a Farcaster Mini App on Base.

## Prerequisites
- ✅ Base wallet: `0x55345C8B7F6Fcd3b7366bE7A941C02e2003B2F52`
- ✅ Basename: `cpd99.base.eth`
- ✅ App deployed at: `https://hodl-portfolio-tracker.vercel.app`

## Step 1: Generate Account Association

The `accountAssociation` in the manifest proves you own the domain. Follow these steps:

### 1.1 Deploy the Manifest
First, deploy your app with the current manifest (accountAssociation fields are empty for now):

```bash
git add public/.well-known/farcaster.json
git commit -m "feat: add Farcaster manifest"
git push origin feat/farcaster-miniapp
```

Deploy to Vercel and ensure the manifest is accessible at:
`https://hodl-portfolio-tracker.vercel.app/.well-known/farcaster.json`

### 1.2 Generate Account Association

1. Go to [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)

2. Enter your domain: `hodl-portfolio-tracker.vercel.app`

3. Click **Submit**

4. Click **Verify** and sign with your wallet (`0x55345C8B7F6Fcd3b7366bE7A941C02e2003B2F52`)

5. Copy the generated values:
   - `header`
   - `payload`
   - `signature`

6. Update `public/.well-known/farcaster.json` with the generated values:

```json
{
  "accountAssociation": {
    "header": "YOUR_GENERATED_HEADER",
    "payload": "YOUR_GENERATED_PAYLOAD",
    "signature": "YOUR_GENERATED_SIGNATURE"
  },
  ...
}
```

7. Commit and redeploy

## Step 2: Create Required Image Assets

You need to create the following images:

### Required Images

| Image | Size | Location | Purpose |
|-------|------|----------|---------|
| Icon | 1024×1024px PNG | `public/icon-512x512.png` | App icon (transparent background discouraged) |
| Splash | 200×200px PNG | `public/splash-200x200.png` | Loading screen |
| Hero | 1200×630px PNG/JPG | `public/hero-1200x630.png` | Promotional image |
| OG Image | 1200×630px PNG/JPG | `public/og-1200x630.png` | Social sharing |
| Screenshots | 1284×2778px (portrait) | `public/screenshot-{1,2,3}.png` | App previews |

### Quick Image Generation

Use the [Mini App Assets Generator](https://www.miniappassets.com/) to generate properly formatted images.

**Temporary Placeholder:**
Until you create the images, you can use your existing favicon as a placeholder:

```bash
# Create symlinks to favicon as temporary placeholders
cp public/favicon.ico public/icon-512x512.png
cp public/favicon.ico public/splash-200x200.png
cp public/favicon.ico public/hero-1200x630.png
cp public/favicon.ico public/og-1200x630.png
```

## Step 3: Test Your Mini App

### Local Testing
```bash
npm run dev
# Test manifest accessibility
curl http://localhost:3001/.well-known/farcaster.json
```

### Production Testing

1. **Validate Manifest**: Visit https://hodl-portfolio-tracker.vercel.app/.well-known/farcaster.json

2. **Use Preview Tool**: [Base Build Preview Tool](https://base.dev/preview)
   - Enter your domain
   - Check all validations pass
   - Test the embed rendering

3. **Test in Farcaster**:
   - Share your Mini App URL in a Farcaster post
   - Wait ~10 minutes for indexing
   - Check it appears in Base App search

## Step 4: Enable Mobile Debugging

The Eruda mobile debugger is automatically enabled in development (non-localhost). To test:

1. Deploy to production or use ngrok for local testing
2. Share the mini app in a Farcaster DM to yourself
3. Open in Base App
4. See console logs via Eruda

## Troubleshooting

### Manifest not found (404)
- Ensure `public/.well-known/farcaster.json` exists
- Check Next.js is serving static files from `public/`
- Verify the file is deployed to Vercel

### Changes not appearing
- Farcaster caches manifests for up to 24 hours
- Re-share your URL to trigger a refresh
- Wait ~10 minutes for re-indexing

### App not in search results
- Ensure `primaryCategory` is set
- Check `noindex` is `false`
- Verify `accountAssociation` is complete and valid
- Share the URL in a post to trigger indexing

### Embed not rendering
- Add `fc:frame` meta tags (handled automatically in layout.tsx)
- Use the Embed Tool to validate

## Next Steps

After completing the setup:

1. ✅ Manifest accessible at your domain
2. ✅ Account association verified
3. ✅ All images uploaded
4. ✅ Tested in Preview Tool
5. ✅ Shared in Farcaster for indexing

Your Mini App will appear in:
- Base App search (category: Finance)
- Base App discovery feeds
- Rich embeds when shared

## Resources

- [Base Build Preview Tool](https://base.dev/preview)
- [Account Association Tool](https://base.dev/preview?tab=account)
- [Mini App Assets Generator](https://www.miniappassets.com/)
- [Farcaster Docs](https://docs.farcaster.xyz/)
