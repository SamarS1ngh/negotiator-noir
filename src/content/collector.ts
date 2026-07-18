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
    why: "He collects for the empire that took your family. The debt is fake. Break him → it dies, and he names his boss.",
  },
  opener: "Five hundred. That's the number. I don't haggle.",
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
    teach: "You gave him what he could live with and took what you came for. The name is your next rung up the ladder.",
  },

  // ---- RECON: 5 leads, 3 digs. What you find becomes your hand at the table.
  // Miss both leverage leads (bookkeeper / records) and you walk in with no
  // finisher — brutal. Skip the crew and you won't know he's proud. ----
  recon: {
    digs: 3,
    // Leads give you RAW OBSERVATIONS — never conclusions. Nobody tells you
    // what kind of man he is; you work it out from what people saw him do.
    leads: [
      {
        id: 'crew', label: 'HIS CREW', blurb: 'Buy the dock loaders a round.',
        grants: 'type',
        dossier: '"Kid called him a nobody once. Sal put him through a window, then paid his hospital bill so people\'d know he could. He tells the story himself."',
      },
      {
        id: 'tail', label: 'TAIL HIM', blurb: 'Three nights. See where he goes.',
        grants: 'tell',
        dossier: 'Thursday he told his crew the shipment was clean. While he said it his hand went to his watch. Friday, same story, same hand. Both times he was lying.',
      },
      {
        id: 'bookkeeper', label: 'THE BOOKKEEPER', blurb: 'Nervous. Holds a grudge.',
        grants: 'lev:skims',
        dossier: '"There\'s two sets of books. The one Marlowe reads, and the real one. Sal keeps the difference." — he wouldn\'t say it twice, and he wouldn\'t sign anything.',
      },
      {
        id: 'records', label: 'SHIPPING RECORDS', blurb: 'A long night in the archive.',
        grants: 'lev:ledger',
        dossier: 'Forty crates in. Thirty-three reported. Every month, same gap, his signature at the bottom of each page. You have copies.',
      },
      {
        id: 'file', label: 'HIS FILE', blurb: 'What the union has on him.',
        grants: 'lie',
        dossier: 'No debt is registered against your father\'s name. No paper, no filing, nothing. Whatever Ricci is collecting, it exists only in his mouth.',
      },
    ],
  },

  // ---- his PUSHES: he doesn't just defend — he comes at you. ----
  pushes: [
    {
      id: 'p_threat',
      line: 'I know where you sleep, friend. Careful.',
      options: [
        { kind: 'hold', text: 'HOLD HIS EYES', reply: 'The threat didn\'t take.' },
        { kind: 'cave', text: 'BACK OFF', reply: 'A slow smile. He smells it now.' },
      ],
    },
    {
      id: 'p_lowball',
      line: 'Half now, tonight, and I forget your face.',
      options: [
        { kind: 'hold', text: 'REFUSE — HE\'S SWEATING', reply: 'His jaw tightens.' },
        { kind: 'cave', text: 'TAKE THE DEAL', reply: 'He leans back. You gave him the room.' },
      ],
    },
  ],
};
