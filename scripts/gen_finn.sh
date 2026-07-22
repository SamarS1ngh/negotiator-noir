#!/usr/bin/env bash
# DENSE per-beat panels for the Finn mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the base establishing scene and the
# board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_sal.sh / scripts/gen_vera.sh.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_finn.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_finn.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_finn.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/finn.jpg              "wide establishing shot inside a cramped dockside tenement kitchen at dusk, peeling wallpaper and a small coal stove, a worn dead man's overcoat hanging alone on a hook by the door, a plain wooden table set for one, warm amber lamp light against cold blue window light off the harbor outside, salt-worn grimy dock amber color grade, quiet grief-soaked stillness, film-noir lighting"

# ---- s0: the approach (tense) ----
gen $D/finn_kitchen.jpg      "wide shot, a cramped dockside tenement kitchen, a proud gaunt woman in her forties in a plain dark dress standing very upright near a coal stove, a longshoreman's worn overcoat hanging untouched on a hook by the door, faded union calendar on the wall, warm amber lamp light and cold blue dusk through a small window, salt-worn grimy dock amber tones, composed grief, film-noir lighting"
gen $D/finn_coat.jpg         "tight close-up of a dead man's heavy worn overcoat hanging alone on a wall hook by a tenement kitchen door, frayed cuffs, a faint impression still in the shoulders like it was hung up mid-motion, warm amber lamp light falling across the wool, cold blue window light behind it, dust motes drifting, a held breath of absence, film-noir detail shot"
gen $D/finn_still.jpg        "medium shot, a proud gaunt woman in her forties standing perfectly upright in a cramped tenement doorway, dry-eyed, chin level, appraising a visitor on the step with unreadable composure, dockside kitchen warm amber light behind her against a cold blue evening street, salt-worn grimy dock amber tones, terrifying stillness, film-noir lighting"
gen $D/finn_wary.jpg         "medium close-up, a proud gaunt woman in her forties at a plain kitchen table, arms not quite crossed, watching a visitor with guarded appraisal rather than warmth, a longshoreman's coat soft-focus on a hook behind her, warm amber lamp light, salt-worn grimy dock amber color grade, wary composure, film-noir lighting"

# ---- THE WOVEN READ: the three tells (tense/threat/cold) ----
gen $D/finn_notes.jpg        "close-up overhead shot, a shoebox on a worn kitchen counter half-covered by a dish towel, newspaper clippings and a torn shipping schedule spilling out, a wall calendar behind it with several dates circled hard in pencil, warm amber lamp light catching the paper edges, salt-worn grimy dock amber tones, a case quietly built by hand, film-noir detail shot"
gen $D/finn_turnedaway.jpg   "medium shot from a rain-streaked tenement porch at night, a proud gaunt woman standing firm and forbidding in a lit doorway, one arm barring a young dockhand in a soaked coat with a knife-shaped bulge under it from stepping any closer, harsh porch light against black rain and wet cobblestones, salt-worn grimy dock amber tones, refusal not fear, film-noir lighting"
gen $D/finn_envelope.jpg     "tight close-up, a thick dust-furred envelope wedged behind a chipped sugar tin on a kitchen shelf, unopened, corners softened by weeks untouched, warm amber lamp light falling across the dust, salt-worn grimy dock amber tones, quiet unspoken refusal, film-noir detail shot"

# ---- disarm: she tests what you want (tense) ----
gen $D/finn_soften.jpg       "medium close-up, a proud gaunt woman in her forties at a kitchen table, shoulders easing by the smallest degree, an almost imperceptible softening at the eyes while her posture stays upright, warm amber lamp light, a longshoreman's coat soft-focus on a hook behind her, salt-worn grimy dock amber tones, guarded thaw, film-noir lighting"
gen $D/finn_test.jpg         "medium two-shot, a young man's shadowed determined face across a plain kitchen table from a proud gaunt woman studying him with careful evaluating eyes, warm amber lamp light between them, cold blue dusk through a small window behind, salt-worn grimy dock amber tones, a woman deciding whether to trust, film-noir lighting"

# ---- name: the mirror moment (guilt) ----
gen $D/finn_name.jpg         "intense close-up of a proud gaunt woman's face as her composure cracks for the first time, hand freezing flat on a worn kitchen table, eyes suddenly wet and unguarded, warm amber lamp light catching the break in her stillness, salt-worn grimy dock amber tones, a name landing like a physical blow, film-noir lighting"
gen $D/finn_grief.jpg        "close-up of a proud gaunt woman speaking quietly at her kitchen table, eyes distant with old grief, hands folded tight around a chipped teacup she isn't drinking from, warm amber lamp light low and steady, a longshoreman's coat soft-focus on a hook behind her, salt-worn grimy dock amber tones, quiet devastating honesty, film-noir lighting"

# ---- n2: leverage on grief, the wall slams back (cold) ----
gen $D/finn_stung.jpg        "close-up of a proud gaunt woman's face hardening fast from raw grief into cold offended composure, jaw set, eyes gone flat and distant, warm amber lamp light now throwing a harder edge across her face, salt-worn grimy dock amber tones, a wall slamming back up worse than before, film-noir lighting"

