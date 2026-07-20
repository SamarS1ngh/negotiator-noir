import type { Chapter } from '../domain/board';
import type { Mission } from '../domain/mission';

const A = 'assets/art/cast';

// "Previously" recap crossing into Chapter Three — you've climbed past DeLuca and
// finally reached the top. Reactive to how the district fell.
export function buildCh3Recap(flags: Set<string>): Mission {
  const deluca = flags.has('delucaTurned')
    ? "DeLuca is broken and bent to you — the district runs on your say-so now, and Marlowe doesn't know it yet."
    : flags.has('delucaEnemy')
      ? "DeLuca survived, wounded and vengeful, and he's whispering your name to anyone who'll listen."
      : "You took the district out from under DeLuca. He's finished — and the road above him runs straight to the top.";
  const ricci = flags.has('ricciMole')
    ? 'Ricci still feeds you from the docks below.'
    : 'You climb without a friend at your back.';

  return {
    id: 'ch3_recap', actionId: 'ch3_recap', nodeId: 'you', label: 'previously', palette: 'marlowe', start: 'r',
    nodes: [{
      id: 'r',
      mood: 'cold',
      portrait: 'assets/art/scene/now.jpg',
      beats: [
        { who: 'you', caption: true, text: 'PREVIOUSLY — THE DISTRICT.' },
        { who: 'you', caption: true, text: "You climbed past Ricci on the docks and DeLuca in the district. Every rung, a person turned or broken. And now there's only one left above you." },
        { who: 'you', caption: true, text: deluca },
        { who: 'you', caption: true, text: ricci },
      ],
      outcome: {
        key: 'ch3', tone: 'good',
        tag: 'CHAPTER THREE',
        title: "MARLOWE'S HOUSE",
        line: "The top. You can't break Marlowe with a secret — he has no fear, only control. So you rot his house out from under him: turn his people, take his paper, and make your move.",
        ripple: '',
        cta: 'STEP INTO THE HOUSE ▸',
      },
    }],
  };
}

// CHAPTER THREE — MARLOWE'S HOUSE. The endgame. Rot the house out from under him:
// turn his consigliere (Otto), take his money man's true books (Adler).
export const CHAPTER_3: Chapter = {
  id: 'ch3',
  title: "MARLOWE'S HOUSE",
  moves: 3,
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
