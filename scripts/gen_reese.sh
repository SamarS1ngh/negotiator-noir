#!/usr/bin/env bash
# DENSE per-beat panels for the Reese mission — a distinct, meaningful shot for each
# dialogue beat (manhwa pacing), generated with detailed cinematic prompts (camera,
# expression, gesture, lighting, environment). Cloudflare FLUX-schnell. Creds in
# ~/.cf_ai (never committed).
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, muted amber and brown color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_reese.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_reese.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_reese.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (tense) ----
gen $D/reese_alone.jpg    "wide establishing shot of a dim smoky back booth in a nearly empty bar at night, a tired rumpled detective in a rain-damp brown suit slumped alone against worn cracked leather, his battered hat resting on the table beside a half-full whisky glass, thin cigarette smoke curling upward through a shaft of dim amber light, rain streaking a small window behind him, weary guilt sitting heavy in his slumped shoulders, moody chiaroscuro, muted amber-brown noir palette, nobody else nearby"
gen $D/reese_tail.jpg     "close shot from behind a rumpled detective's shoulder in a dim smoky bar booth, the back of his hat and greying hair lit by a single amber wall sconce, his tired eyes catching a faint reflection in the rain-streaked window glass in front of him, a whisky glass held loosely halfway raised in one weathered hand, jaw set in tired defiance, out-of-focus figure approaching softly behind him, muted amber-brown noir lighting, curling smoke"
# ---- n_conscience: the guilt bomb (guilt) ----
gen $D/reese_stops.jpg    "extreme close-up of a weary detective's face in a dim bar booth at night, his whisky glass frozen halfway to his lips, eyes flicking up sharply, a flicker of old pain and surprise breaking through his exhausted professional mask, deep worry lines lit by warm amber sconce light, thin smoke haze drifting past, rain blurred on the window behind him"
gen $D/reese_ask.jpg      "over-the-shoulder shot from behind a young visitor's dark-coated shoulder across a worn bar booth table, looking at a tired rumpled detective who tilts his head slightly, listening with a distant searching look as an old memory surfaces in his eyes, his hat and whisky glass resting on the table between them, dim smoky amber booth lighting, rain streaking the window"
gen $D/reese_envelope.jpg "close-up of a weary detective in a brown suit setting his whisky glass down slowly and deliberately on a worn wooden table, his hand lingering near the rim, gaze dropped and distant, heavy old shame etched into his lined weathered face as a buried memory resurfaces, warm amber booth lamp light, curling cigarette smoke, rain-blurred window behind him, quiet devastation"
# ---- n_fear: the fear math (fear) ----
gen $D/reese_hollow.jpg   "close-up of a tired detective's face mid a short hollow humorless laugh in a dim bar booth at night, head tipped back slightly, eyes glassy and distant with old dread, stubbled jaw drawn tight, warm amber lamp light casting harsh shadows across his face, thin smoke haze, worn brown suit collar visible"
gen $D/reese_weigh.jpg    "medium two-shot in a dim smoky bar booth at night, a young visitor leaning forward earnestly in the foreground shadow across a worn wooden table, a tired rumpled detective in the background weighing his words with a conflicted searching expression, one hand loosely around a whisky glass, his hat resting beside it, warm amber lamp light, rain streaking the window behind them"

# ---- r_threatened: the woven read, wrong (fear-read fumble) (cold) ----
gen $D/reese_hard.jpg     "extreme close-up of a tired detective's jaw setting hard in a dim bar booth at night, not fear but a flash of old bitter anger, eyes narrowing and fixing coldly forward, a muscle jumping at his temple, warm amber sconce light turned harsh across the sharp new angle of his face, thin smoke haze, worn brown suit collar, a wrong lever landing badly"
# ---- r_forsale: the woven read, wrong (money-read fumble) (tense) ----
gen $D/reese_tell.jpg     "close-up of a tired detective's eyes dropping to his own dim reflection in a half-raised whisky glass in a smoky bar booth at night, unable to hold his own gaze, a flicker of quiet shame crossing his lined face, warm amber lamp light distorted in the glass, rain streaking the window behind him, a man who cannot be bought caught almost being offered a price"
# ---- n_conscience: the complication (guilt/tense) ----
gen $D/reese_shadow.jpg   "medium shot in a dim smoky bar at night, a big quiet man in a cheap ill-fitting suit settling onto a stool two seats down from a tired detective and a young visitor, ordering a drink without a glance their way, the detective's face going carefully blank with sudden tension, warm amber bar light throwing a long wary shadow across the counter, rain streaking the window, the sense of being watched by the wrong man"

# ---- endings (portraits behind the consequence cards) ----
gen $D/reese_file_end.jpg "medium shot of a weary detective in a rain-damp brown suit pulling a thick folder from inside his coat and holding it out across a worn bar booth table, his tired lined face set with a fragile note of resolve and relief, his hat and half-empty whisky glass beside him, warm amber lamp light, curling smoke, rain streaking the window behind him, a quiet moment of a guilty man finally doing one right thing"
gen $D/reese_shake_end.jpg "close-up of a detective's trembling hands gripping a whisky glass and drinking it fast in a dim bar booth, eyes darting nervously toward an unseen door, a sheen of sweat on his brow, his battered hat knocked slightly askew on the table, cold amber lamp light, thick smoke haze, a man unraveling after giving something up"
gen $D/reese_fold_end.jpg "a rumpled detective standing alone at a cracked outdoor phone booth in heavy night rain, hat pulled low, jaw hard and face closed off with cold resolve, one hand lifting the receiver to dial, harsh amber streetlight glinting through the downpour, the bar's warm glow receding in the distance behind him, a man about to warn the wrong side"

echo "=== reese dense panels done ==="; ls $D/reese_*.jpg | wc -l
