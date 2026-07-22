import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// CHAPTER SIX — MARLOWE'S HOUSE. The endgame, now earned over six chapters. Rot the
// house out from under him: turn his consigliere (Otto), take his money man's true
// books (Adler), then the final sit-down. (Recap/interlude lives in interludes.ts.)
export const CHAPTER_6: Chapter = {
  id: 'ch6',
  title: "MARLOWE'S HOUSE",
  targetId: 'marlowe',
  nodes: [
    { id: 'you', name: 'YOU', role: 'at the top, at last', disposition: 4, x: 50, y: 86 },
    { id: 'marlowe', name: 'MARLOWE', role: 'the empire', disposition: 2, dealTarget: true, portrait: `${A}/marlowe.jpg`, x: 50, y: 15 },
    { id: 'otto', name: 'OTTO', role: "Marlowe's consigliere", disposition: 2, portrait: `${A}/otto.jpg`, x: 19, y: 43 },
    { id: 'adler', name: 'ADLER', role: 'the money man', disposition: 2, portrait: `${A}/adler.jpg`, x: 81, y: 43 },
  ],
  edges: [
    { from: 'otto', to: 'marlowe', label: 'serves' },
    { from: 'adler', to: 'marlowe', label: 'fears' },
    { from: 'marlowe', to: 'otto', label: 'trusts' },
  ],
  actions: [
    { id: 'otto_turn', nodeId: 'otto', label: 'Work the consigliere', blurb: "Marlowe's oldest hand — and the man Marlowe will discard first.", grants: [], result: '' },
    { id: 'adler_turn', nodeId: 'adler', label: 'Work the money man', blurb: 'He keeps the real books. The ones that could hang Marlowe.', grants: [], result: '' },
  ],
};
