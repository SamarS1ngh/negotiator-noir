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

// Dial wedge labels — short, may wrap to a second line (ported from the SVG in duel_v14a.html).
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
  high: 'high risk · could blow up',
};

// Risk -> the dot's modifier class (ported from duel_v8b.html's .r-unc/.r-high, plus a
// "safe" variant the mockup didn't need but the domain's Risk type includes).
const RISK_DOT_CLASS: Record<Risk, string> = {
  safe: 'r-safe',
  uncertain: 'r-unc',
  high: 'r-high',
};

// Fallback "what it means" read, and fallback spoken reaction, for a probe whose
// line has no scripted `emits` statement — a band still fires, so both reads still
// need something to show.
const GENERIC_SUBTEXT: Record<Band, string> = {
  lands: "He's shifting — that got under the collar.",
  neutral: 'Nothing given away. He just looks at you.',
  backfires: "He's smiling, slow. Wrong move.",
};

export const GENERIC_REACTION: Record<Band, string> = {
  lands: "He doesn't answer — but something in his face just gave.",
  neutral: 'He just looks at you. Nothing.',
  backfires: 'He almost laughs in your face.',
};

const VERDICT_HEAD: Record<Band, string> = {
  lands: 'HE FLINCHED',
  neutral: 'HE BRUSHED IT OFF',
  backfires: 'THAT BACKFIRED',
};

// Five wedges, one per angle in script.angles order — geometry ported verbatim
// from the approved dial SVG in concept/ui/duel_v14a.html.
const WEDGES: { d: string; lx: number; ly: number }[] = [
  { d: 'M100,100 L100,12 A88,88 0 0,1 183.6,71.6 Z', lx: 132, ly: 56 },
  { d: 'M100,100 L183.6,71.6 A88,88 0 0,1 151.7,170.9 Z', lx: 149, ly: 120 },
  { d: 'M100,100 L151.7,170.9 A88,88 0 0,1 48.3,170.9 Z', lx: 100, ly: 150 },
  { d: 'M100,100 L48.3,170.9 A88,88 0 0,1 16.4,71.6 Z', lx: 51, ly: 120 },
  { d: 'M100,100 L16.4,71.6 A88,88 0 0,1 100,12 Z', lx: 66, ly: 56 },
];

export interface DuelReaction { band: Band; fresh: boolean; spent?: boolean }

// One turn of the on-screen conversation transcript. The controller owns this
// history (the domain doesn't keep a per-turn transcript) and grows it across
// the whole duel; `quoted` distinguishes an actual scripted statement (shown
// in quotes) from a generic band reaction (shown as narration, no quotes).
export interface ConvoTurn { who: 'you' | 'him'; text: string; quoted?: boolean }

// The "cut to him" bottom bar, live only while his reply is typewriter-ing out
// (see the animated flow in src/app/controller.ts). `done` flips once the full
// text has been revealed; the turn then settles up into the transcript.
export interface CutToHim { text: string; typed: string; done: boolean; quoted: boolean }

export interface DuelView {
  selectedAngle: AngleId | null;
  transcript: ConvoTurn[];
  reaction?: DuelReaction;
  cutToHim?: CutToHim;
}

export interface DuelHandlers {
  probe(lineId: string): void;
  pickAngle(a: AngleId): void;
  openRecord(): void;
  closeModal(): void;
}

// Module-level: the tell's plain-language "teach" is shown once per app run,
// the first time a tell appears — after that, just the tell text (per brief).
let seenTell = false;

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
}

