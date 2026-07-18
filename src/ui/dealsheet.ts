import type { MoodState, Opponent } from '../domain/types';
import type { TermReaction } from '../domain/deal';
import { mountFace } from './face';
import type { Stage } from './face';

// ---- THE DEAL SHEET: the table. His portrait fills the top; below it, the
// terms of the deal — for each, a segmented row you set your position on (his
// side ← → yours), his current stance marked on it, and a slot to lay down
// leverage. You build a package and PROPOSE; he reacts term by term.

export interface TermRow {
  id: string;
  label: string;
  positions: string[];
  yourIdx: number;
  hisIdx: number;              // where his current stance sits
  reaction?: TermReaction;     // how he took your last package on this term
  leverageId?: string;         // a card laid on this term
  leverageLabel?: string;
}

export interface LeverageChip { id: string; label: string; term: string; }

export interface DealView {
  objective: string;
  hisName: string;
  mood: MoodState;
  rows: TermRow[];
  round: number;
  patienceLeft: number;
  patienceTotal: number;
  hisLine: string;
  chips: LeverageChip[];        // held leverage not yet laid down
  hasCounter: boolean;          // his stance differs from your offer → you may accept it
  reacting: boolean;            // his reply is playing; controls are locked
}

export interface DealHandlers {
  setTerm(termId: string, idx: number): void;
  attach(leverageId: string): void;
  detach(termId: string): void;
  propose(): void;
  acceptCounter(): void;
  walk(): void;
}

// keep the portrait/stage alive across re-renders (else his mood cross-fade and
// any camera move restart every beat)
const mounts = new WeakMap<HTMLElement, { root: HTMLElement; stageHost: HTMLElement; stage: Stage; oppId: string }>();

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderDeal(root: HTMLElement, opp: Opponent, view: DealView, on: DealHandlers): Stage {
  let m = mounts.get(root);
  if (!m || m.oppId !== opp.id) {
    root.innerHTML = '';
    root.className = 'deal-screen';
    const stageHost = el('div', 'bg');
    const stage = mountFace(stageHost, opp);
    root.appendChild(stageHost);
    m = { root, stageHost, stage, oppId: opp.id };
    mounts.set(root, m);
  } else {
    // keep the stage node, wipe only the HUD
    for (const c of [...root.children]) if (c !== m.stageHost) c.remove();
    root.className = 'deal-screen';
  }
  m.stage.setMood(view.mood);

  // top: objective + his patience
  const top = el('div', 'deal-top');
  const obj = el('div', 'deal-obj');
  obj.appendChild(el('span', 'badge', '◎'));
  obj.appendChild(el('span', 'goal', view.objective));
  top.appendChild(obj);
  const rounds = el('div', 'deal-rounds');
  rounds.appendChild(el('span', 'rl', `round ${view.round}`));
  const pips = el('div', 'pat-pips');
  for (let i = 0; i < view.patienceTotal; i += 1) pips.appendChild(el('span', `pip${i < view.patienceLeft ? ' on' : ''}`));
  const patLab = el('span', 'rl2', 'his patience');
  rounds.append(patLab, pips);
  top.appendChild(rounds);
  root.appendChild(top);

  // his line
  const say = el('div', 'deal-say');
  say.appendChild(el('div', 'who', opp.name));
  say.appendChild(el('div', 'line', view.hisLine));
  root.appendChild(say);

  // the deal sheet
  const sheet = el('div', 'deal-sheet');
  sheet.appendChild(el('div', 'sheet-head', 'THE DEAL'));

  for (const row of view.rows) {
    const r = el('div', `term r-${row.reaction ?? 'none'}`);
    r.dataset.term = row.id;

    const head = el('div', 'term-head');
    head.appendChild(el('span', 'term-label', row.label));
    if (row.leverageId) {
      const chip = el('button', 'term-lev');
      (chip as HTMLButtonElement).type = 'button';
      chip.dataset.detach = row.id;
      chip.textContent = `▣ ${row.leverageLabel} ✕`;
      chip.addEventListener('click', () => on.detach(row.id));
      head.appendChild(chip);
    }
    r.appendChild(head);

    // segmented positions: his ideal on the left, yours on the right
    const seg = el('div', 'term-seg');
    row.positions.forEach((pos, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'seg';
      b.dataset.pos = String(i);
      if (i === row.yourIdx) b.classList.add('yours');
      if (i === row.hisIdx) b.classList.add('his');
      b.appendChild(el('span', 'seg-t', pos));
      if (i === row.hisIdx && i !== row.yourIdx) b.appendChild(el('span', 'seg-tag', 'he wants'));
      if (!view.reacting) b.addEventListener('click', () => on.setTerm(row.id, i));
      seg.appendChild(b);
    });
    r.appendChild(seg);
    sheet.appendChild(r);
  }
  root.appendChild(sheet);

  // your leverage — laid onto its term
  if (view.chips.length > 0) {
    const hand = el('div', 'deal-hand');
    hand.appendChild(el('div', 'hand-lab', 'lay down what you dug up'));
    for (const c of view.chips) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hand-chip';
      b.dataset.attach = c.id;
      b.textContent = `▣ ${c.label}`;
      if (!view.reacting) b.addEventListener('click', () => on.attach(c.id));
      hand.appendChild(b);
    }
    root.appendChild(hand);
  }

  // actions
  const foot = el('div', 'deal-foot');
  if (view.hasCounter) {
    const acc = document.createElement('button');
    acc.type = 'button';
    acc.className = 'deal-accept';
    acc.dataset.acceptCounter = '';
    acc.textContent = 'TAKE HIS OFFER';
    if (!view.reacting) acc.addEventListener('click', () => on.acceptCounter());
    foot.appendChild(acc);
  }
  const prop = document.createElement('button');
  prop.type = 'button';
  prop.className = 'deal-propose';
  prop.dataset.propose = '';
  prop.textContent = 'PUT IT TO HIM ▸';
  if (!view.reacting) prop.addEventListener('click', () => on.propose());
  foot.appendChild(prop);
  root.appendChild(foot);

  const walk = document.createElement('button');
  walk.type = 'button';
  walk.className = 'deal-walk';
  walk.dataset.walk = '';
  walk.textContent = 'walk out';
  walk.addEventListener('click', () => on.walk());
  root.appendChild(walk);

  return m.stage;
}
