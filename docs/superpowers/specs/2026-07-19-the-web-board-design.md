# The Web — scheming board over the deal (design)

**Date:** 2026-07-19
**Adds the meta-layer** the r/gamingsuggestions + r/gamedesign threads pointed to: you're the underdog, you can't fight Marlowe head-on, so you work the WEB of people around him. The deal (v0.9.0) stays as the engine; the board is the game around it.

## Core loop

`BOARD (work the people — limited moves) → SIT DOWN (the deal, its difficulty set by your prep) → OUTCOME → BOARD (rewritten by what you did)`

The board is the PREP and the payoff. Recon was the baby version; now you play people, and every deal moves the pieces.

## The board (Chapter 1 — Marlowe's operation)

Nodes (portraits) + edges (how they feel about each other — your weapons):
- **you** (center, display)
- **Ricci** — the collector, the deal target. Skims. Fears Marlowe.
- **Sal** — bookkeeper, hates Ricci, wants out safe.
- **Crew** — dock loaders, loyal to whoever's winning.
- **Bianchi** — rival collector, envies Ricci.
- **Marlowe** — the boss. Locked until you break Ricci.

Edges: Sal→hates→Ricci · Crew→fears→Ricci · Ricci→fears→Marlowe · Bianchi→envies→Ricci · Marlowe→trusts→Ricci.
Per node: your **disposition** (Enemy 0 → Ally 4).

## Actions (moves budget = 3; more actions than moves → you choose your angle)

Each spends a move, sets flags, may shift a disposition, prints a one-line result.
- **Sal — "Promise him a way out"** → flag `skim` (you hold the skim ledger). Sal disp +2.
- **Crew — "Spook them"** (rumor Marlowe's cleaning house) → flag `crewSpooked`.
- **Crew — "Bribe a loader for the manifests"** → flag `ledger` (the second ledger).
- **Ricci — "Study him"** → flag `type` (you learn he's proud).
- **Bianchi — "Tip him that Ricci skims"** → flag `bianchiPressing`. Bianchi disp +1.

## Prep → deal (domain/board.ts, pure + tested)

`dealPrep(flags)` →
- `skim` → intel `lev:skims`; `ledger` → `lev:ledger`; `type` → `type` (these are the leverage cards + read you carry into the deal, exactly what the deal already consumes).
- `crewSpooked` → `startComposureLost += 12` (he sits down already rattled).
- `bianchiPressing` → `thresholdDelta -= 0.4` (he wants to close before Bianchi moves).
- `marloweSuspicious` → `startComposureLost += 10`.

So working the web literally cracks his hardlines before you speak. Walk in cold (no prep) → the deal is brutal.

## Deal → board (the ripple)

The deal outcome rewrites the board:
- Got the **name** → **Marlowe unlocks**; chapter progresses.
- **face = humiliated** → Ricci → Enemy. **face = saving** → Ricci → Ally (a mole).
- **walked / bad grade** → Ricci wary/enemy, no unlock.

`startDeal` gains an optional `prep` ({ intel, startComposureLost, patienceDelta, thresholdDelta }) and its `onDone` reports the outcome ({ closed, grade, faceIdx, gotName }) so the board can apply it.

## UI

`board.ts` — the web: node portraits laid out with edges drawn between them, your disposition ring per node, moves-left pips, tap a node → its action sheet. A **SIT DOWN WITH RICCI** button. Reuse `dealsheet`/`dealoutcome`. Noir styling.

## Scope (the slice)

One chapter, 5 nodes, 5 actions / 3 moves, the one Ricci deal whose difficulty is set by prep and whose outcome rewrites the board (Ricci's disposition + Marlowe unlock). Prove: **web-prep changes the deal, the deal changes the board.** Campaign = more nodes later.

## Verify

vitest (actions set flags/disposition; dealPrep derives right; a no-prep deal is much harder than a full-prep deal; outcome writeback) · tsc · build · play board→deal→board on device.
