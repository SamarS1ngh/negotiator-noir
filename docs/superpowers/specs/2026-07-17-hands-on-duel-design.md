# The hands-on duel (no more options)

**Date:** 2026-07-17
**Supersedes the INPUT model of:** the cinematic duel (v0.4–v0.6). Recon, the nerve/patience economy, the engine, and the art all stay.

## Why

Samar, after every version: "I still choose in options." Correct. Shorter labels are still a list — the input never changed: read → tap 1 of 5 → the game waits forever. No timing, no pressure, nothing done with your hands. A menu, however it's dressed.

**Fix: stop picking, start doing.** You act ON him, in the moment, with gestures under a live window.

## The core loop — a beat

1. He talks. His portrait fills the frame.
2. **The moment goes live.** A short window (~2.5–4s, shown as a thin ring/bar draining around the scene, not a number). During it, HE is readable — his face, his tell.
3. **You act with a gesture, on him:**
   - **SWIPE UP on his face** → press him (attack his nerve)
   - **HOLD on his eyes** → stare him down. A pressure bar builds; **release near the peak**. Too early = weak; hold too long = you blink first, it bleeds you.
   - **SWIPE DOWN** → back off / let him talk (safe, buys patience, gives him a little back)
   - **TAP THE FLASH** → the instant his tell flashes on his body, tap it. Hit = you catch the lie (big). Miss = gone.
   - **SLAM (double-tap / hard drag from the bottom)** → play your card (the finisher, once he's rattled).
4. **Miss the window entirely** → he takes it: your nerve bleeds, his patience burns.
5. Which gesture *fits* is the read (his type/tell from recon). Wrong gesture = it backfires. Same economy as v0.5.1.

**No option list. No text buttons.** A first-run overlay teaches the 4 gestures in ~8 words each, then never again.

## What the gestures map to (engine unchanged)

- swipe up → probe with the aggressive angle live for this beat (the beat picks the angle from his state; you're choosing *pressure*, not a sentence)
- hold+release at peak → a strong probe (the stare-down); mistimed → backfire
- swipe down → concede a beat (patience +, small nerve regen for him)
- tap-the-flash → `catch` (only live during a flash)
- slam → `deploy` (leverage; cold = backfires per v0.5.1)

Your spoken line still appears in the log after the act — the writing survives, you never read to choose.

## HUD (minimal)

His nerve / your nerve / his patience stay as the three thin bars. Add: the **window ring** (draining), and the **hold bar** while holding. Nothing else. The screen is his face.

## Scope

Rebuild the duel input on Ricci. Recon unchanged. Aftermath unchanged. Ship APK.

## Tests

- gesture dispatch: swipe up → probe; swipe down → concede; hold+release in peak → strong hit, outside → backfire; tap during flash → catch; tap outside flash → miss/penalty; slam cold → backfire, slam rattled → finisher.
- window expiry → penalty + next beat.
- win line (read him → press/stare → catch the flash → slam) and lose line (flail/miss) still hold.
- gestures via synthetic pointer events; timers gated in test mode.

## Verify

vitest green · tsc clean · build clean · play on-device: every beat is a gesture, no list on screen.
