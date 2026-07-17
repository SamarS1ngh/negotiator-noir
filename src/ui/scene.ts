import type { MoodState, Opponent } from '../domain/types';
import { mountFace } from './face';

// ---- the view model the controller hands this renderer each beat ----

export type ChoiceKind = 'move' | 'call' | 'deploy';

export interface Choice {
  id: string;
  kind: ChoiceKind;
  text: string;
  intent?: string;
}

export interface Exchange { who: 'you' | 'him'; text: string; }
export interface PushOptionView { id: string; text: string; }

export interface CineView {
  objective: string;
  hisName: string;
  mood: MoodState;
  hisNerveWord: string;
  hisNervePct: number;
  yourNervePct: number;
  patiencePct: number;
  history: Exchange[];
  hisLine: string;
  typedLen?: number;
  face?: string;                 // his OBSERVABLE tell/expression — read material
  teach?: string;
  choices: Choice[];             // your moves (empty while he talks / during a push)
  reaction?: 'hit' | 'lean' | 'settle'; // physical beat animation on his portrait
  flashTell?: string;            // pop his tell on him, live
  pushOptions?: PushOptionView[]; // when set, HE is pressing you — render responses, not moves
  dossier: string[];             // what you dug up in recon
  dossierOpen?: boolean;
}

export interface CineHandlers {
  choose(choice: Choice): void;
  respond(optionId: string): void;
  walk(): void;
  openDossier(): void;
  closeDossier(): void;
}

const GAMBIT_ICON: Record<ChoiceKind, string> = { move: '', call: '‼', deploy: '▸' };

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function objectiveEl(objective: string, name: string): HTMLElement {
  const wrap = el('div', 'cine-obj');
  wrap.appendChild(el('span', 'badge', '◎'));
  const g = el('span', 'goal');
  const idx = objective.toUpperCase().indexOf(name.toUpperCase());
  if (idx === -1) {
    g.textContent = objective;
  } else {
    g.append(objective.slice(0, idx));
    g.appendChild(el('b', undefined, objective.slice(idx, idx + name.length)));
    g.append(objective.slice(idx + name.length));
  }
  wrap.appendChild(g);
  return wrap;
}

function barEl(cls: string, label: string, valueText: string, pct: number): HTMLElement {
  const wrap = el('div', `gauge ${cls}`);
  const lab = el('div', 'gauge-lab');
  lab.append(`${label} · `);
  lab.appendChild(el('b', undefined, valueText));
  const bar = el('div', 'gauge-bar');
  const fill = el('i');
  fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  bar.appendChild(fill);
  wrap.append(lab, bar);
  return wrap;
}

function choiceEl(c: Choice, on: CineHandlers): HTMLElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `choice${c.kind === 'move' ? '' : ' gambit'}`;
  btn.dataset.choice = c.id;
  btn.dataset.kind = c.kind;

  const tag = el('div', 'c-tag');
  const icon = GAMBIT_ICON[c.kind];
  const label =
    c.kind === 'move' ? (c.intent ?? '') :
    c.kind === 'call' ? 'call him a liar' :
    'play what you know';
  if (icon) tag.appendChild(el('span', 'c-icon', icon));
  tag.appendChild(el('span', 'c-intent', label));
  btn.appendChild(tag);

  btn.appendChild(el('div', 'c-text', c.text));
  btn.addEventListener('click', () => on.choose(c));
  return btn;
}

function dossierPanel(lines: string[], on: CineHandlers): HTMLElement {
  const veil = el('div', 'dossier-veil');
  const panel = el('div', 'dossier-panel');
  const head = el('div', 'dossier-head');
  head.appendChild(el('span', 't', 'WHAT YOU DUG UP'));
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'x'; x.dataset.closeDossier = ''; x.textContent = '✕';
  x.addEventListener('click', () => on.closeDossier());
  head.appendChild(x);
  panel.appendChild(head);
  if (lines.length === 0) {
    panel.appendChild(el('div', 'dossier-empty', "You walked in cold. Nothing on him — read him at the table, and pray."));
  } else {
    for (const line of lines) panel.appendChild(el('div', 'dossier-line', line));
  }
  veil.appendChild(panel);
  veil.addEventListener('click', (e) => { if (e.target === veil) on.closeDossier(); });
  return veil;
}

/**
 * Renders one beat of the LIVING duel. His portrait fills the frame and reacts
 * with his body (flinch on a hit, lean-in when he presses you); his tell can
 * flash live; and he pushes back — when `pushOptions` is set he's coming at
 * YOU and the choices become your responses (hold firm / give ground). Your
 * hand is what you dug up in recon (the dossier). See the recon spec.
 */
