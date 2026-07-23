import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words. Wood-panelled study, low fire, decanter,
// old books, warm dim amber light — kept consistent across every panel. The woven
// read and complication beats below all reuse this same panel set (dense reuse,
// no new art needed).
const POUR = 'assets/art/scene/otto_pour.jpg';        // wide establish: he pours two brandies, already knows why you're here
const SIZEUP = 'assets/art/scene/otto_sizeup.jpg';    // courtly appraisal, sharp knowing eyes
const LAUGH = 'assets/art/scene/otto_laugh.jpg';      // dry humourless laugh — he's made peace with his own end
const CAREFUL = 'assets/art/scene/otto_careful.jpg';  // sets down the glass, a flash of warning
const APPEAL = 'assets/art/scene/otto_appeal.jpg';    // you lean in, he goes very still
const DAUGHTER = 'assets/art/scene/otto_daughter.jpg';// the crack in the shell — his daughter
const TURNED = 'assets/art/scene/otto_turned.jpg';    // drains the glass, decades lifting off him
const HEDGES = 'assets/art/scene/otto_hedges.jpg';    // cool measuring neutrality, gives nothing away
const WARNS = 'assets/art/scene/otto_warns.jpg';      // glass down hard, reaching for the telephone

// OTTO — Marlowe's consigliere, thirty years his right hand. He knows where every
// body is buried, and he knows Marlowe keeps nothing he can no longer use. You
// can't scare a man who's watched Marlowe work for three decades, and you can't
// buy his dignity. But you can name the thing he lies awake on: he's next.
// THE WOVEN READ: before you say a word past his opening line, you judge what
// thirty years in this house has actually left him wanting — survival AND to
// matter, once it's over (the true read), a price he's just never been offered
// (wrong), or leftover institutional fear (wrong). The true read reaches the
// strong approaches (his conscience, his fear) first; a wrong read still reaches
// every approach — nothing is a dead end — but leads with the trap (bribe/
// threat) that dumps you straight into the bad ending. And if you take the fear
// lever anyway, it pays off as a counterexample already built into n_survive:
// loss aversion is usually a hammer, but a man who's already made peace with
// everything he stands to lose can't be moved by the threat of losing it.
// THE COMPLICATION: on the legacy path, right after Otto cracks open about his
// daughter, the courtly wolf catches himself — tests whether you're a fool, a
// spy, or the real thing — before the scene rejoins the same redeem/exploit fork.
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
  scene: 'assets/art/scene/otto.jpg',
  teaches: ['reciprocity', 'information-asymmetry', 'power-mapping', 'loss-aversion'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: POUR, text: "Otto Kessler has kept Marlowe's secrets for thirty years. He's also the only man in the house who's watched Marlowe discard every soul who stopped being useful. He pours two brandies without being asked, and slides one to me. He already knows why I'm here." },
        { who: 'them', art: SIZEUP, text: "The Vidal boy. Marlowe's new favourite stray. Sit. You've come to ask an old man to betray the only life he's had. Do it well, at least. I've heard it done badly too many times." },
      ],
      choices: [
        { id: 'read', label: "Read the old wolf before you show a card. ▸", tone: 'disarm', to: 'read_otto' },
      ],
    },

    // THE READ — study Otto, then judge what thirty years has left him wanting
    // (routes to the same three branches the old text-fork did, but earned).
    {
      id: 'read_otto',
      mood: 'cold',
      portrait: POUR,
      read: {
        ask: "He didn't recite your father's file — he recited what he's already decided about his own ending. What does thirty years in this house leave a man like Otto wanting, now it's nearly over?",
        hint: 'Tap what you notice.',
        clues: [
          { x: 48, y: 26, label: 'his eyes', note: "Never once on the door. A cornered man watches his exits; he watches only you." },
          { x: 36, y: 60, label: 'the two glasses', note: "Poured before you spoke. He knew you'd come — and didn't lean toward the money you hadn't offered." },
          { x: 58, y: 74, label: 'his stillness', note: "Settled, unhurried. A man grieving himself, not one bracing for a fight." },
          { x: 80, y: 40, label: 'the thick folder', note: "Always within reach. An old man's insurance against the day he stops being useful.", grants: 'saw_folder' },
          { x: 28, y: 46, label: 'the old watch', note: "Thirty years at a rich man's elbow, still a foreman's watch. Whatever he wants, it was never things." },
        ],
        options: [
          { id: 'read_spent', label: "His loyalty's spent, not his nerve. He's past being bought and past being frightened — what's left is wanting to survive what's coming, and be remembered as more than the hand that signed the letters.", to: 'r_spent' },
          { id: 'read_price', label: "Thirty years at a rich man's elbow buys expensive tastes. Every man like that has a number — he's just never been offered it.", to: 'r_price' },
          { id: 'read_scare', label: "He's served a man who ends people for a living, for thirty years. That's conditioning. Fear still owns him.", to: 'r_scare' },
        ],
      },
    },

    // --- THE WOVEN READ: what you decide he truly wants, before you say another word ---
    {
      id: 'r_spent',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: SIZEUP, text: "He poured two brandies before you'd said a word, and he hasn't looked at the door once — a frightened man watches his exits. He didn't so much as blink toward the idea of money before you'd offered any — a greedy man leans in at the smell of it. What's left, after thirty years of being the smartest man in every room he's stood in, isn't fear and isn't appetite. It's the question of how the story ends, and whether it's Marlowe's story or finally his own." },
      ],
      ask: "You know what he's actually bargaining for before he does. How do you open a man who wants to survive what's coming, and matter when it's over?",
      choices: [
        { id: 'legacy', label: "His conscience — 'Thirty years of blood. For a man who'd forget your name in a week.'", tone: 'disarm', to: 'n_legacy' },
        { id: 'survive', label: "His fear — 'You know he'll throw you away the day you're inconvenient. That day's close.'", tone: 'disarm', to: 'n_survive' },
        { id: 'bribe', label: "Offer him a cut — 'Help me, and there's a place for you at the top with me.'", tone: 'bribe', to: 'o_warns' },
        { id: 'threat', label: "Lean on him — 'You'll help, or I'll let Marlowe think you already have.'", tone: 'push', requires: ['saw_folder'], to: 'o_warns' },
      ],
    },
    {
      id: 'r_price',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: HEDGES, text: "Thirty years at Marlowe's elbow and he still wears the same watch, drinks the same cellar brandy, keeps rooms upstairs no grander than a foreman's. A man chasing money spends it, flaunts it, at least keeps it somewhere you can smell it on him. You decide the appetite's just well hidden — every man has a number. He's simply priced himself high." },
      ],
      ask: "If a number is what moves him, you'd better find it before he finds yours instead. How do you open him?",
      choices: [
        { id: 'bribe', label: "Offer him a cut — 'Help me, and there's a place for you at the top with me.'", tone: 'bribe', to: 'o_warns' },
        { id: 'threat', label: "Lean on him — 'You'll help, or I'll let Marlowe think you already have.'", tone: 'push', requires: ['saw_folder'], to: 'o_warns' },
        { id: 'survive', label: "His fear — 'You know he'll throw you away the day you're inconvenient. That day's close.'", tone: 'disarm', to: 'n_survive' },
        { id: 'legacy', label: "His conscience — 'Thirty years of blood. For a man who'd forget your name in a week.'", tone: 'disarm', to: 'n_legacy' },
      ],
    },
    {
      id: 'r_scare',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: CAREFUL, text: "Every man in this house is afraid of Marlowe — that's the whole architecture of the place, the reason it still stands. Threaten a man with what he's about to lose and the fear does twice the work of any reward; you've watched it move greedier men than this one. Thirty years standing that close to Marlowe, you decide, has to have left him just as brittle as everybody else." },
      ],
      ask: "Fear is the fastest lever there is — if he's still got something left to lose. How do you open him?",
      choices: [
        { id: 'threat', label: "Lean on him — 'You'll help, or I'll let Marlowe think you already have.'", tone: 'push', requires: ['saw_folder'], to: 'o_warns' },
        { id: 'bribe', label: "Offer him a cut — 'Help me, and there's a place for you at the top with me.'", tone: 'bribe', to: 'o_warns' },
        { id: 'survive', label: "His fear — 'You know he'll throw you away the day you're inconvenient. That day's close.'", tone: 'disarm', to: 'n_survive' },
        { id: 'legacy', label: "His conscience — 'Thirty years of blood. For a man who'd forget your name in a week.'", tone: 'disarm', to: 'n_legacy' },
      ],
    },

    {
      id: 'n_survive',
      mood: 'cold',
      beats: [
        { who: 'them', art: LAUGH, text: "(a dry, humourless laugh) You think I don't know that? I've drafted the letters that ended better men than you. I recognise the paper my own name will be written on." },
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
        { who: 'them', art: CAREFUL, text: "(sets down his glass, slowly) …Careful, boy. You're closer to the bone than you know." },
        { who: 'you', art: APPEAL, text: "You were somebody's son too, once. Somebody who thought you'd amount to more than a man who signs other men's death warrants." },
        { who: 'them', art: DAUGHTER, text: "(a long silence) …I had a daughter. She doesn't speak to me. Because of the life. Because of him." },
        { who: 'them', art: SIZEUP, mood: 'cold', text: "(and just as fast, the shutters come back down — the courtly wolf again, sharp and measuring) …Or I invented her for you, just now, to see how far you'd lean into a lie you wanted to be true. I've spent thirty years testing men for Marlowe. Earn the rest of this conversation, boy, before it costs me my neck." },
      ],

      // --- THE COMPLICATION: he catches himself and tests you before he'll go further ---
      ask: "He's cracked the door open on something real, then slammed it to see if you'd claw at it. This is the test. How do you prove yourself?",
      choices: [
        { id: 'steady', label: "Hold steady — 'You've been sizing me since I sat down, Otto. Keep at it. I'm not going anywhere.'", tone: 'disarm', to: 'n_test_steady' },
        { id: 'proof', label: "Trade him something real — 'Ricci's been skimming Marlowe for years. I know it, and I know how. If I were his, you'd already be dead for hearing me say that.'", tone: 'disarm', to: 'n_test_proof' },
        { id: 'impatient', label: "Push past it — 'I don't have time for parlour tricks, Otto. Yes or no.'", tone: 'push', to: 'n_test_impatient' },
      ],
    },
    {
      id: 'n_test_steady',
      mood: 'guilt',
      beats: [
        { who: 'them', art: APPEAL, text: "(a long look, then something loosens in his shoulders) …Good. A man in a hurry to be believed is usually lying. You're not in a hurry. There was a daughter. There still is." },
      ],
      ask: "You've cracked the courtly shell — there's a grieving man under it. This is the moment. What do you offer him?",
      choices: [
        { id: 'redeem', label: "A way to be more than his crimes — 'Then help end it. Let that be the thing she hears about you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'exploit', label: "Twist it — 'Good. Then you owe me. And her.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'n_test_proof',
      mood: 'guilt',
      beats: [
        { who: 'them', art: SIZEUP, text: "(studies you a long moment, then nods once, slow) …No man plays that card just to pass a test. Ricci's been bleeding Marlowe for years and you knew it cold. You're not his. There was a daughter. There still is." },
      ],
      ask: "You've cracked the courtly shell — there's a grieving man under it. This is the moment. What do you offer him?",
      choices: [
        { id: 'redeem', label: "A way to be more than his crimes — 'Then help end it. Let that be the thing she hears about you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'exploit', label: "Twist it — 'Good. Then you owe me. And her.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'n_test_impatient',
      mood: 'threat',
      beats: [
        { who: 'them', art: CAREFUL, text: "(the shutters stay half down, wary) …Impatience. That's how boys get themselves killed in this business. But it's also not something a spy of Marlowe's would ever risk showing me. Fine. There was a daughter. There still is." },
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
      portrait: TURNED,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'OTTO — HE STEPS ASIDE',
        line: "He drains the brandy and looks, for a moment, twenty years lighter. \"When you move on him, I will be looking the other way. I will not cover him. I will not warn him. And if it comes to it —\" he taps a thick folder on the desk \"— I remember everything.\"",
        ripple: "Marlowe's oldest shield has quietly lowered. When you make your move, his consigliere won't lift a finger to save him.",
        reflect: "I offered a broken old man his one shot at being remembered as something other than Marlowe's hand. I meant it. I think. That's the part I'm not sure of anymore.",
        grants: ['ottoTurned'],
        dispositions: [{ nodeId: 'otto', set: 4 }],
        campaign: { bonds: [{ id: 'otto', delta: 2 }], faction: { id: 'house', delta: 1 }, ledger: ['otto_turned'] },
        debrief: { principle: 'reciprocity',
          note: "You didn't buy Otto and you didn't scare him — you handed him something nobody in Marlowe's house has offered him in thirty years: a choice that was actually his to make. That's **reciprocity**, the Ben Franklin twist of it — the favor runs backward from what you'd expect. Grant a man his dignity for free and he repays it with the one thing no money could have bought from him: the folder he's kept his whole career for exactly this day." },
      },
    },
    {
      id: 'o_hedges',
      mood: 'cold',
      portrait: HEDGES,
      outcome: {
        key: 'hedges', tone: 'mixed',
        title: 'OTTO — HE WATCHES',
        line: "He studies you the way he'd study a contract with a clause he doesn't like. \"I'll do nothing. I won't help you, and I won't hang you. An old man's neutrality — it's the most I give anyone now.\" It's not a no. It's not a yes.",
        ripple: "Otto stays out of it. He won't warn Marlowe — but he won't lower the shield either. You'll have to take Marlowe without him.",
        reflect: "I reached for his fear and his guilt and grabbed neither clean. He gave me nothing and cost me nothing. Marlowe would have gotten all of it.",
        dispositions: [{ nodeId: 'otto', set: 2 }],
        campaign: { bonds: [{ id: 'otto', delta: -1 }], ledger: ['otto_hedged'] },
        debrief: { principle: 'information-asymmetry',
          note: "You pushed the fear harder, or turned his grief into a bill he owed you — and he simply closed the ledger on you. In that room he holds thirty years of secrets and you hold none of his; **information asymmetry** means whoever knows more sets the price, and Otto priced your pressure at exactly nothing. You can't force open a vault when he's the only one who has the combination." },
      },
    },
    {
      id: 'o_warns',
      mood: 'threat',
      portrait: WARNS,
      outcome: {
        key: 'warns', tone: 'bad',
        title: 'OTTO — YOU MISJUDGED HIM',
        line: "He sets down his glass with a click that ends the conversation. \"You came into my house and tried to buy me like a dockhand. Or frighten me. Thirty years, boy. Thirty years.\" He's already reaching for the telephone as you leave.",
        ripple: "Otto tells Marlowe someone in the house is circling. Marlowe pulls his people close and waits for you — forewarned.",
        reflect: "I handled a man of real weight like a mark. Sloppy. Ricci wouldn't have. Marlowe wouldn't have. I keep measuring myself against the men I came to destroy.",
        heatDelta: 3,
        worldFlags: ['marloweForewarned'],
        dispositions: [{ nodeId: 'otto', set: 0 }],
        campaign: { bonds: [{ id: 'otto', delta: -2 }], faction: { id: 'house', delta: -1 }, ledger: ['otto_burned'] },
        debrief: { principle: 'power-mapping',
          note: "You reached for a bribe or a threat before working out what actually moves a man like Otto — money he stopped wanting decades ago, fear he made peace with before you were old enough to threaten anyone. That's **power mapping**: chart who owes whom, and who's already stopped being afraid, before you pick a lever — or you're just guessing, with your own neck on the table. Otto mapped you in about four seconds. You never mapped him at all." },
      },
    },
  ],
};
