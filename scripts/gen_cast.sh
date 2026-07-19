#!/usr/bin/env bash
# Cast portraits for THE WEB board (v0.11 "alive"). Corkboard surveillance-photo
# look, one locked seed per person so each stays consistent. Same glossy-cel
# noir palette as Ricci.
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="noir crime graphic novel portrait, glossy cel-shaded, dramatic low-key lighting, muted teal and amber palette, head and shoulders, plain dark background, sharp detailed eyes, high production"
D=public/assets/art/cast
mkdir -p "$D"

gen() { # gen <out> <seed> <desc>
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $STYLE")
  if curl -fsSL -m 180 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=800&height=1000&nologo=true&seed=$2&model=flux"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  else echo "FAIL(curl) $1"; fi
  sleep 6
}

gen $D/sal.jpg     601 "a thin nervous middle-aged bookkeeper, wire glasses, sweating, glancing sideways, cheap shirt and tie"
gen $D/crew.jpg    611 "a burly weathered dockworker in a flat cap and rough jacket, stubble, wary hard stare"
gen $D/bianchi.jpg 621 "a sharp ambitious younger gangster in a fitted suit, slicked hair, hungry confident smirk"
gen $D/marlowe.jpg 631 "an old cold powerful crime boss in an expensive dark suit, silver hair, dead calm eyes, untouchable"
gen $D/ricci.jpg   501 "a proud dangerous debt collector in a dark suit, hard jaw, controlled menace, slight sneer"
echo "=== cast done ==="; ls -la $D
