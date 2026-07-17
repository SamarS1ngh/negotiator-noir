import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import type { IntelId } from '../domain/types';

const FULL = (): Set<IntelId> => new Set<IntelId>(['type', 'tell', 'lie', 'lev:skims', 'lev:ledger']);

describe('duel (the wheel is back; nothing is handed to you)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function tap(sel: string) { q(sel)!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
  function move(angle: string, lineId?: string) {
    tap(`[data-angle="${angle}"]`);
    tap(lineId ? `[data-line="${lineId}"]` : '[data-line]');
  }

  it('renders the wheel, the reads and the record — the UI Samar wanted back', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);   // the wheel
    expect(q('.r-face')).not.toBeNull();                            // his face read
    expect(q('[data-open-record]')).not.toBeNull();                 // the record
    expect(q('.dial')).not.toBeNull();
    // and the two clocks that can end you
    expect(q('.minebars .mini.you')).not.toBeNull();
    expect(q('.minebars .mini.pat')).not.toBeNull();
  });

  it('a wedge opens the cyan modal with his lines', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    tap('[data-angle="plant_doubt"]');
    expect(q('.modal')).not.toBeNull();
    expect(root.querySelectorAll('[data-line]').length).toBeGreaterThan(0);
  });

  it('the risk you are shown comes from YOUR read — a wrong call makes it lie', () => {
    // he is PROUD. offer_out backfires on the proud... but a player who called
    // him GREEDY is shown the risk for a greedy man, where offer_out lands.
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'greedy');
    tap('[data-angle="offer_out"]');
    const shown = q('[data-risk]')!.dataset.risk;

    root.innerHTML = '';
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    tap('[data-angle="offer_out"]');
    const truthful = q('[data-risk]')!.dataset.risk;

    expect(shown).not.toBe(truthful);   // your bad read = your instruments lie
    expect(truthful).toBe('high');
  });

  it('the record NEVER flags the lie for you', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    move('plant_doubt', 'l_doubt1');    // emits the lie that his ledger disproves
    tap('[data-open-record]');
    expect(root.textContent).not.toMatch(/doesn't add up|contradicted himself|corner him/i);
    expect(q('[data-catch]')).toBeNull();          // no pre-built accusation
    expect(root.querySelectorAll('[data-stmt]').length).toBeGreaterThan(0);
  });

  it('YOU assemble the accusation — right guts him', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    move('plant_doubt', 'l_doubt1');
    const before = parseFloat(q('.cbar i')!.style.width);
    tap('[data-open-record]');
    tap('[data-stmt="s_book"]');        // you say THIS is the lie
    tap('[data-against="skims"]');      // and your skims card proves it
    expect(parseFloat(q('.cbar i')!.style.width)).toBeLessThan(before - 20);
  });

  it('a wrong accusation costs you — you called a man a liar with nothing', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    move('plant_doubt', 'l_doubt1');
    const yourBefore = parseFloat(q('.mini.you .mbar i')!.style.width);
    tap('[data-open-record]');
    tap('[data-stmt="s_book"]');
    tap('[data-against="ledger"]');     // wrong card — proves nothing
    expect(parseFloat(q('.mini.you .mbar i')!.style.width)).toBeLessThan(yourBefore);
    expect(q('.convo')?.textContent).toMatch(/Show me/i);
  });

  it('leverage exists only if you dug it up in recon', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, new Set<IntelId>(['lev:ledger']), 'proud');
    tap('[data-open-record]');
    expect(q('[data-deploy="ledger"]')).not.toBeNull();
    expect(q('[data-deploy="skims"]')).toBeNull();
  });

  it('played cold, leverage is brushed off — it is a finisher, not a button', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    tap('[data-open-record]');
    tap('[data-deploy="ledger"]');      // he's at 100, nowhere near breaking
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(q('.convo')?.textContent).toMatch(/Cute/i);
  });

  it('you WIN by reading him right, then finishing', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud', () => { done = true; });
    move('plant_doubt', 'l_doubt1');    // lands on proud: 100 -> 80
    move('flatter', 'l_flat1');         // lands on proud:  80 -> 60
    tap('[data-open-record]');
    tap('[data-stmt="s_book"]'); tap('[data-against="skims"]');   // caught: 60 -> 32
    tap('[data-open-record]');
    tap('[data-deploy="ledger"]');      // now under 45 → the finisher lands
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
    tap('[data-continue]');
    expect(done).toBe(true);
  });

  it('you can LOSE — misread him and he turns it on you', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL(), 'proud');
    for (let i = 0; i < 8; i += 1) {
      if (!q('[data-angle="offer_out"]')) break;
      move('offer_out');                // backfires on a proud man, every time
    }
    expect(root.textContent).toMatch(/TURNED IT ON YOU|HE WALKED/i);
    expect(root.textContent).not.toMatch(/FOLDED/i);
  });
});
