import type { Statement, Leverage, Contradiction, AgendaField } from './types';

export function findContradictions(fresh: Statement, prior: Statement[], held: Leverage[]): Contradiction[] {
  if (!fresh.contradicts) return [];
  const id = fresh.contradicts;
  if (held.some(l => l.id === id)) return [{ id: `c_${fresh.id}`, statementId: fresh.id, against: id, kind: 'leverage' }];
  if (prior.some(s => s.id === id)) return [{ id: `c_${fresh.id}`, statementId: fresh.id, against: id, kind: 'statement' }];
  return [];
}

export function catchEffect(leakField: AgendaField): { hisComposure: number; leak: AgendaField; leakAmount: number } {
  return { hisComposure: -30, leak: leakField, leakAmount: 1 };
}