# ---- press: dangerous in her stillness (threat) ----
gen $D/finn_calmthreat.jpg   "close-up of a proud gaunt woman setting a chipped teacup down onto its saucer with slow exact precision, no clatter, her face utterly still and level, eyes fixed and unblinking on the viewer, warm amber lamp light, salt-worn grimy dock amber tones, controlled terrifying calm, film-noir lighting"
gen $D/finn_warn.jpg         "medium shot, a proud gaunt woman standing very straight at her kitchen table, voice implied quiet and level through a cold unflinching stare, one hand resting on the back of a chair like a boundary being drawn, warm amber lamp light, salt-worn grimy dock amber tones, a warning delivered without heat, film-noir lighting"

# ---- bribe: the one thing that insults her (cold) ----
gen $D/finn_cash.jpg         "tight overhead close-up of a single folded bill set down on a worn wooden kitchen table beside a chipped teacup, a woman's hand withdrawing just out of frame, warm amber lamp light glinting off the table grain, salt-worn grimy dock amber tones, money sitting between two people like an accusation, film-noir detail shot"
gen $D/finn_insult.jpg       "medium close-up, a proud gaunt woman looking pointedly toward a dusty envelope wedged behind a sugar tin on a shelf rather than at money on her table, expression flat and wounded rather than tempted, warm amber lamp light, salt-worn grimy dock amber tones, quiet unmistakable rebuke, film-noir lighting"

# ---- THE COMPLICATION: the Thursday knock (fear) ----
gen $D/finn_knock.jpg        "tense medium shot, a broad shadow crossing a frosted-glass tenement kitchen door at dusk, heavy boots stopped mid-step just outside, a proud gaunt woman inside going rigid and pale near the table, warm amber lamp light inside against cold blue silhouette through the glass, salt-worn grimy dock amber tones, dread suspended mid-motion, film-noir lighting"
gen $D/finn_hide.jpg         "medium shot from a dim narrow tenement hallway, a young man's shadowed figure pressed still against the wall out of a doorway's sightline, warm amber kitchen light spilling past him from the next room, cold blue dusk visible through a distant window, salt-worn grimy dock amber tones, held breath, film-noir lighting"
gen $D/finn_brazen.jpg       "medium shot, a proud gaunt woman standing in an open tenement doorway speaking to an unseen visitor with practiced convincing calm, a young man seated in plain view at the kitchen table behind her, warm amber lamp light against a cold blue evening street beyond the door, salt-worn grimy dock amber tones, a lie delivered smooth and fast, film-noir lighting"
gen $D/finn_confront.jpg     "wide shot, a young man standing firm in a lit tenement doorway facing a broad-shouldered man in a dock-union windbreaker on the front step at dusk, a proud gaunt woman visible just behind in the warm kitchen light, cold blue street shadow outside, salt-worn grimy dock amber tones, a held confrontation that will be remembered, film-noir lighting"
gen $D/finn_after.jpg        "medium shot, a proud gaunt woman sitting back down slowly at her kitchen table after a door closes, releasing a breath she'd been holding, warm amber lamp light steady again, a longshoreman's coat soft-focus on a hook behind her, salt-worn grimy dock amber tones, danger passed but the room changed, film-noir lighting"

# ---- endings (portraits behind the consequence cards) ----
gen $D/finn_clear_end.jpg    "warm medium shot, a proud gaunt woman reaching into the pocket of a dead man's overcoat still hanging by her kitchen door, drawing out a battered notebook with both hands, her face open with cautious hope for the first time, warm amber lamp light now fuller and golden, salt-worn grimy dock amber tones, a quiet moment of earned trust, film-noir lighting"
gen $D/finn_guarded_end.jpg  "medium close-up, a proud gaunt woman handing a worn notebook across her kitchen table with a flat, closed, purely transactional expression, already rising to end the visit, cool amber lamp light edged with distance, salt-worn grimy dock amber tones, a door politely closing, film-noir lighting"
gen $D/finn_burned_end.jpg   "tense medium shot, a proud gaunt woman standing rigid beside her open tenement door, one arm extended pointing a visitor out, expression ice-cold and final, a dead man's overcoat visible on its hook behind her, harsh amber light gone hard-edged against cold blue dusk outside, salt-worn grimy dock amber tones, an unmistakable dismissal, film-noir lighting"

echo "=== finn scene panels done ===" ; ls $D/finn*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/finn.jpg              "noir crime graphic novel head and shoulders portrait of a proud gaunt woman in her forties, dark hair pulled back severely, plain high-collared dark dress, dry-eyed composed expression carrying quiet grief and steel, warm amber light against a plain dark background, glossy cel-shaded noir style, sharp detailed eyes, salt-worn grimy dock amber and muted teal palette, high production value, no text, no watermark"

echo "=== finn cast portrait done ===" ; ls -la $C/finn.jpg
