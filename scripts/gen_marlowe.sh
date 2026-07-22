#!/usr/bin/env bash
# DENSE per-beat panels for the MARLOWE ENDGAME — the final climax of the whole
# game. One distinct, meaningful shot per dialogue beat (manhwa pacing): the long
# approach across the vast dark office, the measured opening exchange, the
# leverage laid onto the desk, the first crack in Marlowe's stillness, and each
# distinct ending. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_marlowe.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_marlowe.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_marlowe.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0_serene: the long approach, then the calm opening threat ----
gen $D/marlowe_approach.jpg     "extremely wide establishing shot down the length of a vast opulent dark office at night, a young man's small dark silhouette framed in a distant doorway just entering, endless polished floor stretching toward a massive black desk at the far end where an old silver-haired crime lord sits utterly still beneath a single green banker's lamp, floor-to-ceiling gothic windows behind him streaked with rain and lit by faint lightning, deep cavernous shadow swallowing the walls, cold steel-grey palette, the scale of the room dwarfing the approaching figure, oppressive silence"
gen $D/marlowe_calmthreat.jpg   "medium shot of an old cold crime lord with silver hair and ice-pale eyes seated at a vast dark desk, dark tailored suit, one hand resting motionless on a closed fountain pen, speaking with utter calm and quiet menace, the faintest cruel amusement at the corner of his mouth, green banker's lamp casting sharp upward light across his composed face, rain streaking tall windows behind him, absolute stillness, controlled power"

# ---- s0_cracks: he senses it before a word is said ----
gen $D/marlowe_penstops.jpg     "extreme close-up on an old silver-haired crime lord's hand frozen mid-stroke, a fountain pen's nib stopped dead on an open ledger page, the ink not yet dry, his knuckles gone still and tense, soft focus behind on the edge of his impassive profile with one eye narrowed almost imperceptibly, listening, green lamp light pooling on the page, tall rain-streaked windows reflected faintly in the dark wood, held-breath tension"
gen $D/marlowe_scent.jpg        "low angle medium close-up of an old cold crime lord tilting his head slightly, nostrils faintly flared, ice-pale eyes narrowing in suspicion as he speaks, silver hair catching the green lamplight, dark tailored suit, a house gone unnervingly quiet behind him reflected in the black window glass, rain streaking down outside, coiled alertness beneath total composure"

# ---- s0_forewarned: he already knew you were coming ----
gen $D/marlowe_spiderwait.jpg   "wide low-angle shot of an old crime lord sitting perfectly motionless behind a vast dark desk in a near-black office, hands folded with unnatural stillness, only a single green banker's lamp illuminating him like an island of light in the darkness, tall gothic windows behind streaked with heavy rain and distant lightning, the coiled patience of a spider at the center of its web, everything already arranged, cold oppressive calm"
gen $D/marlowe_forewarned.jpg   "close-up of an old silver-haired crime lord's face as a thin chilling smile forms, ice-pale eyes flat and amused, dark tailored suit collar sharp in the green lamplight, speaking with soft lethal confidence, rain-streaked gothic windows blurred dark behind him, the calm of a man who already knows how the night ends"

# ---- move: he mocks you, demands you show what you have ----
gen $D/marlowe_mock.jpg         "medium shot of an old crime lord leaning back in his tall leather chair behind a vast dark desk, one hand gesturing outward in dismissive contempt, a thin sneer curling his mouth, silver hair and ice eyes lit hard from the green banker's lamp below, dark tailored suit, tall rain-streaked windows behind him, mocking condescension radiating from total stillness elsewhere in his body"

# ---- c_take: you have enough — the first crack, the leverage, his concession, your reflection ----
gen $D/marlowe_pendown.jpg      "extreme close-up, an old crime lord's hand slowly setting a fountain pen down flat onto the open ledger with deliberate finality, cut to his ice-pale eyes where for the first time something shifts behind the calm, not fear but the faint tightening of a man realizing he is no longer in control, a muscle barely moving at his jaw, green lamp light harsh across his silver-haired temple, rain-streaked dark windows behind, the exact instant the mask cracks"
gen $D/marlowe_leverage.jpg     "dramatic over-the-shoulder shot from behind a young man's dark-coated shoulder, his hand fanning a spread of exposed ledger pages, photographs, and signed documents across the vast dark desk under the green lamp light, each page landing deliberately in front of the old crime lord whose ice-pale eyes flick down over the evidence of his own empire turned against him, tall rain-streaked windows behind him, the weight of years condensed onto polished dark wood"
gen $D/marlowe_concede.jpg      "slow measured medium close-up of an old silver-haired crime lord sitting very still, his ice-pale eyes steady and unblinking as he accepts defeat without flinching, dignity intact even in concession, hands folded calmly now instead of gripping the desk, green banker's lamp casting soft even light across his composed but hollowed expression, rain streaking the tall dark windows behind him, quiet controlled surrender"
gen $D/marlowe_sevenyears.jpg   "low angle close-up of a young man standing over the vast dark desk in the green lamplight, jaw tight, eyes glistening as years of held-back grief finally break through a controlled expression, one hand braced on the desk's edge, the old crime lord blurred and small in the background behind him, rain-streaked gothic windows glowing faintly, a long-carried weight finally settling into place"

