# Negotiator (Noir reboot) — Manipulation-Duel Vertical Slice (Design)

**Date:** 2026-07-15
**Status:** Approved design, pre-plan
**Repo:** github.com/SamarS1ngh/negotiator-noir
**Supersedes:** the entire Flutter build (`the-negotiator`) and the Godot-3D experiment (`negotiator-3d`) as the *game*. The negotiation-engine *logic* from the Flutter build is reused (ported), not the code.

---

## 1. The vision (the whole game, in brief)

A **manipulation duel** game. You sit across a table from one person and **read, break, scheme, and manipulate** them — reading their mood, deducing their hidden agenda, finding and pressing their personality levers — to make them fold, cave, deal, or flip. It is wrapped in a **noir crime story** with a clear **end goal** (climb the Old Docks underworld to reach Marlowe, the man who took everything). Duels are the beating heart; the story is the frame and the pull.

**Core feeling (locked with the player):** the duel itself — psychological tension + cold scheming. Mostly calculated and calm, punctuated by **hot pressure-spikes** where a tell cracks and you have one beat to pounce.

## 2. Why this reboot exists (the lesson, so we don't repeat it)

Every prior build (webtoon comic, cinematic Flutter slice, Godot 3D figures) collapsed into the same failure: **it read as a comic you tap through plus a shallow slider-menu negotiation.** Two root causes, both fixed here:

1. **The doing was a menu.** The negotiation was a slider + buttons + a bar. → Fixed by the **deep opponent brain** (§6) and the **two-layer read-and-gamble move** (§7): every choice is a read, not a labeled button.
2. **The stack fought the game.** Flutter is a UI toolkit forced to act like a game engine. → Fixed by building in **web tech** (§10), which the approved mockups already prove nails the look effortlessly.

**Hard rule going forward:** prove the core in ONE duel before building any campaign. No whole-game build on faith.

## 3. Scope of THIS spec: the single-duel vertical slice

This spec covers **one complete duel**, end to end, and nothing else. It is the first sub-project. If it lands, later specs add the climb, the cast, and the story.

**In scope:**
- One fully-modelled opponent (the **collector**, "Salvatore Ricci" — a debt confrontation).
- The three duel screens, real and interactive: **the duel** (your move), **a hot-spike** (a tell, one beat), **the aftermath** (outcome + how you read them + roads not taken).
- The opponent brain (§6) fully simulated for this one opponent: type, hidden agenda, mood/composure.
- The two-layer move (§7): pick angle → pick words, with risk reads and hidden effects.
- The real look: glossy cel manhwa-noir (§9), this opponent's lighting palette driving the UI accent, an emoting face (§9.1).
- A real, installable **Android APK** (web wrapped via Capacitor), playable on the phone.

**Out of scope (later sub-projects):** the climb/campaign map, multiple opponents, story chapters/cinematics, save/progression, audio library, the Sin-City reserve style, tutorial/onboarding, settings, monetization.

## 4. Success criterion (the only one that matters)

The player plays this one duel on their phone and it **feels like a game** — tense, deep, alive, cinematic, consequential — matching the promise of the approved mockups. Specifically: choices feel like *reads and gambles*, not menu clicks; the opponent feels like a mind being worked; the hot-spike spikes; the aftermath makes them want to replay the read. If it lands → build outward. If it still feels flat → the problem is deeper than presentation and we rethink before investing further.

## 5. The core loop (one turn of a duel)

1. **Read.** The opponent fills the screen (emoting face), his last line shown with subtext. Three things are hidden: his **mood**, his **type**, his **agenda**. A composure read and any active **tell** are visible.
2. **Your move — cold phase (no clock):**
   a. Pick an **angle** — *Lean · Flatter · Plant doubt · Bluff · Offer a way out* (the set is fixed for the slice; see §7).
   b. Pick the **words** — 2–3 specific lines under that angle, each a gambit. Each line shows a **risk read** (safe / uncertain / high) but **never the exact effect**.
