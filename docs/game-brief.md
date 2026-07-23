# The Negotiator — Game Brief (for design consultation)

*A self-contained description of a mobile game, written so an outside advisor can
give feedback on the design question at the end.*

---

## One line

A noir mobile game where you climb a 1940s crime empire by **reading and
manipulating people** — and, underneath the story, it's secretly a **teaching
engine**: every mission drills a real principle of negotiation, psychology, and
power, so the player actually gets better at it.

## What it is

- **Genre:** narrative/choice game — think *Reigns* × *Ace Attorney* × a visual
  novel, with a manhwa (Korean webtoon) art style.
- **The hook / twist:** it looks like a revenge story, but the real purpose is
  **learning**. Reading people, negotiation tactics, scheming, economics, power
  politics. Every scene teaches a real, named principle (positions vs interests,
  BATNA, loss aversion, triangulation, moral hazard, plausible deniability, the
  prisoner's dilemma, etc.), taught in **two layers**: first a plain everyday
  mental model, then the real jargon named and anchored to it.
- **Player fantasy:** you're the underdog. You can't fight the empire head-on, so
  you turn its own people against each other and climb, one rung at a time.

## Story spine

You play **Cass Vidal**, whose father — a small, honest freight dealer — was
destroyed by a crime empire that "broke his name" (spread lies he'd cheated
people) rather than just collect his debt. The father killed himself; Cass was
away. Cass returns and climbs the empire to take it apart.

The twist that carries the whole campaign: **it was never personal.** His father
wasn't just a debtor — he was a *witness*. The empire is a front over an invisible
smuggling pipeline protected by powerful men "upriver" (a commissioner, a
senator). Cass decodes this a rung at a time: the cargo → the money → the
protection → the man at the top. The recurring theme is a **mirror** — to take the
empire apart, Cass has to become the kind of cold, manipulative man who built it.

## Structure

- **6 chapters**, each a district with its own cast: Docks → DeLuca's District →
  Waterfront Union → the Bank → the Hall (law/politics) → Marlowe (the top).
- **~21 "prep" missions** (turn/read individual characters) + **6 boss
  "confrontations"** (a high-stakes sit-down negotiation) + a played prologue.
- Roughly **5–6 hours** of content. Every dialogue beat has its own illustrated
  manhwa panel (~650 panels total).

## Core loop

1. **The board (a corkboard "web"):** each chapter is a map of people (pinned
   photos, red-string relationships). You pick who to work.
2. **A mission = a branching conversation.** Structure: **THE READ** (deduce the
   person's hidden type/motive/fear from observable behavior — this is the core
   skill) → **the approach** (pick your lever; the right read makes it land, a
   wrong read backfires) → **a complication** (a mid-scene twist under pressure) →
   **the outcome** (which rewrites the board) → **a debrief** (names the real
   principle you just used, two-layer).
3. **The confrontation:** once you've worked enough people, you sit down with the
   chapter's boss. What you did on the board changes the difficulty and options.
4. **Climb:** win the way up → next chapter.

## Key mechanics

- **The Read:** no "right answers" are labeled. You infer the person and choose;
  consequences teach you. This is the whole game.
- **Two-layer debrief:** each ending names the real concept ("giving him a
  face-saving exit is a **golden bridge**"), in the character's own voice.
- **Heat:** the only resource cost. Work as many people as you dare, but every
  botch raises heat; high heat forewarns bosses and can get your allies killed.
- **Campaign systems:** money, faction standing, **bonds** with recurring
  characters, and a persistent **"who-lived" ledger** — allies can permanently die
  or betray you based on how you played them; the finale reads the ledger.
- **Save/checkpoints, chapter replay, in-scene pause menu.**

## Presentation

- **Manhwa panel per dialogue beat** — the scene image changes with the words
  (like a webtoon), plus per-beat **mood color grading** (a scene re-lights cold
  blue for guilt, blood-red for a threat, warm gold for hope).
- **Dialogue** in sleek dark-glass speech panels tinted by the speaker's color.
- **Title screen** with a cyan-lightning hero shot of the protagonist; a
  **cinematic image-montage cold-open** (full-bleed images, one hard line each)
  before the played prologue.
- Fully offline, portrait phone game.

## Tech

TypeScript + Vite (no game engine — plain DOM/CSS), wrapped with Capacitor into an
Android APK. Art generated with an AI image model (FLUX) in a manhwa style. ~60 MB
app, currently at v2.0.3, playable start to finish.

---

## THE DESIGN QUESTION I want help with

The game is **very text-heavy** — it's dialogue-driven, and even after adding a
per-beat illustrated panel behind every line and a cinematic image-montage intro,
it can still *feel* like a lot of reading. Players may bounce off the wall of text,
especially in the opening minutes.

**How do I reduce the "too much text" feel and strengthen the visual hook —
without gutting the story or the teaching, which are the whole point?**

Specifically, I'd love concrete, prioritized ideas on:

1. **The opening 5–15 minutes** — what makes a narrative game *grab* fast when the
   core is reading? Structure, pacing, first-impression techniques.
2. **Reducing perceived text load per scene** — line length, chunking, what to cut
   vs. keep, letting the art carry meaning, when narration hurts.
3. **Visual/interaction techniques** that add life and cut the "reading a book"
   feel (motion, timed beats, reveals, micro-interactions) that are realistic for
   a plain-DOM/CSS mobile game (no heavy engine).
4. **Keeping the teaching intact** — the two-layer "name the principle" debriefs
   are the point; how do I keep them from reading as lectures?
5. Anything a strong narrative/UX designer would flag that I'm missing.

Constraints: solo dev, free tools only, portrait mobile, offline, manhwa art
style, must preserve the learning-through-manipulation core.
