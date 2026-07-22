# Dense per-beat manhwa panels — subagent brief

You add cinematic manhwa panels to ONE mission file so its scene swaps with every
line of dialogue (like a webtoon), then wire them in. Follow this exactly.

## Study the exemplar FIRST (already done, copy it)
- `src/content/sal_mission.ts` — the wiring pattern to replicate: panel path consts
  at the top, `art: CONST` on EVERY beat, `portrait: CONST` on EVERY outcome node.
- `scripts/gen_sal.sh` — the image-generation recipe: the `gen()` bash function,
  the detailed STYLE string, dims `816x1216`, `steps 8`, creds from `~/.cf_ai`.

Your job = do the same thing for YOUR assigned file.

## Steps
1. **Read your mission file.** Find every dialogue beat (each `{ who: 'them'|'you', … text: … }`)
   and every outcome node (a node with an `outcome: { key: … }`).
2. **Design one distinct, meaningful panel per beat.** It must depict THAT exact
   moment. Write a DETAILED cinematic prompt for each: camera/shot (extreme
   close-up, over-the-shoulder, wide establishing, low angle), the character +
   exact facial expression + body language + gesture, the specific action, the
   environment details, lighting direction + color, mood. One panel per beat.
   Only reuse a panel across two ADJACENT beats if it is genuinely the same frozen
   moment. Design one portrait per outcome node too.
3. **Write `scripts/gen_<prefix>.sh`** modeled exactly on `scripts/gen_sal.sh`
   (same `gen()` fn, same STYLE string, 816x1216, steps 8, `source ~/.cf_ai`).
   Output files: `public/assets/art/scene/<prefix>_<slug>.jpg`. Run it.
   **IMPORTANT — you run in parallel with other agents:** in your `gen()` change the
   shared `/tmp/_cf.json` temp path to a UNIQUE one for your prefix, e.g.
   `/tmp/_cf_<prefix>.json`, in BOTH the curl `-o` and the python decode — otherwise
   parallel agents clobber each other's API response and you decode garbage.
4. **Handle the NSFW filter.** Cloudflare returns `AiError … Input prompt contains
   NSFW content (code 3030)` on some violent/grim wording. When a gen fails, REWORD
   that one prompt with softer synonyms and retry until it saves a real JPEG.
   Avoid these trigger words entirely: blood, bleeds, crushed, collapse/collapsing,
   broken, chained, burning, bandaged, scream/screaming, betrayal, accusation,
   corpse, dead body, wound, choke. Use instead: "about to shout", "about to run",
   "ashen/pale", "sinks forward", "hand over eyes", "glowing fire", "hurt hand",
   "worn", "grim". Confirm each output with `file <path>` shows "JPEG".
5. **Wire your file** exactly like `sal_mission.ts`: add the panel path consts at
   the top (format `const NAME = 'assets/art/scene/<prefix>_<slug>.jpg';`), put
   `art: NAME` on EVERY beat, `portrait: NAME` on EVERY outcome node. PRESERVE all
   existing text, choices, mood, palette, flags, grants, dispositions — ONLY add
   `art:`/`portrait:`. Do not rename ids or change logic.
6. **Do NOT run `npm run build`** (parallel builds race on dist/). Just make sure
   your TypeScript is syntactically valid, matching the sal pattern.

## Style bar (this is what "good" looks like)
Semi-realistic Korean webtoon/manhwa, clean confident inking, cel shading,
cinematic film-noir framing, dramatic directional lighting, muted teal+amber
grade, expressive detailed faces. Keep the character's look consistent across all
their panels. Ground every panel in the character's own world (below).

## Report back
`DONE — <N> panels generated for <file>. Every beat + outcome has art/portrait.`
List any beats where you reused a panel, and any prompt you had to reword for NSFW.
