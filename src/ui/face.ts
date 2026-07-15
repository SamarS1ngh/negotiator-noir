import type { MoodState, Opponent } from '../domain/types';

const MOODS: MoodState[] = ['guarded', 'rattled', 'angry', 'cornered', 'folding'];

/**
 * CinematicFace — stacks the 5 mood-state images inside `root` (only the
 * current mood is visible; switching moods cross-fades via CSS opacity).
 * A missing/broken image never throws — it falls back to a solid --ink box.
 */
export function mountFace(
  root: HTMLElement,
  opp: Opponent,
): { setMood(m: MoodState): void; flashTell(text: string): void } {
  root.classList.add('stage');

  const layers = new Map<MoodState, HTMLElement>();

  for (const mood of MOODS) {
    const src = opp.art.states[mood];
    const layer = src ? buildImageLayer(opp, mood, src, layers) : buildFallbackLayer(mood);
    layers.set(mood, layer);
    root.appendChild(layer);
  }

  const vignette = document.createElement('div');
  vignette.className = 'vignette';
  root.appendChild(vignette);

  const tellFlash = document.createElement('div');
  tellFlash.className = 'tell-flash';
  root.appendChild(tellFlash);

  const setMood = (m: MoodState): void => {
    for (const [mood, el] of layers) {
      el.classList.toggle('on', mood === m);
    }
  };
  setMood('guarded');

  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  const flashTell = (text: string): void => {
    tellFlash.textContent = text;
    tellFlash.classList.add('on');
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(() => tellFlash.classList.remove('on'), 2200);
  };

  return { setMood, flashTell };
}

function buildImageLayer(
  opp: Opponent,
  mood: MoodState,
  src: string,
  layers: Map<MoodState, HTMLElement>,
): HTMLElement {
  const img = document.createElement('img');
  img.className = 'stage-img';
  img.alt = `${opp.name} — ${mood}`;
  img.dataset.mood = mood;
  img.src = src;
  img.onerror = () => {
    const wasOn = img.classList.contains('on');
    const fallback = buildFallbackLayer(mood);
    if (wasOn) fallback.classList.add('on');
    img.replaceWith(fallback);
    layers.set(mood, fallback);
  };
  return img;
}

function buildFallbackLayer(mood: MoodState): HTMLElement {
  const div = document.createElement('div');
  div.className = 'stage-fallback';
  div.dataset.mood = mood;
  return div;
}
