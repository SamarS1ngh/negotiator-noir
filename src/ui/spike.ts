/**
 * Renders the "tell spike" burst — ported from concept/ui/screen_spike.html.
 * A tell just cracked through; you press it or let it pass. No auto-timer —
 * always time to read (this used to auto-pass after ~2.5s; that's gone).
 * `timed` is accepted only so existing call sites keep compiling; it no
 * longer changes behavior.
 */
export function renderSpike(
  root: HTMLElement,
  tellText: string,
  palette: string,
  on: { press(): void; pass(): void },
  timed?: boolean,
): void {
  void timed;
  root.innerHTML = '';
  root.classList.add('spike-screen');
  root.style.setProperty('--accent', `var(--${palette})`);
  root.style.setProperty('--accent-dim', `var(--${palette}-dim)`);

  const tell = document.createElement('div');
  tell.className = 'tell';

  const ring = document.createElement('div');
  ring.className = 'ring';
  const ringTwo = document.createElement('div');
  ringTwo.className = 'ring two';

  const word = document.createElement('div');
  word.className = 'word';
  word.textContent = 'TELL';

  const desc = document.createElement('div');
  desc.className = 'desc';
  desc.textContent = tellText;

  tell.append(ring, ringTwo, word, desc);
  root.appendChild(tell);

  const prompt = document.createElement('div');
  prompt.className = 'prompt';

  const beat = document.createElement('div');
  beat.className = 'beat';
  beat.textContent = 'one beat — before he recovers';
  prompt.appendChild(beat);

  const pressBtn = document.createElement('button');
  pressBtn.type = 'button';
  pressBtn.className = 'press';
  pressBtn.dataset.press = '';
  pressBtn.textContent = 'PRESS IT';
  const pressCue = document.createElement('small');
  pressCue.textContent = 'corner him on it';
  pressBtn.appendChild(pressCue);
  pressBtn.addEventListener('click', () => on.press());
  prompt.appendChild(pressBtn);

  const passBtn = document.createElement('button');
  passBtn.type = 'button';
  passBtn.className = 'pass';
  passBtn.dataset.pass = '';
  passBtn.textContent = '— or let it pass, play it safe —';
  passBtn.addEventListener('click', () => on.pass());
  prompt.appendChild(passBtn);

  root.appendChild(prompt);
}
