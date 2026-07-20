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
  pressCeil: number;            // how far you can lean before he walks (leverage widens it)
}

export interface DealHandlers {
  setTerm(termId: string, idx: number): void;
  attach(leverageId: string): void;
  detach(termId: string): void;
  propose(press: number): void;   // press 0..1 — how hard you leaned before letting go
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

// A leverage card you physically LIFT and drop onto the table. Tap still works
// (forgiving), but the drag is the tactile tell that you're playing something.
function makeDraggableCard(card: HTMLElement, table: HTMLElement, onDrop: () => void): void {
  let dragging = false, moved = false, sx = 0, sy = 0;
  const move = (e: PointerEvent): void => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.04}deg) scale(1.08)`;
  };
  const end = (e: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener('pointermove', move);
    card.classList.remove('lifting');
    const t = table.getBoundingClientRect();
    const onTable = e.clientY <= t.bottom && e.clientY >= t.top - 48;   // dropped up onto the papers
    card.style.transform = '';
    if (!moved || onTable) { card.classList.add('played'); onDrop(); }
  };
  card.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
    card.setPointerCapture?.(e.pointerId);
    card.classList.add('lifting');
    window.addEventListener('pointermove', move);
  });
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
}

// LEAN ON HIM: press and hold to push. Press rises over ~1.5s; HIS FACE is the
// gauge — it cuts through guarded → rattled → cornered as you bear down, then to
// ANGRY past the ceiling (where he'll walk). You read him and let go at the
// crack. A soft grip-vignette tightens and the phone buzzes so your hand feels
// it too. `ceil` is his walk edge (leverage widens it). onCommit gets press 0..1.
function wirePress(
  pad: HTMLElement, stage: Stage, grip: HTMLElement, ceil: number,
  onCommit: (press: number) => void,
): void {
  const MS = 1500;
  const face: MoodState[] = ['guarded', 'rattled', 'cornered', 'angry'];
  let raf = 0, start = 0, holding = false, bucket = -1;
  const buckOf = (p: number): number => (p < 0.30 ? 0 : p < 0.55 ? 1 : p <= ceil ? 2 : 3);
  const setBucket = (b: number): void => {
    if (b === bucket) return;
    bucket = b;
    stage.setMood(face[b]!);
    if (b === 2) stage.shot('push');
    if (b === 3) stage.shot('shake');
    try { navigator.vibrate?.(b === 3 ? [28, 26, 28] : 8 + b * 8); } catch { /* no haptics */ }
  };
  const frame = (t: number): void => {
    if (!holding) return;
    const p = Math.min(1, (t - start) / MS);
    grip.style.setProperty('--press', String(p));
    grip.classList.toggle('danger', p > ceil);
    setBucket(buckOf(p));
    raf = requestAnimationFrame(frame);
  };
  const stop = (commit: boolean): void => {
    if (!holding) return;
    holding = false;
    cancelAnimationFrame(raf);
    const p = Math.min(1, (performance.now() - start) / MS);
    pad.classList.remove('held');
    grip.style.setProperty('--press', '0');
    grip.classList.remove('danger');
    try { navigator.vibrate?.(0); } catch { /* no haptics */ }
    if (!commit) return;
    if (p < 0.12) { nudge(pad); return; }   // a tap won't lean on a man — teach the hold
    onCommit(p);
  };
  pad.addEventListener('pointerdown', (e) => {
    holding = true; bucket = -1; start = performance.now();
    pad.setPointerCapture?.(e.pointerId);
    pad.classList.add('held');
    try { navigator.vibrate?.(6); } catch { /* no haptics */ }   // it engages the instant you hold
    raf = requestAnimationFrame(frame);
  });
  pad.addEventListener('pointerup', () => stop(true));
  pad.addEventListener('pointercancel', () => stop(false));
  pad.addEventListener('lostpointercapture', () => stop(true));
}

// a tap can't lean on someone — flash the pad and spell out the hold
function nudge(pad: HTMLElement): void {
  const sub = pad.querySelector('.pp-sub');
  const prev = sub?.textContent ?? '';
  pad.classList.remove('nudge'); void pad.offsetWidth; pad.classList.add('nudge');
  if (sub) sub.textContent = 'HOLD it — a tap does nothing';
  try { navigator.vibrate?.(12); } catch { /* no haptics */ }
  setTimeout(() => { pad.classList.remove('nudge'); if (sub) sub.textContent = prev; }, 1200);
}

export function renderDeal(root: HTMLElement, opp: Opponent, view: DealView, on: DealHandlers): Stage {
  let m = mounts.get(root);
  if (!m || m.oppId !== opp.id) {
    root.innerHTML = '';
    root.className = 'deal-screen';
  root.onclick = null;   // never inherit a leaked tap handler
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

  // the table surface you're sitting across
  root.appendChild(el('div', 'deal-felt'));

  // the deal sheet — the papers on the table; they SLIDE across to him when you
  // put it to him (the `pushed` state, driven by `reacting`).
  const sheet = el('div', `deal-sheet${view.reacting ? ' pushed' : ''}`);
  sheet.appendChild(el('div', 'sheet-head', 'THE DEAL — the papers between you'));

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

  // your leverage — physical cards in your hand. You DRAG one up onto the table
  // to lay it down (or tap, if you'd rather). Dragging it out is the tell that
  // you're playing something on him.
  if (view.chips.length > 0) {
    const hand = el('div', 'deal-hand');
    hand.appendChild(el('div', 'hand-lab', 'drag what you dug up onto the table'));
    for (const c of view.chips) {
      const card = el('div', 'deal-card');
      card.dataset.attach = c.id;
      card.appendChild(el('span', 'card-mark', '▣'));
      card.appendChild(el('span', 'card-txt', c.label));
      if (!view.reacting) makeDraggableCard(card, sheet, () => on.attach(c.id));
      hand.appendChild(card);
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
  // the grip: a vignette that tightens over the whole scene as you bear down
  const grip = el('div', 'press-grip');
  grip.style.setProperty('--press', '0');
  root.appendChild(grip);

  // LEAN ON HIM — press & hold. His face tells you when to let go.
  const pad = document.createElement('button');
  pad.type = 'button';
  pad.className = 'press-pad';
  pad.dataset.propose = '';
  pad.appendChild(el('span', 'pp-lab', 'PRESS & HOLD — LEAN ON HIM'));
  pad.appendChild(el('span', 'pp-sub', 'watch his face · let go when he breaks'));
  if (!view.reacting) wirePress(pad, m.stage, grip, view.pressCeil, (p) => on.propose(p));
  foot.appendChild(pad);
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
