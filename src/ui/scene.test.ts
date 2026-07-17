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
    dossier: [],
    ...over,
  };
}

describe('cinematic scene', () => {
  let root: HTMLElement;
  const noop = { choose() {}, walk() {}, respond() {}, openDossier() {}, closeDossier() {} };
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders his line, the objective and all three gauges (his nerve, your nerve, his patience)', () => {
    renderCine(root, COLLECTOR, baseView({ hisNervePct: 70, yourNervePct: 40, patiencePct: 50 }), noop);
    expect(root.querySelector('.cine-say')?.textContent).toContain('Five hundred');
    expect(root.querySelector('.cine-obj')?.textContent).toContain('RICCI');
    expect(root.querySelector('.gauge.his .gauge-bar i')?.getAttribute('style')).toContain('70%');
    expect(root.querySelector('.gauge.you .gauge-bar i')?.getAttribute('style')).toContain('40%');
    expect(root.querySelector('.gauge.patience .gauge-bar i')?.getAttribute('style')).toContain('50%');
  });

  it('renders moves LABEL-FIRST (no dialogue to read) with no risk telegraph', () => {
    const choices: Choice[] = [
      { id: 'call', kind: 'call', label: 'CALL HIS LIE' },
      { id: 'lev1', kind: 'deploy', label: 'PLAY YOUR CARD', hint: 'the ledger' },
      { id: 'l1', kind: 'move', label: 'FLATTER', hint: 'feed his ego' },
    ];
    renderCine(root, COLLECTOR, baseView({ choices }), noop);
    expect(root.querySelectorAll('[data-choice]').length).toBe(3);
    // no risk dots leaked anywhere — you judge, the game doesn't tell you
    expect(root.querySelector('[data-risk]')).toBeNull();
    expect(root.querySelector('.c-risk')).toBeNull();
    // gambits are styled distinct (amber), moves are plain
    expect(root.querySelector('[data-kind="call"]')?.classList.contains('gambit')).toBe(true);
    expect(root.querySelector('[data-kind="move"]')?.classList.contains('gambit')).toBe(false);
    // the MOVE is the button — a label + a short hint, never a sentence to read
    expect(root.querySelector('[data-kind="move"] .c-label')?.textContent).toBe('FLATTER');
    expect(root.querySelector('[data-kind="move"] .c-hint')?.textContent).toBe('feed his ego');
    expect(root.querySelector('[data-kind="move"]')?.textContent).not.toContain('"');
  });

  it('shows his observable tell as read material (not an interpretation)', () => {
    renderCine(root, COLLECTOR, baseView({ face: 'his hand keeps drifting to his watch' }), noop);
    expect(root.querySelector('.cine-read')?.textContent).toContain('watch');
  });

  it('fires choose() with the chosen choice', () => {
    let picked: Choice | null = null;
    const choices: Choice[] = [{ id: 'l1', kind: 'move', label: 'BLUFF', hint: 'claim you have it' }];
    renderCine(root, COLLECTOR, baseView({ choices }), { ...noop, choose: (c) => { picked = c; } });
    root.querySelector<HTMLElement>('[data-choice="l1"]')!.click();
    expect(picked).not.toBeNull();
    expect(picked!.id).toBe('l1');
  });

  it('when he is pressing you, renders his push responses instead of moves', () => {
    let responded: string | null = null;
    renderCine(root, COLLECTOR, baseView({
      pushOptions: [{ id: '0', text: 'Hold firm.' }, { id: '1', text: 'Give ground.' }],
      choices: [{ id: 'l1', kind: 'move', label: 'BLUFF', hint: 'claim you have it' }],
    }), { ...noop, respond: (id) => { responded = id; } });
    expect(root.querySelector('[data-choice]')).toBeNull();       // no attack moves during a push
    expect(root.querySelectorAll('[data-push]').length).toBe(2);
    root.querySelector<HTMLElement>('[data-push="1"]')!.click();
    expect(responded).toBe('1');
  });

  it('opens the dossier panel with your dug-up intel', () => {
    renderCine(root, COLLECTOR, baseView({ dossier: ['PROUD. Feed his ego.'], dossierOpen: true }), noop);
    expect(root.querySelector('.dossier-panel')?.textContent).toContain('PROUD');
    expect(root.querySelector('[data-close-dossier]')).not.toBeNull();
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
