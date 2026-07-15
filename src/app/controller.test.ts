import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function q(sel: string) { return root.querySelector<HTMLElement>(sel); }
  // Dispatch a real click event rather than calling `.click()` — the angle
  // dial's wedges are SVG <path> elements, and jsdom (like the DOM spec)
  // doesn't implement `.click()` on SVGElement, only on HTMLElement.
  function tap(sel: string) { q(sel)!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
  // Clear any transient beat screens (catch / deploy beats, or a tell spike)
  // so the next real move can be made. A probe's verdict is now INLINE on
  // the duel screen itself (punches out, then docks) — there is no separate
  // reaction screen/continue to clear for it.
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
    clearBeats();                    // only a spike (if a tell fired) to clear
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
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      const l = q('[data-line]');
      if (l) l.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    expect(done).toBe(true);
  });

  it('renders the probe verdict INLINE on the duel screen, not a separate reaction screen', () => {
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    tap(`[data-angle="plant_doubt"]`);
    tap(`[data-line="${doubt.id}"]`);
    // still the duel screen — angle wedges are back, plus a docked verdict.
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);
    expect(root.querySelector('.f-verdict')).not.toBeNull();
    expect(root.querySelector('.reaction-screen')).toBeNull();
  });
});
