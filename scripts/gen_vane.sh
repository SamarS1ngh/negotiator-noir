#!/usr/bin/env bash
# DENSE per-beat panels for the Vane sit-down (vane_confront.ts) — a distinct,
# meaningful shot for each dialogue beat (manhwa pacing), generated with detailed
# cinematic prompts (camera, expression, gesture, lighting, environment). Cloudflare
# FLUX-schnell. Creds in ~/.cf_ai (never committed).
# NOT RUN — CF quota exhausted as of this Ch5 buildout pass (2026-07-22). Filenames
# below are the contract vane_confront.ts already references; run this once quota
# is back, then verify every file under public/assets/art/scene/vane_*.jpg (+ the
# base public/assets/art/scene/vane.jpg + public/assets/art/cast/vane.jpg) exists
# before the mission ships.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, cold civic marble and brass and storm-grey palette, muted steel-blue shadows, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast
mkdir -p "$D" "$C"

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_vane.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_vane.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_vane.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base scene (Mission.scene default background) ----
gen $D/vane.jpg "wide establishing shot of a cold civic office above a marble Hall stairwell at dusk, storm-grey light through tall windows, brass fittings, an immaculate desk, a silver-framed photo of a young woman in graduation robes turned toward the chair, a lean young man's dark silhouette standing in the doorway, austere power, no warmth"

# ---- s0_serene: composed, checking the clock (cold) ----
gen $D/vane_office.jpg  "wide establishing low-angle shot of an austere civic office above a grand marble stairwell, brass fittings and storm-grey window light, not a single paper out of place on the immaculate desk, a lean young man's silhouette entering through a tall doorway, cold clean institutional power"
gen $D/vane_greet.jpg   "medium shot of a lean silver-haired man in an impeccable dark suit seated behind an immaculate desk, gesturing composed and unhurried toward an empty chair, checking a pocket watch with mild disdain, brass desk lamp light, storm-grey window behind him, civic office at dusk"

# ---- s0_cracks: the composure costing him more to hold (tense) ----
gen $D/vane_aware.jpg    "close-up on a lean silver-haired man's face behind an immaculate desk, jaw set a fraction too tight, eyes calculating rather than calm, the polish of authority just barely holding under strain, cold brass and storm-grey office light"
gen $D/vane_warning.jpg  "a lean silver-haired man leaning forward across an immaculate desk, precise and cold, one finger tapping the desk once for emphasis, delivering a warning dressed as courtesy, brass lamp light throwing sharp shadow, storm-grey civic office"

# ---- s0_forewarned: prepared, cold-eyed (threat) ----
gen $D/vane_prepared.jpg "wide tense shot of an austere civic office, two grey-suited men posted silent by the outer door, an immaculate desk cleared deliberately bare, a lean young man's wary silhouette approaching, storm-grey window light, coiled institutional menace"
gen $D/vane_coldline.jpg "extreme close-up of a lean silver-haired man's eyes behind wire-rimmed glasses, flat, exact, utterly untroubled, delivering a precise ultimatum without raising his voice, cold brass office light, storm-grey shadow across half his face"

# ---- open: the table, waiting, sizing him up (cold) ----
gen $D/vane_table_wait.jpg "medium shot of a lean silver-haired man seated perfectly still behind an immaculate desk, hands folded, unbothered, testing a visitor's nerve with patient silence, brass lamp light, storm-grey civic office at dusk"
gen $D/vane_sizeup.jpg   "medium shot from behind a lean young man's shoulder looking across an immaculate desk at a composed silver-haired official, cold assessing gaze, storm-grey window light framing the older man like a judge on a bench"

# ---- the read: correct read vs two corrected misses (cold/tense) ----
gen $D/vane_conviction.jpg "close-up on a lean young man's face, a flicker of grim realization crossing his features as he reads conviction rather than guilt in the official across the desk, cold storm-grey office light, quiet dawning understanding"
gen $D/vane_miss_fear.jpg  "close-up on a lean young man's face, catching himself mid-approach, realizing a threat of scandal will not land on the composed official across the desk, storm-grey civic office, a beat of self-correction"
gen $D/vane_miss_leash.jpg "close-up on a lean young man's face, recalculating, realizing the silver-haired official across the desk gives orders rather than takes them, storm-grey civic office light, quiet reassessment"

# ---- approach: waiting, unhurried (cold) ----
gen $D/vane_pentap.jpg "close-up of a lean silver-haired man's hand tapping a fountain pen once against a leather blotter, unhurried, immaculate cufflink catching brass lamp light, storm-grey civic office at dusk"

