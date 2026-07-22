import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → the chain laid bare → the
// phone ringing → the branches → each ending its own image + mood).
const WATCH = 'assets/art/scene/aide_watch.jpg';           // City Hall's east wing, one window still lit past midnight
const FILES = 'assets/art/scene/aide_files.jpg';           // the back office: floor-to-ceiling favors, filed and cross-indexed
const ENTER = 'assets/art/scene/aide_enter.jpg';           // Holt in the doorway, keys still in hand, finds you waiting
const DOORWAY = 'assets/art/scene/aide_doorway.jpg';       // your silhouette, unhurried, in his own office
const WARY = 'assets/art/scene/aide_wary.jpg';             // "what do you want" — controlled, giving nothing away

const BROKER = 'assets/art/scene/aide_broker.jpg';         // the woven read: the watch-check, the dry "services rendered"
const BELIEVER = 'assets/art/scene/aide_believer.jpg';     // the wrong read: Vane's name lands and his jaw tightens — not devotion
const SCARED = 'assets/art/scene/aide_scared.jpg';         // the wrong read: he corrects your citation, a little too pleased with himself

const FAVOR = 'assets/art/scene/aide_favor.jpg';           // you clear a problem of his, unasked, no mention of payment
const STUDY = 'assets/art/scene/aide_study.jpg';           // he studies you, recalculating everything
const UNSETTLED = 'assets/art/scene/aide_unsettled.jpg';   // "in twenty years" — genuinely thrown
const COLD = 'assets/art/scene/aide_cold.jpg';             // the goodwill spent the instant you cash it in

const CHAIN = 'assets/art/scene/aide_chain.jpg';           // you lay the whole climbing chain out flat on his desk
const FLICKER = 'assets/art/scene/aide_flicker.jpg';       // not fear behind his composure — calculation
const PHONE = 'assets/art/scene/aide_phone.jpg';           // THE COMPLICATION: Vane's private line lights up, ringing
const RINGOUT = 'assets/art/scene/aide_ringout.jpg';       // it rings itself out; neither of you moves
const ANSWER = 'assets/art/scene/aide_answer.jpg';         // he answers, a lie so smooth it's frightening
const GRAB = 'assets/art/scene/aide_grab.jpg';             // you take the receiver before he can stop you
const STUNG = 'assets/art/scene/aide_stung.jpg';           // the opening slams back into something colder

const NEEDLE = 'assets/art/scene/aide_needle.jpg';         // you name twenty years of taking Vane's falls for him
const ANGER = 'assets/art/scene/aide_anger.jpg';           // the composure cracks — a real, dangerous anger
const YIELD = 'assets/art/scene/aide_yield.jpg';           // he reaches for the drawer, not the phone

const STAKEOFFER = 'assets/art/scene/aide_stakeoffer.jpg'; // not cash — a seat at a table that doesn't exist yet
const CALC = 'assets/art/scene/aide_calc.jpg';             // the short, humorless laugh of a man actually considering it

const TURNED_END = 'assets/art/scene/aide_turned_end.jpg';     // hands you the real cabinet, the real ledger of debts
const WARY_END = 'assets/art/scene/aide_wary_end.jpg';         // hands it over, hands unsteady, eyes elsewhere
const LEVERAGED_END = 'assets/art/scene/aide_leveraged_end.jpg'; // signs it in writing, already re-reading the terms
const BURNED_END = 'assets/art/scene/aide_burned_end.jpg';     // reaching for the phone the second your back is turned

