#!/bin/bash
# Convert SVG artwork to transparent PNG at Printify-ready resolution.
#
# Uses system-installed DM Sans font for accurate rendering.
# Requires: rsvg-convert (from librsvg) or falls back to sips
#
# Usage:
#   ./scripts/artwork-to-png.sh printify-artwork/town-tee-front.svg 4500
#   ./scripts/artwork-to-png.sh printify-artwork/my-design.svg      [width, default 4500]

set -e

SVG="$1"
WIDTH="${2:-4500}"

if [ -z "$SVG" ]; then
  echo "Usage: $0 <svg-file> [width]"
  exit 1
fi

if [ ! -f "$SVG" ]; then
  echo "File not found: $SVG"
  exit 1
fi

BASENAME=$(basename "$SVG" .svg)
OUTDIR=$(dirname "$SVG")
OUTPUT="${OUTDIR}/${BASENAME}-${WIDTH}.png"

# Try rsvg-convert first (best SVG rendering, preserves transparency)
if command -v rsvg-convert &>/dev/null; then
  echo "Using rsvg-convert..."
  rsvg-convert -w "$WIDTH" --keep-aspect-ratio "$SVG" -o "$OUTPUT"
  echo "Saved: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
  echo "Dimensions: $(sips -g pixelWidth -g pixelHeight "$OUTPUT" 2>/dev/null | grep pixel | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')"
# Fallback to sips (macOS built-in, but limited SVG support)
else
  echo "rsvg-convert not found. Install with: brew install librsvg"
  echo "Falling back to sips (may not render fonts correctly)..."
  # sips can convert SVG but doesn't handle custom fonts well
  sips -s format png "$SVG" --out "$OUTPUT" --resampleWidth "$WIDTH" 2>/dev/null
  echo "Saved: $OUTPUT"
  echo "WARNING: sips may not render DM Sans correctly. Install librsvg for better results."
fi
