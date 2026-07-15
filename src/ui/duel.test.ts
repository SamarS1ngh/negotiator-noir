import { describe, it, expect, beforeEach } from 'vitest';
import { renderDuel } from './duel';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import { initDuel } from '../domain/engine';

describe('duel screen', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders angle chips and no word cards until an angle is picked', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, null);
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);
    expect(root.querySelectorAll('[data-line]').length).toBe(0);
  });
  it('shows word cards for the selected angle, with a risk dot, and no numbers', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, 'plant_doubt');
    const cards = root.querySelectorAll('[data-line]');
    expect(cards.length).toBeGreaterThan(0);
    expect(root.querySelector('[data-risk]')).not.toBeNull();
    expect(root.textContent).not.toMatch(/[-+]\d+/); // no raw effect numbers leaked
  });
});
