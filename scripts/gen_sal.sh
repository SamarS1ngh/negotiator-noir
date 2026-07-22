#!/usr/bin/env bash
# DENSE per-beat panels for the Sal mission — a distinct, meaningful shot for each
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- s0: the approach (tense) ----
gen $D/sal_watch.jpg   "wide establishing long shot from a dark rainy dock at night looking across wet black cobblestones toward a single lit office window, a small balding bookkeeper visible through the glass hunched over open ledgers under a green banker's lamp, coiled mooring ropes and an iron bollard silhouetted in the foreground shadow, cold teal rainy darkness against the warm sickly-green glow of the window, lonely surveillance atmosphere, drifting mist"
gen $D/sal_desk.jpg    "medium shot, a nervous balding middle-aged bookkeeper alone at a cluttered wooden desk in a cramped dockside office at night, towers of leather ledgers and loose invoices around him, a half-open desk drawer revealing the edge of a hidden second black ledger, a green banker's lamp throwing sickly light up his deeply lined tired face, thin cigarette smoke curling, worn and wary, rain streaking a small barred window behind him"
gen $D/sal_closed.jpg  "a balding bookkeeper startled at his desk, both hands slapping a ledger shut, his wooden chair scraping backward, upper body twisting toward the office door with a guarded hostile glare over his shoulder, scattered papers lifting into the air, sickly green lamp light and hard shadows, sudden alarm, cramped dim dockside office at night"
gen $D/sal_doorway.jpg "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame in a doorway, looking into a small green-lit office where a tense balding bookkeeper sits frozen at his desk staring back warily, strong cold backlight rimming the silhouette, deep contrast, the stillness before a threat"
gen $D/sal_wary.jpg    "extreme close-up of a balding bookkeeper's weathered face, eyes narrowed in wary suspicious calculation, deep worry lines carved by the light, a bead of sweat at his temple, sickly green banker's-lamp light raking up from below to throw hard shadows into his eye sockets, dim office at night, taut suspicion"

# ---- n1: the guilt bomb (guilt) ----
gen $D/sal_drain.jpg   "intense extreme close-up of a balding bookkeeper's face as the blood drains from it, eyes blown wide with dawning horror and recognition, mouth falling open, a trembling hand lifting toward his lips, cold green lamp light, a sheen of shock on his skin, the exact instant a buried memory surfaces, dim office at night"
gen $D/sal_accuse.jpg  "tense low-angle two-shot, a young man's shadowed determined face and shoulder in the near foreground leaning in to accuse, across the desk a guilt-stricken balding bookkeeper shrinking back into the green lamp shadow, the lamp glowing between them, a charged silent reckoning, noir contrast, dim office at night"
gen $D/sal_confess.jpg "a balding bookkeeper collapsing forward over his desk, one hand pressed hard over his eyes, the other gripping the desk edge, shoulders caved inward, crushed under years of guilt and memory, a single green banker's lamp overhead, long heavy shadows, quiet private devastation, dim dockside office at night"

# ---- n2: guilt twisted into debt (cold) ----
gen $D/sal_stung.jpg   "a balding bookkeeper leaning back from the desk, the soft guilt on his face hardening into bitter hurt and mistrust, jaw set, eyes cold and wet, his emotional walls slamming back up, sickly green lamp light, a sharp shadow across half his face, a wounded closing-off, dim office at night"

# ---- d1: resignation (cold) ----
gen $D/sal_sink.jpg    "a defeated balding bookkeeper sinking slowly back down into his creaking wooden chair, all the fight draining out of his posture, gaze fallen to the ledgers on the desk, resignation and exhaustion, green lamp light pooling on the papers, deep shadows around him, dim dockside office at night"
gen $D/sal_bitter.jpg  "close-up of a balding bookkeeper giving a short hollow bitter laugh, head tipped slightly back, eyes empty and glassy with old fear, mouth twisted between a smile and despair, sickly green lamp light, cigarette haze drifting past, gallows resignation, dim office at night"

