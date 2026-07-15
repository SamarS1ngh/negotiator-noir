import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  function tap(sel: string) { q(sel)!.click(); }
  // Clear any transient beat screens (probe reaction / catch / deploy beats,
  // or a tell spike) so the next real move can be made.
  function clearBeats() {
    for (let i = 0; i < 5; i += 1) {
      if (q('[data-continue]')) { tap('[data-continue]'); continue; }
      if (q('[data-pass]')) { tap('[data-pass]'); continue; }
      break;
    }
  }

  it('plays a full duel to a fold via probe → catch → deploy', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // opening probe: plant_doubt's first line (emits the catchable statement)
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    tap(`[data-angle="plant_doubt"]`);
    tap(`[data-line="${doubt.id}"]`);
    clearBeats();                    // his reaction beat (+ a spike if any)
    // open record → catch the contradiction → deploy the leverage
    tap('[data-open-record]');
    if (q('[data-catch]')) { tap('[data-catch]'); clearBeats(); }
    if (q('[data-open-record]')) tap('[data-open-record]');
    if (q('[data-deploy]')) { tap('[data-deploy]'); clearBeats(); }
    // grind remaining probes until an end screen fires
    for (let i = 0; i < 14 && !done; i += 1) {
      if (q('[data-continue]')) { tap('[data-continue]'); continue; }
      if (q('[data-pass]')) { tap('[data-pass]'); continue; }
      const a = q('[data-angle]'); if (!a) break;
      a.click();
      const l = q('[data-line]'); if (l) l.click();
    }
    expect(done).toBe(true);
  });
});
