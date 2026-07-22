# Chapters 3–6 buildout — the rest of the campaign

Extends `2026-07-21-campaign-expansion-design.md`. Act I (Ch1 Docks, Ch2 DeLuca)
is built + deepened. This spec details the four remaining chapters so parallel
subagents build them coherently. Every mission follows the depth model (woven
READ → approach → COMPLICATION → two-layer DEBRIEF) and the learning spine.

**Faction ids:** ch3 `union` · ch4 `bank` · ch5 `hall` · ch6 `house`.
Each new mission: `teaches` on the Mission + `campaign`(bonds/faction/ledger/money)
+ `debrief`(principle,note) on every ending. Art deferred (write `gen_<prefix>.sh`,
reference filenames, do NOT run CF — quota-gated; art self-integrates later).

---

## CH3 — THE WATERFRONT UNION (Act II) · target: KASTNER
**The reveal:** here the cargo is REAL — unmarked crates that match no manifest
(war-surplus weapons), and men who ask about them vanish (echoing your father).
**Faction:** `union`. **Palette hints:** salt-rust grimy amber/steel.

Prep missions (each a new file + node):
- **halloran_mission** (HALLORAN, the dockmaster who signs the phantom manifests —
  corrupt, terrified). Read: he's not greedy, he's cornered — plausible deniability
  is his shield. teaches `information-asymmetry`, `plausible-deniability`,
  `loss-aversion`. Clean grant `['manifestProof','halloran_turned']`.
- **finn_mission** (MRS. FINN, widow of a longshoreman who vanished asking about the
  crates). Read: she doesn't want money or revenge, she wants the truth / her
  husband's name cleared — mirrors YOU. teaches `interests-not-positions`,
  `reciprocity`. Clean grant `['witnessLead','finn_helped']`. Emotional core of ch3.
- **breen_mission** (BREEN, the customs officer waving the cargo through for cash).
  Read: shielded from the downside, so reckless — fear of the audit turns him.
  teaches `follow-the-money`, `moral-hazard`. Clean grant `['customsProof','breen_turned']`.