3. **Resolve.** His face shifts live; his reply carries subtext. The move's effect on mood + info leaked is computed by the opponent brain (§6). Right lever for his type → progress + a leak that narrows his agenda. Wrong lever → backfire + a hit to *your* composure.
4. **Hot-spike (conditional).** When his composure crosses a crack threshold, a **tell fires** (§8): a one-beat prompt to *press it* (big payoff) or *let it pass* (safe). This is the only timed moment.
5. **Repeat** until an end state: he **breaks / caves / deals** (win variants) — or you overplay and he **walks / turns** (loss variants). Every line spent costs composure; you cannot brute-force.

## 6. The opponent brain (the anti-menu engine)

Each opponent is three interlocking hidden systems. The math foundation **ports the proven Flutter negotiation engine** (personalities × tactics matrix, mood/patience/composure economy, reciprocity, ZOPA-style scoring) — that logic was never the problem and is stack-agnostic.

- **Type** (one of: `proud`, `greedy`, `scared`, `believer`, `pro`). A matrix maps each `angle × type` to an effect band: *lands* (mood + agenda-leak), *neutral*, or *backfires* (mood swing + your composure cost). Flatter `proud` → lands; flatter `scared` → backfires (smells a con). The player deduces the type by watching which angles land.
- **Agenda** — hidden fields: a real **bottom line**, a **fear**, and a **lie**. Not directly shown. Landing moves and tells **leak** these progressively (a "known %" per field). Once a field is known, angles that target it get a bonus (aiming). For the collector: bottom-line = *he'll settle for less than the full debt if his own boss stays unaware*; fear = *his boss finding out he's freelancing this*; lie = *that the full sum is non-negotiable*.
- **Mood / composure** — two live meters: **his composure** (0–100; crosses thresholds → tells → break) and **your composure** (a spend budget; backfires drain it; hits 0 → you crack and he gains the upper hand / walks). Reciprocity rule (ported): he only gives ground when you actually move him; repeating a spent angle burns extra and yields nothing.

**End states:** `folded` (broke — best), `dealt` (caved to terms), `walked` (you overplayed — he leaves), `turned-on-you` (worst — he flips the power). The debt economy ports from the Flutter build (collector = debt: winning costs *less*, caving costs the full sum).

**Determinism:** all of §6 is pure logic (no rendering), seedable, and unit-testable in isolation.

## 7. The player's move (two layers, read-and-gamble)

- **Layer 1 — angle:** a fixed set for the slice: `Lean`, `Flatter`, `Plant doubt`, `Bluff`, `Offer a way out`. Selecting one reveals its words.
- **Layer 2 — words:** 2–3 authored lines per angle, each carrying subtext. Each shows a **risk read** — `safe` / `uncertain` / `high` — derived from the brain's current confidence given what's known, but **the exact outcome is hidden**. Saying it is the gamble.
- Effects are computed by §6, not shown as numbers pre-commit. Post-resolve, the face + reply + meter movement communicate what happened.
- This two-layer, hidden-effect structure is *the* fix for "it's a menu": you are betting on your read, not picking a labeled option.

## 8. Hot-spikes & tells

- Fired when his composure crosses a crack threshold (or on a strong landing move).
- Presented as a **burst**: a large TELL over his face + a one-line read ("his eyes cut to the door — he's ready to run") + a **one-beat** prompt: `PRESS IT` (targeted follow-up, big mood/agenda payoff, small risk) vs `let it pass` (safe, no gain).
- The only timed element. A short window; letting the window lapse = "let it pass" (never a punishment beyond the missed opportunity, to keep it tense-not-stressful for the slice).

### 8.1 The aftermath (duel end screen)
When the duel reaches an end state, a cinematic card (see the approved `screen_aftermath` mockup) shows: the **outcome headline** (`HE FOLDED` / `HE WALKED` / etc.), **what you walked away with** (debt cleared, intel gained — driven by the end state + the debt economy), **how you broke him** (a plain-language read named back to the player: which type you read, which levers you used, the tell you caught), and **roads not taken** (ghosted: agenda fields you never learned, a better approach you missed — the replay pull). For the slice it ends with a single `CONTINUE` (no campaign yet); a subtle "goal is closer" flavor line is allowed but non-functional.

