import type { Mission } from '../domain/mission';

// ADLER — Marlowe's accountant. Fastidious, precise, and trapped: he keeps the
// real books, which means he knows exactly how much rope Marlowe has, and that
// he'll never be allowed to leave a man who knows that much. His crack isn't
// greed — it's that every number he's falsified offends the one thing he still
// has, his precision. Three endings:
//   BOOKS   — he hands you the true ledger (hard evidence: 'booksExposed')
//   SCARED  — you get the books, but leave a wreck who may bolt to Marlowe
//   BOLTS   — you spook him wrong; he runs to Marlowe, who's forewarned
export const ADLER_MISSION: Mission = {
  id: 'adler_mission',
  actionId: 'adler_turn',
  nodeId: 'adler',
  label: 'Work the money man',
  palette: 'sal',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "Adler works late in a back office that smells of ink and fear, three locks on the door. He keeps two sets of books: the ones Marlowe shows, and the ones that are true. He's the second most dangerous man in the house, and the most afraid." },
        { who: 'them', text: "(not looking up, pen still moving) The door was locked. It's always locked. Whatever you are, I've balanced worse than you before midnight. State your business and leave me my evening." },
      ],
      ask: "A precise, frightened man behind three locks. How do you get inside his guard?",
      choices: [
        { id: 'fear', label: "His fear — 'Marlowe's auditing his own people. A man who knows the true numbers doesn't retire. He disappears.'", tone: 'press', to: 'n_fear' },
        { id: 'order', label: "His precision — 'Every number he's made you lie about is a stain on the only clean thing you have left. Your work.'", tone: 'disarm', to: 'n_order' },
        { id: 'threat', label: "Lean on him — 'Give me the real books or I tell Marlowe you offered them.'", tone: 'push', to: 'o_bolts' },
      ],
    },
    {
      id: 'n_fear',
      mood: 'fear',
      beats: [
        { who: 'them', text: "(the pen stops) …Auditing. You've heard that. Where. From whom." },
        { who: 'you', text: "Doesn't matter where. What matters is the man who knows where all the money's buried is always the first shovelful. You've known that for years. It's why you don't sleep." },
        { who: 'them', text: "(very quietly) …No. I don't." },
      ],
      ask: "He's terrified — the fear he's carried for years, said out loud. Offer him a way out, or ride it?",
      choices: [
        { id: 'protect', label: "A way out — 'Hand me the true books and I make sure you're gone before he moves.'", tone: 'disarm', to: 'o_books' },
        { id: 'ride', label: "Ride the fear — 'Give them to me now, or I let him hear you hesitated.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'n_order',
      mood: 'guilt',
      beats: [
        { who: 'them', text: "(a flinch, like you struck him) …My work is immaculate. Every entry. Every reconciliation." },
        { who: 'you', text: "Immaculate lies. You, of all men, know what an honest ledger looks like. And you haven't kept one in years." },
        { who: 'them', text: "(hands flat on the desk, trembling) …There is a true set. There has always been a true set. I couldn't— a man has to keep one honest thing." },
      ],
      ask: "You've touched the one clean nerve he has left. This is the moment — how do you close it?",
      choices: [
        { id: 'give', label: "Let him make it right — 'Then let the honest set be the one that matters. Hand it to me.'", tone: 'disarm', to: 'o_books' },
        { id: 'seize', label: "Take it hard — 'Good. The true books. Now, before you talk yourself out of it.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'o_books',
      mood: 'hope',
      outcome: {
        key: 'books', tone: 'good',
        title: 'ADLER — THE TRUE BOOKS',
        line: "He unlocks a floor safe and lifts out a plain ledger, heavier than it looks. \"Every dollar he's laundered. Every man he's paid to bury a thing. Ten years of the truth.\" His hands are steady for the first time all night. \"Keep it honest. Please.\"",
        ripple: "You hold the true books — hard proof of every crime that built Marlowe's empire. Paper the man can't buy or frighten his way out of.",
        reflect: "He kept one honest thing through ten years of lies, and I talked him out of it in ten minutes. For the right reasons. That's what I'll tell myself.",
        grants: ['booksExposed'],
        dispositions: [{ nodeId: 'adler', set: 4 }],
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'ADLER — A SHAKING WITNESS',
        line: "He gives you the true books — but he's grey and sweating, and he flinches at the door twice before you've left. You have the paper. You do not have the man's nerve.",
        ripple: "You hold the true books. But Adler is a wreck; if Marlowe's people see him like this, Marlowe learns his money man broke. He may sit down forewarned.",
        reflect: "I got the paper and left a careful man in pieces. He'll jump at shadows now, and one of those shadows will be Marlowe's.",
        grants: ['booksExposed'],
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'adler', set: 2 }],
      },
    },
    {
      id: 'o_bolts',
      mood: 'threat',
      outcome: {
        key: 'bolts', tone: 'bad',
        title: 'ADLER — HE RUNS',
        line: "He goes white and shoves back from the desk. \"No. No — I balance the books, I don't— get out.\" The locks are for keeping people out. Tonight they're to give him time to get to Marlowe first.",
        ripple: "No books. Adler runs straight to Marlowe: someone tried to turn the accountant. Marlowe tightens the house and waits — forewarned.",
        reflect: "I frightened a frightened man and he ran to the one place that felt safe: his master. I should have known. Fear doesn't turn a man. It sends him home.",
        heatDelta: 3,
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'adler', set: 1 }],
      },
    },
  ],
};
