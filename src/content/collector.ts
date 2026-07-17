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
  opener: "You know why I'm here. Five hundred — that's the number. I don't haggle, and I don't wait.",
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

  // ---- RECON: 5 leads, 3 digs. What you find becomes your hand at the table.
  // Miss both leverage leads (bookkeeper / records) and you walk in with no
  // finisher — brutal. Skip the crew and you won't know he's proud. ----
  recon: {
    digs: 3,
    leads: [
      {
        id: 'crew', label: 'His crew at the docks', blurb: 'Buy his loaders a round and let them talk.',
        grants: 'type',
        dossier: 'PROUD. Ego runs the man — "I run my own book." Feed it: flatter him, plant doubt. NEVER offer a proud man charity; a way out reads as an insult and backfires.',
      },
      {
        id: 'tail', label: 'Tail him after hours', blurb: 'Three nights watching where he goes and who he fears.',
        grants: 'tell',
        dossier: 'HIS TELL: his hand drifts to his watch whenever he lies. When you see it, you know he\'s bluffing — call him.',
      },
      {
        id: 'bookkeeper', label: "Marlowe's bookkeeper", blurb: 'A nervous man with a grudge and a drink problem.',
        grants: 'lev:skims',
        dossier: 'LEVERAGE — he skims off the top and hides it in a second set of books. His boss finding out is the thing he\'s scared of.',
      },
      {
        id: 'records', label: 'The shipping records', blurb: 'A long night in a cold archive with a flashlight.',
        grants: 'lev:ledger',
        dossier: 'LEVERAGE — the second ledger: hard proof he under-reports to Marlowe. Cold numbers he can\'t argue with.',
      },
      {
        id: 'file', label: 'His file at the hall', blurb: 'Pull what the union has on Salvatore Ricci.',
        grants: 'lie',
        dossier: 'HIS LIE: the debt is invented. "The number\'s non-negotiable" is a bluff — he\'ll move on it the second he\'s cornered.',
      },
    ],
  },

  // ---- his PUSHES: he doesn't just defend — he comes at you. ----
  pushes: [
    {
      id: 'p_threat',
      line: "You walk in here with what — a folder? I know where you sleep, friend. I know the little apartment. Careful.",
      options: [
        { kind: 'hold', text: "Then you know I've got nothing left to lose. Bad thing to threaten a man about.",
          reply: 'He studies you. The threat didn\'t take.' },
        { kind: 'cave', text: "...I'm not looking for trouble. I just want this settled.",
          reply: 'A slow smile. He smells the fear now.' },
      ],
    },
    {
      id: 'p_lowball',
      line: "Tell you what. Half now, tonight, and I forget your face. Walk away while it's on the table.",
      options: [
        { kind: 'hold', text: "You're offering me a discount. Means you're already sweating. Keep talking.",
          reply: 'His jaw tightens. You read the flinch.' },
        { kind: 'cave', text: "Half... maybe half works.",
          reply: 'He leans back, satisfied. You just gave him the room.' },
      ],
    },
  ],
};
