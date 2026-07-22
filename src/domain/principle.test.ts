import { describe, it, expect } from 'vitest';
import { PRINCIPLES, principle, sortLearned, type PrincipleId } from './principle';

describe('principle registry integrity', () => {
  it('every entry has both teaching layers and a matching id', () => {
    for (const [id, p] of Object.entries(PRINCIPLES)) {
      expect(p.id).toBe(id);
      expect(p.plain.length).toBeGreaterThan(20);   // layer 1 — the mental model
      expect(p.real.length).toBeGreaterThan(20);    // layer 2 — the named jargon
      expect([1, 2, 3]).toContain(p.act);
    }
  });
  it('spans all three acts', () => {
    const acts = new Set(Object.values(PRINCIPLES).map((p) => p.act));
    expect([...acts].sort()).toEqual([1, 2, 3]);
  });
  it('looks up by id', () => {
    expect(principle('golden-bridge').name).toMatch(/golden bridge/i);
  });
});

describe('sortLearned — codex ordering', () => {
  it('dedupes and orders by curriculum, not insertion', () => {
    const used: PrincipleId[] = ['the-mirror', 'loss-aversion', 'golden-bridge', 'loss-aversion'];
    const sorted = sortLearned(used).map((p) => p.id);
    expect(sorted).toEqual(['loss-aversion', 'golden-bridge', 'the-mirror']);
  });
});
