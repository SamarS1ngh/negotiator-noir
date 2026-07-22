#!/usr/bin/env bash
# DENSE per-beat panels for the Adler mission — a distinct, meaningful shot for each
# dialogue beat (manhwa pacing), generated with detailed cinematic prompts (camera,
# expression, gesture, lighting, environment). Cloudflare FLUX-schnell. Creds in
# ~/.cf_ai (never committed).
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, muted teal and amber color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_adler.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_adler.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_adler.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# Adler: fastidious, anxious accountant — wire-rimmed glasses, neatly parted thinning
# hair, white shirt with sleeve garters, ink-stained fingers, trembling precise hands.
# Setting: a cramped locked back office, floor-to-ceiling ledger shelves, an open
# floor safe, papers everywhere in careful stacks, a single desk lamp, three locks
# on the door, tense cool palette.

# ---- s0: the approach (tense) ----
gen $D/adler_establish.jpg "wide establishing shot of a cramped windowless back office at night, floor-to-ceiling shelves crammed with identical leather ledger books on every wall, an open floor safe in the corner with papers spilling out, a fastidious middle-aged accountant in a white shirt and sleeve garters hunched over a single desk lamp writing in a ledger, wire-rimmed glasses catching the light, three heavy locks visible on the door in the foreground shadow, cool blue-grey darkness pierced by one warm amber lamp pool, claustrophobic tense atmosphere"
gen $D/adler_locked.jpg    "medium shot of a fastidious balding accountant at a cluttered desk, wire-rimmed glasses low on his nose, pen still moving across a ledger page without looking up, ink-stained fingers holding the pen with careful tense precision, jaw set with rehearsed calm, floor-to-ceiling ledger shelves looming behind him, a single desk lamp casting a tight warm pool of light against cool blue shadow, a heavily locked door with three latches just visible at frame edge, tense controlled composure"

# ---- n_fear: the fear (fear) ----
gen $D/adler_penstop.jpg   "extreme close-up on a trembling ink-stained hand as the pen stops dead mid-stroke on a ledger page, a fastidious accountant's wire-rimmed glasses reflecting lamp light just above, his knuckles whitening around the pen, a single frozen instant of dread breaking through precision, warm desk lamp light against cool office shadow, floor-to-ceiling ledgers blurred in the background"
gen $D/adler_lean.jpg      "over-the-shoulder shot from behind a young man's dark silhouette leaning across the desk toward a rattled accountant, the accountant's face pale and rigid behind wire-rimmed glasses, papers and stacked ledgers crowding the cramped desk between them, the single lamp throwing hard directional light up across the exchange, floor-to-ceiling ledger shelves and an open floor safe visible in the cool shadow beyond, tense cornering atmosphere"
gen $D/adler_quietno.jpg   "extreme close-up on a fastidious accountant's face, wire-rimmed glasses slightly askew, eyes wide and glassy with suppressed terror, lips barely parted whispering a denial he doesn't believe, a single bead of sweat at his temple, warm lamp light raking hard shadows across his gaunt features, floor-to-ceiling ledgers dissolving into cool darkness behind him, quiet devastating fear"

# ---- n_order: the guilt (guilt) ----
gen $D/adler_flinch.jpg    "a fastidious accountant flinching hard at his desk as if struck, shoulders drawn up, wire-rimmed glasses catching a flash of lamp light, one ink-stained hand half-raised defensively over a stack of ledgers, papers scattered by the sudden motion, floor-to-ceiling ledger shelves crowding close behind him, warm lamp light against cool shadow, wounded professional pride"
gen $D/adler_lies.jpg      "over-the-shoulder shot from behind a young man's shadowed silhouette leaning in low and precise across the cluttered desk, accusing, the fastidious accountant across from him recoiling slightly with wire-rimmed glasses catching the light and ink-stained hands pressing flat on scattered papers, the single desk lamp glowing between them, floor-to-ceiling ledgers and an open floor safe in the cool background, a quiet devastating accusation landing"
gen $D/adler_trueset.jpg   "close-up of a fastidious accountant with both ink-stained hands pressed flat on his cluttered desk, trembling visibly, wire-rimmed glasses damp with a sheen of stress-sweat, mouth open mid-confession, eyes glistening with old shame, warm lamp light pooling on the trembling hands, floor-to-ceiling ledger shelves and an open floor safe looming in cool shadow behind him, a fragile confession breaking loose"

# ---- outcome portraits ----
gen $D/adler_books.jpg     "a fastidious accountant kneeling beside an open floor safe in his cramped office, lifting out a plain heavy ledger with both hands finally steady, wire-rimmed glasses catching a warm relieved glow from the desk lamp, floor-to-ceiling ledger shelves surrounding him, papers neatly stacked nearby, a rare look of quiet resolve and relief on his face, cool office shadow giving way to warm amber light"
gen $D/adler_scared_end.jpg "a fastidious accountant standing grey and sweating in his cramped office, ledger already handed over and clutched loosely at his side, his wire-rimmed glasses fogged, eyes flicking anxiously toward the locked door, ink-stained hands trembling uncontrollably, floor-to-ceiling ledgers looming over him in cool dim light, an open floor safe behind him, a shaken broken witness"
gen $D/adler_bolts.jpg     "a fastidious accountant shoved back hard from his desk, chair toppling, face gone white with panic, wire-rimmed glasses knocked crooked, one hand thrown out toward the door in a desperate lunge to flee, papers flying off the desk, floor-to-ceiling ledger shelves and the open floor safe stark in cool harsh lamp light, chaotic dread, about to run"

# ---- x_check: the complication — Marlowe's man checks in (threat) ----
gen $D/adler_checkin.jpg   "medium shot of a fastidious accountant frozen on his knees at an open floor safe set into the office floor, one ink-stained hand locked mid-turn on the dial, wire-rimmed glasses catching a flash of white-eyed alarm, head twisted back over his shoulder toward an unseen door where three knuckles rap softly against old wood, warm desk lamp light guttering against a creeping cool blue shadow spilling from the doorway, floor-to-ceiling ledger shelves looming close overhead, claustrophobic dread of being caught mid-act, dim office at night"

echo "=== adler dense panels done ==="; ls $D/adler_*.jpg | wc -l
