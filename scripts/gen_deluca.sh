#!/usr/bin/env bash
# Chapter Two cast — DeLuca's district (the rung between Ricci and Marlowe). Same
# corkboard surveillance-photo look + locked seeds as the rest of the cast.
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

gen $D/deluca.jpg 661 "a heavyset middle-aged district crime boss in a loud expensive suit, gold rings, slicked black hair, thick jaw, a hungry greedy confidence with fear hiding behind the eyes"
gen $D/santo.jpg  671 "a huge scarred enforcer in a tight dark coat, broken nose, dead flat eyes, shaved head, quiet menace, a man who has hurt many people and felt nothing"
gen $D/reese.jpg  681 "a tired corrupt police detective in a rumpled brown suit and loosened tie, grey stubble, guilty exhausted eyes, a cigarette burning down to his fingers"
echo "=== deluca cast done ==="; ls -la $D/deluca.jpg $D/santo.jpg $D/reese.jpg
