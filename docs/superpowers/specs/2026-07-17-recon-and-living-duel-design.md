# Recon phase + the living duel (design)

**Date:** 2026-07-17
**Builds on:** 2026-07-16-cinematic-manipulation-duel-design.md (the duel) — this adds the PREP phase before it and makes the opponent live.

## Why

The duel is now hard (v0.5.1) but Samar: "doesn't feel interactive enough — like I'm actually sitting in a negotiation, manipulating a person." Two gaps:
1. It's one-directional + static — you attack a defending dummy through a menu; he answers with a caption; nothing moves.
2. Leverage is handed to you. A real manipulator does homework first.

Fix both: a **RECON phase** where you dig up intel that becomes your hand, then a **living duel** where he pushes back, reacts physically, and you read him in the moment. This is the game-wide loop for every target in the story.

## The loop

`story → meet a target → RECON (dig up intel, limited digs) → NEGOTIATE (live duel using what you found) → outcome → story moves on`

The slice proves it on Ricci; every future target is just a new profile + lead set.

## Content model (additions)

Each opponent gains a **recon** block and a **pushes** list.

```
recon: {
  digs: 3,                    // how many leads you may chase
  leads: Lead[]               // more than `digs` — you choose which
}
Lead = { id, label, blurb, grants: IntelId, dossier: string }
IntelId = 'type' | 'tell' | 'lie' | `lev:${leverageId}`

pushes: Push[]                // his moves against YOU
Push = { id, line, options: PushOption[] }
PushOption = { text, kind: 'hold' | 'cave', reply, dossier? }
```

Ricci's 5 leads (pick 3):
- crew → `type` — "PROUD. Feed his ego — flatter, plant doubt. Never offer a proud man charity; it insults him."
- tail → `tell` — "His tell: his hand drifts to his watch when he's lying."
- bookkeeper → `lev:skims` — the skims-his-boss card
- shipping records → `lev:ledger` — the second-ledger card
- his file → `lie` — "His lie: the debt is invented. 'Non-negotiable' is a bluff — call it."

## What intel does in the duel (prep decides the fight)

- `lev:X` — that leverage is IN YOUR HAND (deployable). **Not found in recon → you don't have it.** (No finisher if you skipped both leverage leads → brutally hard.)
- `type` — a **dossier** line telling you his nature + which levers land. Skip it → you go in blind and must deduce from his dialogue.
- `tell` — dossier line naming his tell; the tell also **flashes live** on him in the duel.
- `lie` — dossier line: what he's lying about, so you know when to call him.

The **DOSSIER** (what you dug up) is shown at the duel's open and reachable via a button. It's your earned prep sheet — this is where "teaching" now comes from (earned, not spoon-fed). No recon → thin dossier → improvise.

`startDuel(root, opp, script, intel: Set<IntelId>, onDone)`. Leverage in `initDuel` is filtered to found `lev:` intel.

## The living duel (the 3 immersion upgrades)

**#1 He pushes back — it volleys.** Between your moves he sometimes makes a PLAY at you: an intimidation/demand line + 2-3 responses (`hold firm` / `give ground`). Hold right → you keep your nerve and he loses a little footing; cave/wrong → YOUR nerve drops and his confidence climbs. Triggers: once early (establish two-way), and after you misfire (he capitalizes). A handful, scripted. Now it's a duel of wills both directions.

**#2 He reacts with his body.** A `reaction` on the view drives a CSS animation on the stage:
- land a hit → a snap "flinch" (quick scale-in + shake on his portrait) + his expression cross-fades.
- he pushes you → "lean-in" (scale up / toward camera).
- backfire → he sits back (settle).
No new art — transforms on the existing mood images.

**#3 Read him live.** When a tell fires, it **flashes** on him (reuse `mountFace().flashTell`) — a beat to notice and pounce — instead of only a static caption.

## Screens

- **RECON board** (`src/ui/recon.ts`, `renderRecon`): objective + "who you're about to face", a grid of lead cards (`data-lead`), a digs counter, revealed dossier entries, and a `SIT DOWN` button (`data-sit`) enabled once you're out of digs or choose to go in. Picking a lead reveals its dossier and spends a dig.
- **DUEL** (existing scene) + a **dossier** affordance (`data-dossier`) opening a panel of found intel; + the reaction animations + tell flash + the his-push beat UI (his line + `data-push-option`).
- Aftermath unchanged.

## Flow / app entry

`main.ts` → recon controller: render recon → on SIT DOWN, collect intel set → startDuel(…, intel). Aftermath CONTINUE → (for the slice) restart recon or a simple end.

## Reuse / unchanged

Domain engine, outcome, the v0.5.1 nerve+patience economy in the duel controller, mood art, fonts, Capacitor pipeline. `endStateFor`, `moodFor`.

## Tests

- recon: renders leads; picking spends a dig; out of digs → no more picks; SIT DOWN yields the chosen intel set.
- duel: leverage present only for found `lev:` intel; a `lev` NOT found → no deploy choice for it; dossier lists found intel.
- volley: a push renders his line + options; `hold` vs `cave` move the right nerve.
- the v0.5.1 win/lose lines still hold (with full intel).
- reaction/flash are animation-only (gated so tests stay synchronous).

## Verify

`npx vitest run` green · `npx tsc --noEmit` clean · `npm run build` clean · play the full loop (recon → live duel → outcome) on the emulator; confirm skipping leverage in recon makes the duel much harder.

## Scope

One target (Ricci), full loop, installable APK. The mold for the campaign. No map/save/second target yet.
