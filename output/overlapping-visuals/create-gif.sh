#!/bin/bash
set -euo pipefail
SOURCE="${1:-/Users/darmar/Documents/general visuals}"
OUTPUT="${2:-/Users/darmar/reveal.js/output/overlapping-visuals/overlapping-visuals-1920x1080.gif}"
TMP=$(mktemp -d)
# All supported images, in filename order; use the first frame of existing GIFs.
files=()
while IFS= read -r -d '' file; do
  files+=("$file")
done < <(find "$SOURCE" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.gif' -o -iname '*.svg' -o -iname '*.avif' -o -iname '*.tif' -o -iname '*.tiff' \) -print0 | sort -z)
count=${#files[@]}
if (( count == 0 )); then echo 'No images found.' >&2; exit 1; fi
for ((i=0; i<count; i++)); do
  # Resize directly from the source: preserve aspect ratio and never upscale.
  magick "${files[i]}[0]" -auto-orient -filter Lanczos -resize '1200x740>' \
    -colorspace sRGB -strip -background white -alpha remove -alpha off -bordercolor white -border 8 \
    \( +clone -background black -shadow 22x8+0+6 \) \
    +swap -background none -layers merge +repage "$TMP/card-$i.png"
done
# Cycle through three offset positions, preserving the previous two cards.
x=(110 600 350)
y=(45 160 290)
for ((i=0; i<count; i++)); do
  args=(-size 1920x1080 xc:'#eeeae5')
  for ((back=2; back>=0; back--)); do
    index=$(( (i-back+count)%count ))
    slot=$((index%3))
    args+=( "$TMP/card-$index.png" -gravity northwest -geometry "+${x[slot]}+${y[slot]}" -compose over -composite )
  done
  printf -v frame '%s/frame-%03d.png' "$TMP" "$i"
  magick "${args[@]}" "$frame"
done
magick -delay 55 -dispose none "$TMP"/frame-*.png \
  -loop 0 -layers Optimize "$OUTPUT"
echo "Created $OUTPUT using $count images."
echo "Temporary frames: $TMP"
