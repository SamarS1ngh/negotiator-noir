#!/usr/bin/env bash
# DENSE per-beat panels for the Prosser "auditor" mission — a distinct,
# meaningful shot for each dialogue beat (manhwa pacing), plus the base
# establishing scene and the board cast portrait. Cloudflare FLUX-schnell.
# Creds in ~/.cf_ai (never committed). Modeled exactly on scripts/gen_sal.sh /
# scripts/gen_bagman.sh. Reuses the 'sal' palette (sickly ledger-lamp green) —
# do NOT edit theme.css.
#
# NOT YET RUN — CF image quota was exhausted at authoring time. Queue this for
# a later batch run once quota resets: `bash scripts/gen_auditor.sh`.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_auditor.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_auditor.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_auditor.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# recurring description anchors, so Prosser and the room stay consistent across panels
PROSSER="a precise middle-aged bank auditor in a conservative dark suit, wire-rim glasses, thinning grey-flecked hair combed back, a pale controlled face built for giving nothing away, ink-stained fingers, a plain wedding band, the bearing of a man who has spent a career being careful"
ROOM="a windowless audit room deep inside Cassar Bank at night, towering stacks of ledgers and file boxes lining every wall, a single green-shaded banker's lamp pooling light over a desk covered in cross-referenced account printouts and highlighted discrepancy sheets, a heavy vault-adjacent door, cold marble floor underfoot, the bank's ordinary hours long over, sickly muted teal-green gloom fading to black at the edges"

# ---- base establishing scene (mission fallback background) ----
gen $D/auditor.jpg           "wide establishing shot inside a windowless audit room at night, $PROSSER hunched alone at a desk buried in cross-referenced ledgers under a single green banker's lamp, towering stacks of file boxes framing him in the dark, an airless, watched atmosphere, $ROOM"

# ---- s0: the approach (tense) ----
gen $D/auditor_stacks.jpg    "wide establishing long shot down a dark marble corridor toward a single lit office window, $PROSSER visible through the glass hunched over open ledgers under a green banker's lamp, towering stacks of paper files silhouetted around him, cold empty bank hallway in the foreground shadow, lonely surveillance atmosphere, $ROOM"
gen $D/auditor_crossref.jpg  "medium shot, $PROSSER alone at his desk, one finger tracing a line down a printed statement while cross-referencing it against an open ledger, discrepancy figures circled in red ink, a green banker's lamp throwing sickly light up his lined controlled face, $ROOM"
gen $D/auditor_startle.jpg   "$PROSSER startled at his desk, both hands slapping a folder shut, his chair scraping backward, upper body twisting toward the door with a guarded alarmed glare over his shoulder, scattered printouts lifting into the air, sickly green lamp light and hard shadows, $ROOM"
gen $D/auditor_doorway.jpg   "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame in a doorway, looking into a small green-lit audit room where a tense $PROSSER sits frozen at his desk staring back warily, strong cold backlight rimming the silhouette, deep contrast, $ROOM"
gen $D/auditor_wary.jpg      "extreme close-up of $PROSSER's weathered controlled face, eyes narrowed in wary calculation, deep worry lines carved by the light, a bead of sweat at his temple, sickly green banker's-lamp light raking up from below to throw hard shadows into his eye sockets, $ROOM"

# ---- the woven read: what you decide he truly is ----
gen $D/auditor_career.jpg    "close shot, $PROSSER's hand resting motionless on a closed folder, eyes distant and calculating, the look of a man running silent risk arithmetic rather than feeling fear, green lamp light, $ROOM"
gen $D/auditor_crusade.jpg   "medium shot, $PROSSER's hand drifting toward a rubber stamp reading REVIEWED on his desk, an unconvincing flicker of moral resolve on his face undercut by visible relief at an easy exit, green lamp light, $ROOM"
gen $D/auditor_calcstill.jpg "extreme close-up of $PROSSER's hand freezing an inch above a ledger page, fingers curling back as if doing hidden long division, eyes flicking sideways in calculation rather than panic, green lamp light, $ROOM"

# ---- the anchor: frame the stakes, then the complication ----
gen $D/auditor_anchor.jpg    "medium shot from behind a young man's shoulder, quietly speaking across a cluttered desk toward $PROSSER who sits caught mid-motion, cold deliberate intent in the young man's posture, green banker's lamp overhead, deep tense shadow, $ROOM"
gen $D/auditor_freezeface.jpg "intense close-up of $PROSSER's face as the calculation stops dead, eyes widening with dawning recognition of an ultimatum, a folder still trapped under his hand, green lamp light throwing hard shadow across sudden dread, $ROOM"
gen $D/auditor_knock.jpg     "tense medium shot, $PROSSER's head snapping toward a heavy office door at a sharp knock, both of them frozen mid-conversation, green lamp light steady, a shadow moving under the door gap, $ROOM"
gen $D/auditor_hold.jpg      "wide shot, a young man's shadowed silhouette and $PROSSER both frozen dead still on opposite sides of a desk, eyes locked on a closed door, holding their breath together, green lamp light unmoving, deep still shadow, $ROOM"
gen $D/auditor_cover.jpg     "medium shot, a calm composed young man in shadow leaning back with an easy dismissive posture speaking loudly toward an unseen door, $PROSSER beside him rigid with disbelief at the bluff, green lamp light, deep shadow, $ROOM"
gen $D/auditor_rushdoor.jpg  "dramatic shot from behind, a young man's silhouette wrenching open a heavy door onto an empty marble corridor, a cleaning cart rattling away in the distance, cold fluorescent hallway light spilling into the warm green-lit room behind him, $ROOM"
gen $D/auditor_stung.jpg     "$PROSSER leaning back from the desk, the calculating caution on his face hardening into flat, guarded, wounded mistrust, jaw set, eyes cold, green lamp light throwing a sharp shadow across half his face, $ROOM"

