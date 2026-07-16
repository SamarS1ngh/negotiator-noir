# The Negotiator — Cinematic Manipulation Duel (design)

**Date:** 2026-07-16
**Supersedes the interaction model of:** 2026-07-15-manipulation-duel-slice-design.md (the engine + content survive; the dial/reads/record UI is retired).

## Why this exists

v0.3.x delivered the duel as a control panel: an angle **dial**, floating jargon **reads** (face / subtext / tell), a hidden composure number, and a separate **Record** drawer for catch / deploy / leverage. Samar played it and couldn't tell what to do; it didn't feel like a game. Direction locked with him: **cinematic & dramatic** (Detroit: Become Human / Telltale feel) — but every choice is still a **manipulation move**. Deliver the existing manipulation depth as a *lived scene*, not a panel.

## The core loop — one beat

1. **His portrait** (existing at-the-table mood art) fills the screen, lit per mood.
2. **His line** types out (JetBrains Mono), prominent, bottom-centre — like a VN / Detroit dialogue line.
3. A **read** may surface inline just under his line — what *you* notice (a tell, a tension), in plain language, one line. Not a labelled box.
4. His **NERVE** is shown simply: a word + a thin cracking bar — `steady → shaken → rattled → cornered → breaking`. (This IS engine composure; no raw "composure 86" up front.)
5. **Your move:** 2–4 choice buttons, each a concrete manipulation *line*, with a small intent tag: `flatter · press · doubt · bluff · offer`. The choice IS the line — no "pick an angle then pick words" indirection.
6. **Charged choices appear inline, only when live:**
   - ⚡ `"That's not what you said."` — a contradiction opened (= catch).
   - ▸ `"Use what you know: he skims."` — held leverage (= deploy).
   - a one-shot **press** when a tell cracks.
   These sit among the normal choices, visually hot — the manipulation *opportunity*, in the moment.
7. **Pick → resolve:** your line plays briefly → his reaction types out → nerve shifts (animated) → a new read may surface → next beat.
8. **Break:** nerve hits 0 → he folds cinematically, admits the debt is invented, **names Marlowe** (reuse `breakReveal` + aftermath).

## Gone (folded into the scene)

The dial, the floating side-read jargon boxes, the separate Record drawer, and the standalone catch / deploy / spike screens. All become **inline choices + inline reaction beats** in the one conversation.

## Reuse unchanged

- **Domain engine** — `initDuel`, `apply` (probe / catch / deploy / pressTell / walk), `riskOf`, `moodFor`, outcome, tells, agenda, leverage. The brain was never the problem.
- **Content** — COLLECTOR (agenda, objective, expressions, tell, breakReveal) + mood art (seed 501). COLLECTOR_SCRIPT lines / statements / leverage / contradictions.
- Fonts (Oswald + JetBrains Mono), Capacitor → Android APK pipeline.

## Reshape (small, content-side)

- `script.ts`: add **his opening line**; nothing else structural. Choice intent tags derive from `angleId` (lean→press, flatter, plant_doubt→doubt, bluff, offer_out→offer).
- Contradictions render as ⚡ inline crack choices; leverage as ▸ inline "use what you know" choices. Reaction copy reused from the old catch/deploy beats, shown **inline** as his reaction, not a screen.

## Understandable by construction

His line + labelled choices + a visible nerve gauge means there's nothing to "figure out". Light touches only: an opening steer ("Break his nerve. Every line you pick is a move — read him, work him."), and a one-time plain teach the first time a tell shows and the first time a crack opens.

## Slice scope

One Ricci duel, cinematic style, playable start → fold, installable APK. Prove the FEEL before any campaign. No new opponents, no map, no save.

## Verify

`npx vitest run` green · `npx tsc --noEmit` clean · `npm run build` clean · play a full duel to a fold in the browser AND on the emulator (1080×2400 class).
