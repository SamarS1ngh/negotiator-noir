# THE NEGOTIATOR — Campaign Expansion Design (5–6 hours)

**Goal:** Grow the game from a ~30-minute climb into a **5–6 hour noir psychological
thriller** — a real novel arc with escalation, a conspiracy, recurring characters
you bond with and lose, betrayals, and a mirror-theme payoff. **Both breadth (more
chapters & missions) and depth (multi-scene missions, systems).** Vivid throughout
— every scene a manhwa panel per beat (the pipeline is already built).

**THE ACTUAL POINT (Samar, 2026-07-21):** the story is the *skin*; the game exists
so the **player genuinely learns** — reading people & situations, manipulation,
negotiation, logic, scheming, plotting, power-struggle politics, and economics.
Every mission teaches a **real, named principle** and makes the player *practice*
it under pressure. This is a **learning engine disguised as a psychological
thriller.** See §1.5 (the learning spine) — it is co-equal with the story spine and
governs every mission's design. Teaching is **two-layer** (Samar's global rule):
plain mental model first, then the real jargon named and anchored to it — woven
into the fiction, never a lecture.

**Approved by Samar (2026-07-21):** spine works · breadth + depth both · vivid ·
death stakes real · finale = take-vs-burn · 6 chapters ·
**start from the beginning** (enrich prologue + Ch1 forward, not bolt-on ch4-6).

---

## 1. THE SPINE — the conspiracy that carries 6 hours

The current story is "climb 3 rungs, revenge for your father." That's 30 minutes.
The spine that carries six hours: **it was never personal.**

**The engine:** Tomas Vidal (your father) ran freight + chandlery on Marlowe's
docks. Marlowe didn't just break a debtor — he **erased a witness.** Tomas's
freight books recorded shipments that officially never existed: Marlowe's empire
is the visible front over an **invisible pipeline** — war-surplus matériel and
contraband moved through the port for **partners upriver** (a police commissioner,
a state senator, a shipping magnate — men the law protects). Tomas, an honest
man, started asking where the phantom cargo went. So Marlowe broke his *name*
first (so no one would believe a word he said), then let the debt finish him.

**The thread you pull:** Sal's mole reward — *"your father's real, honest ledger"*
(already canon in Ch1) — is not just proof of innocence. It's the first phantom
manifest. Each rung you climb, you decode more of it: the cargo (Act II docks),
the money (Act II bank), the protection (Act III law), the head (Marlowe). The
deeper you go, the clearer it gets that revenge and justice have split apart — and
that to expose or seize this, **you must become the kind of man who built it.**

**The mirror payoff:** Ricci was "what you could become." By Act III that's literal
— you now do what Marlowe does (ruin people with information, trade lives for
leverage). The finale isn't take-vs-burn as a coin flip; it's the question the
whole game has been asking, now with six hours of blood behind it.

*(Samar may swap the conspiracy's nature on review: alternatives — a murder Tomas
witnessed / stolen federal gold / a trafficking pipeline / a blackmail ring. The
"war-surplus smuggling protected by upriver power" pick is chosen because it
chains docks → bank → politics → Marlowe cleanly and fits the late-1940s port.)*

---

## 1.5 THE LEARNING SPINE — what the player actually gets better at

The story exists to teach. Every mission is built around a **real principle** the
player reads for, practices, and is then shown the name of. Difficulty = the game
stops telling you which lever fits; you must **read the person or the situation**
and choose. The curriculum escalates with the climb:

**Act I — READING PEOPLE + NEGOTIATION FUNDAMENTALS (Ch1–2)**
- **Positions vs interests** (the Orange / *Getting to Yes*): the demand isn't the
  need — find the hidden *why* and trade what costs you nothing. (Sal doesn't want
  money; he wants to not drown.)
- **Types & tells** (7-38-55: words lie, behavior leaks): read a mark as proud /
  scared / greedy / true-believer and pick the lever that lands vs backfires.
- **Leverage & BATNA** (your walk-away power): what you hold that changes his math;
  why the man with nothing to lose can't be priced.
- **Loss aversion** (a threatened loss moves harder than an offered gain).
- **Reciprocity & the Ben Franklin effect** (a small granted favor buys loyalty).
- **The golden bridge / face-saving** (let a beaten man retreat with dignity or he
  fights to the death).

**Act II — SCHEMING + ECONOMICS (Ch3–4)**
- **Coalition-building & triangulation** (turn two parties against each other; be
  the pivot both need).
- **Information asymmetry & kompromat** (who knows what is the real currency;
  quid pro quo, controlled leaks).
- **Anchoring & framing** (the first number/frame owns the room).
- **Sunk cost & moral hazard**; **principal–agent problems** (why Marlowe's own men
  rob him).
- **Economics of the pipeline** — cash flow, laundering, skim, market power,
  scarcity pricing — taught two-layer per Samar's global finance rule.

**Act III — POWER & POLITICS + THE META-GAME (Ch5–6)**
- **Power mapping & patronage** (who owes whom; loyalty as a ledger).
- **Plausible deniability & the cut-out** (how power stays clean-handed).
- **The prisoner's dilemma / defection** (when everyone can betray, who moves first).
- **Walk-away power / when NOT to negotiate.**
- **The mirror** — the cost of mastery: you now do what Marlowe does. The last
  lesson is about *you*.