# ---- c_press lever (threat) ----
gen $D/vane_press_still.jpg "medium shot of a lean silver-haired official setting a fountain pen down with precise dismissive calm behind an immaculate desk, unbothered composure, storm-grey civic office light"
gen $D/vane_press_push.jpg  "medium shot of a lean young man leaning forward across a desk, level and calm, delivering an unwelcome reframing, storm-grey office light, the older official's shoulder tense at the edge of frame"
gen $D/vane_press_crack.jpg "extreme close-up on a lean silver-haired man's face, the first real pause breaking his composure, eyes flicking down for half a second too long, cold brass light, storm-grey shadow"

# ---- c_chain lever (threat) ----
gen $D/vane_chain_dismiss.jpg "medium shot of a lean silver-haired official leaning back mild and almost bored behind an immaculate desk, dismissive composure, storm-grey civic office light"
gen $D/vane_chain_map.jpg     "medium shot of a lean young man laying out an invisible map of names and favors with an open hand across the desk, calm and precise, storm-grey office light, the older official listening intently"
gen $D/vane_chain_still.jpg   "close-up on a lean silver-haired man's face gone very still, doing silent arithmetic behind composed eyes, the first crack of real calculation, cold brass and storm-grey office light"

# ---- c_rival lever (threat) ----
gen $D/vane_rival_snort.jpg "medium shot of a lean silver-haired official's lip curling in contempt at a rival's name, arms crossed behind an immaculate desk, storm-grey civic office light"
gen $D/vane_rival_press.jpg "medium shot of a lean young man speaking calm and unbothered across the desk, laying out a rival's ambition as a weapon, storm-grey office light, the older official's composure thinning"
gen $D/vane_rival_calc.jpg  "close-up on a lean silver-haired man's eyes, a flicker of real fear quickly smoothed over and filed away, cold brass light, storm-grey civic office"

# ---- c_upriver lever (threat) ----
gen $D/vane_upriver_flat.jpg "medium shot of a lean silver-haired official, flat unreadable expression, testing what a visitor actually knows, storm-grey civic office light"
gen $D/vane_upriver_name.jpg "medium shot of a lean young man speaking a name aloud with quiet certainty across the desk, storm-grey office light, the older official's hand going still on the blotter"
gen $D/vane_upriver_still.jpg "extreme close-up on a lean silver-haired man's face, the first true flicker of fear surfacing beneath the composure, fear of something far above him rather than the man across the desk, cold storm-grey light"

# ---- c_cutout: the last shield, an offered fall guy (threat) ----
gen $D/vane_offer.jpg      "medium shot of a lean silver-haired official leaning back, tired for the first time, one hand gesturing toward an unseen drawer, offering up a name with practiced ease, brass lamp light, storm-grey civic office"
gen $D/vane_seethrough.jpg "close-up on a lean young man's face, quietly unimpressed, recognizing a familiar trick for exactly what it is, storm-grey office light, cold clarity in his eyes"

# ---- c_mirror: stripped bare, the last lever (guilt/tense) ----
gen $D/vane_stripped.jpg     "close-up on a lean silver-haired man's face, composure gone brittle and quiet, out of moves, a rare unguarded stillness, cold brass light fading into storm-grey shadow, civic office at dusk"
gen $D/vane_lever_choice.jpg "medium shot of a lean young man's face turned toward a silver-framed photograph of a young woman in graduation robes on the desk, a flicker of grim reluctance crossing his features, storm-grey civic office light, a moral weight in his eyes"

# ---- endings (portraits behind the consequence cards) ----
gen $D/vane_end_break.jpg    "close-up on a lean silver-haired official's face, composure finally breaking, something behind his eyes giving way at last, cold brass light gone harsh, storm-grey civic office, a costly victory"
gen $D/vane_end_ally.jpg     "medium shot of a lean silver-haired official sitting back with grudging near-respect on his face, not gratitude, storm-grey civic office light steady and cold, a wary professional truce"
gen $D/vane_end_cutout.jpg   "medium shot of a lean silver-haired official sliding a folder across an immaculate desk with practiced ease, untouched composure fully restored, brass lamp light, storm-grey civic office"
gen $D/vane_end_standoff.jpg "medium shot of a lean silver-haired official standing and straightening his jacket, entirely unbothered, turning toward the door, storm-grey civic office light, cold institutional dismissal"

# ---- cast portrait: THE WEB board corkboard photo (v0.11 "alive" style) ----
gen $C/vane.jpg "noir crime graphic novel head-and-shoulders portrait, a lean silver-haired civic commissioner in an impeccable dark suit and wire-rimmed glasses, composed cold authority, faint knowing smile, plain dark background, glossy cel-shaded, dramatic low-key lighting, muted steel-grey and brass palette, sharp detailed eyes, high production"

echo "=== vane dense panels done ==="; ls $D/vane*.jpg $C/vane.jpg 2>/dev/null | wc -l
