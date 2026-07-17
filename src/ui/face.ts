import type { MoodState, Opponent } from '../domain/types';

const MOODS: MoodState[] = ['guarded', 'rattled', 'angry', 'cornered', 'folding'];

// ---- THE STAGE (v0.8.0 "he moves"). The scene is no longer a still JPEG that
// cross-fades. Three things now act:
//
//   HIM   — each mood has frames (base / _b alt pose / _hit reaction). We CUT
//           between base<->b on a slow beat so he shifts and breathes, and cut
//           HARD to _hit the instant a blow lands. Text-to-image can't tween,
//           so we never tween — cuts read as limited animation, not morphing.
//   CAMERA— a wrapper that pushes in, pulls back, drifts and shakes. It was a
//           dead tripod before.
//   ROOM  — the lamp swings, smoke curls, his watch glints when the tell fires.
//
// All motion is CSS; nothing here blocks or needs a game loop.

export type Shot = 'idle' | 'push' | 'pull' | 'shake';
export type Frame = 'a' | 'b' | 'hit';

export interface Stage {
  setMood(m: MoodState): void;
  /** hard-cut to his reaction pose, then settle back */
  impact(): void;
  /** a smaller beat: he shifts, but nothing got in */
  shift(): void;
  /** camera move */
  shot(s: Shot): void;
  /** the white/red hit flash + speed lines */
  strike(kind: 'lands' | 'backfires'): void;
  flashTell(text: string): void;
}

function el(tag: string, className: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

// mood -> its frames. A missing _b/_hit just falls back to the base frame, so
// the stage still works if art generation hasn't caught up.
function frameSrc(opp: Opponent, mood: MoodState, frame: Frame): string {
  const base = opp.art.states[mood];
  if (!base || frame === 'a') return base;
  return base.replace(/\.jpg$/, `_${frame === 'b' ? 'b' : 'hit'}.jpg`);
}

export function mountFace(root: HTMLElement, opp: Opponent): Stage {
  root.classList.add('stage');

  // camera wrapper — everything in the world moves together
  const cam = el('div', 'cam');
  root.appendChild(cam);

  const layers = new Map<string, HTMLImageElement>();
  let current: MoodState = 'guarded';
  let frame: Frame = 'a';

  for (const mood of MOODS) {
    for (const f of ['a', 'b', 'hit'] as Frame[]) {
      const img = document.createElement('img');
      img.className = 'stage-img';
      img.alt = `${opp.name} — ${mood}`;
      img.dataset.mood = mood;
      img.dataset.frame = f;
      img.src = frameSrc(opp, mood, f);
      // a frame that never generated simply never shows — we fall back to 'a'
      img.dataset.ok = '1';
      img.onerror = () => { img.dataset.ok = '0'; img.classList.remove('on'); };
      cam.appendChild(img);
      layers.set(`${mood}:${f}`, img);
    }
  }

  // the room: swinging lamp light, drifting smoke
  cam.appendChild(el('div', 'lamp-glow'));
  cam.appendChild(el('div', 'smoke'));

  const vignette = el('div', 'vignette');
  root.appendChild(vignette);

  // impact FX live above the world but below the HUD
  const speed = el('div', 'speedlines');
  root.appendChild(speed);
  const flash = el('div', 'hitflash');
  root.appendChild(flash);

  const tellFlash = el('div', 'tell-flash');
  root.appendChild(tellFlash);

  function has(mood: MoodState, f: Frame): boolean {
    return layers.get(`${mood}:${f}`)?.dataset.ok === '1';
  }

  function show(mood: MoodState, f: Frame): void {
    const want = has(mood, f) ? f : 'a';
    for (const [key, img] of layers) img.classList.toggle('on', key === `${mood}:${want}`);
    current = mood; frame = want;
  }

  // NO IDLE CUTTING. He used to flip between poses on a timer to "breathe" —
  // but two AI frames differ enough that it read as the character CHANGING for
  // no reason. He now holds absolutely still and only moves when something
  // actually happens to him: a blow lands, or his mood breaks to a new state.
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  let shotTimer: ReturnType<typeof setTimeout> | undefined;

  const stage: Stage = {
    // only cut when his STATE actually changed — a re-render with the same mood
    // must not disturb him (and must never interrupt a reaction mid-hold)
    setMood(m) {
      if (m === current) return;
      if (settleTimer) clearTimeout(settleTimer);
      show(m, 'a');
    },
    impact() {
      show(current, 'hit');
      if (settleTimer) clearTimeout(settleTimer);
      // hold the reaction long enough to actually see him react
      settleTimer = setTimeout(() => show(current, 'a'), 1300);
    },
    shift() {
      if (!has(current, 'b')) return;
      show(current, 'b');
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => show(current, 'a'), 1100);
    },
    shot(s) {
      cam.classList.remove('cam-push', 'cam-pull', 'cam-shake');
      if (s === 'idle') return;
      const cls = s === 'push' ? 'cam-push' : s === 'pull' ? 'cam-pull' : 'cam-shake';
      // restart the animation even if the same shot fires twice
      void cam.offsetWidth;
      cam.classList.add(cls);
      if (shotTimer) clearTimeout(shotTimer);
      shotTimer = setTimeout(() => cam.classList.remove(cls), 900);
    },
    strike(kind) {
      flash.className = `hitflash ${kind}`;
      speed.className = 'speedlines';
      void flash.offsetWidth; void speed.offsetWidth;
      flash.classList.add('on');
      if (kind === 'lands') speed.classList.add('on');
      setTimeout(() => { flash.classList.remove('on'); speed.classList.remove('on'); }, 900);
    },
    flashTell(text) {
      tellFlash.textContent = text;
      tellFlash.classList.add('on');
      if (flashTimer) clearTimeout(flashTimer);
      flashTimer = setTimeout(() => tellFlash.classList.remove('on'), 2400);
    },
  };

  show('guarded', 'a');
  return stage;
}
