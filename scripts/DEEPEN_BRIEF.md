# Chapter 1 deepening — subagent brief

You deepen ONE Chapter-1 scene into a richer, LEARNING-CENTRIC mission. The game is
a teaching engine in a noir thriller's skin (spec:
`docs/superpowers/specs/2026-07-21-campaign-expansion-design.md`). The player must
LEARN to read people + negotiate; every mission teaches a real, named principle.

## Study the exemplar FIRST (copy its shape)
- `src/content/sal_mission.ts` — the pattern: dense per-beat `art:`, per-node `mood`,
  `teaches: [...]` on the mission, and on EVERY ending outcome a `campaign` delta +
  a two-layer `debrief`. Replicate all of it.
- `src/domain/principle.ts` — the principle registry. Use ONLY these ids.
- `src/domain/campaign.ts` — the `CampaignDelta` shape (money/faction/bonds/ledger).

## The four things every deepened mission must gain

1. **THE WOVEN READ (the core learning loop).** After the opening beats, the FIRST
   fork is a READ: a deduction about the mark, framed from what the player JUST
   observed ("he won't meet your eye and keeps touching the ledger drawer — what's
   he protecting?"). 2–4 options, each a different interpretation. ONE read is
   correct (fits his true type/interest/fear) and its branch opens the STRONG
   approaches; wrong reads branch to a fumble — a beat where it goes worse, then a
   costlier recovery or a weaker ending. Never a dead end: every path reaches an
   outcome, but the read has consequences. This is where "read a person" lives.

2. **A COMPLICATION.** At least the main path gains a mid-mission TURN — an
   interruption, a double-cross, a moral cost, a choice under pressure — a node
   between the approach and the ending where the scene *turns*. Teaches adaptation,
   not a memorized script.

3. **DEBRIEF on every ending** (`outcome.debrief = { principle: <id>, note: "…" }`).
   The note ties the named principle to what the player JUST did, in the MC's voice.
   You MAY use **bold** around key terms — the card renders it. Wins AND misreads
   both teach (a botch teaches the principle by counterexample).

4. **CAMPAIGN effects on every ending** (`outcome.campaign`): `bonds` (this
   character 0–4), `faction: { id: 'docks', delta }`, `money` (+/‑), and `ledger`
   (persistent flags like `<char>_turned`/`<char>_burned`). Good turns raise bond +
   docks standing; botches lower them + may cost money or raise heat (existing
   `heatDelta`). Also add `teaches: [<ids>]` to the Mission object.

## Act I principle ids (use these)
`interests-not-positions` · `types-and-tells` · `leverage-and-batna` ·
`loss-aversion` · `reciprocity` · `golden-bridge` · `foot-in-the-door`
(Later-act ids exist too — see principle.ts — use one only if it genuinely fits.)

## Art
Reuse the character's EXISTING `<prefix>_*.jpg` panels for the new read/complication
beats where one fits. Generate a NEW panel (Cloudflare, per `scripts/gen_sal.sh`:
source `~/.cf_ai`, 816×1216, steps 8, unique `/tmp/_cf_<prefix>.json`, detailed
manhwa prompt) ONLY for a genuinely new distinct moment. Every beat needs an `art:`.

## Rules
- PRESERVE the character's voice, existing endings' meaning, ids, flags, grants,
  worldFlags, dispositions, deal data. You are ADDING depth, not rewriting the plot.
- Keep it buildable TypeScript matching sal_mission.ts exactly. Do NOT run
  `npm run build` (parallel builds race); ensure syntactic validity.
- Report: DONE — <file>: read fork added, complication added, N endings each with
  debrief+campaign, principles taught, any new art generated.
