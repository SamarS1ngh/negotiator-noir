import type { Chapter, BoardState, Action, Node } from '../domain/board';
import { availableActions, HEAT_MAX } from '../domain/board';

// ---- THE WEB board: the cast as portrait nodes, the lines between them showing
// how they feel about each other. Tap a node → the moves you can make on them.
// This is where you work the people before you ever sit at the table.

export interface BoardHandlers {
  act(actionId: string): void;
  select(nodeId: string | null): void;
  sitDown(): void;
  restartChapter(): void;
  restartGame(): void;
  mainMenu(): void;
}

const DISP_LABEL = ['enemy', 'wary', 'neutral', 'warm', 'ally'];

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

// the pause menu overlay — continue, restart the chapter, or restart the whole game.
// Destructive options arm on first tap and fire on the second (no accidental wipes).
function openMenu(root: HTMLElement, on: BoardHandlers): void {
  const ov = el('div', 'menu-overlay');
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
  const panel = el('div', 'menu-panel');
  panel.appendChild(el('div', 'menu-title', 'PAUSED'));
  const mk = (label: string, cls: string, danger: boolean, fn: () => void): void => {
    const b = el('button', `menu-btn ${cls}`, label) as HTMLButtonElement;
    b.type = 'button';
    if (danger) {
      let armed = false;
      b.addEventListener('click', () => {
        if (!armed) { armed = true; b.textContent = 'tap again to confirm'; b.classList.add('armed'); return; }
        ov.remove(); fn();
      });
    } else {
      b.addEventListener('click', () => { ov.remove(); fn(); });
    }
    panel.appendChild(b);
  };
  mk('CONTINUE', 'go', false, () => { /* just close */ });
  mk('MAIN MENU', '', false, on.mainMenu);
  mk('RESTART CHAPTER', 'warn', true, on.restartChapter);
  mk('RESTART GAME', 'danger', true, on.restartGame);
  ov.appendChild(panel);
  root.appendChild(ov);
}

