import type { Beat, Disposition } from './board';

// ---- A MISSION: one prep job on the board, played as a BRANCHING scene
// (Detroit-style). You move through beats, hit forks, and different approaches
// lead to genuinely different endings — each of which bends the world its own
// way. There is no single "right" option: several work, but they cost and
// ripple differently, and some backfire. The reached OUTCOME rewrites the board.

export interface MissionChoice {
  id: string;
  label: string;
  tone?: 'disarm' | 'press' | 'bribe' | 'push';   // colours the option by its nature
  requires?: string[];   // only shown if you carry these flags — prep unlocks approaches
  to: string;            // id of the node this leads to
}

export interface MissionOutcome {
  key: string;
  tone: 'good' | 'mixed' | 'bad';   // how the ending reads on the consequence card
  title: string;                    // "SAL — YOUR MAN INSIDE"
  line: string;                     // what happened
  ripple: string;                   // how it bends the world / the Ricci sit-down
  grants?: string[];                // intel/leverage flags you walk away with
  worldFlags?: string[];            // state that changes future scenes (ricciHardened…)
  dispositions?: { nodeId: string; set?: Disposition; delta?: number }[];
  // for the TARGET confrontation: the deal result the board applies (unlock the
  // next rung on the name, ally/enemy on how he walked out)
  deal?: { closed: boolean; gotName: boolean; faceIdx: number };
  tag?: string;      // overrides the "it lands"/"it backfires" label (for title cards)
  cta?: string;      // overrides the consequence button text
  reflect?: string;  // the MC's inner voice on what he just did — the cost/the mirror
}

// the emotional/situational light of a beat — drives the scene's colour + shadow
export type SceneMood = 'tense' | 'fear' | 'hope' | 'guilt' | 'threat' | 'cold' | 'warm';

export interface MissionNode {
  id: string;
  beats?: Beat[];              // dialogue/narration played first
  ask?: string;               // a prompt shown above the fork
  mood?: SceneMood;           // how this moment should be lit
  portrait?: string;          // override the face for this node ('' = no portrait)
  name?: string;              // override who 'them' is in this node (e.g. your father)
  role?: string;
  choices?: MissionChoice[];  // a fork — absent means this node is an ending
  outcome?: MissionOutcome;   // terminal node: the consequence
}

export interface Mission {
  id: string;
  actionId: string;   // the board action this mission fulfils
  nodeId: string;     // the board node it belongs to
  label: string;
  palette?: string;   // the character's signature colour (pal-sal, pal-ricci…)
  start: string;      // id of the first MissionNode
  nodes: MissionNode[];
}

export function missionNode(m: Mission, id: string): MissionNode | undefined {
  return m.nodes.find((n) => n.id === id);
}