// Bolds the opponent's name where it occurs inside the objective goal string
// (e.g. "BREAK RICCI" -> "BREAK <b>RICCI</b>"), matching the mockup's markup
// without requiring the content to pre-split the string.
function appendGoal(container: HTMLElement, goal: string, name: string): void {
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

// ---- top: objective + his composure (ported from duel_v14a.html's .top) ----
function buildTop(opp: Opponent, state: DuelState): HTMLElement {
  const top = document.createElement('div');
  top.className = 'top';

  if (opp.objective) {
    const obj = document.createElement('div');
    obj.className = 'obj';
    const badge = document.createElement('span');
    badge.className = 'b';
    badge.textContent = '◎';
    const goal = document.createElement('span');
    goal.className = 'g';
    appendGoal(goal, opp.objective.goal, opp.name);
    const composureNum = document.createElement('span');
    composureNum.className = 'c';
    composureNum.textContent = `his composure ${Math.round(clampPct(state.hisComposure))}`;
    obj.append(badge, goal, composureNum);
    top.appendChild(obj);

    const why = document.createElement('div');
    why.className = 'why';
    why.textContent = opp.objective.why;
    top.appendChild(why);
  }

  const cbar = document.createElement('div');
  cbar.className = 'cbar';
  const fill = document.createElement('i');
  fill.style.width = `${clampPct(state.hisComposure)}%`;
  cbar.appendChild(fill);
  top.appendChild(cbar);

  const cl = document.createElement('div');
  cl.className = 'cl';
  cl.textContent = 'break it to 0';
  top.appendChild(cl);

  return top;
}

// ---- reads: floating on the sides, no boxes, glowing text (duel_v14a.html's .reads) ----
function buildReads(state: DuelState, opp: Opponent, reaction?: DuelReaction): HTMLElement {
  const reads = document.createElement('div');
  reads.className = 'reads';

  const exprText = opp.expressions?.[state.mood];
  if (exprText) {
    const face = document.createElement('div');
    face.className = 'read r-face';
    const k = document.createElement('span');
    k.className = 'k';
    k.textContent = '👁 his face';
    const t = document.createElement('span');
    t.className = 't';
    t.textContent = exprText;
    face.append(k, t);
    reads.appendChild(face);
  }

  if (reaction) {
    const kind = reaction.spent ? 'neutral' : reaction.band;
    const headText = reaction.spent ? "HE'S HEARD THAT" : VERDICT_HEAD[reaction.band];
    const verdict = document.createElement('div');
    verdict.className = 'read r-verdict';
    const k = document.createElement('span');
    k.className = 'k';
    k.textContent = 'last read';
    const v = document.createElement('span');
    v.className = `v v-${kind}`;
    v.textContent = headText;
    verdict.append(k, v);
    reads.appendChild(verdict);
  }

  const stmts = state.record.statements;
  const lastStmt = stmts.length > 0 ? stmts[stmts.length - 1] : undefined;
  const subtext = lastStmt?.subtext ?? (reaction ? GENERIC_SUBTEXT[reaction.band] : undefined);
  if (subtext) {
    const sub = document.createElement('div');
    sub.className = 'read r-sub';
    const k = document.createElement('span');
    k.className = 'k';
    k.textContent = '⌕ what it means';
    const t = document.createElement('span');
    t.className = 't';
    t.textContent = subtext;
    sub.append(k, t);
    reads.appendChild(sub);
  }

  const tellMoods: MoodState[] = ['rattled', 'cornered', 'folding'];
  if (opp.tell && tellMoods.includes(state.mood)) {
    const tell = document.createElement('div');
    tell.className = 'read r-tell';
    const k = document.createElement('span');
    k.className = 'k';
    k.textContent = '▲ a tell';
    const t = document.createElement('span');
    t.className = 't';
    t.textContent = opp.tell.text;
    tell.append(k, t);
    if (!seenTell) {
      seenTell = true;
      const teach = document.createElement('span');
      teach.className = 'teach';
      teach.textContent = opp.tell.teach;
      tell.appendChild(teach);
    }
    reads.appendChild(tell);
  }

  return reads;
}

// A conversation line. Two visually distinct kinds so his WORDS and his
// BEHAVIOUR never blur together (Samar's note):
//   - SPEECH  — something actually said. A speaker label + the line in quotes.
//     (Your lines are speech too — no quotes, but a "You" label + steel.)
//   - NARRATION — what he DOES, not says (a generic beat like "He almost
//     laughs in your face"). No speaker label, italic, em-dashed — it reads
//     as a stage direction, not dialogue.
function buildTurn(who: 'you' | 'him', text: string, quoted: boolean, opp: Opponent, extraClass = ''): HTMLElement {
  const narration = who === 'him' && !quoted;
  const div = document.createElement('div');
  div.className = `turn ${who}${narration ? ' narration' : ''}${extraClass ? ` ${extraClass}` : ''}`;

  if (!narration) {
    const w = document.createElement('div');
    w.className = 'w';
    w.textContent = who === 'you' ? 'You' : opp.name;
    div.appendChild(w);
  }

  div.append(narration ? `— ${text}` : quoted ? `"${text}"` : text);
  return div;
}

// ---- conversation: centred-left, defined+limited, scrollable, newest at bottom ----
function buildConvo(transcript: ConvoTurn[], opp: Opponent): HTMLElement {
  const convo = document.createElement('div');
  convo.className = 'convo';

  if (transcript.length === 0) {
    convo.appendChild(buildTurn('you', "you haven't moved yet.", false, opp));
    convo.appendChild(buildTurn('him', "He's waiting on you.", false, opp));
  } else {
    transcript.forEach((turn, i) => {
      const isLast = i === transcript.length - 1;
      const extra = turn.who === 'him' && isLast ? 'cur' : '';
      const quoted = turn.who === 'you' ? false : turn.quoted !== false;
      const el = buildTurn(turn.who, turn.text, quoted, opp, extra);
      if (isLast) el.classList.add('fresh');
      convo.appendChild(el);
    });
  }

  return convo;
}

// ---- the "cut to him" bottom bar — his reply typewriters out here before it
// settles up into the conversation (see the animated flow in controller.ts) ----
function buildCutToHim(cut: CutToHim, opp: Opponent): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'cut-to-him';

  const who = document.createElement('div');
  who.className = 'who';
  who.textContent = opp.name;
  bar.appendChild(who);

  const line = document.createElement('div');
  line.className = 'line';
  const shown = cut.quoted ? `"${cut.typed}${cut.done ? '"' : ''}` : cut.typed;
  line.append(shown);
  if (!cut.done) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';
    line.appendChild(cursor);
  }
  bar.appendChild(line);

  return bar;
}

