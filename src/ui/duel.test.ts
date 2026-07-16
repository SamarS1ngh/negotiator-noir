import { describe, it, expect, beforeEach } from 'vitest';
import { renderDuel } from './duel';
import type { AngleId } from '../domain/types';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import { initDuel } from '../domain/engine';

describe('duel screen', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  // The dial's wedges are SVG <path> elements — jsdom (like the DOM spec)
  // doesn't implement `.click()` on SVGElement, only on HTMLElement, so a
  // real click event has to be dispatched instead.
  function tap(el: Element) { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }

  it('renders the dial (5 angle wedges) and no modal until an angle is picked', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} }, {
      selectedAngle: null, transcript: [],
    });
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);
    expect(root.querySelectorAll('[data-line]').length).toBe(0);
    expect(root.querySelector('.modal')).toBeNull();
  });

  it('tapping a wedge opens the modal with lines (risk dot, no numbers)', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    let selectedAngle: AngleId | null = null;

    function render() {
      renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, {
        probe(){},
        pickAngle(a) { selectedAngle = a; render(); },
        openRecord(){},
        closeModal() { selectedAngle = null; render(); },
      }, { selectedAngle, transcript: [] });
    }
    render();

    const wedge = root.querySelector('[data-angle="plant_doubt"]')!;
    tap(wedge);

    expect(root.querySelector('.modal')).not.toBeNull();
    const lines = root.querySelectorAll('[data-line]');
    expect(lines.length).toBeGreaterThan(0);
    expect(root.querySelector('[data-risk]')).not.toBeNull();
    expect(root.textContent).not.toMatch(/[-+]\d+/); // no raw effect numbers leaked

    // the close (✕) affordance is preserved
    const closeBtn = root.querySelector<HTMLElement>('[data-close]')!;
    tap(closeBtn);
    expect(root.querySelector('.modal')).toBeNull();
  });

  it('shows the objective bar from opp.objective', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} }, {
      selectedAngle: null, transcript: [],
    });
    expect(root.querySelector('.top')?.textContent).toContain('RICCI');
  });

  it('docks the verdict read (no punch) when a reaction is present but not fresh', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} },
      { selectedAngle: null, transcript: [], reaction: { band: 'lands', fresh: false } },
    );
    expect(root.querySelector('.r-verdict')?.textContent).toContain('HE FLINCHED');
    expect(root.querySelector('.verdict-punch')).toBeNull();
  });

  it('punches the verdict out on a fresh reaction', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} },
      { selectedAngle: null, transcript: [], reaction: { band: 'backfires', fresh: true } },
    );
    expect(root.querySelector('.verdict-punch')?.textContent).toContain('THAT BACKFIRED');
  });

  it('renders the conversation transcript, newest at bottom', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} },
      { selectedAngle: null, transcript: [
        { who: 'you', text: 'Marlowe quoted me different terms than you did.' },
        { who: 'him', text: "I run my own book. I don't answer to Marlowe.", quoted: true },
      ] },
    );
    const turns = root.querySelectorAll('.convo .turn');
    expect(turns.length).toBe(2);
    expect(turns[turns.length - 1]?.textContent).toContain('Marlowe');
    expect(turns[turns.length - 1]?.className).toContain('him');
  });

  it('shows the cut-to-him typewriter bar instead of the dial while it is active', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(
      root, s, COLLECTOR, COLLECTOR_SCRIPT,
      { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} },
      { selectedAngle: null, transcript: [], cutToHim: { text: 'hello', typed: 'hel', done: false, quoted: false } },
    );
    expect(root.querySelector('.cut-to-him')?.textContent).toContain('hel');
    expect(root.querySelector('.dialwrap')).toBeNull();
  });

  it('preserves the data-open-record affordance', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){}, closeModal(){} }, {
      selectedAngle: null, transcript: [],
    });
    expect(root.querySelector('[data-open-record]')).not.toBeNull();
  });
});
