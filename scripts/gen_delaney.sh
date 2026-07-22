#!/usr/bin/env bash
# DENSE per-beat panels for the Delaney mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the mission's base scene image and his
# corkboard cast portrait, generated with detailed cinematic prompts (camera,
# expression, gesture, lighting, environment). Cloudflare FLUX-schnell. Creds in
# ~/.cf_ai (never committed). NOT RUN — CF quota is exhausted; run this manually
# once quota resets, then the art self-integrates (filenames already referenced
# in src/content/delaney_mission.ts).
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, muted teal and amber color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
DS=public/assets/art/scene
DC=public/assets/art/cast
mkdir -p "$DS" "$DC"

gen() { # gen <out> <detailed-desc> [width] [height]
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body w h
  w="${3:-816}"; h="${4:-1216}"
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':int(sys.argv[4]),'width':int(sys.argv[3])}))" "$2" "$STYLE" "$w" "$h")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_delaney.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_delaney.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_delaney.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# Delaney: wiry, sharp-eyed, twenty-six, sleeves rolled and ink-stained from a
# borrowed mimeograph, a battered union pin on a cheap collar, no suit, no
# muscle behind him — just nerve. Setting: a cramped back room over The Anchor
# (a union bar), corkboard three-deep in leaflets ("KASTNER OUT"-style rally
# copy), a card table, a bottle of cheap rye, a bare hanging bulb, exposed
# pipes, the jukebox thump bleeding faintly up through the floorboards.

# ---- the base scene (default background for the mission) ----
gen $DS/delaney.jpg "a wiry sharp-eyed young union organizer in his mid-twenties standing in a cramped back room above a dockside bar, sleeves rolled and ink-stained, pinning a fresh mimeographed leaflet to a corkboard already three-deep in rally flyers, a bare bulb swinging overhead, a card table with a bottle of cheap rye and stacked petition sheets, exposed pipes and peeling paint, cold amber bulb-light against deep shadow, a young rival quietly building his own war room"

# ---- s0: the approach (tense) ----
gen $DS/delaney_establish.jpg "wide establishing shot of a cramped windowless back room above a bar at night, a wiry young man in rolled ink-stained shirtsleeves standing at a corkboard packed three-deep with mimeographed union leaflets, pinning a fresh one up with his back half-turned to the door, a card table nearby with a bottle of cheap rye and neat stacks of signed petition sheets, a single bare bulb swinging faintly overhead casting hard amber light and long shadows, peeling wallpaper and exposed pipes, the muffled thump of a jukebox bleeding up through the floorboards, tense quiet before a confrontation"
gen $DS/delaney_dismiss.jpg "medium shot of a wiry young union organizer at a corkboard, one hand still pressing a pushpin into a fresh leaflet, head not turning toward the door, jaw set with practiced dismissal, ink-stained rolled sleeves, a bare bulb throwing hard amber light across packed leaflets behind him, cramped back room over a bar at night, a man used to unwanted visitors"
gen $DS/delaney_approach.jpg "dramatic over-the-shoulder noir shot from behind a young man's dark silhouette filling the doorway of a cramped leaflet-covered back room, looking in at a wiry organizer half-turned from a corkboard, a bare bulb swinging and casting stark amber light and moving shadow, deep contrast, the stillness before two strangers size each other up"
gen $DS/delaney_watchful.jpg "close two-shot, a wiry sharp-eyed young union organizer turning fast toward camera, eyes darting first to a stack of signed petition sheets on a nearby card table before settling warily on the viewer, ink-stained rolled sleeves, a bare swinging bulb throwing hard amber light and shifting shadow across a corkboard of leaflets behind him, cramped back room over a bar at night, quick calculating suspicion"

# ---- p_proof: reads the proof cold, then the interruption ----
gen $DS/delaney_proofread.jpg "close-up of a wiry young union organizer reading a folded document held in ink-stained hands, expression flat and coldly calculating rather than pleased, eyes narrowed with quick certainty, a bare bulb over a corkboard of leaflets casting hard amber light and deep shadow, cramped back room above a bar at night, the exact instant a rival decides an old enemy is already finished"
gen $DS/delaney_interrupt.jpg "medium shot of a wiry young union organizer's head snapping sharply toward a closed door, folded proof still in hand halfway into his pocket, alarm flashing across his face, a bare bulb swinging and throwing jittery amber light across a leaflet-covered corkboard, cramped back room above a bar at night, the sudden tension of footsteps and a voice on the stairs outside"

# ---- the complication: three ways through, one shared test ----
gen $DS/delaney_freeze.jpg "medium shot of a wiry young union organizer standing dead still with one hand raised for quiet, calling back toward a door with practiced ease, tension held tightly behind calm eyes, a bare bulb throwing hard amber light across a corkboard of leaflets, cramped back room above a bar at night, the controlled stillness of a man well-practiced at hiding what he's doing"
gen $DS/delaney_cover.jpg "medium shot from behind a young man's shadowed shoulder calling out loudly and casually toward an unseen door, across from him a wiry union organizer watching with a flicker of surprised respect at how smoothly the cover landed, a bare swinging bulb over a leaflet-packed corkboard, cramped back room above a bar at night, tense noir camaraderie"
gen $DS/delaney_confront.jpg "wide shot of a young man's dark silhouette wrenching open a door onto an empty dim stairwell landing, a fire door swinging shut on its own hinge in the distance, a wiry union organizer visible behind in the leaflet-covered back room looking rattled and exposed, hard amber bulb light spilling into the cool stairwell shadow, cramped bar-building interior at night, unsettled tension"
gen $DS/delaney_edge.jpg "close-up of a wiry young union organizer studying the viewer with a hard, testing stare, arms crossed loosely, ink-stained fingers tapping once against his sleeve, a corkboard of leaflets and a bare swinging bulb behind him throwing amber light and deep shadow, cramped back room above a bar at night, a proud younger man deciding whether he's being used or genuinely dealt with"

# ---- the leash test resolved ----
gen $DS/delaney_trust.jpg "medium close-up of a wiry young union organizer's shoulders easing, a flicker of grudging respect crossing his sharp features, arms uncrossing slowly, a corkboard of leaflets and a bare swinging bulb behind him casting warmer amber light now, cramped back room above a bar at night, the guarded thaw of a proud man deciding to trust, if only a little"

# ---- i1: no proof, wants something solid ----
gen $DS/delaney_skeptic.jpg "medium shot of a wiry young union organizer letting out a short humorless laugh, one eyebrow raised, arms crossing dismissively in front of a corkboard packed with leaflets, a bare bulb throwing hard amber light and shadow, cramped back room above a bar at night, unimpressed by empty flattery, demanding something real"

# ---- pt1: the sunk-cost trap named aloud ----
gen $DS/delaney_trap.jpg "close-up of a wiry young union organizer's face hardening, not amused, eyes hard with old recognition, ink-stained hand gripping the edge of a card table stacked with petition sheets, a bare swinging bulb over a leaflet-covered corkboard throwing amber light and deep shadow, cramped back room above a bar at night, a younger man naming the exact trap someone just tried to set for him"

# ---- endings (portraits behind the consequence cards) ----
gen $DS/delaney_backing.jpg "medium shot of a wiry young union organizer extending an ink-stained hand for a firm handshake, a hard confident glint of shared purpose in his eyes rather than warmth, a corkboard of leaflets and a bare swinging bulb behind him casting warm amber light, cramped back room above a bar at night, common cause rather than friendship, portrait framing"
gen $DS/delaney_alone.jpg "medium shot of a wiry young union organizer folding a document into his coat and already turning for the door, a hard determined set to his jaw, not looking back, a corkboard of leaflets and a bare swinging bulb behind him throwing amber light into cooling shadow, cramped back room above a bar at night, a man now moving only for himself, portrait framing"
gen $DS/delaney_waved.jpg "medium shot of a wiry young union organizer turned back toward his corkboard, pinning a leaflet with dismissive finality, back mostly to the viewer, a bare swinging bulb casting hard amber light and long shadow across packed leaflets, cramped back room above a bar at night, the quiet finality of being dismissed, portrait framing"
gen $DS/delaney_insulted.jpg "close-up of a wiry young union organizer's face gone flat and cold, eyes hard with quiet anger, already half-turned toward an unseen door, a corkboard of leaflets and a bare swinging bulb behind him throwing harsh amber light and deep shadow, cramped back room above a bar at night, the exact instant a threat is met with cold calculated retaliation, portrait framing"

# ---- cast portrait (corkboard photo, same look as gen_cast.sh) ----
gen $DC/delaney.jpg "a wiry sharp-eyed young union organizer in his mid-twenties, rolled ink-stained shirtsleeves, a battered union pin on a cheap collar, slightly unruly hair, a hungry ambitious set to his jaw, noir crime graphic novel portrait, glossy cel-shaded, dramatic low-key lighting, muted teal and amber palette, head and shoulders, plain dark background, sharp detailed eyes, high production" 800 1000

echo "=== delaney dense panels + base + cast done ==="; ls $DS/delaney*.jpg $DC/delaney.jpg 2>/dev/null | wc -l