// ---- the angle dial — segments clipped to the wheel (ported from duel_v14a.html) ----
function buildDial(script: Script, selectedAngle: AngleId | null, pickAngle: (a: AngleId) => void): SVGSVGElement {
  const svg = svgEl('svg');
  svg.setAttribute('class', 'dial');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('aria-label', 'angle dial');

  const defs = svgEl('defs');

  const clip = svgEl('clipPath');
  clip.setAttribute('id', 'wheel');
  const clipCircle = svgEl('circle');
  clipCircle.setAttribute('cx', '100');
  clipCircle.setAttribute('cy', '100');
  clipCircle.setAttribute('r', '90');
  clip.appendChild(clipCircle);
  defs.appendChild(clip);

  const grad = svgEl('radialGradient');
  grad.setAttribute('id', 'g');
  grad.setAttribute('cx', '50%');
  grad.setAttribute('cy', '50%');
  grad.setAttribute('r', '70%');
  const stop1 = svgEl('stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgba(111,211,230,.32)');
  const stop2 = svgEl('stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', 'rgba(111,211,230,.08)');
  grad.append(stop1, stop2);
  defs.appendChild(grad);

  svg.appendChild(defs);

  // segments live inside a clipped <g> so any fill/splash never bleeds past the wheel
  const g = svgEl('g');
  g.setAttribute('clip-path', 'url(#wheel)');
  script.angles.forEach((a, i) => {
    const w = WEDGES[i];
    if (!w) return;
    const path = svgEl('path');
    path.setAttribute('class', `seg${a === selectedAngle ? ' active' : ''}`);
    path.setAttribute('d', w.d);
    path.setAttribute('data-angle', a);
    path.addEventListener('click', () => pickAngle(a));
    g.appendChild(path);
  });
  svg.appendChild(g);

  const hub = svgEl('circle');
  hub.setAttribute('class', 'hub');
  hub.setAttribute('cx', '100');
  hub.setAttribute('cy', '100');
  hub.setAttribute('r', '24');
  svg.appendChild(hub);

  script.angles.forEach((a, i) => {
    const w = WEDGES[i];
    if (!w) return;
    const text = svgEl('text');
    if (a === selectedAngle) text.setAttribute('class', 'active');
    text.setAttribute('x', String(w.lx));
    text.setAttribute('y', String(w.ly));
    const [first, second] = DIAL_LABELS[a];
    text.textContent = first;
    if (second) {
      const tspan = svgEl('tspan');
      tspan.setAttribute('x', String(w.lx));
      tspan.setAttribute('dy', '12');
      tspan.textContent = second;
      text.appendChild(tspan);
    }
    svg.appendChild(text);
  });

  const hublbl = svgEl('text');
  hublbl.setAttribute('class', 'hublbl');
  hublbl.setAttribute('x', '100');
  hublbl.setAttribute('y', '103');
  hublbl.textContent = 'PICK';
  svg.appendChild(hublbl);

  return svg;
}

function buildDialwrap(script: Script, selectedAngle: AngleId | null, on: DuelHandlers): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'dialwrap';
  const hint = document.createElement('div');
  hint.className = 'dhint';
  hint.textContent = selectedAngle ? ANGLE_LABELS[selectedAngle].toLowerCase() : 'tap an angle';
  wrap.appendChild(hint);
  wrap.appendChild(buildDial(script, selectedAngle, on.pickAngle));
  return wrap;
}

