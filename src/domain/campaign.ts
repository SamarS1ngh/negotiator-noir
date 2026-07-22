import type { PrincipleId } from './principle';

// ---- THE CAMPAIGN: state that outlives a single chapter ----
// A 6-hour climb needs stakes that persist. Money you can spend to buy info, muscle,
// or an ally's safety. Faction standing per district. Bonds with the people who
// recur — low bond + high heat is how they end up dead or turned. A ledger of what
// you did that later chapters read. And the codex of principles you've actually
// used. All pure + deterministic; every reducer returns a NEW state.

export const BOND_MAX = 4;      // 0 broken … 4 devoted
export const STAND_MAX = 4;     // faction standing, same scale
export const RISK_HEAT = 7;     // at/above this heat, a weak bond is in danger

export interface CampaignState {
  money: number;                       // the purse (dollars)
  factions: Record<string, number>;    // districtId -> standing 0..STAND_MAX
  bonds: Record<string, number>;       // charId -> bond 0..BOND_MAX
  ledger: Set<string>;                 // persistent consequence flags (turned/burned/killed/bought…)
  learned: Set<PrincipleId>;           // the codex — principles the player has used
}

export function initCampaign(money = 0): CampaignState {
  return { money, factions: {}, bonds: {}, ledger: new Set(), learned: new Set() };
}

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

export function canAfford(st: CampaignState, cost: number): boolean {
  return st.money >= cost;
}

export function earn(st: CampaignState, amount: number): CampaignState {
  return { ...st, money: Math.max(0, st.money + amount) };
}

// spend only if affordable; otherwise returns the state unchanged (caller checks canAfford for UI)
export function spend(st: CampaignState, cost: number): CampaignState {
  if (!canAfford(st, cost)) return st;
  return { ...st, money: st.money - cost };
}

export function bumpFaction(st: CampaignState, id: string, delta: number): CampaignState {
  const cur = st.factions[id] ?? 2;
  return { ...st, factions: { ...st.factions, [id]: clamp(cur + delta, 0, STAND_MAX) } };
}

export function bumpBond(st: CampaignState, id: string, delta: number): CampaignState {
  const cur = st.bonds[id] ?? 2;
  return { ...st, bonds: { ...st.bonds, [id]: clamp(cur + delta, 0, BOND_MAX) } };
}

export function record(st: CampaignState, ...flags: string[]): CampaignState {
  const ledger = new Set(st.ledger);
  for (const f of flags) ledger.add(f);
  return { ...st, ledger };
}

export function learn(st: CampaignState, ...ids: PrincipleId[]): CampaignState {
  const learned = new Set(st.learned);
  for (const id of ids) learned.add(id);
  return { ...st, learned };
}

// A character with a weak bond is in danger once the heat is high — this is how a
// recklessly-spent ally ends up dead or flipped in a chapter interlude. Someone you
// kept close (bond >= 3) rides out even a hot chapter.
export function atRisk(st: CampaignState, charId: string, heat: number): boolean {
  const bond = st.bonds[charId] ?? 2;
  return heat >= RISK_HEAT && bond < 3;
}

// ---- the campaign effects a mission outcome can carry ----
export interface CampaignDelta {
  money?: number;                          // + earn / - cost
  faction?: { id: string; delta: number };
  bonds?: { id: string; delta: number }[];
  ledger?: string[];                       // persistent consequence flags to record
  learns?: PrincipleId[];                  // principles taught this beat (also Mission.teaches)
}

export function applyCampaign(st: CampaignState, d?: CampaignDelta): CampaignState {
  if (!d) return st;
  let next = st;
  if (d.money) next = d.money >= 0 ? earn(next, d.money) : spend(next, -d.money);
  if (d.faction) next = bumpFaction(next, d.faction.id, d.faction.delta);
  for (const b of d.bonds ?? []) next = bumpBond(next, b.id, b.delta);
  if (d.ledger?.length) next = record(next, ...d.ledger);
  if (d.learns?.length) next = learn(next, ...d.learns);
  return next;
}
