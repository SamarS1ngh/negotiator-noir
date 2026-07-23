import type { BoardState } from '../domain/board';
import type { CampaignState } from '../domain/campaign';
import type { PrincipleId } from '../domain/principle';

// ---- SAVE / RESUME ----
// A single-slot checkpoint in localStorage. Written on every board view (the safe
// point between scenes), so closing or reloading the tab resumes the current
// chapter instead of restarting the whole climb. Sets are stored as arrays.

const KEY = 'negotiator_save_v1';

interface SaveV1 {
  v: 1;
  chId: string;
  nodes: BoardState['nodes'];
  flags: string[];
  done: string[];
  heat: number;
  money: number;
  factions: Record<string, number>;
  bonds: Record<string, number>;
  ledger: string[];
  learned: string[];
}

export function saveGame(chId: string, st: BoardState, camp: CampaignState): void {
  try {
    const s: SaveV1 = {
      v: 1, chId,
      nodes: st.nodes, flags: [...st.flags], done: [...st.done], heat: st.heat,
      money: camp.money, factions: camp.factions, bonds: camp.bonds,
      ledger: [...camp.ledger], learned: [...camp.learned],
    };
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch { /* storage disabled — play unsaved */ }
}

export function loadGame(): { chId: string; st: BoardState; camp: CampaignState } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SaveV1;
    if (s.v !== 1 || !s.chId) return null;
    return {
      chId: s.chId,
      st: { nodes: s.nodes, flags: new Set(s.flags), done: new Set(s.done), heat: s.heat },
      camp: {
        money: s.money, factions: s.factions ?? {}, bonds: s.bonds ?? {},
        ledger: new Set(s.ledger ?? []), learned: new Set((s.learned ?? []) as PrincipleId[]),
      },
    };
  } catch { return null; }
}

export function clearSave(): void {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}

// ---- CHECKPOINTS ----
// The entry state of each chapter you've REACHED, so the menu can offer replay
// from any unlocked chapter (and locks the ones you haven't gotten to). Separate
// from the resume-save so a fresh climb doesn't erase your unlocks.

const CKEY = 'negotiator_checkpoints_v1';

export interface Checkpoint {
  flags: string[]; heat: number;
  money: number; factions: Record<string, number>; bonds: Record<string, number>;
  ledger: string[]; learned: string[];
}

export function loadCheckpoints(): Record<string, Checkpoint> {
  try {
    const raw = localStorage.getItem(CKEY);
    return raw ? (JSON.parse(raw) as Record<string, Checkpoint>) : {};
  } catch { return {}; }
}

export function saveCheckpoint(chId: string, st: BoardState, camp: CampaignState): void {
  try {
    const all = loadCheckpoints();
    all[chId] = {
      flags: [...st.flags], heat: st.heat,
      money: camp.money, factions: camp.factions, bonds: camp.bonds,
      ledger: [...camp.ledger], learned: [...camp.learned],
    };
    localStorage.setItem(CKEY, JSON.stringify(all));
  } catch { /* noop */ }
}

export function checkpointState(cp: Checkpoint): { st: Omit<BoardState, 'nodes'>; camp: CampaignState } {
  return {
    st: { flags: new Set(cp.flags), done: new Set(), heat: cp.heat },
    camp: {
      money: cp.money, factions: cp.factions ?? {}, bonds: cp.bonds ?? {},
      ledger: new Set(cp.ledger ?? []), learned: new Set((cp.learned ?? []) as PrincipleId[]),
    },
  };
}
