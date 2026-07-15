#!/usr/bin/env bash
# Collector art via free Pollinations Flux. Locked seed 501, glossy-cel manhwa noir.
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="glossy cel-shaded manhwa noir, crisp clean digital rendering, sharp detailed eyes, dramatic crimson overhead light single hanging bulb, film-noir crime backroom, high production, medium close-up across the table"
BASE="a dangerous calculating debt collector in his 40s across a table facing the viewer"
gen() { # gen <out> <expr>
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$BASE, $2, $STYLE")
  curl -fsSL -m 180 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=900&height=1200&nologo=true&seed=501&model=flux"
  file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  sleep 8
}
gen assets/art/collector/guarded.jpg  "wary narrowed eyes, guarded, reading you back"
gen assets/art/collector/rattled.jpg  "jaw tight, uneasy, rattled, sweat starting"
gen assets/art/collector/angry.jpg    "snarling furious, leaning in, teeth bared"
gen assets/art/collector/cornered.jpg "sweating cornered, eyes darting, fear breaking through"
gen assets/art/collector/folding.jpg  "defeated, looking down, beaten, folding"
echo done