// THE RECORD chip. It isn't a passive tab — it's where you go to PRESS him
// for the truth (catch a contradiction, deploy leverage). So it advertises
// live leads: an open contradiction makes it glow crimson + say "catch him";
// otherwise it counts the leverage sitting in your hand, ready to deploy.
function buildRecordBtn(state: DuelState, on: DuelHandlers): HTMLElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'recbtn';
  btn.dataset.openRecord = '';

  const label = document.createElement('span');
  label.className = 'rl';
  label.textContent = 'THE RECORD';
  btn.appendChild(label);

  const contradictions = state.record.openContradictions.length;
  const leverage = state.record.heldLeverage.length;

  const cue = document.createElement('span');
  cue.className = 'rcue';
  if (contradictions > 0) {
    btn.classList.add('hot');
    cue.textContent = '● catch him';
  } else if (leverage > 0) {
    btn.classList.add('armed');
    cue.textContent = `● ${leverage} to play`;
  } else {
    cue.textContent = '▸';
  }
  btn.appendChild(cue);

  btn.addEventListener('click', () => on.openRecord());
  return btn;
}

function buildVeil(): HTMLElement {
  const veil = document.createElement('div');
  veil.className = 'veil';
  return veil;
}

// ---- State B: the glassy-cyan word-picker modal (ported from duel_v8b.html) ----
function buildModal(
  state: DuelState,
  opp: Opponent,
  script: Script,
  angle: AngleId,
  on: DuelHandlers,
): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const mh = document.createElement('div');
  mh.className = 'mh';
  const dot = document.createElement('span');
  dot.className = 'dot';
  const t = document.createElement('span');
  t.className = 't';
  t.textContent = ANGLE_LABELS[angle];
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'x';
  x.dataset.close = '';
  x.textContent = '✕';
  x.addEventListener('click', () => on.closeModal());
  mh.append(dot, t, x);
  modal.appendChild(mh);

  const msub = document.createElement('div');
  msub.className = 'msub';
  msub.textContent = 'tap a line to say it';
  modal.appendChild(msub);

  const mwords = document.createElement('div');
  mwords.className = 'mwords';
  for (const l of script.lines.filter((line) => line.angleId === angle)) {
    const risk = riskOf(state, opp, l);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'word';
    btn.dataset.line = l.id;

    const wt = document.createElement('div');
    wt.className = 'wt';
    wt.textContent = `"${l.text}"`;

    const wr = document.createElement('div');
    wr.className = 'wr';
    const rdot = document.createElement('span');
    rdot.className = `rdot ${RISK_DOT_CLASS[risk]}`;
    rdot.dataset.risk = risk;
    wr.append(rdot, document.createTextNode(RISK_LABELS[risk]));

    btn.append(wt, wr);
    btn.addEventListener('click', () => on.probe(l.id));
    mwords.appendChild(btn);
  }
  modal.appendChild(mwords);

  return modal;
}

/**
 * Renders the whole duel screen — ported from concept/ui/duel_v14a.html (the
 * resting scene) + concept/ui/duel_v8b.html (the word-picker modal). A
 * full-bleed mood image behind everything, objective + his composure on top,
 * reads floating on the sides (no boxes, glowing text), a limited scrollable
 * conversation centred-left, and the glassy angle dial bottom-centre. Tapping
 * a wedge opens the cyan modal (State B) over the scene; the animated
 * probe->reaction flow (line-fly, typewriter, verdict punch) is choreographed
 * by src/app/controller.ts, which calls this render at each visual beat.
 */
export function renderDuel(
  root: HTMLElement,
  state: DuelState,
  opp: Opponent,
  script: Script,
  on: DuelHandlers,
  view: DuelView,
): void {
  root.innerHTML = '';
  root.classList.add('duel-screen');

  const scene = document.createElement('div');
  scene.className = 'scene';

  const bg = document.createElement('div');
  bg.className = 'bg';
  const face = mountFace(bg, opp);
  face.setMood(state.mood);
  scene.appendChild(bg);

  scene.appendChild(buildTop(opp, state));
  scene.appendChild(buildReads(state, opp, view.reaction));
  scene.appendChild(buildConvo(view.transcript, opp));

  if (view.cutToHim) {
    scene.appendChild(buildCutToHim(view.cutToHim, opp));
  } else {
    scene.appendChild(buildDialwrap(script, view.selectedAngle, on));
  }

  if (view.reaction?.fresh) {
    const kind = view.reaction.spent ? 'neutral' : view.reaction.band;
    const headText = view.reaction.spent ? "HE'S HEARD THAT" : VERDICT_HEAD[view.reaction.band];
    const punch = document.createElement('div');
    punch.className = `verdict-punch v-${kind}`;
    punch.textContent = headText;
    scene.appendChild(punch);
  }

  scene.appendChild(buildRecordBtn(state, on));

  root.appendChild(scene);

  if (view.selectedAngle) {
    root.appendChild(buildVeil());
    root.appendChild(buildModal(state, opp, script, view.selectedAngle, on));
  }

  const convoEl = scene.querySelector<HTMLElement>('.convo');
  if (convoEl) convoEl.scrollTop = convoEl.scrollHeight;
}
