import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat (mirrors
// sal_mission.ts exactly). Cloudflare quota was exhausted at authoring time —
// see scripts/gen_auditor.sh (queued, not yet run; reuses the 'sal' palette,
// no theme.css changes needed).
const STACKS = 'assets/art/scene/auditor_stacks.jpg';       // wide establishing: paper-stacked audit room, one lamp, night
const CROSSREF = 'assets/art/scene/auditor_crossref.jpg';   // medium: he cross-references the same three ledgers
const STARTLE = 'assets/art/scene/auditor_startle.jpg';     // startled, folder snaps shut
const DOORWAY = 'assets/art/scene/auditor_doorway.jpg';     // your silhouette in his doorway
const WARY = 'assets/art/scene/auditor_wary.jpg';           // narrowed eyes, "what do you want"
const CAREER = 'assets/art/scene/auditor_career.jpg';       // the woven read: he's running numbers on his OWN risk
const CRUSADE = 'assets/art/scene/auditor_crusade.jpg';     // the woven read: reaching for the "no findings" stamp
const CALCSTILL = 'assets/art/scene/auditor_calcstill.jpg'; // the woven read: hand stills, doing long division on you
const SINK = 'assets/art/scene/auditor_sink.jpg';           // sits back, guarded resignation
const BITTER = 'assets/art/scene/auditor_bitter.jpg';       // the short humorless laugh, names the shells
const DOUBT = 'assets/art/scene/auditor_doubt.jpg';         // studying you, deciding whether to trust
const RELIEF = 'assets/art/scene/auditor_relief.jpg';       // something loosens, not quite a smile
const DREAD = 'assets/art/scene/auditor_dread.jpg';         // goes very still — his own signature, exposed
const ANCHOR = 'assets/art/scene/auditor_anchor.jpg';       // you set the frame: witness or suspect
const FREEZEFACE = 'assets/art/scene/auditor_freezeface.jpg'; // the calculation stops dead on his face
const KNOCK = 'assets/art/scene/auditor_knock.jpg';         // the complication: a knock at the restricted-room door
const HOLD = 'assets/art/scene/auditor_hold.jpg';           // both hold dead still, footsteps recede
const COVER = 'assets/art/scene/auditor_cover.jpg';         // you answer for him, loud and bored
const RUSHDOOR = 'assets/art/scene/auditor_rushdoor.jpg';   // empty corridor, nobody there — or already gone
const STUNG = 'assets/art/scene/auditor_stung.jpg';         // guilt hardens into wounded mistrust
const THREATEN = 'assets/art/scene/auditor_threaten.jpg';   // reaches for the phone, voice climbing
const CALLBLUFF = 'assets/art/scene/auditor_callbluff.jpg'; // you call it, cold and still
const CHOKE = 'assets/art/scene/auditor_choke.jpg';         // the receiver stays in his hand, unlifted
const HANDOVER = 'assets/art/scene/auditor_handover.jpg';   // shaking hands, the folder slides across
const CASHDROP = 'assets/art/scene/auditor_cashdrop.jpg';   // an envelope set on the ledger
const CASHSTARE = 'assets/art/scene/auditor_cashstare.jpg'; // he stares at it, doesn't touch it
const CASHREFUSE = 'assets/art/scene/auditor_cashrefuse.jpg'; // "money's one more line item I'd have to explain"
const TURNED_END = 'assets/art/scene/auditor_turned_end.jpg'; // hands over his own shadow file, both hands
const SCARED_END = 'assets/art/scene/auditor_scared_end.jpg'; // grey, rattled, watching the vault door
const BOUGHT_END = 'assets/art/scene/auditor_bought_end.jpg'; // slides the file over without meeting your eyes
const BURNED_END = 'assets/art/scene/auditor_burned_end.jpg'; // rigid, already reaching for the phone the second you're gone

// PROSSER — the external auditor head office sent to check Cassar Bank's books.
// He's found what he came for (shell accounts that move money and nothing
// else) and has done exactly nothing about it for two weeks, because he isn't
// brave and he isn't corrupt — he's careful. A branching job built entirely
// around ONE lesson: the man who thinks in risk columns only moves when
// silence becomes the more expensive number. Four endings:
//   TURNED — you frame it right; he hands you his own shadow file (evidence + ally)
//   SCARED — he hands over the evidence but he's a wreck, liable to crack
//   BOUGHT — cash "works," but it's one more line item HE'D have to explain
//   BURNED — you push past his arithmetic; he protects himself, reports you
// THE WOVEN READ: before you say a word, you decide what kind of animal he
// is. The true read (a careerist doing risk math) opens the ANCHOR approach —
// reframe which silence costs him more — with confidence. Reading him as a
// closet crusader (appeal to conscience) lets him rationalize walking away
// behind the very report he's paid to file; reading him as a cornered rabbit
// (offer him an easy exit) misses that he's pricing every option, including
// yours. Every read still reaches every approach — it just costs you a beat
// of misjudging him first.
// THE COMPLICATION: on the anchor path, the frame just lands — witness or
// suspect — when a knock hits the restricted-room door. Freeze, cover, or
// rush it; the scene turns, then rejoins the same absolve/twist fork.
export const AUDITOR_MISSION: Mission = {
  id: 'auditor_mission',
  actionId: 'auditor_turn',
  nodeId: 'auditor',
  label: 'Turn the auditor',
  palette: 'sal',
  scene: 'assets/art/scene/auditor.jpg',
  teaches: ['follow-the-money', 'anchoring'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: STACKS, text: "Three nights running I watched Prosser cross-reference the same three ledgers by lamp-light, long after the tellers went home and the vault sealed. Head office sent him after some irregularity flagged upriver. He hasn't filed a thing yet." },
        { who: 'you', caption: true, art: CROSSREF, text: "He's not stupid. He's found the shells — an import firm that's never imported a crate, a dry-cleaner that launders more paper than shirts. He's just deciding, night after night, whether saying so is worth his neck." },
        { who: 'them', art: STARTLE, text: '(a folder snaps shut, chair legs scraping back) This room is restricted. Whoever let you past the guard rotation is going to answer for it.' },
        { who: 'you', art: DOORWAY, text: "Nobody let me in, Mr. Prosser. I want to talk about the numbers that don't square." },
        { who: 'them', art: WARY, text: "(narrowed eyes, very still) …You've been reading my files. Say what you want and get out before I call the floor." },
      ],
      ask: "Three nights of watching a careful man circle the same three ledgers without once picking up a phone. What IS Prosser, really?",
      choices: [
        { id: 'read_career', label: "A careerist running the numbers on his OWN exposure. He moves the second silence costs more than speaking.", tone: 'push', to: 'r_career' },
        { id: 'read_crusader', label: "A man of conscience, just waiting for someone to hand him permission to do right.", tone: 'disarm', to: 'r_crusader' },
        { id: 'read_scared', label: "A rabbit, one bad question from bolting. Best offer him an easy way out.", tone: 'bribe', to: 'r_scared' },
      ],
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_career',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CAREER, text: "He hasn't picked up that phone in three nights. That's not indecision — that's a man doing the math on which silence costs him less. He's not brave and he's not corrupt. He's careful. The only lever that moves a careful man is making the SAFE choice obviously his." },
      ],
      ask: "You know exactly what kind of animal you're dealing with. How do you open a man who thinks in risk columns?",
      choices: [
        { id: 'name', label: "Set the frame — 'Your signature's the one that goes on the clean report, Mr. Prosser.'", tone: 'push', to: 'n1' },
        { id: 'disarm', label: "Hands open — 'I'm not bank security and I'm not Cassar's. I want the same thing you already suspect.'", tone: 'disarm', to: 'd1' },
        { id: 'press', label: "Corner him — 'You've had two weeks to make a call you're not making.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set an envelope of cash on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_crusader',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CRUSADE, text: "You decide underneath the caution is a man who WANTS to do right, just waiting for someone to hand him permission. Then his hand drifts toward a stamp marked 'reviewed — no material findings,' and you realize: permission is exactly what he's already given himself, every night, to do nothing at all." },
      ],
      ask: "Appeal to conscience alone and a careful man hands you a clean report instead of an ally. How do you open him, knowing that now?",
      choices: [
        { id: 'disarm', label: "Hands open — 'I'm not bank security and I'm not Cassar's. I want the same thing you already suspect.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Set the frame — 'Your signature's the one that goes on the clean report, Mr. Prosser.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Corner him — 'You've had two weeks to make a call you're not making.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set an envelope of cash on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_scared',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: CALCSTILL, text: "You decide he's a rabbit, one bad question from bolting — best offer him an easy way out before he panics. Then his hand goes still over the ledger, and you see it isn't animal fear at all. It's a man doing long division, three moves ahead of you, on exactly what an easy way out would cost him later." },
      ],
      ask: "He isn't looking for an exit. He's pricing every option in the room, including yours. How do you open him now?",
      choices: [
        { id: 'bribe', label: 'Set an envelope of cash on the ledger.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Corner him — 'You've had two weeks to make a call you're not making.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Hands open — 'I'm not bank security and I'm not Cassar's. I want the same thing you already suspect.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Set the frame — 'Your signature's the one that goes on the clean report, Mr. Prosser.'", tone: 'push', to: 'n1' },
      ],
    },

    // --- the anchor: frame the stakes ---
    {
      id: 'n1',
      mood: 'tense',
      beats: [
        { who: 'you', art: ANCHOR, text: "Steady, quiet: 'Your signature's the one that goes on the clean report, Mr. Prosser. When Cassar's wash surfaces — and it will — that signature decides whether you're the man who found it, or the man who's asked to explain why he didn't.'" },
        { who: 'them', art: FREEZEFACE, text: "(the calculation stops dead on his face) …Witness. Or suspect. You're telling me it's already one or the other." },
        { who: 'you', art: ANCHOR, text: "It already is. The only thing left to decide is which." },
        { who: 'them', art: KNOCK, text: "(a knock, sharp, right on the restricted-room door — a late walkthrough, or someone checking why the light's still on)" },
      ],
      ask: "The knock's still hanging in the air and he hasn't answered it. What do you do?",
      choices: [
        { id: 'freeze', label: "Freeze — not a word, not a breath.", tone: 'disarm', to: 'n1_freeze' },
        { id: 'cover', label: "Cover it — loud and bored: 'Still cross-checking the Q3 file, be another hour.'", tone: 'press', to: 'n1_cover' },
        { id: 'rush', label: "Rush the door — better to know who's listening than wonder.", tone: 'push', to: 'n1_rush' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'n1_freeze',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HOLD, text: "You hold dead still. Prosser does too, eyes locked on the door, both of you caught mid-frame. A long second. Then the footsteps move on — a guard doing rounds, maybe, or someone who didn't want to be caught listening either." },
      ],
      ask: "The frame's still open, if you close it now. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Close it clean — 'Help me trace it. Not for a headline. So it's your name on the right side of this.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you already know which one you're going to be. Everything, tonight.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: COVER, text: "(loud, bored, like it's nothing) Still cross-checking the Q3 file. Be another hour." },
        { who: 'you', caption: true, art: COVER, text: "The knock doesn't come again. Prosser's still staring at you like you just walked a wire he didn't know was strung." },
      ],
      ask: "You bought the room back. He's still framed, still open — what do you do with it?",
      choices: [
        { id: 'absolve', label: "Close it clean — 'Help me trace it. Not for a headline. So it's your name on the right side of this.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you already know which one you're going to be. Everything, tonight.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_rush',
      mood: 'threat',
      beats: [
        { who: 'you', art: RUSHDOOR, text: "You're at the door before he can stop you, wrenching it open —" },
        { who: 'you', caption: true, art: RUSHDOOR, text: "Empty corridor. A cleaning cart rattling away toward the elevators, or a guard already walking off, unbothered. Whoever it was is gone, or was never anyone at all. Prosser's face has gone the colour of the file paper." },
      ],
      ask: "Nothing there — or nothing you could catch. He's rattled worse than before. What do you do with the moment?",
      choices: [
        { id: 'absolve', label: "Close it clean — 'Help me trace it. Not for a headline. So it's your name on the right side of this.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you already know which one you're going to be. Everything, tonight.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(stung, the opening closing back over) …So that's what this was. Another one measuring exactly what I'm worth to you." },
      ],
      ask: "You turned the frame into a threat. He'll still hand you the file — but you're losing the man behind it. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. You're right. Help me because it's true, not because I made you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'take', label: "Take it and go — 'Just the file, Mr. Prosser.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- disarm: caution curdles into resignation ---
    {
      id: 'd1',
      mood: 'cold',
      beats: [
        { who: 'them', art: SINK, text: "(sits back down slowly, the folder still closed under his hand) …You're not from head office. And you're not Cassar's, or there'd already be security in here." },
        { who: 'you', art: SINK, text: "I'm nobody's. I want to know what's in that folder you keep closing every time someone walks past." },
        { who: 'them', art: BITTER, text: "(a short, humorless laugh) Fine. Shell accounts. An import firm that's never imported a crate. A dry-cleaner that launders more paper than shirts. I've had it memorized two weeks and done exactly nothing — because the last examiner who found something like this in this town isn't examining anything anymore." },
      ],
      ask: "He's not hiding what he found. He's hiding that he's already decided not to act on it. What breaks that?",
      choices: [
        { id: 'hope', label: "Give him hope — 'Sit on it and you're just a name on a lie. Find it, and you're the man who found it.'", tone: 'disarm', to: 'd_hope' },
        { id: 'fear', label: "Give him a worse fear — 'There's already a referral upriver. It won't find Cassar's name on the discrepancy memos. It'll find yours.'", tone: 'press', to: 'd_fear' },
      ],
    },
    {
      id: 'd_hope',
      mood: 'hope',
      beats: [
        { who: 'them', art: DOUBT, text: "(studies you) And what happens to me, exactly, the day this comes out — with or without you in the room?" },
        { who: 'you', art: DOUBT, text: "'Without you' is the only part of that sentence that should scare you. Help me trace it and you're the man who caught it. Sit still and you're just another signature on a report that turns out to be a lie." },
        { who: 'them', art: RELIEF, text: "(something in his face loosens, not quite a smile) …God help me, that's the first version of that sentence anyone's said to me out loud." },
      ],
      ask: "He's ready to move. Close it clean, or grab too fast?",
      choices: [
        { id: 'word', label: "Your word, plain — 'Then we understand each other.'", tone: 'disarm', to: 'o_turned' },
        { id: 'bind', label: "Bind him fast — 'Then start talking. Everything, tonight.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'd_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: DREAD, text: "(goes very still) …You know about the referral." },
        { who: 'you', art: DREAD, text: "I know somebody's finally counting past Cassar's front door. And when they do, they're not going to find his name on the discrepancy memos. They're going to find yours — the examiner who saw it and signed off anyway." },
      ],
      ask: "He's not scared of you anymore. He's scared of his own signature. Pull him back, or push it further?",
      choices: [
        { id: 'pullback', label: "Pull him back — 'That's exactly why you need me on your side of it.'", tone: 'disarm', to: 'o_turned' },
        { id: 'pushon', label: "Push it — 'So move. Before somebody else finds that signature first.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- press: he reaches for the phone ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: THREATEN, text: "(reaches for the phone, voice climbing) I call the floor guard, it's you explaining a break-in to bank security — not me explaining a folder." },
        { who: 'you', art: CALLBLUFF, text: "(quiet, doesn't move) Call them, then. And explain how a stranger walked past a guard rotation straight to the one folder you keep closing." },
        { who: 'them', art: CHOKE, text: "(the receiver stays in his hand, unlifted)" },
      ],
      ask: "You've cornered a careful man, not a proud one — dangerous in a different way. Let him breathe, or squeeze?",
      choices: [
        { id: 'easeoff', label: "Let him breathe — 'I'm not your problem, Mr. Prosser. Sit down.'", tone: 'disarm', to: 'd1' },
        { id: 'ride', label: "Squeeze — 'The file. Or Cassar hears you've been talking regardless.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', art: HANDOVER, text: "(hands shaking, he slides the whole folder across) Take it. Take all of it. I was never in this room tonight either." },
      ],
      ask: "You have the folder, and a wrecked man standing over an empty desk. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'This stays quiet. Breathe.'", tone: 'disarm', to: 'o_scared' },
        { id: 'menace', label: "Seal it with fear — 'One word to Cassar and it's your signature they come looking for.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money answers the wrong question ---
    {
      id: 'c1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CASHDROP, text: "You set an envelope of cash on the closed ledger. It sits there between you, out of place among the printouts." },
        { who: 'them', art: CASHSTARE, text: "(stares at it, doesn't touch it) …You brought money. Into an audit room. To the one man in this building whose entire job is noticing where money came from." },
        { who: 'you', art: CASHDROP, text: "Everyone's got a price." },
        { who: 'them', art: CASHREFUSE, text: "(a short, humorless laugh) Not for this. Cash on the table doesn't erase a trail — it just gives somebody one more line item to ask about. And it makes YOU the entry I'd have to explain." },
      ],
      ask: "The money landed wrong — you answered a question he wasn't asking. Read that, or dig the hole deeper?",
      choices: [
        { id: 'double', label: "Push more — 'Enough to make it worth the risk. Name the number.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pocket', label: "Take it back — 'You're right. Forget the money. It was never about that.'", tone: 'disarm', to: 'd1' },
        { id: 'blackmail', label: "Turn it ugly — 'Take it, or I make sure Cassar hears you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'PROSSER — THE AUDITOR TURNED',
        line: "He unlocks a bottom drawer and pulls out a sealed duplicate file — his OWN shadow copy of the discrepancy trail, kept in case he ever needed proof he hadn't imagined it. Every shell account, every dead-end wire, dated and annotated in his own careful hand. \"Kept a copy the day I stopped believing it was a filing error. I never had anyone to give it to who wasn't already part of it. Until now.\"",
        ripple: "You're holding a documented map of the wash — dates, sums, the shells it moves through. Cassar walks into the sit-down not knowing his own auditor already flipped the book open.",
        reflect: "For once I didn't threaten a man into a corner. I just made sure he could see the corner he was already standing in. He walked out of it on his own.",
        heatDelta: -1,
        grants: ['auditLever', 'auditor_turned'],
        dispositions: [{ nodeId: 'auditor', set: 4 }],
        campaign: { bonds: [{ id: 'auditor', delta: 2 }], faction: { id: 'bank', delta: 1 }, ledger: ['auditor_turned'] },
        debrief: { principle: 'anchoring',
          note: "You never argued that turning was RIGHT. You argued that staying silent was the bigger DANGER — 'witness or suspect' — and let him do the rest of the math against a frame you set first. That's **anchoring**: whichever number, or risk, gets named first becomes the scale everything after is measured against. Say it before he can say 'not my problem,' and you've already picked the frame he negotiates inside." },
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      portrait: SCARED_END,
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'PROSSER — RATTLED, NOT RUINED',
        line: "You walk out with the folder. But you leave Prosser grey and sweating, staring at the vault door like it might open on its own. You got the file. You didn't get the man steady enough to be an ally.",
        ripple: "If Cassar so much as glances at him twice, he'll crack and confirm whatever's asked of him. He may sit down forewarned.",
        reflect: "I got what I needed and left a careful man shaking behind a desk he'll never sit at the same way again.",
        grants: ['auditLever', 'auditor_scared'],
        worldFlags: ['cassarForewarned'],
        dispositions: [{ nodeId: 'auditor', set: 2 }],
        campaign: { bonds: [{ id: 'auditor', delta: -1 }], ledger: ['auditor_scared'] },
        debrief: { principle: 'follow-the-money',
          note: "Think of dirty cash like mud-water — unspendable until it's been run through enough clean-looking jugs to come out clear. First jug: get it INTO the system disguised as an ordinary deposit — **placement**. Second jug: move it through enough shells (his import firm, his dry-cleaner) that no single dollar's trail survives — **layering**. Third jug: it comes back out looking like ordinary profit, spendable and clean — **integration**. Prosser just handed you jugs one and two, annotated in his own hand. He's shaking too hard to promise you the third. Still further upriver than you were an hour ago." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT_END,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'PROSSER — BOUGHT, NOT TURNED',
        line: "He counts the bills once, face unreadable, then slides the folder across without meeting your eyes. Cold, transactional, nothing behind it. A careful man just made himself one more line item — and knows it.",
        ripple: "You have the discrepancy trail — but a man who took cash for it is now a liability with his own name on the ledger of what happened tonight.",
        reflect: "Marlowe buys people and calls it business. Tonight, so did I — and paid for a position the man never actually held.",
        grants: ['auditLever', 'auditor_bought'],
        worldFlags: ['auditorBought'],
        dispositions: [{ nodeId: 'auditor', set: 3 }],
        campaign: { money: -250, bonds: [{ id: 'auditor', delta: -1 }], ledger: ['auditor_bought'] },
        debrief: { principle: 'anchoring',
          note: "You anchored on a PRICE instead of a RISK — and a careerist like Prosser was never running his numbers in dollars. He was pricing his own exposure. Cash on the table doesn't move that number; it just hands him one more entry he'd have to explain if anyone ever asked where it came from. Wrong anchor, wrong frame — it 'worked,' but you bought silence, not conviction." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'PROSSER — BURNED',
        line: "He goes rigid, then blank — the stillness of a careful man who's stopped doing math and started protecting himself. He won't hand you anything more tonight, and the second you're gone he's calling it in as a security breach, his signature clean on the report either way.",
        ripple: "No auditor lever. Cassar hears a stranger's been circling his own examiner — and hardens the bank's side of the ledger against you.",
        reflect: "I pushed a man past his own arithmetic. He didn't hand me the trail. He just made sure it was never his fault that he hadn't.",
        heatDelta: 2,
        worldFlags: ['prosserReported'],
        dispositions: [{ nodeId: 'auditor', set: 0 }],
        campaign: { bonds: [{ id: 'auditor', delta: -2 }], faction: { id: 'bank', delta: -1 }, ledger: ['auditor_burned'] },
        debrief: { principle: 'follow-the-money',
          note: "Somewhere in that folder was the whole wash staged out — **placement** (dirty cash disguised as an ordinary deposit), **layering** (run through his shells until the trail dies), **integration** (spent clean on the other side). You never got past the cover page. Push a careful man past his own risk math and he doesn't hand you the trail — he protects himself, and the wash stays exactly as invisible as it was before you walked in." },
      },
    },
  ],
};
