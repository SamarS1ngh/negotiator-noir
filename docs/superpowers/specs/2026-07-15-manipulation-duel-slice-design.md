# Negotiator (Noir reboot) — Manipulation-Duel Vertical Slice (Design)

**Date:** 2026-07-15
**Status:** Approved design, pre-plan
**Repo:** github.com/SamarS1ngh/negotiator-noir
**Supersedes:** the entire Flutter build (`the-negotiator`) and the Godot-3D experiment (`negotiator-3d`) as the *game*. The negotiation-engine *logic* from the Flutter build is reused (ported), not the code.

---

## 1. The vision (the whole game, in brief)

A **manipulation duel** game. You sit across a table from one person and **work them like an interrogator** — reading their mood, deducing their hidden agenda, catching them in their lies, deploying what you've dug up, and pressing their personality levers — to make them fold, cave, deal, or flip. It is wrapped in a **noir crime story** with a clear **end goal** (climb the Old Docks underworld to reach Marlowe, the man who took everything). Duels are the beating heart; the story is the frame and the pull.

**Core feeling (locked with the player):** the duel itself — psychological tension + cold scheming. Mostly calculated and calm, punctuated by **hot pressure-spikes** where a tell cracks and you have one beat to pounce.

**Active, not passive (the decisive call):** the duel is NOT "read a line, pick a labeled option" — that surface is exactly what killed every prior build. It is an **active interrogation**: you make him talk, *catch his contradictions live*, *deploy hard leverage* to corner him, and *tap tells the instant they flash*. You are building a case against a mind, not clicking a menu. This is the single most important requirement in this document — if the choosing ever feels like a labeled menu, the design has failed.

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
- The opponent brain (§6) fully simulated for this one opponent: type, hidden agenda, mood/composure, **statements/lies, and leverage**.
- **All four player actions (§7): PROBE (angle → words, hidden effects), CATCH (the slice ships with at least 2 catchable contradictions — one vs a known fact, one vs an earlier statement), DEPLOY (at least 1 piece of leverage), PRESS TELL.** Plus the **Record** panel (§7.5) — the interrogation layer is the heart of the slice, not deferred.
- The real look: glossy cel manhwa-noir (§9), this opponent's lighting palette driving the UI accent, an emoting face (§9.1).
- A real, installable **Android APK** (web wrapped via Capacitor), playable on the phone.

**Out of scope (later sub-projects):** the climb/campaign map, multiple opponents, story chapters/cinematics, save/progression, audio library, the Sin-City reserve style, tutorial/onboarding, settings, monetization.

## 4. Success criterion (the only one that matters)

The player plays this one duel on their phone and it **feels like a game** — tense, deep, alive, cinematic, consequential — matching the promise of the approved mockups. Specifically: choices feel like *reads and gambles*, not menu clicks; the opponent feels like a mind being worked; the hot-spike spikes; the aftermath makes them want to replay the read. If it lands → build outward. If it still feels flat → the problem is deeper than presentation and we rethink before investing further.

## 5. The core loop (one turn of a duel) — active interrogation

You always have **four kinds of action**. The duel is you cycling through them to build a case and crack him. A **Record** (§7.5) tracks everything he's told you, the leverage you hold, and the contradictions still open to catch.

