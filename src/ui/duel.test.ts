import { describe, it, expect, beforeEach } from 'vitest';
import { renderDuel } from './duel';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import { initDuel } from '../domain/engine';

describe('duel screen', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders the dial (5 angle wedges) and no word cards until an angle is picked', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, null);
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);
    expect(root.querySelectorAll('[data-line]').length).toBe(0);
  });

  it('shows word-HUD cards for the selected angle, with a risk dot, and no numbers', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, 'plant_doubt');
    const cards = root.querySelectorAll('[data-line]');
    expect(cards.length).toBeGreaterThan(0);
    expect(root.querySelector('[data-risk]')).not.toBeNull();
    expect(root.textContent).not.toMatch(/[-+]\d+/); // no raw effect numbers leaked
  });

  it('shows the objective bar from opp.objective', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, null);
    expect(root.querySelector('.objective')?.textContent).toContain('RICCI');
  });

  it('docks the verdict marker (no punch) when a reaction is present but not fresh', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){} }, null,
      { band: 'lands', fresh: false },
    );
    expect(root.querySelector('.f-verdict')?.textContent).toContain('HE FLINCHED');
    expect(root.querySelector('.verdict-punch')).toBeNull();
  });

  it('punches the verdict out on a fresh reaction', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){} }, null,
      { band: 'backfires', fresh: true },
    );
    expect(root.querySelector('.verdict-punch')?.textContent).toContain('THAT BACKFIRED');
  });

  it('preserves the data-open-record affordance', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, null);
    expect(root.querySelector('[data-open-record]')).not.toBeNull();
  });
});
