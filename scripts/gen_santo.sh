#!/usr/bin/env bash
# DENSE per-beat panels for the Santo mission — a distinct, meaningful shot for each
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_santo.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_santo.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_santo.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (threat) ----
gen $D/santo_wall.jpg    "wide establishing shot of a colossal scarred enforcer in a heavy dark overcoat standing like a fixture beside a nightclub's steel door, arms crossed, utterly still and silent, a flickering neon sign buzzing pink and blue above him casting broken reflections on the rain-slicked street, wet cobblestones mirroring the neon glow, cold steel-blue night palette, distant streetlights blurred in the drizzle, a lone watcher's silhouette across the street in the foreground shadow, menacing stillness, atmospheric rain haze"
gen $D/santo_dismiss.jpg "low angle close-up on a massive scarred enforcer's face, a thick old scar cutting across one heavy brow, eyes barely flicking downward in dismissal, jaw set, utterly unbothered, flickering neon sign light strobing cold blue and pink across his weathered face, rain beading on his heavy dark coat collar, wet nightclub doorway behind him, cold indifference, night"

# ---- n_respect: the crack in the stone (tense) ----
gen $D/santo_flatline.jpg "extreme close-up on a huge scarred enforcer's flat impassive eyes finally shifting downward for the first time, a flicker of surprise breaking through years of stone-faced control, deep old scar through one eyebrow, neon sign light flickering cold blue across half his face, rain-streaked shadows, the first crack in the wall, night outside a nightclub"
gen $D/santo_accuse.jpg   "dramatic low-angle over-the-shoulder shot, a determined young figure's shadowed silhouette in the foreground speaking up firmly, across from them a towering scarred enforcer looming in his heavy dark coat under a flickering neon sign, his expression unreadable but listening intently, wet street reflecting broken neon light, cold steel-blue tones, a charged confrontation outside the nightclub door, night"
gen $D/santo_simmer.jpg   "close-up of a massive scarred enforcer's face in a long dangerous silence, jaw clenched tight, a vein faintly visible at his temple, eyes narrowed with slow simmering anger held just under control, flickering neon light strobing pink and blue across the scars on his face, rain misting past in the cold night air, tense stillness before a storm, nightclub doorway"

# ---- n_worth: the empty place under the muscle (tense) ----
gen $D/santo_grunt.jpg    "medium shot of a hulking scarred enforcer giving a short humorless grunt that might be a laugh, corner of his mouth twitching upward without warmth, arms still crossed over his heavy dark coat, standing beside the nightclub's steel door under the buzzing neon sign, wet reflections rippling on the pavement, cold blue night light, weary cynicism, night"
gen $D/santo_press.jpg    "tense two-shot from a low angle, a small determined figure standing firm in the rain looking up at the towering scarred enforcer, pressing him with a hard question, his heavy dark coat looming over the frame, the flickering neon sign throwing pink and cold blue light across both of them, wet cobblestones mirroring the glow, a quiet interrogation outside the nightclub door, night"
gen $D/santo_empty.jpg    "close-up of a massive scarred enforcer's face going quiet and hollow, the hard stone-faced menace dropping away to reveal something empty and lost underneath, eyes unfocused, staring past the viewer into old memory, flickering neon light softening to a dim cold blue wash over his scarred features, rain-streaked backdrop, a rare unguarded moment, night outside the nightclub"

# ---- endings (portraits behind the consequence cards) ----
gen $D/santo_turned_end.jpg "a huge scarred enforcer looking down at his own thick scarred hands for a long moment, heavy dark coat sleeves pulled back, an expression of quiet resolve settling over his weathered face, standing alone by the nightclub's steel door as the neon sign flickers cold blue and pink above him, rain falling softly, a rare moment of a dangerous man choosing his own path, night, wet reflections on the street"
gen $D/santo_hedges_end.jpg "a massive scarred enforcer turning his back and returning to his post beside the nightclub's steel door, arms crossing again into an immovable stance, face closing back into flat neutral stone, the flickering neon sign casting cold blue light across his broad shoulders, wet street reflections, a wall once more, night, distant and unreadable"
gen $D/santo_loyal_end.jpg "a towering scarred enforcer's massive hand closing hard around a collar, hauling a smaller figure toward the street, his scarred face set in cold menacing fury, flickering neon sign strobing pink and blue light across the motion, rain streaking through the harsh light, wet cobblestones, a dangerous man reasserting control outside the nightclub door, night"

echo "=== santo dense panels done ==="; ls $D/santo_*.jpg | wc -l
