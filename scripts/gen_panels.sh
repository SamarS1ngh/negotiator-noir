#!/usr/bin/env bash
# Manhwa panels for the prologue — a distinct illustration per key beat, so the
# scene changes with the story (Pa teaching, the public shaming, the father
# broken, the boy leaving). Same noir scene style + locked seeds.
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="korean manhwa webtoon panel, clean cel-shaded digital art, crisp confident linework, flat vibrant colors, sharp detail, dramatic cinematic lighting, high production, no text, no words"
D=public/assets/art/scene
mkdir -p "$D"

gen() { # gen <out> <seed> <desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $STYLE")
  if curl -fsSL -m 220 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=820&height=1200&nologo=true&seed=$2&model=flux-anime"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  else echo "FAIL(curl) $1"; fi
  sleep 7
}

gen $D/shop_teach.jpg  722 "a warm 1940s ship chandlery shop interior at golden dusk, a kindly grey-haired shopkeeper leaning over the wooden counter teaching his attentive teenage son, both watching a bearded sea captain haggle across the counter, warm amber lamplight, coils of rope and brass lanterns, a tender mentoring moment between father and boy"
gen $D/shop_bond.jpg   723 "a warm 1940s ship chandlery interior at dusk, a grey-haired shopkeeper father and his teenage son sharing a quiet close moment by the counter, the father's hand on the boy's shoulder, warm golden lamplight, tender and safe, nostalgic, coils of rope behind them"
gen $D/fall_shame.jpg  724 "a 1940s cobbled street at night outside a ship chandlery, a dark-suited debt collector standing tall speaking loudly and pointing an accusing finger, an older grey-haired shopkeeper standing head-bowed and humiliated on his own doorstep, neighbours watching from doorways and shadows, public shaming, cold blue light and one warm shop window"
gen $D/fall_broken.jpg 725 "a broken grey-haired shopkeeper sitting alone on the stone step of his darkened shuttered shop at night, head bowed in his hands, defeated and ruined, a padlock chained on the door behind him, cold rain, deep despair, empty wet street"
gen $D/depart.jpg      726 "a lone young man standing at the stern of a small riverboat at grey misty dawn, a battered suitcase at his feet, looking back at a shrinking dockside town on the shore, leaving home behind, melancholy and cold, still water"
echo "=== panels done ==="; ls -la $D/shop_teach.jpg $D/shop_bond.jpg $D/fall_shame.jpg $D/fall_broken.jpg $D/depart.jpg
