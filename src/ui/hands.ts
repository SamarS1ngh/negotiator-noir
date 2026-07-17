import type { MoodState, Opponent } from '../domain/types';
import { mountFace } from './face';

// ---- The HANDS-ON duel: no option list. You act ON him with gestures, inside
// a live window. See docs/superpowers/specs/2026-07-17-hands-on-duel-design.md.

export type Act =
  | { kind: 'press' }
  | { kind: 'stare'; holdMs: number }
  | { kind: 'ease' }
  | { kind: 'catch' }
  | { kind: 'slam' };

export interface HandsView {
  objective: string;
  mood: MoodState;
  hisNerveWord: string;
  hisNervePct: number;
  yourNervePct: number;
  patiencePct: number;
  hisLine: string;
  typedLen?: number;
  face?: string;            // his observable state — YOUR read material
  live: boolean;            // is the window open (gestures armed)?
  windowMs: number;         // how long the window lasts (for the drain animation)
  flash?: string;           // his tell is flashing RIGHT NOW — tap it
  hasCard: boolean;         // leverage in hand → the card peeks at the bottom
  cardLabel?: string;
  note?: string;            // short beat note ("that landed", "he blinked")
  reaction?: 'hit' | 'lean' | 'settle';
  dossier: string[];
  dossierOpen?: boolean;
  teachOpen?: boolean;      // first-run gesture card
}

export interface HandsHandlers {
  act(a: Act): void;
  openDossier(): void;
  closeDossier(): void;
  closeTeach(): void;
  walk(): void;
}

// hold timing: release inside the peak band = a real stare-down
export const HOLD_PEAK_MIN = 850;
export const HOLD_PEAK_MAX = 1500;
const SWIPE_MIN = 40;      // px before a drag counts as a swipe
const TAP_MAX_MS = 220;    // quick press with no travel = a tap

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Turns raw pointer input on his face into acts. Swipe up = press him, swipe
 * down = ease off, hold+release = stare him down (timing matters), tap = only
 * meaningful while his tell flashes. Returns a detach fn.
 */
