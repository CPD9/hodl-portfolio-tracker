# Farcaster Mini App - Required Images

## ⚠️ Important: Images Need to Be Created

Before deploying your Mini App to production, you need to create the following images and place them in the `public/` directory.

## Required Images

### 1. **App Icon** - `icon-512x512.png`
- **Size**: 1024×1024px (will be scaled to 512×512px)
- **Format**: PNG
- **Background**: Solid color (transparent NOT recommended)
- **Purpose**: Main app icon shown in app listings and search results
- **Design Tips**:
  - Use your HODL logo
  - Keep it simple and recognizable at small sizes
  - Ensure good contrast

### 2. **Splash Screen** - `splash-200x200.png`
- **Size**: 200×200px
- **Format**: PNG
- **Background**: Transparent or solid color (matches splashBackgroundColor in manifest)
- **Purpose**: Shown while your Mini App loads
- **Design Tips**:
  - Can be a simplified version of your logo
  - Works with black background (#000000)

### 3. **Hero Image** - `hero-1200x630.png`
- **Size**: 1200×630px (1.91:1 ratio)
- **Format**: PNG or JPG
- **Purpose**: Large promotional image on your Mini App's profile page
- **Design Tips**:
  - Showcase your app's main features
  - Include app name/branding
  - Use eye-catching visuals

### 4. **OG Image** - `og-1200x630.png`
- **Size**: 1200×630px (1.91:1 ratio)
- **Format**: PNG or JPG
- **Purpose**: Social sharing preview (Twitter, Facebook, etc.)
- **Design Tips**:
  - Can be the same as hero image
  - Include app name and tagline
  - Test how it looks on different platforms

### 5. **App Screenshots** (3 required)
- `screenshot-1.png`
- `screenshot-2.png`
- `screenshot-3.png`
- **Size**: 1284×2778px (portrait orientation)
- **Format**: PNG
- **Purpose**: Show app functionality in app store listing
- **Design Tips**:
  - Use actual app screenshots
  - Show key features (Dashboard, Portfolio, Trading)
  - Add descriptive captions if helpful

## Quick Setup Guide

### Option 1: Use Mini App Assets Generator (Recommended)
Visit https://www.miniappassets.com/ to automatically generate properly formatted images from your logo or screenshots.

### Option 2: Use Existing Assets
If you have existing brand assets:

1. **For Icons**:
   ```bash
   # Resize your logo to required sizes
   # Place in public/ directory
   ```

2. **For Screenshots**:
   - Open your deployed app on mobile
   - Take screenshots of key pages
   - Resize to 1284×2778px
   - Place in public/ directory

### Option 3: Temporary Placeholders (Development Only)
For testing purposes, you can use solid color placeholders:

```bash
# Install ImageMagick (if not already installed)
brew install imagemagick

# Generate placeholder images
convert -size 1024x1024 xc:#FFB800 public/icon-512x512.png
convert -size 200x200 xc:#FFB800 public/splash-200x200.png
convert -size 1200x630 xc:#FFB800 -pointsize 72 -fill black -gravity center -annotate +0+0 "HODL" public/hero-1200x630.png
convert -size 1200x630 xc:#FFB800 -pointsize 72 -fill black -gravity center -annotate +0+0 "HODL" public/og-1200x630.png
convert -size 1284x2778 xc:#FFB800 -pointsize 100 -fill black -gravity center -annotate +0+0 "Screenshot 1" public/screenshot-1.png
convert -size 1284x2778 xc:#FFB800 -pointsize 100 -fill black -gravity center -annotate +0+0 "Screenshot 2" public/screenshot-2.png
convert -size 1284x2778 xc:#FFB800 -pointsize 100 -fill black -gravity center -annotate +0+0 "Screenshot 3" public/screenshot-3.png
```

**⚠️ Replace placeholders with real images before production launch!**

## Verification

After creating all images:

1. Verify all files exist:
   ```bash
   ls -lh public/*.png
   ```

2. Check file sizes are reasonable:
   - Icons: < 100KB
   - Screenshots: < 500KB each
   - Hero/OG images: < 300KB

3. Test images are accessible:
   ```bash
   npm run dev
   # Visit http://localhost:3001/icon-512x512.png
   # etc.
   ```

4. Validate manifest references:
   ```bash
   npm run validate:farcaster
   ```

## Current Status

- [ ] `icon-512x512.png` - NOT CREATED
- [ ] `splash-200x200.png` - NOT CREATED
- [ ] `hero-1200x630.png` - NOT CREATED
- [ ] `og-1200x630.png` - NOT CREATED
- [ ] `screenshot-1.png` - NOT CREATED
- [ ] `screenshot-2.png` - NOT CREATED
- [ ] `screenshot-3.png` - NOT CREATED

**Action Required**: Create these images before deploying to production.

## Next Steps

Once all images are created:

1. Add and commit the images:
   ```bash
   git add public/*.png
   git commit -m "feat: add Farcaster Mini App images"
   ```

2. Deploy to production

3. Test images are accessible at your domain:
   - https://hodl-portfolio-tracker.vercel.app/icon-512x512.png
   - etc.

4. Continue with [Farcaster Setup Guide](./FARCASTER_SETUP.md)
