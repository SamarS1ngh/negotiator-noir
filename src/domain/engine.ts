import type {
  AgendaField, DuelAction, DuelEvent, DuelState, Line, MoodState, Opponent, Risk, Script,
} from './types';
import { probeEffect, bandFor, angleTarget } from './matrix';
import { leak } from './agenda';
import { findContradictions, catchEffect } from './statements';
import { deployEffect } from './leverage';
import { tellFires, pressTellEffect } from './tells';
import { endStateFor } from './outcome';

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function moodFor(hisComposure: number): MoodState {
  if (hisComposure > 75) return 'guarded';
  if (hisComposure > 50) return 'rattled';
  if (hisComposure > 30) return 'angry';
  if (hisComposure > 0) return 'cornered';
  return 'folding';
}

export function initDuel(opp: Opponent, script: Script): DuelState {
  return {
    hisComposure: opp.composureStart,
    yourComposure: opp.yourComposureStart,
    mood: moodFor(opp.composureStart),
    known: { bottomLine: 0, fear: 0, lie: 0 },
    spentAngles: [],
    record: {
      statements: [],
      heldLeverage: script.leverage.filter((l) => l.heldAtStart),
      openContradictions: [],
    },
    end: 'ongoing',
    log: [],
  };
}

// After his/your composure change: clamp, recompute mood + end (unless already walked).
function settle(state: DuelState, hisComposureRaw: number, yourComposureRaw: number): DuelState {
  const hisComposure = clamp(hisComposureRaw, 0, 100);
  const yourComposure = Math.max(0, yourComposureRaw);
  const mood = moodFor(hisComposure);
  const end = state.end === 'walked' ? 'walked' : endStateFor(hisComposure, yourComposure);
  return { ...state, hisComposure, yourComposure, mood, end };
}

export function apply(
  state: DuelState,
  action: DuelAction,
  opp: Opponent,
  script: Script,
): { state: DuelState; events: DuelEvent[] } {
  if (action.kind === 'probe') {
    const line = script.lines.find((l) => l.id === action.lineId);
    if (!line) return { state, events: [] };

    const alreadySpent = state.spentAngles.includes(line.angleId);
    const effect = probeEffect(line.angleId, opp.type, alreadySpent);
    const spentAngles = alreadySpent ? state.spentAngles : [...state.spentAngles, line.angleId];

    let statements = state.record.statements;
    let openContradictions = state.record.openContradictions;
    const events: DuelEvent[] = [];

    if (line.emits) {
      const stmt = script.statements.find((s) => s.id === line.emits);
      if (stmt) {
        const contradictions = findContradictions(stmt, state.record.statements, state.record.heldLeverage);
        statements = [...statements, stmt];
        if (contradictions.length > 0) openContradictions = [...openContradictions, ...contradictions];
        events.push({ type: 'said', text: stmt.text });
      }
    }

    events.push({ type: 'band', text: effect.band });

    let known = state.known;
    if (effect.leak) {
      known = leak(known, effect.leak, effect.leakAmount);
      events.push({ type: 'leak', text: `${effect.leak} +${effect.leakAmount}` });
    }

    const prevHisComposure = state.hisComposure;
    const settled = settle(
      { ...state, known, spentAngles, record: { ...state.record, statements, openContradictions } },
      state.hisComposure + effect.hisComposure,
      state.yourComposure + effect.yourComposure,
    );
    if (tellFires(prevHisComposure, settled.hisComposure)) events.push({ type: 'tell', text: 'a tell slips through' });
    return { state: { ...settled, log: [...state.log, line.text] }, events };
  }

  if (action.kind === 'catch') {
    const contradiction = state.record.openContradictions.find((c) => c.id === action.contradictionId);
    if (!contradiction) return { state, events: [] };

    let heldLeverage = state.record.heldLeverage;
    let leakField: AgendaField = 'lie';
    if (contradiction.kind === 'leverage') {
      const lev = heldLeverage.find((l) => l.id === contradiction.against);
      if (lev) leakField = lev.targets;
      heldLeverage = heldLeverage.filter((l) => l.id !== contradiction.against);
    }

    const effect = catchEffect(leakField);
    const known = leak(state.known, effect.leak, effect.leakAmount);
    const openContradictions = state.record.openContradictions.filter((c) => c.id !== action.contradictionId);

    const events: DuelEvent[] = [{ type: 'caught', text: `caught: ${contradiction.against}` }];
    const settled = settle(
      { ...state, known, record: { ...state.record, heldLeverage, openContradictions } },
      state.hisComposure + effect.hisComposure,
      state.yourComposure,
    );
    return { state: { ...settled, log: [...state.log, `caught: ${contradiction.against}`] }, events };
  }

  if (action.kind === 'deploy') {
    const lev = state.record.heldLeverage.find((l) => l.id === action.leverageId);
    if (!lev) return { state, events: [] };

    const effect = deployEffect(lev);
    const known = leak(state.known, effect.leak, effect.leakAmount);
    const heldLeverage = state.record.heldLeverage.filter((l) => l.id !== action.leverageId);

    const events: DuelEvent[] = [{ type: 'deployed', text: lev.label }];
    const settled = settle(
      { ...state, known, record: { ...state.record, heldLeverage } },
      state.hisComposure + effect.hisComposure,
      state.yourComposure,
    );
    return { state: { ...settled, log: [...state.log, `deployed: ${lev.label}`] }, events };
  }

  if (action.kind === 'pressTell') {
    const effect = pressTellEffect();
    const events: DuelEvent[] = [{ type: 'tell', text: 'pressed the tell' }];
    const settled = settle(state, state.hisComposure + effect.hisComposure, state.yourComposure);
    return { state: { ...settled, log: [...state.log, 'pressed the tell'] }, events };
  }

  // walk
  return {
    state: { ...state, end: 'walked', log: [...state.log, 'walked away'] },
    events: [{ type: 'end', text: 'walked away' }],
  };
}

export function riskOf(state: DuelState, opp: Opponent, line: Line): Risk {
  const band = bandFor(line.angleId, opp.type);
  const target = angleTarget(line.angleId);
  const knownAmount = state.known[target];
  if (band === 'lands' && knownAmount > 0.5) return 'safe';
  if (band === 'backfires') return 'high';
  return 'uncertain';
}