export function attachGestures(
  surface: HTMLElement,
  isLive: () => boolean,
  flashing: () => boolean,
  on: HandsHandlers,
  onHoldTick?: (ms: number) => void,
): () => void {
  let downX = 0, downY = 0, downT = 0, down = false, moved = false;
  let tick: ReturnType<typeof setInterval> | undefined;

  const stopTick = (): void => { if (tick) { clearInterval(tick); tick = undefined; } };

  const onDown = (e: MouseEvent): void => {
    if (!isLive()) return;
    down = true; moved = false;
    downX = e.clientX; downY = e.clientY; downT = Date.now();
    if (onHoldTick) {
      stopTick();
      tick = setInterval(() => { if (down && !moved) onHoldTick(Date.now() - downT); }, 40);
    }
  };

  const onMove = (e: MouseEvent): void => {
    if (!down) return;
    if (Math.abs(e.clientY - downY) > SWIPE_MIN || Math.abs(e.clientX - downX) > SWIPE_MIN) moved = true;
  };

  const onUp = (e: MouseEvent): void => {
    if (!down) return;
    down = false;
    stopTick();
    onHoldTick?.(0);
    if (!isLive()) return;

    const dy = e.clientY - downY;
    const heldMs = Date.now() - downT;

    if (Math.abs(dy) > SWIPE_MIN) {
      on.act(dy < 0 ? { kind: 'press' } : { kind: 'ease' });
      return;
    }
    if (heldMs <= TAP_MAX_MS) {
      // a tap only means something while his tell is showing
      if (flashing()) on.act({ kind: 'catch' });
      return;
    }
    on.act({ kind: 'stare', holdMs: heldMs });
  };

  surface.addEventListener('pointerdown', onDown as EventListener);
  surface.addEventListener('pointermove', onMove as EventListener);
  surface.addEventListener('pointerup', onUp as EventListener);
  surface.addEventListener('pointercancel', (() => { down = false; stopTick(); }) as EventListener);

  return () => {
    stopTick();
    surface.removeEventListener('pointerdown', onDown as EventListener);
    surface.removeEventListener('pointermove', onMove as EventListener);
    surface.removeEventListener('pointerup', onUp as EventListener);
  };
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

function teachCard(on: HandsHandlers): HTMLElement {
  const veil = el('div', 'teach-veil');
  const card = el('div', 'teach-card');
  card.appendChild(el('div', 'tc-head', 'YOU DON’T PICK. YOU ACT.'));
  const rows: [string, string][] = [
    ['↑', 'swipe up — press him'],
    ['↓', 'swipe down — ease off'],
    ['◉', 'hold his eyes — stare him down, let go at the peak'],
    ['⚡', 'his tell flashes — tap it'],
    ['▤', 'drag your card up — finish him'],
  ];
  for (const [icon, text] of rows) {
    const row = el('div', 'tc-row');
    row.appendChild(el('span', 'tc-icon', icon));
    row.appendChild(el('span', 'tc-text', text));
    card.appendChild(row);
  }
  card.appendChild(el('div', 'tc-foot', 'Read his face. Act before the moment passes.'));
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tc-go';
  btn.dataset.closeTeach = '';
  btn.textContent = 'SIT DOWN';
  btn.addEventListener('click', () => on.closeTeach());
  card.appendChild(btn);
  veil.appendChild(card);
  return veil;
}

function dossierPanel(lines: string[], on: HandsHandlers): HTMLElement {
  const veil = el('div', 'dossier-veil');
  const panel = el('div', 'dossier-panel');
  const head = el('div', 'dossier-head');
  head.appendChild(el('span', 't', 'WHAT YOU KNOW'));
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'x'; x.dataset.closeDossier = ''; x.textContent = '✕';
  x.addEventListener('click', () => on.closeDossier());
  head.appendChild(x);
  panel.appendChild(head);
  if (lines.length === 0) panel.appendChild(el('div', 'dossier-empty', 'Nothing. You walked in cold.'));
  else for (const line of lines) panel.appendChild(el('div', 'dossier-line', line));
  veil.appendChild(panel);
  veil.addEventListener('click', (e) => { if (e.target === veil) on.closeDossier(); });
  return veil;
}

/**
 * The hands-on scene: his face IS the interface. No buttons to choose from —
 * you swipe/hold/tap on him inside a live window. The HUD is three thin bars,
 * a draining window ring, and (when you hold) a pressure bar.
 */
export function renderHands(
  root: HTMLElement,
  opp: Opponent,
  view: HandsView,
  on: HandsHandlers,
): { surface: HTMLElement; setHold(ms: number): void } {
  root.innerHTML = '';
  root.className = `hands${view.live ? ' live' : ''}`;

  const bg = el('div', 'bg');
  if (view.reaction) bg.classList.add(`react-${view.reaction}`);
  const face = mountFace(bg, opp);
  face.setMood(view.mood);
  root.appendChild(bg);
  if (view.flash) face.flashTell(view.flash);

  // the gesture surface — his face
  const surface = el('div', 'surface');
  surface.dataset.surface = '';
  root.appendChild(surface);

  // window ring: drains while the moment is live
  const ring = el('div', 'window-ring');
  if (view.live) {
    ring.classList.add('draining');
    ring.style.setProperty('--win', `${view.windowMs}ms`);
  }
  root.appendChild(ring);

  // hold pressure bar (filled via setHold)
  const hold = el('div', 'hold-bar');
  const holdFill = el('i');
  hold.appendChild(holdFill);
  root.appendChild(hold);

  // top HUD
  const top = el('div', 'hands-top');
  const objRow = el('div', 'cine-objrow');
  const obj = el('div', 'cine-obj');
  obj.appendChild(el('span', 'badge', '◎'));
  const goal = el('span', 'goal');
  goal.textContent = view.objective;
  obj.appendChild(goal);
  objRow.appendChild(obj);
  const controls = el('div', 'cine-controls');
  const dossierBtn = document.createElement('button');
  dossierBtn.type = 'button';
  dossierBtn.className = 'dossier-btn';
  dossierBtn.dataset.dossier = '';
  dossierBtn.textContent = `KNOW${view.dossier.length ? ` · ${view.dossier.length}` : ''}`;
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

  // his line + your read of him
  const lower = el('div', 'hands-lower');
  const say = el('div', 'hands-say');
  say.appendChild(el('div', 'who', opp.name));
  const line = el('div', 'line');
  const shown = view.typedLen === undefined ? view.hisLine : view.hisLine.slice(0, view.typedLen);
  line.append(shown);
  if (view.typedLen !== undefined && view.typedLen < view.hisLine.length) {
    line.appendChild(el('span', 'caret', '▌'));
  }
  say.appendChild(line);
  lower.appendChild(say);

  if (view.face) {
    const read = el('div', 'hands-read');
    read.appendChild(el('span', 'eye', '👁'));
    read.append(view.face);
    lower.appendChild(read);
  }
  if (view.note) lower.appendChild(el('div', 'hands-note', view.note));
  root.appendChild(lower);

  // your card — drag it UP to slam it down on the table
  if (view.hasCard) {
    const card = el('div', 'lev-card-hand');
    card.dataset.card = '';
    card.appendChild(el('div', 'lc-label', view.cardLabel ?? 'YOUR CARD'));
    card.appendChild(el('div', 'lc-hint', 'drag up to play it'));
    attachCardDrag(card, () => view.live, on);
    root.appendChild(card);
  }

  if (view.dossierOpen) root.appendChild(dossierPanel(view.dossier, on));
  if (view.teachOpen) root.appendChild(teachCard(on));

  return {
    surface,
    setHold(ms: number) {
      if (ms <= 0) { hold.classList.remove('on'); holdFill.style.width = '0%'; return; }
      hold.classList.add('on');
      const pct = Math.min(100, (ms / HOLD_PEAK_MAX) * 100);
      holdFill.style.width = `${pct}%`;
      hold.classList.toggle('peak', ms >= HOLD_PEAK_MIN && ms <= HOLD_PEAK_MAX);
      hold.classList.toggle('over', ms > HOLD_PEAK_MAX);
    },
  };
}

// the leverage card: drag it up onto the table (a physical act, not a button)
function attachCardDrag(card: HTMLElement, isLive: () => boolean, on: HandsHandlers): void {
  let y0 = 0, down = false;
  card.addEventListener('pointerdown', ((e: MouseEvent) => { down = true; y0 = e.clientY; }) as EventListener);
  card.addEventListener('pointerup', ((e: MouseEvent) => {
    if (!down) return;
    down = false;
    if (!isLive()) return;
    if (y0 - e.clientY > SWIPE_MIN) on.act({ kind: 'slam' });
  }) as EventListener);
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
