import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import type { IntelId } from '../domain/types';

const FULL_INTEL = (): Set<IntelId> => new Set<IntelId>(['type', 'tell', 'lie', 'lev:skims', 'lev:ledger']);

describe('hands-on duel (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function pct(sel: string) { return parseFloat(q(sel)!.style.width); }

  // ---- gestures, as real pointer input on his face ----
  function ptr(el: Element, type: string, x: number, y: number) {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
  }
  function swipe(dy: number) {
    const s = q('[data-surface]')!;
    ptr(s, 'pointerdown', 200, 400);
    ptr(s, 'pointermove', 200, 400 + dy);
    ptr(s, 'pointerup', 200, 400 + dy);
  }
  const press = () => swipe(-90);   // up
  const ease = () => swipe(90);     // down
  function stare(holdMs: number) {
    const s = q('[data-surface]')!;
    const t = Date.now();
    vi.setSystemTime(t);
    ptr(s, 'pointerdown', 200, 400);
    vi.setSystemTime(t + holdMs);
    ptr(s, 'pointerup', 200, 400);
    vi.setSystemTime(t);
  }
  function tapFlash() {
    const s = q('[data-surface]')!;
    const t = Date.now();
    vi.setSystemTime(t);
    ptr(s, 'pointerdown', 200, 400);
    vi.setSystemTime(t + 60);
    ptr(s, 'pointerup', 200, 400);
    vi.setSystemTime(t);
  }
  function slamCard() {
    const c = q('[data-card]')!;
    ptr(c, 'pointerdown', 200, 800);
    ptr(c, 'pointerup', 200, 700);
  }

  it('his face is the interface — no option list anywhere', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    expect(q('[data-surface]')).not.toBeNull();
    expect(root.querySelectorAll('[data-choice]').length).toBe(0);
    expect(root.querySelectorAll('[data-line]').length).toBe(0);
    expect(q('.dial')).toBeNull();
    // the three bars + the window remain
    expect(q('.gauge.his')).not.toBeNull();
    expect(q('.gauge.you')).not.toBeNull();
    expect(q('.gauge.patience')).not.toBeNull();
    expect(q('.window-ring')).not.toBeNull();
  });

  it('a stare lands on a composed proud man — swipe up does not', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const before = pct('.gauge.his .gauge-bar i');
    stare(1100);                                  // hold, released at the peak
    expect(pct('.gauge.his .gauge-bar i')).toBeLessThan(before);

    // fresh duel: pressing a composed proud man is nothing (he steadies)
    root.innerHTML = '';
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const yourBefore = pct('.gauge.you .gauge-bar i');
    press();
    expect(pct('.gauge.his .gauge-bar i')).toBeGreaterThanOrEqual(100);
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
  });

  it('easing off a proud man backfires — it bleeds YOU', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const yourBefore = pct('.gauge.you .gauge-bar i');
    ease();
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore - 10);
    expect(q('.hands-note')?.textContent).toMatch(/wrong read/i);
  });

  it('the stare is a timing act — flinch early or overhold and it costs you', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    let yourBefore = pct('.gauge.you .gauge-bar i');
    stare(400);                                   // let go too soon
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
    expect(q('.hands-note')?.textContent).toMatch(/flinch/i);

    root.innerHTML = '';
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    yourBefore = pct('.gauge.you .gauge-bar i');
    stare(2600);                                  // held way too long
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
    expect(q('.hands-note')?.textContent).toMatch(/overheld/i);
  });

  it('the read MOVES — silence while he is composed, pressure once he is off balance', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    stare(1100);   // guarded  → lands: 100 -> 80 (still composed)
    stare(1100);   // guarded  → lands:  80 -> 60 (now he's rattled)
    expect(pct('.gauge.his .gauge-bar i')).toBe(60);

    // a third stare would be the WRONG read now — he re-sets
    const before = pct('.gauge.his .gauge-bar i');
    press();       // rattled → pressing is what lands
    expect(pct('.gauge.his .gauge-bar i')).toBeLessThan(before);
    expect(q('.hands-note')?.textContent).toMatch(/got in/i);
  });

  it('staring a RATTLED man does nothing — the same move stops working', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    stare(1100); stare(1100);                     // → 60, rattled
    const before = pct('.gauge.his .gauge-bar i');
    stare(1100);                                  // wrong register for this state
    expect(pct('.gauge.his .gauge-bar i')).toBeGreaterThanOrEqual(before);
    expect(q('.hands-note')?.textContent).toMatch(/nothing/i);
  });

  it('aiming SHOWS you the words before you say them', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const s = q('[data-surface]')!;
    expect(q('.aim-preview')?.classList.contains('on')).toBe(false);

    // start pulling up — the line you'd say appears, and you haven't committed
    ptr(s, 'pointerdown', 200, 400);
    ptr(s, 'pointermove', 200, 370);
    const pv = q('.aim-preview')!;
    expect(pv.classList.contains('on')).toBe(true);
    expect(pv.dataset.aim).toBe('press');
    expect(q('.pv-line')?.textContent).toContain("You're a long way from your boss's office");
    expect(pct('.gauge.his .gauge-bar i')).toBe(100);   // nothing said yet

    // pulling the other way previews the other line
    ptr(s, 'pointermove', 200, 440);
    expect(q('.aim-preview')?.dataset.aim).toBe('ease');
    expect(q('.pv-line')?.textContent).toContain('Walk with half now');
    ptr(s, 'pointerup', 200, 440);
  });

  it('your card sits fully on screen, inside the bottom stack (not under the fold)', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    const card = q('[data-card]')!;
    expect(card).not.toBeNull();
    // it lives in the flow of the bottom stack — nothing can push it off-screen
    expect(card.closest('.hands-bottom')).not.toBeNull();
    expect(card.className).not.toMatch(/absolute/);
    expect(card.textContent).toMatch(/drag up/i);
  });

  it('your card is a card you drag, not a button — and cold it backfires', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    expect(q('[data-card]')).not.toBeNull();
    const yourBefore = pct('.gauge.you .gauge-bar i');
    slamCard();                                   // he's still composed → too early
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(pct('.gauge.you .gauge-bar i')).toBeLessThan(yourBefore);
    expect(q('.hands-note')?.textContent).toMatch(/too early/i);
  });

  it('no card if you never dug it up in recon', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, new Set<IntelId>());
    expect(q('[data-card]')).toBeNull();
  });

  it('you WIN by reading each beat, then finishing with the card', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL(), () => { done = true; });
    stare(1100);   // guarded → lands  100 -> 80
    stare(1100);   // guarded → lands   80 -> 60 (rattled now)
    press();       // rattled → lands   60 -> 40 (his read moved)
    // he's under the finisher threshold — now the card breaks him
    slamCard();
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
    q('[data-continue]')!.click();
    expect(done).toBe(true);
  });

  it('you can LOSE — keep misreading him and he turns it on you', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, FULL_INTEL());
    for (let i = 0; i < 8; i += 1) {
      if (!q('[data-surface]')) break;
      ease();                                     // always the wrong read on a proud man
    }
    expect(root.textContent).toMatch(/TURNED IT ON YOU|HE WALKED/i);
    expect(root.textContent).not.toMatch(/FOLDED/i);
  });
});
