import type { Beat } from '../domain/board';

// ---- MEET: a short face-to-face you play out when you work someone. Their
// photo fills the frame, the lines type out, you tap through, then you see what
// it got you (and what the world does back). This is what makes the board feel
// like people, not dots.

export interface MeetView {
  name: string;
  role: string;
  portrait?: string;
  beats: Beat[];
  result?: string;   // omit for an INTRO scene — it just plays, then onDone()
  ripple?: string;
}

const TYPE_MS = 26;

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderMeet(root: HTMLElement, view: MeetView, onDone: () => void): void {
  let i = 0;               // current beat
  let typed = 0;           // chars shown
  let timer: ReturnType<typeof setTimeout> | undefined;
  let phase: 'talk' | 'result' = view.beats.length > 0 ? 'talk' : 'result';

  function stopTimer(): void { if (timer) { clearTimeout(timer); timer = undefined; } }

  function draw(): void {
    root.innerHTML = '';
    root.className = 'meet-screen';

    const bg = el('div', 'meet-bg');
    if (view.portrait) {
      const img = document.createElement('img');
      img.className = 'meet-portrait';
      img.src = view.portrait;
      img.alt = view.name;
      img.onerror = () => { img.style.display = 'none'; };
      bg.appendChild(img);
    }
    bg.appendChild(el('div', 'meet-grad'));
    root.appendChild(bg);

    const top = el('div', 'meet-top');
    top.appendChild(el('div', 'meet-name', view.name));
    top.appendChild(el('div', 'meet-role', view.role));
    root.appendChild(top);

    if (phase === 'talk') {
      const beat = view.beats[i]!;
      const box = el('div', `meet-say ${beat.who}`);
      box.appendChild(el('div', 'meet-who', beat.who === 'you' ? 'YOU' : view.name));
      const line = el('div', 'meet-line');
      const shown = beat.text.slice(0, typed);
      line.append(shown);
      if (typed < beat.text.length) line.appendChild(el('span', 'meet-caret', '▌'));
      box.appendChild(line);
      root.appendChild(box);
      const lastBeat = i === view.beats.length - 1;
      const tapLabel = typed < beat.text.length ? '' : (lastBeat && view.result === undefined ? 'tap to sit down ▸' : 'tap to go on ▸');
      root.appendChild(el('div', 'meet-tap', tapLabel));
      root.dataset.advance = '';
      root.onclick = advance;
    } else {
      const res = el('div', 'meet-result');
      res.appendChild(el('div', 'mr-lab', 'you got'));
      res.appendChild(el('div', 'mr-line', view.result));
      if (view.ripple) {
        const rip = el('div', 'meet-ripple');
        rip.appendChild(el('div', 'mr-lab warn', '…and word travels'));
        rip.appendChild(el('div', 'mr-rip', view.ripple));
        res.appendChild(rip);
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'meet-done';
      btn.dataset.done = '';
      btn.textContent = 'BACK TO THE BOARD ▸';
      btn.addEventListener('click', () => { stopTimer(); onDone(); });
      res.appendChild(btn);
      root.appendChild(res);
      root.onclick = null;
    }
  }

  function tick(): void {
    const beat = view.beats[i];
    if (!beat) return;
    typed += 1;
    draw();
    if (typed < beat.text.length) timer = setTimeout(tick, TYPE_MS);
  }

  function advance(): void {
    if (phase !== 'talk') return;
    const beat = view.beats[i]!;
    if (typed < beat.text.length) {   // finish the current line instantly
      stopTimer();
      typed = beat.text.length;
      draw();
      return;
    }
    if (i < view.beats.length - 1) {  // next line
      i += 1; typed = 0;
      draw();
      timer = setTimeout(tick, TYPE_MS);
      return;
    }
    // done talking: an action-scene shows what you got; an intro just proceeds
    if (view.result !== undefined) { phase = 'result'; draw(); }
    else { stopTimer(); onDone(); }
  }

  draw();
  if (phase === 'talk') timer = setTimeout(tick, TYPE_MS);
}
