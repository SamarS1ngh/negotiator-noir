import { describe, it, expect } from 'vitest';
import { deployEffect } from './leverage';
import type { Leverage } from './types';

const lev: Leverage = { id: 'skims', label: '', text: '', targets: 'fear', heldAtStart: true };

describe('deploy', () => {
  it('shatters composure and fully reveals the targeted field', () => {
    const e = deployEffect(lev);
    expect(e.hisComposure).toBe(-41);
    expect(e.leak).toBe('fear');
    expect(e.leakAmount).toBe(1);
  });
});
