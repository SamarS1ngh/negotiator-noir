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

  it('you WIN by reading him right — flatter + doubt land, then leverage breaks him', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // proud mark: flattery + doubt land; then slap down both leverages
    tap('[data-choice="l_flat1"]');
    tap('[data-choice="l_doubt1"]');
    tap('[data-choice="skims"]');
    tap('[data-choice="ledger"]');
    // reaching the aftermath as a fold IS the win
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
    tap('[data-continue]');
    expect(done).toBe(true);
  });

  it('you can LOSE — false accusations bleed your nerve until he turns it on you', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // size him up once, then keep crying "liar". The first call catches his lie;
    // every call after that is a false accusation — each one bleeds your nerve.
    tap('[data-choice="l_flat1"]');
    for (let i = 0; i < 12; i += 1) {
      const call = q('[data-kind="call"]');
      if (!call) break; // gone once the duel ends (aftermath screen)
      call.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    // he read you and flipped it — that's the loss
    expect(root.textContent).toMatch(/TURNED IT ON YOU/i);
    // a loss shows no break payoff
    expect(root.querySelector('.reveal')).toBeNull();
    tap('[data-continue]');
    expect(done).toBe(true);
  });
});
