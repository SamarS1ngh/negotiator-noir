import type { Mission } from '../domain/mission';

// OTTO — Marlowe's consigliere, thirty years his right hand. He knows where every
// body is buried, and he knows Marlowe keeps nothing he can no longer use. You
// can't scare a man who's watched Marlowe work for three decades, and you can't
// buy his dignity. But you can name the thing he lies awake on: he's next.
// Three endings:
//   TURNED  — he quietly withdraws his protection (won't cover Marlowe, won't warn him)
//   HEDGES  — he neither helps nor betrays; watches, waits (nothing gained, nothing lost)
//   WARNS   — you handle him crudely; offended, he tells Marlowe someone's circling
export const OTTO_MISSION: Mission = {
  id: 'otto_mission',
  actionId: 'otto_turn',
  nodeId: 'otto',
  label: 'Work the consigliere',
  palette: 'marlowe',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, text: "Otto Kessler has kept Marlowe's secrets for thirty years. He's also the only man in the house who's watched Marlowe discard every soul who stopped being useful. He pours two brandies without being asked, and slides one to me. He already knows why I'm here." },
        { who: 'them', text: "The Vidal boy. Marlowe's new favourite stray. Sit. You've come to ask an old man to betray the only life he's had. Do it well, at least. I've heard it done badly too many times." },
      ],
      ask: "A courtly old wolf who's seen every angle. Crude won't work on him. How do you open?",
      choices: [
        { id: 'survive', label: "His fear — 'You know he'll throw you away the day you're inconvenient. That day's close.'", tone: 'disarm', to: 'n_survive' },
        { id: 'legacy', label: "His conscience — 'Thirty years of blood. For a man who'd forget your name in a week.'", tone: 'disarm', to: 'n_legacy' },
        { id: 'bribe', label: "Offer him a cut — 'Help me, and there's a place for you at the top with me.'", tone: 'bribe', to: 'o_warns' },
        { id: 'threat', label: "Lean on him — 'You'll help, or I'll let Marlowe think you already have.'", tone: 'push', to: 'o_warns' },
      ],
    },
    {
      id: 'n_survive',
      mood: 'cold',
      beats: [
        { who: 'them', text: "(a dry, humourless laugh) You think I don't know that? I've drafted the letters that ended better men than you. I recognise the paper my own name will be written on." },
      ],
      ask: "He's known his fate for years and made peace with it. Fear alone won't move a man who's already grieving himself. Where now?",
      choices: [
        { id: 'out', label: "Offer him the exit — 'Then step aside now, quietly. Let it be your choice, not his.'", tone: 'disarm', to: 'o_turned' },
        { id: 'press', label: "Push the fear harder — 'Beg me and I'll keep you breathing.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'n_legacy',
      mood: 'guilt',
      beats: [
        { who: 'them', text: "(sets down his glass, slowly) …Careful, boy. You're closer to the bone than you know." },
        { who: 'you', text: "You were somebody's son too, once. Somebody who thought you'd amount to more than a man who signs other men's death warrants." },
        { who: 'them', text: "(a long silence) …I had a daughter. She doesn't speak to me. Because of the life. Because of him." },
      ],
      ask: "You've cracked the courtly shell — there's a grieving man under it. This is the moment. What do you offer him?",
      choices: [
        { id: 'redeem', label: "A way to be more than his crimes — 'Then help end it. Let that be the thing she hears about you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'exploit', label: "Twist it — 'Good. Then you owe me. And her.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'o_turned',
      mood: 'warm',
      outcome: {
        key: 'turned', tone: 'good',
        title: 'OTTO — HE STEPS ASIDE',
        line: "He drains the brandy and looks, for a moment, twenty years lighter. \"When you move on him, I will be looking the other way. I will not cover him. I will not warn him. And if it comes to it —\" he taps a thick folder on the desk \"— I remember everything.\"",
        ripple: "Marlowe's oldest shield has quietly lowered. When you make your move, his consigliere won't lift a finger to save him.",
        reflect: "I offered a broken old man his one shot at being remembered as something other than Marlowe's hand. I meant it. I think. That's the part I'm not sure of anymore.",
        grants: ['ottoTurned'],
        dispositions: [{ nodeId: 'otto', set: 4 }],
      },
    },
    {
      id: 'o_hedges',
      mood: 'cold',
      outcome: {
        key: 'hedges', tone: 'mixed',
        title: 'OTTO — HE WATCHES',
        line: "He studies you the way he'd study a contract with a clause he doesn't like. \"I'll do nothing. I won't help you, and I won't hang you. An old man's neutrality — it's the most I give anyone now.\" It's not a no. It's not a yes.",
        ripple: "Otto stays out of it. He won't warn Marlowe — but he won't lower the shield either. You'll have to take Marlowe without him.",
        reflect: "I reached for his fear and his guilt and grabbed neither clean. He gave me nothing and cost me nothing. Marlowe would have gotten all of it.",
        dispositions: [{ nodeId: 'otto', set: 2 }],
      },
    },
    {
      id: 'o_warns',
      mood: 'threat',
      outcome: {
        key: 'warns', tone: 'bad',
        title: 'OTTO — YOU MISJUDGED HIM',
        line: "He sets down his glass with a click that ends the conversation. \"You came into my house and tried to buy me like a dockhand. Or frighten me. Thirty years, boy. Thirty years.\" He's already reaching for the telephone as you leave.",
        ripple: "Otto tells Marlowe someone in the house is circling. Marlowe pulls his people close and waits for you — forewarned.",
        reflect: "I handled a man of real weight like a mark. Sloppy. Ricci wouldn't have. Marlowe wouldn't have. I keep measuring myself against the men I came to destroy.",
        heatDelta: 3,
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'otto', set: 0 }],
      },
    },
  ],
};
