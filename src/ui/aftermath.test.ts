import { describe, it, expect, beforeEach } from 'vitest';
import { renderAftermath, renderSpike } from './aftermath'; // aftermath.ts re-exports renderSpike from spike.ts, OR import from spike
import { initDuel } from '../domain/engine';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('aftermath + spike', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });
  it('folded aftermath shows the win + a continue', () => {
    const s = { ...initDuel(COLLECTOR, COLLECTOR_SCRIPT), end: 'folded' as const, hisComposure: 0 };
    renderAftermath(root, s, COLLECTOR, { continue(){} });
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('[data-continue]')).not.toBeNull();
  });
  it('folded aftermath delivers the break payoff — he names who is above him', () => {
    const s = { ...initDuel(COLLECTOR, COLLECTOR_SCRIPT), end: 'folded' as const, hisComposure: 0 };
    renderAftermath(root, s, COLLECTOR, { continue(){} });
    expect(root.querySelector('.reveal')).not.toBeNull();
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
  });
  it('a non-fold ending shows no break payoff', () => {
    const s = { ...initDuel(COLLECTOR, COLLECTOR_SCRIPT), end: 'walked' as const };
    renderAftermath(root, s, COLLECTOR, { continue(){} });
    expect(root.querySelector('.reveal')).toBeNull();
  });
  it('spike (untimed) renders press/pass without a timer', () => {
    renderSpike(root, 'his eyes cut to the door', 'crimson', { press(){}, pass(){} }, false);
    expect(root.querySelector('[data-press]')).not.toBeNull();
    expect(root.querySelector('[data-pass]')).not.toBeNull();
  });
});
