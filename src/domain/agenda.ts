import type { AgendaField } from './types';

export function leak(known: Record<AgendaField, number>, field: AgendaField, amount: number): Record<AgendaField, number> {
  const next = { ...known };
  next[field] = Math.min(1, Math.max(0, next[field] + amount));
  return next;
}
