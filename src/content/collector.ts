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
};