- **delaney_mission** (DELANEY, a young firebrand who wants Kastner's chair). Read: a
  peer with his own ambition — proof + self-interest, not your word. teaches
  `triangulation`, `sunk-cost`. Clean grant `['unionRival','delaney_backing']`.

**kastner_confront** — the sit-down. Leverage (manifests / the deaths / the rival)
forces Kastner to give up where the cargo money goes: the **Cassar Bank** (names
Cassar). `deal.gotName` → climb to Ch4. teaches `leverage-and-batna`,
`triangulation`, `walk-away-power`, `the-mirror`. Reactive openings like ricci.

**First ally death:** on the Ch2→Ch3 transition interlude, if a recurring ally is
`atRisk` (heat ≥ 7 AND bond < 3) — Sal (if `sal_mole`) or Pip (if `pip_helped`) — they
turn up dead, cleaned up by the people protecting the cargo. Gut-punch; removes
their intel. Handled by the interlude system (below).

---

## CH4 — THE CASSAR BANK (Act II) · target: CASSAR
**The reveal:** where the cargo money is washed — and that the partners are UPRIVER,
federal-scale (the names Vera hinted at). **The betrayal lands here.**
**Faction:** `bank`. **Palette:** cold marble, green lamp, money-green.

Prep:
- **teller_mission** (a young bank clerk, idealistic/scared, sees the dirty ledgers).
  Read: a small yes first. teaches `foot-in-the-door`, `information-asymmetry`.
  grant `['accountAccess','teller_turned']`.
- **auditor_mission** (an external auditor who could expose the wash). Read: anchor
  the stakes. teaches `follow-the-money`, `anchoring`. grant `['auditLever','auditor_turned']`.
- **sable_mission** (SABLE, Cassar's socialite mistress who knows the upriver names).
  Read: value-for-value, discretion. teaches `information-asymmetry`, `reciprocity`.
  grant `['upriverNames','sable_turned']`.
- **THE BETRAYAL** — not a prep node but an interlude beat: if you used **Bianchi**
  coldly (`bianchi` low bond / `o_cutout`) OR **Vera** coldly (`vera_burned`/low bond),
  they sell you to Cassar here — costs you (heat spike, an ally becomes an enemy,
  a prep lead burned). If you kept them close, they warn you instead.

**cassar_confront** — leverage → names the man at the Hall who protects it all:
**Commissioner Vane**. `deal.gotName` → climb to Ch5. teaches `anchoring`,
`follow-the-money`, `principal-agent`, `walk-away-power`.

---

## CH5 — THE HALL (law/politics, Act III) · target: COMMISSIONER VANE
**The reveal:** the full picture — your father's erasure was ORDERED from here (Vane
signed; Marlowe executed). The protection layer, clean-handed via cut-outs.
**Faction:** `hall`. **Palette:** cold civic marble, brass, storm-grey.

Prep:
- **reporter_mission** (a hungry, endangered journalist who wants the story). Read:
  mutual use; the story is her currency. teaches `information-asymmetry`,
  `plausible-deniability`. grant `['pressLever','reporter_allied']`.
- **aide_mission** (Vane's fixer/aide who knows where the bodies are buried). Read:
  power-mapping — who really owes whom. teaches `power-mapping`, `patronage`(reciprocity).
  grant `['hallAccess','aide_turned']`.
- **rival_mission** (a rival politician who'd love Vane gone). Read: engineer mutual
  fear. teaches `triangulation`, `prisoners-dilemma`. grant `['rivalBacking','rival_allied']`.

**vane_confront** — the man who ordered your father erased. To break him you must use
HIS methods (threaten what he loves, weaponize the whole chain of proof) — a
moral-cost beat: **the mirror**. `deal.gotName` → the last rung, Marlowe.
teaches `plausible-deniability`, `power-mapping`, `prisoners-dilemma`, `the-mirror`.

---

## CH6 — MARLOWE'S HOUSE (Act III finale) · target: MARLOWE  [renumber existing ch3]
The current `chapter3.ts` (Marlowe's house: Otto + Adler → marlowe_endgame) becomes
**Chapter 6** (id `ch6`). Work:
- **Deepen otto_mission + adler_mission** (woven read + complication + debrief/campaign),
  faction `house`.
- **Deepen marlowe_endgame** — add `teaches` + `debrief` on every ending, and make the
  finale read the **who-lived ledger**: name the allies who died (Sal/Pip/Vera), who
  betrayed you (Bianchi/Vera), and let it color the take-it (become Marlowe / the
  mirror complete) vs burn-it (lose everything, truth out) choice. Now EARNED over
  six chapters. teaches `the-mirror`, `walk-away-power`, `prisoners-dilemma`.

---

## THE INTERLUDE / FATE SYSTEM (engine)
Chapter transitions already play a recap Mission (`buildCh2Recap` etc.). Generalize:
- `buildInterlude(fromCh, toCh, camp, heat, flags)` → a recap Mission whose beats
  reflect (a) the widening reveal for that transition, (b) **fates**: for each
  recurring ally, if `atRisk(camp, id, heat)` and a bond/ledger threshold is crossed,
  a death or betrayal beat plays and writes a ledger flag (`sal_dead`, `bianchi_betrayed`…).
- `game.ts` passes `camp` + `st.heat` into the interlude builder on each climb.
- The finale (ch6) reads those ledger flags for the who-lived roll-call.

## CHAIN (game.ts) — generalize to 6 chapters
Replace the hardcoded climbToChapter2/3 with a data-driven progression: an ordered
`CHAPTERS` list, each entry = { chapter, confront, recap }. Beating a chapter's
target with `deal.gotName` advances the index, plays the interlude, seeds carried
flags/heat/camp. `sitDown()` dispatches to the current chapter's confront. Ch6's
target (Marlowe) ends the game.
