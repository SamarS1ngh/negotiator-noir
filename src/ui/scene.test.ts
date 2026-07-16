import { describe, it, expect, beforeEach } from 'vitest';
import { renderCine } from './scene';
import type { CineView, Choice } from './scene';
import { COLLECTOR } from '../content/collector';

function baseView(over: Partial<CineView> = {}): CineView {
  return {
    objective: 'BREAK RICCI',
    hisName: 'Ricci',
    mood: 'guarded',
    nerveWord: 'steady',
    nervePct: 100,
    history: [],
    hisLine: 'Five hundred. That’s the number.',
    read: undefined,
    teach: undefined,
    choices: [],
    ...over,
  };
}

describe('cinematic scene', () => {
  let root: HTMLElement;
  const noop = { choose() {}, walk() {} };
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders his line, the objective and his nerve gauge', () => {
    renderCine(root, COLLECTOR, baseView(), noop);
    expect(root.querySelector('.cine-say')?.textContent).toContain('Five hundred');
    expect(root.querySelector('.cine-obj')?.textContent).toContain('RICCI');
    expect(root.querySelector('.nerve')?.textContent).toContain('steady');
    expect(root.querySelector('.nerve-bar i')?.getAttribute('style')).toContain('100%');
  });

  it('renders moves with intent + risk, and hot openings for catch/deploy/press', () => {
    const choices: Choice[] = [
      { id: 'c1', kind: 'catch', text: 'That’s not what you said.' },
      { id: 'lev1', kind: 'deploy', text: 'Use what you know.' },
      { id: 'l1', kind: 'move', text: 'Flatter.', intent: 'flatter him', risk: 'uncertain' },
    ];
    renderCine(root, COLLECTOR, baseView({ choices }), noop);
    expect(root.querySelectorAll('[data-choice]').length).toBe(3);
    expect(root.querySelector('[data-kind="catch"]')?.classList.contains('hot')).toBe(true);
    expect(root.querySelector('[data-kind="move"]')?.classList.contains('hot')).toBe(false);
    expect(root.querySelector('[data-kind="move"] .c-intent')?.textContent).toContain('flatter');
    expect(root.querySelector('[data-risk="uncertain"]')).not.toBeNull();
  });

  it('fires choose() with the chosen choice', () => {
    let picked: Choice | null = null;
    const choices: Choice[] = [{ id: 'l1', kind: 'move', text: 'x', intent: 'bluff him', risk: 'high' }];
    renderCine(root, COLLECTOR, baseView({ choices }), { choose: (c) => { picked = c; }, walk() {} });
    root.querySelector<HTMLElement>('[data-choice="l1"]')!.click();
    expect(picked).not.toBeNull();
    expect(picked!.id).toBe('l1');
  });

  it('typewriter mode shows a partial line with a caret and no choices', () => {
    renderCine(root, COLLECTOR, baseView({ typedLen: 4, choices: [] }), noop);
    const line = root.querySelector('.cine-say .line')!;
    expect(line.textContent).toContain('Five'.slice(0, 4));
    expect(root.querySelector('.caret')).not.toBeNull();
    expect(root.querySelector('.cine-choices')).toBeNull();
  });

  it('has a walk-away affordance', () => {
    renderCine(root, COLLECTOR, baseView(), noop);
    expect(root.querySelector('[data-walk]')).not.toBeNull();
  });
});
