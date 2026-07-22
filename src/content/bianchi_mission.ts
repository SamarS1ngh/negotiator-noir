import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, grounded in
// Bianchi's own world: leaning on an iron railing above a moonlit, foggy
// harbour at night, ships fading in the mist behind him, cold envious-green
// noir light on his sharp suit.
const ESTABLISH = 'assets/art/scene/bianchi_establish.jpg'; // wide: at the railing, chewing an old insult
const WATCHFUL = 'assets/art/scene/bianchi_watchful.jpg';   // sizing up the stranger, fast
const THIRTY = 'assets/art/scene/bianchi_thirty.jpg';       // not rising, "thirty seconds"
const WOLFSMILE = 'assets/art/scene/bianchi_wolfsmile.jpg'; // reads the proof, slow wolf's smile
const GRIEVANCE = 'assets/art/scene/bianchi_grievance.jpg'; // the smile gone — the water he built
const HANDOVER = 'assets/art/scene/bianchi_handover.jpg';   // you put it in his hand
const GENEROUS = 'assets/art/scene/bianchi_generous.jpg';   // suspicious — "why"
const WEAKMINE = 'assets/art/scene/bianchi_weakmine.jpg';   // dismissive scoff, wants a reason
const PARTNER = 'assets/art/scene/bianchi_partner.jpg';     // pockets it, grins — an ally
const CUTOUT = 'assets/art/scene/bianchi_cutout.jpg';       // folds it away, already moving for himself
const WAVED = 'assets/art/scene/bianchi_waved.jpg';         // turns his back — dismissed
const INSULTED = 'assets/art/scene/bianchi_insulted.jpg';   // cold fury, his men crowd in

