#!/usr/bin/env bash
# DENSE per-beat panels for the Milo "bagman" mission — a distinct, meaningful
# shot for each dialogue beat (manhwa pacing), plus the base establishing scene
# and the board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_gallo.sh.
#
# NOT YET RUN — CF image quota was exhausted at authoring time. Queue this for a
# later batch run once quota resets: `bash scripts/gen_bagman.sh`.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_bagman.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_bagman.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_bagman.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# recurring description anchors, so Milo and the room stay consistent across panels
MILO="a thin balding middle-aged bagman in shirtsleeves and loosened suspenders, wire-rim glasses fogged with sweat, sallow sweating face, thinning combed-over hair damp at the temples, ink-stained nervous fingers"
ROOM="a windowless back room behind a Nine Streets front business at night, a single bare bulb swinging on a cord overhead, a scarred wooden counting table stacked with rubber-banded cash bricks, a hand-crank adding machine spilling curled paper tape, ledgers and a small floor safe in the shadows, cracked plaster walls, harsh yellow bulb light against deep claustrophobic shadow"

# ---- base establishing scene (mission fallback background) ----
gen $D/bagman.jpg          "wide establishing shot inside a windowless back room at night, $MILO hunched alone at a scarred counting table under a single swinging bare bulb, stacks of rubber-banded cash and an adding machine spilling tape before him, a small floor safe half-open in the deep shadow behind him, harsh yellow bulb light pooling on the table and fading to black at the edges, airless and tense atmosphere, $ROOM"

# ---- s0: the approach (tense) ----
gen $D/bagman_count.jpg    "medium shot, $MILO alone at a counting table, tallying bricks of cash with quick practiced fingers, lips moving as he counts under his breath, an open ledger and adding machine beside him, harsh single-bulb light overhead, deep surrounding shadow, $ROOM"
gen $D/bagman_tally.jpg    "wide surveillance point-of-view shot through a cracked doorway into a back room at night, $MILO visible in the distance hunched over a counting table under a swinging bulb, cash stacks and ledgers scattered around him, cold dark foreground shadow framing the shot like someone watching unseen, tense observational distance, $ROOM"
gen $D/bagman_startle.jpg  "$MILO startled at his counting table, both hands sweeping loose cash into an open drawer, upper body twisting toward the door with wide alarmed eyes, an adding machine knocked half off the table spilling paper tape, sudden sharp motion, harsh bulb light and hard shadow, $ROOM"
gen $D/bagman_doorframe.jpg "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame in a back-room doorway, looking in at $MILO frozen behind his counting table under a swinging bulb, strong cold backlight rimming the silhouette, deep contrast, the stillness before a threat, $ROOM"
gen $D/bagman_sweat.jpg    "extreme close-up of $MILO's damp, panicked face, sweat beading at his temple and fogging his glasses, eyes wide and darting, mouth tight with barely controlled fear, harsh single-bulb light raking hard shadow across his features, $ROOM"

# ---- the woven read: what you decide he truly is ----
gen $D/bagman_feartell.jpg "extreme close-up of $MILO's trembling hands gripping a rubber-banded brick of cash he's already counted, his eyes fixed past the camera on a doorway rather than on the viewer, a tell of pure escape-mindedness, harsh bulb light, deep shadow, $ROOM"
gen $D/bagman_skimlook.jpg "close shot, $MILO's hand freezing an inch above a brick of cash on the table, fingers curling back as if it might bite him, a flicker of guilt and fear rather than greed crossing his sweating face, harsh single-bulb light, $ROOM"
gen $D/bagman_stiffen.jpg  "medium shot, $MILO's shoulders drawing up stiffly at the mention of his boss's name, a flinch dressed up as loyalty, jaw tight, eyes darting toward the door rather than defiant, harsh bulb light and deep shadow, $ROOM"

# ---- the name: it lands, then the complication ----
gen $D/bagman_namedrop.jpg "medium shot from behind a young man's shoulder, quietly speaking a name across a cluttered counting table toward $MILO who is caught mid-motion, cold intent in the young man's posture, harsh single bulb overhead, deep tense shadow, $ROOM"
gen $D/bagman_recognize.jpg "intense close-up of $MILO's face as the color drains out of it, a key of the adding machine still trapped under his thumb, eyes widening with dawning horror and recognition, harsh bulb light throwing hard shadow across sudden dread, $ROOM"
gen $D/bagman_confess.jpg  "close-up of $MILO speaking fast and flat, hands spread helplessly over the counting table, shoulders hunched in reluctant confession, a haunted resigned look, harsh single-bulb light, deep shadow, $ROOM"
gen $D/bagman_delivery.jpg "dynamic shot, a canvas satchel of cash bursting through a low door slot and thudding onto the floor of a back room at night, $MILO flinching backward from his counting table in shock, papers scattering, harsh swinging bulb light catching the sudden motion, deep chaotic shadow, $ROOM"
gen $D/bagman_checkin.jpg  "close shot, $MILO frozen rigid facing a closed door, eyes wide and darting between the door and the viewer, a fist audible pounding just out of frame, harsh single-bulb light throwing a hard vertical shadow across his terrified face, $ROOM"

