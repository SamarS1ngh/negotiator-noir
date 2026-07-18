# The Deal — a real negotiation mechanic (design)

**Date:** 2026-07-18
**Replaces the CORE of every prior build.** Recon, the read-gate, the art/stage, and the aftermath survive. The "break his nerve to 0" duel (wheel + word modal + record) is retired — per the r/gamedesign thread Samar sent, that was a boss fight, not a negotiation.

## Why (from the thread)

Every version failed for the same reason: **it was never a negotiation.** It was one meter you grind to zero. The thread nails it:

- *"Complex negotiation isn't 'you want X, I want Y, now I persuade you' — that's haggling. It's 'you want X, Y, Z; I want A, B, C; I'll concede A and B if you give me Z, but can't budge on C.' The missing element is **assets/positions categorically different from one another, whose values are fuzzy and subject to change.**"*
- Deals are **packaged**: multiple terms you adjust, **counter-offers**, **limited rounds**, and *"the other party values one or two points more — that's what you focus on."*
- *"An outer loop can be finding out what the other party values."* (← this is recon.)
- Stakes are asymmetric (Griftlands): you're not just zeroing his HP; you both have things at risk.

## The core: a DEAL with TERMS

A negotiation is a **deal sheet** of terms. Each term has ordered positions from *his ideal* → *your ideal*. Both of you secretly weight the terms differently. You assemble a package; he reacts term-by-term, accepts, counters, or walks. You win by trading what's **cheap to you** for what's **dear to you**.

### Ricci's deal (the slice)

Positions listed his-ideal → your-ideal. `hisW` = how hard he resists conceding it. `youV` = how much the outcome is worth to YOU.

| Term | Positions | hisW | youV |
|---|---|---|---|
| **debt** | full · half · nothing · he pays you | 2 | 2 |
| **name** | never says it · hints · names Marlowe | 3 | 3 (highest — your story) |
| **face** | humiliated · neutral · saves face | 2 | 0 (you don't care) |
| **paper** | debt paper stands · torn up | 1 | 2 |

His true priority order (what recon reveals): **fear(name/skim) > money(debt) > pride(face) > paper.** His FEAR is the skim — leverage `skims` attached to a term neutralises his resistance there, because exposing him to Marlowe is worse than conceding.

**The winning trade:** give him *saves face* (youV 0 → free to you, +2 to him) and maybe *half* the debt (small give) to **bank goodwill**; push *names Marlowe* backed by the skim leverage (leverage covers his W3) and *paper torn* (W1, easy). You walk out with the name + debt dead, having given up only pride and half the money. That is a negotiation.

**Losing plays:** push the name with no leverage → he refuses (W3 loss) and walks. Pay full + let him keep everything → a "deal" that got you nothing (F grade = you lost).

## Evaluation (domain/deal.ts, pure + tested)

Given your offer (a position index per term) and any leverage attached:

- `netToHim = Σ_terms concession(term) × effectiveW(term)`, where
  - `concession(term) = (hisIdeal_dist − yourOffer_dist)` … i.e. positive when you give him ground, negative when you take it. (Measured as steps toward/away from his ideal.)
  - `effectiveW(term) = max(0, hisW − leverageOn(term))` — leverage erodes his resistance.
- **He ACCEPTS** if `netToHim ≥ threshold`. Threshold starts high (he wants his ideal) and **relaxes each round** he stays + as his composure drops (pressure/time make him deal).
- **Otherwise he COUNTERS**: shifts the term(s) that hurt him most back toward his ideal by the shortfall, presents that as his offer; `patience−1`. You may accept his counter or re-propose.
- **He WALKS** if patience hits 0, or if a single term is pushed far past `hisW` with no leverage (a hard line crossed) — `end='walked'`, you get nothing / the debt stands.
- Each term also returns a **reaction** (`fine | resists | hardline`) so the UI can show, per term, how he took it — and the player LEARNS his weights by proposing.

Output: `{ verdict: 'accept'|'counter'|'walk', counter?: offer, netToHim, threshold, terms: {id, reaction}[] }`.

## How the existing systems finally matter

- **Recon** = the thread's outer loop: leads reveal his **weights/priorities** (which terms he's soft/hard on) and that the skim is his fear. No recon → you negotiate blind and burn rounds.
- **Read gate (what is he)** = proud → he won't take *humiliated* (raises face W, lowers walk threshold under insult). Type shapes his counters.
- **Leverage** = trump cards you attach to terms to shift what he'll accept.
- **His portrait/mood** = still cinematic: he reacts to each package (face shifts, a line), but the mechanic is the deal, not a health bar. Mood = f(how the deal is going for him).

## UI (dealsheet.ts) — the table

Full-bleed his portrait up top (reuse the stage). Below: **THE DEAL** — each term as a row: label, a small stepper/segmented control to set your position (his-ideal ← → your-ideal), his current stance shown, and a slot to **attach leverage**. A round indicator + his patience. **PROPOSE** sends the package. His reaction plays (per-term + a line), then either the deal closes, his counter appears (pre-filled, you adjust), or he warns/walks. No wheel, no word-modal.

## Aftermath

Grade the **closed deal** by `Σ youV × yourOffer_dist` (how much of what you wanted you got): S/A/B/C/F. Show the final terms, what you won, what you gave. A walk = you got nothing (debt stands). Reuse breakReveal only when you actually extracted the name.

## Scope

One target (Ricci), 4 terms, recon → read → deal → outcome. Prove the negotiation feels like a negotiation. No campaign, no 2nd target.

## Verify

vitest (deal evaluation: accept/counter/walk, leverage erodes resistance, the winning trade closes, blind pushes get refused) · tsc · build · play on-device.
