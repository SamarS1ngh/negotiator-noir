import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// CHAPTER FIVE — THE HALL. Act III: the law-and-order shield over the whole empire.
// Commissioner Vane SIGNED the order that erased your father (Marlowe only carried
// it out). Climb through him: the hungry reporter chasing the story, Vane's own
// weary fixer, and the rival politician who'd love him gone. Breaking a man
// protected by cut-outs means using his methods — the mirror.
export const CHAPTER_5: Chapter = {
  id: 'ch5',
  title: 'THE HALL',
  targetId: 'vane',
  nodes: [
    { id: 'you', name: 'YOU', role: 'at the threshold of power', disposition: 4, x: 50, y: 86 },
    { id: 'vane', name: 'VANE', role: 'the commissioner', disposition: 2, dealTarget: true, portrait: `${A}/vane.jpg`, x: 50, y: 14 },
    { id: 'reporter', name: 'IRIS KELL', role: 'the reporter', disposition: 2, portrait: `${A}/reporter.jpg`, x: 18, y: 42 },
    { id: 'aide', name: 'HOLT', role: "Vane's fixer", disposition: 2, portrait: `${A}/aide.jpg`, x: 82, y: 42 },
    { id: 'rival', name: 'COYLE', role: 'the rival', disposition: 2, portrait: `${A}/rival.jpg`, x: 50, y: 63 },
  ],
  edges: [
    { from: 'aide', to: 'vane', label: 'serves' },
    { from: 'rival', to: 'vane', label: 'rivals' },
    { from: 'reporter', to: 'vane', label: 'hunts' },
  ],
  actions: [
    { id: 'reporter_turn', nodeId: 'reporter', label: 'Work the reporter', blurb: 'She wants the story that ends them all — and she has the nerve to print it.', grants: [], result: '' },
    { id: 'aide_turn', nodeId: 'aide', label: 'Work the fixer', blurb: 'He knows where every body is buried. And Vane stopped paying for his silence.', grants: [], result: '' },
    { id: 'rival_turn', nodeId: 'rival', label: 'Work the rival', blurb: "He'd love Vane gone — if you can make loyalty look like the losing bet.", grants: [], result: '' },
  ],
};
