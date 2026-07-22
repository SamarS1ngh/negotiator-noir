import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// CHAPTER THREE — THE WATERFRONT UNION. Act II begins: here the phantom cargo is
// REAL, and men who ask about it vanish. Climb through Kastner, the union boss who
// controls who works and who starves and looks away for a cut. Turn the dockmaster
// who signs the false manifests, the widow whose husband asked one question too
// many, the customs man on the take, and the firebrand who wants Kastner's chair.
export const CHAPTER_3: Chapter = {
  id: 'ch3',
  title: 'THE WATERFRONT UNION',
  targetId: 'kastner',
  nodes: [
    { id: 'you', name: 'YOU', role: 'climbing into the machine', disposition: 4, x: 50, y: 86 },
    { id: 'kastner', name: 'KASTNER', role: 'the union boss', disposition: 2, dealTarget: true, portrait: `${A}/kastner.jpg`, x: 50, y: 14 },
    { id: 'halloran', name: 'HALLORAN', role: 'the dockmaster', disposition: 2, portrait: `${A}/halloran.jpg`, x: 17, y: 40 },
    { id: 'breen', name: 'BREEN', role: 'customs, on the take', disposition: 2, portrait: `${A}/breen.jpg`, x: 83, y: 40 },
    { id: 'finn', name: 'MRS. FINN', role: 'the widow', disposition: 2, portrait: `${A}/finn.jpg`, x: 26, y: 66 },
    { id: 'delaney', name: 'DELANEY', role: 'the firebrand', disposition: 2, portrait: `${A}/delaney.jpg`, x: 74, y: 66 },
  ],
  edges: [
    { from: 'halloran', to: 'kastner', label: 'signs for' },
    { from: 'breen', to: 'kastner', label: 'waves through' },
    { from: 'finn', to: 'kastner', label: 'lost to' },
    { from: 'delaney', to: 'kastner', label: 'wants his chair' },
  ],
  actions: [
    { id: 'halloran_turn', nodeId: 'halloran', label: 'Work the dockmaster', blurb: 'He signs the manifests — and knows they match no real cargo.', grants: [], result: '' },
    { id: 'breen_turn', nodeId: 'breen', label: 'Work the customs man', blurb: 'He waves the crates through and never asks. Comfortable. Sloppy.', grants: [], result: '' },
    { id: 'finn_turn', nodeId: 'finn', label: 'Sit with the widow', blurb: 'Her husband asked what was in the crates. He never came home.', grants: [], result: '' },
    { id: 'delaney_turn', nodeId: 'delaney', label: 'Back the firebrand', blurb: "He wants Kastner's chair. Give him a reason it's within reach.", grants: [], result: '' },
  ],
};
