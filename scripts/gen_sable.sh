#!/usr/bin/env bash
# DENSE per-beat panels for the Sable mission — a distinct, meaningful shot for
# each dialogue beat (manhwa pacing), plus the base establishing scene and the
# board cast portrait. Cloudflare FLUX-schnell. Creds in ~/.cf_ai (never
# committed). Modeled exactly on scripts/gen_vera.sh / scripts/gen_sal.sh.
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
    -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" -d "$body" -o /tmp/_cf_sable.json
  if python3 -c "import json,base64,sys;d=json.load(open('/tmp/_cf_sable.json'));i=d.get('result',{}).get('image');open(sys.argv[1],'wb').write(base64.b64decode(i)) if i else sys.exit('ERR '+str(d)[:150])" "$1"; then
    echo "OK $1"; else echo "FAIL $1  ($(python3 -c "import json;print(json.load(open('/tmp/_cf_sable.json')).get('errors',''))" 2>/dev/null | head -c 120))"; fi
  sleep 1
}

# ---- base establishing scene (mission fallback background) ----
gen $D/sable.jpg            "wide establishing shot inside a lavish penthouse after a party has ended, floor-to-ceiling windows showing a cold gold city skyline at night, abandoned champagne flutes on marble side tables, a grand piano with sheet music left open, a striking elegant woman in a slip of a gown standing alone on a terrace edge in the middle distance smoking, warm amber interior lamp light against cool blue-magenta night glass, drifting cigarette haze, hushed after-hours opulence, film-noir lighting"

# ---- s0: the approach (tense) ----
gen $D/sable_smoke.jpg      "medium shot, a striking elegant woman in her thirties in a fitted silk slip dress, dark hair loose, standing alone at the railing of a penthouse terrace at night, cigarette between two fingers trailing smoke, gazing out over a cold gold city skyline with total unbothered composure, warm amber light from the apartment behind spilling onto her shoulder, deep blue night beyond the glass, quiet detached poise"
gen $D/sable_greet.jpg      "dramatic over-the-shoulder noir shot from behind a young man's dark-coated silhouette filling the left of frame, crossing a marble-floored penthouse living room toward a woman smoking alone on a terrace beyond tall glass doors, warm amber lamp light rimming the silhouette against the cool blue-gold skyline beyond, the stillness before an opening move"
gen $D/sable_still.jpg      "extreme close-up of a striking elegant woman's face in her thirties, a practiced bored expression cracking for a fraction of a second into sharp genuine attention, eyes lifting to meet the viewer, cigarette paused halfway to her lips, warm amber light against a cool blue night backdrop through penthouse glass, the exact instant boredom becomes interest"

# ---- r_forsale: the wrong read — money (cold) ----
gen $D/sable_bored.jpg      "close-up detail shot, an elegant woman's ringed hand resting on a marble balcony rail, an expensive diamond bracelet and rings catching cold city light, in soft-focus background the penthouse party's abandoned champagne glasses and city skyline glow, warm amber light and cool blue-magenta night haze, a quiet visual detail of quiet wealth worn like a leash"

# ---- r_scared: the wrong read — fear (threat) ----
gen $D/sable_flinch.jpg     "medium shot, a striking elegant woman on a penthouse terrace at night rolling her eyes with dry unimpressed composure rather than fear at hearing a powerful man's name, arms loosely crossed, cigarette smoke curling past an unbothered expression, warm amber light and cool blue night skyline behind her, quiet total lack of intimidation"

# ---- t1: the trade, value for value (warm) ----
gen $D/sable_trade.jpg      "tight close-up of a small folded note and a torn scrap of ledger paper being set down on a marble side table beside an elegant woman's hand and an abandoned champagne flute, faint handwriting and a shell-account name visible, warm amber lamp light glinting off the marble, a penthouse after a party, the paper sitting between two people like a held breath"
gen $D/sable_warm.jpg       "medium close-up, a striking elegant woman in her thirties turning a small torn note over once in her fingers, expression easing from guarded boredom into genuine surprised interest, the first real hint of a smile ghosting at one corner of her mouth, warm amber lamp light against the cool blue-gold city glow through penthouse glass, a wall of empty champagne flutes soft-focus behind her"

