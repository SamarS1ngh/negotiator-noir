import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import type { IntelId } from '../domain/types';

const FULL_INTEL = (): Set<IntelId> => new Set<IntelId>(['type', 'tell', 'lie', 'lev:skims', 'lev:ledger']);

describe('living duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function click(elm: Element) { elm.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
  function tap(sel: string) { click(q(sel)!); }
  // He pushes back after the first move (and again when rattled). Hold firm to
  // get back to your own choices.
  function clearPush() { const p = q('[data-push="0"]'); if (p) click(p); }
  function pct(sel: string) { return parseFloat(q(sel)!.style.width); }

  it('opens on his line with your moves — no risk telegraph, three gauges, a dossier', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    expect(q('.cine-say')?.textContent).toContain(COLLECTOR.name);
    expect(root.textContent).toContain('Five hundred');
    expect(root.querySelectorAll('[data-choice][data-kind="move"]').length).toBe(5);
    expect(root.querySelector('[data-risk]')).toBeNull();
    expect(q('.gauge.his')).not.toBeNull();
    expect(q('.gauge.you')).not.toBeNull();
    expect(q('.gauge.patience')).not.toBeNull();
    expect(q('[data-dossier]')).not.toBeNull();
  });

  it('your hand is what you dug up — leverage only exists if you found it in recon', () => {
    // found the ledger, NOT the skims card
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, new Set<IntelId>(['lev:ledger']));
    tap('[data-choice="l_flat1"]');
    clearPush();
    expect(root.querySelector('[data-choice="ledger"]')).not.toBeNull();
    expect(root.querySelector('[data-choice="skims"]')).toBeNull();
  });

  it('with no intel you have no leverage at all', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, new Set<IntelId>());
    tap('[data-choice="l_flat1"]');
    clearPush();
    expect(root.querySelectorAll('[data-choice][data-kind="deploy"]').length).toBe(0);
  });

  it('he pushes back after your first move — caving bleeds your nerve', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    tap('[data-choice="l_flat1"]');
    // he's pressing you now
    expect(root.querySelectorAll('[data-push]').length).toBeGreaterThan(0);
    const yourBefore = pct('.gauge.you .gauge-bar i');
    click(q('[data-push="1"]')!); // give ground
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
  });

  it('a landing move drops his nerve', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const before = pct('.gauge.his .gauge-bar i');
    tap('[data-choice="l_doubt1"]');
    clearPush();
    expect(pct('.gauge.his .gauge-bar i')).toBeLessThan(before);
    expect(q('.cine-history')?.textContent).toContain('Marlowe quoted me');
  });

  it('leverage is a FINISHER — played cold it backfires, not a free win', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    tap('[data-choice="l_flat1"]');
    clearPush();
    const yourBefore = pct('.gauge.you .gauge-bar i');
    tap('[data-choice="ledger"]'); // he's still composed → cold
    clearPush();
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
  });

  it('you WIN by working him down first, then finishing with leverage', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL(), () => { done = true; });
    clearPush(); tap('[data-choice="l_flat1"]');
    clearPush(); tap('[data-choice="l_doubt1"]');
    clearPush(); tap('[data-kind="call"]');     // catch the contradiction plant_doubt opened
    clearPush(); tap('[data-choice="ledger"]'); // now low enough → finisher lands
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
    tap('[data-continue]');
    expect(done).toBe(true);
  });

  it('you can LOSE — flailing bleeds your nerve and burns his patience', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    clearPush(); tap('[data-choice="l_offer1"]'); // backfires on a proud man
    for (let i = 0; i < 14; i += 1) {
      clearPush();
      const call = q('[data-kind="call"]');
      if (!call) break;
      click(call);
    }
    expect(root.textContent).toMatch(/TURNED IT ON YOU|HE WALKED/i);
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')).toBeNull();
  });
});
