import type { Mission } from '../domain/mission';

// REESE — the detective DeLuca owns. Twenty years ago he took his first envelope
// "just once." Now he's in so deep he books the district's murders as accidents.
// Tired, guilty, drinking. He knows where DeLuca's real money moves and where the
// bodies went — the proof that DeLuca's been building his own empire behind
// Marlowe's back. Money insults him; he's drowning, not greedy.
//   PROOF   — he gives you the file: DeLuca's secret empire ('delucaProof')
//   SCARED  — you get the file, but leave a wreck who may run to DeLuca
//   BOLTS   — you spook him; he runs to DeLuca, who's forewarned
export const REESE_MISSION: Mission = {
  id: 'reese_mission',
  actionId: 'reese_turn',
  nodeId: 'reese',
  label: 'Work the detective',
  palette: 'sal',
  scene: 'assets/art/scene/reese.jpg',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "Detective Reese drinks alone in the back of a bar that isn't his precinct's, which tells you everything. He's the man who signs off DeLuca's bodies as drownings and bar fights. He hates himself for it in a quiet, professional way." },
        { who: 'them', text: "(not turning) I know a tail when I feel one, kid. Whatever you're selling, I've already bought worse. Sit down or walk — you're blocking my light." },
      ],
      ask: "A guilty man drinking to forget what he knows. How do you reach him?",
      choices: [
        { id: 'conscience', label: "His conscience — 'You joined to catch men like DeLuca. Now you bury them for him.'", tone: 'disarm', to: 'n_conscience' },
        { id: 'fear', label: "His fear — 'When DeLuca falls — and he's going to — the cop who covered it falls with him.'", tone: 'press', to: 'n_fear' },
        { id: 'money', label: "Offer him cash — 'Name your price for what you know about DeLuca.'", tone: 'bribe', to: 'o_bolts' },
      ],
    },
    {
      id: 'n_conscience',
      mood: 'guilt',
      beats: [
        { who: 'them', text: "(the glass stops halfway) …Low blow, kid. Accurate. But low." },
        { who: 'you', text: "There was a version of you that would've put DeLuca away in a week. What happened to him?" },
        { who: 'them', text: "(sets the glass down) He took an envelope. Once. To pay for his kid's operation. And 'once' is a lie you only get to tell yourself one time." },
      ],
      ask: "The old cop is still in there, drowning. Throw him a rope, or push him under?",
      choices: [
        { id: 'redeem', label: "The rope — 'Then let this be the once you take it back. Give me what you've got on him.'", tone: 'disarm', to: 'o_proof' },
        { id: 'shame', label: "Shame him — 'So you sold your badge for a hospital bill. Cheap.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'n_fear',
      mood: 'fear',
      beats: [
        { who: 'them', text: "(a hollow laugh) You think I haven't done that math? Every night. DeLuca goes down, I go down. That's not a threat, kid, that's my whole retirement plan — hoping he outlives me." },
        { who: 'you', text: "Or you get ahead of it. The man who brings DeLuca down isn't the man who covered for him. He's a witness. There's a difference, and it's the difference between a pension and a cell." },
      ],
      ask: "He's weighing it — the terror of moving against the terror of standing still. Which way do you tip him?",
      choices: [
        { id: 'witness', label: "Make him the witness — 'Give me the file. Be the one who ended it, not the one who hid it.'", tone: 'disarm', to: 'o_proof' },
        { id: 'push', label: "Push the fear — 'Give it to me now, or I make sure DeLuca knows we talked.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'o_proof',
      mood: 'hope',
      outcome: {
        key: 'proof', tone: 'good',
        title: 'REESE — THE FILE',
        line: "He pulls a folder from inside his coat — he's been carrying it, you realise, for a long time, waiting for someone to ask. \"Every property DeLuca's bought that Marlowe doesn't know about. Every dollar he's skimmed off the top. The man's been building his own kingdom. This is the rope. Hang him with it.\"",
        ripple: "You hold proof DeLuca's been robbing Marlowe blind to build his own empire — the one secret that terrifies him. The blade for the sit-down.",
        reflect: "He'd been waiting years for someone to ask him to be a good man again. I obliged him. I needed the file. Both things are true, and I can't tell anymore which one I meant.",
        heatDelta: -1,
        grants: ['delucaProof'],
        dispositions: [{ nodeId: 'reese', set: 4 }],
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'REESE — A SHAKING SOURCE',
        line: "You get the file — but you got it by opening the wound and pouring salt. He's shaking, and he starts drinking faster the moment it leaves his hand. A man like that talks when he's frightened, and he's frightened now.",
        ripple: "You hold the proof. But Reese is a wreck, and a wreck of a cop who knows too much is exactly the kind of loose end DeLuca watches. He may sit down forewarned.",
        reflect: "I got the file and left the man worse than I found him. My father would have found a way to do the first without the second. I'm not sure I even tried.",
        grants: ['delucaProof'],
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'reese', set: 2 }],
      },
    },
    {
      id: 'o_bolts',
      mood: 'threat',
      outcome: {
        key: 'bolts', tone: 'bad',
        title: 'REESE — HE FOLDS THE WRONG WAY',
        line: "The cash lands on the bar between you and something in his face closes. \"Buying a cop. You came to buy a cop with a stranger's money.\" He leaves fast, and he doesn't go home — he goes to a phone, and the number he dials belongs to DeLuca.",
        ripple: "No file. Reese runs to DeLuca: a stranger with money is asking about the district's secrets. DeLuca tightens everything and waits for you.",
        reflect: "I tried to buy a drowning man. He didn't want money — he wanted absolution, and I offered him a bribe. I read him exactly wrong.",
        heatDelta: 3,
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'reese', set: 1 }],
      },
    },
  ],
};
