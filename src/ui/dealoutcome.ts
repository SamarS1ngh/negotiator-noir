import type { Opponent } from '../domain/types';

export interface DealOutcomeView {
  walked: boolean;
  gradeLetter: string;
  terms: { label: string; got: string }[];
  namedHim: boolean;   // did you extract who's above him
}

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderDealOutcome(
  root: HTMLElement,
  opp: Opponent,
  view: DealOutcomeView,
  onContinue: () => void,
): void {
  root.innerHTML = '';
  root.className = 'dealout-screen';

  const wrap = el('div', 'do-wrap');
  wrap.appendChild(el('div', 'do-kicker', view.walked ? 'he walked out' : 'the deal is closed'));
  wrap.appendChild(el('div', `do-head ${view.walked ? 'bad' : ''}`, view.walked ? 'NO DEAL' : 'DEAL DONE'));
  wrap.appendChild(el('div', 'do-who', `${opp.name} · ${opp.role}`));

  if (!view.walked) {
    const gr = el('div', `do-grade g-${view.gradeLetter}`);
    gr.appendChild(el('span', 'gl', view.gradeLetter));
    gr.appendChild(el('span', 'gcap', 'how you played him'));
    wrap.appendChild(gr);
  }

  const sheet = el('div', 'do-terms');
  sheet.appendChild(el('div', 'do-lab', view.walked ? 'nothing changes' : 'the terms'));
  for (const t of view.terms) {
    const r = el('div', 'do-term');
    r.appendChild(el('span', 'dt-l', t.label));
    r.appendChild(el('span', 'dt-g', t.got));
    sheet.appendChild(r);
  }
  wrap.appendChild(sheet);

  // the payoff — only if you actually got the name
  if (view.namedHim && opp.breakReveal) {
    const rev = el('div', 'do-reveal');
    rev.appendChild(el('div', 'do-lab gold', 'and he gives it up'));
    rev.appendChild(el('div', 'rev-names', opp.breakReveal.names));
    rev.appendChild(el('div', 'rev-teach', opp.breakReveal.teach));
    wrap.appendChild(rev);
  }

  const cont = document.createElement('button');
  cont.type = 'button';
  cont.className = 'do-cont';
  cont.dataset.continue = '';
  cont.textContent = 'CONTINUE ▸';
  cont.addEventListener('click', () => onContinue());
  wrap.appendChild(cont);

  root.appendChild(wrap);
}