export function renderCine(root: HTMLElement, opp: Opponent, view: CineView, on: CineHandlers): void {
  root.innerHTML = '';
  root.className = 'cine';

  const bg = el('div', 'bg');
  if (view.reaction) bg.classList.add(`react-${view.reaction}`);
  const face = mountFace(bg, opp);
  face.setMood(view.mood);
  root.appendChild(bg);
  if (view.flashTell) face.flashTell(view.flashTell);

  // top: objective + gauges, with the dossier + walk chips on the right
  const top = el('div', 'cine-top');
  const objRow = el('div', 'cine-objrow');
  objRow.appendChild(objectiveEl(view.objective, opp.name));
  const controls = el('div', 'cine-controls');
  const dossierBtn = document.createElement('button');
  dossierBtn.type = 'button';
  dossierBtn.className = 'dossier-btn';
  dossierBtn.dataset.dossier = '';
  dossierBtn.textContent = `DOSSIER${view.dossier.length ? ` · ${view.dossier.length}` : ''}`;
  dossierBtn.addEventListener('click', () => on.openDossier());
  const walk = document.createElement('button');
  walk.type = 'button';
  walk.className = 'cine-walk';
  walk.dataset.walk = '';
  walk.textContent = 'walk';
  walk.addEventListener('click', () => on.walk());
  controls.append(dossierBtn, walk);
  objRow.appendChild(controls);
  top.appendChild(objRow);

  const gauges = el('div', 'gauges');
  gauges.appendChild(barEl('his', 'his nerve', view.hisNerveWord, view.hisNervePct));
  gauges.appendChild(barEl('you', 'your nerve', yourWord(view.yourNervePct), view.yourNervePct));
  gauges.appendChild(barEl('patience', 'his patience', patienceWord(view.patiencePct), view.patiencePct));
  top.appendChild(gauges);
  root.appendChild(top);

  // lower cluster
  const bottom = el('div', 'cine-bottom');
  const stage = el('div', 'cine-stage');

  if (view.history.length > 0) {
    const hist = el('div', 'cine-history');
    for (const ex of view.history) {
      const line = el('div', `hx ${ex.who}`);
      line.append(ex.who === 'you' ? '› ' : `${opp.name}: `);
      line.append(ex.text);
      hist.appendChild(line);
    }
    stage.appendChild(hist);
  }

  const say = el('div', `cine-say${view.pushOptions ? ' pressing' : ''}`);
  say.appendChild(el('div', 'who', opp.name));
  const line = el('div', 'line');
  const shownText = view.typedLen === undefined ? view.hisLine : view.hisLine.slice(0, view.typedLen);
  line.append(shownText);
  if (view.typedLen !== undefined && view.typedLen < view.hisLine.length) {
    line.appendChild(el('span', 'caret', '▌'));
  }
  say.appendChild(line);
  stage.appendChild(say);

  if (view.face) {
    const read = el('div', 'cine-read');
    read.appendChild(el('span', 'eye', '👁'));
    read.append(view.face);
    stage.appendChild(read);
  }
  if (view.teach) stage.appendChild(el('div', 'cine-teach', view.teach));

  bottom.appendChild(stage);

  // his PUSH — you respond (hold firm / give ground), not attack
  if (view.pushOptions) {
    const push = el('div', 'cine-choices push');
    push.appendChild(el('div', 'choose-hint press', 'he\'s pressing you — hold your ground'));
    for (const opt of view.pushOptions) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice respond';
      btn.dataset.push = opt.id;
      btn.appendChild(el('div', 'c-text', opt.text));
      btn.addEventListener('click', () => on.respond(opt.id));
      push.appendChild(btn);
    }
    bottom.appendChild(push);
  } else if (view.choices.length > 0) {
    const choices = el('div', 'cine-choices');
    choices.appendChild(el('div', 'choose-hint', 'your move'));
    for (const c of view.choices) choices.appendChild(choiceEl(c, on));
    bottom.appendChild(choices);
  }

  root.appendChild(bottom);

  if (view.dossierOpen) root.appendChild(dossierPanel(view.dossier, on));
}

function yourWord(pct: number): string {
  if (pct > 66) return 'holding';
  if (pct > 33) return 'slipping';
  if (pct > 0) return 'on the ropes';
  return 'read';
}

function patienceWord(pct: number): string {
  if (pct > 66) return 'hearing you out';
  if (pct > 33) return 'thinning';
  if (pct > 0) return 'nearly gone';
  return 'done';
}
