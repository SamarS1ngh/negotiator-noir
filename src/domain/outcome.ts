import type { EndState } from './types';

export function endStateFor(hisComposure: number, yourComposure: number): EndState {
  if (hisComposure <= 0) return 'folded';
  if (yourComposure <= 0) return 'turned';
  return 'ongoing';
}

export function payout(end: EndState, debtAmount: number): { cost: number; label: string } {
  switch (end) {
    case 'folded':
      return { cost: 0, label: 'debt cleared' };
    case 'dealt':
      return { cost: Math.round(debtAmount * 0.4), label: 'settled down' };
    default:
      return { cost: debtAmount, label: 'paid in full' };
  }
}
