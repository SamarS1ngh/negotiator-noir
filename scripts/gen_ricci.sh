#!/usr/bin/env bash
# DENSE per-beat panels for the RICCI CONFRONTATION — the climax sit-down. A
# distinct, meaningful shot for each dialogue beat (manhwa pacing), generated with
# detailed cinematic prompts (camera, expression, gesture, lighting, environment).
# Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric smoke haze, atmospheric depth of field, proud gold and deep blood-red color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_ricci.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_ricci.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_ricci.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- reactive openings: s0_cold (tense) ----
gen $D/ricci_enthrone.jpg "wide low-angle establishing shot of a proud silver-templed veteran debt collector in an impeccable dark three-piece suit with gold rings and a gold tie clip, seated like a king at a small round table in a smoky dim back room, a single low-hanging bare bulb lamp glowing gold above him, thick cigarette haze curling through the light, deep blood-red velvet drapes and cracked plaster walls receding into black shadow, a young dark-coated man's silhouette just entering the doorway in the far background, commanding territorial atmosphere, he owns this room"
gen $D/ricci_cold_sit.jpg "medium shot, a composed silver-templed debt collector in a sharp dark suit leaning back in his chair with lazy authority, a cigarette held between two fingers, gesturing at an empty chair across the small table with cool amusement, gold lamplight raking across his hard jaw and faint sneer, deep red shadow at the table's edge, smoke curling upward, an unhurried predator granting an audience"

# ---- s0_rattled (tense) ----
gen $D/ricci_rattled_jaw.jpg "tight close-up of a silver-templed debt collector's face in profile, jaw clenched tight, eyes cutting sideways toward an unseen door, a flicker of real unease breaking through his composed veneer, gold lamplight harsh across one side of his face and deep blood-red shadow swallowing the other, cigarette smoke drifting past his eyes, a proud man rattled and hiding it"
gen $D/ricci_rattled_sit.jpg "wide shot of a small round table in a dim smoky back room, a sharp-suited silver-templed debt collector seated stiffly, gesturing curtly with an open palm toward an empty chair across from him, a distant doorway behind showing a young man's dark coat just visible entering, a low gold lamp glowing between the table and the door, deep soft red dark filling the rest of the room, quiet coiled tension"  # reworded — original tripped NSFW filter

# ---- s0_forewarned (fear) ----
gen $D/ricci_forewarned_watch.jpg "medium close-up of a silver-templed debt collector sitting unnaturally still at his table, eyes flicking coldly toward the room's exits and shadowed corners, calculating and guarded, a half-smoked cigarette forgotten between his fingers, gold lamp light pooling on the table below a face gone hard with suspicion, deep blood-red darkness pressing in at the frame's edges, a predator suddenly aware he might be prey"
gen $D/ricci_forewarned_threat.jpg "low-angle close-up, a silver-templed debt collector leaning far across the small table into the light, eyes narrowed with cold menace, one finger pointing forward like a blade, gold lamplight carving deep harsh shadows into his face from below, blood-red gloom behind him, smoke curling around his raised hand, a naked unmistakable threat delivered quietly"

# ---- s0_hardened (threat) ----
gen $D/ricci_hardened_hate.jpg "extreme close-up of a silver-templed debt collector's face, eyes utterly cold with pre-formed hatred, a cigarette clenched hard between his teeth, jaw like stone, not a flicker of doubt in his expression, harsh gold lamplight from directly above carving deep shadows under his brow and cheekbones, blood-red darkness swallowing the frame's edges, a man who has already decided the outcome"
gen $D/ricci_hardened_ultimatum.jpg "medium shot, a silver-templed debt collector sitting rigid and upright at the table, one hand gesturing flat and final toward the door as if signaling unseen men waiting there, cold contempt fixed on his face, gold lamp light stark on his tailored dark suit and gold rings, deep blood-red shadow filling the back of the room, an ultimatum delivered like a verdict"

# ---- open: the table (tense) ----
gen $D/ricci_open_table.jpg "wide symmetrical establishing shot of a small round table in a smoky dim back room, a single low-hanging bare bulb lamp burning gold directly between two seated figures, on one side a proud silver-templed debt collector in a dark three-piece suit resting one hand on a folded debt paper with cool ownership, on the other side a lean young man in a dark coat sitting coiled and controlled, thick cigarette haze drifting through the gold light, deep blood-red velvet gloom framing the whole scene, the whole duel about to begin, perfect tense symmetry"

# ---- c_ego (warm) ----
gen $D/ricci_ego_smile.jpg "medium close-up of a silver-templed debt collector's face breaking into a thin, pleased smile, leaning back in his chair with loosened, flattered composure, one eyebrow raised in amusement, warm gold lamplight now softened and glowing kindly across his features, faint blood-red haze in the background, a proud man's guard dropping a careful notch"

# ---- c_small (tense) ----
gen $D/ricci_small_amused.jpg "medium portrait of a silver-templed debt collector seated at a table, head tilted back slightly, a dry amused expression, one eyebrow raised, gold lamplight glinting on a ring resting on the table, soft red-tinted dark filling the background, quiet unbothered superiority"  # reworded — original tripped NSFW filter

# ---- c_fear (fear) ----
gen $D/ricci_fear_flicker.jpg "extreme close-up on a silver-templed debt collector's eyes, a fast involuntary flicker of real fear crossing them before his face hardens back into composure, a single bead of sweat catching the gold lamplight at his temple, deep blood-red shadow crowding the edges of the frame, the mask slipping for one instant"
gen $D/ricci_fear_named.jpg "over-the-shoulder two-shot from behind a silver-templed debt collector's tense shoulder in the near foreground, looking across the small table at a lean young man in a dark coat leaning forward with quiet unshakeable calm, naming an unspoken truth, the gold lamp glowing low between them, blood-red gloom pressing at the walls, a fear spoken aloud for the first time"

