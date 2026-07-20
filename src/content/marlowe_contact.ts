import type { Mission } from '../domain/mission';

// MARLOWE — first contact. The payoff of the whole climb and the hinge into what
// comes next. You can't break Marlowe with a secret the way you broke Ricci — he
// has no fear to press, only control. So this isn't a takedown; it's your first
// move inside the machine. How you play it sets your standing for the war ahead,
// and closes Chapter One. Launched from the board once you've earned the way in.
export const MARLOWE_CONTACT: Mission = {
  id: 'marlowe_contact',
  actionId: 'marlowe_meet',
  nodeId: 'marlowe',
  label: 'Move on Marlowe',
  palette: 'marlowe',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, text: "The way up cost you the docks. Ricci got you through a door no debtor has ever walked. And here he is — Marlowe. A fountain pen in his hand like a scalpel, a ledger open in front of him. He doesn't look up." },
        { who: 'them', text: "Vidal's boy. Yes — I know. You turned my collector, rattled my dock, clawed all the way to this chair. Impressive. For an insect. Sit. Give me one reason I shouldn't have you erased before your coffee cools." },
        { who: 'you', caption: true, text: "Ricci I could break with a secret. Marlowe has none that frighten him — no fear to press, only control. You don't threaten this machine. You become a part of it, and turn it against itself. That war starts here." },
      ],
      ask: "In the room at last, with the man who ended your father — and he's already read you cover to cover. Your first move against Marlowe. Play it.",
      choices: [
        { id: 'useful', label: "Show your worth — 'Because I know everything Ricci knew, and I'm better at it.'", tone: 'push', to: 'o_pawn' },
        { id: 'humble', label: "Play small — 'Because a man like you always has use for one with nothing to lose.'", tone: 'disarm', to: 'o_unseen' },
        { id: 'threat', label: "Show your teeth — 'Because I took your collector in a month. Imagine a year.'", tone: 'push', to: 'o_marked' },
      ],
    },
    {
      id: 'o_pawn',
      mood: 'cold',
      outcome: {
        key: 'pawn', tone: 'mixed',
        tag: 'END OF CHAPTER ONE',
        title: "MARLOWE — YOU'RE INSIDE THE MACHINE",
        line: "He sets down the pen. 'Useful. We'll see for how long.' You're in — a rung on his ladder now, not the gutter beneath it. But you're a thing he owns, and Marlowe does not lose things he owns.",
        ripple: '',
        reflect: "I got everything I came for. I'm standing inside the empire that ate my father — as one of its working parts. He'd hardly know me now.",
        worldFlags: ['marloweMet'],
        dispositions: [{ nodeId: 'marlowe', set: 3 }],
        cta: 'THE MACHINE AWAITS ▸',
      },
    },
    {
      id: 'o_unseen',
      mood: 'cold',
      outcome: {
        key: 'unseen', tone: 'good',
        tag: 'END OF CHAPTER ONE',
        title: 'MARLOWE — HE NEVER SAW YOU',
        line: "He almost smiles. 'Nothing to lose. How useful.' He waves you toward a desk and has forgotten you before you reach the door. Exactly what you wanted — a knife nobody is watching.",
        ripple: '',
        reflect: "He looked at the man who is going to end him, and saw furniture. Good. Let him keep looking away.",
        worldFlags: ['marloweMet'],
        dispositions: [{ nodeId: 'marlowe', set: 2 }],
        cta: 'THE MACHINE AWAITS ▸',
      },
    },
    {
      id: 'o_marked',
      mood: 'threat',
      outcome: {
        key: 'marked', tone: 'bad',
        tag: 'END OF CHAPTER ONE',
        title: 'MARLOWE — A THREAT, NOTED',
        line: "The pen stops. For the first time he looks at you — really looks. 'Ambition. I'll keep an eye on that.' You're inside, yes. But now the coldest man alive is watching your every step.",
        ripple: '',
        reflect: "I wanted him to see me, and he did. Pride — the same pride that put Ricci where he is. I keep learning the wrong lessons from the wrong men.",
        heatDelta: 2,
        worldFlags: ['marloweMet'],
        dispositions: [{ nodeId: 'marlowe', set: 1 }],
        cta: 'THE MACHINE AWAITS ▸',
      },
    },
  ],
};
