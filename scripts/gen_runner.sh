#!/usr/bin/env bash
# DENSE per-beat panels for the Tommy/runner mission — a distinct, meaningful shot
# for each dialogue beat (manhwa pacing), generated with detailed cinematic prompts
# (camera, expression, gesture, lighting, environment). Cloudflare FLUX-schnell.
# Creds in ~/.cf_ai (never committed). Modeled exactly on gen_sal.sh's recipe.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, muted teal and amber color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast
mkdir -p "$D" "$C"

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_runner.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_runner.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_runner.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base scene (default backdrop for the mission) ----
gen $D/runner.jpg          "wide atmospheric establishing shot of a narrow rain-slicked back alley and a dockside tenement service stairwell at night, a lone teenage boy in a cheap jacket crouched on the steps under a single bare bulb counting money, wet cobblestones reflecting the light, corrugated metal and dripping fire escapes framing the shot, cold blue-black rain, lonely and tense, distant harbor fog"

# ---- r0: the approach (tense) ----
gen $D/runner_watch.jpg    "wide establishing long shot from deep shadow across a narrow rain-slicked alley toward a lit service stairwell, a lean teenage boy crouched on the steps under one bare bulb, rain streaking down in the light, wet brick and dripping pipework framing the foreground, cold surveillance distance, muted teal darkness against warm bulb glow"
gen $D/runner_count.jpg    "medium close shot of a thin nervous nineteen-year-old boy in a worn jacket collar up, crouched on a stairwell step, counting a roll of bills by the light of a single bare bulb, lips moving silently as he recounts, rain misting past the light, wary posture, dockside tenement stairwell at night"
gen $D/runner_startle.jpg  "a startled teenage boy spinning around on a stairwell step, bills scattering out of his hand into the rain, wide alarmed eyes, one hand flying toward his jacket out of instinct, bare bulb swinging slightly overhead, wet stone steps, sudden motion, dockside alley at night"
gen $D/runner_swagger.jpg  "a young teenage boy straightening up too fast on a stairwell, chin raised, shoulders squared in a forced tough posture, jaw tight with false bravado, rain dripping off his cap brim, one bare bulb lighting him hard from above, wary alley at night"
gen $D/runner_approach.jpg "dramatic over-the-shoulder noir shot from behind a young man's dark silhouette stepping into a pool of bare-bulb light in a narrow alley, ahead a nervous teenage runner frozen mid-step on the stairs, strong contrast between cold rain-blue shadow and warm bulb glow, tense stillness"
gen $D/runner_crack.jpg    "extreme close-up of a nineteen-year-old boy's face, the forced tough expression cracking, mouth open mid-word, eyes suddenly wide and young and afraid, rain beaded on his skin, harsh bare-bulb light from above, dockside alley at night"

# ---- rp1/rp2: wrong read, proud (tense/cold) ----
gen $D/runner_brag.jpg     "a teenage boy on a stairwell puffing his chest out, grinning with forced pride, one hand gesturing boastfully as he brags, rain around him, single bulb light throwing a hard warm glow, a kid trying to sound bigger than he is, dockside alley at night"
gen $D/runner_hollow.jpg   "close-up of a teenage boy's grin holding a beat too long, eyes darting nervously away from the viewer toward the rain and the empty street, a flicker of hollow uncertainty behind the forced smile, bare bulb light, dockside alley at night"
gen $D/runner_defensive.jpg "a teenage boy stepping back on a stairwell, grin gone, jaw clenched and shoulders raised defensively, gripping a roll of bills tightly, hurt and anger in his eyes, harsh bulb light, wet stone steps, dockside alley at night"

# ---- rb1/rb2: wrong read, believer (tense/threat) ----
gen $D/runner_loyal.jpg    "a teenage boy standing a little straighter, asserting loyalty with quick nervous conviction, chin lifted, eyes darting to check if it's believed, single bulb light, wet stairwell at night"
gen $D/runner_suspicious.jpg "close-up of a teenage boy's eyes narrowing with sudden sharp suspicion, calculating and wary beneath the nerves, rain dripping past his face, hard bulb light from above, dockside alley at night"
gen $D/runner_warn.jpg     "a teenage boy backing up the stairwell steps toward the street, one hand half-raised as if about to shout for help, alarm and defiance on his face, rain streaking through the bulb light, tense alley at night"

# ---- rs1: the correct read (fear) ----
gen $D/runner_fear.jpg     "intense close-up of a nineteen-year-old boy's face as the tough-guy mask completely falls away, revealing raw youthful fear, eyes glistening, mouth trembling slightly, rain running down his cheeks like tears, soft bare-bulb light, dockside stairwell at night, suddenly looking very young"
gen $D/runner_ask.jpg      "a calm young man's shadowed face leaning in gently, one open hand extended in a small non-threatening gesture, across from him a scared teenage boy watching warily but listening, warm bulb light between them, quiet rain, dockside alley at night"

# ---- rs_force: wrong lever, force (threat) ----
gen $D/runner_flinch.jpg   "a teenage boy flinching backward hard as if struck, eyes wide and filling with tears, mouth open in a shocked ragged breath, rain-soaked, harsh bulb light casting a hard shadow, dockside stairwell at night, wounded betrayal"

# ---- rs_bribe: wrong lever, big bribe (tense) ----
gen $D/runner_cash.jpg     "a hand fanning out a thick roll of bills toward a teenage boy on a rain-slicked stairwell, the boy staring at the money without reaching for it, an expression of tired offended hurt rather than temptation, bare bulb light glinting off wet bills, dockside alley at night"

# ---- the complication: Deak calls, the confession (threat) ----
gen $D/runner_callout.jpg  "a teenage boy's head snapping up and toward an unseen voice calling from the top of a rain-slicked stairwell leading to the street, alarm flashing across his face, single bulb swinging slightly, wet stone steps, urgent dockside alley at night"
gen $D/runner_bolt.jpg     "a teenage boy half-risen from a stairwell step, body twisted between running up toward the street and staying, one hand braced on the wet stone, torn panic on his face, rain streaking past the bulb light, dockside alley at night"
gen $D/runner_confess.jpg  "a teenage boy's haunted face as a confession spills out of him, eyes distant and sick with memory, shoulders curling inward, rain running down his face, single bare bulb casting harsh light from above, dockside stairwell at night, quiet devastation"

# ---- endings (portraits behind the consequence cards) ----
gen $D/runner_turned_end.jpg "a teenage boy on a rain-slicked stairwell as tension finally leaves his shoulders, a small relieved almost-smile breaking through, eyes softening with something like hope, warm bulb light now feeling gentle instead of harsh, quiet resolve, dockside alley at night"
gen $D/runner_shaky_end.jpg  "a pale teenage boy standing rigid on a stairwell, hands trembling at his sides, eyes darting toward the top of the stairs, having given something up but still visibly terrified, harsh bulb light, rain, dockside alley at night"
gen $D/runner_burned_end.jpg "a teenage boy's back as he sprints up a rain-slicked stairwell two steps at a time toward the street lights above, motion-blurred urgency, dropped bills scattering behind him on the wet stone, dockside alley at night, a door closing"

# ---- cast portrait (corkboard/board use) ----
gen $C/runner.jpg          "head and shoulders noir portrait of a lean nineteen-year-old boy, damp tousled hair, cheap collared jacket, an uneasy half-defiant half-scared expression, dark plain background, single hard directional light, sharp detailed eyes carrying more fear than the posture admits"

echo "=== runner panels done ==="; ls $D/runner*.jpg 2>/dev/null | wc -l; ls $C/runner.jpg 2>/dev/null
