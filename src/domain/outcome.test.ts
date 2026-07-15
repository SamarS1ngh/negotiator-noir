import { describe, it, expect } from 'vitest';
import { endStateFor, payout } from './outcome';

describe('outcome', () => {
  it('folds when his composure is gone', () => {
    expect(endStateFor(0, 50)).toBe('folded');
  });
  it('turns when your composure is gone', () => {
    expect(endStateFor(50, 0)).toBe('turned');
  });
  it('ongoing otherwise', () => {
    expect(endStateFor(50, 50)).toBe('ongoing');
  });
  it('debt economy: folding clears the debt, caving pays full', () => {
    expect(payout('folded', 500).cost).toBe(0);
    expect(payout('walked', 500).cost).toBe(500);
    expect(payout('dealt', 500).cost).toBe(200);
  });
});