# ---- n1: the name, an overheard memory (guilt) ----
gen $D/sable_name.jpg       "intense close-up of a striking elegant woman's face as a name lands and stops her cold, eyes widening slightly, cigarette forgotten motionless in her fingers, lips parting, warm amber light catching a flicker of unease in her eyes, cool blue-magenta night beyond penthouse glass, a penthouse after a party"
gen $D/sable_memory.jpg     "close-up of a striking elegant woman gazing into middle distance on a penthouse terrace, recalling an overheard conversation with cold precise focus rather than warmth, faint furrow between her brows, eyes distant and calculating, warm amber light low and steady against a deep blue night skyline, quiet sharp recollection"

# ---- n2: leverage on the memory, the wall goes back up (cold) ----
gen $D/sable_stung.jpg      "close-up of a striking elegant woman's face as brief openness drains out fast, expression flattening into old guarded coldness, jaw setting, eyes going hard and distant, warm amber light now throwing a harder colder edge across her face, a penthouse terrace at night, a wall going back up"

# ---- p1: pressed for names, a warning not a refusal (threat) ----
gen $D/sable_warn.jpg       "medium shot, a striking elegant woman's bored expression going glass-flat and unmistakably serious, drawing herself up with sudden authority on a penthouse terrace at night, direct unflinching eyes, cigarette held perfectly still, warm amber light now sharp-edged against cool blue night glass, a quiet dangerous warning"

# ---- c1: the money and jewelry, insult not temptation (cold) ----
gen $D/sable_cash.jpg       "tight overhead close-up of a folded bill and a diamond bracelet set down together on a marble side table beside an abandoned champagne flute, a woman's manicured hand just visible at the edge of frame not reaching for it, warm amber lamp light glinting off the marble, a penthouse after a party, money and jewelry sitting like an accusation"
gen $D/sable_cold.jpg       "close-up of a striking elegant woman looking down at a bracelet and folded bill without touching them, an expression of tired almost-pitying recognition rather than temptation, one eyebrow faintly raised, warm amber light, cool blue night beyond penthouse glass, quiet weary disappointment"

# ---- turn: THE COMPLICATION — the elevator climbing (tense) ----
gen $D/sable_elevator.jpg   "close-up of a brass private-elevator floor indicator panel beside a lacquered penthouse door, glowing numbers climbing upward, a striking elegant woman's tense reflection visible faintly in the polished brass, warm amber hallway light, cool blue-black shadow, sudden dramatic tension, a penthouse at night"
gen $D/sable_cover.jpg      "medium shot, a striking elegant woman in a silk gown standing abruptly, cigarette already crushed out, expression snapping from languid to sharp and fast-thinking, one hand gesturing urgently toward a young man in the foreground, warm amber penthouse light against a darkening room, urgent hushed tension, a private elevator door glowing faintly in the background"

# ---- aftermath: the actual test (tense) ----
gen $D/sable_return.jpg     "medium close-up, a striking elegant woman sinking back onto a velvet penthouse sofa a while later, studying the viewer in unreadable silence before speaking, warm amber lamp light and the cool blue-gold city skyline glowing through tall windows behind her, a penthouse emptied out after a close call, quiet weighing tension"

# ---- endings (portraits behind the consequence cards) ----
gen $D/sable_turned_end.jpg "warm medium shot, a striking elegant woman in her thirties lighting a fresh cigarette with a relaxed genuine expression, leaning back against a marble balcony rail with the gold city skyline behind her, warm amber light now full and golden, a penthouse terrace at night, a moment of real trust extended"
gen $D/sable_wary_end.jpg   "close-up of a striking elegant woman already turning away, expression flat, final, and transactional, eyes not quite meeting the viewer's, cool amber light now edged with distance, a penthouse terrace at night, a door quietly closing"
gen $D/sable_burned_end.jpg "tense medium shot, a striking elegant woman calmly lifting a white house telephone to her ear in a penthouse at night, expression cold and final, almost gentle regret in her eyes, warm amber light gone hard and cold-edged, the cool blue city skyline glowing behind her through tall glass, an unmistakable decision made"

echo "=== sable scene panels done ===" ; ls $D/sable*.jpg | wc -l

# ---- board cast portrait (corkboard photo, same pipeline) ----
gen $C/sable.jpg            "noir crime graphic novel head and shoulders portrait of a striking elegant woman in her thirties, dark hair loose over bare shoulders, a fitted silk slip gown, a cigarette held elegantly, poised knowing expression with a hint of boredom concealing sharp intelligence, warm amber light mixed with cool blue-magenta night wash, plain dark background, glossy cel-shaded noir style, sharp detailed eyes, muted teal-magenta and gold palette, high production value, no text, no watermark"

echo "=== sable cast portrait done ===" ; ls -la $C/sable.jpg