export function renderBoard(
  root: HTMLElement,
  ch: Chapter,
  st: BoardState,
  selected: string | null,
  on: BoardHandlers,
  result?: string,
  changed?: Set<string>,   // nodes that just shifted — they flare
): void {
  root.innerHTML = '';
  root.className = 'board-screen';
  root.onclick = null;   // never inherit a leaked tap handler

  if (result) root.appendChild(el('div', 'board-toast', result));

  // header
  const top = el('div', 'board-top');
  const t = el('div', 'board-title');
  t.appendChild(el('span', 'bt-ch', 'the web'));
  t.appendChild(el('span', 'bt-name', ch.title));
  top.appendChild(t);
  // the pause / menu button — restart chapter or the whole game
  const menuBtn = el('button', 'board-menu-btn', '☰');
  (menuBtn as HTMLButtonElement).type = 'button';
  menuBtn.addEventListener('click', () => openMenu(root, on));
  top.appendChild(menuBtn);
  // no move budget — you can work as many people as you dare. HEAT is the cost.
  const status = el('div', 'board-status');

  // HEAT — your exposure. Rises on botches, carries across chapters, makes the
  // next target warier.
  const heat = el('div', `board-heat h-${st.heat >= 7 ? 'hot' : st.heat >= 4 ? 'warm' : 'cool'}`);
  heat.appendChild(el('span', 'bm-lab', 'heat'));
  const hbar = el('div', 'heat-bar');
  const hfill = el('div', 'heat-fill');
  hfill.style.width = `${Math.round((st.heat / HEAT_MAX) * 100)}%`;
  hbar.appendChild(hfill);
  heat.appendChild(hbar);
  status.appendChild(heat);
  top.appendChild(status);
  root.appendChild(top);

  // the web itself
  const web = el('div', 'web');
  const byId = new Map(st.nodes.map((n) => [n.id, n]));

  // edges (SVG under the nodes)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'web-edges');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  for (const e of ch.edges) {
    const a = byId.get(e.from); const b = byId.get(e.to);
    if (!a || !b) continue;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(a.x)); line.setAttribute('y1', String(a.y));
    line.setAttribute('x2', String(b.x)); line.setAttribute('y2', String(b.y));
    line.setAttribute('class', `edge e-${e.label}`);
    svg.appendChild(line);
  }
  web.appendChild(svg);

  // edge labels
  for (const e of ch.edges) {
    const a = byId.get(e.from); const b = byId.get(e.to);
    if (!a || !b) continue;
    const lab = el('div', `edge-label el-${e.label}`, e.label);
    lab.style.left = `${(a.x + b.x) / 2}%`;
    lab.style.top = `${(a.y + b.y) / 2}%`;
    web.appendChild(lab);
  }

  // nodes — pinned photos on the corkboard
  for (const n of st.nodes) {
    const flare = changed?.has(n.id) ? ' flare' : '';
    const node = document.createElement('button');
    node.type = 'button';
    node.className = `web-node${n.locked ? ' locked' : ''}${n.dealTarget ? ' target' : ''}${selected === n.id ? ' sel' : ''}${flare} d-${n.disposition}`;
    node.dataset.node = n.id;
    node.style.left = `${n.x}%`;
    node.style.top = `${n.y}%`;

    const photo = el('div', 'nd-photo');
    photo.appendChild(el('span', 'nd-pin'));
    if (n.portrait && !n.locked) {
      const img = document.createElement('img');
      img.src = n.portrait;
      img.alt = n.name;
      img.onerror = () => { img.replaceWith(el('span', 'nd-init', n.name.charAt(0))); };
      photo.appendChild(img);
    } else {
      photo.appendChild(el('span', 'nd-init', n.locked ? '?' : n.name.charAt(0)));
    }
    node.appendChild(photo);
    node.appendChild(el('div', 'nd-name', n.locked ? '???' : n.name));
    if (!n.locked && n.id !== 'you') node.appendChild(el('div', 'nd-disp', DISP_LABEL[n.disposition]));
    if (!n.locked) node.addEventListener('click', () => on.select(selected === n.id ? null : n.id));
    web.appendChild(node);
  }
  root.appendChild(web);

  // action sheet for the selected node
  const sel = selected ? byId.get(selected) : null;
  if (sel) root.appendChild(actionSheet(ch, st, sel, on));

  const foot = el('div', 'board-foot');
  const button = (cls: string, label: string, fn: () => void): void => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.dataset.sit = ''; b.textContent = label;
    b.addEventListener('click', fn);
    foot.appendChild(b);
  };
  const hint = (t: string): void => { foot.appendChild(el('div', 'bf-hint', t)); };

  const target = byId.get(ch.targetId);
  const targetName = (target?.name ?? 'THE TARGET').toUpperCase();
  const dealt = st.done.has(`__dealt_${ch.targetId}`);   // sat down but forced no way up (a dead-end)

  if (ch.id === 'ch6') {
    // the endgame — turn Marlowe's house, then move on him
    if (dealt) {
      hint('It is done. The empire that ate your father answers to you now — or to no one.');
      const b = el('button', 'board-sit done'); (b as HTMLButtonElement).disabled = true; b.textContent = '— THE END —'; foot.appendChild(b);
    } else {
      hint('turn his own house against him — work as many as you dare. every botch raises the heat.');
      button('board-sit marlowe', 'MOVE ON MARLOWE ▸', () => on.sitDown());
    }
  } else {
    // a climbing chapter — work the web, then sit with the target to force a way up
    if (dealt) {
      hint('You dealt with him — but forced no way up. The climb ends here, this time.');
    } else {
      hint('work his people first — as many as you dare. every botch raises the heat, and the sit-down gets harder.');
      button('board-sit', `SIT DOWN WITH ${targetName} ▸`, () => on.sitDown());
    }
  }
  root.appendChild(foot);
}

function actionSheet(ch: Chapter, st: BoardState, node: Node, on: BoardHandlers): HTMLElement {
  const sheet = el('div', 'act-sheet');
  const head = el('div', 'as-head');
  head.appendChild(el('span', 'as-name', node.name));
  head.appendChild(el('span', 'as-role', node.role));
  sheet.appendChild(head);

  const acts: Action[] = availableActions(ch, st, node.id);
  if (node.id === 'you') {
    sheet.appendChild(el('div', 'as-none', "That's you. The one they'll never see coming."));
  } else if (acts.length === 0) {
    sheet.appendChild(el('div', 'as-none', "Nothing more to do here right now."));
  } else {
    for (const a of acts) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act';
      b.dataset.act = a.id;
      b.appendChild(el('div', 'act-label', a.label));
      b.appendChild(el('div', 'act-blurb', a.blurb));
      b.addEventListener('click', () => on.act(a.id));   // no move gate — heat is the cost
      sheet.appendChild(b);
    }
  }
  return sheet;
}
