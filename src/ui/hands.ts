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

// What you'd SAY for each register. Shown live as you aim the gesture — you
// always know your own words before you commit (you're aiming, not picking).
export interface Previews {
  press: { label: string; line: string };
  stare: { label: string; line: string };
  ease: { label: string; line: string };
  card?: { label: string; line: string };
}

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
  hasCard: boolean;         // leverage in hand → the card sits at the bottom
  cardLabel?: string;
  previews: Previews;
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
const AIM_MIN = 14;        // px before we show you what you'd say
const TAP_MAX_MS = 220;    // quick press with no travel = a tap
const AIM_HOLD_MS = 260;   // holding still this long = you're aiming the stare

export type Aim = 'press' | 'stare' | 'ease' | null;

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
  onAim?: (aim: Aim) => void,
  onEngage?: (engaged: boolean) => void,
): () => void {
  let downX = 0, downY = 0, downT = 0, down = false, moved = false;
  let tick: ReturnType<typeof setInterval> | undefined;
  let aim: Aim = null;

  const stopTick = (): void => { if (tick) { clearInterval(tick); tick = undefined; } };
  const setAim = (a: Aim): void => { if (a !== aim) { aim = a; onAim?.(a); } };

  const onDown = (e: MouseEvent): void => {
    if (!isLive()) return;
    down = true; moved = false;
    // your hand is on him — the clock is for hesitation, not for while you act
    onEngage?.(true);
    downX = e.clientX; downY = e.clientY; downT = Date.now();
    stopTick();
    // while you're holding/aiming: fill the pressure bar, and once you've held
    // still a beat, show that a stare is what you're lining up.
    tick = setInterval(() => {
      if (!down) return;
      const held = Date.now() - downT;
      if (!moved) {
        onHoldTick?.(held);
        if (held >= AIM_HOLD_MS) setAim('stare');
      }
    }, 40);
  };

  const onMove = (e: MouseEvent): void => {
    if (!down) return;
    const dy = e.clientY - downY;
    if (Math.abs(dy) > SWIPE_MIN || Math.abs(e.clientX - downX) > SWIPE_MIN) moved = true;
    // aiming: as soon as you pull, you see the words you'd say
    if (Math.abs(dy) >= AIM_MIN) { onHoldTick?.(0); setAim(dy < 0 ? 'press' : 'ease'); }
    else if (moved) setAim(null);
  };

  const onUp = (e: MouseEvent): void => {
    if (!down) return;
    down = false;
    stopTick();
    onHoldTick?.(0);
    setAim(null);
    onEngage?.(false);
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
  surface.addEventListener('pointercancel', (() => {
    down = false; stopTick(); setAim(null); onHoldTick?.(0); onEngage?.(false);
  }) as EventListener);

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
    ['↑', 'pull UP on him — press him'],
    ['↓', 'pull DOWN — ease off'],
    ['◉', 'hold his eyes — let it sit, then say it at the peak'],
    ['⚡', 'his tell flashes — tap it'],
    ['▤', 'drag your card up — finish him'],
    ['“', 'aim first — you SEE your words before you say them'],
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
): { surface: HTMLElement; setHold(ms: number): void; setAim(aim: Aim): void } {
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

  // WHAT YOU'D SAY — appears the moment you start aiming a gesture. You always
  // know your own words before you commit.
  const preview = el('div', 'aim-preview');
  const pvLabel = el('div', 'pv-label');
  const pvLine = el('div', 'pv-line');
  preview.append(pvLabel, pvLine);
  root.appendChild(preview);

  // his line + your read of him, then your card — one bottom stack so nothing
  // ever lands off-screen (the card used to be pushed under the fold).
  const bottom = el('div', 'hands-bottom');
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
  bottom.appendChild(lower);

  // your card — sits fully on-screen at the bottom; drag it UP to slam it down
  if (view.hasCard) {
    const card = el('div', 'lev-card-hand');
    card.dataset.card = '';
    const lcTop = el('div', 'lc-top');
    lcTop.appendChild(el('span', 'lc-grip', '⌃'));
    lcTop.appendChild(el('span', 'lc-label', view.cardLabel ?? 'YOUR CARD'));
    card.appendChild(lcTop);
    card.appendChild(el('div', 'lc-hint', 'drag up to play it'));
    attachCardDrag(card, () => view.live, on);
    bottom.appendChild(card);
  }

  root.appendChild(bottom);

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
    setAim(aim: Aim) {
      if (!aim) { preview.classList.remove('on'); return; }
      const p = view.previews[aim];
      pvLabel.textContent = p.label;
      pvLine.textContent = `“${p.line}”`;
      preview.classList.add('on');
      preview.dataset.aim = aim;
    },
  };
}

// the leverage card: drag it up onto the table (a physical act, not a button).
// It lifts with your finger so the drag reads as real.
function attachCardDrag(card: HTMLElement, isLive: () => boolean, on: HandsHandlers): void {
  let y0 = 0, down = false;
  const reset = (): void => { card.style.transform = ''; card.classList.remove('lifting'); };
  card.addEventListener('pointerdown', ((e: MouseEvent) => {
    down = true; y0 = e.clientY;
    card.classList.add('lifting');
    e.stopPropagation();
  }) as EventListener);
  card.addEventListener('pointermove', ((e: MouseEvent) => {
    if (!down) return;
    const dy = Math.min(0, e.clientY - y0);
    card.style.transform = `translateY(${dy}px)`;
    e.stopPropagation();
  }) as EventListener);
  card.addEventListener('pointerup', ((e: MouseEvent) => {
    if (!down) return;
    down = false;
    reset();
    e.stopPropagation();
    if (!isLive()) return;
    if (y0 - e.clientY > SWIPE_MIN) on.act({ kind: 'slam' });
  }) as EventListener);
  card.addEventListener('pointercancel', (() => { down = false; reset(); }) as EventListener);
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
