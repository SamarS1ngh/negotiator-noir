#!/usr/bin/env bash
# DENSE per-beat panels for the Teller (Wyatt Arlen / Cassar Bank) mission — a
# distinct, meaningful shot for each dialogue beat (manhwa pacing), plus the base
# establishing scene and the board cast portrait. Cloudflare FLUX-schnell. Creds in
# ~/.cf_ai (never committed). Modeled exactly on scripts/gen_sal.sh / gen_vera.sh.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_teller.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_teller.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_teller.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/teller.jpg           "wide establishing shot inside a grand marble bank hall after closing hours, towering cold marble columns and a barred teller's counter stretching into shadow, one small desk lamp glowing sickly green far in the back row where a young clerk still works over open ledgers, brass fixtures and a heavy vault door dimly visible down a side corridor, cold moonlight seeping through tall arched windows onto polished stone floor, hushed after-hours atmosphere, film-noir lighting, muted teal-green palette"

# ---- t0: the approach (tense) ----
gen $D/teller_watch.jpg     "wide establishing long shot from across a dark marble bank lobby at night looking toward a single lit teller's desk in the back row, a young clerk in shirtsleeves hunched over open ledgers under a sickly green banker's lamp, towering marble columns and barred windows in cold shadow around him, brass rail dividing the public floor from the desks, a distant hallway leading to a heavy vault door, lonely surveillance atmosphere, drifting dust in a shaft of moonlight"
gen $D/teller_rows.jpg      "wide shot of a bank back office at night, rows of leather ledgers and steel filing drawers stacked behind a young clerk's desk, dummy company names stenciled on drawer labels, a green banker's lamp the only light source, cold marble walls and a distant barred vault corridor, meticulous unsettling order, film-noir atmosphere"
gen $D/teller_startle.jpg   "a young bank clerk in shirtsleeves and a loosened tie startled at his desk late at night, a pencil clattering off open ledgers, wide alarmed eyes turning toward an unseen intruder, chair scraping back, sickly green lamp light throwing hard shadows, cold marble bank interior at night, sudden tension"
gen $D/teller_approach.jpg  "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame, walking across a vast shadowed marble bank lobby at night toward a small lit desk where a young clerk sits frozen, cold moonlight through tall arched windows, strong backlight rimming the silhouette, deep contrast, the stillness before a first word"
gen $D/teller_wary.jpg      "close-up of a young bank clerk's face, boyish features drawn tight with wariness, throat working as he swallows, eyes fixed and unmoving on the stranger, sickly green banker's-lamp light raking up from below, cold marble bank interior at night, taut suspicion held in check"

# ---- r_small: the true read confirmed (tense) ----
gen $D/teller_ledger.jpg    "tight overhead close-up of an open bank ledger page, a column of figures retotaled three times in cramped pencil in the margin, the paper torn slightly where the pencil pressed too hard, a young clerk's trembling hand still resting near it, sickly green lamp light pooling on the page, cold marble desk at night"

# ---- r_forsale: the wrong read — money (cold) ----
gen $D/teller_flinch.jpg    "close-up detail shot, a young bank clerk's hand pulling sharply back from a half-open cash drawer as if burned, dread rather than temptation on his half-visible face, sickly green lamp light, cold marble bank office at night, a quiet visual contradiction"

# ---- r_threat: the wrong read — fear (fear) ----
gen $D/teller_phoneglance.jpg "medium close-up, a young bank clerk's eyes cutting sideways toward a black rotary telephone mounted on a marble pillar near a heavy vault door, tension gathering in his jaw, sickly green lamp light on one side of his face, cold shadow on the other, bank interior at night, a man deciding whether he's brave enough to shout"

# ---- a_disarm / a_overreach: the small ask, and pushing too far (tense/fear) ----
gen $D/teller_disarm.jpg    "medium two-shot, a young man in shadow leaning in gently across a bank desk with an open, unthreatening posture, speaking quietly to a wary young clerk lit by a green banker's lamp, cold marble columns receding into darkness behind them, an intimate low-stakes exchange, bank interior at night"
gen $D/teller_hesitate.jpg  "close-up of a young bank clerk staring down at a half-open desk drawer, not at the viewer, jaw tight with internal conflict, one hand hovering uncertainly over an open ledger, sickly green lamp light, cold marble bank office at night, the instant before a small confession"
gen $D/teller_overreach.jpg "a young bank clerk recoiling hard in his chair, chair legs screeching against marble floor, both hands raised defensively, eyes wide with sudden panic, papers sliding off the desk, sickly green lamp light swinging, cold marble bank interior at night, a request that went too far too fast"

