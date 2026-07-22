import type { Chapter } from '../domain/board';
import type { Mission } from '../domain/mission';

const A = 'assets/art/cast';

// "Previously, on the docks" — reactive recap crossing into Chapter Two (DeLuca's
// district), the rung Ricci answered to.
export function buildCh2Recap(flags: Set<string>): Mission {
  const ricci = flags.has('ricciMole')
    ? 'Ricci is yours now — your man on the docks, feeding you up the ladder.'
    : 'Ricci walked out of the docks your enemy — a wounded man at your back.';
  const rival = flags.has('bianchiRival')
    ? 'And Bianchi holds Ricci\'s old water now — a rival circling, owing you nothing.'
    : '';

  return {
    id: 'ch2_recap', actionId: 'ch2_recap', nodeId: 'you', label: 'previously', palette: 'deluca', start: 'r',
    nodes: [{
      id: 'r',
      mood: 'cold',
      portrait: 'assets/art/scene/now.jpg',
      beats: [
        { who: 'you', caption: true, text: 'PREVIOUSLY — THE DOCKS.' },
        { who: 'you', caption: true, text: 'You broke Ricci, the collector who ruined your father — and forced a way up off the waterfront, into the empire proper.' },
        { who: 'you', caption: true, text: ricci },
        ...(rival ? [{ who: 'you' as const, caption: true, text: rival }] : []),
      ],
      outcome: {
        key: 'ch2', tone: 'good',
        tag: 'CHAPTER TWO',
        title: "DELUCA'S DISTRICT",
        line: "Ricci answered to a man: Vito DeLuca, who runs the Nine Streets for Marlowe — and who's been quietly building a little empire of his own behind the boss's back. Climb through him. His muscle, his tame detective, his greed. Then Marlowe is one rung away.",
        ripple: '',
        cta: 'INTO THE DISTRICT ▸',
      },
    }],
  };
}

// CHAPTER TWO — DELUCA'S DISTRICT. The rung between Ricci and Marlowe. DeLuca is
// greedy, ambitious, and secretly overreaching — terrified Marlowe will notice
// he's grown too big. You climb through him: turn his disrespected enforcer
// (Santo) and his tired bent detective (Reese), then make him your way up — or
// take the district for yourself.
export const CHAPTER_2: Chapter = {
  id: 'ch2',
  title: "DELUCA'S DISTRICT",
  targetId: 'deluca',
  nodes: [
    { id: 'you', name: 'YOU', role: 'off the docks, climbing', disposition: 4, x: 50, y: 86 },
    { id: 'deluca', name: 'DELUCA', role: 'boss of the Nine Streets', disposition: 2, dealTarget: true, portrait: `${A}/deluca.jpg`, x: 50, y: 15 },
    { id: 'santo', name: 'SANTO', role: "DeLuca's enforcer", disposition: 2, portrait: `${A}/santo.jpg`, x: 19, y: 43 },
    { id: 'reese', name: 'REESE', role: 'the tame detective', disposition: 2, portrait: `${A}/reese.jpg`, x: 81, y: 43 },
    { id: 'ricci', name: 'RICCI', role: 'the collector', disposition: 2, portrait: `${A}/ricci.jpg`, x: 50, y: 62 },
    { id: 'vera', name: 'VERA', role: 'the fixer', disposition: 2, portrait: `${A}/vera.jpg`, x: 24, y: 71 },
    { id: 'bagman', name: 'MILO', role: "DeLuca's bagman", disposition: 2, portrait: `${A}/bagman.jpg`, x: 76, y: 71 },
  ],
  edges: [
    { from: 'santo', to: 'deluca', label: 'serves' },
    { from: 'reese', to: 'deluca', label: 'owned by' },
    { from: 'ricci', to: 'deluca', label: 'answered to' },
    { from: 'deluca', to: 'santo', label: 'underpays' },
    { from: 'bagman', to: 'deluca', label: 'washes for' },
    { from: 'vera', to: 'deluca', label: 'hosts' },
  ],
  actions: [
    { id: 'santo_turn', nodeId: 'santo', label: 'Work the enforcer', blurb: 'Loyal muscle — and sick of being treated like it.', grants: [], result: '' },
    { id: 'reese_turn', nodeId: 'reese', label: 'Work the detective', blurb: "DeLuca's tame cop. He knows where the money and the bodies are.", grants: [], result: '' },
    { id: 'vera_turn', nodeId: 'vera', label: 'Work the fixer', blurb: 'The club owner who bridges the docks and the men upriver.', grants: [], result: '' },
    { id: 'bagman_turn', nodeId: 'bagman', label: 'Turn the bagman', blurb: "DeLuca's cash mover — sloppy, sweating, scared of the audit.", grants: [], result: '' },
  ],
};
