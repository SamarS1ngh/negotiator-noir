#!/usr/bin/env bash
# DENSE per-beat panels for the Halloran mission — a distinct, meaningful shot
# for each dialogue beat (manhwa pacing), plus the base establishing scene and
# the board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_gallo.sh.
# CF QUOTA GATED — do NOT run until quota resets. Art self-integrates later.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_halloran.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_halloran.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_halloran.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/halloran.jpg           "wide establishing shot inside a cramped waterfront manifest shed at night, a heavyset middle-aged dockmaster in a peaked cap and ink-stained shirt sleeves alone at a cluttered desk under a single caged bulb, towers of shipping ledgers and crate-number logs stacked around him, a rack of fountain pens lined up with military precision, rust streaks bleeding down corrugated iron walls, a fogged window overlooking dark cranes and stacked cargo containers, salt-rusted atmosphere, cold industrial shadow pooling in the corners, lonely bureaucratic quiet"

# ---- s0: the approach (tense) ----
gen $D/halloran_log.jpg       "medium shot, a heavyset middle-aged dockmaster in a peaked cap alone at a cluttered desk at night, carefully signing a shipping manifest with a fountain pen, a second identical pen set precisely aside on a velvet block, stacks of crate-number ledgers around him, harsh caged bulb light throwing hard shadows across his lined weathered face, rust-streaked corrugated walls, meticulous obsessive precision, salt-air dockside office at night"
gen $D/halloran_startle.jpg   "a heavyset dockmaster startled at his desk, pen freezing mid-signature, head snapping up too fast, eyes wide with alarm, papers slightly askew, harsh bare-bulb light and hard shadow, cramped rust-streaked manifest shed at night, sudden guarded tension"
gen $D/halloran_doorway.jpg   "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame in a shed doorway, looking into a small caged-bulb-lit office where a heavyset dockmaster sits frozen at his desk staring back warily, strong cold backlight rimming the silhouette, deep contrast, salt-rusted corrugated walls, the stillness before a threat"
gen $D/halloran_wary.jpg      "close-up of a heavyset dockmaster's weathered face, setting a fountain pen down with exaggerated precision exactly parallel to a ledger's edge, eyes narrowed in wary calculation, harsh caged-bulb light raking up from below, deep shadow in his eye sockets, cramped rust-streaked office at night, controlled suspicion"

# ---- the woven read: three flavors of the same tell ----
gen $D/halloran_realize.jpg   "extreme close-up on a dockmaster's ink-stained hands aligning a fountain pen with obsessive precision beside a signed manifest, his face soft-focused and anxious behind, harsh bare-bulb light, a visual study in a man building his own paper trail, rust-streaked shed walls, dim dockside office at night"
gen $D/halloran_sly.jpg       "medium close-up of a heavyset dockmaster's mouth tightening into an unhappy line as he finishes a signature, a flicker of dread rather than satisfaction crossing his tired eyes, harsh caged-bulb light, rust-streaked walls, cramped office at night, a tell that reads wrong at first glance"
gen $D/halloran_stiff.jpg     "medium shot of a heavyset dockmaster sitting rigidly upright at his desk, eyes flicking nervously toward a shed door for the third time, jaw set in false composure, harsh bare-bulb light and hard shadow, rust-streaked corrugated walls, a man performing calm he doesn't feel, dim dockside office at night"

# ---- n1: the name — Vidal, then Finn (guilt) ----
gen $D/halloran_freeze_tell.jpg "intense close-up of a heavyset dockmaster's face as a name lands like a blow, pen tearing a jagged line across the page in his hand, eyes wide with dawning old recognition, harsh caged-bulb light, rust-streaked shadow, cramped manifest shed at night, the exact instant a buried memory surfaces"
gen $D/halloran_confess.jpg   "close-up of a heavyset dockmaster looking down, voice barely audible, hands flat on a cluttered desk, quiet devastation and guilt in his weathered face, harsh bare-bulb light overhead, deep rust-streaked shadow, cramped dockside office at night, a confession nobody wanted to give"
gen $D/halloran_panic.jpg     "a heavyset dockmaster's head snapping toward a shed door, body rigid with alarm, one hand frozen over a ringing wall-mounted telephone, harsh caged-bulb light swinging slightly, rust-streaked corrugated walls, cramped office at night, sudden dread at an interruption"

# ---- the complication: three ways to handle it ----
gen $D/halloran_hold.jpg      "two figures standing dead still in a dim rust-streaked manifest shed at night, a heavyset dockmaster and a young man's shadowed silhouette both frozen mid-breath, listening tensely toward a closed door, harsh caged-bulb light unmoving, held suspended tension, salt-air dockside office"
gen $D/halloran_cover.jpg     "a calm young man's shadowed silhouette speaking casually into an old wall-mounted telephone in a cramped rust-streaked manifest shed, a heavyset dockmaster watching from his desk with wide astonished eyes, harsh bare-bulb light, dim dockside office at night, a bluff being called and pulled off"
gen $D/halloran_rush.jpg      "wide shot, a frosted shed window hauled open onto an empty rain-slicked pier at night, coiled cable and a startled gull near an iron bollard, a heavyset dockmaster visible behind at his desk gone pale, harsh caged-bulb light spilling out into cold darkness, rust-streaked corrugated walls, unresolved dread"

