#!/usr/bin/env bash
# DENSE per-beat panels for the Breen mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the base establishing scene and the
# board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_vera.sh.
#
# NOT YET RUN — CF image quota was exhausted at authoring time. Queue this for a
# later batch run once quota resets: `bash scripts/gen_breen.sh`.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_breen.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_breen.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_breen.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# recurring description anchors, so Breen and the shed stay consistent across panels
BREEN="a smug comfortable middle-aged customs officer, sandy thinning hair combed back, ruddy well-fed face, uniform shirt open at the collar, boots up on the desk, an easy unbothered grin like nothing has ever once gone wrong for him"
SHED_ROOM="a cramped customs shed built out over dark water at night, pilings creaking under the floor, towers of stamped manifest forms leaning on every surface, a rubber stamp and ink pad on the blotter, a police-band radio on a shelf, a half-open bottom desk drawer with a bottle of rye inside, a single bare bulb overhead, small windows streaked with harbour damp, cheap warm bulb light against cold water-dark outside"

# ---- base establishing scene (mission fallback background) ----
gen $D/breen.jpg           "wide establishing shot inside a cramped customs shed over dark water at night, $BREEN leaning back behind a cluttered desk, boots up on stacked manifest forms, a warm cheap bulb overhead and cold black water visible through a small streaked window behind him, $SHED_ROOM"

# ---- s0: the approach (tense) ----
gen $D/breen_shed.jpg      "wide establishing shot from outside, a small customs shed built out on pilings over dark harbour water at night, one lit window glowing warm against the cold black water and distant ship lights, rain-slicked planking leading to the door, lonely and exposed, $SHED_ROOM"
gen $D/breen_desk.jpg      "tight overhead close-up on a cluttered customs desk, stacks of stamped manifest forms, a rubber stamp resting in an ink pad, a half-open bottom drawer revealing a bottle of rye tucked among loose papers, warm cheap bulb light, $SHED_ROOM"
gen $D/breen_greet.jpg     "medium shot, $BREEN not bothering to sit up straight, boots still on the desk, glancing sideways at the doorway with lazy unconcerned amusement, warm bulb light overhead, $SHED_ROOM"
gen $D/breen_laugh.jpg     "medium shot, $BREEN leaning back laughing easily, pouring a second glass of rye from the bottle in his open bottom drawer, utterly at ease, warm bulb light, $SHED_ROOM"

# ---- the woven read: what you decide he truly is ----
gen $D/breen_shielded.jpg  "close-up on $BREEN's ruddy face completely at ease, no sweat, no tension, a faint unbothered smile, eyes calm and untroubled, warm bulb light casting soft shadow, $SHED_ROOM"
gen $D/breen_greedy.jpg    "close-up on $BREEN's face as money is mentioned, eyes notably flat and uninterested rather than hungry, no calculation behind them, warm bulb light, $SHED_ROOM"
gen $D/breen_coward.jpg    "close-up on $BREEN's face at the mention of dangerous cargo, showing no flinch at all, utterly unbothered stillness where fear should be, warm bulb light, $SHED_ROOM"

# ---- friendly: charm bounces off a man who feels untouchable (cold) ----
gen $D/breen_charm.jpg     "medium two-shot, a young man in shadow leaning in easy and friendly across the desk from $BREEN, matching his relaxed tone, warm bulb light, $SHED_ROOM"
gen $D/breen_unmoved.jpg   "medium shot, $BREEN grinning wide and pouring another drink, completely unmoved and comfortable, boots still up on the desk, warm bulb light, $SHED_ROOM"

# ---- the reality lever + THE COMPLICATION (tense) ----
gen $D/breen_crack.jpg     "close-up on $BREEN's face as his easy grin visibly falters for the first time, a flicker of real unease breaking through the smugness, eyes losing their certainty, warm bulb light turning slightly colder, $SHED_ROOM"
gen $D/breen_radio.jpg     "close-up on a police-band radio on a shelf crackling to life with static, $BREEN's alarmed face turning toward it in the background out of focus, the color draining from his features, warm bulb light against the sudden tension, $SHED_ROOM"

# ---- handling the live call ----
gen $D/breen_coach.jpg     "medium two-shot, a young man leaning in close and low across the desk, murmuring urgent quiet instructions, $BREEN listening intently with the radio handset raised halfway to his mouth, warm bulb light, $SHED_ROOM"
gen $D/breen_steady.jpg    "close-up on $BREEN speaking into the radio handset with surprising steadiness in his expression despite a faint tremor in his gripping hand, warm bulb light, $SHED_ROOM"
gen $D/breen_silent.jpg    "medium shot, a young man standing back in silence with arms crossed, watching $BREEN reach for the radio alone, warm bulb light, $SHED_ROOM"
gen $D/breen_sweat.jpg     "close-up on $BREEN having just hung up the radio handset, sweat now beading visibly on his temple, his hand trembling slightly where it rests on the desk, a new unease in his eyes, warm bulb light, $SHED_ROOM"

# ---- bribe: money misreads a man who's never risked anything (cold) ----
gen $D/breen_bribe.jpg     "tight overhead close-up of a folded roll of bills being set down on a cluttered customs blotter beside stacked manifest forms, warm bulb light glinting off the desk, $SHED_ROOM"
gen $D/breen_count.jpg     "close-up on $BREEN barely glancing down at the money, sipping his drink instead, utterly unimpressed and unbothered, warm bulb light, $SHED_ROOM"
gen $D/breen_double.jpg    "medium shot, $BREEN shrugging and reaching for a larger fold of cash without any change in his easy expression, warm bulb light, $SHED_ROOM"

# ---- threat: he laughs, insulated by fourteen years of nothing landing (threat) ----
gen $D/breen_threat.jpg    "medium two-shot, a young man leaning in with a hard warning expression across the desk from $BREEN, warm bulb light turned harder and colder, $SHED_ROOM"
gen $D/breen_laughoff.jpg  "medium shot, $BREEN tipping his head back in genuine unbothered laughter, utterly dismissive of a threat, boots still up on the desk, warm bulb light, $SHED_ROOM"

# ---- endings (portraits behind the consequence cards) ----
gen $D/breen_turned_end.jpg   "medium shot, $BREEN setting down an empty glass and pushing the rye bottle aside unfinished, his expression quiet and genuinely sobered for the first time, sliding a stack of manifest forms across the desk, warm bulb light now steadier, $SHED_ROOM"
gen $D/breen_shaky_end.jpg    "close-up on $BREEN's trembling hands shoving a stack of manifest forms across the desk, his face pale and eyes fixed nervously on the door, wanting the visitor gone, warm bulb light, $SHED_ROOM"
gen $D/breen_bought_end.jpg   "medium shot, $BREEN pocketing a fold of cash without a second glance, the same easy untroubled grin as when the visitor arrived, nothing changed in his manner, warm bulb light, $SHED_ROOM"
gen $D/breen_hardened_end.jpg "close-up on $BREEN's face closing over into cold, careful, calculating stillness for the first time all night, eyes now wary and fixed on the visitor specifically, already thinking of who to call, warm bulb light gone harder, $SHED_ROOM"

echo "=== breen scene panels done ===" ; ls $D/breen*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/breen.jpg           "noir crime graphic novel head and shoulders portrait of a smug ruddy-faced customs officer in his forties, sandy thinning hair combed back, uniform shirt open at the collar, an easy self-satisfied grin, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal and amber palette, high production value, no text, no watermark"

echo "=== breen cast portrait done ===" ; ls -la $C/breen.jpg
