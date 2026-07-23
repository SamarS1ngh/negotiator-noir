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

// THE COLD OPEN — a cinematic hook in the PRESENT tense that flows straight into
// the played prologue instead of spoiling it. It sets up who Cass is NOW (a man
// on the docks building a map), then dives back into memory — the last frame is
// the shop, and the prologue opens on that same shop, so the cut is seamless.
interface IntroBeat { img: string; line: string; }
const INTRO_BEATS: IntroBeat[] = [
  { img: 'assets/art/menu/mc_back1.jpg', line: "Eighteen months I've worked these docks in the dark. Just 'Cass' — one more face on the pier nobody looks at twice." },
  { img: 'assets/art/scene/now.jpg', line: "Every night I watch the same men. Who skims. Who flinches. Who owes whom. I'm building a map of the whole rotten thing, in my head." },
  { img: 'assets/art/scene/marlowe.jpg', line: "At the top of it sits an empire — and the collector who broke my father for it, and never learned my name." },
  { img: 'assets/art/scene/depart.jpg', line: "All I've got left of the old man is a cold watch in my pocket, and the one thing he put in my head: how to read a man." },
  { img: 'assets/art/scene/shop_teach.jpg', line: "To understand what I'm about to do to them, you have to see where it started. Come back with me. To the shop." },
];
export function renderIntro(root: HTMLElement, onDone: () => void): void {
  let i = 0;
  function draw(): void {
    root.innerHTML = '';
    root.className = 'menu-screen intro-screen';
    root.onclick = null;
    const b = INTRO_BEATS[i]!;
    const img = el('img', 'intro-img') as HTMLImageElement;
    img.src = b.img; img.alt = ''; img.onerror = () => { img.style.display = 'none'; };
    root.appendChild(img);
    root.appendChild(el('div', 'intro-scrim'));
    root.appendChild(el('div', 'intro-bigline', b.line));
    root.appendChild(el('div', 'intro-tap', i < INTRO_BEATS.length - 1 ? 'tap ▸' : 'begin ▸'));
    const dots = el('div', 'intro-dots');
    for (let d = 0; d < INTRO_BEATS.length; d += 1) dots.appendChild(el('span', `idot${d === i ? ' on' : ''}`));
    root.appendChild(dots);
    root.onclick = () => { i += 1; if (i >= INTRO_BEATS.length) { root.onclick = null; onDone(); } else draw(); };
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
