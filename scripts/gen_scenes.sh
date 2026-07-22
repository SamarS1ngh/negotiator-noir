#!/usr/bin/env bash
# Backstory scene backgrounds for the cold-open. Peopleless establishing shots,
# own locked seeds. The PAST is warm/golden/nostalgic; the PRESENT is cold/noir —
# the contrast is the whole point.
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="korean manhwa webtoon panel, clean cel-shaded digital art, crisp confident linework, flat vibrant colors, sharp detail, dramatic cinematic lighting, high production, no text, no words"
D=public/assets/art/scene
mkdir -p "$D"

gen() { # gen <out> <seed> <desc-with-its-own-palette>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $BASE")
  if curl -fsSL -m 200 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=820&height=1200&nologo=true&seed=$2&model=flux-anime"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL(notimg) $1"
  else echo "FAIL(curl) $1"; fi
  sleep 7
}

gen $D/before.jpg 701 "a warm cozy 1940s ship chandlery shop interior at golden dusk, coils of rope and brass oil lanterns and wooden shelves, ledgers on a worn counter, dust motes drifting in warm amber lamplight, nostalgic safe and lived-in, warm sepia and amber palette"
gen $D/now.jpg    702 "a cold rainy dockyard at night, wet black cobblestones reflecting a single distant gas lamp, looming dark warehouses and ship hulls, drifting fog, lonely and menacing, desaturated muted teal and steel palette"
echo "=== scenes done ==="; ls -la $D
