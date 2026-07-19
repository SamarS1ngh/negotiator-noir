import type { DealSpec } from '../domain/deal';
import type { Beat } from '../domain/board';

// The sit-down intro — you meet Ricci face to face before the table, same as
// the others. Portrait: assets/art/cast/ricci.jpg.
export const RICCI_INTRO_COLD: Beat[] = [
  { who: 'them', text: "So. You're the one who wanted a meeting. Brave." },
  { who: 'you', text: "You collect for Marlowe. I'm here about my father's debt." },
  { who: 'them', text: "The debt's the debt. Five hundred. Sit down and don't waste my evening." },
];

// If you worked the board first, he's already rattled — and he knows it's you.
export const RICCI_INTRO_WORKED: Beat[] = [
  { who: 'them', text: "You've been busy. Asking about me. Turning my people." },
  { who: 'you', text: "Word travels. Sit down, Ricci — we both know why I'm here." },
  { who: 'them', text: "…Say your piece. But watch yourself. I'm not some mark." },
];



// Ricci's deal. Positions run HIS ideal (0) → YOUR ideal (last).
// His true priorities: fear(name) > money(debt) > pride(face) > paper.
// The skim leverage, attached to a term, erodes his resistance there.
export const COLLECTOR_DEAL: DealSpec = {
  terms: [
    {
      id: 'debt',
      label: 'The debt',
      positions: ['You pay all $500', 'You pay half', 'You pay nothing', 'He pays you back'],
      hisWeight: 2,
      youValue: 2,
    },
    {
      id: 'name',
      label: "Who's above him",
      positions: ['He never says', 'He hints', 'He names Marlowe'],
      hisWeight: 3,
      youValue: 3,
      hardline: true,   // he will NOT give up Marlowe cold — you need the skim on him
    },
    {
      id: 'face',
      // ordered his-ideal(0) → your-ideal(last), like every term. His ideal is
      // saving face; you're indifferent (youValue 0), so handing him index 0
      // costs you nothing and buys real goodwill.
      label: 'How he walks out',
      positions: ['Saving face', 'Quietly', 'Humiliated'],
      hisWeight: 2,
      youValue: 0,
    },
    {
      id: 'paper',
      label: "Your father's paper",
      positions: ['The debt stands', 'Torn up'],
      hisWeight: 1,
      youValue: 2,
    },
  ],
  hisOpening: { debt: 0, name: 0, face: 0, paper: 0 }, // pay all, silent, saves face, paper stands
  startThreshold: 1.8,
  relaxPerRound: 0.5,
  composureRelax: 0.02,
  patience: 6,
};

// Which term each leverage card bears on, and how hard.
export const LEVERAGE_TERM: Record<string, { term: string; strength: number }> = {
  skims: { term: 'name', strength: 3 },   // his fear of Marlowe → makes him give the name
  ledger: { term: 'debt', strength: 2 },  // hard proof → makes him drop the money
};
