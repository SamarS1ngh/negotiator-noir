import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → the tell → the read forks →
// the interruption → each ending its own image + mood).
const BASE = 'assets/art/scene/gallo.jpg';                  // wide: the empty vestry, one candle, the poor box
const COUNTING = 'assets/art/scene/gallo_counting.jpg';     // Gallo alone, counting coins, murmuring names
const LOOK = 'assets/art/scene/gallo_look.jpg';             // looks up, unstartled — "the door's never locked"
const ENTER = 'assets/art/scene/gallo_enter.jpg';           // your silhouette in the vestry doorway
const FLINCH = 'assets/art/scene/gallo_flinch.jpg';         // the tell: thumb on the rosary, "isn't supposed to exist"
const OFFER = 'assets/art/scene/gallo_offer.jpg';           // your honest plea, hands open, no threat in it
const TEST = 'assets/art/scene/gallo_test.jpg';             // he studies you, softening, still testing
const NAME = 'assets/art/scene/gallo_name.jpg';             // "Vidal" lands — he crosses himself
const LEAN2 = 'assets/art/scene/gallo_lean.jpg';            // you press quietly for the rest of it
const REMEMBER = 'assets/art/scene/gallo_remember.jpg';     // recalling your father's last, unconfessed visit
const STUNG = 'assets/art/scene/gallo_stung.jpg';           // the grief shutters into hurt — you twisted it
const EXPOSE = 'assets/art/scene/gallo_expose.jpg';         // draws up, offended — the size of him under the collar
const COLD = 'assets/art/scene/gallo_cold.jpg';             // the tired, grudging recovery after an apology
const BUY = 'assets/art/scene/gallo_buy.jpg';               // you set the money on the desk between the coins
const REFUSE = 'assets/art/scene/gallo_refuse.jpg';         // sorrow, not anger — he pushes the money back
const RELENT = 'assets/art/scene/gallo_relent.jpg';         // the sadness eases, just barely, after you pocket it
const INTERRUPT = 'assets/art/scene/gallo_interrupt.jpg';   // the vestry door bangs open — Mrs. Costa, breathless
const PLEA = 'assets/art/scene/gallo_plea.jpg';             // torn, he turns back and names his price
const THREAD_END = 'assets/art/scene/gallo_thread_end.jpg'; // he presses the black book into your hands
const LEDGER_END = 'assets/art/scene/gallo_ledger_end.jpg'; // a folded page, handed over, eyes elsewhere
const SHUT_END = 'assets/art/scene/gallo_shut_end.jpg';     // the strongbox closes, the door shuts like a verdict

