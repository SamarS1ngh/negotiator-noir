import type { Mission } from '../domain/mission';

// BIANCHI — the rival collector Marlowe passed over. A PEER, not a mark: he
// doesn't scare, doesn't take charity, and won't move on your word — only on
// EVIDENCE and self-interest. The 'proof' approach is gated on you having dug up
// hard evidence first (skim/ledger); without it you've only got rumors he waves
// off. And the twist: hand a wolf the proof and he may take it and cut you out.
// Four endings:
//   PARTNER  — he presses Ricci as your ally (you kept him needing you)
//   CUT OUT  — he takes the proof and moves for himself (Ricci pressed, but Bianchi becomes a future rival)
//   WAVED    — no proof / just talk → dismissed, nothing moves
//   INSULTED — you threatened a peer → he turns on you
export const BIANCHI_MISSION: Mission = {
  id: 'bianchi_mission',
  actionId: 'bianchi_tip',
  nodeId: 'bianchi',
  label: 'Set the rival on him',
  palette: 'bianchi',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: 'Bianchi holds the east docks — the scraps Marlowe left him after handing Ricci the prime water. He\'s chewed on that insult for three years. A collector, like Ricci. A peer, not a mark. He doesn\'t scare and he doesn\'t take charity.' },
        { who: 'you', caption: true, text: "To Bianchi, a stranger with an angle is either useful or in the way. He'll decide which fast." },
        { who: 'them', text: "(not rising) You've got thirty seconds and a face I don't know. Spend them well." },
      ],
      ask: "A proud peer with his arms folded. How do you play him?",
      choices: [
        { id: 'proof', label: "Show him — 'Ricci skims Marlowe. Here's the proof — and it's yours to take.'", tone: 'disarm', requires: ['proof'], to: 'p_proof' },
        { id: 'interest', label: "His hunger — 'Ricci's weak. His whole territory could be yours.'", tone: 'press', to: 'i1' },
        { id: 'fairness', label: "His grievance — 'Marlowe robbed you of that water. Isn't that worth acting on?'", tone: 'disarm', to: 'o_waved' },
        { id: 'threaten', label: "Lean on him — 'Help me, or I make life hard for you too.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- you have proof: the knife's edge ---
    {
      id: 'p_proof',
      mood: 'cold',
      beats: [
        { who: 'them', text: '(takes it, reads, a slow wolf\'s smile) …So the great Ricci\'s been dipping in the boss\'s pocket. If this is real, he\'s already a dead man. He just doesn\'t know it yet.' },
        { who: 'them', text: "You know Marlowe handed that jumped-up leg-breaker the west water? Water I built. Twenty years I bled for this coast — and he gave the prime cut to Ricci because Ricci smiles wider at the right men. (the smile is gone now) This was never greed, kid. It's a debt owed. A long one." },
        { who: 'you', text: "It's real. And I'm putting it in your hand." },
        { who: 'them', text: 'Putting it in my hand. Generous. Men aren\'t generous. …Why.' },
      ],
      ask: "He's hooked — and calculating. The edge of the knife: partner, or he takes it and cuts you out.",
      choices: [
        { id: 'leash', label: "Keep the leash — 'There's more he needs, and he only gets it if I win too.'", tone: 'disarm', to: 'o_partner' },
        { id: 'free', label: "Give it freely — 'Because I want Ricci gone. That's reason enough.'", tone: 'push', to: 'o_cutout' },
        { id: 'threaten2', label: "Threaten him too — 'And if you double-cross me, you're next.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- no proof: he wants a reason, not a wish ---
    {
      id: 'i1',
      mood: 'tense',
      beats: [
        { who: 'them', text: "Weak. Mine. Everyone's territory could be mine, kid — that's not news, that's a daydream. Show me a reason a man can hold, not a wish." },
      ],
      ask: "He wants leverage, not adjectives. What do you actually have?",
      choices: [
        { id: 'proof2', label: "Show him the skim — 'Here's your reason.'", tone: 'disarm', requires: ['proof'], to: 'p_proof' },
        { id: 'promise', label: "Promise it — 'Move now, and I'll hand you Ricci's books after.'", tone: 'press', to: 'o_waved' },
        { id: 'push', label: "Push with words — 'You're really going to sit here and take it?'", tone: 'push', to: 'o_waved' },
      ],
    },

    // --- endings ---
    {
      id: 'o_partner',
      mood: 'hope',
      outcome: {
        key: 'partner', tone: 'good',
        title: 'BIANCHI — YOUR PARTNER',
        line: "He pockets the proof and grins like a wolf that's seen a limp. 'We squeeze him together, then. You feed me, I press him. Don't get greedy on me, kid.'",
        ripple: "Bianchi's men appear at the edge of Ricci's docks. Ricci smells a rival closing in — and never guesses you're behind it. He'll deal from fear.",
        reflect: "I gave a wolf a reason and called it an alliance. My father would call it feeding the bigger dog and praying it stays fed.",
        grants: ['bianchiPressing'],
        dispositions: [{ nodeId: 'bianchi', set: 4 }],
      },
    },
    {
      id: 'o_cutout',
      mood: 'cold',
      outcome: {
        key: 'cutout', tone: 'mixed',
        title: 'BIANCHI — HE TAKES IT AND RUNS',
        line: "He folds the proof into his coat. 'Good doing business.' And he's already moving — for himself. You didn't gain a partner. You made a bigger predator.",
        ripple: "Ricci gets pressed hard — he'll deal from fear. But Bianchi owes you nothing now. When Ricci falls, it's Bianchi standing on the territory. A problem you're saving for later.",
        reflect: "He'll take everything, and I handed him the knife. I keep building bigger monsters to kill the smaller ones.",
        grants: ['bianchiPressing'],
        worldFlags: ['bianchiRival'],
        dispositions: [{ nodeId: 'bianchi', set: 1 }],
      },
    },
    {
      id: 'o_waved',
      mood: 'cold',
      outcome: {
        key: 'waved', tone: 'bad',
        title: 'BIANCHI — NOT ON YOUR WORD',
        line: "'Rumors and wishes.' He turns back to his ledger. 'Come back when you've got something a man can hold in his hand.' You're dismissed.",
        ripple: "Nothing moves. Bianchi files you under 'not serious' — and that's a door that's harder to open the second time.",
        reflect: "Rumors and wishes. He's right. I have to become a man who holds something — not the boy still begging at the door.",
        dispositions: [{ nodeId: 'bianchi', set: 2 }],
      },
    },
    {
      id: 'o_insulted',
      mood: 'threat',
      outcome: {
        key: 'insulted', tone: 'bad',
        title: "BIANCHI — YOU DON'T LEAN ON HIM",
        line: "'You don't threaten me, kid. Nobody threatens me.' His men step in close and quiet. You leave faster than you arrived — and he keeps your face.",
        ripple: "A peer doesn't take threats. Bianchi's insulted now, and a slighted collector at your back is a dangerous thing to leave behind you.",
        reflect: "Threatened a proud man to his face. Stupid — Ricci would've played it smooth. I keep catching myself thinking that: what would Ricci do.",
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'bianchi', set: 0 }],
      },
    },
  ],
};