# ---- n2: guilt twisted into a debt (cold) ----
gen $D/halloran_stung.jpg     "close-up of a heavyset dockmaster's face as the fear in his eyes hardens into bitter familiar mistrust, jaw tightening, walls slamming back up, harsh bare-bulb light throwing a sharp shadow across half his face, rust-streaked walls, cramped office at night, a wounded closing-off"

# ---- d1: resignation (cold) ----
gen $D/halloran_sink.jpg      "a heavyset dockmaster setting down his pen and sagging back into a creaking desk chair, all fight draining from his posture, gaze fallen to the ledgers, harsh caged-bulb light pooling on the papers, deep rust-streaked shadow around him, cramped dockside office at night, resignation and exhaustion"
gen $D/halloran_bitter.jpg    "close-up of a heavyset dockmaster giving a short humorless laugh, head tipped back slightly, eyes glassy with old dread, mouth twisted between a smile and despair, harsh bare-bulb light, rust-streaked shadow, cramped office at night, gallows arithmetic"

# ---- d_hope / d_fear ----
gen $D/halloran_doubt.jpg     "medium close-up of a heavyset dockmaster studying the viewer with a long wary searching look, one eyebrow raised, guarded hope warring with suspicion, harsh caged-bulb light and rust-streaked shadow, cramped dockside office at night, a man deciding whether to trust a stranger"
gen $D/halloran_relief.jpg    "a weary heavyset dockmaster as tension finally eases from his shoulders and face, eyes softening with cautious relief, harsh bulb light now feeling warmer against rust-streaked walls, small dockside office at night, a flicker of restored calm"
gen $D/halloran_dread.jpg     "extreme close-up of a heavyset dockmaster going rigid and pale, eyes fixed on a private nightmare, cold sweat at his temple, harsh caged-bulb light and deep rust-colored shadow swallowing the frame edges, cramped office at night, gripped by dread"

# ---- p1/p2: the official front cracks (threat/fear) ----
gen $D/halloran_defensive.jpg "a heavyset dockmaster half-risen behind his desk, one hand raised in official protest, voice clearly raised, jaw set defiant, harsh bare-bulb light swinging, rust-streaked corrugated walls, cramped manifest shed at night, a bureaucratic wall going up"
gen $D/halloran_crack.jpg     "close-up of a heavyset dockmaster's defiant official expression fracturing into raw fear, mouth open on an unfinished sentence, eyes suddenly wet and wide, harsh bulb light, rust-streaked shadow, cramped office at night, a mask breaking"
gen $D/halloran_handover.jpg  "close-up of a heavyset dockmaster's shaking ink-stained hands shoving a worn second ledger across a cluttered desk, eyes averted in shame, harsh caged-bulb light, rust-streaked walls, cramped dockside office at night, a forced concession"

# ---- c1: the money misreads him (tense) ----
gen $D/halloran_cash.jpg      "tight overhead close-up of a fold of paper money being set down on an open shipping manifest beside a rack of precisely aligned fountain pens, a hand just withdrawing, harsh bare-bulb light glinting off worn wood, rust-streaked desk, cramped dockside office at night, money sitting like an accusation"
gen $D/halloran_stare.jpg     "a heavyset dockmaster staring down at a fold of money without touching it, an expression of quiet insult rather than temptation, jaw tight, harsh caged-bulb light on his lined face, rust-streaked shadow, cramped office at night, moral weariness"
gen $D/halloran_refuse.jpg    "close-up of a heavyset dockmaster shaking his head slowly, sad rather than angry, eyes distant with old private arithmetic, harsh bare-bulb light, deep rust-streaked shadow, cramped dockside office at night, a grief money can't touch"

# ---- endings (portraits behind the consequence cards) ----
gen $D/halloran_turned_end.jpg "emotional medium shot, a heavyset dockmaster lifting a worn hidden ledger from a locked desk drawer with both trembling ink-stained hands, pressing it toward the viewer, eyes wet with relief and grim resolve, harsh bulb light now feeling warm and steady across the rust-streaked manifest shed at night, a moment of costly self-preservation turned into grace"
gen $D/halloran_scared_end.jpg "a heavyset dockmaster standing frozen behind his desk after a deal, hands still trembling, eyes fixed fearfully on the shed door, a man who gave up the ledger but never lost his terror, harsh caged-bulb light, deep rust-streaked shadow, cramped dockside office at night"
gen $D/halloran_burned_end.jpg "a heavyset dockmaster standing rigid and silent, one hand already reaching for a wall-mounted telephone, face turned away, jaw clenched with cold resolve to warn someone else, harsh bare-bulb light, rust-streaked corrugated walls, cramped manifest shed at night, an ominous quiet finality"

echo "=== halloran scene panels done ===" ; ls $D/halloran*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/halloran.jpg           "noir crime graphic novel head and shoulders portrait of a heavyset waterfront dockmaster in his fifties, peaked cap, ink-stained shirt collar, deep lined weathered face, tired wary eyes, a fountain pen clipped at his breast pocket, harsh bare-bulb light from below mixed with cold blue-grey ambient light, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal and amber palette, high production value, no text, no watermark"

echo "=== halloran cast portrait done ===" ; ls -la $C/halloran.jpg
