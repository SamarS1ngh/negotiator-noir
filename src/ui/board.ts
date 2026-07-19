import type { Chapter, BoardState, Action, Node } from '../domain/board';
import { availableActions } from '../domain/board';

// ---- THE WEB board: the cast as portrait nodes, the lines between them showing
// how they feel about each other. Tap a node → the moves you can make on them.
// This is where you work the people before you ever sit at the table.

export interface BoardHandlers {
  act(actionId: string): void;
  select(nodeId: string | null): void;
  sitDown(): void;
}

const DISP_LABEL = ['enemy', 'wary', 'neutral', 'warm', 'ally'];

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function renderBoard(
  root: HTMLElement,
  ch: Chapter,
  st: BoardState,
  selected: string | null,
  on: BoardHandlers,
  result?: string,
): void {
  root.innerHTML = '';
  root.className = 'board-screen';

  if (result) root.appendChild(el('div', 'board-toast', result));

  // header
  const top = el('div', 'board-top');
  const t = el('div', 'board-title');
  t.appendChild(el('span', 'bt-ch', 'the web'));
  t.appendChild(el('span', 'bt-name', ch.title));
  top.appendChild(t);
  const moves = el('div', 'board-moves');
  moves.appendChild(el('span', 'bm-lab', 'moves left'));
  const pips = el('div', 'bm-pips');
  for (let i = 0; i < ch.moves; i += 1) pips.appendChild(el('span', `pip${i < st.movesLeft ? ' on' : ''}`));
  moves.appendChild(pips);
  top.appendChild(moves);
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

  // nodes
  for (const n of st.nodes) {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = `web-node${n.locked ? ' locked' : ''}${n.dealTarget ? ' target' : ''}${selected === n.id ? ' sel' : ''} d-${n.disposition}`;
    node.dataset.node = n.id;
    node.style.left = `${n.x}%`;
    node.style.top = `${n.y}%`;
    const disc = el('div', 'nd-disc');
    disc.appendChild(el('span', 'nd-init', n.locked ? '?' : n.name.charAt(0)));
    node.appendChild(disc);
    node.appendChild(el('div', 'nd-name', n.locked ? '???' : n.name));
    if (!n.locked && n.id !== 'you') node.appendChild(el('div', 'nd-disp', DISP_LABEL[n.disposition]));
    if (!n.locked) node.addEventListener('click', () => on.select(selected === n.id ? null : n.id));
    web.appendChild(node);
  }
  root.appendChild(web);

  // action sheet for the selected node
  const sel = selected ? byId.get(selected) : null;
  if (sel) root.appendChild(actionSheet(ch, st, sel, on));

  // sit down
  const foot = el('div', 'board-foot');
  const hint = el('div', 'bf-hint',
    st.movesLeft > 0 ? 'work the people first — you only get so many moves' : "you've done what you can. time to sit down.");
  foot.appendChild(hint);
  const sit = document.createElement('button');
  sit.type = 'button';
  sit.className = 'board-sit';
  sit.dataset.sit = '';
  sit.textContent = 'SIT DOWN WITH RICCI ▸';
  sit.addEventListener('click', () => on.sitDown());
  foot.appendChild(sit);
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
    sheet.appendChild(el('div', 'as-none', st.movesLeft <= 0 ? 'Out of moves.' : "Nothing more to do here right now."));
  } else {
    for (const a of acts) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'act';
      b.dataset.act = a.id;
      b.appendChild(el('div', 'act-label', a.label));
      b.appendChild(el('div', 'act-blurb', a.blurb));
      const can = st.movesLeft > 0;
      if (!can) b.disabled = true;
      else b.addEventListener('click', () => on.act(a.id));
      sheet.appendChild(b);
    }
  }
  return sheet;
}
