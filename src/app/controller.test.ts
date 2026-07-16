import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('cinematic duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function tap(sel: string) { q(sel)!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }

  it('opens on his line with your moves as choices (no dial, no record screen)', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    // his opening line is on screen
    expect(q('.cine-say')?.textContent).toContain(COLLECTOR.name);
    expect(root.textContent).toContain('Five hundred');
    // a manipulation move per angle, tagged with intent + risk — and no legacy UI
    expect(root.querySelectorAll('[data-choice][data-kind="move"]').length).toBe(5);
    expect(root.querySelector('.c-intent')).not.toBeNull();
    expect(root.querySelector('[data-risk]')).not.toBeNull();
    expect(root.querySelector('.dial')).toBeNull();
    expect(root.querySelector('[data-open-record]')).toBeNull();
  });

  it('holds leverage back on the opening beat, then offers it as a hot choice after a move', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    // opening beat: pure manipulation moves, no leverage spoiling it yet
    expect(root.querySelectorAll('[data-choice][data-kind="deploy"]').length).toBe(0);
    // size him up with one move → your hold surfaces as hot deploy choices
    const flat = COLLECTOR_SCRIPT.lines.find((l) => l.angleId === 'flatter')!;
    tap(`[data-choice="${flat.id}"]`);
    expect(root.querySelectorAll('[data-choice][data-kind="deploy"]').length).toBe(2);
    expect(root.querySelector('.choice.hot')).not.toBeNull();
  });

  it('a move plays his reply into the scene and shifts his nerve', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find((l) => l.angleId === 'plant_doubt')!;
    const before = q('.nerve-bar i')!.style.width;
    tap(`[data-choice="${doubt.id}"]`);
    // his scripted reply is now the current line, and prior lines moved to history
    expect(q('.cine-say')?.textContent).toContain("I run my own book");
    expect(q('.cine-history')?.textContent).toContain(doubt.text);
    // planting doubt on a proud mark lands → his nerve bar dropped
    expect(q('.nerve-bar i')!.style.width).not.toBe(before);
    // the read (what you noticed) surfaced
    expect(q('.cine-read')).not.toBeNull();
  });

  it('plays a full duel to a fold through inline choices', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });

    // open the crack first: plant_doubt emits the lie that contradicts held leverage
    const doubt = COLLECTOR_SCRIPT.lines.find((l) => l.angleId === 'plant_doubt')!;
    tap(`[data-choice="${doubt.id}"]`);

    for (let i = 0; i < 24 && !done; i += 1) {
      if (q('[data-continue]')) { tap('[data-continue]'); continue; }
      // always take a hot opening (catch/deploy/press) if one is live, else a move
      const hot = root.querySelector<HTMLElement>('[data-kind="catch"],[data-kind="deploy"],[data-kind="press"]');
      const move = root.querySelector<HTMLElement>('[data-choice]');
      const btn = hot ?? move;
      if (!btn) break;
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    expect(done).toBe(true);
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('.reveal')?.textContent).toContain('MARLOWE');
  });
});