// HOLT — Commissioner Vane's chief aide and fixer. Twenty years of clearing tables
// nobody else was allowed to see: the man who knows where every body is buried and
// every favor is owed, because he's the one who buried them and owed them out. He
// is not loyal and he is not scared — he is quietly, patiently ambitious, and tired
// past words of carrying another man's secrets for a salary that stopped covering
// it years ago. Four endings, each redrawing the map its own way:
//   TURNED    — he opens the real cabinet: hallAccess, a genuine ally at the Hall
//   WARY      — you get hallAccess, but a nervous man who hasn't chosen a side
//   LEVERAGED — he takes a paper title in writing; hallAccess, but bought, not won
//   BURNED    — you spook or corner him wrong; no access, and he warns Vane
// No option is simply correct. A favor given can be trusted or cashed in too soon;
// naming the whole chain can open him or just look like one more hand in his files;
// pressing his pride can break him loose or make him reach for the phone; offering
// him a future can read as vision or as one more man buying him cheap.
// Palette 'marlowe' (reused cold steel) lights the office storm-grey and brass; each
// beat's mood re-lights the room as the read, then the scene, turns.
// THE WOVEN READ: right after the opening, before you say what you came for, you
// judge what Holt truly IS — a broker keeping his own ledger, a true believer, or a
// frightened clerk. The true read (a broker Vane has stopped paying) opens every
// approach with real leverage; a wrong read still reaches every approach, but
// foregrounds the weaker ones and costs you a beat of misjudging him.
// THE COMPLICATION: on the name/chain path — showing him the full power-map, proof
// you already see who owes whom — Vane's own private line lights up mid-conversation.
// A choice under pressure (ignore/cover/grab) before the scene rejoins the same
// absolve/twist fork into the same four endings.
export const AIDE_MISSION: Mission = {
  id: 'aide_mission',
  actionId: 'aide_turn',
  nodeId: 'aide',
  label: "Turn the Commissioner's aide",
  palette: 'marlowe',
  scene: 'assets/art/scene/aide.jpg',
  teaches: ['power-mapping', 'reciprocity'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WATCH, text: "City Hall's east wing goes dark by ten most nights — except one window. Vane's own office goes black an hour before his aide's does. Holt stays. Holt always stays." },
        { who: 'you', caption: true, art: FILES, text: 'His office is a filing cabinet wearing a man\'s suit — twenty years of favors, cross-indexed, none of them in Vane\'s handwriting. Everyone in this building is furniture to somebody. He\'s the only one who knows exactly where all the furniture is bolted down.' },
        { who: 'them', art: ENTER, text: "(keys still in hand, stopping dead in his own doorway) You're not on any list of mine. Which means you shouldn't be able to find this office at all." },
        { who: 'you', art: DOORWAY, text: "I found the man who runs it. Figured the room would be easy after that." },
        { who: 'them', art: WARY, text: "(setting his briefcase down slow, giving away nothing) Flattery, or you actually mean it. Either way — say what you want, or get out before the building's cameras remember you were here." },
      ],
      ask: "He gives you exactly nothing to read except one thing: his hand drums the desk, once, at the word 'Commissioner.' Before you say why you came, decide — what IS Holt to Vane, really?",
      choices: [
        { id: 'read_broker', label: "Not a believer, not a lackey — a broker. And Vane's stopped paying what he owes him.", tone: 'disarm', to: 'r_broker' },
        { id: 'read_believer', label: "The Commissioner's man to the bone. Loyal past reason, past self-interest.", tone: 'press', to: 'r_believer' },
        { id: 'read_scared', label: "A frightened company man. Keeps his head down and does as he's told.", tone: 'bribe', to: 'r_scared' },
      ],
    },

    // --- THE WOVEN READ: what you decide Holt truly is, before you say why you came ---
    {
      id: 'r_broker',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: BROKER, text: "The watch-check at the Commissioner's name. The dry little phrase 'services rendered' instead of anything that sounds like loyalty. The way he says 'the Commissioner' now like a title he's stopped believing comes with a person attached. He isn't devoted and he isn't scared — he's a man keeping his own ledger, and only one side of it has been getting entries lately." },
      ],
      ask: "You know exactly what column he's short in. How do you open a man doing that math?",
      choices: [
        { id: 'offer', label: "Do him a favor first, unasked — no mention of what it costs.", tone: 'disarm', to: 'h1' },
        { id: 'name', label: "Lay the whole chain out flat — Kastner, Cassar, and where it climbs to.", tone: 'push', to: 'l1' },
        { id: 'press', label: "Name what Vane's actually cost him — twenty years of taking the falls.", tone: 'press', to: 'pr1' },
        { id: 'bribe', label: "Offer him a stake in the table that's coming, not cash.", tone: 'bribe', to: 'st1' },
      ],
    },
    {
      id: 'r_believer',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BELIEVER, text: "You decide loyalty runs to the bone in him — the Commissioner's man, first and last. You say Vane's name with something like respect, expecting it to land soft. Instead his jaw sets, and for one unguarded half-second there's something close to contempt behind the eyes. Gone before you can be sure you saw it." },
      ],
      ask: "Wrong. Whatever's under that discipline, it isn't devotion. How do you open him, knowing that now?",
      choices: [
        { id: 'press', label: "Name what Vane's actually cost him — twenty years of taking the falls.", tone: 'press', to: 'pr1' },
        { id: 'name', label: "Lay the whole chain out flat — Kastner, Cassar, and where it climbs to.", tone: 'push', to: 'l1' },
        { id: 'bribe', label: "Offer him a stake in the table that's coming, not cash.", tone: 'bribe', to: 'st1' },
        { id: 'offer', label: "Do him a favor first, unasked — no mention of what it costs.", tone: 'disarm', to: 'h1' },
      ],
    },
    {
      id: 'r_scared',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: SCARED, text: "You decide he's just a frightened company man, keeping his head down out of fear and nothing grander than that. Then he corrects your citation of the municipal code before you've finished the sentence — precise, unhurried, and just a little too pleased with himself. That's not a man keeping his head down. That's a man who knows to the dollar what he's worth in this building." },
      ],
      ask: "Underestimate him twice and he'll enjoy proving you wrong the hard way. How do you open him, now you see it?",
      choices: [
        { id: 'bribe', label: "Offer him a stake in the table that's coming, not cash.", tone: 'bribe', to: 'st1' },
        { id: 'press', label: "Name what Vane's actually cost him — twenty years of taking the falls.", tone: 'press', to: 'pr1' },
        { id: 'offer', label: "Do him a favor first, unasked — no mention of what it costs.", tone: 'disarm', to: 'h1' },
        { id: 'name', label: "Lay the whole chain out flat — Kastner, Cassar, and where it climbs to.", tone: 'push', to: 'l1' },
      ],
    },

    // --- offer: the quiet favor, no strings named ---
    {
      id: 'h1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: FAVOR, text: "Before you ask him for one thing, you hand him something instead — a name quietly scrubbed off a witness list, a problem of his that stops being a problem. You don't mention what it costs, because it doesn't cost anything." },
        { who: 'them', art: STUDY, text: "(a long, unreadable pause, studying you like a column that won't balance) …People don't do things for me in this building. They do things TO me, or around me. What do you want for it?" },
      ],
      ask: "The move landed clean — now comes the test. What do you tell him?",
      choices: [
        { id: 'genuine', label: "Mean it — 'Nothing. Not tonight.'", tone: 'disarm', to: 'h2' },
        { id: 'callin', label: "Cash it in immediately — 'Since you ask — Vane, and everything he owes you.'", tone: 'push', to: 'h3' },
      ],
    },
    {
      id: 'h2',
      mood: 'hope',
      beats: [
        { who: 'them', art: UNSETTLED, text: "(something in his face that isn't relief — closer to disbelief) …Nothing. In twenty years in this building, nobody's ever once said that to me and meant it." },
        { who: 'you', art: UNSETTLED, text: "Maybe it's time somebody balanced your books for a change instead of the other way round." },
      ],
      ask: "He's off-balance in a way you can build on — or spend too fast. What now?",
      choices: [
        { id: 'trust', label: "Let him come to it himself — 'Whenever you're ready to talk, I'm listening.'", tone: 'disarm', to: 'o_turned' },
        { id: 'rush', label: "Press while he's soft — 'So talk. Now. Vane, and everything on his ledger.'", tone: 'push', to: 'o_wary' },
      ],
    },
    {
      id: 'h3',
      mood: 'cold',
      beats: [
        { who: 'them', art: COLD, text: "(the unreadable pause hardens fast into something very familiar) …There it is. For a second I nearly believed you were something other than one more hand in my files." },
      ],
      ask: "You spent the goodwill the second you cashed it in. Salvage what's left, or take it and go?",
      choices: [
        { id: 'apologize', label: "Walk it back — 'Fair. I still meant the favor. Call it owed, not spent.'", tone: 'disarm', to: 'o_wary' },
        { id: 'takeanyway', label: "Take it anyway — 'Fine. Then let's talk business, Holt.'", tone: 'push', to: 'o_leveraged' },
      ],
    },

    // --- name: the full chain, the power-map laid bare ---
    {
      id: 'l1',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CHAIN, text: "You lay it out flat on his desk, plain as a filed brief — Kastner's manifests, Cassar's ledgers, the whole chain climbing floor by floor to this office. Not a guess. A map, and Holt is on it." },
        { who: 'them', art: FLICKER, text: "(something flickers behind the composure — not fear, calculation) You've been busy. …And you brought me the full picture because you thought I'd be grateful?" },
        { who: 'you', art: FLICKER, text: "Because I know who actually pays for a map like that anymore. And lately it isn't Vane." },
        { who: 'them', art: PHONE, text: '(he opens his mouth to answer — and a second phone on the credenza lights up cold blue, ringing. His private line to the Commissioner. He goes very still.)' },
      ],
      ask: "Vane's own line, ringing at this hour, mid-sentence, before he's answered you. What do you do?",
      choices: [
        { id: 'ignore', label: "Don't move — 'Let it ring out.'", tone: 'disarm', to: 'l2_ignore' },
        { id: 'cover', label: "Nod at it, easy — 'Answer it. I'm not here.'", tone: 'press', to: 'l2_cover' },
        { id: 'grab', label: "Reach past him for the receiver — 'Let's hear what he wants.'", tone: 'push', to: 'l2_grab' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'l2_ignore',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: RINGOUT, text: "Neither of you moves. It rings out into silence — six times, seven — and stops. Holt exhales like a man who's been holding his breath twenty years, not twenty seconds." },
      ],
      ask: "He just let his own Commissioner go unanswered in front of you. What do you do with that?",
      choices: [
        { id: 'absolve', label: "Offer him a way out that isn't answering to Vane — 'You don't have to keep carrying it for him.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Press the opening — 'Good. Now you answer to me instead.'", tone: 'push', to: 'l3' },
      ],
    },
    {
      id: 'l2_cover',
      mood: 'tense',
      beats: [
        { who: 'them', art: ANSWER, text: '(picking up, smooth, practiced, terrifyingly easy) Commissioner — no, sir, quiet night, I was just finishing the Kastner files. …Of course. Good night, sir.' },
        { who: 'you', caption: true, art: ANSWER, text: "He hangs up and the lie is already gone from his face, filed away like everything else in this office. He looks at you like you just watched him do something he's never let anyone watch before." },
      ],
      ask: "You just watched a man lie to his own boss for you, effortlessly. What do you do with that?",
      choices: [
        { id: 'absolve', label: "Offer him a way out that isn't answering to Vane — 'You don't have to keep carrying it for him.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Press the opening — 'Good. Now you answer to me instead.'", tone: 'push', to: 'l3' },
      ],
    },
    {
      id: 'l2_grab',
      mood: 'threat',
      beats: [
        { who: 'you', art: GRAB, text: "You've got the receiver before Holt can stop you, holding it to your ear without a word. Breathing on the other end — waiting — then a click as Vane hangs up on the silence, unconvinced or uninterested, you'll never know which." },
        { who: 'them', caption: true, art: GRAB, text: "Holt is staring at you like you just put your hand into a fire he's spent twenty years walking carefully around." },
      ],
      ask: "You touched the one line in this building he never lets anyone touch. What do you do with the moment?",
      choices: [
        { id: 'absolve', label: "Offer him a way out that isn't answering to Vane — 'You don't have to keep carrying it for him.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Press the opening — 'Good. Now you answer to me instead.'", tone: 'push', to: 'l3' },
      ],
    },
    {
      id: 'l3',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the composure slams back on, colder than it was before) …So that's what this is. Not a different kind of hand. Just another one reaching into my files." },
      ],
      ask: "You turned the opening into a demand. He'll still hand you something — but you're losing the man himself. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. I don't want you owing me either. I want you looking out for yourself.'", tone: 'disarm', to: 'o_turned' },
        { id: 'take', label: "Take it and go — 'Just the files, Holt.'", tone: 'push', to: 'o_wary' },
      ],
    },

    // --- press: his pride, and the fear of always taking the fall ---
    {
      id: 'pr1',
      mood: 'threat',
      beats: [
        { who: 'you', art: NEEDLE, text: "Twenty years of clearing tables so Vane's hands stayed clean. Every time it mattered, his name goes on the memo and yours goes nowhere at all." },
        { who: 'them', art: ANGER, text: "(the composure cracks — real, dangerous anger) Careful. I still keep building security on a very short leash, and a very long memory for people who walk in here uninvited." },
      ],
      ask: "You've rattled a man who spent two decades never letting anyone see him rattled. Ease off, or press through it?",
      choices: [
        { id: 'easeoff', label: "Let him breathe — 'I'm not here to threaten you. Sit down.'", tone: 'disarm', to: 'h1' },
        { id: 'ride', label: "Press through it — 'So call them. And explain why the story's already written the other way.'", tone: 'push', to: 'pr2' },
      ],
    },
    {
      id: 'pr2',
      mood: 'fear',
      beats: [
        { who: 'them', art: YIELD, text: "(a long, ugly silence — then he reaches for a drawer, not the phone) …Fine. Tell me exactly what you need, and we never discuss how you got it." },
      ],
      ask: "You've got what you came for, and a furious, cornered man across the desk. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'This stays between us. You did the smart thing.'", tone: 'disarm', to: 'o_wary' },
        { id: 'menace', label: "Seal it with fear — 'And if it doesn't, the Hall hears far worse about you than about me.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: not cash, a stake — the transactional offer misreads him ---
    {
      id: 'st1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: STAKEOFFER, text: "You don't put money on the desk. Holt's long past cash. You offer him something else — a seat at the table that exists once the old chain finally breaks." },
        { who: 'them', art: CALC, text: "(a short, humorless laugh) You're offering me patronage. From a man with no office, no money, and no chair of his own — not yet." },
        { who: 'you', art: CALC, text: "Not yet." },
      ],
      ask: "He didn't say no. Read exactly what that means.",
      choices: [
        { id: 'double', label: "Sweeten it — name a real position, in writing, tonight.", tone: 'push', to: 'o_leveraged' },
        { id: 'pullback', label: "Pull it back — 'Forget the offer. Tell me what you actually want.'", tone: 'disarm', to: 'h1' },
        { id: 'blackmail', label: "Turn it ugly — 'Take the seat, or I make sure Vane hears you were shopping for one.'", tone: 'press', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'HOLT — THE MAN WHO KNOWS EVERYTHING',
        line: "He unlocks a second cabinet, one that isn't on any building inventory, and starts pulling files. \"Every favor the Commissioner's called in and never repaid. Every soft spot in how this building actually runs — not the one on the seal out front.\" He slides the first folder across. \"Twenty years, and nobody ever asked what I wanted instead of what I owed.\"",
        ripple: "You have HALL ACCESS now — real doors, real names, the actual machine behind the marble. When you finally sit down with Vane, he won't see you coming.",
        reflect: "He balanced somebody else's books for free for twenty years and called it a career. I keep wondering how many more years in this life it'd have taken to turn me into him.",
        heatDelta: -1,
        grants: ['hallAccess', 'aide_turned'],
        dispositions: [{ nodeId: 'aide', set: 4 }],
        campaign: { bonds: [{ id: 'aide', delta: 2 }], faction: { id: 'hall', delta: 1 }, ledger: ['aide_turned'] },
        debrief: { principle: 'power-mapping',
          note: "Vane's org chart says Holt works FOR him. The real chart — who's owed what, who's covering for whom — said otherwise the moment you looked. That's **power mapping**: the chart that matters isn't titles, it's debts. You read the true ledger, became the entry on the paying side, and the map redrew itself around you." },
      },
    },
    {
      id: 'o_wary',
      mood: 'cold',
      portrait: WARY_END,
      outcome: {
        key: 'wary', tone: 'mixed',
        title: 'HOLT — ACCESS, NOT LOYALTY',
        line: "He hands over what you need — the doors, the names, the soft spots — but his hands aren't quite steady doing it, and he won't meet your eye once while he does. You have the access. You don't have the man.",
        ripple: "Hall access is hall access. But a nervous man who hasn't chosen a side is a man still weighing whether the other side pays better.",
        reflect: "I asked him to hand over twenty years of his own cover without giving him one real reason to trust me first. He did it anyway. That should worry me more than it does.",
        grants: ['hallAccess', 'aide_wary'],
        dispositions: [{ nodeId: 'aide', set: 2 }],
        campaign: { bonds: [{ id: 'aide', delta: -1 }], ledger: ['aide_wary'] },
        debrief: { principle: 'reciprocity',
          note: "You took his files without ever giving him a reason to want you to have them. **Reciprocity** — the pull to repay a kindness — only fires if you actually extend one first. Demand without giving and you get compliance, not the loyalty that survives the next man who asks louder." },
      },
    },
    {
      id: 'o_leveraged',
      mood: 'cold',
      portrait: LEVERAGED_END,
      outcome: {
        key: 'leveraged', tone: 'mixed',
        title: 'HOLT — BOUGHT, NOT WON',
        line: "He has you put the position in writing before he'll hand over a single file — reads every clause twice, cold and precise, and signs like a man closing an ordinary contract. No warmth in it. Just terms.",
        ripple: "You have hall access. You also have a man who now negotiates every future ask against the fine print — and who'll read someone else's better offer with exactly the same care.",
        reflect: "Marlowe buys loyalty and calls it business. Tonight I wrote a man a contract instead of earning him, and told myself that was different.",
        heatDelta: 1,
        grants: ['hallAccess', 'aide_bought'],
        worldFlags: ['aideBought'],
        dispositions: [{ nodeId: 'aide', set: 3 }],
        campaign: { money: -150, bonds: [{ id: 'aide', delta: -1 }], ledger: ['aide_bought'] },
        debrief: { principle: 'reciprocity',
          note: "A position on paper 'worked' — but you paid for a clause, not a debt owed back to you. That's a rental, not the **reciprocity** that makes a man loyal past the point it's convenient. A man bought with terms re-reads the terms the day someone offers better ones." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'HOLT — WARNED HIS MASTER',
        line: "He goes very still and very quiet and doesn't offer you a single file. You know that stillness — it's a man doing the math on how fast he can reach the Commissioner once your back is turned.",
        ripple: "No hall access. By morning Vane knows someone's been walking his own aide's office at night, asking about ledgers — and he tightens everything you'd have needed loose.",
        reflect: "I read the map and thought his ledger with Vane was already empty. It wasn't. Fear of the man you're both afraid of is still a debt, and I just paid him into it.",
        heatDelta: 2,
        worldFlags: ['vaneForewarned'],
        dispositions: [{ nodeId: 'aide', set: 0 }],
        campaign: { bonds: [{ id: 'aide', delta: -2 }], faction: { id: 'hall', delta: -1 }, ledger: ['aide_burned'] },
        debrief: { principle: 'power-mapping',
          note: "You mapped Holt as an open account — Vane overdrawn, nothing left to fear. But fear of a boss isn't erased just because he's stopped paying; it's a separate line on the ledger. Misread the **power map** and the node you thought was yours reports straight back to the top." },
      },
    },
  ],
};