## 9. Look & art direction (locked)

- **Everyday finish: glossy cel manhwa-noir** (style board #2) — smooth premium cel rendering, crisp clean edges, sharp expressive eyes, dramatic noir lighting. **Not** painterly/watercolor (a rejected earlier failure).
- **Per-opponent lighting is a system:** each opponent owns a color palette (the collector = crimson). It drives the room light AND the UI accent (tell chip, meters, active angle) so the whole screen *feels* like that person.
- **Reserve style (noted, out of slice scope):** Sin City B&W + single red for heavy story beats later.
- Pipeline: the free Pollinations Flux pipeline (proven), glossy-cel style phrase, locked per-character seed for identity across moods.

### 9.1 The emoting face (how "alive" is achieved in the slice)
- **Expression-state art, not a full rig (for the slice):** generate the opponent in a small set of mood states (e.g., `guarded`, `rattled`, `angry`, `cornered`, `folding`) on a locked seed, glossy-cel. Cross-fade between states on mood change; overlay a **tell animation** (e.g., a flicker/emphasis) on spikes; add subtle **idle motion** (slow breathing / a faint parallax push) so it's never a dead still.
- **Rive (rigged 2D face) is noted as a future upgrade** for richer live emotion; not required to prove the slice.

## 10. Tech & architecture

- **Stack:** Web — **TypeScript + Vite**. Presentation in HTML/CSS (the approved mockups are literally this) + a small amount of JS for animation/state. **Capacitor** wraps it into an installable Android APK. Fully offline, all free/open-source.
- **Clean separation (the discipline that survives from the old build):**
  - `src/domain/` — the opponent brain (§6): pure TypeScript, zero DOM, fully unit-tested, seedable/deterministic. This is the ported negotiation engine.
  - `src/content/` — authored data: the opponent definition (type, agenda, mood params), angles, lines, mood-state art references. JSON/TS data.
  - `src/ui/` — the screens (duel / spike / aftermath), rendering domain state; the cinematic CSS; the face component (expression-state cross-fade + idle motion + tell overlay).
  - `src/app/` — wiring, the duel controller (walks a duel: read → move → resolve → spike? → repeat → end), Capacitor shell.
- **Character animation:** expression-state cross-fade + CSS/JS micro-motion (§9.1). Optional Rive runtime later.
- **Delivery:** build APK locally (Capacitor) and ship via GitHub release — the proven channel (the player installs from the release; they are not on the dev machine).

## 11. Data model (slice)

- **Opponent** `{ id, name, role, type, palette, moodStart, composureStart, agenda:{bottomLine, fear, lie}, art:{ seed, states:{guarded,rattled,angry,cornered,folding} } }`
- **Angle** `{ id, label }` (the fixed five).
- **Line** `{ id, angleId, text, targets? (agenda field it aims at), tone }` — 2–3 per angle. Risk read is *computed*, not stored.
- **Duel state** `{ his composure, your composure, mood, known:{bottomLine%, fear%, lie%}, spentAngles, log[] }`.
- The `angle × type` effect matrix + reciprocity + leak rules live in `src/domain/`.

## 12. Testing approach

- **Unit tests (`src/domain/`, Vitest):** the effect matrix (each angle × type band), reciprocity (repeat-angle penalty, only-concede-on-real-movement), agenda-leak progression, composure thresholds → tell firing, end-state transitions (fold/deal/walk/turn), the debt economy math. Deterministic via a seed.
- **UI:** light component tests for the duel controller wiring (state → screen); the *feel* is not unit-testable.
- **The one judgment that matters** — *does the duel feel like a game* — is the player's manual play of the APK. That verdict gates whether the pattern expands.

## 13. The decision this slice unblocks

If the one duel feels alive: build outward — the climb map, the full cast (each an opponent brain instance + art), the story chapters, the Sin-City reserve beats, save/progression. If it still feels flat with the deep brain + real look + right stack: the problem is deeper than any of those, and we rethink the genre before investing — but we'll know from one duel, not another whole build.
