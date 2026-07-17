import type { OpponentType } from '../domain/types';

// ---- CALL IT: before you sit down, you commit to a READ of the man. Nobody
// tells you what he is — you looked at the clues, now you decide. Get it right
// and the levers you'd expect to work, work. Get it wrong and you spend the
// whole duel pulling the wrong strings and wondering why he isn't moving.
// This is the "earn it" gate: the game never hands you his nature.

export interface CallView {
  targetName: string;
  clues: string[];              // exactly what your recon turned up, verbatim
  options: { id: OpponentType; label: string; blurb: string }[];
}

export interface CallHandlers { call(t: OpponentType): void; }

export const TYPE_OPTIONS: { id: OpponentType; label: string; blurb: string }[] = [
  { id: 'proud', label: 'PROUD', blurb: 'Ego runs him. Status is the whole game.' },
  { id: 'greedy', label: 'GREEDY', blurb: 'Everything is a price. He wants the better end.' },
  { id: 'scared', label: 'SCARED', blurb: 'He\'s carrying fear. Somebody above him owns him.' },
  { id: 'believer', label: 'A BELIEVER', blurb: 'He thinks he\'s the good guy. Rules matter to him.' },
  { id: 'pro', label: 'A PRO', blurb: 'Cold. No ego, no fear. Just the job.' },
];

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderCallIt(root: HTMLElement, view: CallView, on: CallHandlers): void {
  root.innerHTML = '';
  root.className = 'callit';

  const wrap = el('div', 'ci-wrap');
  wrap.appendChild(el('div', 'ci-kicker', 'before you walk in'));
  wrap.appendChild(el('div', 'ci-head', `WHAT IS ${view.targetName}?`));
  wrap.appendChild(el('div', 'ci-sub', 'Nobody can tell you this. Look at what you turned up and make the call. Read him wrong and you\'ll be pulling the wrong strings all night.'));

  const clues = el('div', 'ci-clues');
  if (view.clues.length === 0) {
    clues.appendChild(el('div', 'ci-empty', 'You dug up nothing. You\'re guessing blind.'));
  } else {
    clues.appendChild(el('div', 'ci-clues-lab', 'what you turned up'));
    for (const c of view.clues) clues.appendChild(el('div', 'ci-clue', c));
  }
  wrap.appendChild(clues);

  const opts = el('div', 'ci-opts');
  for (const o of view.options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ci-opt';
    btn.dataset.call = o.id;
    btn.appendChild(el('div', 'ci-opt-label', o.label));
    btn.appendChild(el('div', 'ci-opt-blurb', o.blurb));
    btn.addEventListener('click', () => on.call(o.id));
    opts.appendChild(btn);
  }
  wrap.appendChild(opts);

  root.appendChild(wrap);
}
