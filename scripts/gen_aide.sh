#!/usr/bin/env bash
# DENSE per-beat panels for the Holt (Vane's aide) mission — a distinct, meaningful
# shot for each dialogue beat (manhwa pacing), plus the base establishing scene and
# the board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_vera.sh / scripts/gen_gallo.sh.
# NOTE: CF image quota was exhausted at authoring time — this script is queued,
# not run. Run it later once quota resets.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, cold civic marble and storm-grey color grade with brass accents, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_aide.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_aide.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_aide.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/aide.jpg          "wide establishing shot inside a wood-panelled City Hall back office late at night, tall dark oak filing cabinets floor to ceiling stuffed with folders, a brass desk lamp pooling warm light over a precise silver-templed man in shirtsleeves and waistcoat working alone at a heavy desk, a city seal and portraits of past commissioners on the wall in shadow, storm-grey rain streaking tall windows behind him, cold civic marble corridor visible through a half-open door, quiet after-hours power"

# ---- s0: the approach (tense) ----
gen $D/aide_watch.jpg    "wide long shot of a grand civic building's dark facade at night under storm-grey rain, rows of black windows except one glowing amber square high in an east wing, wet marble steps and iron railings in the foreground shadow, a lone figure's silhouette watching from across the street, cold lonely surveillance atmosphere"
gen $D/aide_files.jpg    "medium shot inside a wood-panelled back office, floor-to-ceiling dark oak filing cabinets and neat labelled folders stacked with unnerving precision, a brass desk lamp casting warm light across an empty leather chair and a closed ledger, cold storm-grey window light behind, an office that is itself a filing system for other people's secrets"
gen $D/aide_enter.jpg    "a precise silver-templed man in a tailored waistcoat freezing in his own office doorway at night, keys still raised in one hand, briefcase in the other, sharp guarded eyes finding an uninvited visitor already inside, brass lamp light and storm-grey window behind him, wood-panelled City Hall office, controlled alarm"
gen $D/aide_doorway.jpg  "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame, standing calm and unhurried inside a wood-panelled City Hall office, a precise silver-templed aide in the background sizing him up warily, brass lamp light rimming the silhouette against cold storm-grey window light, deep contrast, quiet audacity"
gen $D/aide_wary.jpg     "close-up of a precise silver-templed man's face in a wood-panelled office at night, composed and giving nothing away, one eyebrow faintly raised in cold appraisal, brass desk lamp light raking across sharp features, storm-grey shadow pooling at the edges, a man used to controlling every room he stands in"

# ---- the woven read: three interpretations, one framing beat each ----
gen $D/aide_broker.jpg   "extreme close-up of a precise silver-templed man's hand drumming once against a leather desk blotter at the mention of a name, his composed face betraying nothing above the hand, brass lamp light and cold storm-grey shadow, a wood-panelled City Hall office at night, the exact instant of a tell he didn't mean to give"
gen $D/aide_believer.jpg "close-up of a precise silver-templed man's jaw tightening almost imperceptibly, a flash of contempt behind otherwise perfectly controlled eyes at the mention of his superior's name, brass lamp light catching the hard line of his mouth, storm-grey window behind, a wood-panelled City Hall office at night, controlled bitterness"
gen $D/aide_scared.jpg   "medium close-up of a precise silver-templed man correcting a point with a small satisfied almost-smile, unhurried and exact, clearly enjoying being the smartest person in the room, brass desk lamp light, storm-grey shadow, a wood-panelled City Hall office at night, quiet dangerous self-assurance"

# ---- offer: the quiet favor ----
gen $D/aide_favor.jpg    "medium shot, a young man's hand setting a single folded document quietly on a heavy desk in a wood-panelled City Hall office at night, no cash, no ceremony, a precise silver-templed aide watching the gesture with sharp curiosity, brass lamp light, storm-grey window behind, an unasked-for favor changing hands"
gen $D/aide_study.jpg    "close-up of a precise silver-templed man studying a young visitor with long unreadable calculation, one hand steepled beneath his chin, weighing an unfamiliar kindness like a column that won't balance, brass desk lamp light, storm-grey shadow, a wood-panelled City Hall office at night"
gen $D/aide_unsettled.jpg "close-up of a precise silver-templed man's composed mask slipping into genuine disbelief, eyes widening slightly, mouth parting on an unspoken word, brass lamp light warming his face for the first time, storm-grey window behind, a wood-panelled City Hall office at night, twenty years of armor cracking a fraction"
gen $D/aide_cold.jpg     "close-up of a precise silver-templed man's brief openness slamming shut again, expression hardening back into practiced control, a thin knowing almost-disappointed smile, brass lamp light now throwing a harder edge across his face, storm-grey shadow, a wood-panelled City Hall office at night"

