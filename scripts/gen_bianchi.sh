#!/usr/bin/env bash
# DENSE per-beat panels for the Bianchi mission — a distinct, meaningful shot for each
# dialogue beat (manhwa pacing), generated with detailed cinematic prompts (camera,
# expression, gesture, lighting, environment). Cloudflare FLUX-schnell. Creds in
# ~/.cf_ai (never committed).
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_bianchi.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_bianchi.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_bianchi.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (tense) ----
gen $D/bianchi_establish.jpg "wide establishing shot from below, a sharp-suited ambitious young gangster leaning back with both forearms resting on a rusted iron railing above a moonlit foggy harbour at night, tall confident posture, jaw set with old resentment, cargo ships fading into thick fog behind him, cold envious-green moonlight cutting through the mist, his tailored suit sharply lit against the drifting haze, a man permanently chewing on an old insult, distant harbour lights blurred in the fog, noir isolation"
gen $D/bianchi_watchful.jpg "medium shot, a sharp-suited young gangster at the harbour railing turning his head slightly toward camera, eyes sharp and assessing, a faint calculating tilt to his mouth, one hand still resting on the cold iron rail, fog and the ghostly shapes of ships drifting behind him, moonlight and cold green tones raking across his face, quick silent judgment being made, night harbour atmosphere"
gen $D/bianchi_thirty.jpg "medium shot, a sharp-suited young gangster leaning against the harbour railing without straightening up, arms loosely crossed, chin lifted in mild contempt, one eyebrow raised as he looks over an approaching stranger, unimpressed and unhurried, moonlit fog rolling behind him with the dark shapes of ships, cold green-tinted night light, the confident stillness of a man who won't be rushed"

# ---- p_proof: the knife's edge (cold) ----
gen $D/bianchi_wolfsmile.jpg "close-up, a sharp-suited young gangster reading a folded paper held in both hands, a slow predatory smile spreading across his face, eyes narrowing with sharp delight, moonlit fog behind him blurred and cold-green, the exact instant satisfaction turns into a hunter's grin, night harbour railing, dramatic side lighting"
gen $D/bianchi_grievance.jpg "medium shot, a sharp-suited young gangster gripping the iron harbour railing with both hands, upper body turned away toward the fog-shrouded water and distant ships, jaw tight, eyes hard with twenty years of old bitterness, the earlier smile completely gone, cold moonlit green light on his profile, mist drifting past, a proud man speaking of a debt long owed him, night harbour atmosphere"
gen $D/bianchi_handover.jpg "over-the-shoulder shot from behind a young man's shadowed shape in the foreground, his hand extending a folded paper toward a sharp-suited gangster standing at the harbour railing, the gangster's eyes fixed on the paper with sharp attention, cold green moonlight and drifting fog between them, ships faint in the mist behind, a tense quiet exchange, night harbour"
gen $D/bianchi_generous.jpg "close-up, a sharp-suited young gangster studying the viewer with narrowed suspicious eyes, head tilted slightly, a thin humorless smile, turning the folded paper slowly in his fingers, weighing a hidden motive, cold green moonlight from the harbour behind him, fog drifting past his shoulder, quiet calculation, night atmosphere"

# ---- i1: no proof, wants a reason (tense) ----
gen $D/bianchi_weakmine.jpg "medium shot, a sharp-suited young gangster at the iron harbour railing shaking his head with a dismissive scoff, one hand raised palm-out as if waving off a foolish idea, a faint condescending smirk, cold green moonlight, fog and the silhouettes of ships behind him, unimpressed by empty ambition, demanding something solid, night harbour"

# ---- endings (portraits behind the consequence cards) ----
gen $D/bianchi_partner.jpg  "medium shot, a sharp-suited young gangster tucking a folded paper into his inside coat pocket, a wide confident grin, meeting the viewer's eyes with a conspiratorial nod, cold green moonlight at the harbour railing, fog and distant ships behind him, the look of an ambitious man agreeing to work alongside you, night atmosphere, portrait framing"
gen $D/bianchi_cutout.jpg   "medium shot, a sharp-suited young gangster tucking a folded paper into his coat, glancing back with a satisfied smirk as he begins to walk off from the harbour railing, cold green moonlight, drifting fog and distant ships behind him, a man now moving only for himself, night harbour, portrait framing"
gen $D/bianchi_waved.jpg    "medium shot, a sharp-suited young gangster turning his back at the harbour railing, face in cold profile as he looks out over the fog toward the ships, dismissive and unbothered, one hand gesturing a small wave-off over his shoulder, cold green moonlight, mist rolling low over the water, the quiet finality of being dismissed, night harbour, portrait framing"
gen $D/bianchi_insulted.jpg "close-up, a sharp-suited young gangster's face gone hard and cold with anger, eyes narrowed sharply, jaw clenched, a dark-suited associate's shoulder crowding into frame beside him, cold green moonlight sharpening the edges of his glare, fog and harbour railing behind, the exact instant a threat is met with cold menace, night atmosphere, portrait framing"

echo "=== bianchi dense panels done ==="; ls $D/bianchi_*.jpg 2>/dev/null | wc -l
