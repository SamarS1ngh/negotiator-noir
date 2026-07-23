// ---- THE FRONT DOOR: title screen, the intro framing cards, and the chapter
// select. All full-screen, tap-driven, styled to match the noir game.

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}
function btn(className: string, label: string, fn: () => void): HTMLButtonElement {
  const b = el('button', className, label) as HTMLButtonElement;
  b.type = 'button';
  b.addEventListener('click', fn);
  return b;
}

export interface MenuChapter { id: string; num: number; title: string; reached: boolean; }

export interface MenuHandlers {
  hasSave: boolean;
  onContinue(): void;
  onNew(): void;
  onChapters(): void;
}

// THE TITLE SCREEN — what the game is, in a line, and the way in.
export function renderMenu(root: HTMLElement, on: MenuHandlers): void {
  root.innerHTML = '';
  root.className = 'menu-screen title-screen';
  root.onclick = null;
  // the MC, back turned, cyan lightning splitting the night — the hero shot
  const img = el('img', 'menu-bg-img') as HTMLImageElement;
  img.src = 'assets/art/menu/mc_back1.jpg'; img.alt = '';
  img.onerror = () => img.remove();
  root.appendChild(img);
  root.appendChild(el('div', 'menu-scrim'));
  root.appendChild(el('div', 'menu-flash'));   // the electric cyan flicker over it all
  const wrap = el('div', 'title-wrap');
  wrap.appendChild(el('div', 'title-kicker', 'a noir game of reading people'));
  wrap.appendChild(el('div', 'title-name', 'THE NEGOTIATOR'));
  wrap.appendChild(el('div', 'title-tag',
    'A city runs on debt, and the empire that runs it broke your father. You can’t fight it head-on — so you take it apart, one person at a time.'));
  const acts = el('div', 'title-acts');
  // CONTINUE is always shown so it's never a mystery — lit when a game is in
  // progress, greyed when there's nothing to resume yet.
  const cont = btn(`title-btn ${on.hasSave ? 'primary' : 'disabled'}`, 'CONTINUE', on.hasSave ? on.onContinue : () => { /* nothing to resume */ });
  if (!on.hasSave) { (cont as HTMLButtonElement).disabled = true; cont.title = 'No game in progress yet'; }
  acts.appendChild(cont);
  acts.appendChild(btn(`title-btn ${on.hasSave ? '' : 'primary'}`.trim(), 'NEW GAME', on.onNew));
  acts.appendChild(btn('title-btn', 'CHAPTERS', on.onChapters));
  wrap.appendChild(acts);
  wrap.appendChild(el('div', 'title-foot', 'There are no right answers — only choices, and what they cost. Your choices decide the story.'));
  root.appendChild(wrap);
}

// THE INTRO CARDS — set the expectation before the cold-open: this is a branching
// game where choices, not victories, drive the story. Tap through, then the game.
const INTRO_CARDS = [
  'This is a game of reading people.',
  'There are no right answers — only choices, and what each one costs you.',
  'Everyone you turn, buy, or break bends what happens next. One choice leads to the next.',
  'The web you leave behind — the allies, the enemies, the dead — is the story you live with.',
];
export function renderIntro(root: HTMLElement, onDone: () => void): void {
  let i = 0;
  function draw(): void {
    root.innerHTML = '';
    root.className = 'menu-screen intro-screen';
    root.appendChild(el('div', 'menu-bg'));
    const card = el('div', 'intro-card');
    card.appendChild(el('div', 'intro-line', INTRO_CARDS[i]!));
    card.appendChild(el('div', 'intro-tap', i < INTRO_CARDS.length - 1 ? 'tap to go on ▸' : 'begin ▸'));
    root.appendChild(card);
    const dots = el('div', 'intro-dots');
    for (let d = 0; d < INTRO_CARDS.length; d += 1) dots.appendChild(el('span', `idot${d === i ? ' on' : ''}`));
    root.appendChild(dots);
    root.onclick = () => { i += 1; if (i >= INTRO_CARDS.length) { root.onclick = null; onDone(); } else draw(); };
  }
  draw();
}

// THE CHAPTER SELECT — replay any chapter you've REACHED; the rest are locked.
export function renderChapterSelect(
  root: HTMLElement,
  chapters: MenuChapter[],
  on: { onPick(id: string): void; onBack(): void },
): void {
  root.innerHTML = '';
  root.className = 'menu-screen chapters-screen';
  root.onclick = null;
  root.appendChild(el('div', 'menu-bg'));
  const head = el('div', 'chsel-head');
  head.appendChild(btn('chsel-back', '◂ back', on.onBack));
  head.appendChild(el('div', 'chsel-title', 'CHAPTERS'));
  root.appendChild(head);
  root.appendChild(el('div', 'chsel-note', 'Replay any chapter you’ve reached. Locked chapters unlock when you climb to them.'));
  const list = el('div', 'chsel-list');
  for (const c of chapters) {
    const row = el('div', `chsel-row${c.reached ? '' : ' locked'}`);
    row.appendChild(el('div', 'chsel-num', `CH ${c.num}`));
    const mid = el('div', 'chsel-mid');
    mid.appendChild(el('div', 'chsel-name', c.title));
    mid.appendChild(el('div', 'chsel-state', c.reached ? 'reached — replay from here' : 'locked'));
    row.appendChild(mid);
    row.appendChild(el('div', 'chsel-go', c.reached ? '▸' : '●'));
    if (c.reached) row.addEventListener('click', () => on.onPick(c.id));
    list.appendChild(row);
  }
  root.appendChild(list);
}
