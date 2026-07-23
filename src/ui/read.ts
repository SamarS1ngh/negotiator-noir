// ---- THE READ: a social puzzle, not a quiz. The mark's scene fills the frame;
// the player taps what they NOTICE (clues pinned on the image), each revealing an
// observation; then they make a judgment about what he's really driven by. The
// deduction routes the mission the same way the old text fork did — but now the
// player earned it by looking.

export interface ReadView {
  name: string; role: string; portrait?: string; mood?: string; palette?: string;
  ask: string; hint?: string;
  clues: { x: number; y: number; label: string; note: string; grants?: string }[];
  options: { id: string; label: string }[];
}
// deduce reports which evidence flags the player NOTICED — they unlock levers later
export interface ReadHandlers { deduce(optionId: string, found: string[]): void; menu?(): void; }

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderRead(root: HTMLElement, view: ReadView, on: ReadHandlers): void {
  const found = new Set<number>();
  const foundFlags = new Set<string>();   // evidence noticed → unlocks levers later
  let phase: 'look' | 'deduce' = 'look';
  let flash: number | null = null;   // index of the just-revealed clue (for a highlight)

  function draw(): void {
    root.innerHTML = '';
    root.className = `meet-screen mission-screen bg-scene read-screen ${view.palette ? 'pal-' + view.palette : ''} ${view.mood ? 'mood-' + view.mood : ''}`.replace(/\s+/g, ' ').trim();
    root.onclick = null;

    const bg = el('div', 'meet-bg');
    if (view.portrait) {
      const img = document.createElement('img');
      img.className = 'meet-portrait'; img.src = view.portrait; img.alt = view.name;
      img.onerror = () => { img.style.display = 'none'; };
      bg.appendChild(img);
    }
    bg.appendChild(el('div', 'scene-mood'));
    bg.appendChild(el('div', 'meet-grad'));
    root.appendChild(bg);

    if (on.menu) {
      const mb = el('button', 'scene-menu-btn', '☰'); (mb as HTMLButtonElement).type = 'button';
      mb.addEventListener('click', (e) => { e.stopPropagation(); on.menu!(); });
      root.appendChild(mb);
    }

    const top = el('div', 'read-top');
    top.appendChild(el('div', 'read-kicker', phase === 'look' ? 'READ HIM' : 'YOUR READ'));
    top.appendChild(el('div', 'read-name', view.name));
    top.appendChild(el('div', 'read-hint', phase === 'look' ? (view.hint ?? 'Tap what you notice.') : view.ask));
    root.appendChild(top);

    if (phase === 'look') {
      view.clues.forEach((c, i) => {
        const pin = el('button', `read-pin${found.has(i) ? ' found' : ''}${flash === i ? ' flash' : ''}`);
        (pin as HTMLButtonElement).type = 'button';
        pin.style.left = `${c.x}%`; pin.style.top = `${c.y}%`;
        pin.textContent = found.has(i) ? '✓' : '';
        pin.addEventListener('click', () => { found.add(i); if (c.grants) foundFlags.add(c.grants); flash = i; draw(); });
        root.appendChild(pin);
      });

      const notes = el('div', 'read-notes');
      view.clues.forEach((c, i) => {
        if (!found.has(i)) return;
        const n = el('div', `read-note${flash === i ? ' fresh' : ''}`);
        n.appendChild(el('div', 'read-note-lab', c.label));
        n.appendChild(el('div', 'read-note-t', c.note));
        notes.appendChild(n);
      });
      root.appendChild(notes);
      flash = null;

      const bar = el('div', 'read-bar');
      bar.appendChild(el('div', 'read-count', `${found.size} / ${view.clues.length} noticed`));
      const go = el('button', `read-go${found.size >= 1 ? '' : ' dim'}`, 'MAKE YOUR READ ▸');
      (go as HTMLButtonElement).type = 'button';
      if (found.size >= 1) go.addEventListener('click', () => { phase = 'deduce'; draw(); });
      else (go as HTMLButtonElement).disabled = true;
      bar.appendChild(go);
      root.appendChild(bar);
    } else {
      const sheet = el('div', 'read-deduce');
      sheet.appendChild(el('div', 'read-deduce-lab', 'call it — and live with it'));
      for (const o of view.options) {
        const b = el('button', 'read-opt', o.label); (b as HTMLButtonElement).type = 'button';
        b.addEventListener('click', () => on.deduce(o.id, [...foundFlags]));
        sheet.appendChild(b);
      }
      const back = el('button', 'read-back', '◂ look again'); (back as HTMLButtonElement).type = 'button';
      back.addEventListener('click', () => { phase = 'look'; draw(); });
      sheet.appendChild(back);
      root.appendChild(sheet);
    }
  }

  draw();
}