# ---- c_slip: one lever wasn't enough — his composure returns ----
gen $D/marlowe_recoversmile.jpg "close-up of an old crime lord after a long cold pause, the faintest thin smile returning to the corner of his mouth, ice-pale eyes cool and unbothered once more, silver hair sharp in the green lamplight, dark tailored suit, rain-streaked windows behind him, the calm of a man who has already decided this was never a real threat"
gen $D/marlowe_presshurt.jpg    "medium shot of a young man standing firm across the vast dark desk, jaw set, insisting through the tension with quiet conviction, the old crime lord's composed profile visible in the near foreground slightly out of focus, green lamp light dividing the space between them, tall rain-streaked windows behind, a losing hand played with nerve alone"
gen $D/marlowe_dismiss.jpg      "wide shot of an old crime lord settled fully back into his tall leather chair behind the vast dark desk, one hand already returning to the fountain pen, cool dismissive satisfaction on his silver-haired face, the young man's silhouette small and diminished in the foreground shadow, tall gothic windows streaming with rain behind the crime lord, absolute composure fully restored, the room reasserting his total control"

# ---- endings (portraits behind the consequence cards) ----
gen $D/marlowe_end_empire.jpg   "cinematic portrait, a young man now seated in the old crime lord's vast tall leather chair behind the dark desk, one hand resting on the fountain pen, green banker's lamp lighting his face from below with the same cold light that once lit his enemy, an unreadable closed-off expression settling in, tall rain-streaked gothic windows behind him, the throne changed hands, quiet chilling inheritance of power"
gen $D/marlowe_end_burn.jpg     "cinematic portrait, an old silver-haired crime lord standing small and exposed under harsh white overhead light in a courtroom hallway, tailored suit rumpled, ice-pale eyes fixed ahead with nowhere left to hide, stacks of ledger pages and photographs visible on a table before him, the cold green privacy of his office gone entirely, a king reduced to an ordinary defendant, stark unforgiving light"
gen $D/marlowe_end_escape.jpg   "cinematic portrait, an old crime lord standing at his tall rain-streaked window at night, one hand pressed flat against the cold glass, ice-pale eyes wary and alert for the first time, silver hair catching faint green lamplight behind him, freshly installed heavy bolts and extra locks glinting faintly on a side door in the shadow, a wary man now watching his own house instead of ruling it in peace"
gen $D/marlowe_end_crushed.jpg  "cinematic portrait, an old crime lord sitting perfectly calm behind his vast dark desk, one finger resting lightly on a small silver bell, the faintest satisfied smile on his silver-haired face, ice-pale eyes utterly untroubled, green banker's lamp light steady and unwavering, tall rain-streaked gothic windows behind him, the quiet absolute calm of a man who was always going to win"

# ---- THE ROLL CALL — near the climax, before you lay leverage on the table:
# who died, who sold you out, who stayed anyway (reads the campaign ledger) ----
gen $D/marlowe_legacy_lost.jpg      "moody atmospheric close-up on a young man's haunted downcast face lit only by a sliver of green banker's-lamp light bleeding in from an unseen desk, faint ghostly double-exposure impressions of several ordinary working-class faces overlapping faintly across the darkness behind him like a fading photograph, rain-streaked window reflections, cold grief held perfectly still, noir chiaroscuro"
gen $D/marlowe_legacy_betrayed.jpg  "close-up on a young man's face, jaw tight, eyes narrowed with cold hurt rather than surprise, a faint ghostly double-exposure silhouette of a figure turning away and dissolving into shadow at the edge of frame, green lamp light against dark negative space, the exact look of expecting to be sold out and still feeling it land, noir chiaroscuro"
gen $D/marlowe_legacy_stood.jpg     "close-up on a young man's face, something rare and unguarded softening his usual hard composure, faint warm ghostly impressions of a few ordinary faces standing steady in the darkness behind him like a photograph that hasn't faded, a single warm amber light cutting through the cold green of the room, bittersweet resolve, noir chiaroscuro"

# ---- take_reckon / burn_reckon — the two poles, now earned, colored by who's left ----
gen $D/marlowe_take_hollow.jpg      "close-up of a young man's face in the instant after claiming an empire, eyes flat and already calculating exits and weaknesses instead of triumphant, green banker's-lamp light lighting him exactly the way it always lit the old crime lord across this same desk, a chilling stillness settling in where relief should be, tall rain-streaked gothic windows behind him, the throne's light already changing his face"
gen $D/marlowe_burn_worth.jpg       "close-up of a young man's face as he turns away from a vast dark desk stacked with the evidence that could have made him king, jaw set, eyes wet but clear, something like peace breaking through exhaustion, warm pale light from a window at dawn replacing the cold green lamp glow, walking toward it instead of the throne, quiet costly resolve"

echo "=== marlowe endgame dense panels done ==="; ls $D/marlowe_*.jpg | wc -l
