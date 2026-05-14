#!/usr/bin/env bash
# ─── Nocturne — Favicon & OG image setup ─────────────────────────────────────
#
# Usage:
#   1. Put these two files in ~/Downloads/:
#        favicon-source.png   (512×512, crescent logo on #050505 background)
#        og-image.png         (1200×630, cinematic Nocturne editorial image)
#
#   2. Run from the project root:
#        bash scripts/setup-favicons.sh
#
# Requires: ImageMagick (brew install imagemagick)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

FAVICON_SRC="$HOME/Downloads/favicon-source.png"
OG_SRC="$HOME/Downloads/og-image.png"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)/app"

# ── Dependency check ──────────────────────────────────────────────────────────
if command -v magick &> /dev/null; then
  CONVERT="magick"
elif command -v convert &> /dev/null; then
  CONVERT="convert"
else
  echo "❌  ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

# ── Source file check ─────────────────────────────────────────────────────────
if [[ ! -f "$FAVICON_SRC" ]]; then
  echo "❌  Missing: $FAVICON_SRC"
  echo "   Generate a 512×512 PNG of the Nocturne crescent logo and put it there."
  exit 1
fi

if [[ ! -f "$OG_SRC" ]]; then
  echo "❌  Missing: $OG_SRC"
  echo "   Generate a 1200×630 PNG for the Open Graph preview and put it there."
  exit 1
fi

echo "→ Source files found. Generating assets in $APP_DIR ..."

# ── favicon.ico (16, 32, 48 px embedded) ─────────────────────────────────────
$CONVERT "$FAVICON_SRC" -define icon:auto-resize=16,32,48 "$APP_DIR/favicon.ico"
echo "  ✓ favicon.ico"

# ── icon.png 512×512 (PWA / generic) ─────────────────────────────────────────
$CONVERT "$FAVICON_SRC" -resize 512x512 "$APP_DIR/icon.png"
echo "  ✓ icon.png (512×512)"

# ── apple-icon.png 180×180 (iOS Add to Home Screen) ──────────────────────────
$CONVERT "$FAVICON_SRC" -resize 180x180 "$APP_DIR/apple-icon.png"
echo "  ✓ apple-icon.png (180×180)"

# ── opengraph-image.png 1200×630 ─────────────────────────────────────────────
WIDTH=$($CONVERT "$OG_SRC" -ping -format "%w" info: 2>/dev/null || echo 0)
HEIGHT=$($CONVERT "$OG_SRC" -ping -format "%h" info: 2>/dev/null || echo 0)

if [[ "$WIDTH" -eq 1200 && "$HEIGHT" -eq 630 ]]; then
  cp "$OG_SRC" "$APP_DIR/opengraph-image.png"
  echo "  ✓ opengraph-image.png (already 1200×630, copied as-is)"
else
  $CONVERT "$OG_SRC" -resize 1200x630! "$APP_DIR/opengraph-image.png"
  echo "  ✓ opengraph-image.png (resized from ${WIDTH}×${HEIGHT} → 1200×630)"
fi

# ── twitter-image.png (same as OG) ───────────────────────────────────────────
cp "$APP_DIR/opengraph-image.png" "$APP_DIR/twitter-image.png"
echo "  ✓ twitter-image.png (copy of OG image)"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "All assets written to app/ :"
ls -lh "$APP_DIR/favicon.ico" "$APP_DIR/icon.png" "$APP_DIR/apple-icon.png" \
        "$APP_DIR/opengraph-image.png" "$APP_DIR/twitter-image.png"
echo ""
echo "Next steps:"
echo "  git add app/favicon.ico app/icon.png app/apple-icon.png"
echo "  git add app/opengraph-image.png app/twitter-image.png"
echo "  git commit -m 'assets: favicon, apple-icon, og-image'"
