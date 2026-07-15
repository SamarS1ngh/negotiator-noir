import type { AngleId, Band, DuelState, MoodState, Opponent, Risk, Script } from '../domain/types';
import { riskOf } from '../domain/engine';
import { mountFace } from './face';

const SVG_NS = 'http://www.w3.org/2000/svg';

const ANGLE_LABELS: Record<AngleId, string> = {
  lean: 'Lean',
  flatter: 'Flatter',
  plant_doubt: 'Plant doubt',
  bluff: 'Bluff',
  offer_out: 'Offer a way out',
};

// Dial wedge labels — short, may wrap to a second line (ported from the SVG in duel_v5.html).
const DIAL_LABELS: Record<AngleId, [string] | [string, string]> = {
  lean: ['Lean'],
  flatter: ['Flatter'],
  plant_doubt: ['Plant', 'Doubt'],
  bluff: ['Bluff'],
  offer_out: ['Offer'],
};

const RISK_LABELS: Record<Risk, string> = {
  safe: 'safe · buys a read, gives no ground',
  uncertain: 'uncertain · could go either way',
  high: 'high risk · could rattle him or blow up',
};

// Fallback "what it means" read when the last probe emitted no scripted statement.
const GENERIC_SUBTEXT: Record<Band, string> = {
  lands: "He's shifting — that got under the collar.",
  neutral: 'Nothing given away. He just looks at you.',
  backfires: "He's smiling, slow. Wrong move.",
};

const VERDICT_HEAD: Record<Band, string> = {
  lands: 'HE FLINCHED',
  neutral: 'HE BRUSHED IT OFF',
  backfires: 'THAT BACKFIRED',
};

// Five wedges, one per angle in script.angles order — geometry ported verbatim
// from the approved dial SVG in concept/ui/duel_v5.html.
const WEDGES: { d: string; lx: number; ly: number }[] = [
  { d: 'M100,100 L100,10 A90,90 0 0,1 185.6,72.2 Z', lx: 132, ly: 55 },
  { d: 'M100,100 L185.6,72.2 A90,90 0 0,1 152.9,172.8 Z', lx: 150, ly: 120 },
  { d: 'M100,100 L152.9,172.8 A90,90 0 0,1 47.1,172.8 Z', lx: 100, ly: 150 },
  { d: 'M100,100 L47.1,172.8 A90,90 0 0,1 14.4,72.2 Z', lx: 48, ly: 120 },
  { d: 'M100,100 L14.4,72.2 A90,90 0 0,1 100,10 Z', lx: 64, ly: 55 },
];

export interface DuelReaction { band: Band; fresh: boolean; spent?: boolean }

// Module-level: the tell's plain-language "teach" is shown once per app run,
// the first time a tell appears — after that, just the tell text (per brief).
let seenTell = false;

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
}

function floatEl(cls: string, keyText: string): HTMLElement {
  const div = document.createElement('div');
  div.className = `float ${cls}`;
  const k = document.createElement('span');
  k.className = 'k';
  k.textContent = keyText;
  div.appendChild(k);
  return div;
}

// Bolds the opponent's name where it occurs inside the objective goal string
// (e.g. "BREAK RICCI" -> "BREAK <b>RICCI</b>"), matching the mockup's markup
// without requiring the content to pre-split the string.
function appendGoal(container: HTMLElement, goal: string, name: string): void {
  container.append('◎ ');
  const idx = goal.toUpperCase().indexOf(name.toUpperCase());
  if (idx === -1) {
    container.append(goal);
    return;
  }
  container.append(goal.slice(0, idx));
  const b = document.createElement('b');
  b.textContent = goal.slice(idx, idx + name.length);
  container.appendChild(b);
  container.append(goal.slice(idx + name.length));
}