# ---- c_skim: the leverage reveal and the break (threat) ----
gen $D/ricci_skim_alarm.jpg "extreme close-up, a silver-templed debt collector's composed smile shattering into raw alarm, eyes blown wide, half-risen from his chair with one hand slamming flat on the table, gold lamplight harsh and sudden across his stricken face, deep blood-red shadow lurching behind him, the exact instant his secret is named"
gen $D/ricci_skim_leverage.jpg "medium close-up of a lean young man in a dark coat leaning calmly into the gold lamplight, unhurried and controlled, one hand resting on a folded proof document on the table between him and an unseen collector, a faint knowing edge to his expression, deep blood-red gloom framing him, quiet total command of the moment"
gen $D/ricci_skim_still.jpg "medium close-up of a silver-templed debt collector gone eerily still, hands flat on the table, face schooled back into a guarded mask over real dread, eyes locked forward and calculating, gold lamplight steady and cold on his features, blood-red darkness pooling at the table's edge, a proud man recalculating everything"
gen $D/ricci_skim_ambition.jpg "tight close-up, a lean young man's face lit gold from below, eyes hard and hungry with naked ambition, leaning forward intently, one hand rising slightly as if measuring a great height, controlled fire behind a calm expression, deep blood-red haze behind him, the want laid bare"
gen $D/ricci_skim_mirror.jpg "intimate medium two-shot across the small table, a silver-templed debt collector's face gone strangely thoughtful and weary, studying the young man across from him with something like recognition, the low gold lamp hanging exactly between their two faces like a mirror's hinge, one older and one younger version of the same hunger, deep blood-red gloom framing both, a quiet devastating moment of self-recognition"
gen $D/ricci_skim_doubt.jpg "close-up of a lean young man's face, controlled composure cracking for just a moment into private unease, eyes flickering downward, a flash of doubt he doesn't want seen, gold lamplight warm on one side of his face and blood-red shadow pressing the other, the cost of the room's mirror finally landing on him"

# ---- c_rival: Bianchi pressure (fear) ----
gen $D/ricci_rival_fear.jpg "tight close-up of a silver-templed debt collector's face, jaw tightening and a flash of real fear breaking through practiced control at the mention of a rival's name, eyes darting once before locking hard forward, gold lamplight harsh on his taut features, deep blood-red shadow behind him, controlled dread"
gen $D/ricci_rival_trap.jpg "medium shot of a lean young man in a dark coat leaning in with cold clinical calm, laying out a trap point by point, one hand gesturing slowly as if closing an invisible door, gold lamp light steady on his composed face, deep blood-red gloom pressing at the room's edges, the walls closing in on someone offscreen"
gen $D/ricci_rival_consider.jpg "medium close-up of a silver-templed debt collector sitting very still, eyes narrowed in careful calculation, a muscle working faintly in his jaw as he weighs an offer he despises needing, gold lamplight cold and unmoving on his face, blood-red darkness framing him, pride wrestling with survival"
gen $D/ricci_rival_ultimatum.jpg "close-up, a lean young man's face intense and direct, leaning fully into the gold lamplight with unblinking eye contact, one hand pressed flat on the table sealing an ultimatum, controlled and immovable, deep blood-red shadow behind him, the terms now final"

# ---- c_debt_soft: the concession (cold) ----
gen $D/ricci_debt_shrug.jpg "medium shot of a silver-templed debt collector giving a slow, tired shrug, one hand reaching for a folded debt paper on the table with resigned finality, his face a controlled mask giving up exactly one thing and nothing more, gold lamplight steady above, deep blood-red gloom filling the back of the room, a small grudging concession"

# ---- endings: portraits behind the consequence cards ----
gen $D/ricci_ally_end.jpg "medium close-up of a silver-templed debt collector watching a folded paper burn down in a small brass ashtray, tired defeated eyes reflecting the small flame, his composure intact but hollowed out, having chosen to keep his dignity by becoming someone else's man, warm gold firelight flickering up on his face, deep blood-red shadow surrounding him, quiet grave resignation"
gen $D/ricci_broken_end.jpg "low-angle close-up of a silver-templed debt collector kneeling on the floor, head bowed low in forced humiliation, but his eyes lifted and burning with hatred and the promise of vengeance, blurred indistinct figures of his own crew standing in the background shadow, harsh gold lamplight from above, deep blood-red darkness pooling around him, broken but not finished"
gen $D/ricci_noname_end.jpg "medium close-up of a silver-templed debt collector tearing a folded debt paper cleanly in half with steady composed hands, his face guarded and unreadable, giving up exactly what was asked and nothing more, gold lamplight even and cold on his features, deep blood-red gloom behind him, a closed door made final"
gen $D/ricci_walk_end.jpg "medium shot of a silver-templed debt collector rising to his full height, straightening his dark suit jacket with slow deliberate pride, a satisfied cool half-smile, one hand waving lazily toward the exit as though dismissing a servant, gold lamplight catching the rings on his fingers, soft red-tinted dark looming behind him, a man who came out on top and intends to remember every detail"  # reworded — original tripped NSFW filter

echo "=== ricci dense panels done ==="; ls $D/ricci_*.jpg | wc -l
