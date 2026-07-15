import type { AngleId, OpponentType, Band, AgendaField, ProbeEffect } from './types';

const TABLE: Record<AngleId, Record<OpponentType, Band>> = {
  lean:        { proud: 'neutral',  greedy: 'neutral',  scared: 'lands',    believer: 'backfires', pro: 'neutral'   },
  flatter:     { proud: 'lands',    greedy: 'lands',    scared: 'backfires',believer: 'neutral',   pro: 'backfires' },
  plant_doubt: { proud: 'lands',    greedy: 'neutral',  scared: 'lands',    believer: 'lands',     pro: 'neutral'   },
  bluff:       { proud: 'neutral',  greedy: 'lands',    scared: 'backfires',believer: 'backfires', pro: 'lands'     },
  offer_out:   { proud: 'backfires',greedy: 'lands',    scared: 'lands',    believer: 'neutral',   pro: 'neutral'   },
};

const TARGET: Record<AngleId, AgendaField> = {
  lean: 'fear', flatter: 'bottomLine', plant_doubt: 'lie', bluff: 'lie', offer_out: 'bottomLine',
};

export function bandFor(angle: AngleId, type: OpponentType): Band { return TABLE[angle][type]; }
export function angleTarget(angle: AngleId): AgendaField { return TARGET[angle]; }

export function probeEffect(angle: AngleId, type: OpponentType, alreadySpent: boolean): ProbeEffect {
  const band = bandFor(angle, type);
  if (alreadySpent) return { hisComposure: 0, yourComposure: -8, leakAmount: 0, band };
  if (band === 'lands')     return { hisComposure: -14, yourComposure: 0,   leak: TARGET[angle], leakAmount: 0.34, band };
  if (band === 'neutral')   return { hisComposure: -4,  yourComposure: 0,   leak: TARGET[angle], leakAmount: 0.10, band };
  /* backfires */           return { hisComposure: 6,   yourComposure: -12, leakAmount: 0, band };
}