**Delivery (how it teaches without lecturing):**
- **THE READ is the core loop** — before/within a meet you deduce the mark's hidden
  attributes (type, interest, tell, BATNA, a lie) from observable behavior; a right
  read unlocks/cheapens the right lever, a misread costs you. This is the "read a
  person or a situation" mechanic, revived as the spine.
- **Diegetic voice** — the MC's inherited skill ("read a man across a table," from
  his father) narrates the principle in-fiction as an instinct, not a tutorial.
- **THE DEBRIEF** — each mission closes on a two-layer beat tied to what you *just
  did*: the plain model, then the named principle ("giving Ricci a way to save face
  — that's a **golden bridge**"). Extends the existing `MissionOutcome.reflect`.
- **A codex** — named principles you've used accrete into a quiet in-game "black
  book" the player can reread. Optional, never blocks play.

`domain/principle.ts` (NEW): a `Principle` registry (id, plain model, jargon,
example) referenced by missions (`Mission.teaches: PrincipleId[]`) and rendered in
the debrief + codex.

---

## 2. ACT STRUCTURE — six chapters

| Ch | District | Target | Act | The reveal |
|----|----------|--------|-----|------------|
| 1 | Marlowe's Docks | **Ricci** (collector) | I — Revenge | You think it's personal. Sal's ledger hints at phantom freight. |
| 2 | DeLuca's District | **DeLuca** (district boss) | I — Revenge | DeLuca, falling, lets slip the cargo is real & ongoing — "you think this is about *you*?" |
| 3 | The Waterfront Union | **Kastner** (union boss) | II — Widening | You find the cargo: what moves, and that men die moving it. First recurring-ally death possible. |
| 4 | The Cassar Bank | **Cassar** (banker) | II — Widening | Where it's laundered — and that the partners are upriver, federal-scale. A betrayal lands. |
| 5 | The Hall (law/politics) | **Commissioner Vane** | III — Summit | The full picture: your father's death was *ordered from here*. You're now the cold man. |
| 6 | Marlowe's House | **Marlowe** | III — Summit | The summit, earned. Take it (become him) or burn it (lose everything, truth out). |

Each chapter ≈ **50–60 min**: a district board + **4–5 prep missions** + **1–2
confrontations** + **story interludes** (short played cutscenes on chapter
transitions and after key deaths/betrayals). 6 × ~55 min ≈ **5.5 hours.**

---

## 3. RECURRING CAST — the who-lives-who-dies web

Depth comes from people who **return across chapters** and can be lost. Each has a
**bond** (0–4) and a **fate** decided by your play.

- **Sal** (Ch1) — mole → returns Ch3/4 feeding you the phantom manifests. **Can die
  in Act II** if heat is high (Ricci's remnants or Marlowe's audit reach him) — a
  gut-punch that removes his intel. Burned in Ch1 → already gone/hostile.
- **Bianchi** (Ch1) — takes Ricci's territory in Ch2, becomes a **power** in Act II:
  uneasy ally *or* the knife that betrays you in Ch4 (canon danger). The biggest
  swing character.
- **Pip & the crew** (Ch1) — goodwill → Pip grows into a loyal soldier across the
  game, **or dies for you** in Act II if you spend the crew recklessly.
- **Ricci** (Ch1 target) — if turned to a mole, reappears as your inside man on the
  climb; the mirror in the flesh. If broken/killed, his ghost haunts the theme.
- **DeLuca** (Ch2 target) — the thread to Act II.
- **New Act II** — **Vera**, a nightclub owner/fixer who bridges the docks and the
  upriver men: a morally-grey recurring ally, possible loss, the human cost.
- **Act III** — **Commissioner Vane** (Ch5), **Marlowe** (Ch6).
- **Your father's ghost** — the honest ledger + the watch: motifs that recur and
  decode the conspiracy.

A persisted **"who-lived" ledger** (see §5) gates which allies/missions exist in
later chapters and colors the finale.

---

## 4. CAMPAIGN SYSTEMS — depth + replay (engine work)

These are new mechanics, built **before** the content that uses them.

1. **MONEY** — a campaign purse. Earn from deals/skims/leverage; spend on bribes,
   information, muscle, and **keeping allies safe** (pay to shield Sal/Pip from a
   coming purge). Scarcity forces real choices. `BoardState.money`,
   `MissionOutcome.moneyDelta`, board-action costs.
2. **FACTION STANDING** — per-district standing (0–4). High = a faction aids you;
   low = they move against you next chapter. Carries across the campaign.
3. **HEAT** — already built (0–10, carries across chapters). Extend: heat ≥ 8 in a
   chapter can **kill a recurring ally** in the interlude. Wrong reads now cost
   lives, not just a forewarned target.
4. **BONDS** — per recurring character (0–4). Rises with loyal treatment, falls with
   cold use. Low bond + high heat = that character's death/betrayal fires.
5. **PERSISTENT CONSEQUENCE LEDGER** — a campaign-wide flag set (extends the existing
   `flags`/`worldFlags`) recording who was turned/burned/killed/bought. Gates later
   missions, alters interludes, and drives the finale's who-died roll-call.

Engine touch-points: `domain/board.ts` (BoardState fields, initBoard carry,
applyMissionOutcome deltas), `domain/campaign.ts` (NEW — the persistent ledger +
bond/faction/money reducers, pure + tested), `app/game.ts` (chapter chain carries
the ledger; interludes fire on transition).

---

## 5. MISSION DEPTH MODEL — multi-scene missions

Current missions are one branching scene. Deep missions chain **linked scenes** so a
mission is a mini-story (~12–20 min each) AND a lesson, using the existing Mission
engine (each scene is a `Mission`; an outcome hands off to the next scene):

1. **THE READ** — the core learning phase: deduce the mark's hidden attributes
   (type / interest / tell / BATNA / a lie) from observable behavior. Your read
   gates and cheapens the right lever in the approach; a misread makes it cost you.
   This is where "read a person or situation" lives. (Revives the retired recon/
   dossier loop, now as the pedagogical spine.)
2. **APPROACH** — the meet/manipulation (branching). Here you *practice* the
   mission's principle; the right read + right lever lands, the wrong one backfires.
3. **COMPLICATION** — a mid-mission turn: an interruption, a double-cross, a moral
   cost, a choice under pressure. The scene *turns* — teaches adaptation, not a
   memorized script.
4. **FALLOUT + DEBRIEF** — outcome + ripple + bond/faction/money/heat deltas +
   consequence-ledger writes, closing on the **two-layer teaching beat**: the plain
   model of what you just did, then its named principle (§1.5). This is the payoff
   of the lesson, in the MC's own voice.

Majors get all four; minors get read+approach+debrief. Engine: a `MissionChain`
(ordered `Mission[]` with outcome→next wiring) run by a small extension to
`app/mission.ts`; `Mission.teaches` links the principle(s) for the debrief + codex.

---

## 6. PROLOGUE + CHAPTER 1 ENRICHMENT (the "from the beginning" work)

- **Prologue** — bring to the new density/detail bar (per-beat panels, already the
  standard) AND **plant the conspiracy seed**: a beat where young-you notices your
  father poring over freight books late, uneasy — "these numbers don't move like
  cargo moves" — so the phantom-manifest thread is seeded before you can read it.
- **Chapter 1** — deepen: keep Sal/Crew/Bianchi, add **2 new prep nodes** (e.g. a
  dockside priest-fence who launders small; Ricci's runner who can be flipped),
  convert the majors to the **multi-scene depth model**, wire **money/bond/faction**,
  and make Sal's mole ledger explicitly the **first decoded phantom manifest**
  (the hook into Act II). Then the Ricci confrontation as today, enriched.

---

## 7. BUILD ORDER

1. **Engine wave** — the foundation for a learning-centric thriller, no content yet:
   - `domain/campaign.ts` — money / faction / bond / persistent consequence-ledger
     (pure reducers + tests).
   - `domain/principle.ts` — the `Principle` registry + `Mission.teaches` hook, for
     debrief + codex.
   - **THE READ** — a small deduction model (mark hidden attributes + observable
     clues + a read-check that gates/cheapens levers). Pure + tested.
   - BoardState + applyMissionOutcome extensions (money/bond/faction/heat deltas +
     ledger writes); `MissionChain` runner (read→approach→complication→debrief);
     interlude hook on chapter transition.
   Verify with unit tests. This wave is content-agnostic and unblocks everything.
2. **Story bible v2** — rewrite `docs/story-bible.md` from this spec (full cast,
   conspiracy, per-chapter arcs) as the reference for all content agents.
3. **Chapter waves, from the beginning** — Prologue+Ch1 → Ch2 → Ch3 → Ch4 → Ch5 →
   Ch6. Each wave: content (missions + confrontation + interludes) built by parallel
   subagents copying the Sal exemplar, art via the CF pipeline, wired + built +
   **Samar plays it** before the next wave. Lock, then advance.

Playtest via the existing `?m=<id>` shortcut + `?ch<n>` chapter shortcuts.

---

## 8. OPEN CHOICES FOR SAMAR (confirm on review)

1. **The conspiracy's nature** — war-surplus smuggling protected by upriver power
   (chosen), or swap to: a murder Tomas witnessed / stolen federal gold / a
   trafficking pipeline / a blackmail ring?
2. **Tone of the finale** — is "become Marlowe (take it) vs burn it all (lose
   everyone, truth out)" still the two poles, or add a third (walk away / hand it
   to the law)?
3. **Death stakes** — OK for recurring allies (Sal, Pip, Vera) to *permanently die*
   from your choices, or keep everyone survivable (softer)?
4. **Length target** — 6 chapters ≈ 5.5 hrs. Fewer, deeper chapters, or this
   breadth?

---

## Non-goals
- No engine rewrite — extends the current board + mission engine.
- No new art pipeline — the CF FLUX-schnell per-beat panel system stays.
- No online/multiplayer — fully offline Android, free tools only.