// FATHER GALLO — the dockside priest who launders small money for the poor and
// the mob alike, and hears every confession on the waterfront. He isn't scared of
// threats and he isn't tempted by cash — a man who trades in mercy for a living
// has already priced both and found them cheap. The READ is that he only opens
// for the same currency he deals in: a real kindness, a shared truth, grief paid
// honestly instead of used as a lever. Two doors reach the same hinge — meet him
// plain (mercy), or say your father's name and let his own guilt do the work.
// Either way, the true test isn't a question at all: it's Mrs. Costa's knock,
// mid-conversation, asking him for exactly the kind of mercy he's known for — and
// asking you whether you'll spend a minute of your own errand on a woman who can
// never pay you back. Three endings:
//   THREAD — you pay the mercy forward; he opens the real ledger of phantom cash
//   LEDGER — you get a thread, but cold, transactional, a source and not a friend
//   SHUT   — you reach for a threat or a price with a man who deals in neither
// Palette 'gallo' lights the vestry in warm votive-candle amber, guttering low
// against the dark; each beat's mood re-grades the flame as the scene turns.
export const GALLO_MISSION: Mission = {
  id: 'gallo_mission',
  actionId: 'gallo_turn',
  nodeId: 'gallo',
  label: 'Work the fence',
  palette: 'gallo',
  scene: 'assets/art/scene/gallo.jpg',
  teaches: ['follow-the-money', 'reciprocity'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BASE, text: "Everyone on the waterfront confesses to Father Gallo eventually — the sin, or the money, or both. He hears grief on Sunday and moves cash on Monday: a widow's insurance kept quiet from the loan sharks, a hurt man's doctor bill scrubbed clean of his name. And, quieter still, a few of Marlowe's own dollars, laundered through the collection plate like anybody else's guilt. If money can vanish through this port and never leave a mark, it passed through his hands first." },
        { who: 'you', caption: true, art: COUNTING, text: "My father's ledger has a hole in it — three years of cash that never once matched a crate that crossed this dock. Numbers that don't move like cargo moves. If any man in this parish knows where phantom money actually goes, it's the priest who launders it." },
        { who: 'them', art: LOOK, text: "(doesn't look up from the coins, thumb still counting) The door's never locked, my son. Only the desperate call at this hour — the desperate, or the dangerous. Which are you." },
        { who: 'you', art: ENTER, text: "Neither, Father. I need to know where money goes when it isn't supposed to exist at all." },
        { who: 'them', art: FLINCH, text: "(his hand finds the rosary at his belt without seeming to notice, thumb worrying one bead) 'Isn't supposed to exist.' That's a strange way to describe a sin. Most men just say 'stolen.' Sit. Tell me why a stranger walks into an empty church past midnight to ask an old priest about ghosts." },
      ],
      ask: "He didn't so much as blink at 'money' — priests hear about money every day. He flinched at 'isn't supposed to exist,' like it already named something he carries. What is he protecting, and how do you open him?",
      choices: [
        { id: 'mercy', label: "Read him plain — he hides whatever this is with mercy, not greed. Meet him with your own truth, not a demand.", tone: 'disarm', to: 'r_mercy' },
        { id: 'name', label: "Skip the puzzle. Say the name that might already be a stone in his shoe — 'My father was Tomas Vidal.'", tone: 'push', to: 'r_name' },
        { id: 'expose', label: "He's a fence in a collar and nothing more — corner him on what he skims off the plate.", tone: 'press', to: 'x_expose' },
        { id: 'buy', label: 'Every man of God has a number under the vestments somewhere. Find it.', tone: 'bribe', to: 'x_buy' },
      ],
    },

    // --- the mercy read: he tests your sincerity before he'll step on it ---
    {
      id: 'r_mercy',
      mood: 'guilt',
      beats: [
        { who: 'you', art: OFFER, text: "I'm not here to expose you, Father. I'm here because my father's ledger has money in it that shouldn't exist, and everyone who could explain it is dead, or lying, or both. I don't know how to ask you plainly except to say — I'm out of my depth, and I don't know who else to trust with this." },
        { who: 'them', art: TEST, text: "(sets the coins down at last, studies you a long moment) You're the first one through that door in a year who told me the truth before I had to drag it out of him with a stole around his neck. That's either very foolish of you, son, or the only honest thing I've heard all week. So tell me — why should an old priest hand a stranger the one thing that could hang half this parish?" },
      ],
      ask: "He's softening, but he's still testing the ground before he'll step on it. Reassure him and let him take his time, or press him now, sensing you're close?",
      choices: [
        { id: 'reassure', label: "Take your time, Father. I'm not going anywhere, and I'm not owed anything.", tone: 'disarm', to: 'turn' },
        { id: 'hurry', label: "There isn't time for that. I need it tonight.", tone: 'push', to: 'o_ledger' },
      ],
    },

    // --- the name: your father's guilt, wide open ---
    {
      id: 'r_name',
      mood: 'guilt',
      beats: [
        { who: 'them', art: NAME, text: "(the name lands like a dropped plate — he crosses himself, slow) …Vidal. God forgive me, I've buried men on this waterfront and never once had to lie about who they were. Yours, I lied for. Twice a year somebody still asks after the debtor Tomas Vidal, and twice a year I let them believe it." },
        { who: 'you', art: LEAN2, text: 'You knew him. Tell me the rest of it.' },
        { who: 'them', art: REMEMBER, text: "He came to me the week before he died. Not for confession — for advice, if you can believe an honest man asking a priest for advice on numbers. He said somebody was hiding money that never matched a single crate he'd ever loaded, and he didn't know a soul he could tell that wouldn't get him killed for the asking." },
      ],
      ask: "He's just handed you your father's last untold week, wide open with his own guilt. Use it to bond with him, or press the advantage while it's raw?",
      choices: [
        { id: 'bond', label: "Then help me finish what he started. Not because you owe him — because it's still true.", tone: 'disarm', to: 'turn' },
        { id: 'leverage', label: "Then you owe him. And you owe me. Give me what you gave him — but this time, with the answer.", tone: 'push', to: 'x_twist' },
      ],
    },
    {
      id: 'x_twist',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: '(the grief in his eyes shutters closed, replaced by something harder) …So that\'s what a dead man\'s name is worth to you. A key, not a memory.' },
      ],
      ask: "You turned his grief into a debt. He'll still help — a priest doesn't turn away a son entirely — but you're losing the man to get the ledger. Ease off, or take it anyway?",
      choices: [
        { id: 'ease', label: "No — you're right. I'm sorry. Help me because it's true, not because I made you.", tone: 'disarm', to: 'turn' },
        { id: 'take', label: "Just the ledger, Father. I don't need your blessing with it.", tone: 'push', to: 'o_ledger' },
      ],
    },

    // --- expose: he draws up, insulted, the size of him showing ---
    {
      id: 'x_expose',
      mood: 'cold',
      beats: [
        { who: 'them', art: EXPOSE, text: '(sets down the coins; for the first time you see the size of the man under the cassock) You think this collar is cover for a bookkeeper\'s greed. Go home, whoever you are. Confession is for sinners honest about their own sin — not for strangers hunting mine.' },
      ],
      ask: "You've insulted the one thing he has left besides God — his own integrity. Walk it back, or press harder?",
      choices: [
        { id: 'apologize', label: "You're right, that was wrong of me. I'm not here to accuse you of anything.", tone: 'disarm', to: 'x_recover' },
        { id: 'press', label: "Don't play wounded with me, Father. Everyone on this dock knows what that poor box really holds.", tone: 'press', to: 'o_shut' },
      ],
    },
    {
      id: 'x_recover',
      mood: 'cold',
      beats: [
        { who: 'them', art: COLD, text: "(a long look, then a tired exhale, some of the size going out of him again) …Everyone who walks through that door wants something, son. At least you had the decency to be ashamed of wanting it. That's what I give a stranger. Don't come back asking for what I'd give a friend." },
      ],
      ask: "He's relented, grudgingly — a cold thread, not the whole truth. Take what's offered, or reach for more while he's still soft?",
      choices: [
        { id: 'accept', label: "That's fair, Father. Thank you.", tone: 'disarm', to: 'o_ledger' },
        { id: 'pressmore', label: "It's a start. Now give me the rest.", tone: 'push', to: 'o_shut' },
      ],
    },

    // --- buy: money wounds him, doesn't tempt him ---
    {
      id: 'x_buy',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BUY, text: 'You set a fold of bills on the desk, between the coins he was counting for people poorer than either of you.' },
        { who: 'them', art: REFUSE, text: "(doesn't touch it — something sadder than anger in his face) You think the poor box needs padding from a guilty stranger's hand. Take it back, before you make me say something unkind about the man who raised you." },
      ],
      ask: "The money didn't tempt him — it wounded him. Read that right before you compound it. Pull it back and try honesty, or push more?",
      choices: [
        { id: 'pocket', label: "You're right. Forget the money — I don't know how else to ask, except honestly.", tone: 'disarm', to: 'x_recover2' },
        { id: 'double', label: "Everyone's got a number, Father. Name yours.", tone: 'bribe', to: 'o_shut' },
      ],
    },
    {
      id: 'x_recover2',
      mood: 'cold',
      beats: [
        { who: 'them', art: RELENT, text: "(the sadness eases, just barely) …Better. Still wrong to open with, but better. (he studies you a moment longer, then reaches for a folded paper rather than the deeper truth) I'll give you a thread, not the loom." },
      ],
      ask: "A cold concession, not a confession. Take the thread with grace, or push for the loom while he's still off balance?",
      choices: [
        { id: 'grateful', label: "A thread is more than I had an hour ago. Thank you, Father.", tone: 'disarm', to: 'o_ledger' },
        { id: 'pushmore', label: "The thread's not enough. Give me the rest.", tone: 'bribe', to: 'o_shut' },
      ],
    },

    // --- the complication: the actual test, dressed as an interruption ---
    {
      id: 'turn',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: INTERRUPT, text: "A knock — twice — and the vestry door bangs open before either of you can answer. A woman pushes in, coat still dripping, breath tearing: \"Father — Father, please, it's Beppe, they worked him over on the Kestrel dock, he can't go to a doctor with his name on it, they'll know he's still short, please—\"" },
        { who: 'them', art: PLEA, text: "(already half-risen, then he stops, and turns back to you, torn but resolved) I will tell you everything I know about where that money swims — every dollar, every name I've laundered it for. But first. Help me help her. That's the price, if you want to call it one. Not silver. Just mercy — paid forward, for once, instead of back." },
      ],
      ask: "This isn't a delay dressed as an interruption — it's the actual test. A real cost, right now, before you get anything you came for. What do you do?",
      choices: [
        { id: 'help', label: "Whatever she needs. Go, Father — I'll wait, and I'll help however I can.", tone: 'disarm', to: 'o_thread' },
        { id: 'impatient', label: "She can wait five minutes. I need this settled first.", tone: 'push', to: 'o_ledger' },
      ],
    },

    // --- endings ---
    {
      id: 'o_thread',
      mood: 'warm',
      portrait: THREAD_END,
      outcome: {
        key: 'thread', tone: 'good',
        title: 'FATHER GALLO — THE FIRST THREAD',
        line: 'He sends Mrs. Costa off with a folded bill and a whispered blessing, her husband\'s doctor bill about to vanish into the parish accounts like a hundred others before it. Only then does he unlock the strongbox behind the crucifix and lift out a slim black book of his own — names, dates, sums with no cargo behind them. "Three years of money that came from nowhere and went nowhere, laundered through half the honest businesses on this waterfront. I never asked whose it really was. Tonight, God help me, I\'m asking." He presses it into your hands.',
        ripple: "You're holding the first real thread of the phantom cash — where it enters clean, and through whom. It doesn't say who's upriver yet. But it says the money is real, and it's still moving.",
        reflect: "He didn't ask what I'd give him. He asked what I'd give someone who could never pay me back at all. My father would have understood that math better than I do.",
        grants: ['moneyTrail', 'gallo_turned'],
        dispositions: [{ nodeId: 'gallo', set: 4 }],
        campaign: { bonds: [{ id: 'gallo', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['gallo_turned'] },
        debrief: { principle: 'reciprocity',
          note: "You didn't wait for Gallo to do you a mercy so you could collect on it later — you did the mercy first, for a woman who could never repay you, in front of the one man whose whole life is built on doing exactly that. **Reciprocity** doesn't only run backward, owed for a favour received. Offer it first, freely, with nothing asked in return, and the debt runs the other way." },
      },
    },
    {
      id: 'o_ledger',
      mood: 'cold',
      portrait: LEDGER_END,
      outcome: {
        key: 'ledger', tone: 'mixed',
        title: 'FATHER GALLO — A COLD LEDGER',
        line: "He deals with Mrs. Costa quickly, almost coldly, and comes back to find you still waiting like a debt collector at the rail. He gives you what he owes you — a folded page, a handful of names, sums that don't match any cargo — but he won't meet your eyes doing it. \"There. The thread you wanted. I hope it was worth making a frightened woman wait on a man who could afford to.\"",
        ripple: "You have the first thread of the phantom cash — real names, real sums. But Gallo will talk to you again only as a source, never as a friend. Whatever else he knows, he'll make you work for every inch of it.",
        reflect: "I got the paper. I didn't get the priest. There's a version of my father who'd have told me that's the same as losing.",
        grants: ['moneyTrailPartial'],
        dispositions: [{ nodeId: 'gallo', set: 2 }],
        campaign: { bonds: [{ id: 'gallo', delta: 0 }], ledger: ['gallo_wary'] },
        debrief: { principle: 'follow-the-money',
          note: "Look past the guilt on his face and read the page itself. The money enters through the poor box — that's **placement**. It gets spread thin across a dozen honest parish accounts so no single sum ever looks wrong — that's **layering**. It comes out the other side as rent, medicine, and mercy: clean. You've got the placement and the layering. You still don't have who it serves at the top — that last stage is **integration**, and it's upriver of a priest's collection plate." },
      },
    },
    {
      id: 'o_shut',
      mood: 'threat',
      portrait: SHUT_END,
      outcome: {
        key: 'shut', tone: 'bad',
        title: 'FATHER GALLO — THE DOOR CLOSES',
        line: "He doesn't raise his voice. He doesn't have to. He closes the strongbox, pockets the key, and stands — a big man, you realize, under all that black wool. \"Get out of my church. And if I hear you've gone asking the same ugly question of anyone else wearing a collar on this waterfront, I'll make sure Marlowe's people hear exactly where you got the idea.\" The door shuts behind you like a verdict.",
        ripple: "No thread, no ledger, nothing. Worse — a priest who launders for half the waterfront now has a reason to talk about you to whoever pays best. Word travels fast through a confessional.",
        reflect: "I came to a man whose whole life is mercy and offered him a threat instead. My father never once mistook a scared man for a soft one. Tonight, I did.",
        heatDelta: 2,
        dispositions: [{ nodeId: 'gallo', set: 0 }],
        campaign: { bonds: [{ id: 'gallo', delta: -2 }], faction: { id: 'docks', delta: -1 } },
        debrief: { principle: 'reciprocity',
          note: "**Reciprocity** runs on what you give first, not on what you take. You reached for a threat and a price with a man who deals in neither, and a man who trades in mercy has nothing to trade with a threat — except silence, or worse. You never put a gift on the table. Nothing was ever going to come back." },
      },
    },
  ],
};
