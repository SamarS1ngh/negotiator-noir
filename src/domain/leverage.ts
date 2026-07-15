import type { Leverage, AgendaField } from './types';

export function deployEffect(lev: Leverage): { hisComposure: number; leak: AgendaField; leakAmount: number } {
  return { hisComposure: -41, leak: lev.targets, leakAmount: 1 };
}
