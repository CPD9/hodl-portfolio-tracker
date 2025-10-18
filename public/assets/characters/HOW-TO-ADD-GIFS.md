# How to Add Your Animated GIF Characters

## Quick Steps:

### 1. Save Your GIF Files

Download or save your GIF images with these exact names in this directory:

```
public/assets/characters/
├── hero-solo.gif     ← Your first image (character with animated head)
├── hero-group.gif    ← Your second image (group of characters)
├── bull.gif          ← Bull character (for positive market)
├── bear.gif          ← Bear character (for negative market)
└── trader.gif        ← (Optional) Additional trader character
```

### 2. Using Finder (macOS):

1. Open Finder
2. Navigate to: `Downloads/signalist_stock-tracker-app-main/public/assets/characters/`
3. Drag and drop your GIF files here
4. Rename them to match the names above

### 3. Using Terminal:

```bash
# Navigate to the characters directory
cd /Users/emekadike/Downloads/signalist_stock-tracker-app-main/public/assets/characters/

# Copy your GIFs here (example)
cp ~/Downloads/your-character.gif ./hero-solo.gif
cp ~/Downloads/your-group.gif ./hero-group.gif
cp ~/Downloads/your-bull.gif ./bull.gif
cp ~/Downloads/your-bear.gif ./bear.gif
```

### 4. Verify Files:

Run this command to check if files are in place:
```bash
ls -la public/assets/characters/
```

You should see:
- hero-solo.gif
- hero-group.gif
- bull.gif
- bear.gif

## Important Notes:

✅ **File names must match exactly** (case-sensitive)
✅ **GIF format required** for animations to work
✅ **Recommended size**: 32x32 to 128x128 pixels
✅ **Transparent background** works best

## Current Status:

Right now, the app is showing **fallback SVG placeholders** because the GIF files aren't in the directory yet.

Once you add the GIFs, they will automatically replace the placeholders and animate!

## Testing:

1. Add the GIF files to this directory
2. Refresh your browser (hard refresh: Cmd+Shift+R on Mac)
3. The animated GIFs should now appear throughout the app

## Where Characters Appear:

- **Header** - hero-solo.gif (every page)
- **AI Trading Companion** - hero-solo.gif (animated thinking)
- **Base Wallet Connection** - hero-solo.gif (bouncing when disconnected)
- **Gamification Leaderboard** - hero-group.gif (community aspect)
- **Crypto Heatmap** - bull.gif & bear.gif (market sentiment)

## Need Help?

If the GIFs still don't show after adding them:
1. Check file names match exactly
2. Verify files are actually GIFs (not renamed PNGs)
3. Try a hard refresh in browser (Cmd+Shift+R)
4. Restart the dev server: `npm run dev`