# ---- disarm: caution curdles into resignation ----
gen $D/auditor_sink.jpg      "a controlled $PROSSER sinking slowly back down into his desk chair, all the tension draining from his posture, gaze fallen to the ledgers, resignation and exhaustion, green lamp light pooling on the papers, deep shadows around him, $ROOM"
gen $D/auditor_bitter.jpg    "close-up of $PROSSER giving a short, humorless laugh, head tipped slightly, eyes flat with old professional fear, mouth twisted between composure and despair, green lamp light, a stack of shell-account printouts visible on the desk, $ROOM"
gen $D/auditor_doubt.jpg     "medium close-up of $PROSSER studying the viewer with a long skeptical searching look, one eyebrow raised, guarded calculation warring with cautious hope, mixed warm and cool lamp light, $ROOM"
gen $D/auditor_relief.jpg    "a weary $PROSSER as the guardedness finally eases from his face into the faint ghost of professional relief, eyes softening, warm amber lamp light replacing the cold green, a small flicker of restored resolve, $ROOM"
gen $D/auditor_dread.jpg     "extreme close-up of $PROSSER going utterly still and pale, eyes fixed and unblinking on a private nightmare of his own signature on a discredited report, cold sweat at his brow, deep blue-green shadows swallowing the frame edges, $ROOM"

# ---- press: he reaches for the phone ----
gen $D/auditor_threaten.jpg  "$PROSSER's hand closing over a desk phone receiver, voice climbing, eyes wide with cornered defiance, papers sliding off the desk, green lamp swinging slightly on its cord, chaotic alarm, $ROOM"
gen $D/auditor_callbluff.jpg "a calm composed young man in shadow leaning back slightly with a cold quiet stare, calling the bluff, across from him $PROSSER faltering as his resolve visibly drains, green lamp glowing between them, tense noir standoff, $ROOM"
gen $D/auditor_choke.jpg     "close-up of $PROSSER's hand still gripping an unlifted phone receiver, the fight collapsing into fear and quick recalculation, swallowing hard, green lamp light, hard shadow across his jaw, $ROOM"
gen $D/auditor_handover.jpg  "close shot, $PROSSER's shaking hands shoving a thick folder across the desk, several printouts sliding off the edge onto the floor, defeated posture, green lamp light, deep shadow, $ROOM"

# ---- bribe: money answers the wrong question ----
gen $D/auditor_cashdrop.jpg  "tight overhead close-up of a plain envelope of cash being set down onto a closed ledger on a paper-stacked desk, a hand just withdrawing, green banker's-lamp light glinting off the desk grain, the envelope sitting between two men like an accusation, $ROOM"
gen $D/auditor_cashstare.jpg "$PROSSER staring down at an envelope of cash resting on his ledger without touching it, an expression of tired offended suspicion, jaw tight, green lamp light on his controlled face, moral wariness, $ROOM"
gen $D/auditor_cashrefuse.jpg "close-up of $PROSSER giving a short, humorless laugh, shaking his head slightly at an envelope of cash on his desk, a man explaining with tired professional conviction why the money changes nothing, green lamp light, $ROOM"

# ---- endings (portraits behind the consequence cards) ----
gen $D/auditor_turned_end.jpg "emotional medium shot, $PROSSER kneeling beside an open bottom desk drawer, lifting out a sealed duplicate file with both hands and holding it toward the viewer, eyes steady with quiet resolve, warmer golden light now filling the audit room at night, a moment of costly trust, $ROOM"
gen $D/auditor_scared_end.jpg "a grey, sweating $PROSSER standing rigid behind his desk after handing something over, eyes locked fearfully on a heavy vault-adjacent door, wringing his ink-stained hands, sickly green lamp light, deep shadows, $ROOM"
gen $D/auditor_bought_end.jpg "$PROSSER sliding a folder across the desk a second time without meeting the viewer's eyes, an envelope of counted cash already pocketed, nothing behind his stare, green lamp light, $ROOM"
gen $D/auditor_burned_end.jpg "$PROSSER standing stiff and pale in the audit room, already reaching for a desk phone, jaw clenched, cold self-preserving intent written on him, harsh green lamp light and deep ominous shadow, $ROOM"

echo "=== auditor scene panels done ===" ; ls $D/auditor*.jpg 2>/dev/null | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/auditor.jpg           "noir crime graphic novel head and shoulders portrait of a precise middle-aged bank auditor in his fifties, wire-rim glasses, thinning grey-flecked combed-back hair, a pale controlled anxious face, eyes not quite meeting camera, cold green desk-lamp light mixed with cool blue-grey ambient light, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal and amber palette, high production value, no text, no watermark"

echo "=== auditor cast portrait done ===" ; ls -la $C/auditor.jpg
