import type { Mission } from '../domain/mission';

// SAL MORETTI — the bookkeeper who cooked your father's books. A branching job
// with real turns: he opens hostile, and the scene lurches — resignation, a
// test, a threat, or the bomb where you name yourself and his guilt cracks him
// wide open. Four endings, each bending the board its own way:
//   MOLE   — you turn him into a loyal inside man (skim + he warns you)
//   SCARED — you get the skim, but he's a wreck who may tip Ricci off
//   BOUGHT — cash "works", but a bought man stays for sale (skim + betrayal seed)
//   BURNED — you spook him wrong; no skim, and he runs to Ricci, who hardens
// No option is simply correct. Guilt can be offered as absolution or twisted into
// a debt; fear can break him or make him bolt; money misreads a drowning man.
// Palette 'sal' lights him in a sickly bookkeeper's-lamp green; each node's mood
// re-lights the room as the scene turns.
export const SAL_MISSION: Mission = {
  id: 'sal_mission',
  actionId: 'sal_turn',
  nodeId: 'sal',
  label: 'Turn the bookkeeper',
  palette: 'sal',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: 'Three weeks I watched Sal Moretti before I showed my face. He keeps Ricci\'s books — and the second one, the one that proves Ricci steals from Marlowe. He stays late. He drinks alone. He flinches at the boss\'s name.' },
        { who: 'you', caption: true, text: "He's the softest way in. And there's a thing about me he doesn't know yet." },
        { who: 'them', text: '(ledger snapping shut, chair scraping back) We\'re closed. Whoever you are, you didn\'t see anything. Get out.' },
        { who: 'you', text: "Sit down, Sal. I'm not one of Marlowe's. I'm nobody." },
        { who: 'them', text: "Nobody doesn't walk into my office after dark and know my name. …What do you want." },
      ],
      ask: "He's cornered, scared, and sharp enough to be dangerous. How do you open him?",
      choices: [
        { id: 'disarm', label: "Hands open — 'I'm not here to hurt you. We're scared of the same man.'", tone: 'disarm', to: 'd1' },
        { id: 'press', label: "Crowd him — 'You don't want me talking loud about that drawer.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set a roll of cash on the ledger.', tone: 'bribe', to: 'c1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
      ],
    },

    // --- the name: the guilt bomb ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', text: '(the color goes out of his face) …Vidal. You\'re— Christ. You\'re his boy.' },
        { who: 'you', text: 'You did his numbers. The ones that said he was hiding money he never had.' },
        { who: 'them', text: "(barely audible) Ricci told me what to write. I've carried your father up three flights of stairs in my head every night since. I didn't want— I didn't have a choice." },
      ],
      ask: "He's not scared anymore — he's guilty, wide open. This is the moment. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him a way to make it right — 'Then help me. For him.'", tone: 'disarm', to: 'o_mole' },
        { id: 'twist', label: "Twist the knife — 'Good. Then you owe him. And me. The ledger.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', text: "(stung, the softness closing over) …So that's it. You're just another one who came to take something. Same as the rest of them." },
      ],
      ask: "You turned his guilt into a debt. He'll give you the book now — but you're losing the man. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. I'm sorry. Help me because it's right, not because I made you.'", tone: 'disarm', to: 'o_mole' },
        { id: 'take', label: "Take it and go — 'Just the book, Sal.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- disarm: fear curdles into resignation ---
    {
      id: 'd1',
      mood: 'cold',
      beats: [
        { who: 'them', text: '(lowers back into the chair, slowly) …The same man. You mean Ricci.' },
        { who: 'you', text: "I mean Marlowe. Ricci's just the hand. You keep the book that proves Ricci's been skimming the boss for years. When that surfaces, you're a witness — or a loose end." },
        { who: 'them', text: "(a short, bitter laugh) You think I don't know what I'm sitting on? I've had that ledger memorized a year. And I've done nothing — because doing something is how men like me end up face-down in the harbor." },
      ],
      ask: "He's past scared — he's given up. A trapped man won't move. What breaks the trap?",
      choices: [
        { id: 'hope', label: "Give him hope — 'When Ricci falls, you walk away clean. I'll see to it.'", tone: 'disarm', to: 'd_hope' },
        { id: 'fear', label: "Give him a worse fear — 'Marlowe's auditing his collectors. He finds you first.'", tone: 'press', to: 'd_fear' },
      ],
    },
    {
      id: 'd_hope',
      mood: 'hope',
      beats: [
        { who: 'them', text: '(studies you a long moment) And why would a kid with nothing be able to promise me anything?' },
        { who: 'you', text: 'Because I want Ricci gone more than I want to keep breathing. That makes me the only honest man you\'ve talked to all year.' },
        { who: 'them', text: '(something almost like a smile) …God help me. I believe you.' },
      ],
      ask: "He believes you. This is where you win him — or overreach and spook him.",
      choices: [
        { id: 'word', label: "Your word, plain — 'Then we understand each other.'", tone: 'disarm', to: 'o_mole' },
        { id: 'bind', label: "Bind him fast — 'Hand me the book now. We sink or swim together.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'd_fear',
      mood: 'fear',
      beats: [
        { who: 'them', text: "(pales) You think I haven't lain awake on that exact thought? Every night?" },
      ],
      ask: "He's terrified now, not hopeful. Pull him back, or ride the fear?",
      choices: [
        { id: 'pullback', label: "Pull him back — 'Then let me be your way out.'", tone: 'disarm', to: 'o_mole' },
        { id: 'pushon', label: "Ride it — 'So move. Before he moves first.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- press: he panics and threatens to scream ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', text: "(voice climbing) I'll scream. Ricci's men are one dock over — I scream, it's you they pull out of the water." },
        { who: 'you', text: "(quiet) Go on, then. Scream. And afterward explain to Ricci why a stranger walked straight to his bookkeeper — first door, no wrong turns." },
        { who: 'them', text: '(the words die in his throat)' },
      ],
      ask: "You've boxed him — furious and cornered, a dangerous mix. Let him breathe, or squeeze?",
      choices: [
        { id: 'easeoff', label: "Let him breathe — 'I'm not your enemy, Sal. Sit down.'", tone: 'disarm', to: 'd1' },
        { id: 'ride', label: "Squeeze — 'The book. Or Ricci hears you've been talking regardless.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', text: '(hands shaking, he shoves the second ledger across the desk) Take it. Take it and I never saw your face.' },
      ],
      ask: "You've got the book — and a broken man. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'This stays between us. Breathe.'", tone: 'disarm', to: 'o_scared' },
        { id: 'menace', label: "Seal it with fear — 'One word to Ricci and it's you in the harbor.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money misreads a drowning man ---
    {
      id: 'c1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: 'You set a roll of cash on the closed ledger. It sits there between you.' },
        { who: 'them', text: "(stares at it, doesn't touch it) …Money. You came to Ricci's bookkeeper and you brought money." },
        { who: 'you', text: "Everyone's got a price." },
        { who: 'them', text: "(a tired laugh) Not everyone. Some of us are just trying not to drown. You think cash fixes drowning?" },
      ],
      ask: "The money landed wrong — he's insulted, or maybe just desperate enough to hate that it tempts him. Read him.",
      choices: [
        { id: 'double', label: "Push more — 'Enough to vanish on. Name the number.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pocket', label: "Take it back — 'You're right. Forget the money. It's about staying alive.'", tone: 'disarm', to: 'd1' },
        { id: 'blackmail', label: "Turn it ugly — 'Take it, or I tell Ricci you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_mole',
      mood: 'warm',
      outcome: {
        key: 'mole', tone: 'good',
        title: 'SAL — YOUR MAN INSIDE',
        line: 'He unlocks a drawer with a hand that\'s steadier than it\'s been in a year and slides you the second ledger. "For Tomas," he says. "And for me." He\'s not just a source now. He\'s in it.',
        ripple: "Sal will feed you what Ricci knows before you ever sit down. Ricci walks in blind.",
        grants: ['skim', 'salMole'],
        dispositions: [{ nodeId: 'sal', set: 4 }],
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'SAL — A LOOSE END',
        line: "You walk out with the skim. But you leave Sal grey and sweating, eyes fixed on the door. You got the book. You didn't get the man.",
        ripple: 'If Ricci catches him shaking like that, he\'ll know someone got to him. Ricci may sit down forewarned.',
        grants: ['skim', 'salScared'],
        worldFlags: ['ricciForewarned'],
        dispositions: [{ nodeId: 'sal', set: 2 }],
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'SAL — BOUGHT, NOT TURNED',
        line: 'He counts the roll twice, then hands over the ledger. Cold, transactional, nothing behind the eyes. A man who sells once sells again.',
        ripple: 'You have the skim — but a man you bought can be bought back. Watch your back at the table.',
        grants: ['skim', 'salBought'],
        worldFlags: ['salBought'],
        dispositions: [{ nodeId: 'sal', set: 3 }],
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'SAL — BURNED',
        line: 'He goes white and silent and won\'t look at you. You know the look — the second you\'re gone, he\'s running to Ricci to save his own skin.',
        ripple: "No skim. Ricci hears someone's circling his people — and hardens against you.",
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'sal', set: 0 }],
      },
    },
  ],
};
