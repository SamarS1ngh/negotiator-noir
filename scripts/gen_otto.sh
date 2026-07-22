#!/usr/bin/env bash
# DENSE per-beat panels for the Otto mission — a distinct, meaningful shot for each
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_otto.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_otto.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_otto.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (cold) — wood-panelled study, low fire, decanter, old books, warm dim amber ----
gen $D/otto_pour.jpg    "wide establishing interior shot of a wood-panelled private study at night, floor-to-ceiling shelves of old leather books, a low fire glowing in a stone fireplace, an elderly refined gentleman with silver hair in a dark three-piece suit standing beside a wooden side table pouring brandy from a crystal decanter into two glasses, calm courtly posture, warm dim amber firelight and lamp light, soft deep shadows in the corners, a visitor seated in a chair in the near foreground, quiet formal tension"
gen $D/otto_sizeup.jpg  "close-up on an elderly refined silver-haired man seated in a leather wingback chair in a wood-panelled study, holding a brandy glass loosely, one eyebrow faintly raised in courtly appraisal, sharp knowing eyes that have watched every angle for decades, faint amused condescension, low firelight flickering warm amber across his lined distinguished face, old books blurred in the background, dangerous composure"

# ---- n_survive: his fear made peace with (cold) ----
gen $D/otto_laugh.jpg   "close-up portrait of an elderly refined silver-haired gentleman advisor giving a short humourless chuckle, head tilted back slightly, eyes glinting with dry resigned irony, a hand resting on the arm of a leather wingback chair, warm low firelight catching the sharp lines of his face, wood-panelled study with old leather books behind him, a man who has long since made peace with his own fate"

# ---- n_legacy: the crack in the courtly shell (guilt) ----
gen $D/otto_careful.jpg "medium shot of an elderly refined silver-haired man in a wood-panelled study setting his brandy glass down slowly and deliberately on a side table, his expression shifting from courtly amusement to a sharp warning stare, low fire glowing behind him, warm amber light, old leather-bound books lining the walls, a controlled flash of danger beneath the civility"
gen $D/otto_appeal.jpg  "over-the-shoulder two-shot in a wood-panelled study, a young man's shadowed determined face and shoulder in the near foreground leaning forward earnestly, across from him an elderly silver-haired consigliere in a wingback chair going very still as the words land, low firelight glowing amber between them, old books and dark wood shelves in soft focus, a quiet charged appeal"
gen $D/otto_daughter.jpg "intimate close-up of an elderly refined silver-haired man in a wood-panelled study, gaze fallen away into the low fire, a flicker of old grief breaking through decades of composure, lips parted mid-confession, brandy glass forgotten in his loose hand, warm amber firelight catching unshed emotion in his eyes, deep shadow pooling around him, a proud man's rare unguarded moment"

# ---- endings (portraits behind the consequence cards) ----
gen $D/otto_turned.jpg  "an elderly refined silver-haired man in a wood-panelled study draining a brandy glass, his shoulders loosened and his face lit with quiet unburdened relief, decades of weight visibly lifting, one hand resting on a thick folder on the side table, warm amber firelight, old leather books softly lit behind him, a rare peaceful expression"
gen $D/otto_hedges.jpg  "an elderly refined silver-haired gentleman in a wood-panelled study studying the viewer with a cool measuring gaze, expression perfectly neutral and calm, hands folded together, brandy glass untouched on a side table beside him, low firelight throwing long amber shadows across old book-lined walls, calculated detachment, a face that reveals nothing"
gen $D/otto_warns.jpg   "an elderly refined silver-haired man in a wood-panelled study setting down a brandy glass with a sharp final click, cold fury tightening his distinguished face, already reaching toward a telephone on the side table, low fire burning behind him casting hard amber light and long shadows across the leather-bound shelves, thirty years of restraint hardening into decisive anger"

echo "=== otto dense panels done ==="; ls $D/otto_*.jpg | wc -l
