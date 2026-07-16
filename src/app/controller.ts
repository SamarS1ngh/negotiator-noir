import type { AgendaField, AngleId, Band, DuelEvent, DuelState, Opponent, Script } from '../domain/types';
import { initDuel, apply } from '../domain/engine';
import { renderDuel, GENERIC_REACTION } from '../ui/duel';
import type { ConvoTurn, CutToHim, DuelHandlers, DuelReaction } from '../ui/duel';
import { renderRecord } from '../ui/record';
import { renderCatch, renderDeploy } from '../ui/deploy';
import { renderSpike } from '../ui/spike';
import { renderAftermath } from '../ui/aftermath';

// Vitest sets MODE to 'test' for every run — gate every animation timer on it
// so tests drive the duel synchronously (render the final state immediately,
// no setTimeout) while the live app (dev/build -> MODE 'production') runs the
// full choreography below.
const TEST = import.meta.env.MODE === 'test';

// Rough beat timings (ms) for the live animated flow — see the brief's
// "animated flow" section. None of these ever fire under Vitest.
const TIMING = { MODAL_CLOSE: 220, FLY_IN: 260, TYPE_MS: 16, SETTLE: 260, PUNCH: 720 };

/**
 * Wires the domain engine to the UI screens into one playable duel.
 * Owns the live `DuelState`, the dial's `selectedAngle`, and the on-screen
 * conversation transcript (the domain keeps no per-turn history, so the
 * controller grows its own as the duel plays). See
 * .superpowers/sdd/v3ui-brief.md for the full choreography this wires up:
 * dial wedge -> cyan modal -> pick a word -> your line flies into the
 * conversation -> cut to him (typewriter) -> his line settles into the log
 * -> reads update -> verdict punches out then docks.
 */
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void {
  let state: DuelState = initDuel(opp, script);
  let selectedAngle: AngleId | null = null;
  let transcript: ConvoTurn[] = [];
  // The last probe's verdict — rendered inline (punches out once, then sits
  // docked top-right as a "last read" marker) instead of a separate screen.
  let lastReaction: DuelReaction | null = null;

  const handlers: DuelHandlers = { probe, pickAngle, openRecord, closeModal };

  // renderDuel always lists angle wedges in script.angles order; an angle
  // that's already spent lands with zero effect (see matrix.ts), so wedges
  // are presented fresh-angles-first for whichever state is on screen right
  // now — a display-only reorder (engine logic keys off angleId, never wedge
  // position) that keeps the obvious "try the next thing" affordance pointed
  // at an angle that still does something.
  function angleFreshFirst(s: DuelState): Script {
    const fresh = script.angles.filter((a) => !s.spentAngles.includes(a));
    const spent = script.angles.filter((a) => s.spentAngles.includes(a));
    return { ...script, angles: [...fresh, ...spent] };
  }

  function showDuel(): void {
    renderDuel(root, state, opp, angleFreshFirst(state), handlers, {
      selectedAngle, transcript, reaction: lastReaction ?? undefined,
    });
    appendWalkAffordance();
  }

  // Renders a resting-scene snapshot mid-animation: the modal is always
  // closed here (selectedAngle null) — only the state/reaction/cutToHim
  // vary between beats. Interactions are inert (see inertHandlers) so a tap
  // mid-flight can't stack a second animation on top of this one.
  function renderBeat(s: DuelState, reaction?: DuelReaction, cutToHim?: CutToHim): void {
    renderDuel(root, s, opp, angleFreshFirst(s), inertHandlers, {
      selectedAngle: null, transcript, reaction, cutToHim,
    });
    appendWalkAffordance();
  }

  const inertHandlers: DuelHandlers = {
    probe() {}, pickAngle() {}, openRecord() {}, closeModal() {},
  };

  function appendWalkAffordance(): void {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'walk-btn';
    btn.dataset.walk = '';
    btn.textContent = 'WALK AWAY';
    btn.addEventListener('click', walk);
    root.appendChild(btn);
  }

  function showAftermath(): void {
    renderAftermath(root, state, opp, { continue: () => onDone?.() });
  }

  function pickAngle(a: AngleId): void {
    selectedAngle = a;
    showDuel();
  }

  function closeModal(): void {
    closeModalWithAnimation(() => {
      selectedAngle = null;
      showDuel();
    });
  }

  // Fakes the modal's exit transition: flags the just-rendered .modal/.veil
  // as closing (their CSS plays a short fade/scale-down), waits for it, then
  // runs `after` — which re-renders without the modal. Skipped entirely
  // under test (no timers, no DOM peeking).
  function closeModalWithAnimation(after: () => void): void {
    if (TEST) { after(); return; }
    const modal = root.querySelector<HTMLElement>('.modal');
    const veil = root.querySelector<HTMLElement>('.veil');
    if (!modal) { after(); return; }
    modal.classList.add('closing');
    veil?.classList.add('closing');
    setTimeout(after, TIMING.MODAL_CLOSE);
  }

  function probe(lineId: string): void {
    closeModalWithAnimation(() => doProbe(lineId));
  }

  function doProbe(lineId: string): void {
    const line = script.lines.find((l) => l.id === lineId);
    if (!line) { selectedAngle = null; showDuel(); return; }

    // reciprocity check must read spentAngles BEFORE apply mutates it
    const spent = state.spentAngles.includes(line.angleId);
    const prevState = state;

    const result = apply(state, { kind: 'probe', lineId }, opp, script);
    state = result.state;
    selectedAngle = null;

    const bandEvent = result.events.find((e) => e.type === 'band');
    const saidEvent = result.events.find((e) => e.type === 'said');
    const tellEvent = result.events.find((e) => e.type === 'tell');
    const band = (bandEvent?.text ?? 'neutral') as Band;
    const quoted = Boolean(saidEvent);
    const hisReply = saidEvent?.text ?? GENERIC_REACTION[band];

    const youTurn: ConvoTurn = { who: 'you', text: line.text };
    const himTurn: ConvoTurn = { who: 'him', text: hisReply, quoted };

    if (TEST) {
      transcript = [...transcript, youTurn, himTurn];
      lastReaction = { band, fresh: false, spent };
      finishProbe(tellEvent);
      return;
    }

    // ---- LIVE: the choreographed reveal (see the brief's animated flow) ----
    // Step 2: your line flies into the conversation; reads/mood stay on the
    // PRE-reaction state until he's actually replied.
    transcript = [...transcript, youTurn];
    renderBeat(prevState, lastReaction ?? undefined);

    setTimeout(() => {
      // Step 3: cut to him — his reply typewriters out at the bottom.
      typewriter(hisReply, (typed, done) => {
        renderBeat(prevState, lastReaction ?? undefined, { text: hisReply, typed, done, quoted });
        if (!done) return;

        setTimeout(() => {
          // his line settles up into the conversation log
          transcript = [...transcript, himTurn];

          // Step 4: reads update — expression/subtext/tell/composure move
          // to the NEW (post-reaction) state; the verdict punches out fresh.
          lastReaction = { band, fresh: true, spent };
          renderBeat(state, lastReaction);

          // Step 5: let the punch play, then dock it and hand control back.
          setTimeout(() => {
            lastReaction = { band, fresh: false, spent };
            finishProbe(tellEvent);
          }, TIMING.PUNCH);
        }, TIMING.SETTLE);
      });
    }, TIMING.FLY_IN);
  }

  function typewriter(text: string, onTick: (typed: string, done: boolean) => void): void {
    let i = 0;
    const step = (): void => {
      i += 1;
      const done = i >= text.length;
      onTick(text.slice(0, i), done);
      if (!done) setTimeout(step, TIMING.TYPE_MS);
    };
    step();
  }

  function finishProbe(tellEvent?: DuelEvent): void {
    if (state.end !== 'ongoing') { showAftermath(); return; }
    if (tellEvent) { showSpike(tellEvent.text); return; }
    showDuel();
  }

  function showSpike(tellText: string): void {
    renderSpike(root, tellText, opp.palette, { press: pressTell, pass: showDuel });
  }

  function pressTell(): void {
    const result = apply(state, { kind: 'pressTell' }, opp, script);
    state = result.state;
    if (state.end !== 'ongoing') { showAftermath(); return; }
    showDuel();
  }

  function openRecord(): void {
    renderRecord(root, state, { catch: doCatch, deploy: doDeploy, close: showDuel });
  }

  function doCatch(contradictionId: string): void {
    const contradiction = state.record.openContradictions.find((c) => c.id === contradictionId);
    if (!contradiction) { openRecord(); return; }

    // Snapshot the beat's copy before apply() consumes the contradiction —
    // mirrors renderRecord's own lookups (src/ui/record.ts) and the engine's
    // leakField derivation (src/domain/engine.ts apply/'catch').
    const said = state.record.statements.find((s) => s.id === contradiction.statementId)?.text ?? '';
    const against = contradiction.kind === 'leverage'
      ? (state.record.heldLeverage.find((l) => l.id === contradiction.against)?.label ?? '')
      : (state.record.statements.find((s) => s.id === contradiction.against)?.text ?? '');
    let leakField: AgendaField = 'lie';
    if (contradiction.kind === 'leverage') {
      const lev = state.record.heldLeverage.find((l) => l.id === contradiction.against);
      if (lev) leakField = lev.targets;
    }

    const result = apply(state, { kind: 'catch', contradictionId }, opp, script);
    state = result.state;
    const next = state.end !== 'ongoing' ? showAftermath : showDuel;
    renderCatch(root, said, against, leakField, { continue: next });
  }

  function doDeploy(leverageId: string): void {
    const lev = state.record.heldLeverage.find((l) => l.id === leverageId);
    if (!lev) { openRecord(); return; }

    const result = apply(state, { kind: 'deploy', leverageId }, opp, script);
    state = result.state;
    const next = state.end !== 'ongoing' ? showAftermath : showDuel;
    renderDeploy(root, lev, { continue: next });
  }

  function walk(): void {
    const result = apply(state, { kind: 'walk' }, opp, script);
    state = result.state;
    showAftermath(); // walk always ends the duel
  }

  showDuel();
}