1. **Read.** He fills the screen (emoting face); his last line shows with subtext. Hidden: his **mood**, **type**, **agenda**. Visible: a composure read, the Record, any live **tell**.
2. **PROBE** *(your main verb — cold phase, no clock).* Pick an **angle** (*Lean · Flatter · Plant doubt · Bluff · Offer a way out*) → pick the **words** (2–3 loaded lines, each with a **risk read** but never an exact effect). Probing makes him **talk** — his reply is logged as a **statement** in the Record, moves his mood, and may leak agenda. Right lever for his type → progress; wrong lever → backfire + a hit to *your* composure. **Crucially, some of his statements are lies or contradict a known fact / an earlier statement** — that's what you're mining for.
3. **CATCH** *(reactive — the skill moment).* When a statement conflicts with your leverage or something he said earlier, a **catch opportunity** surfaces (subtle — you have to *notice* it in the Record/his line). Tap it → *"That's not what you said."* Corners him: big composure hit + an agenda leak. **Miss it** (don't spot it, or a spike passes) → the lie consolidates and he steadies.
4. **DEPLOY** *(spend hard leverage).* Play a concrete piece of leverage you hold to force a concession or shatter composure. Scarce — you don't hold many, so *when* you spend it is a real decision.
5. **PRESS TELL** *(real-time spike — the only clock).* When composure cracks, a **tell flashes** (§8): a one-beat window to exploit it (big payoff) or let it pass (safe).

**End states:** he **breaks / caves / deals** (wins) — or you burn your own composure with bad probes and missed catches until he **walks / turns it on you** (losses). Every action costs something; you cannot brute-force, and you cannot win on probing alone — catching and deploying are how you actually crack a guarded man.

## 6. The opponent brain (the anti-menu engine)

Each opponent is three interlocking hidden systems. The math foundation **ports the proven Flutter negotiation engine** (personalities × tactics matrix, mood/patience/composure economy, reciprocity, ZOPA-style scoring) — that logic was never the problem and is stack-agnostic.

- **Type** (one of: `proud`, `greedy`, `scared`, `believer`, `pro`). A matrix maps each `angle × type` to an effect band: *lands* (mood + agenda-leak), *neutral*, or *backfires* (mood swing + your composure cost). Flatter `proud` → lands; flatter `scared` → backfires (smells a con). The player deduces the type by watching which angles land.
- **Agenda** — hidden fields: a real **bottom line**, a **fear**, and a **lie**. Not directly shown. Landing moves and tells **leak** these progressively (a "known %" per field). Once a field is known, angles that target it get a bonus (aiming). For the collector: bottom-line = *he'll settle for less than the full debt if his own boss stays unaware*; fear = *his boss finding out he's freelancing this*; lie = *that the full sum is non-negotiable*.
- **Statements & lies** — as he talks (in response to probes), he emits **statements**. Each statement is either true, an evasion, or a **lie**, and may **contradict** a known fact (your leverage) or one of his **earlier statements**. Contradictions become **catchable** (§5.3): catching one is the highest-value action in the game — it directly cracks composure and forces an agenda leak. His willingness to lie, and how brittle those lies are, is a function of his type and current mood (a rattled `proud` man over-commits to a lie you can then catch; a `pro` says little and rarely slips). This system is what makes probing *matter*: you probe to make him talk so you can catch him.
- **Leverage** — hard facts/secrets you hold about him (you enter the duel with 1–2; more can be earned by catching him). **Deploying** leverage (§5.4) forces a concession or a composure break aimed at a specific agenda field. Scarce and powerful.
- **Mood / composure** — two live meters: **his composure** (0–100; crosses thresholds → tells → break) and **your composure** (a spend budget; backfires and missed catches drain it; hits 0 → you crack and he gains the upper hand / walks). Reciprocity rule (ported): he only gives ground when you actually move him; repeating a spent angle burns extra and yields nothing.

**End states:** `folded` (broke — best), `dealt` (caved to terms), `walked` (you overplayed — he leaves), `turned-on-you` (worst — he flips the power). The debt economy ports from the Flutter build (collector = debt: winning costs *less*, caving costs the full sum).

**Determinism:** all of §6 is pure logic (no rendering), seedable, and unit-testable in isolation.

## 7. The player's actions

The player never picks from a flat labeled menu. There are four distinct verbs, and the game is choosing *which verb, when*:

### 7.1 PROBE (two-layer read-and-gamble)
- **Layer 1 — angle:** a fixed set for the slice: `Lean`, `Flatter`, `Plant doubt`, `Bluff`, `Offer a way out`.
- **Layer 2 — words:** 2–3 authored lines per angle, each with subtext and a **risk read** (`safe` / `uncertain` / `high`) but **no exact effect shown**. Saying it is the gamble.
- A probe makes him respond → the reply is logged as a **statement** (§6), moves mood, may leak agenda. Effects computed by §6, communicated by face + reply + meters, never pre-shown as numbers.

### 7.2 CATCH (spot the contradiction)
- When a fresh statement conflicts with your leverage or an earlier statement, an **open contradiction** exists. The player must **notice and tap it** (on his line or in the Record) to catch him. Catching → *"That's not what you said"* → large composure hit + agenda leak. This is the highest-skill, highest-reward action. Unnoticed/late → it closes and he steadies.

### 7.3 DEPLOY (spend leverage)
- Play a held leverage card to force a concession / break composure on a targeted agenda field. Scarce; timing is the decision.

### 7.4 PRESS TELL (real-time)
- On a spike, tap within the one-beat window to exploit the tell (§8).

### 7.5 The Record (the case you're building)
- A always-available panel showing: **what he's told you** (his logged statements), **the leverage you hold**, **agenda fields** and how much of each you've deduced (known %), and **open contradictions** available to catch. The Record is how CATCH is even possible — the player reads it against his live line. It replaces the old numeric HUD with a *case file*, which is diegetic and reinforces "interrogator, not menu-clicker."

**Why this is not a menu:** you are choosing among four verbs against a mind whose truth is hidden — probing to make him slip, watching for the slip, spending scarce leverage at the right moment, and reacting to tells in real time. The effects are hidden, the contradictions must be *noticed*, and the win comes from out-reading a person, not selecting the highest-value button.

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

### 9.2 UI note — the interrogation layer on screen
The approved duel mockup (`screen_aftermath`, `duel_screen`, etc.) covers PROBE. The interrogation layer adds two UI elements the plan must design (extending, not replacing, the approved look):
- **The Record** (§7.5) — a case-file drawer/panel: his logged statements, your leverage, agenda %s, and open contradictions. Pulled up over the duel; styled to the noir look.
- **The CATCH affordance** — when a contradiction is open, his line (and the matching Record entry) become *tappable* with a subtle crimson glint the player must notice; tapping triggers the *"That's not what you said"* moment. DEPLOY is a distinct action (play a leverage card). These get their own mockups before/during implementation.

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
- **Statement** `{ id, text, truth: true|evasion|lie, contradicts?: (a leverageId or an earlier statementId) }` — emitted by the opponent in response to probes (which line he gives is chosen by the brain from his mood/type/what's been asked).
- **Leverage** `{ id, label, text, targets: agendaField, heldAtStart: bool }` — hard facts you can DEPLOY; some earned by catching.
- **Duel state** `{ hisComposure, yourComposure, mood, known:{bottomLine%, fear%, lie%}, spentAngles, record:{ statements[], heldLeverage[], openContradictions[] }, log[] }`.
- The `angle × type` effect matrix + reciprocity + leak rules + **contradiction detection (statement vs leverage / vs prior statement) and catch resolution** live in `src/domain/`.

## 12. Testing approach

- **Unit tests (`src/domain/`, Vitest):** the effect matrix (each angle × type band), reciprocity (repeat-angle penalty, only-concede-on-real-movement), agenda-leak progression, **contradiction detection (a statement that conflicts with held leverage, and one that conflicts with an earlier statement, both register as catchable)**, **catch resolution (composure hit + forced leak) vs missed-catch consolidation (the lie steadies)**, **deploy effects (leverage forces the targeted concession/break)**, composure thresholds → tell firing, end-state transitions (fold/deal/walk/turn), the debt economy math. Deterministic via a seed.
- **UI:** light component tests for the duel controller wiring (state → screen); the *feel* is not unit-testable.
- **The one judgment that matters** — *does the duel feel like a game* — is the player's manual play of the APK. That verdict gates whether the pattern expands.

## 13. The decision this slice unblocks

If the one duel feels alive: build outward — the climb map, the full cast (each an opponent brain instance + art), the story chapters, the Sin-City reserve beats, save/progression. If it still feels flat with the deep brain + real look + right stack: the problem is deeper than any of those, and we rethink the genre before investing — but we'll know from one duel, not another whole build.
