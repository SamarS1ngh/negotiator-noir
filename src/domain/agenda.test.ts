import { describe, it, expect } from 'vitest';
import { leak } from './agenda';
describe('agenda leak', () => {
  const zero = { bottomLine: 0, fear: 0, lie: 0 };
  it('adds and clamps to 1', () => {
    expect(leak(zero, 'fear', 0.34).fear).toBeCloseTo(0.34);
    expect(leak({ ...zero, fear: 0.8 }, 'fear', 0.5).fear).toBe(1);
  });
  it('does not mutate input', () => {
    const r = leak(zero, 'lie', 0.2); expect(zero.lie).toBe(0); expect(r.lie).toBeCloseTo(0.2);
  });
});