// BIANCHI — the rival collector Marlowe passed over. A PEER, not a mark: he
// doesn't scare, doesn't take charity, and won't move on your word — only on
// EVIDENCE and self-interest. THE WOVEN READ is the opening fork itself: he's
// given you a tell (he's watching your hands and the open door, not your
// face — a man who checks what you're carrying before he weighs what you
// say). The correct read is that he needs PROOF, played to his ambition —
// sentiment (fairness) and force (threats) both misread him and cost you a
// beat or a botch. THE COMPLICATION: once you've hooked him with proof, he
// turns the knife back on you — testing whether you're Ricci's plant, or
// just thinking aloud about keeping it all and cutting you loose on the
// spot. Hold your nerve, or the wolf smells it. Four endings:
//   PARTNER  — he presses Ricci as your ally (you kept him needing you)
//   CUT OUT  — he takes the proof and moves for himself (Ricci pressed, but Bianchi becomes a future rival)
//   WAVED    — no proof / just talk → dismissed, nothing moves
//   INSULTED — you threatened a peer → he turns on you
// Using Bianchi at all is grabbing a knife by the blade — even the good
// ending only means the wolf hasn't decided to bite yet.
export const BIANCHI_MISSION: Mission = {
  id: 'bianchi_mission',
  actionId: 'bianchi_tip',
  nodeId: 'bianchi',
  label: 'Set the rival on him',
  palette: 'bianchi',
  scene: 'assets/art/scene/bianchi.jpg',
  teaches: ['interests-not-positions', 'types-and-tells', 'leverage-and-batna', 'triangulation'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: 'Bianchi holds the east docks — the scraps Marlowe left him after handing Ricci the prime water. He\'s chewed on that insult for three years. A collector, like Ricci. A peer, not a mark. He doesn\'t scare and he doesn\'t take charity.' },
        { who: 'you', caption: true, art: WATCHFUL, text: "To Bianchi, a stranger with an angle is either useful or in the way. He'll decide which fast." },
        { who: 'them', art: THIRTY, text: "(not rising) You've got thirty seconds and a face I don't know. Spend them well." },
        { who: 'you', caption: true, art: WATCHFUL, text: "His eyes go to your hands, empty, then to the door behind you, still open — not to your face. A man burned by empty promises checks what you're carrying before he bothers with what you're saying." },
      ],
      ask: "A proud peer who trusts nothing but what he can hold. Read him past the thirty seconds: does he move on sentiment, on threat, or only on something real enough to hold in his hand?",
      choices: [
        { id: 'proof', label: "Show him — 'Ricci skims Marlowe. Here's the proof — and it's yours to take.'", tone: 'disarm', requires: ['proof'], to: 'p_proof' },
        { id: 'interest', label: "His hunger — 'Ricci's weak. His whole territory could be yours.'", tone: 'press', to: 'i1' },
        { id: 'fairness', label: "His grievance — 'Marlowe robbed you of that water. Isn't that worth acting on?'", tone: 'disarm', to: 'f1' },
        { id: 'threaten', label: "Lean on him — 'Help me, or I make life hard for you too.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- you have proof: the knife's edge, then he tests you ---
    {
      id: 'p_proof',
      mood: 'cold',
      beats: [
        { who: 'them', art: WOLFSMILE, text: '(takes it, reads, a slow wolf\'s smile) …So the great Ricci\'s been dipping in the boss\'s pocket. If this is real, he\'s already a dead man. He just doesn\'t know it yet.' },
        { who: 'them', art: GRIEVANCE, text: "You know Marlowe handed that jumped-up leg-breaker the west water? Water I built. Twenty years I bled for this coast — and he gave the prime cut to Ricci because Ricci smiles wider at the right men. (the smile is gone now) This was never greed, kid. It's a debt owed. A long one." },
        { who: 'you', art: HANDOVER, text: "It's real. And I'm putting it in your hand." },
        { who: 'them', art: GENEROUS, text: 'Putting it in my hand. Generous. Men aren\'t generous. …Why.' },
        { who: 'them', art: WOLFSMILE, text: "(stops turning the paper, studies you instead) …Or here's a thought. Maybe Ricci sends a nobody to hand me a golden goose so I choke on it loud enough for the whole coast to hear whose plant you are. Or simpler still — maybe I just keep this, keep my mouth shut, and you're off my dock inside the hour. What exactly is stopping me?" },
      ],
      ask: "The knife's turned back on you — he's deciding whether you're a trap or an easy meal. Flinch, and he'll know which.",
      choices: [
        { id: 'nerve', label: "Hold flat — 'Nothing's stopping you. Except you're smarter than a one-time score, and if I were Ricci's, I'd have brought him this myself.'", tone: 'disarm', to: 'p_edge' },
        { id: 'overpromise', label: "Flinch, talk fast — 'Just take it — we're square, I'll go—'", tone: 'press', to: 'o_cutout' },
        { id: 'counterthreat', label: "Threaten back — 'Try it, and you're no better than the man you hate.'", tone: 'push', to: 'o_insulted' },
      ],
    },
    {
      id: 'p_edge',
      mood: 'cold',
      beats: [
        { who: 'them', art: THIRTY, text: "(the calculation resets, something in your voice he can't fake) …Fine. Not Ricci's. Not stupid, either." },
      ],
      ask: "He's hooked and calculating. The edge of the knife: partner, or he takes it and cuts you out.",
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
        { who: 'them', art: WEAKMINE, text: "Weak. Mine. Everyone's territory could be mine, kid — that's not news, that's a daydream. Show me a reason a man can hold, not a wish." },
      ],
      ask: "He wants leverage, not adjectives. What do you actually have?",
      choices: [
        { id: 'proof2', label: "Show him the skim — 'Here's your reason.'", tone: 'disarm', requires: ['proof'], to: 'p_proof' },
        { id: 'promise', label: "Promise it — 'Move now, and I'll hand you Ricci's books after.'", tone: 'press', to: 'o_waved' },
        { id: 'push', label: "Push with words — 'You're really going to sit here and take it?'", tone: 'push', to: 'o_waved' },
      ],
    },

    // --- fairness misread: he's armored his own grievance, not open to yours ---
    {
      id: 'f1',
      mood: 'cold',
      beats: [
        { who: 'them', art: GRIEVANCE, text: "(unmoved, almost bored) Fair? I've been owed 'fair' for three years and it's never once paid out. You don't buy a favor with a feeling I already own twice as much of. Bring me something new — or don't waste my thirty seconds twice." },
      ],
      ask: "He's turned your sympathy back on you. Fold, or find something harder?",
      choices: [
        { id: 'proof3', label: "Now give him the reason — 'Then here's something new.'", tone: 'disarm', requires: ['proof'], to: 'p_proof' },
        { id: 'plead', label: "Press the grievance anyway — 'Still. Doesn't it eat at you?'", tone: 'press', to: 'o_waved' },
      ],
    },

    // --- endings ---
    {
      id: 'o_partner',
      mood: 'hope',
      portrait: PARTNER,
      outcome: {
        key: 'partner', tone: 'good',
        title: 'BIANCHI — YOUR PARTNER',
        line: "He pockets the proof and grins like a wolf that's seen a limp. 'We squeeze him together, then. You feed me, I press him. Don't get greedy on me, kid.'",
        ripple: "Bianchi's men appear at the edge of Ricci's docks. Ricci smells a rival closing in — and never guesses you're behind it. He'll deal from fear.",
        reflect: "I gave a wolf a reason and called it an alliance. My father would call it feeding the bigger dog and praying it stays fed.",
        grants: ['bianchiPressing'],
        dispositions: [{ nodeId: 'bianchi', set: 4 }],
        campaign: { bonds: [{ id: 'bianchi', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['bianchi_partner'] },
        debrief: { principle: 'leverage-and-batna',
          note: "Handing him proof for free would've made you disposable the moment he had it — so you kept a string on it: he only gets the rest of what he needs if you win too. That's **leverage** — anything that worsens a man's walk-away — and keeping yourself inside his **BATNA** (his best alternative without you) is what makes 'partner' stick instead of 'used once.' Still: you just grabbed a knife by the blade. He's got the handle now, and he's smiling. A partner who's still a wolf hasn't decided against you — he's just decided not yet." },
      },
    },
    {
      id: 'o_cutout',
      mood: 'cold',
      portrait: CUTOUT,
      outcome: {
        key: 'cutout', tone: 'mixed',
        title: 'BIANCHI — HE TAKES IT AND RUNS',
        line: "He folds the proof into his coat. 'Good doing business.' And he's already moving — for himself. You didn't gain a partner. You made a bigger predator.",
        ripple: "Ricci gets pressed hard — he'll deal from fear. But Bianchi owes you nothing now. When Ricci falls, it's Bianchi standing on the territory. A problem you're saving for later.",
        reflect: "He'll take everything, and I handed him the knife. I keep building bigger monsters to kill the smaller ones.",
        grants: ['bianchiPressing'],
        worldFlags: ['bianchiRival'],
        dispositions: [{ nodeId: 'bianchi', set: 1 }],
        campaign: { bonds: [{ id: 'bianchi', delta: -1 }], ledger: ['bianchi_cutout'] },
        debrief: { principle: 'interests-not-positions',
          note: "You answered his **position** — 'here, it's yours' — without asking what his real **interest** was. It was never an alliance. It was Ricci's territory, clean, with nobody to split it with. Feed a man's true interest that well and he stops needing the deal you thought you were offering. His **BATNA** — going it alone — beat yours the second the proof cost him nothing." },
      },
    },
    {
      id: 'o_waved',
      mood: 'cold',
      portrait: WAVED,
      outcome: {
        key: 'waved', tone: 'bad',
        title: 'BIANCHI — NOT ON YOUR WORD',
        line: "'Rumors and wishes.' He turns back to his ledger. 'Come back when you've got something a man can hold in his hand.' You're dismissed.",
        ripple: "Nothing moves. Bianchi files you under 'not serious' — and that's a door that's harder to open the second time.",
        reflect: "Rumors and wishes. He's right. I have to become a man who holds something — not the boy still begging at the door.",
        dispositions: [{ nodeId: 'bianchi', set: 2 }],
        campaign: { bonds: [{ id: 'bianchi', delta: -1 }], ledger: ['bianchi_waved'] },
        debrief: { principle: 'types-and-tells',
          note: "Sentiment and promises work on a man who still has something soft left to lose. Three years of grievance turned Bianchi's softness to armor — pity bounces off him, and an unbacked promise reads as a rumor with better manners. You read the **type** wrong: he only moves on **evidence**, not empathy. Bring the tell that type actually answers to, or the door stays shut." },
      },
    },
    {
      id: 'o_insulted',
      mood: 'threat',
      portrait: INSULTED,
      outcome: {
        key: 'insulted', tone: 'bad',
        title: "BIANCHI — YOU DON'T LEAN ON HIM",
        line: "'You don't threaten me, kid. Nobody threatens me.' His men step in close and quiet. You leave faster than you arrived — and he keeps your face.",
        ripple: "A peer doesn't take threats. Bianchi's insulted now, and a slighted collector at your back is a dangerous thing to leave behind you.",
        reflect: "Threatened a proud man to his face. Stupid — Ricci would've played it smooth. I keep catching myself thinking that: what would Ricci do.",
        heatDelta: 2,
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'bianchi', set: 0 }],
        campaign: { bonds: [{ id: 'bianchi', delta: -2 }], faction: { id: 'docks', delta: -1 }, ledger: ['bianchi_insulted'] },
        debrief: { principle: 'types-and-tells',
          note: "A proud man isn't frightened into moving — he's insulted into remembering exactly who disrespected him. Threats spend best on men with more to lose than pride; after Marlowe's snub, pride is the one thing Bianchi has left, and the one thing he'll never again let you touch for free. Reading his **type** wrong — playing a proud peer like a frightened mark — buys you a grudge where a favor was sitting on the table." },
      },
    },
  ],
};
