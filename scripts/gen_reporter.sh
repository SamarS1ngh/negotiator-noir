#!/usr/bin/env bash
# DENSE per-beat panels for the Reporter (Iris Kell) mission — a distinct,
# meaningful shot for each dialogue beat (manhwa pacing), generated with
# detailed cinematic prompts (camera, expression, gesture, lighting,
# environment). Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never committed).
# NOTE: CF quota was exhausted when this mission was written — script is
# committed but NOT run. Run once quota resets; art self-integrates via the
# filenames already referenced in src/content/reporter_mission.ts.
set -euo pipefail
cd "$(dirname "$0")/.."
source ~/.cf_ai
STYLE="detailed korean webtoon manhwa panel, semi-realistic anime illustration, expressive detailed facial features, clean confident inking, cel shading with soft gradients, cinematic composition and camera framing, dramatic film-noir lighting, volumetric haze, atmospheric depth of field, cold storm-grey and brass color grade, fine rendering, sharp focus, high production value, no text, no speech bubbles, no watermark, no signature"
D=public/assets/art/scene
C=public/assets/art/cast

gen() { # gen <out> <detailed-desc> [width height]
  [ -s "$1" ] && { echo "skip (exists) $1"; return 0; }
  local body w h
  w="${3:-816}"; h="${4:-1216}"
  body=$(python3 -c "import json,sys;print(json.dumps({'prompt':sys.argv[1]+', '+sys.argv[2],'steps':8,'height':int(sys.argv[4]),'width':int(sys.argv[3])}))" "$2" "$STYLE" "$w" "$h")
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/ai/run/@cf/black-forest-labs/flux-1-schnell" \
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_reporter.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_reporter.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_reporter.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- the mission tile (used as the default scene bg for every node) ----
gen $D/reporter.jpg "wide establishing shot of a lone woman investigative reporter hunched over a cluttered desk in an otherwise dark, empty newsroom at night, a single brass banker's lamp pooling warm light over carbons and a typewriter, rows of dead dark desks receding into cold storm-grey shadow, a locked drawer visible at her knee, rain streaking tall windows behind her, moody noir isolation"

# ---- s0: the approach (tense) ----
gen $D/reporter_desk.jpg    "wide establishing shot of a cluttered newsroom desk at night lit by one brass banker's lamp, a sharp-featured woman reporter in a rumpled blouse and loosened tie hunched over a typewriter surrounded by towers of carbon paper and old clippings, rows of empty dark desks fading into cold storm-grey shadow behind her, rain streaking tall windows, lonely dedication, muted noir palette"
gen $D/reporter_drawer.jpg  "medium shot, the same woman reporter at her cluttered desk reflexively sliding a locked bottom desk drawer shut without looking up as a visitor's shadow falls across her workspace, brass lamp light catching the worn drawer handle and a faint edge of folded newsprint inside, tense wary reflex, cold newsroom shadow beyond the lamp's warm circle"
gen $D/reporter_wary.jpg    "close-up of a sharp-featured woman reporter at a cluttered desk, not looking up, pen still moving across a notepad, jaw set and eyes narrowed with practiced suspicion, brass lamp light carving hard shadows across her tired determined face, rain-streaked window glow behind her, a woman used to unwanted visitors after dark"
gen $D/reporter_doorway.jpg "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the frame in a newsroom doorway, looking down a row of dead desks toward one lit brass lamp where a wary woman reporter watches him approach, cold storm-grey ambient light against the warm lamp glow, deep contrast, the stillness before a negotiation"
gen $D/reporter_level.jpg   "medium close-up, a sharp-featured woman reporter finally looking up from her typewriter, pen stilling mid-sentence, an appraising, guarded look leveled straight at the viewer, brass lamp light warm on one side of her face and cold newsroom shadow on the other, a woman deciding whether you're worth her time"

# ---- the woven read: what you decide she truly is (tense/cold/guilt) ----
gen $D/reporter_spiked.jpg  "close-up of a woman reporter's hand resting on a stack of old rejected news carbons stamped or scrawled 'KILLED', her eyes distant and hard, weighing an old grievance, brass lamp light warm on the papers, cold storm-grey newsroom dark around her, quiet unresolved anger"
gen $D/reporter_calc.jpg    "close-up of a woman reporter's face, a quick hungry flicker of calculation crossing her eyes at the mention of a payday before her expression cools into something colder and more guarded, brass lamp light catching the shift, cold newsroom shadow framing her, a woman pricing the person in front of her"
gen $D/reporter_itch.jpg    "close-up of a woman reporter's hand freezing mid-motion on a locked desk drawer, her restless energy suddenly arrested by an old private wound, eyes flicking down and away, brass lamp light warm across her knuckles, cold shadow rising around her, a recklessness that just remembered its cost"

# ---- disarm: the offer, weighed carefully (cold/hope/fear) ----
gen $D/reporter_offer.jpg   "medium shot, a woman reporter sitting back with arms crossed at her cluttered desk, pen set down, studying a visitor with careful measuring eyes, brass lamp light warm across crossed arms and set jaw, cold storm-grey newsroom dark behind her, a negotiation just opening"
gen $D/reporter_weigh.jpg   "close-up of a woman reporter mid-thought, eyes distant and calculating something old and painful, lips slightly parted as if about to speak, brass lamp light warm on her face, cold shadow at the edges, a long private silence made visible"
gen $D/reporter_study.jpg   "close-up of a woman reporter studying a visitor with a long skeptical, searching look, one eyebrow faintly raised, guarded hope warring with old distrust in her tired eyes, warm brass lamp light softened at the edges, rain-blurred window glow behind her, a woman deciding whether to believe someone again"
gen $D/reporter_dread.jpg   "extreme close-up of a woman reporter's jaw tightening, eyes fixed on a private memory of fear, a faint sheen of tension on her brow, cold storm-grey shadow swallowing the edges of the frame around one warm pool of brass lamp light, a dread rehearsed too many nights"

# ---- the name / guilt bomb + complication (guilt/tense/threat) ----
gen $D/reporter_name.jpg    "over-the-shoulder shot from behind a young visitor's dark-coated shoulder across a cluttered newsroom desk, a woman reporter's face caught mid-reaction as an old name lands, brass lamp light warm between them, cold newsroom dark receding behind her, rain streaking the tall windows"
gen $D/reporter_drain.jpg   "intense close-up of a woman reporter's pen stopping dead on the page, the color draining from her face, eyes widening with dawning shock and old grief, brass lamp light catching the sudden stillness, cold shadow deepening around her, the exact instant a buried name resurfaces"
gen $D/reporter_confess.jpg "a woman reporter sitting back slowly in her chair at a cluttered desk, one hand pressed briefly to her mouth, eyes glassy with old guilt and grief as she finally speaks a name she's kept silent, warm brass lamp light, cold storm-grey newsroom dark around her, quiet devastating honesty"
gen $D/reporter_phone.jpg   "medium shot, a black desk phone ringing insistently on a cluttered newsroom desk at night, a woman reporter frozen with her hand halfway to it, eyes locked on the receiver with dawning alarm, brass lamp light glinting off the phone's cord, cold storm-grey newsroom dark and rain-streaked windows behind her, sudden tension"
gen $D/reporter_stillring.jpg "close-up of a woman reporter's hand resting flat over a silent desk phone, her shoulders slowly loosening as the ringing finally stops, a slow exhale visible in her posture, warm brass lamp light, cold newsroom dark beyond, relief edged with lingering dread"
gen $D/reporter_answered.jpg "close-up of a young man's hand lifting a desk phone receiver to his ear at a cluttered newsroom desk, listening intently to dead air, a woman reporter watching tensely from across the desk, brass lamp light glinting off the phone, cold storm-grey shadow around them, a wrongfooted confrontation"
gen $D/reporter_cutcord.jpg "close-up of a phone cord being ripped from a wall socket in a dark newsroom, the cord dangling loose and useless, a woman reporter staring at it with a mix of alarm and grim vindication, brass lamp light catching the frayed wire, cold shadow filling the frame, escalation frozen mid-motion"

# ---- guilt twisted into cold distance (cold) ----
gen $D/reporter_stung.jpg   "close-up of a woman reporter leaning back from her desk, raw grief on her face hardening into bitter guarded coldness, jaw set, eyes sharp and wet, her emotional walls slamming back up, brass lamp light warm but her expression ice, cold storm-grey newsroom dark behind her"

# ---- press: she calls the bluff, until she can't quite (threat/fear) ----
gen $D/reporter_defiant.jpg "medium shot of a woman reporter leaning forward over her cluttered desk with a short humorless laugh, chin lifted in open defiance, unafraid eyes locked on the visitor, brass lamp light hard across her sharp features, cold storm-grey newsroom dark receding behind her"
gen $D/reporter_counter.jpg "quiet, composed young man in shadow at the edge of a cluttered newsroom desk, calm and still, delivering a low counter-threat, a woman reporter's defiant expression caught mid-flicker across from him, brass lamp light glowing between them, cold newsroom dark, a tense noir standoff"
gen $D/reporter_check.jpg   "close-up of a woman reporter's eyes cutting sideways toward dark rain-streaked newsroom windows, a flicker of real fear breaking through practiced defiance, brass lamp light warm on half her face, cold storm-grey shadow swallowing the other half, the instant bravado falters"
gen $D/reporter_handover.jpg "close-up of a woman reporter's hands trembling slightly as she slides a thin folder of carbons across her cluttered desk, jaw tight, eyes refusing to meet the viewer's, brass lamp light warm on the folder, cold newsroom dark around her, a reluctant concession"

# ---- bribe: cash misprices her currency (tense) ----
gen $D/reporter_cash.jpg    "tight overhead close-up of a plain envelope of cash being set down onto a cluttered newsroom desk beside an old typewriter, a hand just withdrawing from it, brass lamp light glinting off the paper edge, the envelope sitting between two people like an accusation, cold storm-grey newsroom dark around the warm light pool"
gen $D/reporter_insult.jpg  "close-up of a woman reporter staring flatly at an envelope of cash on her desk without touching it, an expression of tired offended contempt, jaw tight, brass lamp light on her lined, unimpressed face, cold newsroom shadow behind her, quiet moral weariness"
gen $D/reporter_weary.jpg   "close-up of a woman reporter shaking her head slightly with a tired, almost sad half-smile, eyes heavy with old exhaustion, brass lamp light warm on her face, cold storm-grey newsroom dark around her, a woman far past what money can buy"

# ---- endings (portraits behind the consequence cards) ----
gen $D/reporter_allied_end.jpg    "a woman reporter unlocking a bottom desk drawer and lifting out an old worn file alongside tonight's notes, sliding both across her cluttered desk with a small, hard-won, hopeful look, warm brass lamp light replacing the cold storm-grey around her, a quiet moment of real alliance forming, rain-streaked window behind her"
gen $D/reporter_leveraged_end.jpg "a woman reporter handing a folder across her desk without meeting the viewer's eyes, expression guarded and closed off, brass lamp light warm on the folder but cold shadow across her face, cold storm-grey newsroom dark around her, cooperation without trust"
gen $D/reporter_bought_end.jpg    "a woman reporter folding an envelope of cash into her coat with a flat, transactional expression, nothing behind her eyes, a folder already handed over on the desk beside her, brass lamp light cold and clinical, storm-grey newsroom dark around her, a woman who sold something she used to protect"
gen $D/reporter_burned_end.jpg    "a woman reporter typing fast and furiously at her cluttered desk, jaw set with grim resolve, ignoring the visitor entirely, brass lamp light harsh and urgent, cold storm-grey newsroom dark pressing in around her, a decision already made and irreversible"

# ---- cast portrait (board node face, corkboard surveillance-photo look) ----
gen $C/reporter.jpg "noir crime graphic novel head-and-shoulders portrait of a sharp-featured woman investigative reporter in her thirties, loosened tie and rumpled blouse, tired hard eyes, jaw set with wary determination, plain dark background, dramatic low-key brass and storm-grey lighting, glossy cel-shaded, sharp detailed eyes, high production" 816 1020

echo "=== reporter dense panels done ==="; ls $D/reporter_*.jpg 2>/dev/null | wc -l
