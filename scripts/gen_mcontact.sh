#!/usr/bin/env bash
# DENSE per-beat panels for the Marlowe first-contact mission — a distinct,
# meaningful shot for each dialogue beat (manhwa pacing), generated with detailed
# cinematic prompts (camera, expression, gesture, lighting, environment).
# Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_mcontact.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_mcontact.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_mcontact.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: first contact in Marlowe's office (threat) ----
gen $D/mcontact_office.jpg   "wide establishing shot of a vast opulent crime lord's office at night, dark polished wood paneling and towering bookshelves, a massive antique desk in the center under a single green banker's lamp, an elegant silver-haired man in an immaculate dark three-piece suit seated behind it, gaunt sharp features, head bowed over an open ledger, a fountain pen held like a scalpel in his hand, not looking up, floor-to-ceiling windows behind him streaked with heavy rain against a black night sky, a young dark-coated man's silhouette standing just inside the doorway in the foreground shadow, cold steel-blue and deep charcoal color grade, immense stillness, quiet overwhelming power, cavernous scale"
gen $D/mcontact_marlowe.jpg  "medium close-up shot of an elegant silver-haired crime lord in a dark three-piece suit at his desk, gaunt sharp aristocratic features, cold pale ice-blue eyes fixed forward with faint amused contempt, a thin cruel almost-smile, fountain pen poised motionless between two fingers over an open ledger, one hand gesturing lazily toward an empty chair, green banker's-lamp light carving hard shadows across his composed face, rain-streaked tall windows dark behind him, cold steel palette, absolute controlled stillness, quiet menace"
gen $D/mcontact_stand.jpg    "over-the-shoulder shot from behind an elegant silver-haired crime lord's shoulder in the foreground, dark suit fabric softly out of focus, looking across the desk at a young dark-coated man standing rigid and composed before it, jaw set, eyes steady and calculating, refusing to flinch under the cold gaze, the green banker's lamp glowing between them, tall rain-streaked windows framing the young man in cold grey light, dark wood office walls receding into shadow, steel-blue and charcoal tones, tense charged quiet"

# ---- endings (portraits behind the consequence cards) ----
gen $D/mcontact_pawn.jpg     "close-up portrait of an elegant silver-haired crime lord setting his fountain pen down onto the open ledger with deliberate finality, cold pale ice-blue eyes assessing and faintly approving, thin controlled almost-smile, dark three-piece suit, green banker's-lamp light catching the sharp planes of his face, tall rain-streaked windows dark behind him, cold steel palette, quiet ownership and control"
gen $D/mcontact_unseen.jpg   "close-up portrait of an elegant silver-haired crime lord almost smiling with faint amusement, already turning his gaze back down to his ledger, cold pale ice-blue eyes sliding away in dismissal, one hand waving vaguely toward the side of the room, dark three-piece suit, green banker's-lamp light, tall rain-streaked windows behind him in deep shadow, cold steel palette, the quiet of being utterly overlooked"
gen $D/mcontact_marked.jpg   "intense close-up portrait of an elegant silver-haired crime lord, fountain pen frozen mid-air above the ledger, cold pale ice-blue eyes lifting to stare directly and sharply forward for the first time, gaunt features hardening with focused predatory interest, dark three-piece suit, green banker's-lamp light throwing harsh shadows across his face, tall rain-streaked windows black behind him, cold steel palette, sudden dangerous attention, quiet threat"

echo "=== mcontact dense panels done ==="; ls $D/mcontact_*.jpg | wc -l
