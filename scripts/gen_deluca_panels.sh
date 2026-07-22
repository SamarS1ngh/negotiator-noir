#!/usr/bin/env bash
# DENSE per-beat panels for the DeLuca sit-down (deluca_confront.ts) — a distinct,
# meaningful shot for each dialogue beat (manhwa pacing), generated with detailed
# cinematic prompts (camera, expression, gesture, lighting, environment). Cloudflare
# FLUX-schnell. Creds in ~/.cf_ai (never committed).
# NOTE: named gen_deluca_panels.sh (not gen_deluca.sh) because scripts/gen_deluca.sh
# already exists and generates the unrelated Chapter Two cast portrait (cast/deluca.jpg).
# This script's outputs use the same 'deluca_' file prefix as the mission's panel consts.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, warm boss-gold and amber color grade with deep teal shadows, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_deluca.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_deluca.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_deluca.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0_serene: entering his domain, full swagger (tense) ----
gen $D/deluca_court.jpg  "wide establishing low-angle shot of a plush gold-lit nightclub back room at night, a heavyset middle-aged crime boss in a loud expensive silk suit sprawled like a king on a velvet booth throne, thick gold rings on every finger catching the light, a fat cigar trailing smoke, silk drapes and a private bar behind him, broad-shouldered henchmen standing half-lit at the shadowed edges of the room, a lean young man's dark silhouette entering through the doorway in the foreground, opulent gilded decadence, warm gold haze"
gen $D/deluca_mock.jpg   "medium shot, a heavyset crime boss lounging back in a gold-lit booth, thick jaw split in a mocking amused grin, one ring-heavy hand gesturing lazily toward an empty chair across the table, cigar smoke curling past slicked black hair, dismissive lord-of-the-manor confidence, gold light glinting off his rings, plush club interior at night"

# ---- s0_cracks: the swagger thinner, rattled (tense) ----
gen $D/deluca_rattled.jpg "close-up of a heavyset crime boss's thick face, the easy grin gone tight at the corners, eyes darting once toward his men then back, a flicker of real worry breaking through the practiced charm, cigar forgotten and burning low in his fingers, warm gold booth light now edged with cooler shadow, plush nightclub back room at night"
gen $D/deluca_demand.jpg  "a heavyset crime boss leaning hard across the table, thick jaw jutting, a ring-studded finger jabbing toward the viewer, veins standing at his neck, real anger cutting through the gold-lit haze, alert henchmen shifting at the shadowed edges of the room, tense plush nightclub back room at night"

# ---- s0_forewarned: the ambush, cold threat from the start (threat) ----
gen $D/deluca_ambush.jpg  "wide tense shot of a gold-lit nightclub back room set for an ambush, armed henchmen posted stiff and silent at every door in the shadows, a heavyset crime boss seated dead center at the table with one hand resting just under the edge of the tablecloth near a hidden pistol, a lean young man's wary silhouette approaching across the room, gold light pooling ominously, coiled danger"
gen $D/deluca_coldeyed.jpg "extreme close-up of a heavyset crime boss's eyes, all the earlier warmth gone cold and flat and calculating, thick jaw set hard, gold rings motionless on the table's edge, a razor-thin unreadable expression, dim gold light throwing sharp shadow across half his face, plush nightclub back room at night"

# ---- open: the table, waiting (threat) ----
gen $D/deluca_table.jpg   "medium wide shot, a heavyset crime boss spreading both ring-heavy hands expansively over a table laden with cigars, gold ashtrays and a bottle of dark liquor, thick brows raised in a challenging expectant look, waiting to be impressed, cigar smoke curling upward into the gold light, henchmen silhouetted at the room's shadowed edges, plush nightclub back room at night"

# ---- c_blade: the leverage turn — his jovial mask slipping (threat) ----
gen $D/deluca_freeze.jpg  "extreme close-up on a heavyset crime boss's thick ring-covered hand frozen flat on the tablecloth, knuckles pale with sudden tension, gold rings no longer flashing playfully but gripping hard, above it out of focus his face has gone rigid with alarm, warm gold light turned suddenly cold and still, plush nightclub back room at night"
gen $D/deluca_ultimatum.jpg "tense low-angle two-shot, a lean young man leaning forward into gold lamplight with a calm cold certainty, laying out an ultimatum with quiet control, across the table a heavyset crime boss's broad shoulders gone rigid, cigar smoke hanging motionless between them, a charged silent standoff, plush nightclub back room at night"
gen $D/deluca_sweat.jpg   "close-up of a heavyset crime boss's thick face, all the swagger drained out, a bead of sweat sliding past his collar, thick jaw slack with real fear, gold rings clutching the edge of the table for composure, warm gold light now sickly and close, plush nightclub back room at night"

