import type { IntelId } from './types';

// ---- THE WEB: the scheming board around a target. You're the underdog; you
// can't fight the empire head-on, so you work the people around it. What you do
// here sets the difficulty of the sit-down. Pure + deterministic.

export type Disposition = 0 | 1 | 2 | 3 | 4; // Enemy → Wary → Neutral → Warm → Ally

export interface Node {
  id: string;
  name: string;
  role: string;
  disposition: Disposition;
  locked?: boolean;      // not yet reachable
  dealTarget?: boolean;  // "sit down with" this one
  portrait?: string;     // their photo on the board
  x: number; y: number;  // 0..100 layout on the board
}

// a line in a meet-scene. `who: 'them'` is the character, 'you' is you.
export interface Beat { who: 'them' | 'you'; text: string; }

export interface Edge { from: string; to: string; label: string; }

export interface Action {
  id: string;
  nodeId: string;
  label: string;
  blurb: string;
  grants: string[];                 // flags set
  dispositionDelta?: { nodeId: string; delta: number };
  result: string;                   // one-line outcome shown after
  requires?: string[];              // flags needed to appear
  scene?: Beat[];                   // the short face-to-face you play out
  ripple?: string;                  // what the world does back (a beat after)
}

// something the world does back at you between your moves — makes it live.
export interface WorldEvent { text: string; }

export interface Chapter {
  title: string;
  nodes: Node[];
  edges: Edge[];
  actions: Action[];
  moves: number;
  targetId: string;
}

export interface BoardState {
  nodes: Node[];
  flags: Set<string>;
  done: Set<string>;      // spent action ids
  movesLeft: number;
}

export function initBoard(ch: Chapter): BoardState {
  return {
    nodes: ch.nodes.map((n) => ({ ...n })),
    flags: new Set<string>(),
    done: new Set<string>(),
    movesLeft: ch.moves,
  };
}

export function availableActions(ch: Chapter, st: BoardState, nodeId: string): Action[] {
  return ch.actions.filter((a) =>
    a.nodeId === nodeId &&
    !st.done.has(a.id) &&
    (a.requires ?? []).every((r) => st.flags.has(r)));
}

// Take an action: spend a move, set its flags, shift a disposition. Returns a
// NEW state (never mutates) so the UI can diff / the tests can assert.
export function takeAction(ch: Chapter, st: BoardState, actionId: string): BoardState {
  const a = ch.actions.find((x) => x.id === actionId);
  if (!a || st.done.has(a.id) || st.movesLeft <= 0) return st;

  const nodes = st.nodes.map((n) => {
    if (a.dispositionDelta && n.id === a.dispositionDelta.nodeId) {
      const d = Math.max(0, Math.min(4, n.disposition + a.dispositionDelta.delta)) as Disposition;
      return { ...n, disposition: d };
    }
    return n;
  });
  const flags = new Set(st.flags);
  for (const f of a.grants) flags.add(f);
  const done = new Set(st.done);
  done.add(a.id);

  return { nodes, flags, done, movesLeft: st.movesLeft - 1 };
}

// ---- prep the flags become when you sit down ----
export interface DealPrep {
  intel: Set<IntelId>;
  startComposureLost: number;
  patienceDelta: number;
  thresholdDelta: number;
}

export function dealPrep(flags: Set<string>): DealPrep {
  const intel = new Set<IntelId>();
  if (flags.has('skim')) intel.add('lev:skims');
  if (flags.has('ledger')) intel.add('lev:ledger');
  if (flags.has('type')) intel.add('type');
  if (flags.has('tell')) intel.add('tell');
  if (flags.has('lie')) intel.add('lie');

  let startComposureLost = 0;
  let thresholdDelta = 0;
  const patienceDelta = 0;
  if (flags.has('crewSpooked')) startComposureLost += 12;
  if (flags.has('marloweSuspicious')) startComposureLost += 10;
  if (flags.has('bianchiPressing')) thresholdDelta -= 0.4;

  return { intel, startComposureLost, patienceDelta, thresholdDelta };
}

// ---- the deal's result comes back and rewrites the board ----
export interface DealResultToBoard {
  closed: boolean;
  gotName: boolean;
  faceIdx: number;   // 0 = saving face ... last = humiliated
}

export function applyDealOutcome(ch: Chapter, st: BoardState, r: DealResultToBoard): BoardState {
  const nodes = st.nodes.map((n) => {
    if (n.id === ch.targetId) {
      // how he walked out sets whether he's an ally (mole) or an enemy
      let disp: Disposition = 2;
      if (r.closed) disp = r.faceIdx <= 0 ? 4 : r.faceIdx >= 2 ? 0 : 2;
      else disp = 1;
      return { ...n, disposition: disp, dealTarget: false };
    }
    // getting the name up the ladder makes Marlowe reachable
    if (r.gotName && n.locked) return { ...n, locked: false };
    return n;
  });
  const done = new Set(st.done);
  done.add(`__dealt_${ch.targetId}`);
  return { ...st, nodes, done };
}