function buildDial(
  script: Script,
  selectedAngle: AngleId | null,
  pickAngle: (a: AngleId) => void,
): SVGSVGElement {
  const svg = svgEl('svg');
  svg.setAttribute('class', 'dial');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('aria-label', 'angle dial');

  const g = svgEl('g');
  g.setAttribute('class', 'seg');

  script.angles.forEach((a, i) => {
    const w = WEDGES[i];
    if (!w) return;
    const path = svgEl('path');
    path.setAttribute('d', w.d);
    path.setAttribute('data-angle', a);
    if (a === selectedAngle) path.classList.add('active');
    path.addEventListener('click', () => pickAngle(a));
    g.appendChild(path);
  });
  svg.appendChild(g);

  const hub = svgEl('circle');
  hub.setAttribute('class', 'hub');
  hub.setAttribute('cx', '100');
  hub.setAttribute('cy', '100');
  hub.setAttribute('r', '25');
  svg.appendChild(hub);

  script.angles.forEach((a, i) => {
    const w = WEDGES[i];
    if (!w) return;
    const text = svgEl('text');
    text.setAttribute('class', `lbl${a === selectedAngle ? ' active' : ''}`);
    text.setAttribute('x', String(w.lx));
    text.setAttribute('y', String(w.ly));
    const [first, second] = DIAL_LABELS[a];
    text.textContent = first;
    if (second) {
      const tspan = svgEl('tspan');
      tspan.setAttribute('x', String(w.lx));
      tspan.setAttribute('dy', '13');
      tspan.textContent = second;
      text.appendChild(tspan);
    }
    svg.appendChild(text);
  });

  const hublbl = svgEl('text');
  hublbl.setAttribute('class', 'hublbl');
  hublbl.setAttribute('x', '100');
  hublbl.setAttribute('y', '104');
  hublbl.textContent = 'PICK';
  svg.appendChild(hublbl);

  return svg;
}

function buildWordHud(
  state: DuelState,
  opp: Opponent,
  script: Script,
  selectedAngle: AngleId,
  probe: (lineId: string) => void,
): HTMLElement {
  const wordhud = document.createElement('div');
  wordhud.className = 'wordhud';

  const head = document.createElement('div');
  head.className = 'whud-head';
  head.textContent = `▸ ${ANGLE_LABELS[selectedAngle].toLowerCase()} — your words`;
  wordhud.appendChild(head);

  for (const l of script.lines.filter((line) => line.angleId === selectedAngle)) {
    const risk = riskOf(state, opp, l);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'whud-word';
    btn.dataset.line = l.id;

    const wt = document.createElement('span');
    wt.className = 'wt';
    wt.textContent = `"${l.text}"`;

    const wr = document.createElement('span');
    wr.className = 'wr';
    const dot = document.createElement('i');
    dot.className = `dot risk-${risk}`;
    dot.dataset.risk = risk;
    wr.append(dot, document.createTextNode(RISK_LABELS[risk]));

    btn.append(wt, wr);
    btn.addEventListener('click', () => probe(l.id));
    wordhud.appendChild(btn);
  }

  return wordhud;
}

/**
 * Renders the whole duel screen — ported from concept/ui/duel_v5.html:
 * objective bar, scene (his face + floating reads + composure), conversation
 * (dialogue only), and your play (the segmented angle dial -> word HUD).
 * The probe verdict is inline here (reaction): it punches out on a fresh
 * probe, then docks top-right as a small "last read" marker.
 */
