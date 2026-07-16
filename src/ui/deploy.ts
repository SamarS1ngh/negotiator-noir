import type { AgendaField, Leverage } from '../domain/types';

const AGENDA_TELLS: Record<AgendaField, string> = {
  bottomLine: 'His bottom line is out. Push the number.',
  fear: 'His fear is out. Aim there.',
  lie: 'The lie is exposed. Pull the thread.',
};

// The composure hit a catch/deploy just landed. Shows it plainly — a mini bar
// with the chunk you just knocked off highlighted, and a word for the size of
// the hit — so the move reads as cause->effect, not "the number just dropped".
export interface Impact { before: number; after: number }

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function crackWord(drop: number): string {
  if (drop >= 25) return 'BUCKLES';
  if (drop >= 12) return 'cracks';
  if (drop >= 1) return 'gives';
  return 'holds';
}

// A labelled mini composure bar: solid fill = what he has LEFT, the striped
// segment past it = what this move just cost him.
function composureCrack(impact: Impact): HTMLElement {
  const before = clampPct(impact.before);
  const after = clampPct(impact.after);
  const drop = Math.max(0, before - after);

  const wrap = document.createElement('div');
  wrap.className = 'crack';

  const lab = document.createElement('div');
  lab.className = 'crk-lab';
  lab.append('his composure ');
  const b = document.createElement('b');
  b.textContent = crackWord(drop);
  lab.appendChild(b);

  const bar = document.createElement('div');
  bar.className = 'crk-bar';
  const left = document.createElement('i');
  left.style.width = `${after}%`;
  const lost = document.createElement('u');
  lost.style.width = `${drop}%`;
  bar.append(left, lost);

  const nums = document.createElement('div');
  nums.className = 'crk-nums';
  nums.textContent = `was ${before} · now ${after}`;

  wrap.append(lab, bar, nums);
  return wrap;
}

/**
 * Renders the "THAT'S NOT WHAT YOU SAID" catch beat — ported from
 * concept/ui/screen_catch.html. The quote he said vs. the fact you know,
 * and the agenda field it leaked.
 */
export function renderCatch(
  root: HTMLElement,
  said: string,
  against: string,
  leakField: AgendaField,
  on: { continue(): void },
  impact?: Impact,
): void {
  root.innerHTML = '';
  root.classList.add('catch-screen');

  const hit = document.createElement('div');
  hit.className = 'hit';
  const k = document.createElement('div');
  k.className = 'k';
  k.textContent = 'you caught him';
  const big = document.createElement('div');
  big.className = 'big';
  big.textContent = "THAT'S NOT WHAT YOU SAID";
  hit.append(k, big);
  root.appendChild(hit);

  const contra = document.createElement('div');
  contra.className = 'contra';

  const saidBox = document.createElement('div');
  saidBox.className = 'q said';
  const saidTag = document.createElement('span');
  saidTag.className = 'tag';
  saidTag.textContent = 'he said';
  saidBox.append(saidTag, document.createTextNode(`“${said}”`));

  const vs = document.createElement('div');
  vs.className = 'vs';
  vs.textContent = 'but you know —';

  const factBox = document.createElement('div');
  factBox.className = 'q fact';
  const factTag = document.createElement('span');
  factTag.className = 'tag';
  factTag.textContent = 'hard fact';
  factBox.append(factTag, document.createTextNode(against));

  contra.append(saidBox, vs, factBox);
  root.appendChild(contra);

  const react = document.createElement('div');
  react.className = 'react';
  react.textContent = '…how the hell do you know that?';
  root.appendChild(react);

  if (impact) root.appendChild(composureCrack(impact));

  const foot = document.createElement('div');
  foot.className = 'foot';
  const leakBox = document.createElement('div');
  leakBox.className = 'leak';
  const b = document.createElement('b');
  b.textContent = AGENDA_TELLS[leakField];
  leakBox.appendChild(b);
  foot.appendChild(leakBox);
  root.appendChild(foot);

  root.appendChild(continueButton(on));
}

/**
 * Renders the "LEVERAGE" deploy beat — ported from
 * concept/ui/screen_deploy.html. The leverage card slapped down, your line,
 * and his break.
 */
export function renderDeploy(
  root: HTMLElement,
  lev: Leverage,
  on: { continue(): void },
  impact?: Impact,
): void {
  root.innerHTML = '';
  root.classList.add('deploy-screen');

  const hit = document.createElement('div');
  hit.className = 'hit';
  const k = document.createElement('div');
  k.className = 'k';
  k.textContent = 'you play your card';
  const big = document.createElement('div');
  big.className = 'big';
  big.textContent = 'LEVERAGE';
  hit.append(k, big);
  root.appendChild(hit);

  const card = document.createElement('div');
  card.className = 'lev-card';
  const lab = document.createElement('div');
  lab.className = 'lab';
  lab.textContent = '▸ deployed · hard fact';
  const fact = document.createElement('div');
  fact.className = 'fact';
  fact.textContent = lev.text;
  const src = document.createElement('div');
  src.className = 'src';
  src.textContent = `// ${lev.label}`;
  card.append(lab, fact, src);
  root.appendChild(card);

  const you = document.createElement('div');
  you.className = 'you';
  const who = document.createElement('span');
  who.className = 'who';
  who.textContent = 'you';
  you.append(who, document.createTextNode("One call to the right people, and you're not the one holding this anymore."));
  root.appendChild(you);

  const react = document.createElement('div');
  react.className = 'react';
  react.textContent = '…okay. Okay. What do you want.';
  root.appendChild(react);

  if (impact) root.appendChild(composureCrack(impact));

  root.appendChild(continueButton(on));
}

function continueButton(on: { continue(): void }): HTMLElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'continue-btn';
  btn.dataset.continue = '';
  btn.textContent = 'CONTINUE ▸';
  btn.addEventListener('click', () => on.continue());
  return btn;
}
