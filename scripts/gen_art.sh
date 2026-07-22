#!/usr/bin/env bash
# Collector art — WIDE at-the-table framing (v0.3.0 cinematic scene). Seed 501, glossy-cel.
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="glossy cel-shaded manhwa noir, crisp clean digital rendering, sharp detailed eyes, dramatic crimson overhead light single hanging bulb, film-noir crime backroom, high production"
BASE="a dangerous debt collector in a dark suit seated at the FAR side of a long table facing the viewer, full wide shot showing the whole table and the dim room around him, POV from across the table"
gen() { # gen <out> <expr>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$BASE, $2, $STYLE")
  curl -fsSL -m 180 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=1080&height=1600&nologo=true&seed=501&model=flux"
  file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  sleep 8
}
D=public/assets/art/collector
gen $D/guarded.jpg  "still and watchful, guarded, giving nothing away"
gen $D/rattled.jpg  "uneasy, jaw tight, rattled, starting to sweat"
gen $D/angry.jpg    "furious, snarling, leaning forward over the table"
gen $D/cornered.jpg "sweating, cornered, glancing for an exit"
gen $D/folding.jpg  "defeated, slumped, looking down, folding"
echo done
