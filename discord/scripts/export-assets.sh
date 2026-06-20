#!/usr/bin/env bash
# Export Discord-sized PNGs from the site icon SVG.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SVG="$ROOT/icon.svg"
OUT="$ROOT/discord/assets"

mkdir -p "$OUT"

if command -v rsvg-convert >/dev/null 2>&1; then
  rsvg-convert -w 512 -h 512 "$SVG" -o "$OUT/icon-512.png"
  rsvg-convert -w 128 -h 128 "$SVG" -o "$OUT/icon-128.png"
  echo "Wrote $OUT/icon-512.png and icon-128.png"
elif command -v magick >/dev/null 2>&1; then
  magick -background none -resize 512x512 "$SVG" "$OUT/icon-512.png"
  magick -background none -resize 128x128 "$SVG" "$OUT/icon-128.png"
  echo "Wrote $OUT/icon-512.png and icon-128.png (ImageMagick)"
else
  echo "Install rsvg-convert (librsvg) or ImageMagick to export PNGs." >&2
  echo "Manual fallback: open icon.svg, export 512×512 PNG to discord/assets/icon-512.png" >&2
  exit 1
fi
