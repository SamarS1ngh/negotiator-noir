import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// CHAPTER TWO — MARLOWE'S HOUSE. You're inside now. Marlowe can't be broken with a
// secret (no fear, only control), so you don't hit him — you rot his house out
// from under him. Turn his consigliere (Otto), expose his money (Adler), and the
// standing you carry from Chapter One (Ricci as mole or enemy) decides how the
// endgame plays. The actions here open branching missions (see game.ts MISSIONS);
// the grants land via each mission's outcome.
export const CHAPTER_2: Chapter = {
  id: 'ch2',
  title: "MARLOWE'S HOUSE",
  moves: 3,
  targetId: 'marlowe',
  nodes: [
    { id: 'you', name: 'YOU', role: 'inside the machine', disposition: 4, x: 50, y: 86 },
    { id: 'marlowe', name: 'MARLOWE', role: 'the empire', disposition: 2, dealTarget: true, portrait: `${A}/marlowe.jpg`, x: 50, y: 15 },
    { id: 'otto', name: 'OTTO', role: "Marlowe's consigliere", disposition: 2, portrait: `${A}/otto.jpg`, x: 19, y: 43 },
    { id: 'adler', name: 'ADLER', role: 'the money man', disposition: 2, portrait: `${A}/adler.jpg`, x: 81, y: 43 },
    { id: 'ricci', name: 'RICCI', role: 'the collector', disposition: 2, portrait: `${A}/ricci.jpg`, x: 50, y: 62 },
  ],
  edges: [
    { from: 'otto', to: 'marlowe', label: 'serves' },
    { from: 'adler', to: 'marlowe', label: 'fears' },
    { from: 'ricci', to: 'marlowe', label: 'inside' },
    { from: 'marlowe', to: 'otto', label: 'trusts' },
  ],
  actions: [
    {
      id: 'otto_turn', nodeId: 'otto',
      label: 'Work the consigliere',
      blurb: "Marlowe's oldest hand — and the man Marlowe will discard first.",
      grants: [], result: '',
    },
    {
      id: 'adler_turn', nodeId: 'adler',
      label: 'Work the money man',
      blurb: 'He keeps the real books. The ones that could hang Marlowe.',
      grants: [], result: '',
    },
  ],
};
