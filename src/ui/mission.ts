import type { Beat } from '../domain/board';
import type { MissionChoice } from '../domain/mission';

// ---- MISSION SCENE: one node of a branching job. Plays its beats, then either
// offers a FORK (choices that lead to other nodes) or, at an ending, shows the
// CONSEQUENCE card — what happened and how the world just bent. Shares the meet
// scene's visual language; the difference is it branches and it has weight.

export interface MissionNodeView {
  name: string;
  role: string;
  portrait?: string;
  beats: Beat[];
  ask?: string;
  mood?: string;       // situational light: tense/fear/hope/guilt/threat/cold/warm
  palette?: string;    // character signature: pal-sal, pal-ricci…
  choices?: MissionChoice[];
  outcome?: { tone: 'good' | 'mixed' | 'bad'; title: string; line: string; ripple: string };
}

export interface MissionHandlers {
  choose(choiceId: string): void;   // pick a fork → runner swaps to the next node
  finish(): void;                   // dismiss the consequence card → apply outcome
}

const TYPE_MS = 24;

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

type Phase = 'talk' | 'choose' | 'conseq';

export function renderMissionNode(root: HTMLElement, view: MissionNodeView, on: MissionHandlers): void {
  let i = 0, typed = 0, ended = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lineNode: HTMLElement | null = null;   // bubble text — updated in place
  let tapNode: HTMLElement | null = null;
  const hasBeats = view.beats.length > 0;
  let phase: Phase = hasBeats ? 'talk' : (view.choices ? 'choose' : 'conseq');

  function stopTimer(): void { if (timer) { clearTimeout(timer); timer = undefined; } }

  function draw(): void {
    root.innerHTML = '';
    // character palette + the moment's mood colour the whole scene
    root.className = `meet-screen mission-screen ${view.palette ? 'pal-' + view.palette : ''} ${view.mood ? 'mood-' + view.mood : ''}`.trim();
    root.onclick = null;

    const bg = el('div', 'meet-bg');
    if (view.portrait) {
      const img = document.createElement('img');
      img.className = 'meet-portrait';
      img.src = view.portrait; img.alt = view.name;
      img.onerror = () => { img.style.display = 'none'; };
      bg.appendChild(img);
    }
    bg.appendChild(el('div', 'scene-light'));   // character ambient + lamp glow
    bg.appendChild(el('div', 'scene-mood'));    // the situational wash/vignette
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
      if (view.ask) box.appendChild(el('div', 'mc-ask', view.ask));
      box.appendChild(el('div', 'mc-lab', 'your move — and live with it'));
      for (const c of view.choices ?? []) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `mc-opt${c.tone ? ' tone-' + c.tone : ''}`;
        b.dataset.choice = c.id;
        b.textContent = c.label;
        b.addEventListener('click', () => on.choose(c.id));
        box.appendChild(b);
      }
      root.appendChild(box);
      return;
    }

    // consequence card
    const o = view.outcome!;
    const card = el('div', `mission-conseq tone-${o.tone}`);
    card.appendChild(el('div', 'mcq-tag', o.tone === 'good' ? 'it lands' : o.tone === 'bad' ? 'it backfires' : 'it costs you'));
    card.appendChild(el('div', 'mcq-title', o.title));
    card.appendChild(el('div', 'mcq-line', o.line));
    const rip = el('div', 'mcq-ripple');
    rip.appendChild(el('div', 'mcq-rip-lab', 'the world shifts'));
    rip.appendChild(el('div', 'mcq-rip', o.ripple));
    card.appendChild(rip);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'meet-done';
    btn.dataset.done = '';
    btn.textContent = 'BACK TO THE BOARD ▸';
    btn.addEventListener('click', (e) => { e.stopPropagation(); if (!ended) { ended = true; on.finish(); } });
    card.appendChild(btn);
    root.appendChild(card);
  }

  // update just the bubble text (no DOM rebuild) — smooth typing, instant tap-complete
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
    if (typed < beat.text.length) { stopTimer(); typed = beat.text.length; paint(); return; }
    if (i < view.beats.length - 1) { i += 1; typed = 0; lineNode = null; draw(); timer = setTimeout(tick, TYPE_MS); return; }
    // done talking → fork, or ending
    phase = view.choices ? 'choose' : 'conseq';
    draw();
  }

  draw();
  if (phase === 'talk') timer = setTimeout(tick, TYPE_MS);
}
