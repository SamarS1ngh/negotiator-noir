#!/usr/bin/env bash
# DENSE per-beat panels for the Gallo mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the base establishing scene and the
# board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, muted teal and amber color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_gallo.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_gallo.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_gallo.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/gallo.jpg          "wide establishing shot inside a small dockside vestry office at night, a weary balding priest in a black cassock and white collar alone at a cluttered wooden desk, a single guttering votive candle throwing warm amber light across an open poor-box ledger and stacked coins, a wooden crucifix on the wall behind him half in shadow, cracked plaster walls, a barred window streaked with harbor fog, deep warm shadow pooling in the corners, quiet melancholy atmosphere"

# ---- s0: the approach (tense) ----
gen $D/gallo_counting.jpg "medium shot, a weary balding priest in a black cassock alone at a cluttered desk, carefully counting small coins and worn bills into stacks by candlelight, lips moving as if murmuring names in prayer, an open ledger of the poor box before him, warm amber votive light on his lined tired face, deep shadow around the edges, cracked vestry walls, quiet devotion and fatigue"
gen $D/gallo_look.jpg     "close shot, a weary balding priest looking up from his counting without startling, calm appraising eyes, one eyebrow faintly raised, a single candle flame reflected in his glasses, warm amber light against deep surrounding shadow, a small dockside vestry office at night, controlled wary composure"
gen $D/gallo_enter.jpg    "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame in a vestry doorway at night, looking into a small candlelit office where a weary balding priest sits watching him steadily from behind a cluttered desk, warm amber backlight from the candle rimming the priest's face, cool corridor darkness pressing in around the silhouette, the stillness before a confession"
gen $D/gallo_flinch.jpg   "extreme close-up of a weary balding priest's weathered face, thumb absently worrying a wooden rosary bead at his belt, eyes flicking down and away for just an instant, a flicker of old guarded guilt crossing his features, warm candlelight raking up from below, deep amber and black shadow, a tell he doesn't know he's shown"

# ---- r_mercy: the honest approach (guilt) ----
gen $D/gallo_offer.jpg    "medium shot of a young man leaning forward across a cluttered desk with open empty hands, an earnest vulnerable expression, no threat in his posture, candlelight warming one side of his face, a weary priest listening across from him half in shadow, small dockside vestry office at night, sincere plea"
gen $D/gallo_test.jpg     "medium close-up of a weary balding priest leaning back in his chair, setting down a handful of coins, studying the viewer with a long searching measuring look, guarded respect warring with caution on his tired face, warm amber candlelight, deep shadow at the edges of the small vestry office, a man deciding whether to trust"

# ---- r_name: your father's guilt, wide open (guilt) ----
gen $D/gallo_name.jpg     "intense close-up of a weary balding priest as a name lands like a blow, eyes widening with dawning recognition and old grief, one hand rising to make the sign of the cross over his chest, lips parted in a stunned breath, warm candlelight catching tears not yet fallen, deep shadow, small vestry office at night"
gen $D/gallo_lean.jpg     "medium shot, a young man leaning in quietly across the desk with a soft insistent expression, urging on a story just begun, warm amber candlelight on his face, a shadowed weary priest visible across from him lost in memory, small dockside vestry office at night, hushed urgency"
gen $D/gallo_remember.jpg "close-up of a weary balding priest gazing into middle distance, lost in memory, eyes distant and sorrowful, hands folded on an open ledger, recalling a private and unresolved visit from years past, warm candlelight flickering low, deep amber shadow, small vestry office at night, quiet grief"

# ---- x_twist: guilt twisted into a debt (cold) ----
gen $D/gallo_stung.jpg    "close-up of a weary balding priest as the soft grief in his eyes shutters closed, replaced by hurt and hardening mistrust, jaw tightening, a wounded closing-off, warm candlelight now throwing harder colder shadow across half his face, small vestry office at night"

