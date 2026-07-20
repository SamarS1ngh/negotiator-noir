import type { Mission } from '../domain/mission';

// THE CREW — Big Enzo's loaders. They don't scare and they don't trust, but two
// things open them: your father put this crew to work the winter the docks froze
// and never called it back, and Ricci docked young Pip a day's pay for a hand
// Ricci's own rush job crushed. Money reads as an insult (they tip Ricci).
// Four endings, each bending the board differently:
//   ALLY      — they slow Ricci's cargo + feed you what they see (crew loyal)
//   MANIFESTS — Pip slips you a month of tallies (the ledger), but it draws eyes
//   SPOOKED   — they step back from Ricci uneasily (he sits rattled, doesn't know why)
//   TIPPED    — you misread them; they carry it to Ricci, who hardens
export const CREW_MISSION: Mission = {
  id: 'crew_mission',
  actionId: 'crew_spook',
  nodeId: 'crew',
  label: 'Work the crew',
  palette: 'crew',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: 'The crew drinks at the end of the pier when the whistle blows. Big Enzo runs them — bad back, worse temper, a long memory. They move Ricci\'s cargo. They also hate what it costs them.' },
        { who: 'you', caption: true, text: "They don't scare and they don't trust. But there are a couple of names that might open the door." },
        { who: 'them', text: "(not looking up from his bottle) Pier's closed to suits and to cops. You're one or the other." },
      ],
      ask: "Enzo's not looking at you yet. How do you open them?",
      choices: [
        { id: 'name', label: "The name — 'My father was Tomas Vidal. He carried this crew through the frozen winter.'", tone: 'disarm', to: 'n1' },
        { id: 'grievance', label: "The wound — 'Ricci docked Pip a day for a hand his own rush job crushed.'", tone: 'press', to: 'g1' },
        { id: 'rumor', label: "The fear — 'Marlowe's cleaning house. Men who stand near Ricci get swept.'", tone: 'press', to: 'r1' },
        { id: 'money', label: 'The cash — \'There\'s money in walking off Ricci\'s jobs.\'', tone: 'bribe', to: 'm1' },
      ],
    },

    // --- name: your father's goodwill ---
    {
      id: 'n1',
      mood: 'warm',
      beats: [
        { who: 'them', text: '(looks up now, slow) …Vidal. The chandler. He put my whole crew on the winter the harbor froze and never asked a cent back.' },
        { who: 'them', text: "So. Tomas Vidal's kid, on my pier. What do you want — for his sake?" },
        { who: 'you', text: "Ricci. I'm taking him down. I need the docks to look the other way when it comes." },
      ],
      ask: "You've got their ear on your father's name. How do you cash it in?",
      choices: [
        { id: 'stand', label: "Ask them to stand with you, openly.", tone: 'push', to: 'n2' },
        { id: 'slow', label: "Ask only that they slow his cargo — quietly.", tone: 'disarm', to: 'o_ally' },
        { id: 'proof', label: "Ask for the shipping manifests — proof.", tone: 'disarm', to: 'n_pip' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', text: "Stand with you? Openly? Against Ricci, for a dead man's boy? That's our necks on the block, not yours." },
      ],
      ask: "You asked for too much. Pull back, or lean on the debt to your father?",
      choices: [
        { id: 'pull', label: "Pull back — 'Then just slow him down. That's all I need.'", tone: 'disarm', to: 'o_ally' },
        { id: 'guilt', label: "Lean on it — 'He'd have stood for you. Every one of you.'", tone: 'push', to: 'o_spooked' },
      ],
    },
    {
      id: 'n_pip',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, text: 'A young loader with a splinted hand hangs at the edge of the light. Pip.' },
        { who: 'them', text: "(quiet, stepping up) I keep the tallies. Ricci docked me a day for this hand. …If it hurts him, I've got a month of his numbers." },
      ],
      ask: "Pip's offering the manifests — scared, and angry enough to risk it. What do you do with the boy?",
      choices: [
        { id: 'protect', label: "Protect him — 'Only if it won't come back on you, Pip.'", tone: 'disarm', to: 'o_manifests' },
        { id: 'grab', label: "Take them fast — 'Give me the book. Now, before Enzo changes his mind.'", tone: 'push', to: 'o_manifests' },
        { id: 'overpromise', label: "Overpromise — 'Do this and you'll never load another crate.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- grievance: Pip's hand ---
    {
      id: 'g1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "The kid can't be seventeen. He keeps the splinted hand tucked behind his back like it shames him — and when I glance his way, the whole crew shifts, quiet, to block my view of him." },
        { who: 'them', text: "(follows my eyes, sets the bottle down) Pip. Good kid. Fast hands — was. Ricci's rush job took three fingers, then Ricci docked him a day for 'improper handling.' We look after our own down here. Nobody else does." },
        { who: 'you', text: "A man who bleeds you and calls it your fault. How long till it's your hand, Enzo? Your day?" },
      ],
      ask: "The resentment's lit. Where do you aim it?",
      choices: [
        { id: 'atRicci', label: "At Ricci — 'Slow his cargo. Make the man sweat.'", tone: 'disarm', to: 'o_ally' },
        { id: 'atMarlowe', label: "At Marlowe — 'Word is the boss is already cleaning house.'", tone: 'press', to: 'r1' },
        { id: 'atPay', label: "At their wages — 'I'll make it worth more than Ricci pays.'", tone: 'bribe', to: 'm1' },
      ],
    },

    // --- rumor: fear of Marlowe ---
    {
      id: 'r1',
      mood: 'fear',
      beats: [
        { who: 'them', text: "Cleaning house. You're saying we're on some list." },
        { who: 'you', text: "I'm saying when Marlowe swings, anyone standing too close to Ricci is standing in the wrong place." },
      ],
      ask: "Fear's in the air now. Seal it, or overplay your hand?",
      choices: [
        { id: 'seal', label: "Seal it — 'Step back from his jobs. Quietly. That's all.'", tone: 'disarm', to: 'o_spooked' },
        { id: 'over', label: "Overplay — 'Unless you throw in with me first. Then you're covered.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- money: the insult ---
    {
      id: 'm1',
      mood: 'cold',
      beats: [
        { who: 'them', text: "(flat) You're buying us. Off Ricci's jobs. With what — a stranger's roll." },
        { who: 'you', text: "Everyone's got a number, Enzo." },
        { who: 'them', text: "(spits over the pier) Ricci pays regular. And Ricci's here. You're a dead man's name and a fat mouth." },
      ],
      ask: "The money landed like a slap. Recover, or double down?",
      choices: [
        { id: 'recover', label: "Recover — 'Forget the money. This is Pip. This is your father's friend.'", tone: 'disarm', to: 'o_spooked' },
        { id: 'double', label: "Double down — 'Name your price, then. Everyone breaks.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- endings ---
    {
      id: 'o_ally',
      mood: 'warm',
      outcome: {
        key: 'ally', tone: 'good',
        title: 'THE CREW — WITH YOU',
        line: "Enzo spits over the pier and puts out a scarred hand. 'For Tomas. We'll slow the bastard's cargo and tell you what we see. Quiet-like.'",
        ripple: "Ricci's shipments start running late and his own men won't meet his eye. He'll sit down rattled — and half-blind.",
        reflect: "They stood with me for my father's name. I hope I'm still worth that name when this is finished.",
        grants: ['crewSpooked', 'crewLoyal'],
        dispositions: [{ nodeId: 'crew', set: 4 }],
      },
    },
    {
      id: 'o_manifests',
      mood: 'hope',
      outcome: {
        key: 'manifests', tone: 'good',
        title: "THE MANIFESTS — PIP'S GIFT",
        line: "Pip slides you a month of tallies with his good hand. 'Make it count,' he says. 'For the day he took off me.'",
        ripple: "You hold hard proof of everything moving through Ricci's docks. But a loader asking after the book gets noticed — his people start watching the paper.",
        reflect: "I'm spending a crippled kid's courage to hurt the man who crippled him. I tell myself it's for something bigger than me. I'll have to keep telling myself that.",
        grants: ['ledger'],
        worldFlags: ['ricciForewarned'],
        dispositions: [{ nodeId: 'crew', set: 3 }],
      },
    },
    {
      id: 'o_spooked',
      mood: 'cold',
      outcome: {
        key: 'spooked', tone: 'mixed',
        title: 'THE CREW — STEPPING BACK',
        line: "They don't throw in with you. But by morning they're finding reasons not to be near Ricci's cargo. Uneasy. Watching you almost as close as him.",
        ripple: "Ricci feels the cold shoulder from his own crew and can't say why. He'll sit down tense.",
        reflect: "Fear worked. Fear always works. That's the part that's starting to scare me.",
        grants: ['crewSpooked'],
        dispositions: [{ nodeId: 'crew', set: 2 }],
      },
    },
    {
      id: 'o_tipped',
      mood: 'threat',
      outcome: {
        key: 'tipped', tone: 'bad',
        title: 'THE CREW — THEY TIP HIM',
        line: 'Enzo listens, nods, says nothing. Within the hour Ricci knows a stranger has been on his pier, buying his men.',
        ripple: "No help here. Ricci hears someone's circling his people — and hardens against you.",
        reflect: "I tried to buy men who can't be bought. My father would have led with the boy's hand, not a roll of cash. I'm learning the wrong lessons fast.",
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'crew', set: 1 }],
      },
    },
  ],
};
