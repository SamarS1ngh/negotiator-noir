import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// CHAPTER FOUR — THE CASSAR BANK. Where the cargo money is washed clean, and where
// you learn the partners are UPRIVER — federal-scale. Climb through Cassar, the
// banker who thinks numbers make him untouchable: the idealistic teller, the
// external auditor who could blow it open, and the mistress who knows the upriver
// names. (This is where a knife in your back — Bianchi or Vera, if you used them
// coldly — comes due; handled by the interlude.)
export const CHAPTER_4: Chapter = {
  id: 'ch4',
  title: 'THE CASSAR BANK',
  targetId: 'cassar',
  nodes: [
    { id: 'you', name: 'YOU', role: 'following the money', disposition: 4, x: 50, y: 86 },
    { id: 'cassar', name: 'CASSAR', role: 'the banker', disposition: 2, dealTarget: true, portrait: `${A}/cassar.jpg`, x: 50, y: 14 },
    { id: 'teller', name: 'WYATT', role: 'the bank clerk', disposition: 2, portrait: `${A}/teller.jpg`, x: 18, y: 42 },
    { id: 'auditor', name: 'PROSSER', role: 'the auditor', disposition: 2, portrait: `${A}/auditor.jpg`, x: 82, y: 42 },
    { id: 'sable', name: 'SABLE', role: "Cassar's mistress", disposition: 2, portrait: `${A}/sable.jpg`, x: 50, y: 63 },
  ],
  edges: [
    { from: 'teller', to: 'cassar', label: 'clerks for' },
    { from: 'auditor', to: 'cassar', label: 'audits' },
    { from: 'sable', to: 'cassar', label: 'kept by' },
  ],
  actions: [
    { id: 'teller_turn', nodeId: 'teller', label: 'Work the clerk', blurb: 'Young, underpaid, uneasy about the accounts he processes.', grants: [], result: '' },
    { id: 'auditor_turn', nodeId: 'auditor', label: 'Work the auditor', blurb: 'He could expose the wash — if he decides the truth is worth his neck.', grants: [], result: '' },
    { id: 'sable_turn', nodeId: 'sable', label: 'Work the mistress', blurb: 'Underestimated, and she knows the names of the men upriver.', grants: [], result: '' },
  ],
};
