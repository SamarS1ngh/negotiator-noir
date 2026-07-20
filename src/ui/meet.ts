import type { Beat } from '../domain/board';

// ---- MEET: a face-to-face. Three kinds:
//   INTRO      — just beats, then it proceeds (the sit-down opener).
//   OBSERVE    — beats then a `result` (you watched someone; nobody to work).
//   NEGOTIATE  — beats then an `ask` (what they want) + `options` (how you play
//                them). YOU pick the approach. The right read gets what you
//                came for; the wrong one fails or costs you. Nobody gives you
//                anything for free.

export interface MeetOption {
  text: string;       // your approach ("Promise to protect him")
  good: boolean;      // does it actually work on this person
  result: string;     // what happens
  ripple?: string;    // what the world does back
}

export interface MeetView {
  name: string;
  role: string;
  portrait?: string;
  beats: Beat[];
  ask?: string;              // their demand — the negotiation opens here
  options?: MeetOption[];    // your approaches
  result?: string;           // observe-scene payoff (no negotiation)
  ripple?: string;
}

const TYPE_MS = 26;

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

type Phase = 'talk' | 'choose' | 'result';

export function renderMeet(root: HTMLElement, view: MeetView, onDone: (chosen: MeetOption | null) => void): void {
  let i = 0, typed = 0, ended = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let chosen: MeetOption | null = null;
  let lineNode: HTMLElement | null = null;   // the bubble text — updated in place, no full redraw
  let tapNode: HTMLElement | null = null;
  let phase: Phase = view.beats.length > 0 ? 'talk' : afterTalk();

  function stopTimer(): void { if (timer) { clearTimeout(timer); timer = undefined; } }
  function finish(): void { if (ended) return; ended = true; stopTimer(); root.onclick = null; onDone(chosen); }

  function afterTalk(): Phase {
    if (view.options && view.options.length > 0) return 'choose';
    if (view.result !== undefined) return 'result';
    // intro — nothing to resolve
    return 'result'; // will render as an empty result -> but we short-circuit below
  }

  function draw(): void {
    root.innerHTML = '';
    root.className = view.portrait ? 'meet-screen' : 'meet-screen no-portrait';
    root.onclick = null;

    const bg = el('div', 'meet-bg');
    if (view.portrait) {
      const img = document.createElement('img');
      img.className = 'meet-portrait';
      img.src = view.portrait; img.alt = view.name;
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
      const box = el('div', `meet-say ${beat.who}${beat.caption ? ' caption' : ''}`);
      if (!beat.caption) box.appendChild(el('div', 'meet-who', beat.who === 'you' ? 'YOU' : view.name));
      lineNode = el('div', 'meet-line');
      box.appendChild(lineNode);
      root.appendChild(box);
      tapNode = el('div', 'meet-tap');
      root.appendChild(tapNode);
      paint();
      root.onclick = advance;
      return;
    }

    if (phase === 'choose') {
      const box = el('div', 'meet-choose');
      box.appendChild(el('div', 'mc-ask-lab', `${view.name} wants`));
      box.appendChild(el('div', 'mc-ask', view.ask ?? ''));
      box.appendChild(el('div', 'mc-lab', 'how do you play him'));
      for (const o of view.options!) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mc-opt';
        b.dataset.opt = String(view.options!.indexOf(o));
        b.textContent = o.text;
        b.addEventListener('click', () => { chosen = o; phase = 'result'; draw(); });
        box.appendChild(b);
      }
      root.appendChild(box);
      return;
    }

    // result
    const res = el('div', 'meet-result');
    const line = chosen ? chosen.result : view.result;
    const ripple = chosen ? chosen.ripple : view.ripple;
    const good = chosen ? chosen.good : true;
    res.appendChild(el('div', `mr-lab ${good ? '' : 'fail'}`, good ? 'you got' : 'that went wrong'));
    res.appendChild(el('div', 'mr-line', line ?? ''));
    if (ripple) {
      const rip = el('div', 'meet-ripple');
      rip.appendChild(el('div', 'mr-lab warn', '…and word travels'));
      rip.appendChild(el('div', 'mr-rip', ripple));
      res.appendChild(rip);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'meet-done';
    btn.dataset.done = '';
    btn.textContent = 'BACK TO THE BOARD ▸';
    btn.addEventListener('click', (e) => { e.stopPropagation(); finish(); });
    res.appendChild(btn);
    root.appendChild(res);
  }

  // update just the bubble text (no DOM rebuild) so typing is smooth and a tap
  // completes the line instantly
  function paint(): void {
    const beat = view.beats[i];
    if (!beat || !lineNode) return;
    lineNode.textContent = beat.text.slice(0, typed);
    if (typed < beat.text.length) lineNode.appendChild(el('span', 'meet-caret', '▌'));
    if (tapNode) tapNode.textContent = typed < beat.text.length ? '' : 'tap to go on ▸';
  }

  function tick(): void {
    const beat = view.beats[i];
    if (!beat) return;
    typed += 1; paint();
    if (typed < beat.text.length) timer = setTimeout(tick, TYPE_MS);
  }

  function advance(): void {
    if (phase !== 'talk' || ended) return;
    const beat = view.beats[i]!;
    // mid-type → snap the whole line in at once
    if (typed < beat.text.length) { stopTimer(); typed = beat.text.length; paint(); return; }
    if (i < view.beats.length - 1) { i += 1; typed = 0; lineNode = null; draw(); timer = setTimeout(tick, TYPE_MS); return; }
    // done talking
    if (view.options && view.options.length > 0) { phase = 'choose'; draw(); }
    else if (view.result !== undefined) { phase = 'result'; draw(); }
    else finish();   // intro
  }

  // intro with no beats shouldn't happen; guard the empty-result short-circuit
  if (view.beats.length === 0 && !view.options && view.result === undefined) { finish(); return; }

  draw();
  if (phase === 'talk') timer = setTimeout(tick, TYPE_MS);
}
