import type { MoodState, Opponent, Risk } from '../domain/types';
import { mountFace } from './face';

// ---- the view model the controller hands this renderer each beat ----

export type ChoiceKind = 'move' | 'catch' | 'deploy' | 'press';

// One thing you can do this beat. A `move` is a line you'd say (with an intent
// tag + a risk read); catch/deploy/press are the charged manipulation
// openings that appear only when they're live (styled `hot`).
export interface Choice {
  id: string;
  kind: ChoiceKind;
  text: string;
  intent?: string;
  risk?: Risk;
}

export interface Exchange { who: 'you' | 'him'; text: string; }

export interface CineView {
  objective: string;        // "BREAK RICCI"
  hisName: string;
  mood: MoodState;          // drives the background art
  nerveWord: string;        // steady / shaken / rattled / cornered / breaking
  nervePct: number;         // 0–100, the bar
  history: Exchange[];      // the last few lines, faint, above the current one
  hisLine: string;          // what he's saying right now
  typedLen?: number;        // if set, only show hisLine.slice(0, typedLen) + caret (typewriter)
  read?: string;            // what you NOTICE — inline, plain language
  teach?: string;           // one-time plain teach (first tell / first crack)
  choices: Choice[];        // empty while he's talking; the moves when it's your turn
}

export interface CineHandlers {
  choose(choice: Choice): void;
  walk(): void;
}

const RISK_DOT: Record<Risk, string> = { safe: 'r-safe', uncertain: 'r-unc', high: 'r-high' };

const INTENT_ICON: Record<ChoiceKind, string> = {
  move: '',
  catch: '⚡',
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

function nerveEl(word: string, pct: number): HTMLElement {
  const wrap = el('div', 'nerve');
  const lab = el('div', 'nerve-lab');
  lab.append('his nerve · ');
  lab.appendChild(el('b', undefined, word));
  const bar = el('div', 'nerve-bar');
  const fill = el('i');
  fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  bar.appendChild(fill);
  wrap.append(lab, bar);
  return wrap;
}

function choiceEl(c: Choice, on: CineHandlers): HTMLElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `choice${c.kind === 'move' ? '' : ' hot'}`;
  btn.dataset.choice = c.id;
  btn.dataset.kind = c.kind;

  const tag = el('div', 'c-tag');
  const icon = INTENT_ICON[c.kind];
  const label =
    c.kind === 'move' ? (c.intent ?? '') :
    c.kind === 'catch' ? 'catch him in it' :
    c.kind === 'deploy' ? 'play what you know' :
    'press him — now';
  if (icon) tag.appendChild(el('span', 'c-icon', icon));
  tag.appendChild(el('span', 'c-intent', label));
  if (c.kind === 'move' && c.risk) {
    const dot = el('span', `c-risk ${RISK_DOT[c.risk]}`);
    dot.dataset.risk = c.risk;
    tag.appendChild(dot);
  }
  btn.appendChild(tag);

  btn.appendChild(el('div', 'c-text', c.text));
  btn.addEventListener('click', () => on.choose(c));
  return btn;
}

/**
 * Renders one beat of the cinematic duel — his portrait fills the screen, his
 * line reads out at the bottom, what you NOTICE floats just under it, and your
 * manipulation moves are the choices. No dial, no jargon boxes, no separate
 * Record screen: the charged catch/deploy/press openings appear inline, hot,
 * right when they're live. See docs/superpowers/specs/2026-07-16-cinematic-
 * manipulation-duel-design.md. The controller (src/app/controller.ts) owns the
 * beat-to-beat flow and typewriter timing and calls this at each visual step.
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

  // top: objective + his nerve
  const top = el('div', 'cine-top');
  top.appendChild(objectiveEl(view.objective, opp.name));
  top.appendChild(nerveEl(view.nerveWord, view.nervePct));
  root.appendChild(top);

  // the whole lower cluster — his line, what you notice, then your moves —
  // stacked and anchored to the bottom of the frame.
  const bottom = el('div', 'cine-bottom');

  // the dialogue stage (lower third)
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

  if (view.read) {
    const read = el('div', 'cine-read');
    read.appendChild(el('span', 'eye', '⌕'));
    read.append(view.read);
    stage.appendChild(read);
  }
  if (view.teach) {
    stage.appendChild(el('div', 'cine-teach', view.teach));
  }

  bottom.appendChild(stage);

  // choices (hidden while he's talking)
  if (view.choices.length > 0) {
    const choices = el('div', 'cine-choices');
    choices.appendChild(el('div', 'choose-hint', 'your move'));
    for (const c of view.choices) choices.appendChild(choiceEl(c, on));
    bottom.appendChild(choices);
  }

  root.appendChild(bottom);

  // a quiet exit
  const walk = document.createElement('button');
  walk.type = 'button';
  walk.className = 'cine-walk';
  walk.dataset.walk = '';
  walk.textContent = 'walk away';
  walk.addEventListener('click', () => on.walk());
  root.appendChild(walk);
}
