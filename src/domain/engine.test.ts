import { describe, it, expect } from 'vitest';
import { initDuel, apply, moodFor } from './engine';
import type { Opponent, Script } from './types';

const opp: Opponent = {
  id: 'collector', name: 'Ricci', role: 'the collector', type: 'proud', palette: 'crimson',
  moodStart: 100, composureStart: 100, yourComposureStart: 100,
  agenda: { bottomLine: 'settles for less if the boss stays blind', fear: 'the boss finding out', lie: 'the sum is non-negotiable' },
  debtAmount: 500, art: { seed: 501, states: { guarded:'', rattled:'', angry:'', cornered:'', folding:'' } },
};
const script: Script = {
  angles: ['lean','flatter','plant_doubt','bluff','offer_out'],
  lines: [
    { id: 'l_doubt1', angleId: 'plant_doubt', text: 'Marlowe quoted me different.', emits: 's_book' },
    { id: 'l_flat1', angleId: 'flatter', text: 'You run a tight ship.' },
  ],
  statements: [
    { id: 's_book', text: "I run my own book. I don't answer to Marlowe.", truth: 'lie', contradicts: 'skims' },
  ],
  leverage: [
    { id: 'skims', label: 'He skims his own boss', text: 'He skims off the top.', targets: 'fear', heldAtStart: true },
  ],
};

describe('duel engine', () => {
  it('probing a proud man with plant_doubt lands and logs his statement + a contradiction', () => {
    const s0 = initDuel(opp, script);
    const { state, events } = apply(s0, { kind: 'probe', lineId: 'l_doubt1' }, opp, script);
    expect(state.hisComposure).toBeLessThan(100);
    expect(state.record.statements.map(s => s.id)).toContain('s_book');
    expect(state.record.openContradictions).toHaveLength(1);
    expect(events.some(e => e.type === 'said')).toBe(true);
  });
  it('catching the contradiction craters composure and reveals fear', () => {
    let s = initDuel(opp, script);
    s = apply(s, { kind: 'probe', lineId: 'l_doubt1' }, opp, script).state;
    const cid = s.record.openContradictions[0]!.id;
    const after = apply(s, { kind: 'catch', contradictionId: cid }, opp, script).state;
    expect(after.hisComposure).toBeLessThan(s.hisComposure);
    expect(after.known.fear).toBe(1);
    expect(after.record.openContradictions).toHaveLength(0);
  });
  it('deploying leverage can fold him', () => {
    let s = initDuel(opp, script);
    // grind him down then deploy
    for (let i = 0; i < 4; i++) s = apply(s, { kind: 'probe', lineId: 'l_doubt1' }, opp, script).state;
    s = apply(s, { kind: 'deploy', leverageId: 'skims' }, opp, script).state;
    expect(['folded','ongoing']).toContain(s.end);
    expect(s.record.heldLeverage).toHaveLength(0);
  });
  it('mood tracks composure', () => {
    expect(moodFor(100)).toBe('guarded'); expect(moodFor(10)).toBe('cornered'); expect(moodFor(0)).toBe('folding');
  });
});
