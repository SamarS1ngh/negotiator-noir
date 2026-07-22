import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene swaps
// with every line (webtoon pacing). The woven-read and complication beats below
// reuse these same panels for new moments (dense reuse), with one new panel for
// the complication (referenced, not yet generated — see scripts/gen_adler.sh).
const ESTABLISH = 'assets/art/scene/adler_establish.jpg'; // wide: the ledger-walled office, three locks
const LOCKED = 'assets/art/scene/adler_locked.jpg';       // pen still moving, "the door was locked"
const PENSTOP = 'assets/art/scene/adler_penstop.jpg';     // the pen stops dead — "auditing"
const LEAN = 'assets/art/scene/adler_lean.jpg';           // you lean in, riding the fear
const QUIETNO = 'assets/art/scene/adler_quietno.jpg';     // "…No. I don't." — whispered denial
const FLINCH = 'assets/art/scene/adler_flinch.jpg';       // flinches like struck — "immaculate"
const LIES = 'assets/art/scene/adler_lies.jpg';           // you press — "immaculate lies"
const TRUESET = 'assets/art/scene/adler_trueset.jpg';     // trembling hands, the confession
const BOOKS = 'assets/art/scene/adler_books.jpg';         // the floor safe, steady hands at last
const SCARED_END = 'assets/art/scene/adler_scared_end.jpg'; // grey, sweating, watching the door
const BOLTS_END = 'assets/art/scene/adler_bolts.jpg';     // chair toppling, he runs
const CHECKIN = 'assets/art/scene/adler_checkin.jpg';     // NEW: the complication — frozen at the half-open safe, three knocks

