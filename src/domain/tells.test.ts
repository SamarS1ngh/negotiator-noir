import { describe, it, expect } from 'vitest';
import { tellFires, pressTellEffect } from './tells';

describe('tells', () => {
  it('fires when composure crosses a threshold downward', () => {
    expect(tellFires(70, 64)).toBe(true); // crossed 66
    expect(tellFires(40, 30)).toBe(true); // crossed 33
  });
  it('does not fire without crossing', () => {
    expect(tellFires(90, 80)).toBe(false);
    expect(tellFires(64, 60)).toBe(false);
  });
  it('pressing a tell hurts composure', () => {
    expect(pressTellEffect().hisComposure).toBeLessThan(0);
  });
});
