#!/usr/bin/env bash
# DENSE per-beat panels for the KASTNER CONFRONTATION (kastner_confront.ts) — the
# Chapter Three / Act II midpoint sit-down. A distinct, meaningful shot for each
# dialogue beat (manhwa pacing), plus the base establishing scene and the board
# cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
# Modeled exactly on scripts/gen_vera.sh / scripts/gen_gallo.sh / scripts/gen_ricci.sh.
# NOTE: CF image quota was exhausted at authoring time — this script is queued,
# not run. Run it later once quota resets, then verify every file under
# public/assets/art/scene/kastner_*.jpg + scene/kastner.jpg + cast/kastner.jpg
# exists before the mission ships.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric harbor haze, atmospheric depth of field, grimy salt-rust amber and cold steel color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast
mkdir -p "$D" "$C"

KASTNER="a heavyset thick-necked union boss in his sixties, weathered wind-burned face, close-cropped grey hair, a heavy wool pea coat over a rumpled vest, thick calloused hands, a longshoreman's cargo hook hanging at his belt, cold pale watchful eyes, an old scar through one eyebrow"

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_kastner.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_kastner.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_kastner.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/kastner.jpg "wide establishing shot inside a cavernous rust-streaked waterfront union hiring hall before dawn, $KASTNER seated behind a raised podium desk beneath a huge chalk assignment board, a ragged line of fifty dockworkers waiting in the cold grey light near the doors, bare bulbs swinging overhead, condensation dripping from corrugated iron beams, grimy amber lamp glow against cold steel-blue morning light, oppressive dockside authority"

# ---- s0_serene: full swagger, doesn't know your face (tense) ----
gen $D/kastner_hall_throne.jpg "wide low-angle shot of a cavernous rust-streaked hiring hall before six in the morning, fifty weary dockworkers lined up in cold grey light waiting on a chalk assignment board, $KASTNER seated above them at a raised podium desk like a king on a throne, a young dark-coated man's silhouette approaching through the crowd, bare bulbs swinging, grimy amber and steel-blue tones, oppressive scale"
gen $D/kastner_serene_dismiss.jpg "medium shot, $KASTNER leaning back at his podium desk with lazy dismissive authority, one hand waving toward an empty stool, a faint contemptuous smirk, grimy amber hall light behind him, out-of-focus dockworkers waiting in line, cold steel shadow, unbothered king-of-the-hall confidence"

# ---- s0_cracks: word's reached him, rattled (tense) ----
gen $D/kastner_cracks_tense.jpg "close-up of $KASTNER's weathered face, jaw set hard, eyes narrowed with real unease he's trying to bury, grimy amber hall light raking across old scars, cold steel shadow at the frame's edge, a proud man rattled and hiding it"
gen $D/kastner_cracks_warn.jpg "medium shot, $KASTNER leaning forward over his podium desk with a warning glare, one thick finger pointed forward, the chalk board looming behind him, harsh amber light from a bare bulb overhead, cold steel-blue gloom filling the hall, a threat delivered low and fast"

# ---- s0_forewarned: the hall stacked, cold from the start (threat) ----
gen $D/kastner_forewarned_stack.jpg "wide tense shot of a rust-streaked hiring hall, hulking longshoremen posted arms-crossed at every door in the grey morning light, $KASTNER seated dead center at his podium desk watching a young man's wary silhouette cross the empty floor, harsh bare-bulb light pooling ominously, coiled danger, cold steel and amber tones"
gen $D/kastner_forewarned_threat.jpg "low-angle close-up, $KASTNER leaning into hard bare-bulb light, eyes cold and flat with menace, one calloused hand resting deliberately on the cargo hook at his belt, grimy amber light carving deep shadow across his weathered face, cold steel gloom behind him, an unmistakable threat delivered quietly"

# ---- open: the table, laying his terms (tense) ----
gen $D/kastner_open_board.jpg "medium wide shot, $KASTNER standing beside the huge chalk assignment board in his hiring hall, one thick hand resting on it like a throne's armrest, weary dockworkers waiting out of focus behind him, grimy amber overhead light, cold steel-blue morning haze through high dirty windows, a king surveying his terms"
gen $D/kastner_open_sizeup.jpg "close-up on a young man's watchful eyes in profile, catching a half-second detail off-frame — a tell in someone else's gaze — controlled calculating focus, cold steel-blue light from a dirty window, grimy rust-streaked hall wall softly out of focus behind him, the moment of a read landing"

# ---- the read: fear vs muscle vs true believer (tense) ----
gen $D/kastner_read_fear.jpg "extreme close-up on $KASTNER's eyes, a fast involuntary flick sideways toward an unseen board before the gaze snaps back to hard composure, a single bead of sweat at his temple catching grimy amber light, cold steel shadow crowding the frame, the mask slipping for one instant"
gen $D/kastner_read_missmuscle.jpg "medium shot, $KASTNER standing immovable and broad-shouldered at his podium desk, arms crossed, utterly unbothered, radiating decades of survived threats, harsh bare-bulb light, cold steel-blue hall behind him, a man too settled in power to be simple muscle"
gen $D/kastner_read_missbeliever.jpg "medium close-up, $KASTNER's face carefully blank as a dockworker in the background line is escorted away by two large men, no reaction, no protest, grimy amber hall light, cold steel shadow, a supposed champion of his men looking pointedly elsewhere"

