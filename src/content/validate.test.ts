import { describe, it, expect } from 'vitest';
import { COLLECTOR } from './collector';
import { COLLECTOR_SCRIPT } from './script';
import { validateContent } from './validate';
import { initDuel, apply } from '../domain/engine';

describe('collector content', () => {
  it('validates clean', () => { expect(validateContent(COLLECTOR, COLLECTOR_SCRIPT)).toEqual([]); });
  it('has at least 2 catchable contradictions and 1 held leverage', () => {
    const catchable = COLLECTOR_SCRIPT.statements.filter(s => s.contradicts).length;
    expect(catchable).toBeGreaterThanOrEqual(2);
    expect(COLLECTOR_SCRIPT.leverage.some(l => l.heldAtStart)).toBe(true);
  });
  it('is winnable: a scripted line of play folds him', () => {
    let s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    s = apply(s, { kind: 'probe', lineId: doubt.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    if (s.record.openContradictions[0]) s = apply(s, { kind: 'catch', contradictionId: s.record.openContradictions[0].id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    const lev = s.record.heldLeverage[0];
    if (lev) s = apply(s, { kind: 'deploy', leverageId: lev.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    // a couple more presses
    for (let i = 0; i < 3 && s.end === 'ongoing'; i++) {
      const line = COLLECTOR_SCRIPT.lines.find(l => !s.spentAngles.includes(l.angleId));
      if (!line) break; s = apply(s, { kind: 'probe', lineId: line.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    }
    expect(s.end).toBe('folded');
  });
});
