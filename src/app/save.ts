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
