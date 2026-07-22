#!/usr/bin/env bash
# DENSE per-beat panels for the CASSAR CONFRONTATION (cassar_confront.ts) — the
# Chapter Four / Act II climax sit-down. A distinct, meaningful shot for each
# dialogue beat (manhwa pacing), plus the base establishing scene and the board
# cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
# Modeled exactly on scripts/gen_gallo.sh / scripts/gen_bagman.sh.
#
# NOT YET RUN — CF image quota was exhausted at authoring time. Queue this for a
# later batch run once quota resets: `bash scripts/gen_cassar.sh`. Do NOT run in
# parallel with another gen_*.sh script hitting the same account.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, cold marble and money-green color grade, deep green desk-lamp glow against pale sterile marble, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast

gen() { # gen <out> <detailed-desc>
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':1216,'width':816}))" "$2" "$STYLE")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_cassar.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_cassar.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_cassar.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# recurring description anchors, so Cassar and the room stay consistent across panels
CASSAR="a lean silver-haired private banker in his fifties, rimless spectacles, an immaculately tailored charcoal three-piece suit with no rings or ornament at all, manicured hands folded with surgical precision, a face schooled into permanent cool contempt"
OFFICE="a private bank office behind two vault doors at night, cold pale marble floor and walls, a single green-shaded banker's lamp glowing on an otherwise dark mahogany desk, ledgers stacked with obsessive neatness, an unlisted private telephone line sitting apart from the rest, floor-to-ceiling glass overlooking the financial district, sterile money-green and marble-white light, no warmth anywhere in the room"

# ---- base establishing scene (mission fallback background) ----
gen $D/cassar.jpg              "wide establishing shot, $CASSAR seated behind a mahogany desk in $OFFICE, a young dark-coated man's silhouette just visible entering through the vault-door threshold in the background, cold immaculate power, absolute control of the room"

# ---- s0_serene: he doesn't know why you're here (tense) ----
gen $D/cassar_enter_serene.jpg "wide low-angle shot, $CASSAR unbothered behind his desk in $OFFICE, glancing up mildly at an unexpected visitor's silhouette in the doorway, faint condescending curiosity, not a flicker of concern"
gen $D/cassar_greet_serene.jpg "medium shot, $CASSAR gesturing with one precise hand toward an empty chair across the desk, a bored patient almost-smile, a cup of coffee steaming untouched at his elbow, $OFFICE"

# ---- s0_cracks: word has reached him (cold) ----
gen $D/cassar_enter_cracks.jpg "close shot, $CASSAR's hands folding and refolding the same sheet of paper on the desk, cologne and posture exact as ever but a new tightness at the eyes, $OFFICE"
gen $D/cassar_demand_cracks.jpg "medium shot, $CASSAR leaning forward very slightly, precise and cold, laying one flat hand on the desk as if closing a ledger, a controlled demand for an explanation, $OFFICE"

# ---- s0_forewarned: he's ready for you (threat) ----
gen $D/cassar_enter_forewarned.jpg "wide tense shot, two broad men in plain bank-issue suits standing posted at the office door in $OFFICE, $CASSAR not looking up from a ledger, already composed for a confrontation he expected"
gen $D/cassar_threat_forewarned.jpg "close low-angle shot, $CASSAR's cold eyes lifting at last to meet the viewer directly, a flat unhurried threat delivered without raising his voice, green lamp light hard across his glasses, $OFFICE"

# ---- open: the frame, and the read (tense) ----
gen $D/cassar_open_frame.jpg   "medium shot, $CASSAR spreading two precise hands over the desk, an expectant challenging look, waiting to be given a reason to care, green lamp glow, $OFFICE"
gen $D/cassar_sizeup.jpg       "close shot on a young dark-coated man's face and eyes, calm and assessing, studying $CASSAR across the desk — the checked watch, the too-neat ledger, the tell of a man who has never had his armor tested, $OFFICE"

# ---- the woven read: what actually protects him ----
gen $D/cassar_read_missarmor.jpg "tight close-up on an unlisted black telephone sitting apart from $CASSAR's other desk items, his eyes flicking to it and away, a leash being checked, cold green lamp light, $OFFICE"
gen $D/cassar_read_missgreed.jpg "medium shot, $CASSAR waving one dismissive hand at an assistant's whispered figure just out of frame, utterly unmoved by a number, bored contempt, $OFFICE"
gen $D/cassar_read_hit.jpg     "extreme close-up on $CASSAR's mouth and eyes mid-laugh at his own joke, the laugh landing a half-beat too long and too careful, a rehearsed calm cracking almost imperceptibly, green lamp light, $OFFICE"

# ---- table: he waits, bored ----
gen $D/cassar_table_wait.jpg   "medium close-up, $CASSAR tapping one manicured nail once against the mahogany desk, cool and already bored, waiting for the viewer to speak, green lamp glow, $OFFICE"

# ---- c_ledger: the teller's evidence lands ----
gen $D/cassar_ledger_alarm.jpg "extreme close-up on $CASSAR's manicured hand going utterly still on the desk, precise as a machine that has just found an error in its own calculation, alarm masked as stillness, $OFFICE"
gen $D/cassar_ledger_press.jpg "medium shot, a young dark-coated man leaning forward calmly, unmoved, pressing an advantage with quiet certainty across the desk from a rigid $CASSAR, green lamp light between them, $OFFICE"

# ---- c_audit: the exposure lands ----
gen $D/cassar_audit_alarm.jpg  "close-up, $CASSAR's coffee cup frozen halfway to his lips, eyes gone sharp and calculating, the first real alarm breaking his composure, green lamp light, $OFFICE"
gen $D/cassar_audit_press.jpg  "medium shot, a young dark-coated man describing a future audit with cold specific detail, one hand gesturing lightly, $CASSAR listening rigid across the desk, $OFFICE"

# ---- c_names: Sable's names land ----
gen $D/cassar_names_alarm.jpg  "tight close-up, a fast involuntary flicker of real alarm breaking through $CASSAR's practiced contempt at a woman's name, quickly smoothed back over, green lamp light, $OFFICE"
gen $D/cassar_names_press.jpg  "medium shot, a young dark-coated man reciting names quietly and precisely across the desk, $CASSAR very still, calculating exposure, green lamp light, $OFFICE"

# ---- c_customs: the money trail lands ----
gen $D/cassar_customs_alarm.jpg "close-up, $CASSAR's face gone utterly silent and unreadable, the first real pause since the meeting began, green lamp light throwing hard shadow across his glasses, $OFFICE"
gen $D/cassar_customs_press.jpg "medium shot, a young dark-coated man tracing an invisible line across the desk with one finger, from dock to vault, calm and certain, $CASSAR frozen across from him, $OFFICE"

# ---- crack: the ice finally goes, and the name comes out ----
gen $D/cassar_crack_still.jpg  "medium close-up, $CASSAR gone very still, hands flat on the desk, doing cold arithmetic with his own survival for the first time, green lamp light steady on his schooled face, $OFFICE"
gen $D/cassar_crack_push.jpg   "close two-shot, a young dark-coated man leaning into the green lamplight with quiet unshakeable resolve, naming exactly what he wants, $CASSAR rigid across the desk, $OFFICE"
gen $D/cassar_crack_sweat.jpg  "close-up, $CASSAR's icy composure finally breaking, the faintest sheen at his temple, something almost like relief crossing his face at being allowed to stop performing, green lamp light gone warmer and softer, $OFFICE"
gen $D/cassar_crack_doubt.jpg  "close-up on a young dark-coated man's face, controlled and unreadable, a private flicker of cost crossing his eyes even as he wins, green lamp light warm on one side and cold marble-blue on the other, $OFFICE"

# ---- endings (portraits behind the consequence cards) ----
gen $D/cassar_end_ally.jpg     "medium shot, $CASSAR sitting back in his chair, composed and cold again but visibly diminished, a grudging precise nod, having accepted a new arrangement, green lamp light steady, $OFFICE"
gen $D/cassar_end_broken.jpg   "wide shot, $CASSAR slumped forward over his own desk, glasses askew, ledgers spread open and exposed around him, utterly stripped of composure, harsh green lamp light, $OFFICE"
gen $D/cassar_end_money.jpg    "close-up, $CASSAR sliding a folded wire-transfer confirmation across the desk with two precise fingers, a thin satisfied almost-smile, transaction complete, green lamp light, $OFFICE"
gen $D/cassar_end_walk.jpg     "wide shot, $CASSAR's finger just lifting off a hidden desk button, two broad men in bank-issue suits closing in from the doorway behind a retreating young man's silhouette, cold absolute command restored, green lamp light, $OFFICE"

echo "=== cassar scene panels done ===" ; ls $D/cassar*.jpg 2>/dev/null | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/cassar.jpg              "noir crime graphic novel head and shoulders portrait of $CASSAR, rimless spectacles catching cold light, deep permanent contempt in his expression, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, cold marble and money-green palette, high production value, no text, no watermark"

echo "=== cassar cast portrait done ===" ; ls -la $C/cassar.jpg