# ---- table: impatient, waiting on your play (tense) ----
gen $D/kastner_table_wait.jpg "medium shot, $KASTNER tapping two thick fingers on the chalk assignment board, impatient and bored, harsh overhead bare-bulb light, cold steel-blue gloom filling the cavernous hall behind him, a king waiting to be entertained"

# ---- c_manifest: the manifests land (threat) ----
gen $D/kastner_manifest_alarm.jpg "close-up of $KASTNER's face going rigid with alarm, eyes locked on a folded shipping manifest held just out of frame, jaw tightening, grimy amber light hard across his weathered features, cold steel shadow pressing in, the exact instant his secret is named"
gen $D/kastner_manifest_press.jpg "medium shot of a young man in a dark coat holding a folded manifest steady in grimy amber light, calm and controlled, $KASTNER's broad shoulder tense in the near foreground, cold steel-blue hall gloom behind, quiet total command of the moment"

# ---- c_customs: Breen's name lands (threat) ----
gen $D/kastner_customs_alarm.jpg "close-up of $KASTNER's weathered face, real alarm breaking through his composure at a name spoken aloud, calloused hand gripping the edge of his podium desk, harsh amber bare-bulb light, cold steel shadow, a proud man recalculating fast"
gen $D/kastner_customs_press.jpg "medium shot of a young man leaning in with quiet certainty, one hand flat on the podium desk sealing a federal accusation, grimy amber light on his composed face, $KASTNER's tense shoulder visible opposite, cold steel-blue hall gloom, the terms turning serious"

# ---- c_witness: the vanished man, old guilt (guilt) ----
gen $D/kastner_witness_guilt.jpg "close-up of $KASTNER's face, something guarded and old crossing his eyes, a flicker of buried guilt he won't let surface, grimy amber light low and heavy, cold steel shadow pooling around him, a man carrying a private weight for years"
gen $D/kastner_witness_press.jpg "medium shot of a young man's face intense and quietly furious, naming a dead man's widow, grimy amber hall light on his set jaw, $KASTNER's broad silhouette rigid across from him, cold steel-blue gloom, a reckoning long overdue"

# ---- c_rival: Delaney's name lands (fear) ----
gen $D/kastner_rival_alarm.jpg "close-up of $KASTNER's face, a flicker of fear he can't smother at a rival's name, eyes darting once toward the line of dockworkers behind him then back, grimy amber light hard on his features, cold steel shadow, controlled dread over his own chair"
gen $D/kastner_rival_press.jpg "medium shot of a young man leaning forward with cold clinical calm, laying out an ultimatum point by point, grimy amber light steady on his composed face, $KASTNER's broad shoulders tense opposite him, cold steel-blue hall gloom pressing at the edges, the walls closing in"

# ---- the reveal: he names the Cassar Bank (mercy / broken / pivot) ----
gen $D/kastner_names_ally.jpg "medium close-up of $KASTNER exhaling in grim relief, shoulders dropping, calloused hands flat on his podium desk as he gives up a name under his breath, grimy amber light gone warmer and steadier, cold steel shadow retreating, a cornered man choosing the safer surrender"
gen $D/kastner_names_broken.jpg "low-angle shot of $KASTNER dragged half-upright by his own collar by unseen hands, spitting a name out like a curse, humiliated dockworkers watching in blurred soft focus behind him, harsh amber bare-bulb light, cold steel darkness pooling around him, broken but still full of hate"
gen $D/kastner_names_pivot.jpg "medium close-up of $KASTNER laughing once, bitter and caught, sitting back between two unseen threats, grimy amber light catching a rueful twist at his mouth, cold steel-blue hall gloom framing him, a man who just found his own leash"

# ---- endings (portraits behind the consequence cards) ----
gen $D/kastner_end_ally.jpg "medium shot of $KASTNER standing straight-backed once more behind his chalk assignment board, dockworkers lined up as always, but his eyes now flick warily toward the viewer for approval before every call, grimy amber hall light, cold steel-blue morning haze, a king who now answers to someone else"
gen $D/kastner_end_broken.jpg "wide shot of $KASTNER slumped against his podium desk in the cavernous hall, surrounded by the silent staring faces of the dockworkers who once feared him, all authority drained from his posture, harsh cold bare-bulb light, steel-blue gloom, a throne emptied in public"
gen $D/kastner_end_pivot.jpg "medium shot of $KASTNER standing rigid and watchful at his podium desk, a younger rival's blurred figure visible at the edge of the hall not quite approaching, both men's eyes flicking toward the viewer, grimy amber light, cold steel shadow, an uneasy balance held by someone else's hand"
gen $D/kastner_end_walk.jpg "wide shot of $KASTNER nodding once, unbothered, as two huge dockworkers escort a young man out past the waiting line toward the doors, grimy amber hall light, cold steel-blue morning haze spilling through the entrance, total unshaken command of the room"

echo "=== kastner scene panels done ===" ; ls $D/kastner*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/kastner.jpg "noir crime graphic novel head and shoulders portrait of $KASTNER, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted rust-amber and cold steel palette, high production value, no text, no watermark"

echo "=== kastner cast portrait done ===" ; ls -la $C/kastner.jpg
