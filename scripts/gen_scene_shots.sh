#!/usr/bin/env bash
# Scene illustrations — the character IN their world, mid-moment, so a scene reads
# as a painted moment (the action, the room, the mood), not a floating face. Used
# as the mission backgrounds (the board keeps the small surveillance-photo faces).
set -euo pipefail
cd "$(dirname "$0")/.."
STYLE="korean manhwa webtoon panel, clean cel-shaded digital art, crisp confident linework, flat vibrant colors, sharp detail, dramatic cinematic lighting, high production, no text, no words"
D=public/assets/art/scene
mkdir -p "$D"

gen() { # gen <out> <seed> <desc>
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $STYLE")
  if curl -fsSL -m 220 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=820&height=1200&nologo=true&seed=$2&model=flux-anime"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  else echo "FAIL(curl) $1"; fi
  sleep 7
}

gen $D/fall.jpg    711 "a dark-suited debt collector standing over a broken grey-haired shopkeeper on the doorstep of a 1940s ship-chandlery at dusk, neighbours watching from the wet cobbled street, a boy frozen in the doorway, public humiliation"
gen $D/sal.jpg     712 "a nervous balding bookkeeper hunched over open ledgers under a single green banker's lamp in a cramped dockside office at night, sweating, glancing fearfully toward the door"
gen $D/crew.jpg    713 "rough dock workers gathered around a burning oil barrel at the end of a wooden pier at night, wary weathered faces, a young loader with a splinted bandaged hand among them"
gen $D/bianchi.jpg 714 "a sharp-suited young gangster leaning on an iron railing above a moonlit harbour, smoking a cigarette, cold ambition on his face, ships in the fog behind"
gen $D/ricci.jpg   715 "two men seated facing each other across a small table in a smoky dim back room, a single low-hanging lamp between them, cards and a bottle, a tense sit-down negotiation"
gen $D/santo.jpg   716 "a huge scarred enforcer in a heavy dark coat standing under a flickering neon sign outside a nightclub door on a rainy street at night, arms crossed, silent menace"
gen $D/reese.jpg   717 "a tired rumpled detective in a brown suit drinking alone in the back booth of a dim smoky bar, hat and whisky glass on the table, weary guilt, rain on the window"
gen $D/deluca.jpg  718 "a heavyset crime boss in a loud pinstripe suit holding court in a plush gold-lit nightclub back room, cigar smoke curling, gold rings, shadowed henchmen at the edges"
gen $D/otto.jpg    719 "an elderly refined consigliere pouring two brandies at a sideboard in a wood-panelled study with a low fire and old books, warm dim light, an air of decades of secrets"
gen $D/adler.jpg   720 "a fastidious anxious accountant standing in a cramped locked back office walled floor to ceiling with ledger books, an open floor safe, a single desk lamp, papers everywhere"
gen $D/marlowe.jpg 721 "a cold powerful crime lord seated at a vast dark desk in an opulent shadowed office, a fountain pen and open ledger before him, one green lamp, rain on tall windows, untouchable stillness"
echo "=== scene shots done ==="; ls -la $D/*.jpg | wc -l
