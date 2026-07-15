import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function tap(sel: string) { root.querySelector<HTMLElement>(sel)!.click(); }

  it('plays a full duel to a fold via probe → catch → deploy', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // probe with plant_doubt's first line
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    tap(`[data-angle="plant_doubt"]`);
    tap(`[data-line="${doubt.id}"]`);
    // if a spike appeared, pass it
    if (root.querySelector('[data-pass]')) tap('[data-pass]');
    // open record, catch, then deploy
    tap('[data-open-record]');
    if (root.querySelector('[data-catch]')) { tap('[data-catch]'); if (root.querySelector('[data-continue]')) tap('[data-continue]'); }
    if (root.querySelector('[data-open-record]')) tap('[data-open-record]');
    if (root.querySelector('[data-deploy]')) { tap('[data-deploy]'); if (root.querySelector('[data-continue]')) tap('[data-continue]'); }
    // grind remaining probes until an end screen appears
    for (let i = 0; i < 6 && !done; i++) {
      const a = root.querySelector<HTMLElement>('[data-angle]'); if (a) { a.click();
        const l = root.querySelector<HTMLElement>('[data-line]'); if (l) l.click();
        if (root.querySelector('[data-pass]')) tap('[data-pass]'); }
      if (root.querySelector('[data-continue]')) tap('[data-continue]');
    }
    expect(done).toBe(true);
  });
});
