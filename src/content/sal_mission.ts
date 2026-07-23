import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → guilt bomb → the branches →
// each ending its own image + mood).
const WATCH = 'assets/art/scene/sal_watch.jpg';       // surveillance: lit window from the dark dock
const DESK = 'assets/art/scene/sal_desk.jpg';         // Sal alone, the hidden second book
const CLOSED = 'assets/art/scene/sal_closed.jpg';     // snaps the ledger shut, "we're closed"
const DOORWAY = 'assets/art/scene/sal_doorway.jpg';   // your silhouette in his door
const WARY = 'assets/art/scene/sal_wary.jpg';         // narrowed eyes, "what do you want"
const DRAIN = 'assets/art/scene/sal_drain.jpg';       // the colour leaves his face — "his boy"
const ACCUSE = 'assets/art/scene/sal_accuse.jpg';     // you lean in, he shrinks
const CONFESS = 'assets/art/scene/sal_confess.jpg';   // hand over eyes, the confession
const STUNG = 'assets/art/scene/sal_stung.jpg';       // guilt hardens to bitter mistrust
const SINK = 'assets/art/scene/sal_sink.jpg';         // sinks back, resigned
const BITTER = 'assets/art/scene/sal_bitter.jpg';     // the hollow bitter laugh
const DOUBT = 'assets/art/scene/sal_doubt.jpg';       // studying you, deciding to trust
const SMILE = 'assets/art/scene/sal_smile.jpg';       // the fragile hopeful half-smile
const FEAR2 = 'assets/art/scene/sal_fear2.jpg';       // pale, rigid, terrified
const SCREAM = 'assets/art/scene/sal_scream.jpg';     // half-risen, about to shout
const CALLBLUFF = 'assets/art/scene/sal_callbluff.jpg';// you call it, his nerve fades
const CHOKE = 'assets/art/scene/sal_choke.jpg';       // the shout dies in his throat
const CASHDROP = 'assets/art/scene/sal_cashdrop.jpg'; // the roll lands on the ledger
const CASHSTARE = 'assets/art/scene/sal_cashstare.jpg';// he stares at the money
const DROWN = 'assets/art/scene/sal_drown.jpg';       // the tired laugh — cash can't fix drowning
const LEDGER = 'assets/art/scene/sal_ledger.jpg';     // shoves the second book across
const HOPE = 'assets/art/scene/sal_hope.jpg';         // the woven read: he sharpens, pricing you back
const GUILT = 'assets/art/scene/sal_guilt.jpg';       // the woven read: hand to mouth, guarded fear
const PANIC = 'assets/art/scene/sal_panic.jpg';       // the complication: boots outside, he startles
const MOLE = 'assets/art/scene/sal_mole.jpg';         // the old book — redemption
const SCARED = 'assets/art/scene/sal_scared_end.jpg'; // grey, sweating, watching the door
const BOUGHT = 'assets/art/scene/sal_bought_end.jpg'; // counting the roll, dead eyes
const BURNED = 'assets/art/scene/sal_burned.jpg';     // ashen, about to run to Ricci

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
// Palette 'sal' lights him in a sickly bookkeeper's-lamp green; each beat's mood
// re-lights the room as the scene turns.
// THE WOVEN READ: right after the opening watch, before any approach, you judge
// what Sal truly IS from what you've seen — drowning, for sale, or vengeful. The
// true read (drowning) opens the strong approaches with confidence; a wrong read
// still reaches every approach, but foregrounds the weaker ones and costs you a
// beat of misjudging him.
// THE COMPLICATION: on the name/guilt path, his confession is interrupted by
// boots outside the door — a choice under pressure (freeze/cover/rush) before the
// scene rejoins the same absolve/twist fork into the same four endings.
export const SAL_MISSION: Mission = {
  id: 'sal_mission',
  actionId: 'sal_turn',
  nodeId: 'sal',
  label: 'Turn the bookkeeper',
  palette: 'sal',
  scene: 'assets/art/scene/sal.jpg',
  teaches: ['interests-not-positions', 'golden-bridge', 'types-and-tells'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WATCH, text: 'Three weeks I watched Sal Moretti before I showed my face. He keeps Ricci\'s books — and the second one, the one that proves Ricci steals from Marlowe. He stays late. He drinks alone. He flinches at the boss\'s name.' },
        { who: 'you', caption: true, art: DESK, text: "He's the softest way in. And there's a thing about me he doesn't know yet." },
        { who: 'them', art: CLOSED, text: "(ledger snapping shut, chair scraping back) We're closed. Whoever you are, you didn't see anything. Get out." },
        { who: 'you', art: DOORWAY, text: "Sit down, Sal. I'm not one of Marlowe's. I'm nobody." },
        { who: 'them', art: WARY, text: "Nobody doesn't walk into my office after dark and know my name. …What do you want." },
      ],
      ask: "Before you say a word — look at him. Read him true, like Pa taught you.",
      choices: [
        { id: 'read', label: "Read him before you say a word. ▸", tone: 'disarm', to: 'read_sal' },
      ],
    },
    // THE READ — investigate Sal, then judge what really drives him (routes to the
    // same three branches the old text-fork did, but the player earns the read).
    {
      id: 'read_sal',
      mood: 'tense',
      portrait: 'assets/art/scene/sal_desk.jpg',
      read: {
        ask: "What's really driving him?",
        hint: 'Tap what you notice.',
        clues: [
          { x: 33, y: 64, label: 'his hands', note: 'Guarding that drawer. Not selling it.', grants: 'saw_drawer' },
          { x: 62, y: 76, label: 'the glass', note: 'Drinking alone. Numbing something.', grants: 'saw_numbing' },
          { x: 50, y: 28, label: 'his eyes', note: "Flinches at 'Marlowe.' Not Ricci — Marlowe.", grants: 'saw_fear' },
          { x: 17, y: 48, label: 'the ledgers', note: 'Two books. Sat on them a year. Cornered.', grants: 'saw_cornered' },
        ],
        options: [
          { id: 'drowning', label: 'Drowning — he wants OUT.', to: 'r_drowning' },
          { id: 'forsale', label: "For sale — he'll deal with anyone.", to: 'r_forsale' },
          { id: 'revenge', label: 'Vengeful — he hates Ricci.', to: 'r_revenge' },
        ],
      },
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_drowning',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: DESK, text: "The late nights. The drink. The flinch at Marlowe's name. The hand that keeps finding that drawer. That's not a man guarding a score — it's a man bailing water. He isn't looking for an angle. He's looking for a way out." },
      ],
      ask: "You know what he needs before he's said it. How do you open a drowning man?",
      choices: [
        { id: 'disarm', label: "Hands open — 'I'm not here to hurt you. We're scared of the same man.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Crowd him — 'You don't want me talking loud about that drawer.'", tone: 'press', requires: ['saw_drawer'], to: 'p1' },
        { id: 'bribe', label: 'Set a roll of cash on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: HOPE, text: "A man this scared, you decide, will deal with anyone holding the right number. And right as you settle on it — something sharpens in his face. A small, knowing look. Like he's already pricing you back." },
      ],
      ask: "If he's for sale, he's for sale to your enemies too. Careful how you open a man who's already doing the math on you.",
      choices: [
        { id: 'bribe', label: 'Set a roll of cash on the ledger.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Crowd him — 'You don't want me talking loud about that drawer.'", tone: 'press', requires: ['saw_drawer'], to: 'p1' },
        { id: 'disarm', label: "Hands open — 'I'm not here to hurt you. We're scared of the same man.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
      ],
    },
    {
      id: 'r_revenge',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: GUILT, text: "You decide he wants Ricci gone as badly as you do — that under the fear is a man ready to move. Then his hand freezes on the drawer, and his eyes flick to the door. That's not a man spoiling for a fight. That's a man who already lost one." },
      ],
      ask: "Push a broken man toward revenge and he doesn't fight — he bolts. How do you open him, knowing that now?",
      choices: [
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Crowd him — 'You don't want me talking loud about that drawer.'", tone: 'press', requires: ['saw_drawer'], to: 'p1' },
        { id: 'disarm', label: "Hands open — 'I'm not here to hurt you. We're scared of the same man.'", tone: 'disarm', to: 'd1' },
        { id: 'bribe', label: 'Set a roll of cash on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the name: the guilt bomb ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', art: DRAIN, text: '(the color goes out of his face) …Vidal. You\'re— Christ. You\'re his boy.' },
        { who: 'you', art: ACCUSE, text: 'You did his numbers. The ones that said he was hiding money he never had.' },
        { who: 'them', art: CONFESS, text: "(barely audible) Ricci told me what to write. I've carried your father up three flights of stairs in my head every night since. I didn't want— I didn't have a choice." },
        { who: 'them', art: PANIC, text: "(his head snaps up — boots on the dock boards outside, slow, and then stopped dead outside the door. Someone's listening, or about to knock.)" },
      ],
      ask: "Sal's confession is still hanging in the air and someone's right on the other side of that door. What do you do?",
      choices: [
        { id: 'freeze', label: "Freeze — not a word, not a breath.", tone: 'disarm', to: 'n1_freeze' },
        { id: 'cover', label: "Cover it — loud and casual: 'Same time next week, then, Mr. Moretti.'", tone: 'press', to: 'n1_cover' },
        { id: 'rush', label: "Rush the door — better to know who's listening than wonder.", tone: 'push', to: 'n1_rush' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'n1_freeze',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WARY, text: "You hold dead still. Sal does too, eyes locked on the door, both of you caught mid-confession. A long second. Then the boots move on — a dockhand, maybe, or someone who didn't want to be caught listening either." },
      ],
      ask: "The moment's still yours, if you take it now. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him a way to make it right — 'Then help me. For him.'", tone: 'disarm', to: 'o_mole' },
        { id: 'twist', label: "Twist the knife — 'Good. Then you owe him. And me. The ledger.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: CALLBLUFF, text: "(loud, easy, like it's nothing) Same time next week, then, Mr. Moretti." },
        { who: 'you', caption: true, art: CALLBLUFF, text: "The boots hesitate — then move on, unconvinced or uninterested, you'll never know which. Sal's still staring at you like you just walked a wire he didn't know was there." },
      ],
      ask: "You bought the room back. He's still guilty, still open — what do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him a way to make it right — 'Then help me. For him.'", tone: 'disarm', to: 'o_mole' },
        { id: 'twist', label: "Twist the knife — 'Good. Then you owe him. And me. The ledger.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_rush',
      mood: 'threat',
      beats: [
        { who: 'you', art: DOORWAY, text: "You're at the door before Sal can grab your arm, wrenching it open —" },
        { who: 'you', caption: true, art: DOORWAY, text: "Empty dock. Wet cobblestones, a mooring rope ticking against a bollard in the wind. Whoever it was is already gone, or was never anyone at all. Sal's face has gone the colour of the ledger paper." },
      ],
      ask: "Nothing there — or nothing you could catch. Sal's rattled worse than before. What do you do with the moment?",
      choices: [
        { id: 'absolve', label: "Offer him a way to make it right — 'Then help me. For him.'", tone: 'disarm', to: 'o_mole' },
        { id: 'twist', label: "Twist the knife — 'Good. Then you owe him. And me. The ledger.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(stung, the softness closing over) …So that's it. You're just another one who came to take something. Same as the rest of them." },
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
        { who: 'them', art: SINK, text: '(lowers back into the chair, slowly) …The same man. You mean Ricci.' },
        { who: 'you', art: SINK, text: "I mean Marlowe. Ricci's just the hand. You keep the book that proves Ricci's been skimming the boss for years. When that surfaces, you're a witness — or a loose end." },
        { who: 'them', art: BITTER, text: "(a short, bitter laugh) You think I don't know what I'm sitting on? I've had that ledger memorized a year. And I've done nothing — because doing something is how men like me end up face-down in the harbor." },
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
        { who: 'them', art: DOUBT, text: '(studies you a long moment) And why would a kid with nothing be able to promise me anything?' },
        { who: 'you', art: DOUBT, text: 'Because I want Ricci gone more than I want to keep breathing. That makes me the only honest man you\'ve talked to all year.' },
        { who: 'them', art: SMILE, text: '(something almost like a smile) …God help me. I believe you.' },
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
        { who: 'them', art: FEAR2, text: "(pales) You think I haven't lain awake on that exact thought? Every night?" },
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
        { who: 'them', art: SCREAM, text: "(voice climbing) I'll scream. Ricci's men are one dock over — I scream, it's you they pull out of the water." },
        { who: 'you', art: CALLBLUFF, text: "(quiet) Go on, then. Scream. And afterward explain to Ricci why a stranger walked straight to his bookkeeper — first door, no wrong turns." },
        { who: 'them', art: CHOKE, text: '(the words die in his throat)' },
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
        { who: 'them', art: LEDGER, text: '(hands shaking, he shoves the second ledger across the desk) Take it. Take it and I never saw your face.' },
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
        { who: 'you', caption: true, art: CASHDROP, text: 'You set a roll of cash on the closed ledger. It sits there between you.' },
        { who: 'them', art: CASHSTARE, text: "(stares at it, doesn't touch it) …Money. You came to Ricci's bookkeeper and you brought money." },
        { who: 'you', art: CASHSTARE, text: "Everyone's got a price." },
        { who: 'them', art: DROWN, text: "(a tired laugh) Not everyone. Some of us are just trying not to drown. You think cash fixes drowning?" },
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
      portrait: MOLE,
      outcome: {
        key: 'mole', tone: 'good',
        title: 'SAL — YOUR MAN INSIDE',
        line: 'He unlocks a drawer and slides you the second ledger — and under it, an older, worn book. "Your father\'s real accounts. The honest ones. I couldn\'t bring myself to burn them. Seven years, it\'s the only thing I had that said he didn\'t do it." Then, quiet: "For Tomas. And for me."',
        ripple: "Sal feeds you what Ricci knows before you ever sit down — Ricci walks in blind. And you finally hold proof your father was clean.",
        reflect: "For once, this felt like the opposite of what Ricci does. I want to hold onto that. I don't know how many more nights I get to.",
        heatDelta: -1,
        grants: ['skim', 'salMole'],
        dispositions: [{ nodeId: 'sal', set: 4 }],
        campaign: { bonds: [{ id: 'sal', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['sal_mole'] },
        debrief: { principle: 'interests-not-positions',
          note: "Sal's first words were 'get out' — but that was never what he wanted. Under it he wanted to stop carrying your father up those stairs. You read the need beneath the demand and traded to it, and it cost you nothing." },
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      portrait: SCARED,
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'SAL — A LOOSE END',
        line: "You walk out with the skim. But you leave Sal grey and sweating, eyes fixed on the door. You got the book. You didn't get the man.",
        ripple: 'If Ricci catches him shaking like that, he\'ll know someone got to him. Ricci may sit down forewarned.',
        reflect: "I got what I came for and left a good man shaking at his own desk. My father knew that feeling — from the wrong side of it.",
        grants: ['skim', 'salScared'],
        worldFlags: ['ricciForewarned'],
        dispositions: [{ nodeId: 'sal', set: 2 }],
        campaign: { bonds: [{ id: 'sal', delta: -1 }], ledger: ['sal_scared'] },
        debrief: { principle: 'golden-bridge',
          note: "You took the book but left him no way out — no safety, no dignity, just fear. A cornered man with no bridge to retreat across is a man who panics later. Win the deal, but always leave the loser a road." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'SAL — BOUGHT, NOT TURNED',
        line: 'He counts the roll twice, then hands over the ledger. Cold, transactional, nothing behind the eyes. A man who sells once sells again.',
        ripple: 'You have the skim — but a man you bought can be bought back. Watch your back at the table.',
        reflect: "Marlowe buys people and calls it business. Tonight, so did I.",
        grants: ['skim', 'salBought'],
        worldFlags: ['salBought'],
        dispositions: [{ nodeId: 'sal', set: 3 }],
        campaign: { money: -200, bonds: [{ id: 'sal', delta: -1 }], ledger: ['sal_bought'] },
        debrief: { principle: 'interests-not-positions',
          note: "The cash 'worked' — but you paid for a position he never truly held. His interest was staying alive, not getting rich; money answered the wrong question. A man bought instead of turned stays for sale to the next bidder." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'SAL — BURNED',
        line: 'He goes white and silent and won\'t look at you. You know the look — the second you\'re gone, he\'s running to Ricci to save his own skin.',
        ripple: "No skim. Ricci hears someone's circling his people — and hardens against you.",
        reflect: "He'll run to Ricci and probably end up in the water. A year ago that would have kept me awake. Tonight I'm already three moves ahead.",
        heatDelta: 3,
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'sal', set: 0 }],
        campaign: { bonds: [{ id: 'sal', delta: -2 }], faction: { id: 'docks', delta: -1 }, ledger: ['sal_burned'] },
        debrief: { principle: 'types-and-tells',
          note: "You leaned on a frightened man as if he were a proud one. Fear doesn't buckle under force — it bolts. Reading his type wrong meant reaching for the one lever guaranteed to backfire." },
      },
    },
  ],
};
