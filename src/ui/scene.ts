import type { MoodState, Opponent } from '../domain/types';
import { mountFace } from './face';

// ---- the view model the controller hands this renderer each beat ----

export type ChoiceKind = 'move' | 'call' | 'deploy' | 'press';

// One thing you can do this beat. A `move` is a line you'd say (an angle you
// read as worth trying — NO risk hint, you judge). call/deploy/press are
// aggressive gambits you time yourself. Nothing is highlighted as "correct".
export interface Choice {
  id: string;
  kind: ChoiceKind;
  text: string;
  intent?: string;
}

export interface Exchange { who: 'you' | 'him'; text: string; }

export interface CineView {
  objective: string;        // "BREAK RICCI"
  hisName: string;
  mood: MoodState;          // drives the background art
  hisNerveWord: string;     // steady / shaken / rattled / cornered / breaking
  hisNervePct: number;      // 0–100 — break it to 0 to WIN
  yourNervePct: number;     // 0–100 — hits 0 and he turns it on you (LOSE)
  patiencePct: number;      // 0–100 — his patience; hits 0 and he walks (LOSE)
  history: Exchange[];      // the last few lines, faint, above the current one
  hisLine: string;          // what he's saying right now
  typedLen?: number;        // if set, only show hisLine.slice(0, typedLen) + caret
  face?: string;            // his OBSERVABLE tell/expression — your read material
  teach?: string;           // sparing coach line (intro + first-time only)
  choices: Choice[];        // empty while he's talking; your moves when it's your turn
}

export interface CineHandlers {
  choose(choice: Choice): void;
  walk(): void;
}

const GAMBIT_ICON: Record<ChoiceKind, string> = {
  move: '',
  call: '‼',
  deploy: '▸',
  press: '⚡',
};

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Bolds the opponent's name inside the objective goal ("BREAK RICCI").
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
    c.kind === 'deploy' ? 'play what you know' :
    'press him';
  if (icon) tag.appendChild(el('span', 'c-icon', icon));
  tag.appendChild(el('span', 'c-intent', label));
  btn.appendChild(tag);

  btn.appendChild(el('div', 'c-text', c.text));
  btn.addEventListener('click', () => on.choose(c));
  return btn;
}

/**
 * Renders one beat of the cinematic manipulation duel — a game you can lose.
 * His portrait fills the frame; two nerve gauges sit up top (HIS to break,
 * YOURS to protect); his line reads out at the bottom; his observable tell is
 * your read material — NOT an interpreted hint; your moves are the choices,
 * with no risk telegraph and nothing highlighted as correct. You judge. See
 * docs/superpowers/specs/2026-07-16-cinematic-manipulation-duel-design.md +
 * the game-layer notes in src/app/controller.ts.
 */
export function renderCine(
  root: HTMLElement,
  opp: Opponent,
  view: CineView,
  on: CineHandlers,
): void {
  root.innerHTML = '';
  root.className = 'cine';

  const bg = el('div', 'bg');
  const face = mountFace(bg, opp);
  face.setMood(view.mood);
  root.appendChild(bg);

  // top: objective + the two nerve gauges
  const top = el('div', 'cine-top');
  top.appendChild(objectiveEl(view.objective, opp.name));
  const gauges = el('div', 'gauges');
  gauges.appendChild(barEl('his', 'his nerve', view.hisNerveWord, view.hisNervePct));
  gauges.appendChild(barEl('you', 'your nerve', yourWord(view.yourNervePct), view.yourNervePct));
  gauges.appendChild(barEl('patience', 'his patience', patienceWord(view.patiencePct), view.patiencePct));
  top.appendChild(gauges);
  root.appendChild(top);

  // the whole lower cluster — his line, your read, then your moves
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

  const say = el('div', 'cine-say');
  say.appendChild(el('div', 'who', opp.name));
  const line = el('div', 'line');
  const shownText = view.typedLen === undefined ? view.hisLine : view.hisLine.slice(0, view.typedLen);
  line.append(shownText);
  if (view.typedLen !== undefined && view.typedLen < view.hisLine.length) {
    line.appendChild(el('span', 'caret', '▌'));
  }
  say.appendChild(line);
  stage.appendChild(say);

  // his OBSERVABLE tell — read material, not an interpretation
  if (view.face) {
    const read = el('div', 'cine-read');
    read.appendChild(el('span', 'eye', '👁'));
    read.append(view.face);
    stage.appendChild(read);
  }
  if (view.teach) {
    stage.appendChild(el('div', 'cine-teach', view.teach));
  }

  bottom.appendChild(stage);

  if (view.choices.length > 0) {
    const choices = el('div', 'cine-choices');
    choices.appendChild(el('div', 'choose-hint', 'your move'));
    for (const c of view.choices) choices.appendChild(choiceEl(c, on));
    bottom.appendChild(choices);
  }

  root.appendChild(bottom);

  const walk = document.createElement('button');
  walk.type = 'button';
  walk.className = 'cine-walk';
  walk.dataset.walk = '';
  walk.textContent = 'walk away';
  walk.addEventListener('click', () => on.walk());
  root.appendChild(walk);
}

// Your own standing, in plain words — so the lose-gauge reads as pressure.
function yourWord(pct: number): string {
  if (pct > 66) return 'holding';
  if (pct > 33) return 'slipping';
  if (pct > 0) return 'on the ropes';
  return 'read';
}

// How long he'll keep sitting — the clock on you.
function patienceWord(pct: number): string {
  if (pct > 66) return 'hearing you out';
  if (pct > 33) return 'thinning';
  if (pct > 0) return 'nearly gone';
  return 'done';
}
