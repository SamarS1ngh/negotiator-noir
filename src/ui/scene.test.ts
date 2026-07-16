import { describe, it, expect, beforeEach } from 'vitest';
import { renderCine } from './scene';
import type { CineView, Choice } from './scene';
import { COLLECTOR } from '../content/collector';

function baseView(over: Partial<CineView> = {}): CineView {
  return {
    objective: 'BREAK RICCI',
    hisName: 'Ricci',
    mood: 'guarded',
    hisNerveWord: 'steady',
    hisNervePct: 100,
    yourNervePct: 100,
    patiencePct: 100,
    history: [],
    hisLine: 'Five hundred. That’s the number.',
    face: undefined,
    teach: undefined,
    choices: [],
    ...over,
  };
}

describe('cinematic scene', () => {
  let root: HTMLElement;
  const noop = { choose() {}, walk() {} };
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders his line, the objective and all three gauges (his nerve, your nerve, his patience)', () => {
    renderCine(root, COLLECTOR, baseView({ hisNervePct: 70, yourNervePct: 40, patiencePct: 50 }), noop);
    expect(root.querySelector('.cine-say')?.textContent).toContain('Five hundred');
    expect(root.querySelector('.cine-obj')?.textContent).toContain('RICCI');
    expect(root.querySelector('.gauge.his .gauge-bar i')?.getAttribute('style')).toContain('70%');
    expect(root.querySelector('.gauge.you .gauge-bar i')?.getAttribute('style')).toContain('40%');
    expect(root.querySelector('.gauge.patience .gauge-bar i')?.getAttribute('style')).toContain('50%');
  });

  it('renders moves with an intent and NO risk telegraph; gambits are marked but not "hot"', () => {
    const choices: Choice[] = [
      { id: 'call', kind: 'call', text: 'You’re lying.' },
      { id: 'lev1', kind: 'deploy', text: 'Use what you know.' },
      { id: 'l1', kind: 'move', text: 'Flatter.', intent: 'flatter him' },
    ];
    renderCine(root, COLLECTOR, baseView({ choices }), noop);
    expect(root.querySelectorAll('[data-choice]').length).toBe(3);
    // no risk dots leaked anywhere — you judge, the game doesn't tell you
    expect(root.querySelector('[data-risk]')).toBeNull();
    expect(root.querySelector('.c-risk')).toBeNull();
    // gambits are styled distinct (amber), moves are plain
    expect(root.querySelector('[data-kind="call"]')?.classList.contains('gambit')).toBe(true);
    expect(root.querySelector('[data-kind="move"]')?.classList.contains('gambit')).toBe(false);
    expect(root.querySelector('[data-kind="move"] .c-intent')?.textContent).toContain('flatter');
  });

  it('shows his observable tell as read material (not an interpretation)', () => {
    renderCine(root, COLLECTOR, baseView({ face: 'his hand keeps drifting to his watch' }), noop);
    expect(root.querySelector('.cine-read')?.textContent).toContain('watch');
  });

  it('fires choose() with the chosen choice', () => {
    let picked: Choice | null = null;
    const choices: Choice[] = [{ id: 'l1', kind: 'move', text: 'x', intent: 'bluff him' }];
    renderCine(root, COLLECTOR, baseView({ choices }), { choose: (c) => { picked = c; }, walk() {} });
    root.querySelector<HTMLElement>('[data-choice="l1"]')!.click();
    expect(picked).not.toBeNull();
    expect(picked!.id).toBe('l1');
  });

  it('typewriter mode shows a partial line with a caret and no choices', () => {
    renderCine(root, COLLECTOR, baseView({ typedLen: 4, choices: [] }), noop);
    expect(root.querySelector('.cine-say .line')?.textContent).toContain('Five');
    expect(root.querySelector('.caret')).not.toBeNull();
    expect(root.querySelector('.cine-choices')).toBeNull();
  });

  it('has a walk-away affordance', () => {
    renderCine(root, COLLECTOR, baseView(), noop);
    expect(root.querySelector('[data-walk]')).not.toBeNull();
  });
});
