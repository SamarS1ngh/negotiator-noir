#!/usr/bin/env bash
# DENSE per-beat panels for the Vera mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the base establishing scene and the
# board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_gallo.sh.
# NOTE: CF image quota was exhausted at authoring time — this script is queued,
# not run. Run it later once quota resets.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_vera.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_vera.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_vera.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/vera.jpg            "wide establishing shot inside a smoky gold-lit jazz club after hours, empty velvet booths and a marble-topped bar backed by a towering gilt mirror and shelves of bottles, a bandstand in the deep background with musicians packing away instrument cases, a striking sharp-eyed woman in her forties in a fitted dark satin evening dress standing alone behind the bar polishing a glass, warm amber bar light mixing with a fading magenta stage wash, drifting cigarette haze, hushed after-hours atmosphere, film-noir lighting"

# ---- s0: the approach (tense) ----
gen $D/vera_tap.jpg        "medium shot, a striking sharp-eyed woman in her forties, dark hair swept in a sleek 1940s wave, fitted dark satin evening dress, standing behind a marble bar in a smoky gold-lit jazz club after hours, one hand idly tapping a slim gold cigarette case against the bar in a slow rhythm, gaze lowered and unreadable, warm amber light and a fading magenta stage wash behind her, gilt mirror and bottles catching the glow, quiet controlled composure"
gen $D/vera_greet.jpg      "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame, approaching a marble bar in a smoky gold-lit jazz club after hours, a striking sharp-eyed woman in an evening dress watching him steadily from behind the bar, warm amber backlight rimming the silhouette against deep magenta shadow, the stillness before an opening move"
gen $D/vera_still.jpg      "extreme close-up of a striking sharp-eyed woman's face in her forties, dark hair swept in a sleek wave, one hand frozen mid-tap holding a slim gold cigarette case flat against dark marble, eyes lifting slowly and sharply to meet the viewer, warm amber light catching the planes of her face against deep magenta shadow, a smoky gold-lit jazz club after hours, the exact instant of total attention"

# ---- r_forsale: the wrong read — money (cold) ----
gen $D/vera_furs.jpg       "close-up detail shot, a worn dented gold cigarette case resting on a dark marble bar beside an elegant woman's hand, in soft-focus background other patrons' wrists show gleaming diamond watches and fine furs, warm amber bar light and magenta stage-wash haze, a smoky gold-lit jazz club after hours, a quiet visual contradiction, film-noir detail"

# ---- r_scared: the wrong read — fear (threat) ----
gen $D/vera_calm.jpg       "medium shot, a striking sharp-eyed woman in an evening dress behind a marble bar in a smoky gold-lit jazz club after hours, glancing coolly toward an unseen corner of the room with mild proprietary calm rather than fear, composed and unbothered, warm amber light and drifting magenta haze, a bandstand and velvet booths soft-focus in the background, quiet total command of the room"

# ---- t1: the trade, value for value (warm) ----
gen $D/vera_trade.jpg      "tight overhead close-up of a torn yellowed ledger page being set down onto a dark marble bar beside an elegant woman's hand and an untouched glass, faint handwriting and columns of figures visible, warm amber bar light glinting off the marble, a smoky gold-lit jazz club after hours, the page sitting between two people like a held breath"
gen $D/vera_warm.jpg       "medium close-up, a striking sharp-eyed woman in her forties turning a torn ledger page over once in her fingers, expression easing from guarded into genuine interest, the first real smile of the night ghosting at one corner of her mouth, warm amber bar light and soft magenta stage-wash, a smoky gold-lit jazz club after hours, a wall of bottles and a gilt mirror behind her"

# ---- n1: the name, a rare unguarded memory (guilt) ----
gen $D/vera_name.jpg       "intense close-up of a striking sharp-eyed woman's face as a name lands like a physical blow, eyes widening, cigarette case forgotten motionless in her hand, lips parting in genuine surprise, warm amber light catching unshed emotion in her eyes, deep magenta shadow, a smoky gold-lit jazz club after hours"
gen $D/vera_memory.jpg     "close-up of a striking sharp-eyed woman gazing into middle distance behind a marble bar, lost in a fond old memory, the faint ghost of a private smile, eyes distant and a little sorrowful, warm amber light low and steady, a smoky gold-lit jazz club after hours, quiet nostalgia"

