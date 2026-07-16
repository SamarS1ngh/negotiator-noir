import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('cinematic duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function tap(sel: string) { q(sel)!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }

  it('opens on his line with your moves as choices — no dial, no risk telegraph', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    expect(q('.cine-say')?.textContent).toContain(COLLECTOR.name);
    expect(root.textContent).toContain('Five hundred');
    expect(root.querySelectorAll('[data-choice][data-kind="move"]').length).toBe(5);
    expect(root.querySelector('.c-intent')).not.toBeNull();
    // the game does NOT tell you the risk — no dots, no dial, no record screen
    expect(root.querySelector('[data-risk]')).toBeNull();
    expect(root.querySelector('.dial')).toBeNull();
    expect(root.querySelector('[data-open-record]')).toBeNull();
    // two nerve gauges: his to break, yours to protect
    expect(q('.gauge.his')).not.toBeNull();
    expect(q('.gauge.you')).not.toBeNull();
  });

  it('holds the gambits back on the opening beat, then offers call + leverage after a move', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    expect(root.querySelectorAll('[data-kind="call"]').length).toBe(0);
    expect(root.querySelectorAll('[data-kind="deploy"]').length).toBe(0);
    const flat = COLLECTOR_SCRIPT.lines.find((l) => l.angleId === 'flatter')!;
    tap(`[data-choice="${flat.id}"]`);
    expect(root.querySelectorAll('[data-kind="call"]').length).toBe(1);
    expect(root.querySelectorAll('[data-kind="deploy"]').length).toBe(2);
    expect(root.querySelector('.choice.gambit')).not.toBeNull();
  });

  it('a landing move plays his reply and drops his nerve', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find((l) => l.angleId === 'plant_doubt')!;
    const before = q('.gauge.his .gauge-bar i')!.style.width;
    tap(`[data-choice="${doubt.id}"]`);
    expect(q('.cine-say')?.textContent).toContain("I run my own book");
    expect(q('.cine-history')?.textContent).toContain(doubt.text);
    expect(q('.gauge.his .gauge-bar i')!.style.width).not.toBe(before);
  });

  it('leverage is a FINISHER — played cold (he\'s composed) it backfires, not a free win', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    tap('[data-choice="l_flat1"]'); // one land → he's at ~80, still composed; unlocks leverage
    const yourBefore = parseFloat(q('.gauge.you .gauge-bar i')!.style.width);
    tap('[data-choice="ledger"]'); // deploy while he's steady = cold
    // he brushed it off: HIS nerve is nowhere near broken, YOUR nerve took the hit
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(root.querySelectorAll('[data-choice]').length).toBeGreaterThan(0); // still playing
    expect(parseFloat(q('.gauge.you .gauge-bar i')!.style.width)).toBeLessThan(yourBefore);
  });

  it('you WIN only by working him down first, then finishing with leverage', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // proud mark: flattery + doubt land and rattle him; catch his lie; NOW the
    // leverage finishes a man already on the ropes.
    tap('[data-choice="l_flat1"]');
    tap('[data-choice="l_doubt1"]');
    tap('[data-kind="call"]');       // catches the contradiction plant_doubt opened
    tap('[data-choice="ledger"]');   // his nerve now low enough → finisher lands
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
    tap('[data-continue]');
    expect(done).toBe(true);
  });

  it('you can LOSE — flailing bleeds your nerve and burns his patience', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // offer a proud man an out (backfire), then cry liar with nothing — bleeds
    // your nerve AND his patience until the duel ends against you.
    tap('[data-choice="l_offer1"]');
    for (let i = 0; i < 12; i += 1) {
      const call = q('[data-kind="call"]');
      if (!call) break;
      call.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    // a loss — he either turns it on you or walks out; never a fold
    expect(root.textContent).toMatch(/TURNED IT ON YOU|HE WALKED/i);
    expect(root.textContent).not.toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')).toBeNull();
    tap('[data-continue]');
    expect(done).toBe(true);
  });
});
