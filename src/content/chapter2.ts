import type { Chapter } from '../domain/board';
import type { Mission } from '../domain/mission';

const A = 'assets/art/cast';

// "Previously, on the docks" — a reactive recap shown as you cross into Chapter
// Two, so it stands on its own and reflects how Chapter One actually went. Built
// on the fly from your carried standing.
export function buildCh2Recap(flags: Set<string>, marloweStanding: number): Mission {
  const ricci = flags.has('ricciMole')
    ? 'Ricci is yours now — your man inside Marlowe\'s house, feeding you what the boss knows.'
    : 'Ricci walked out of the docks your enemy — a wounded man at your back, and no friend inside.';
  const standing = marloweStanding >= 3
    ? 'Marlowe thinks he owns you. A useful stray. He is not watching you closely — yet.'
    : marloweStanding <= 1
      ? 'Marlowe has marked you. The coldest man alive is watching your every step.'
      : 'Marlowe barely saw you at all. A knife he has already forgotten he let in the door.';
  const rival = flags.has('bianchiRival')
    ? 'And out on the water, Bianchi holds Ricci\'s old territory now — a rival circling, owing you nothing.'
    : '';

  return {
    id: 'ch2_recap', actionId: 'ch2_recap', nodeId: 'you', label: 'previously', palette: 'marlowe', start: 'r',
    nodes: [{
      id: 'r',
      mood: 'cold',
      portrait: 'assets/art/scene/now.jpg',
      beats: [
        { who: 'you', caption: true, text: 'PREVIOUSLY — THE DOCKS.' },
        { who: 'you', caption: true, text: 'You came up from nothing to break Ricci, the collector who ruined your father — and through him, forced a way into the world of the man at the top.' },
        { who: 'you', caption: true, text: ricci },
        { who: 'you', caption: true, text: standing },
        ...(rival ? [{ who: 'you' as const, caption: true, text: rival }] : []),
      ],
      outcome: {
        key: 'ch2', tone: 'good',
        tag: 'CHAPTER TWO',
        title: "MARLOWE'S HOUSE",
        line: "You're inside now. You can't break Marlowe with a secret — he has no fear, only control. So you rot his house out from under him: turn his people, take his paper, and then make your move.",
        ripple: '',
        cta: 'STEP INTO THE HOUSE ▸',
      },
    }],
  };
}

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
