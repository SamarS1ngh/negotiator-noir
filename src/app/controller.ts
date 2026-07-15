import type { AgendaField, AngleId, Band, DuelState, Opponent, Script } from '../domain/types';
import { initDuel, apply } from '../domain/engine';
import { renderDuel } from '../ui/duel';
import { renderReaction } from '../ui/reaction';
import { renderRecord } from '../ui/record';
import { renderCatch, renderDeploy } from '../ui/deploy';
import { renderSpike } from '../ui/spike';
import { renderAftermath } from '../ui/aftermath';

// Tell-spike is timed (drains + auto-passes) in the live app, but never in
// tests — vitest sets `import.meta.env.MODE` to 'test' by default, so this
// stays deterministic without the integration test needing to know about it.
const TIMED = import.meta.env.MODE !== 'test';

/**
 * Wires the domain engine to the UI screens into one playable duel.
 * Owns the live `DuelState` + `selectedAngle`, and re-renders `root` on
 * every change. See .superpowers/sdd/task-11-brief.md for the flow rules.
 */
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void {
  let state: DuelState = initDuel(opp, script);
  let selectedAngle: AngleId | null = null;

  function showDuel(): void {
    renderDuel(root, state, opp, angleFreshFirst(), { probe, pickAngle, openRecord }, selectedAngle);
    appendWalkAffordance();
  }

  // renderDuel always lists angle chips in script.angles order; an angle
  // that's already spent lands with zero effect (see matrix.ts), so the
  // chip list is presented fresh-angles-first — a display-only reorder
  // (engine logic keys off angleId, never chip position) that keeps the
  // obvious "try the next thing" affordance pointed at an angle that still
  // does something.
  function angleFreshFirst(): Script {
    const fresh = script.angles.filter((a) => !state.spentAngles.includes(a));
    const spent = script.angles.filter((a) => state.spentAngles.includes(a));
    return { ...script, angles: [...fresh, ...spent] };
  }

  function appendWalkAffordance(): void {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'record-btn walk-btn';
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

  function probe(lineId: string): void {
    const line = script.lines.find((l) => l.id === lineId);
    // reciprocity check must read spentAngles BEFORE apply mutates it
    const spent = line ? state.spentAngles.includes(line.angleId) : false;

    const result = apply(state, { kind: 'probe', lineId }, opp, script);
    state = result.state;
    selectedAngle = null;

    const saidEvent = result.events.find((e) => e.type === 'said');
    const bandEvent = result.events.find((e) => e.type === 'band');
    const tellEvent = result.events.find((e) => e.type === 'tell');
    const band = (bandEvent?.text ?? 'neutral') as Band;

    // The reaction beat is what makes a probe FEEL like something happened:
    // his reply, a verdict, his composure moving. Then route onward.
    renderReaction(
      root,
      opp,
      { hisLine: saidEvent?.text ?? null, band, spent, hisComposure: state.hisComposure, mood: state.mood },
      {
        continue: () => {
          if (state.end !== 'ongoing') { showAftermath(); return; }
          if (tellEvent) { showSpike(tellEvent.text); return; }
          showDuel();
        },
      },
    );
  }

  function showSpike(tellText: string): void {
    renderSpike(root, tellText, opp.palette, { press: pressTell, pass: showDuel }, TIMED);
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
