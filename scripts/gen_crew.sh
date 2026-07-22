#!/usr/bin/env bash
# DENSE per-beat panels for the Crew mission — a distinct, meaningful shot for each
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_crew.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_crew.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_crew.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (tense) ----
gen $D/crew_establish.jpg "wide establishing shot at the end of a long wooden dock pier at night, a ring of rough weathered longshoremen gathered around a glowing oil-drum fire with sparks rising, a burly bearded foreman seated on a crate with a bottle, cold night-blue sky and black water beyond the pier's edge, warm grimy dock-amber firelight on gruff weathered faces, coiled mooring ropes and stacked cargo crates in shadow, unwelcoming closed-off atmosphere"
gen $D/crew_approach.jpg "wide low-angle shot, a lean young man in a dark coat walking alone down a long wooden pier at night toward a distant glowing oil-drum fire, silhouetted against its warm amber glow, cold night-blue mist rolling off black water on both sides, wary controlled posture, hands loose at his sides, sense of calculated risk and resolve"
gen $D/crew_enzo_bottle.jpg "medium shot at a dockside oil-drum fire at night, a gruff heavyset bearded dockworker foreman seated on an overturned crate, thick scarred hands wrapped around a bottle, eyes fixed downward not acknowledging the newcomer standing just outside the firelight, other rough longshoremen behind him in flickering silhouette, dismissive contempt, amber firelight flickering up against the cold blue dark"

# ---- n1: your father's goodwill (warm) ----
gen $D/crew_enzo_lookup.jpg "close-up at a dockside fire at night, a gruff bearded foreman slowly lifting his head from a bottle, eyes sharpening with dawning recognition, eyebrows raised, mouth parting around a name just heard, firelight catching the surprise on his weathered face, other longshoremen leaning in slightly behind him, amber glow against cold night-blue"
gen $D/crew_enzo_ask.jpg "medium close-up, a gruff bearded dock foreman leaning forward on his crate at a night fire, forearms on his knees, direct measuring gaze fixed on someone off-frame, waiting for an answer, firelight warm on his weathered face contrasted against the cold blue dark beyond the ring, other longshoremen watching silently in the background"
gen $D/crew_mc_plea.jpg "over-the-shoulder shot past a burly foreman's broad shoulder at a dockside night fire, toward a lean young man in a dark coat standing at the edge of the firelight, leaning in earnestly, jaw set, eyes intent as he makes his case, firelight catching one side of his face while cold night-blue dark frames the other, quiet urgency"

# ---- n2: pushback (cold) ----
gen $D/crew_enzo_pushback.jpg "a gruff bearded dock foreman rising slightly off an overturned crate at a night fire, alarmed and defensive, scarred hands spread in refusal, other weathered longshoremen behind him shifting uneasily and exchanging worried glances, firelight flaring upward against the cold night-blue dark, rising tension"

# ---- n_pip: Pip's tallies (guilt) ----
gen $D/crew_pip_intro.jpg "wide shot at the edge of a dockside oil-drum fire at night, a thin teenage dock loader hanging back in the shadows, his splinted and bandaged hand tucked behind his back, wary young face lit faintly by the fire's edge, older rough longshoremen positioned protectively near him, cold night-blue dark pressing in from beyond the firelight"
gen $D/crew_pip_offer.jpg "medium shot at a dockside night fire, a thin teenage loader stepping forward into the firelight, quiet determination on his young face, offering something with his good hand, his splinted and bandaged hand held stiffly at his side, a burly bearded foreman watching approvingly from a nearby crate, warm amber fire lighting the moment of resolve"

# ---- g1: the grievance (tense) ----
gen $D/crew_pip_hide.jpg "dockside night fire scene, a thin teenage loader with a splinted hurt hand tucked behind his back at the edge of a gathered crew, several weathered longshoremen shifting their broad shoulders to block the view of him, protective closed-ranks body language, amber firelight glow, coiled ropes and cargo crates nearby, cold night-blue dark beyond"
gen $D/crew_enzo_explain.jpg "medium shot at a dockside fire at night, a gruff bearded foreman following someone's gaze, setting his bottle down deliberately on a crate, his expression softening from irritation into something protective and sorrowful, firelight on his weathered face, other longshoremen quiet and listening around him"
gen $D/crew_mc_press.jpg "close-up at a dockside night fire, a lean young man in a dark coat with his face hard with quiet anger, eyes narrowed, leaning toward an unseen listener, firelight flickering across sharp features, a sharp challenging edge in his expression, cold night-blue dark framing him"

# ---- r1: fear of Marlowe (fear) ----
gen $D/crew_enzo_list.jpg "close-up at a dockside night fire, a gruff bearded foreman's face tightening with dawning unease, gripping a bottle harder, glancing sideways at his crew who shift and murmur behind him, a threat landing hard, firelight throwing harsh shadows across weathered faces, cold night-blue dark at the edges"
gen $D/crew_mc_warn.jpg "medium shot at a dockside night fire, a lean young man in a dark coat standing firm at the edge of the flames, voice measured, delivering a grim warning, calm but deliberate expression, firelight steady on his face while weathered longshoremen's faces darken with fear behind him"

# ---- m1: the insult of money (cold) ----
gen $D/crew_enzo_flat.jpg "medium shot at a dockside night fire, a gruff bearded foreman's face flat with contempt, arms crossed over his chest, staring hard at someone off-frame, dismissive and insulted, harsh amber firelight, other longshoremen murmuring disapproval in the shadowed background"
gen $D/crew_mc_number.jpg "close-up at a dockside night fire, a lean young man in a dark coat with a cool testing expression, delivering a hard line about price, firelight catching a calculating edge on his face, unmoved by the hostility around him, cold night-blue dark behind"
gen $D/crew_enzo_spit.jpg "a gruff bearded dock foreman spitting off the edge of a wooden pier into black water at night, contempt and rejection in his weathered face, older longshoremen closing ranks behind him with arms crossed, decisive dismissal, amber oil-drum firelight against the cold night-blue dark"

# ---- endings (portraits behind the consequence cards) ----
gen $D/crew_ally_end.jpg "portrait shot at a dockside night fire, a gruff bearded foreman standing and offering a scarred weathered hand outward in solidarity, faint respect in his eyes, warm amber firelight, other weathered longshoremen behind him nodding in quiet agreement, cold night-blue dark beyond the ring"
gen $D/crew_manifests_end.jpg "medium close-up at a dockside night fire, a thin teenage loader sliding a small worn tally notebook across a crate with his good hand, his splinted hurt hand held stiffly at his side, quiet resolve and shared purpose on his young face, warm amber firelight glow"
gen $D/crew_spooked_end.jpg "wide shot at a dockside oil-drum fire at night, several weathered longshoremen standing back uneasily from the flames, arms folded, watchful eyes darting between each other, tense unspoken unease, cold night-blue dark pressing at the edges of the amber firelight"
gen $D/crew_tipped_end.jpg "portrait shot at a dockside night fire, a gruff bearded foreman standing silent and unreadable, arms crossed, listening with a flat closed expression, already deciding to talk, ominous quiet, firelight throwing harsh shadows across his weathered face, foreboding cold night-blue dark behind"

echo "=== crew dense panels done ==="; ls $D/crew_*.jpg | wc -l