export function renderDuel(
  root: HTMLElement,
  state: DuelState,
  opp: Opponent,
  script: Script,
  on: { probe(lineId: string): void; pickAngle(a: AngleId): void; openRecord(): void },
  selectedAngle: AngleId | null,
  reaction?: DuelReaction,
): void {
  root.innerHTML = '';
  root.classList.add('duel-screen');

  // ---- objective bar ----
  if (opp.objective) {
    const objective = document.createElement('div');
    objective.className = 'objective';
    const goal = document.createElement('div');
    goal.className = 'goal';
    appendGoal(goal, opp.objective.goal, opp.name);
    const why = document.createElement('div');
    why.className = 'why';
    why.textContent = opp.objective.why;
    objective.append(goal, why);
    root.appendChild(objective);
  }

  // ---- scene: his face + floating reads ----
  const scene = document.createElement('div');
  scene.className = 'scene';

  const stageDiv = document.createElement('div');
  const face = mountFace(stageDiv, opp);
  face.setMood(state.mood);
  scene.appendChild(stageDiv);

  const who = document.createElement('div');
  who.className = 'who';
  const nm = document.createElement('div');
  nm.className = 'nm';
  nm.textContent = opp.name.toUpperCase();
  who.appendChild(nm);
  scene.appendChild(who);

  const exprText = opp.expressions?.[state.mood];
  if (exprText) {
    const expr = floatEl('f-expr', 'his face');
    expr.append(exprText);
    scene.appendChild(expr);
  }

  const stmts = state.record.statements;
  const lastStmt = stmts.length > 0 ? stmts[stmts.length - 1] : undefined;
  const subtext = lastStmt?.subtext ?? (reaction ? GENERIC_SUBTEXT[reaction.band] : undefined);
  if (subtext) {
    const sub = floatEl('f-sub', 'what it means');
    sub.append(subtext);
    scene.appendChild(sub);
  }

  const tellMoods: MoodState[] = ['rattled', 'cornered', 'folding'];
  if (opp.tell && tellMoods.includes(state.mood)) {
    const tell = floatEl('f-tell', '▲ a tell');
    tell.append(opp.tell.text);
    if (!seenTell) {
      seenTell = true;
      const teach = document.createElement('span');
      teach.className = 'teach';
      teach.textContent = opp.tell.teach;
      tell.appendChild(teach);
    }
    scene.appendChild(tell);
  }

  if (reaction) {
    const kind = reaction.spent ? 'neutral' : reaction.band;
    const headText = reaction.spent ? "HE'S HEARD THAT" : VERDICT_HEAD[reaction.band];

    const dock = document.createElement('div');
    dock.className = 'float f-verdict';
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = 'last read';
    const big = document.createElement('div');
    big.className = `big v-${kind}`;
    big.textContent = headText;
    dock.append(note, big);
    scene.appendChild(dock);

    if (reaction.fresh) {
      const punch = document.createElement('div');
      punch.className = `verdict-punch v-${kind}`;
      punch.textContent = headText;
      scene.appendChild(punch);
    }
  }

  const hisbar = document.createElement('div');
  hisbar.className = 'hisbar';
  const lbl = document.createElement('div');
  lbl.className = 'lbl';
  const lblLeft = document.createElement('span');
  lblLeft.append('his composure — ');
  const breakIt = document.createElement('b');
  breakIt.textContent = 'break it to 0';
  lblLeft.appendChild(breakIt);
  const lblRight = document.createElement('span');
  lblRight.textContent = String(Math.round(clampPct(state.hisComposure)));
  lbl.append(lblLeft, lblRight);
  const track = document.createElement('div');
  track.className = 'track';
  const fill = document.createElement('i');
  fill.style.width = `${clampPct(state.hisComposure)}%`;
  track.appendChild(fill);
  hisbar.append(lbl, track);
  scene.appendChild(hisbar);

  root.appendChild(scene);

  // ---- conversation: dialogue only ----
  const convo = document.createElement('div');
  convo.className = 'convo';

  const youText = state.log.length > 0 ? state.log[state.log.length - 1]! : null;
  const turnYou = document.createElement('div');
  turnYou.className = 'turn you';
  const bYou = document.createElement('b');
  bYou.textContent = 'YOU';
  turnYou.append(bYou, document.createTextNode(youText ? ` — ${youText}` : " — you haven't moved yet."));
  convo.appendChild(turnYou);

  const turnHim = document.createElement('div');
  turnHim.className = 'turn him';
  const bHim = document.createElement('b');
  bHim.textContent = opp.name;
  turnHim.append(bHim, document.createTextNode(lastStmt ? `"${lastStmt.text}"` : "He's waiting on you."));
  convo.appendChild(turnHim);

  root.appendChild(convo);

  // ---- your play: angle dial -> word HUD ----
  const move = document.createElement('div');
  move.className = 'move';

  const head = document.createElement('div');
  head.className = 'head';
  head.append('◆ Your play — ');
  const headB = document.createElement('b');
  headB.textContent = selectedAngle ? ANGLE_LABELS[selectedAngle].toLowerCase() : 'tap an angle';
  head.appendChild(headB);
  head.append(selectedAngle ? ' — now the words' : ', it opens your words');
  move.appendChild(head);

  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.appendChild(buildDial(script, selectedAngle, on.pickAngle));
  if (selectedAngle) hud.appendChild(buildWordHud(state, opp, script, selectedAngle, on.probe));
  move.appendChild(hud);

  const footer = document.createElement('div');
  footer.className = 'footer';

  const comp = document.createElement('div');
  comp.className = 'comp';
  comp.append('You ');
  const pips = document.createElement('span');
  pips.className = 'pips';
  const pipCount = 4;
  const filled = Math.round((clampPct(state.yourComposure) / 100) * pipCount);
  for (let i = 0; i < pipCount; i += 1) {
    const pip = document.createElement('i');
    pip.className = `pip${i < filled ? '' : ' off'}`;
    pips.appendChild(pip);
  }
  comp.appendChild(pips);

  const recordBtn = document.createElement('button');
  recordBtn.type = 'button';
  recordBtn.className = 'recbtn';
  recordBtn.dataset.openRecord = '';
  recordBtn.textContent = 'THE RECORD ▸';
  recordBtn.addEventListener('click', () => on.openRecord());

  footer.append(comp, recordBtn);
  move.appendChild(footer);

  root.appendChild(move);
}