# ---- the complication resolves three ways ----
gen $D/bagman_hold.jpg     "tense wide shot, a young man's shadowed silhouette and $MILO both frozen dead still on opposite sides of a counting table, eyes locked on a closed door, holding their breath together, harsh single-bulb light unmoving, deep still shadow, $ROOM"
gen $D/bagman_cover.jpg    "medium shot, a calm composed young man in shadow leaning back with an easy dismissive posture speaking loudly toward an unseen door, $MILO beside him rigid with disbelief at the bluff, harsh single-bulb light, deep shadow, $ROOM"
gen $D/bagman_lean.jpg     "close two-shot, a young man leaning in low and urgent across a counting table toward $MILO right as a fist pounds an unseen door, both faces lit hard from the single swinging bulb, tense claustrophobic urgency, deep shadow, $ROOM"

# ---- twist: guilt hardens into wounded calculation ----
gen $D/bagman_stung.jpg    "close-up of $MILO leaning back from the counting table, the raw fear on his face hardening into flat, guarded, wounded calculation, jaw set, eyes cold, harsh single-bulb light throwing a sharp shadow across half his face, $ROOM"

# ---- disarm: fear eases into a vent about the man who's never at risk ---
gen $D/bagman_ease.jpg     "medium shot, $MILO's shoulders dropping a fraction as tension eases just slightly, still sweating but no longer braced to run, a wary questioning look, harsh bulb light softened at the edges, $ROOM"
gen $D/bagman_vent.jpg     "close-up of $MILO giving a short ugly bitter laugh, gesturing at the cash on the table with contempt, resentment finally breaking through the fear, harsh single-bulb light, deep shadow, $ROOM"
gen $D/bagman_offerhand.jpg "medium shot, a young man leaning forward across a counting table with open steady hands and a sincere direct expression, offering something rather than demanding it, $MILO watching him warily across the cash and ledgers, harsh bulb light, $ROOM"
gen $D/bagman_doubt.jpg    "medium close-up of $MILO studying the viewer with a long calculating look, one eyebrow raised, guarded hope warring with old suspicion, harsh single-bulb light catching fogged glasses, deep shadow, $ROOM"
gen $D/bagman_warm.jpg     "close-up of $MILO's fear finally easing into the faint ghost of relief, eyes glistening, shoulders unclenching, warmer tone to the harsh bulb light as if the room itself relaxed, $ROOM"

# ---- worse fear: the audit ----
gen $D/bagman_audit.jpg    "extreme close-up of $MILO going utterly still and pale, eyes fixed and unblinking on a private nightmare, throat tight, harsh single-bulb light throwing deep cold shadow into his eye sockets, gripped by dread, $ROOM"

# ---- press: he panics, threatens to call for help ----
gen $D/bagman_threaten.jpg "$MILO backing toward a door, one hand raised, voice climbing in panic, threatening gesture undercut by visible terror, papers falling off the counting table behind him, harsh bulb light swinging with the motion, chaotic shadow, $ROOM"
gen $D/bagman_callbluff.jpg "a calm young man in shadow standing motionless with a cold quiet stare, calling a bluff, $MILO faltering across the table as his nerve visibly drains away, harsh single-bulb light between them, tense standoff, $ROOM"
gen $D/bagman_choke.jpg    "close-up of $MILO with a shout dying in his throat, mouth open then clamping shut, fear and fast calculation replacing defiance, swallowing hard, harsh bulb light, hard shadow across his jaw, $ROOM"
gen $D/bagman_handover.jpg "close shot, $MILO's shaking hands shoving tally sheets across a counting table, several sliding off the edge onto the floor, defeated posture, harsh single-bulb light, deep shadow, $ROOM"

# ---- bribe: money answers the wrong question ----
gen $D/bagman_cashoffer.jpg "tight overhead close-up of a fold of paper money being set down onto a table already covered in rubber-banded cash bricks, a hand just withdrawing, harsh single-bulb light glinting off the stacks, an oddly redundant gift, $ROOM"
gen $D/bagman_stare.jpg    "close-up of $MILO staring down at an added fold of money on his already cash-covered table without touching it, a suspicious, almost offended confusion on his sweating face, harsh single-bulb light, $ROOM"
gen $D/bagman_moneytalk.jpg "close-up of $MILO giving a short humorless laugh, shaking his head, gesturing dismissively at the cash-covered table, explaining something with tired conviction, harsh single-bulb light, deep shadow, $ROOM"

# ---- endings (portraits behind the consequence cards) ----
gen $D/bagman_turned_end.jpg "emotional medium shot, $MILO kneeling beside a loose floorboard, lifting out a battered tin box of hidden papers with both hands and holding it out toward the viewer, eyes wet with relief and quiet resolve, warmer golden light now filling the back room at night, a moment of costly trust, $ROOM"
gen $D/bagman_bought_end.jpg "close-up of $MILO sliding a stack of tally sheets across the counting table without meeting the viewer's eyes, expression flat, cold, and transactional, nothing behind his stare, harsh single-bulb light, $ROOM"
gen $D/bagman_burned_end.jpg "$MILO standing rigid and blank beside his counting table, eyes fixed on the door, body angled as if already calculating his escape route, cold dread and intent written on him, harsh bulb light and deep ominous shadow, $ROOM"

echo "=== bagman scene panels done ===" ; ls $D/bagman*.jpg 2>/dev/null | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/bagman.jpg          "noir crime graphic novel head and shoulders portrait of a thin balding nervous bagman in his forties, wire-rim glasses, sweat-damp combed-over hair, shirtsleeves and loosened suspenders, sallow anxious face, eyes not quite meeting camera, harsh single bulb light from above mixed with cold blue-grey ambient light, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal and amber palette, high production value, no text, no watermark"

echo "=== bagman cast portrait done ===" ; ls -la $C/bagman.jpg