// ADLER — Marlowe's accountant. Fastidious, precise, and trapped: he keeps the
// real books, which means he knows exactly how much rope Marlowe has, and that
// he'll never be allowed to leave a man who knows that much. His crack isn't
// greed — it's that every number he's falsified offends the one thing he still
// has, his precision. Three endings:
//   BOOKS   — he hands you the true ledger (hard evidence: 'booksExposed')
//   SCARED  — you get the books, but leave a wreck who may bolt to Marlowe
//   BOLTS   — you spook him wrong; he runs to Marlowe, who's forewarned
// THE WOVEN READ: before you say a word past his rebuff, you judge what's really
// outweighing what in him — terror of the coming reckoning, ten years of
// loyalty, or a guilty hand in the till. The true read (terror finally outweighs
// loyalty — a man hunting for permission to save himself) opens straight into
// the strong approaches. The wrong reads still reach every approach, but cost
// you a fumbled beat first — he rebuffs the flattery, or corrects you cold on
// the accusation — before you recover into the same fear/order/threat fork.
// THE COMPLICATION: on the path where he's actually agreed to open the safe,
// one of Marlowe's men makes his nightly check at the door — three knocks,
// mid-unlock — and how you handle those five seconds decides whether the good
// ending survives contact with the house's own routine, or curdles into the
// shaken one.
export const ADLER_MISSION: Mission = {
  id: 'adler_mission',
  actionId: 'adler_turn',
  nodeId: 'adler',
  label: 'Work the money man',
  palette: 'sal',
  scene: 'assets/art/scene/adler.jpg',
  teaches: ['follow-the-money', 'loss-aversion', 'foot-in-the-door', 'information-asymmetry'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: "Adler works late in a back office that smells of ink and fear, three locks on the door. He keeps two sets of books: the ones Marlowe shows, and the ones that are true. He's the second most dangerous man in the house, and the most afraid." },
        { who: 'them', art: LOCKED, text: "(not looking up, pen still moving) The door was locked. It's always locked. Whatever you are, I've balanced worse than you before midnight. State your business and leave me my evening." },
      ],
      ask: "A precise, frightened man behind three locks, two sets of books, a pen that won't land a full line. Before you say a word — what's actually true about him?",
      choices: [
        { id: 'read_scared', label: "Terror's finally bigger than loyalty. Ten years of fear has outrun whatever he owes Marlowe — he's not guarding secrets anymore, he's hunting for a reason to save himself.", tone: 'disarm', to: 'r_scared' },
        { id: 'read_loyal', label: "A true believer. Ten years keeping the real books without a slip isn't fear — it's devotion, and devotion doesn't turn.", tone: 'press', to: 'r_loyal' },
        { id: 'read_greedy', label: "A thief covering a thief. Whatever's rattling him, it's his own hand in the till, not Marlowe's.", tone: 'bribe', to: 'r_greedy' },
      ],
    },

    // --- THE WOVEN READ: what you decide is really eating him, before he's said another word ---
    {
      id: 'r_scared',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: LOCKED, text: "He hasn't looked up once, but the pen never lands a full line, and his eyes keep flicking to the floor safe like it's a wound. A man guarding a secret watches the door. A man who's already lost the argument with himself watches the exit. Adler's watching the exit." },
      ],
      ask: "He's not defending Marlowe anymore. He's defending himself, and looking for someone to hand him permission. How do you open that door?",
      choices: [
        { id: 'fear', label: "His fear — 'Marlowe's auditing his own people. A man who knows the true numbers doesn't retire. He disappears.'", tone: 'press', to: 'n_fear' },
        { id: 'order', label: "His precision — 'Every number he's made you lie about is a stain on the only clean thing you have left. Your work.'", tone: 'disarm', to: 'n_order' },
        { id: 'threat', label: "Lean on him — 'Give me the real books or I tell Marlowe you offered them.'", tone: 'push', to: 'o_bolts' },
      ],
    },
    {
      id: 'r_loyal',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: LOCKED, text: "You read loyalty in a man who hasn't let his hands shake once since you walked in. So you open with respect — the years, the discretion, the trust a man like Marlowe doesn't hand out twice. It lands wrong." },
        { who: 'them', art: LOCKED, text: "(dry, almost amused, pen still moving) Flattery. From a stranger who broke into my evening. Whatever you're selling, save it — loyalty's not a lever anyone's found on me yet." },
      ],
      ask: "Wrong door, and now he's had a second to decide you're harmless. Recover, and quicker this time — what's actually eating him?",
      choices: [
        { id: 'fear', label: "Drop the flattery, go straight for the fear — 'Marlowe's auditing his own people. A man who knows the true numbers doesn't retire.'", tone: 'press', to: 'n_fear' },
        { id: 'order', label: "Needle the one thing loyalty can't cover — 'Every number he's made you falsify is a stain on the only clean thing you have left.'", tone: 'disarm', to: 'n_order' },
        { id: 'threat', label: "Cut your losses — 'Give me the real books or I tell Marlowe you offered them.'", tone: 'push', to: 'o_bolts' },
      ],
    },
    {
      id: 'r_greedy',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: FLINCH, text: "You open on his own hand in the till — call him a thief covering a theft. He flinches, but it isn't guilt on his face." },
        { who: 'them', art: FLINCH, text: "(cold, precise) I have never skimmed a dollar that wasn't Marlowe's to skim, on his own order. You want to accuse me of something, accuse me of the right thing." },
      ],
      ask: "Not greed. You've called a frightened, exacting man a common thief, and he's furious you got it wrong. What's the real nerve?",
      choices: [
        { id: 'fear', label: "Try the fear under the insult — 'Fine — it's not the till. It's Marlowe auditing his own people, and a man who knows the true numbers doesn't retire.'", tone: 'press', to: 'n_fear' },
        { id: 'order', label: "Try the precision he just defended so hard — 'You're right, it's not theft. It's every number he's made you falsify — a stain on the one clean thing you have left.'", tone: 'disarm', to: 'n_order' },
        { id: 'threat', label: "Push past the insult — 'Then prove it. Give me the real books, or I tell Marlowe you offered them.'", tone: 'push', to: 'o_bolts' },
      ],
    },

    {
      id: 'n_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: PENSTOP, text: "(the pen stops) …Auditing. You've heard that. Where. From whom." },
        { who: 'you', art: LEAN, text: "Doesn't matter where. What matters is the man who knows where all the money's buried is always the first shovelful. You've known that for years. It's why you don't sleep." },
        { who: 'them', art: QUIETNO, text: "(very quietly) …No. I don't." },
      ],
      ask: "He's terrified — the fear he's carried for years, said out loud. Offer him a way out, or ride it?",
      choices: [
        { id: 'protect', label: "A way out — 'Hand me the true books and I make sure you're gone before he moves.'", tone: 'disarm', to: 'x_check' },
        { id: 'ride', label: "Ride the fear — 'Give them to me now, or I let him hear you hesitated.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'n_order',
      mood: 'guilt',
      beats: [
        { who: 'them', art: FLINCH, text: "(a flinch, like you struck him) …My work is immaculate. Every entry. Every reconciliation." },
        { who: 'you', art: LIES, text: "Immaculate lies. You, of all men, know what an honest ledger looks like. And you haven't kept one in years." },
        { who: 'them', art: TRUESET, text: "(hands flat on the desk, trembling) …There is a true set. There has always been a true set. I couldn't— a man has to keep one honest thing." },
      ],
      ask: "You've touched the one clean nerve he has left. This is the moment — how do you close it?",
      choices: [
        { id: 'give', label: "Let him make it right — 'Then let the honest set be the one that matters. Hand it to me.'", tone: 'disarm', to: 'x_check' },
        { id: 'seize', label: "Take it hard — 'Good. The true books. Now, before you talk yourself out of it.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- THE COMPLICATION: the scene turns before the safe finishes opening ---
    {
      id: 'x_check',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: CHECKIN, text: "He's on his knees at the floor safe, the dial half-turned, when three slow knocks land on the door behind you — unhurried, routine. A voice through the wood: \"Adler. Still at it?\" One of Marlowe's men, making his nightly round." },
        { who: 'them', art: CHECKIN, text: "(frozen, hand still on the dial, eyes white-rimmed) He does this every night. Same three knocks. If I don't answer in the next five seconds, he opens it himself." },
      ],
      ask: "Five seconds. The safe's half open, you're standing in a room you were never in, and a made man is waiting on an answer.",
      choices: [
        { id: 'coach', label: "Steady him, fast and low — 'Answer natural. I'm a runner, here about a shipment. Then finish what you started.'", tone: 'disarm', to: 'o_books' },
        { id: 'freeze', label: "Go still and silent — let Adler carry it alone, whatever he says.", tone: 'press', to: 'o_scared' },
        { id: 'rush', label: "Push him — 'Ignore it. Give me the books now, we're gone before he tries the handle.'", tone: 'push', to: 'o_scared' },
      ],
    },

    {
      id: 'o_books',
      mood: 'hope',
      portrait: BOOKS,
      outcome: {
        key: 'books', tone: 'good',
        title: 'ADLER — THE TRUE BOOKS',
        line: "He unlocks a floor safe and lifts out a plain ledger, heavier than it looks. \"Every dollar he's laundered. Every man he's paid to bury a thing. Ten years of the truth.\" His hands are steady for the first time all night. \"Keep it honest. Please.\"",
        ripple: "You hold the true books — hard proof of every crime that built Marlowe's empire. Paper the man can't buy or frighten his way out of.",
        reflect: "He kept one honest thing through ten years of lies, and I talked him out of it in ten minutes. For the right reasons. That's what I'll tell myself.",
        grants: ['booksExposed'],
        dispositions: [{ nodeId: 'adler', set: 4 }],
        campaign: { bonds: [{ id: 'adler', delta: 2 }], faction: { id: 'house', delta: 1 }, ledger: ['adler_turned'] },
        debrief: { principle: 'follow-the-money',
          note: "Adler didn't hand you a confession — he handed you the **cash flow** itself. Placement, layering, integration: ten years of Marlowe's money being made to look clean, undone in one plain ledger. Chase the wash, not the man, and you own the whole machine, not just one frightened bookkeeper." },
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      portrait: SCARED_END,
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'ADLER — A SHAKING WITNESS',
        line: "He gives you the true books — but he's grey and sweating, and he flinches at the door twice before you've left. You have the paper. You do not have the man's nerve.",
        ripple: "You hold the true books. But Adler is a wreck; if Marlowe's people see him like this, Marlowe learns his money man broke. He may sit down forewarned.",
        reflect: "I got the paper and left a careful man in pieces. He'll jump at shadows now, and one of those shadows will be Marlowe's.",
        grants: ['booksExposed'],
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'adler', set: 2 }],
        campaign: { bonds: [{ id: 'adler', delta: -1 }], ledger: ['adler_scared'] },
        debrief: { principle: 'information-asymmetry',
          note: "You walked in holding the edge — you knew what he kept; he didn't know how much you knew. You walk out having spent it: a man shaking that badly is a **leak**, and the second Marlowe's people read his face, your advantage becomes his warning. Control the leak, control the room — you didn't." },
      },
    },
    {
      id: 'o_bolts',
      mood: 'threat',
      portrait: BOLTS_END,
      outcome: {
        key: 'bolts', tone: 'bad',
        title: 'ADLER — HE RUNS',
        line: "He goes white and shoves back from the desk. \"No. No — I balance the books, I don't— get out.\" The locks are for keeping people out. Tonight they're to give him time to get to Marlowe first.",
        ripple: "No books. Adler runs straight to Marlowe: someone tried to turn the accountant. Marlowe tightens the house and waits — forewarned.",
        reflect: "I frightened a frightened man and he ran to the one place that felt safe: his master. I should have known. Fear doesn't turn a man. It sends him home.",
        heatDelta: 3,
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'adler', set: 1 }],
        campaign: { bonds: [{ id: 'adler', delta: -2 }], faction: { id: 'house', delta: -1 }, ledger: ['adler_bolted'] },
        debrief: { principle: 'foot-in-the-door',
          note: "You asked a terrified man for everything, cold, with nothing banked between you first — no small yes to build on, no trust laid down before the big one. **Foot-in-the-door** works because a small commitment reshapes how a man sees himself before the large ask lands. Skip straight to the biggest ask there is, and a frightened man doesn't negotiate. He runs." },
      },
    },
  ],
};