# ---- x_expose: he draws up, insulted (cold) ----
gen $D/gallo_expose.jpg   "medium shot, a weary balding priest rising slightly and setting down a handful of coins with sudden weight, drawing himself up to his full unexpected size under the black cassock, offended dignity and quiet controlled anger in his stern face, warm candlelight now sharp and hard-edged, deep shadow, small dockside vestry office at night"
gen $D/gallo_cold.jpg     "close-up of a weary balding priest exhaling in tired resignation, some of his drawn-up anger easing back into fatigue, sliding a single folded paper across a cluttered desk without meeting the viewer's eyes, warm low candlelight, deep amber and black shadow, small vestry office at night, grudging concession"

# ---- x_buy: money wounds him, doesn't tempt him (tense) ----
gen $D/gallo_buy.jpg      "tight overhead close-up of a small fold of worn bills being set down onto a cluttered wooden desk beside stacked coins and an open poor-box ledger, a hand just withdrawing, warm candlelight glinting off the desk grain, the money sitting between two men like an accusation, small dockside vestry office at night"
gen $D/gallo_refuse.jpg   "close-up of a weary balding priest looking down at a fold of money without touching it, an expression of quiet sorrow rather than temptation or anger, a slow disappointed shake of the head, warm candlelight on his lined face, deep shadow, small vestry office at night, moral weariness"
gen $D/gallo_relent.jpg   "close-up of a weary balding priest's sorrow easing just slightly into grudging approval, still guarded, reaching toward a folded paper on the desk instead of a locked drawer, warm candlelight, deep amber shadow, small dockside vestry office at night, cautious partial trust"

# ---- turn: the complication — a knock, a parishioner, the real test (threat) ----
gen $D/gallo_interrupt.jpg "dynamic wide shot, a heavy vestry door banging open at night, a breathless woman in a dripping wet coat framed in the doorway mid-step, one hand reaching out in desperate appeal, a weary balding priest half-risen from behind his candlelit desk in shock, a young man seated nearby turning toward the sudden commotion, warm amber candlelight spilling into cold dark doorway fog, small dockside vestry office, urgent chaos"
gen $D/gallo_plea.jpg     "medium close-up of a weary balding priest paused half-standing, torn, turning back over his shoulder toward the viewer with an urgent pleading and resolved expression, one hand raised as if naming a price that is not money, warm candlelight on his face, a woman blurred in soft focus in the background doorway, small vestry office at night"

# ---- endings (portraits behind the consequence cards) ----
gen $D/gallo_thread_end.jpg "emotional medium shot, a weary balding priest kneeling by an open floor strongbox behind a wall crucifix, lifting out a slim worn black ledger with both hands and pressing it toward the viewer, eyes wet with relief and quiet resolve, warm golden candlelight now full and steady across the small vestry office at night, a moment of costly grace"
gen $D/gallo_ledger_end.jpg "close-up of a weary balding priest handing over a single folded page across a cluttered desk without meeting the viewer's eyes, expression closed and transactional, warm candlelight throwing a cooler harder shadow across his face, small dockside vestry office at night, a cordial but final distance"
gen $D/gallo_shut_end.jpg  "wide shot, a weary balding priest standing tall and stern beside a firmly closed floor strongbox, pocketing a small key, nodding once toward a doorway in unmistakable dismissal, candlelight now guttering low and cold-edged, deep harsh shadow filling the small vestry office at night, an ominous quiet finality"

echo "=== gallo scene panels done ===" ; ls $D/gallo*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/gallo.jpg          "noir crime graphic novel head and shoulders portrait of a weary balding dockside priest in his fifties, black cassock and white clerical collar, deep lined weathered face, kind but morally tired eyes, faint stubble, a wooden rosary visible at his belt, warm low candlelight from below mixed with cold blue-grey ambient light, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal and amber palette, high production value, no text, no watermark"

echo "=== gallo cast portrait done ===" ; ls -la $C/gallo.jpg
