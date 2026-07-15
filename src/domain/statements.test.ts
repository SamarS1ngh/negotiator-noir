import { describe, it, expect } from 'vitest';
import { findContradictions, catchEffect } from './statements';
import type { Statement, Leverage } from './types';

const lev: Leverage = { id: 'skims', label: 'He skims his boss', text: '...', targets: 'fear', heldAtStart: true };
const s1: Statement = { id: 's1', text: 'I answer to no one', truth: 'lie', contradicts: 'skims' };
const s2: Statement = { id: 's2', text: 'I never touch the count', truth: 'lie', contradicts: 's_earlier' };
const earlier: Statement = { id: 's_earlier', text: 'I count it myself', truth: 'true' };

describe('contradictions', () => {
  it('detects a statement that conflicts with held leverage', () => {
    const c = findContradictions(s1, [], [lev]);
    expect(c).toHaveLength(1); expect(c[0]!.kind).toBe('leverage'); expect(c[0]!.against).toBe('skims');
  });
  it('detects a statement that conflicts with an earlier statement', () => {
    const c = findContradictions(s2, [earlier], []);
    expect(c).toHaveLength(1); expect(c[0]!.kind).toBe('statement'); expect(c[0]!.against).toBe('s_earlier');
  });
  it('no contradiction when nothing matches', () => {
    expect(findContradictions({ id: 'x', text: 'hi', truth: 'true' }, [earlier], [lev])).toHaveLength(0);
  });
  it('catch fully reveals the field and craters composure', () => {
    const e = catchEffect('fear'); expect(e.hisComposure).toBe(-30); expect(e.leak).toBe('fear'); expect(e.leakAmount).toBe(1);
  });
});