# ---- n2: leverage on grief, the wall goes back up (cold) ----
gen $D/vera_stung.jpg      "close-up of a striking sharp-eyed woman's face as warmth drains out fast, expression flattening into old guarded coldness, jaw setting, eyes going hard and distant, warm amber bar light now throwing a harder colder edge across her face, a smoky gold-lit jazz club after hours, a wall going back up"

# ---- p1: pressed for names, a warning not a refusal (threat) ----
gen $D/vera_warn.jpg       "medium shot, a striking sharp-eyed woman setting a slim gold cigarette case down flat and silent on a dark marble bar, drawing herself up with sudden unmistakable authority, direct unflinching eyes, warm amber light now sharp-edged, deep magenta shadow, a smoky gold-lit jazz club after hours, a quiet dangerous warning"

# ---- c1: the money, wounds not tempts (cold) ----
gen $D/vera_cash.jpg       "tight overhead close-up of a folded roll of bills set down on a dark marble bar beside an untouched cocktail glass, a woman's manicured hand just visible at the edge of frame not reaching for it, warm amber bar light glinting off the marble, a smoky gold-lit jazz club after hours, money sitting like an accusation"
gen $D/vera_cold.jpg       "close-up of a striking sharp-eyed woman looking down at a fold of money without touching it, an expression of tired almost-pity rather than temptation, one eyebrow faintly raised, warm amber light, deep magenta shadow, a smoky gold-lit jazz club after hours, quiet weary disappointment"

# ---- turn: THE COMPLICATION — the patron crosses the floor (tense) ----
gen $D/vera_patron.jpg     "wide shot, a well-dressed man in an expensive overcoat and polished shoes striding confidently across a smoky gold-lit jazz club floor after hours, other patrons and staff subtly reacting to his presence, a bandleader nodding respectfully from a stage in the background, warm amber and magenta stage light, dramatic noir atmosphere, an entrance that commands the room"
gen $D/vera_booth.jpg      "medium shot, a striking sharp-eyed woman in an evening dress warmly guiding a well-dressed older man in an expensive overcoat by the elbow toward a private velvet booth in the back of a smoky gold-lit jazz club, practiced professional charm on her face, warm amber light and deep magenta shadow pooling around the booth, film-noir atmosphere, effortless authority"

# ---- aftermath: the actual test (tense) ----
gen $D/vera_return.jpg     "medium close-up, a striking sharp-eyed woman sliding back onto a barstool a while later, settling opposite the viewer, studying them in unreadable silence before speaking, warm amber bar light and soft fading magenta stage-wash, a smoky gold-lit jazz club emptied out after hours, quiet weighing tension"

# ---- endings (portraits behind the consequence cards) ----
gen $D/vera_turned_end.jpg "warm medium shot, a striking sharp-eyed woman in her forties lighting a cigarette in a slim gold case for the first time, a rare genuine relaxed smile, leaning back against a marble bar backed by a gilt mirror and bottles, warm amber light now full and golden, soft magenta afterglow, a smoky jazz club after hours, a moment of real trust extended"
gen $D/vera_wary_end.jpg   "close-up of a striking sharp-eyed woman already reaching to close out a bar tab, expression flat, final, and transactional, eyes not quite meeting the viewer's, cool amber light now edged with distance, a smoky gold-lit jazz club after hours, a door quietly closing"
gen $D/vera_burned_end.jpg "tense wide shot, a striking sharp-eyed woman standing rigid behind a marble bar in a smoky gold-lit jazz club after hours, two burly card players rising from a corner table in sharp-focus background, her expression ice-cold and final, warm amber light gone hard and cold-edged, deep shadow, an unmistakable dismissal"

echo "=== vera scene panels done ===" ; ls $D/vera*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/vera.jpg            "noir crime graphic novel head and shoulders portrait of a striking sharp-eyed woman in her forties, dark hair swept in a sleek 1940s wave, fitted dark satin gown, a slim gold cigarette case held elegantly, poised knowing expression, warm amber light mixed with magenta stage-wash, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal-magenta and gold palette, high production value, no text, no watermark"

echo "=== vera cast portrait done ===" ; ls -la $C/vera.jpg
