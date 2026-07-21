import type { MissionOutcome } from './mission';

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
// `caption: true` marks narration/inner-voice — rendered as a comic caption box
// instead of a speech bubble. `art` is this beat's panel illustration — the scene
// swaps to it when the beat shows (manhwa-style), falling back to the mission's
// scene when a beat has none.
export interface Beat { who: 'them' | 'you'; text: string; caption?: boolean; art?: string; }

export interface Edge { from: string; to: string; label: string; }

// how you can play someone in the meet — the right read gets what you came for
export interface MeetOption {
  text: string;
  good: boolean;
  result: string;
  ripple?: string;
  failDelta?: { nodeId: string; delta: number };  // wrong approach can cost you
}

export interface Action {
  id: string;
  nodeId: string;
  label: string;
  blurb: string;
  grants: string[];                 // flags set ON SUCCESS
  dispositionDelta?: { nodeId: string; delta: number };  // applied on success
  result: string;                   // observe-scene payoff (no negotiation)
  requires?: string[];              // flags needed to appear
  scene?: Beat[];                   // the short face-to-face you play out
  ripple?: string;                  // observe-scene ripple
  ask?: string;                     // what they want — the negotiation opens here
  options?: MeetOption[];           // your approaches; you must pick the right one
}

// something the world does back at you between your moves — makes it live.
export interface WorldEvent { text: string; }

export interface Chapter {
  id: string;              // 'ch1' | 'ch2' — drives the board footer + which sit-down
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
  heat: number;           // your exposure, 0..HEAT_MAX — rises on botches, carries across chapters
}

export const HEAT_MAX = 10;
export function bumpHeat(heat: number, delta: number): number {
  return Math.max(0, Math.min(HEAT_MAX, heat + delta));
}

export function initBoard(ch: Chapter, heat = 0): BoardState {
  return {
    nodes: ch.nodes.map((n) => ({ ...n })),
    flags: new Set<string>(),
    done: new Set<string>(),
    movesLeft: ch.moves,
    heat,
  };
}

export function availableActions(ch: Chapter, st: BoardState, nodeId: string): Action[] {
  return ch.actions.filter((a) =>
    a.nodeId === nodeId &&
    !st.done.has(a.id) &&
    (a.requires ?? []).every((r) => st.flags.has(r)));
}

// Take an action: spend a move (always), and — only if you played them right
// (`success`) — set its flags and warm them. A failed read spends the move for
// nothing, and may cost you (`failDelta`). Returns a NEW state (never mutates).
export function takeAction(ch: Chapter, st: BoardState, actionId: string, success = true, failDelta?: { nodeId: string; delta: number }): BoardState {
  const a = ch.actions.find((x) => x.id === actionId);
  if (!a || st.done.has(a.id) || st.movesLeft <= 0) return st;

  const delta = success ? a.dispositionDelta : failDelta;
  const nodes = st.nodes.map((n) => {
    if (delta && n.id === delta.nodeId) {
      const d = Math.max(0, Math.min(4, n.disposition + delta.delta)) as Disposition;
      return { ...n, disposition: d };
    }
    return n;
  });
  const flags = new Set(st.flags);
  if (success) for (const f of a.grants) flags.add(f);
  const done = new Set(st.done);
  done.add(a.id);

  return { nodes, flags, done, movesLeft: st.movesLeft - 1, heat: st.heat };
}

// ---- a mission's outcome rewrites the board (Detroit-style: which ending you
// reached bends the world its own way — an ally here, an enemy there) ----
export function applyMissionOutcome(st: BoardState, actionId: string, o: MissionOutcome): BoardState {
  const changes = new Map<string, { set?: number; delta?: number }>();
  for (const d of o.dispositions ?? []) changes.set(d.nodeId, d);
  const nodes = st.nodes.map((n) => {
    const c = changes.get(n.id);
    if (!c) return n;
    let disp: number = n.disposition;
    if (c.set !== undefined) disp = c.set;
    if (c.delta !== undefined) disp += c.delta;
    return { ...n, disposition: Math.max(0, Math.min(4, disp)) as Disposition };
  });
  const flags = new Set(st.flags);
  for (const f of o.grants ?? []) flags.add(f);
  for (const f of o.worldFlags ?? []) flags.add(f);
  const done = new Set(st.done);
  done.add(actionId);
  return { nodes, flags, done, movesLeft: Math.max(0, st.movesLeft - 1), heat: bumpHeat(st.heat, o.heatDelta ?? 0) };
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