# ---- THE COMPLICATION: the night guard's rounds (tense/threat) ----
gen $D/teller_guard.jpg     "wide shot down a shadowed marble bank corridor at night, a ring of keys and the slow unhurried footsteps of a night watchman approaching from the darkness beyond a row of columns, a young clerk and a shadowed visitor both frozen mid-motion at a lit desk in the foreground, sickly green lamp light, cold suspense, film-noir atmosphere"
gen $D/teller_freeze.jpg    "medium shot, a young bank clerk and a shadowed figure standing utterly still behind a desk, eyes both fixed past the frame toward an unseen corridor, held-breath tension, sickly green lamp light frozen on their faces, cold marble bank interior at night, footsteps implied just out of frame"
gen $D/teller_cover.jpg     "medium shot, a young man in shadow leaning back with practiced ease, calling out casually toward an unseen hallway, a young bank clerk beside him rigid with barely-hidden panic, sickly green lamp light, cold marble columns in the background, a bluff played straight-faced, bank interior at night"
gen $D/teller_rush.jpg      "medium shot, a young man striding quickly past a startled bank clerk toward a shadowed marble corridor, glancing sharply into the dark for whoever is approaching, cold moonlight from a tall arched window, sickly green lamp glow receding behind him, tense investigative motion, bank interior at night"
gen $D/teller_crossed.jpg   "close-up of a young bank clerk exhaling shakily, shoulders sagging with relief and dread both at once, staring at his own hands on the desk like they belong to someone else now, sickly green lamp light, cold marble bank office at night, the quiet moment after crossing a line"
gen $D/teller_stung.jpg     "close-up of a young bank clerk's face hardening from relief into flat, stung resentment, jaw setting, eyes cold and hurt, the earlier gratitude visibly curdling, sickly green lamp light casting a harder edge, cold marble bank office at night"

# ---- a_info / a_info_exploit: information asymmetry (cold/fear) ----
gen $D/teller_info.jpg      "medium shot, a young man in shadow speaking quietly and precisely across a bank desk, naming account details with visible confidence, a young clerk's eyes widening in alarm across from him, sickly green lamp light between them, cold marble columns in the background, the moment a hidden secret is proven not so hidden"
gen $D/teller_spooked.jpg   "close-up of a young bank clerk gone pale, eyes wide with dawning dread, mouth slightly open, realizing a stranger already knows more than he ever admitted to anyone, sickly green lamp light, cold marble bank office at night, quiet unraveling fear"

# ---- a_press / p2: he threatens to call, then breaks (threat/fear) ----
gen $D/teller_press.jpg     "medium two-shot, a young man in shadow leaning in hard over a bank desk with an accusing posture, a young clerk shrinking back in his chair, sickly green lamp light throwing sharp shadows between them, cold marble columns receding into darkness, a cornering confrontation, bank interior at night"
gen $D/teller_dial.jpg      "close-up of a young bank clerk's trembling hand darting toward a black rotary telephone on the desk, eyes wide with panic, sickly green lamp light glinting off the receiver, cold marble bank office at night, the instant before a desperate call"
gen $D/teller_callbluff.jpg "medium shot, a calm young man in shadow leaning back with a cold quiet stare across a bank desk, unmoved, a young clerk's hand frozen just short of a telephone receiver, sickly green lamp light between them, cold marble bank interior at night, a bluff called flat"
gen $D/teller_choke.jpg     "close-up of a young bank clerk's hand stalled inches above a telephone receiver, fingers trembling, the fight visibly draining out of his face into fear and quick calculation, sickly green lamp light, cold marble bank office at night, defeated hesitation"
gen $D/teller_handoff.jpg   "tight overhead close-up of a young bank clerk's shaking hand sliding a small scrap of paper with scrawled numbers across a marble desk, sickly green lamp light catching the pencil marks, cold shadow beyond the desk, bank interior at night, a reluctant surrender"

# ---- a_bribe: money misreads a scared man (tense) ----
gen $D/teller_cashdrop.jpg  "tight overhead close-up of a fold of paper money being set down onto a closed bank ledger on a marble desk, a hand just withdrawing from it, sickly green lamp light glinting off polished stone, the money sitting between two people like an accusation, bank interior at night"
gen $D/teller_cashstare.jpg "close-up of a young bank clerk staring down at a fold of money on his desk without touching it, an expression of offended pride mixed with reluctant temptation, jaw tight, sickly green lamp light on his young face, cold marble bank office at night, moral weariness"

# ---- endings (portraits behind the consequence cards) ----
gen $D/teller_turned_end.jpg "medium shot, a young bank clerk letting out a long-held breath, shoulders finally easing, a faint grateful relief on his tired young face, warm amber lamp light now replacing the cold green, cold marble bank office at night, a quiet moment of trust extended"
gen $D/teller_shaky_end.jpg  "a young bank clerk standing rigid behind his desk after a deal, eyes darting toward the dark hallway, hands still trembling as he tidies ledgers that don't need tidying, sickly green lamp light, cold marble bank interior at night, a man who gave up what was asked but never stopped being afraid"
gen $D/teller_bought_end.jpg "close-up of a young bank clerk counting a fold of money once, expression flat and transactional, an account slip already handed over on the desk beside him, sickly green lamp light, cold marble bank office at night, the first time he's done this for cash instead of conscience"
gen $D/teller_burned_end.jpg "wide shot, a young bank clerk already reaching for a black telephone receiver the instant a shadowed visitor turns to leave, panic and self-preservation on his face, sickly green lamp light gone hard and cold, marble columns receding into darkness, bank interior at night, an alarm about to be raised"

echo "=== teller scene panels done ===" ; ls $D/teller*.jpg 2>/dev/null | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/teller.jpg           "noir crime graphic novel head and shoulders portrait of a young bank clerk in his mid-twenties, boyish earnest face, loosened tie and rolled shirtsleeves, faint dark circles under his eyes from too many late nights, an anxious idealistic intensity in his expression, plain dark background, sickly green-tinted lamp light, glossy cel-shaded noir style, sharp detailed eyes, muted teal-green palette, high production value, no text, no watermark"

echo "=== teller cast portrait done ===" ; ls -la $C/teller.jpg