# ---- d_hope: the flicker of trust (hope) ----
gen $D/sal_doubt.jpg   "medium close-up of a balding bookkeeper studying the viewer with a long skeptical searching look, one eyebrow raised, guarded hope warring with disbelief on his tired face, mixed warm and cool lamp light, faint rain on the window behind, a man deciding whether to trust, dim office at night"
gen $D/sal_smile.jpg   "a weary balding bookkeeper as the fear finally eases from his face into the faint fragile ghost of a hopeful smile, eyes softening and glistening, warm amber lamp light replacing the cold green, a small flicker of restored trust and relief, quiet and intimate, dim office at night"

# ---- d_fear: worse fear (fear) ----
gen $D/sal_fear2.jpg   "extreme close-up of a balding bookkeeper going pale and rigid with dread, eyes wide and fixed on a private nightmare, throat tight, cold sweat on his brow, deep blue-green shadows swallowing the edges of the frame, gripped by terror, dim office at night"

# ---- p1: he threatens to shout (threat) ----
gen $D/sal_scream.jpg  "a panicked balding bookkeeper half-risen from his chair, one hand thrown up and outward, mouth opening to shout for help, eyes wild and desperate, loose papers scattering off the desk, the green banker's lamp swinging on its cord, chaotic alarm, cramped dim office at night"
gen $D/sal_callbluff.jpg "a calm composed young man in shadow leaning back slightly with a cold quiet stare, calling the bluff, across from him a panicking balding bookkeeper faltering as his confidence bleeds away, the green lamp glowing between them, a tense noir standoff, dim office at night"
gen $D/sal_choke.jpg   "close-up of a balding bookkeeper with the shout dying in his throat, mouth half-open then clamping shut, the fight collapsing into fear and quick calculation, swallowing hard, sickly green lamp light, a hard shadow across his jaw, defeated silence, dim office at night"

# ---- c1: the money (tense) ----
gen $D/sal_cashdrop.jpg "tight overhead close-up of a fat roll of paper money bound with a rubber band being set down onto a closed leather ledger on a worn wooden desk, a hand just withdrawing from it, green banker's-lamp light glinting off the desk grain, the money sitting between two men like an accusation, dim office at night"
gen $D/sal_cashstare.jpg "a balding bookkeeper staring down at a roll of money resting on his ledger without touching it, an expression of tired offended contempt mixed with reluctant temptation, jaw tight, green lamp light on his lined face, moral weariness, dim dockside office at night"
gen $D/sal_drown.jpg   "close-up of a balding bookkeeper giving a tired knowing laugh, eyes heavy with exhaustion and old sorrow, shaking his head slightly, a man far past what money can fix, sickly green lamp light, cigarette smoke, weary defiance, dim office at night"

# ---- endings (portraits behind the consequence cards) ----
gen $D/sal_mole.jpg    "an emotional balding bookkeeper sliding an old worn leather account book across the desk with both trembling hands, looking up with wet grateful eyes and the faint start of a smile, warm amber desk lamp replacing the cold green, a quiet moment of redemption and shared purpose, dim office at night"
gen $D/sal_scared_end.jpg "a grey sweating balding bookkeeper standing frozen behind his desk after a deal, eyes locked fearfully on the office door, wringing his hands, a man who gave up the goods but never lost his terror, sickly green lamp light, deep shadows, dim office at night"
gen $D/sal_bought_end.jpg "a balding bookkeeper counting a roll of money a second time with cold transactional eyes, the ledger already handed over on the desk, nothing behind his stare, a man who sells once and will sell again, green lamp light, dim office at night"
gen $D/sal_burned.jpg  "a balding bookkeeper standing stiff and ashen in a dark office, turning his face away and avoiding eye contact, jaw clenched, cold dread and the intent to run written on him, harsh shadows, a green lamp, an ominous quiet, dim office at night"
echo "=== sal dense panels done ==="; ls $D/sal_*.jpg | wc -l