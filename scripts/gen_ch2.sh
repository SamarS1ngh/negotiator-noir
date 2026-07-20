#!/usr/bin/env bash
# Chapter Two cast — Marlowe's inner circle. Same corkboard surveillance-photo
# look + locked seeds as the Chapter One cast (see gen_cast.sh).
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="noir crime graphic novel portrait, glossy cel-shaded, dramatic low-key lighting, muted teal and amber palette, head and shoulders, plain dark background, sharp detailed eyes, high production"
D=public/assets/art/cast
mkdir -p "$D"

gen() { # gen <out> <seed> <desc>
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $STYLE")
  if curl -fsSL -m 200 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=800&height=1000&nologo=true&seed=$2&model=flux"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  else echo "FAIL(curl) $1"; fi
  sleep 7
}

gen $D/otto.jpg  641 "an elderly refined consigliere in an immaculate three-piece suit, silver hair swept back, gold spectacles, tired knowing eyes, decades of secrets behind a calm face"
gen $D/adler.jpg 651 "a fastidious nervous middle-aged accountant in a grey pinstripe suit, thin mustache, ink-stained fingers, wary darting eyes, a ledger clutched to his chest"
echo "=== ch2 cast done ==="; ls -la $D/otto.jpg $D/adler.jpg
