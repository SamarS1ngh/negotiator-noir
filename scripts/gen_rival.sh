#!/usr/bin/env bash
# DENSE per-beat panels for the Rival (Coyle) mission — a distinct, meaningful
# shot for each dialogue beat (manhwa pacing) plus the base scene illustration
# and the corkboard cast portrait. Cloudflare FLUX-schnell for the scene panels
# (matches gen_bianchi.sh / gen_sal.sh exactly), Pollinations for the cast photo
# (matches gen_cast.sh). Creds in ~/.cf_ai (never committed).
#
# NOTE: Cloudflare free-tier quota is currently exhausted for this account —
# this script is written but NOT run. Run it once quota resets.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_rival.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_rival.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_rival.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base scene illustration (used as the mission's default `scene:`) ----
gen $D/rival.jpg          "wide establishing shot, a lean silver-templed city alderman in a sharp three-piece suit dealing cards alone at a private club's card table, low brass lamp overhead, green felt, cigar smoke curling, wood-panelled room in shadow behind him, a man who never shows what he's holding, cold envious-green lamplight, noir atmosphere, night"

# ---- s0: the approach (tense) ----
gen $D/rival_establish.jpg "wide establishing shot from the doorway of a private club's wood-panelled card room at night, a lean silver-templed alderman in a sharp three-piece suit seated alone dealing his own game under a low hanging brass lamp, green felt table, cigar smoke drifting, dark leather chairs in shadow around the edges of the room, cold envious-green light pooling on the cards, a man's whole domain in one careful shot"
gen $D/rival_watchful.jpg  "medium shot, a lean silver-templed alderman in a fitted suit glancing up just slightly from the cards he's dealing, sharp assessing eyes cutting sideways toward an approaching stranger, no other part of him moving, cold green lamplight across sharp cheekbones, cigar smoke curling past his face, a fast silent judgment being made, private club card room at night"
gen $D/rival_guarded.jpg   "medium shot, a lean silver-templed alderman at a card table not looking up, one hand cutting the deck with practiced ease, mouth set in a flat unbothered line as he speaks a clipped warning, green brass lamp light, cigar smoke, dark wood-panelled club room at night, the stillness of a man used to being obeyed"
gen $D/rival_tell.jpg      "close-up, a lean silver-templed alderman's hand dealing cards smoothly across green felt while his OTHER hand absently pats at the breast pocket of his suit jacket, a small compulsive tell, his face otherwise composed and unreadable above, warm green lamp glow, cigar haze, private club card room at night, a careful man's carefulness leaking through"

# ---- i1: ambition misread (cold) ----
gen $D/rival_ambition.jpg  "medium close-up, a lean silver-templed alderman giving a short humorless laugh without looking up from his cards, one eyebrow arched in tired cynicism, a man who has heard the same flattering pitch many times before, green lamp light, cigar smoke curling past his jaw, private club card room at night"

# ---- f1: grudge misread (cold) ----
gen $D/rival_grudge.jpg    "medium shot, a lean silver-templed alderman dealing the next hand with practiced calm, face composed into deliberate boredom, eyes flat and unmoved, the faint tightness at his jaw the only trace of old resentment he refuses to show, green brass lamplight, cigar haze, dark wood-panelled club room at night"

# ---- p_fear: the woven read lands (tense/fear) ----
gen $D/rival_fearlock.jpg  "close-up, a lean silver-templed alderman's eyes lifting slowly and deliberately off his cards for the first time, a genuine flicker of fear breaking through his composed features, jaw tight, one hand gone still on the deck, cold green lamplight sharpening the moment his control cracks, private club card room at night, quiet dread"
gen $D/rival_note.jpg      "medium shot, a discreet club steward in a dark waistcoat leaning in at the shoulder of a seated silver-templed alderman, sliding a small folded note across the green felt card table, the alderman's dealing hand frozen mid-shuffle, cards scattered slightly, green lamp light, cigar smoke, tense hush falling over the private club room at night"

# ---- the complication, three ways ----
gen $D/rival_readnote.jpg  "close-up, a lean silver-templed alderman unfolding a small note with careful fingers, eyes moving across it, jaw tightening hard, then refolding it slow and deliberate, green lamp light catching the paper, cigar smoke drifting, private club card room at night, the exact moment bad news lands"
gen $D/rival_guess.jpg     "medium close-up, a lean silver-templed alderman staring hard across the table with a long measuring look, an unopened folded note still resting under his fingers, faint unease breaking through his composure, green brass lamplight, cigar haze, private club card room at night, calculating how much the stranger already knows"
gen $D/rival_bold.jpg      "medium shot, a lean silver-templed alderman leaning back in his chair, ignoring the unopened note on the table, studying the stranger opposite him with an expression caught between insult and reluctant respect, green lamp light, cigar smoke curling, dark wood-panelled club room at night"

# ---- endings (portraits behind the consequence cards) ----
gen $D/rival_allied.jpg    "medium shot, a lean silver-templed alderman setting his cards face-down on the green felt and looking straight into camera for the first time, an expression of cold resolved decision, green brass lamplight steady on his face, cigar smoke drifting past, private club card room at night, a careful man who has finally chosen to move, portrait framing"
gen $D/rival_wavered.jpg   "medium shot, a lean silver-templed alderman gathering his cards back into a neat deck, composed and giving nothing away, faint dismissive politeness on his face, green lamp light, cigar haze, dark wood-panelled club room at night, a man who has decided to decide nothing yet, portrait framing"
gen $D/rival_hedge.jpg     "medium shot, a lean silver-templed alderman rising from the card table, buttoning his suit jacket, already turning toward a hallway telephone in the background of a private club at night, cold purposeful urgency on his face, green lamp light behind him, cigar smoke hanging in the air, portrait framing"

echo "=== rival dense panels done ==="; ls $D/rival*.jpg 2>/dev/null | wc -l

# ---- cast portrait for THE WEB board (corkboard surveillance-photo look) ----
CD=public/assets/art/cast
mkdir -p "$CD"
CAST_STYLE="noir crime graphic novel portrait, glossy cel-shaded, dramatic low-key lighting, muted teal and amber palette, head and shoulders, plain dark background, sharp detailed eyes, high production"

gen_cast() { # gen_cast <out> <seed> <desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local enc
  enc=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$3, $CAST_STYLE")
  if curl -fsSL -m 180 -o "$1" "https://image.pollinations.ai/prompt/${enc}?width=800&height=1000&nologo=true&seed=$2&model=flux"; then
    file "$1" | grep -q "image data" && echo "OK $1" || echo "FAIL $1"
  else echo "FAIL(curl) $1"; fi
  sleep 6
}

gen_cast $CD/rival.jpg 641 "a lean silver-templed city alderman in a sharp three-piece suit, cold calculating eyes, faint humorless smile, a career politician's practiced composure"

echo "=== rival cast portrait done ==="; ls -la $CD/rival.jpg 2>/dev/null
