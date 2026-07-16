import type { Opponent } from '../domain/types';

export const COLLECTOR: Opponent = {
  id: 'collector',
  name: 'Ricci',
  role: 'the collector',
  type: 'proud',
  palette: 'crimson',
  moodStart: 100,
  composureStart: 100,
  yourComposureStart: 100,
  agenda: {
    bottomLine: "he'll settle for less than the full debt if his own boss stays unaware",
    fear: "his boss finding out he's freelancing this",
    lie: 'that the full sum is non-negotiable',
  },
  debtAmount: 500,
  art: {
    seed: 501,
    states: {
      guarded: 'assets/art/collector/guarded.jpg',
      rattled: 'assets/art/collector/rattled.jpg',
      angry: 'assets/art/collector/angry.jpg',
      cornered: 'assets/art/collector/cornered.jpg',
      folding: 'assets/art/collector/folding.jpg',
    },
  },
  objective: {
    goal: 'BREAK RICCI',
    why: "Collector for the empire that took your family. The debt's invented. Crack him → it dies + he names who's above him.",
  },
  expressions: {
    guarded: 'still · watching · giving nothing away',
    rattled: 'jaw tight · eyes flicking to the door',
    angry: 'leaning in · teeth bared · trying to reset the room',
    cornered: 'sweating · glancing for an exit that isn\'t there',
    folding: 'shoulders down · the mask is off',
  },
  tell: {
    text: 'his hand keeps drifting to his watch',
    teach: "A tell — a crack he can't stop. His body says what his mouth won't. Catch it, press it.",
  },
  breakReveal: {
    quote: "Alright — ALRIGHT. There's no debt. Marlowe wanted you rattled, wanted you scared enough to pay to make it stop.",
    names: 'MARLOWE. He owns the paper. He owns me. He\'s the one you want.',
    teach: 'You ground his composure to zero — so the lie died and he named who\'s above him. That name is your next rung up the ladder.',
  },
};
