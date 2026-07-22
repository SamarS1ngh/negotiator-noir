#!/usr/bin/env bash
# Scene + panel art via Cloudflare Workers AI (FLUX.1-schnell) — clean, detailed
# semi-realistic manhwa/webtoon noir. Free tier (~100k/day, no card). Creds live
# in ~/.cf_ai (CF_ACCOUNT, CF_TOKEN), never committed. Same filenames + prompts
# as the Pollinations scripts, so the game picks the new art up with no rewiring.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="korean webtoon manhwa style, semi realistic detailed anime illustration, soft cel shading, sharp detailed faces, clean confident linework, cinematic noir lighting, muted teal and amber palette, high detail, no text, no words, no watermark"
D=public/assets/art/scene
mkdir -p "$D"

gen() { # gen <out> <desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:160])" "$1"; then
    echo "OK $1"
  else echo "FAIL $1"; fi
  sleep 1
}

# --- backstory / establishing ---
gen $D/before.jpg     "a warm cozy 1940s ship chandlery shop interior at golden dusk, coils of rope and brass oil lanterns and wooden shelves, ledgers on a worn counter, warm amber lamplight, nostalgic safe and lived-in"
gen $D/now.jpg        "a cold rainy dockyard at night, wet black cobblestones reflecting a single distant gas lamp, looming dark warehouses and ship hulls, drifting fog, lonely and menacing"
# --- prologue panels ---
gen $D/shop_teach.jpg "a warm 1940s ship chandlery interior at golden dusk, a kindly grey-haired shopkeeper father leaning over the wooden counter teaching his attentive teenage son, both watching a bearded sea captain haggle across the counter, warm amber lamplight, coils of rope, a tender mentoring moment"
gen $D/shop_bond.jpg  "a warm 1940s ship chandlery interior at dusk, a grey-haired shopkeeper father and his teenage son sharing a quiet close moment by the counter, the father's hand on the boy's shoulder, warm golden lamplight, tender and safe"
gen $D/fall.jpg       "a dark-suited debt collector standing over a broken grey-haired shopkeeper on the doorstep of a 1940s ship-chandlery at night, neighbours watching from the wet cobbled street, a boy frozen in the doorway, public humiliation"
gen $D/fall_shame.jpg "a 1940s cobbled alley at night outside a ship chandlery, a dark-suited debt collector pointing an accusing finger, an older grey-haired shopkeeper head-bowed and humiliated on his own doorstep, neighbours watching from doorways, public shaming, cold blue light, gas lamps"
gen $D/fall_broken.jpg "a broken grey-haired shopkeeper sitting alone on the stone step of his darkened shuttered shop at night, head bowed in his hands, defeated and ruined, a padlock chained on the door, cold rain, despair"
gen $D/depart.jpg     "a lone young man standing at the stern of a small riverboat at grey misty dawn, a battered suitcase at his feet, looking back at a shrinking dockside town on the shore, leaving home, melancholy and cold"
# --- Chapter One (docks) ---
gen $D/sal.jpg        "a nervous balding bookkeeper hunched over open ledgers under a single green banker's lamp in a cramped dockside office at night, sweating, glancing fearfully toward the door, sickly green tones"
gen $D/crew.jpg       "rough dock workers gathered around a burning oil barrel at the end of a wooden pier at night, wary weathered faces, a young loader with a splinted bandaged hand among them"
gen $D/bianchi.jpg    "a sharp-suited young gangster leaning on an iron railing above a moonlit harbour, smoking a cigarette, cold ambition on his face, ships in the fog behind"
gen $D/ricci.jpg      "two men seated facing each other across a small table in a smoky dim back room, a single low-hanging lamp between them, a bottle, a tense sit-down negotiation"
# --- Chapter Two (district) ---
gen $D/santo.jpg      "a huge scarred enforcer in a heavy dark coat standing under a flickering neon sign outside a nightclub door on a rainy street at night, arms crossed, silent menace"
gen $D/reese.jpg      "a tired rumpled detective in a brown suit drinking alone in the back booth of a dim smoky bar, hat and whisky glass on the table, weary guilt, rain on the window"
gen $D/deluca.jpg     "a heavyset crime boss in a loud pinstripe suit holding court in a plush gold-lit nightclub back room, cigar smoke curling, gold rings, shadowed henchmen at the edges"
# --- Chapter Three (Marlowe's house) ---
gen $D/otto.jpg       "an elderly refined consigliere pouring two brandies at a sideboard in a wood-panelled study with a low fire and old books, warm dim light, an air of decades of secrets"
gen $D/adler.jpg      "a fastidious anxious accountant standing in a cramped locked back office walled floor to ceiling with ledger books, an open floor safe, a single desk lamp, papers everywhere"
gen $D/marlowe.jpg    "a cold powerful crime lord seated at a vast dark desk in an opulent shadowed office, a fountain pen and open ledger before him, one green lamp, rain on tall windows, untouchable stillness"
echo "=== cloudflare art done ==="