# ---- c_muscle: the leverage turn — his muscle is gone (cold) ----
gen $D/deluca_emptydoor.jpg "a heavyset crime boss's head turning sharply toward an empty doorway where a bodyguard should be standing, thick brows drawing together in dawning alarm, gold rings tightening on the table edge, the shadowed doorway conspicuously bare, dim gold-lit nightclub back room at night"
gen $D/deluca_losthim.jpg "medium shot of a lean young man across the table, arms loose and unbothered, delivering a calm quiet explanation with a faint knowing look, gold light catching his eyes, opposite him a heavyset crime boss's shoulder just in frame gone tense, plush nightclub back room at night"
gen $D/deluca_defiant.jpg "a heavyset crime boss straightening his shoulders with wounded pride, thick jaw set defiant, one ring-heavy hand sliding slowly toward the edge of the tablecloth near a hidden pistol, forcing false bravado back into his face, gold light hardening around him, henchmen shifting uneasily at the room's shadowed edges, plush nightclub back room at night"

# ---- c_ego: the leverage turn — ambition lit up, hungry (tense) ----
gen $D/deluca_greed.jpg   "close-up of a heavyset crime boss's thick face lighting up with sudden greedy interest, eyes narrowing with hungry calculation, a slow grin spreading, gold rings tapping the table in anticipation, warm gold light catching the avarice in his expression, plush nightclub back room at night"
gen $D/deluca_pitch.jpg   "medium shot of a lean young man leaning in across the table with an open persuasive gesture, pitching a partnership with quiet confidence, gold light warm on his face, across from him a heavyset crime boss listening intently, cigar smoke drifting between them, plush nightclub back room at night"
gen $D/deluca_hungry.jpg  "close-up of a heavyset crime boss leaning in very close over the table, thick face hungry and testing, eyes narrowed with shrewd calculation, gold rings drumming once on the wood, demanding proof rather than promises, warm gold haze, plush nightclub back room at night"

# ---- endings (portraits behind the consequence cards) ----
gen $D/deluca_end_ally.jpg     "a heavyset crime boss sitting back with a resigned, wary respect on his thick face, one ring-heavy hand extended across the table in a grudging truce, gold light steady and warm again, a king who has accepted a new master, plush nightclub back room at night"
gen $D/deluca_end_broken.jpg   "a heavyset crime boss slumped and humiliated in his own booth, thick shoulders sagging, gold rings dull and still, eyes downcast in front of his own silent watching men, all his swagger gone out of him, cold harsh gold light, plush nightclub back room at night"
gen $D/deluca_end_district.jpg "a heavyset crime boss leaning back with a thin satisfied smile, arms crossed, having given up ground but kept his real secret, a faint smug glint still in his eyes, warm gold light, plush nightclub back room at night"
gen $D/deluca_end_slip.jpg     "a heavyset crime boss standing with a wide triumphant grin, one arm gesturing toward the door in mock hospitality, gold rings flashing as henchmen close in behind him, having smelled the bluff and won, warm gold light, plush nightclub back room at night"
gen $D/deluca_end_crushed.jpg  "a heavyset crime boss laughing with open cigar-toothed delight, slowly lifting a pistol up from under the tablecloth into the gold light, henchmen sealing the doors behind him in the shadowed edges of the room, total predatory command of the room, plush nightclub back room at night"

# ---- c_twist_ally / c_twist_broken: THE TWIST — the Act I -> Act II hinge.
# NEW, NOT YET GENERATED (CF quota exhausted as of the Act I finale deepening
# pass — 2026-07). Referenced by deluca_confront.ts as REVEAL but this line has
# NOT been run. Run once quota is back, then verify deluca_reveal.jpg exists
# before the mission ships.
gen $D/deluca_reveal.jpg "close-up of a heavyset crime boss's thick face, the mask of swagger or defeat both gone for a moment, eyes gone distant and far away past the viewer as if staring through the wall toward the city outside, a flicker of something between dread and grim confession crossing his features, gold rings loose and forgotten on the table, dim gold light gone cold and still around him, the weight of a much bigger secret in his slackened jaw, plush nightclub back room at night"

echo "=== deluca dense panels done ==="; ls $D/deluca_*.jpg | wc -l
