// ---- THE WIRE: the negotiation as a live encrypted chat on the operative's
// burner. No spreadsheet, no rows — he messages you, you answer, you send him
// what you dug up as attachments, and when you put an offer to him you PRESS &
// HOLD to lean. His replies stream in with a typing tell; how long he takes and
// how terse he gets is your read. The verdict underneath is the real deal engine.

export interface WireMsg {
  who: 'them' | 'you' | 'sys';
  text: string;
  file?: boolean;        // rendered as a sent/received "attachment" chip
}

export interface WireOption {
  id: string;
  label: string;
  tone?: 'give' | 'push' | 'lever';   // colour the chip by what kind of move it is
}

export interface WireView {
  name: string;
  portrait?: string;
  status: string;                 // "encrypted · typing…" etc
  log: WireMsg[];
  typing: boolean;                // show his typing dots
  ask?: string;                   // a small prompt above your options
  options?: WireOption[];         // your reply chips (tap)
  hold?: boolean;                 // this step is the SEND — press & hold to lean
  pressCeil?: number;             // how hard you can lean before he bolts
  ended?: boolean;
}

export interface WireHandlers {
  choose(id: string): void;
  lean(press: number): void;      // press 0..1 from the hold
}

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

// how many log bubbles we've already shown on this root, so only NEW ones animate
const shown = new WeakMap<HTMLElement, number>();

// press-and-hold the SEND to lean on him. Same feel as the table: a grip
// tightens, the phone buzzes, and past the ceiling it floods red — he's about to
// cut the line. Let go while it's amber.
function wireHold(pad: HTMLElement, grip: HTMLElement, ceil: number, onCommit: (p: number) => void): void {
  const MS = 1500;
  let raf = 0, start = 0, holding = false;
  const frame = (t: number): void => {
    if (!holding) return;
    const p = Math.min(1, (t - start) / MS);
    grip.style.setProperty('--press', String(p));
    grip.classList.toggle('danger', p > ceil);
    pad.classList.toggle('hot', p > ceil);
    raf = requestAnimationFrame(frame);
  };
  const stop = (commit: boolean): void => {
    if (!holding) return;
    holding = false;
    cancelAnimationFrame(raf);
    const p = Math.min(1, (performance.now() - start) / MS);
    pad.classList.remove('held', 'hot');
    grip.style.setProperty('--press', '0');
    grip.classList.remove('danger');
    try { navigator.vibrate?.(0); } catch { /* none */ }
    if (!commit) return;
    if (p < 0.12) { flashHold(pad); return; }    // a tap won't lean — teach the hold
    onCommit(p);
  };
  pad.addEventListener('pointerdown', (e) => {
    holding = true; start = performance.now();
    pad.setPointerCapture?.(e.pointerId);
    pad.classList.add('held');
    try { navigator.vibrate?.(6); } catch { /* none */ }
    raf = requestAnimationFrame(frame);
  });
  pad.addEventListener('pointerup', () => stop(true));
  pad.addEventListener('pointercancel', () => stop(false));
  pad.addEventListener('lostpointercapture', () => stop(true));
}

function flashHold(pad: HTMLElement): void {
  const sub = pad.querySelector('.wh-sub');
  const prev = sub?.textContent ?? '';
  pad.classList.remove('nudge'); void pad.offsetWidth; pad.classList.add('nudge');
  if (sub) sub.textContent = 'HOLD it — a tap does nothing';
  try { navigator.vibrate?.(12); } catch { /* none */ }
  setTimeout(() => { pad.classList.remove('nudge'); if (sub) sub.textContent = prev; }, 1200);
}

export function renderWire(root: HTMLElement, view: WireView, on: WireHandlers): void {
  root.className = 'wire-screen';
  root.onclick = null;
  root.innerHTML = '';

  // phone status bar + contact header
  const head = el('div', 'wire-head');
  const av = el('div', 'wire-av');
  if (view.portrait) {
    const img = document.createElement('img');
    img.src = view.portrait; img.alt = view.name;
    av.appendChild(img);
  }
  head.appendChild(av);
  const who = el('div', 'wire-who');
  who.appendChild(el('div', 'ww-name', view.name));
  who.appendChild(el('div', `ww-status${view.typing ? ' live' : ''}`, view.typing ? 'typing…' : view.status));
  head.appendChild(who);
  head.appendChild(el('div', 'wire-lock', '🔒'));
  root.appendChild(head);

  // the conversation
  const log = el('div', 'wire-log');
  const alreadyShown = shown.get(root) ?? 0;
  view.log.forEach((m, i) => {
    const row = el('div', `wm-row ${m.who}`);
    const bubble = el('div', `wm ${m.who}${m.file ? ' file' : ''}`);
    if (m.file) bubble.appendChild(el('span', 'wm-clip', '📎'));
    bubble.appendChild(el('span', 'wm-t', m.text));
    if (i >= alreadyShown) row.classList.add('pop');   // only new bubbles animate in
    row.appendChild(bubble);
    log.appendChild(row);
  });
  if (view.typing) {
    const row = el('div', 'wm-row them');
    const dots = el('div', 'wm them typing');
    dots.appendChild(el('span', 'dot')); dots.appendChild(el('span', 'dot')); dots.appendChild(el('span', 'dot'));
    row.appendChild(dots);
    log.appendChild(row);
  }
  root.appendChild(log);
  shown.set(root, view.log.length);

  // the grip vignette (for the hold)
  const grip = el('div', 'wire-grip');
  grip.style.setProperty('--press', '0');
  root.appendChild(grip);

  // the composer: your reply chips, or the SEND-hold
  const compose = el('div', 'wire-compose');
  if (view.ask) compose.appendChild(el('div', 'wc-ask', view.ask));

  if (view.hold) {
    const pad = el('button', 'wire-hold');
    (pad as HTMLButtonElement).type = 'button';
    pad.appendChild(el('span', 'wh-lab', 'PRESS & HOLD — PUT IT TO HIM'));
    pad.appendChild(el('span', 'wh-sub', 'lean until he breaks · watch him type'));
    wireHold(pad, grip, view.pressCeil ?? 0.72, (p) => on.lean(p));
    compose.appendChild(pad);
  } else if (view.options && !view.ended) {
    const chips = el('div', 'wc-chips');
    for (const o of view.options) {
      const b = el('button', `wc-chip${o.tone ? ' t-' + o.tone : ''}`);
      (b as HTMLButtonElement).type = 'button';
      if (o.tone === 'lever') b.appendChild(el('span', 'chip-clip', '📎'));
      b.appendChild(el('span', 'chip-t', o.label));
      b.addEventListener('click', () => on.choose(o.id));
      chips.appendChild(b);
    }
    compose.appendChild(chips);
  }
  root.appendChild(compose);

  // keep the latest message in view
  requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
}

// reset the "already shown" counter when a fresh conversation starts on this root
export function resetWire(root: HTMLElement): void { shown.delete(root); }
