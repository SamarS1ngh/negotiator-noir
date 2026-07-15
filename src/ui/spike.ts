const TIMED_MS = 2500;

/**
 * Renders the "tell spike" burst — ported from concept/ui/screen_spike.html.
 * A tell just cracked through; you get one beat to press it before he
 * recovers, or let it pass. Accent color is driven by the opponent's
 * `palette` token (must match a `--<palette>`/`--<palette>-dim` pair
 * defined in theme.css, e.g. 'crimson').
 *
 * When `timed` is true, a CSS-driven ring drains over ~2.5s and a
 * `setTimeout` fires `on.pass()` on lapse. When `timed` is false (tests),
 * everything renders statically with no timer — deterministic.
 */
export function renderSpike(
  root: HTMLElement,
  tellText: string,
  palette: string,
  on: { press(): void; pass(): void },
  timed: boolean,
): void {
  root.innerHTML = '';
  root.classList.add('spike-screen');
  root.style.setProperty('--accent', `var(--${palette})`);
  root.style.setProperty('--accent-dim', `var(--${palette}-dim)`);

  const tell = document.createElement('div');
  tell.className = 'tell';

  const ring = document.createElement('div');
  ring.className = timed ? 'ring timed' : 'ring';
  const ringTwo = document.createElement('div');
  ringTwo.className = timed ? 'ring two timed' : 'ring two';

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

  let timer: ReturnType<typeof setTimeout> | undefined;
  const clear = (): void => {
    if (timer) clearTimeout(timer);
  };

  const pressBtn = document.createElement('button');
  pressBtn.type = 'button';
  pressBtn.className = 'press';
  pressBtn.dataset.press = '';
  pressBtn.textContent = 'PRESS IT';
  const pressCue = document.createElement('small');
  pressCue.textContent = 'corner him on it';
  pressBtn.appendChild(pressCue);
  pressBtn.addEventListener('click', () => {
    clear();
    on.press();
  });
  prompt.appendChild(pressBtn);

  const passBtn = document.createElement('button');
  passBtn.type = 'button';
  passBtn.className = 'pass';
  passBtn.dataset.pass = '';
  passBtn.textContent = '— or let it pass, play it safe —';
  passBtn.addEventListener('click', () => {
    clear();
    on.pass();
  });
  prompt.appendChild(passBtn);

  root.appendChild(prompt);

  if (timed) {
    const timerEl = document.createElement('div');
    timerEl.className = 'timer';
    timerEl.style.animationDuration = `${TIMED_MS}ms`;
    root.appendChild(timerEl);

    timer = setTimeout(() => on.pass(), TIMED_MS);
  }
}
