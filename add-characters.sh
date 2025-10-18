#!/bin/bash

echo "=========================================="
echo "HODL Character GIF Setup"
echo "=========================================="
echo ""

CHAR_DIR="public/assets/characters"

echo "This script will help you add your animated GIF characters."
echo ""
echo "Current directory: $(pwd)"
echo "Characters directory: $CHAR_DIR"
echo ""

# Check if characters directory exists
if [ ! -d "$CHAR_DIR" ]; then
    echo "Error: Characters directory not found!"
    echo "Please run this script from the project root."
    exit 1
fi

echo "Files needed:"
echo "  1. hero-solo.gif   - Main character with animated head"
echo "  2. hero-group.gif  - Group of characters"
echo "  3. bull.gif        - Bull market indicator"
echo "  4. bear.gif        - Bear market indicator"
echo "  5. trader.gif      - (Optional) Trader character"
echo ""

# Check current status
echo "Current status:"
echo "----------------------------------------"
if [ -f "$CHAR_DIR/hero-solo.gif" ]; then
    echo "✅ hero-solo.gif found"
else
    echo "❌ hero-solo.gif missing"
fi

if [ -f "$CHAR_DIR/hero-group.gif" ]; then
    echo "✅ hero-group.gif found"
else
    echo "❌ hero-group.gif missing"
fi

if [ -f "$CHAR_DIR/bull.gif" ]; then
    echo "✅ bull.gif found"
else
    echo "❌ bull.gif missing"
fi

if [ -f "$CHAR_DIR/bear.gif" ]; then
    echo "✅ bear.gif found"
else
    echo "❌ bear.gif missing"
fi

if [ -f "$CHAR_DIR/trader.gif" ]; then
    echo "✅ trader.gif found"
else
    echo "⚠️  trader.gif missing (optional)"
fi

echo "----------------------------------------"
echo ""

# Interactive mode
echo "Would you like to copy GIF files now? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Please provide the path to your GIF files:"
    echo ""
    
    echo "Path to hero-solo.gif (or press Enter to skip):"
    read -r hero_solo
    if [ -n "$hero_solo" ] && [ -f "$hero_solo" ]; then
        cp "$hero_solo" "$CHAR_DIR/hero-solo.gif"
        echo "✅ Copied hero-solo.gif"
    fi
    
    echo "Path to hero-group.gif (or press Enter to skip):"
    read -r hero_group
    if [ -n "$hero_group" ] && [ -f "$hero_group" ]; then
        cp "$hero_group" "$CHAR_DIR/hero-group.gif"
        echo "✅ Copied hero-group.gif"
    fi
    
    echo "Path to bull.gif (or press Enter to skip):"
    read -r bull
    if [ -n "$bull" ] && [ -f "$bull" ]; then
        cp "$bull" "$CHAR_DIR/bull.gif"
        echo "✅ Copied bull.gif"
    fi
    
    echo "Path to bear.gif (or press Enter to skip):"
    read -r bear
    if [ -n "$bear" ] && [ -f "$bear" ]; then
        cp "$bear" "$CHAR_DIR/bear.gif"
        echo "✅ Copied bear.gif"
    fi
    
    echo ""
    echo "✅ Done! Files copied to $CHAR_DIR"
else
    echo ""
    echo "Manual copy instructions:"
    echo "1. Open Finder"
    echo "2. Navigate to: $(pwd)/$CHAR_DIR"
    echo "3. Drag your GIF files there"
    echo "4. Rename them to match the required names"
fi

echo ""
echo "=========================================="
echo "Next steps:"
echo "1. Verify files are in place: ls -la $CHAR_DIR"
echo "2. Restart dev server: npm run dev"
echo "3. Hard refresh browser: Cmd+Shift+R"
echo "=========================================="