# ---- name: the full chain laid bare + THE COMPLICATION ----
gen $D/aide_chain.jpg    "tight overhead shot of scattered documents and photographs being laid out in a deliberate chain across a heavy desk in a wood-panelled office at night, a hand pointing along the sequence, brass lamp light glinting off the desk, storm-grey window behind, a map of complicity assembled piece by piece"
gen $D/aide_flicker.jpg  "close-up of a precise silver-templed man's face as something flickers behind his composure — not fear, cold recalculation, eyes narrowing slightly in appraisal rather than alarm, brass lamp light, storm-grey shadow, a wood-panelled City Hall office at night"
gen $D/aide_phone.jpg    "dramatic close shot of an old brass desk telephone suddenly lit from within, ringing, on a credenza in a wood-panelled City Hall office at night, a precise silver-templed man's hand frozen inches from reaching it, his face gone rigid, cold blue phone-light cutting through warm brass lamp glow, storm-grey window behind, a held breath"
gen $D/aide_ringout.jpg  "medium shot, a precise silver-templed man exhaling slowly as an old desk telephone finally goes silent after ringing unanswered, shoulders dropping a fraction, brass lamp light steadying, storm-grey window behind, a wood-panelled City Hall office at night, tension draining out of a held stillness"
gen $D/aide_answer.jpg   "medium shot, a precise silver-templed man speaking into an old desk telephone with perfectly smooth practiced ease, one hand flat on the desk, utterly composed mid-lie, brass lamp light, storm-grey window behind, a wood-panelled City Hall office at night, unsettling professional calm"
gen $D/aide_grab.jpg     "medium shot, a young man's hand seizing an old desk telephone receiver before anyone can stop him, holding it to his ear with cold focus, a precise silver-templed man half-risen from his chair in alarm behind him, brass lamp light, storm-grey window, a wood-panelled City Hall office at night, a boundary crossed"
gen $D/aide_stung.jpg    "close-up of a precise silver-templed man's face closing over hard and cold, any warmth gone, jaw set, eyes flat and guarded again, brass lamp light throwing a sharper colder edge, storm-grey shadow, a wood-panelled City Hall office at night, a wall going back up"

# ---- press: his pride, and twenty years of taking the fall ----
gen $D/aide_needle.jpg   "medium shot, a young man leaning across a heavy desk in a wood-panelled office at night, speaking pointedly, a precise silver-templed man across from him listening with rigid controlled stillness, brass lamp light between them, storm-grey window behind, a needle finding its mark"
gen $D/aide_anger.jpg    "close-up of a precise silver-templed man's practiced composure cracking into real, dangerous anger, eyes hard and furious, a hand braced flat on the desk, brass lamp light harsh across his face, storm-grey shadow, a wood-panelled City Hall office at night, twenty years of restraint fraying"
gen $D/aide_yield.jpg    "medium shot, a precise silver-templed man reaching into an open desk drawer with tight controlled resignation rather than reaching for a phone, jaw clenched, brass lamp light, storm-grey window behind, a wood-panelled City Hall office at night, a cornered man choosing compliance"

# ---- bribe: not cash, a stake in what's coming ----
gen $D/aide_stakeoffer.jpg "medium shot, a young man speaking across a heavy desk in a wood-panelled City Hall office at night, hands open, offering something intangible rather than money, a precise silver-templed man listening with sharp measuring attention, brass lamp light, storm-grey window behind"
gen $D/aide_calc.jpg     "close-up of a precise silver-templed man giving a short humorless laugh, eyes calculating hard behind the amusement, weighing an audacious offer with real seriousness despite the laugh, brass lamp light, storm-grey shadow, a wood-panelled City Hall office at night"

# ---- endings (portraits behind the consequence cards) ----
gen $D/aide_turned_end.jpg "warm medium shot, a precise silver-templed man unlocking a second hidden filing cabinet in a wood-panelled City Hall office at night, pulling out a thick folder with something like relief on his face for the first time, warm brass lamp light now fuller and golden, storm-grey window behind, twenty years of leverage finally shared"
gen $D/aide_wary_end.jpg  "close-up of a precise silver-templed man handing over a folder with unsteady hands, eyes averted, not meeting the viewer's gaze, cool brass lamp light edged with distance, storm-grey shadow, a wood-panelled City Hall office at night, compliance without trust"
gen $D/aide_leveraged_end.jpg "medium shot, a precise silver-templed man signing a document at his desk with cold meticulous care, already re-reading a clause, no warmth in his expression, brass lamp light flat and businesslike, storm-grey window behind, a wood-panelled City Hall office at night, a transaction closing"
gen $D/aide_burned_end.jpg "tense medium shot, a precise silver-templed man standing rigid and silent behind his desk in a wood-panelled City Hall office at night, one hand already drifting toward the telephone the instant the viewer's back is turned, brass lamp light gone hard and cold, storm-grey shadow, an unmistakable betrayal about to happen"

echo "=== aide scene panels done ===" ; ls $D/aide*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/aide.jpg          "noir crime graphic novel head and shoulders portrait of a precise silver-templed man in his fifties, wire-rimmed glasses, a tailored waistcoat and tie, cold controlled expression, faint knowing almost-ambitious set to the mouth, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted steel-blue and brass palette, high production value, no text, no watermark"

echo "=== aide cast portrait done ===" ; ls -la $C/aide.jpg
