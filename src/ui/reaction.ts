import type { Band, MoodState, Opponent } from '../domain/types';
import { mountFace } from './face';

// What the verdict banner says per band — so every probe visibly LANDS,
// brushes off, or backfires (the fix for "nothing ever happens").
const VERDICT: Record<Band, { head: string; sub: string; kind: string }> = {
  lands: { head: 'HE FLINCHED', sub: 'that landed — his composure cracks', kind: 'good' },
  neutral: { head: 'HE BRUSHED IT OFF', sub: 'no ground given', kind: 'flat' },
  backfires: { head: 'THAT BACKFIRED', sub: 'you overplayed — you gave ground', kind: 'bad' },
};

// Fallback reaction when the line has no scripted reply statement.
const GENERIC: Record<Band, string> = {
  lands: 'He shifts. Something in that got under the collar.',
  neutral: 'He just looks at you. Nothing moves.',
  backfires: 'He smiles, slow. Wrong move.',
};

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

/**
 * The probe reaction beat: his face + his reply + a verdict (flinched /
 * brushed off / backfired) + his composure at its new value. This is what
 * makes a probe FEEL like something happened. Tap-to-continue.
 */
export function renderReaction(
  root: HTMLElement,
  opp: Opponent,
  data: { hisLine: string | null; band: Band; spent: boolean; hisComposure: number; mood: MoodState },
  on: { continue(): void },
): void {
  root.innerHTML = '';
  root.classList.add('reaction-screen');

  const stage = document.createElement('div');
  stage.className = 'react-stage';
  const face = mountFace(stage, opp);
  face.setMood(data.mood);
  root.appendChild(stage);

  const v = data.spent
    ? { head: "HE'S HEARD THAT", sub: 'same angle twice — costs you, gains nothing', kind: 'flat' }
    : VERDICT[data.band];

  const verdict = document.createElement('div');
  verdict.className = `react-verdict verdict-${v.kind}`;
  const head = document.createElement('div');
  head.className = 'rv-head';
  head.textContent = v.head;
  head.dataset.verdict = v.kind;
  const sub = document.createElement('div');
  sub.className = 'rv-sub';
  sub.textContent = v.sub;
  verdict.append(head, sub);
  root.appendChild(verdict);

  const line = document.createElement('div');
  line.className = 'react-line';
  line.textContent = `“${data.hisLine ?? GENERIC[data.band]}”`;
  root.appendChild(line);

  const meter = document.createElement('div');
  meter.className = 'react-meter';
  const fill = document.createElement('i');
  fill.style.width = `${clampPct(data.hisComposure)}%`;
  meter.appendChild(fill);
  const lbl = document.createElement('div');
  lbl.className = 'react-meterlbl';
  lbl.textContent = 'his composure';
  root.append(meter, lbl);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'continue-btn';
  btn.dataset.continue = '';
  btn.textContent = 'CONTINUE ▸';
  btn.addEventListener('click', () => on.continue());
  root.appendChild(btn);
}
