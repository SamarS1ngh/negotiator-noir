import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → the woven read → the small
// ask → the guard's rounds → the branches → each ending its own image + mood).
const WATCH = 'assets/art/scene/teller_watch.jpg';           // establishing: the one lit desk in the dark marble hall
const ROWS = 'assets/art/scene/teller_rows.jpg';             // the shelves of shell-account ledgers behind him
const STARTLE = 'assets/art/scene/teller_startle.jpg';       // pencil clatters, he startles
const APPROACH = 'assets/art/scene/teller_approach.jpg';     // your silhouette crossing the marble lobby
const WARY = 'assets/art/scene/teller_wary.jpg';             // wary, throat working, watching you
const LEDGER = 'assets/art/scene/teller_ledger.jpg';         // the torn margin, retotaled three times
const FLINCH = 'assets/art/scene/teller_flinch.jpg';         // the wrong read: his hand flinches off the cash drawer
const PHONEGLANCE = 'assets/art/scene/teller_phoneglance.jpg'; // the wrong read: eyes cut to the security phone
const DISARM = 'assets/art/scene/teller_disarm.jpg';         // you make the small ask
const HESITATE = 'assets/art/scene/teller_hesitate.jpg';     // he hesitates over the tiny ask
const OVERREACH = 'assets/art/scene/teller_overreach.jpg';   // pushed too far, too fast, he recoils
const GUARD = 'assets/art/scene/teller_guard.jpg';           // THE COMPLICATION: the night guard's rounds
const FREEZE = 'assets/art/scene/teller_freeze.jpg';         // both go still as the footsteps pass
const COVER = 'assets/art/scene/teller_cover.jpg';           // the casual cover line
const RUSH = 'assets/art/scene/teller_rush.jpg';             // you check the corridor yourself
const CROSSED = 'assets/art/scene/teller_crossed.jpg';       // the shaky exhale after crossing the first line
const STUNG = 'assets/art/scene/teller_stung.jpg';           // gratitude curdling into resentment
const INFO = 'assets/art/scene/teller_info.jpg';             // you show him you already know what these accounts are
const SPOOKED = 'assets/art/scene/teller_spooked.jpg';       // spooked that a stranger already knows this much
const PRESS = 'assets/art/scene/teller_press.jpg';           // you crowd him with what he already suspects
const DIAL = 'assets/art/scene/teller_dial.jpg';             // his hand darts for the phone
const CALLBLUFF = 'assets/art/scene/teller_callbluff.jpg';   // you call the bluff, unmoved
const CHOKE = 'assets/art/scene/teller_choke.jpg';           // the hand stalls over the receiver
const HANDOFF = 'assets/art/scene/teller_handoff.jpg';       // he slides the scrap of paper across
const CASHDROP = 'assets/art/scene/teller_cashdrop.jpg';     // the fold of bills on the ledger
const CASHSTARE = 'assets/art/scene/teller_cashstare.jpg';   // he stares at it, doesn't touch it
const TURNED_END = 'assets/art/scene/teller_turned_end.jpg';
const SHAKY_END = 'assets/art/scene/teller_shaky_end.jpg';
const BOUGHT_END = 'assets/art/scene/teller_bought_end.jpg';
const BURNED_END = 'assets/art/scene/teller_burned_end.jpg';

// WYATT ARLEN — a young Cassar Bank clerk, idealistic and underpaid, who processes
// the shell accounts that wash the union's cargo money upriver. He isn't stealing
// and he isn't proud of what he writes down; he's a conscience with nowhere left
// to put itself, working late to keep re-checking a lie he can't stop believing
// is somehow still fixable. Four endings, each its own kind of yes:
//   TURNED — the foot-in-the-door lands clean: one small ask becomes a standing one
//   SHAKY  — you get access, but leave a frightened man who doesn't know the stakes
//   BOUGHT — cash "works" fast, but a bought yes isn't a changed man
//   BURNED — he breaks and reports up the chain before you're out the side door
// No lever is simply correct. Fear can crack him or send him for the phone; his own
// held secret can open him or make him bolt; money answers a question he never
// asked. Palette 'sal' (reused, not edited) lights the marble bank in the same
// sickly bookkeeper's-lamp green as Sal's dockside office — money-green, after
// hours, a room that never really turns the lights all the way on.
// THE WOVEN READ: right after the opening, before any approach, you judge what
// Wyatt truly IS from what you've seen — a scared honest kid, a man with a price,
// or a company man who folds under fear. The true read (scared and honest) frames
// the small, deniable ask that actually works; the wrong reads (a big bribe, open
// threat) still reach every approach, but the wrong lever lands harder and risks
// scaring him off outright.
// THE COMPLICATION: on the small-ask path, the first tiny yes is interrupted by the
// night guard's rounds — a choice under pressure (freeze/cover/rush) before the
// scene rejoins the same absolve/twist fork that decides whether the small yes
// stays a gift or gets turned into a debt.
export const TELLER_MISSION: Mission = {
  id: 'teller_mission',
  actionId: 'teller_turn',
  nodeId: 'teller',
  label: 'Turn the teller',
  palette: 'sal',
  scene: 'assets/art/scene/teller.jpg',
  teaches: ['foot-in-the-door', 'information-asymmetry'],
  start: 't0',
  nodes: [
    {
      id: 't0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WATCH, text: "Two nights running I clocked the same window at Cassar Bank — marble dark behind locked doors, one desk lamp still burning green in the back row long after closing. The name plate reads WYATT ARLEN. Third year on the job, maybe, judging by how careful he still is with the stamps." },
        { who: 'you', caption: true, art: ROWS, text: "Shelves of ledgers behind him, dummy names on half the accounts, numbers that don't trace to any business on either side of the river. He isn't skimming a dime of it. He's the one writing the lie down neat enough that nobody upstairs ever has to." },
        { who: 'them', art: STARTLE, text: "(pencil clatters off the desk) The bank's — we're closed. How did you even—" },
        { who: 'you', art: APPROACH, text: "Side door, by the loading dock. Nobody's watching it tonight, Mr. Arlen. Keep your voice down and we both still have somewhere to be in the morning." },
        { who: 'them', art: WARY, text: "(doesn't call out, doesn't reach for anything — just watches you, throat working) ...Who are you. And why do you know my name." },
      ],
      ask: "He hasn't screamed. Hasn't gone for the alarm. Just watching you, scared — and under the fear, something close to relief that somebody finally noticed what he's been carrying alone. What IS Wyatt Arlen, really?",
      choices: [
        { id: 'read_small', label: "A scared, honest kid drowning in a job that turned dirty under him without his say-so. He won't hand you the vault — but he might do one small thing.", tone: 'disarm', to: 'r_small' },
        { id: 'read_forsale', label: "Underpaid, surrounded every day by money that isn't his. Everybody in this building has a price — him too.", tone: 'bribe', to: 'r_forsale' },
        { id: 'read_threat', label: "A company man to the bone. Enough fear in the room and he does exactly what he's told.", tone: 'press', to: 'r_threat' },
      ],
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_small',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: LEDGER, text: "Same account, retotaled three times in the margin, pencil dug in so hard it's torn the page. That's not a man hunting a number that's short. That's a man checking, over and over, that a lie he wrote still holds. Not greed. A conscience with nowhere left to put itself down." },
      ],
      ask: "How do you open a man like that without breaking the one thing still holding him together?",
      choices: [
        { id: 'disarm', label: "Ask for something small. Nothing that costs him his job — not yet.", tone: 'disarm', to: 'a_disarm' },
        { id: 'info', label: "Show him you already know what these accounts really are.", tone: 'push', to: 'a_info' },
        { id: 'press', label: "Crowd him — 'You keep checking that account because you know exactly whose money it is.'", tone: 'press', to: 'a_press' },
        { id: 'bribe', label: 'Set money on the desk.', tone: 'bribe', to: 'a_bribe' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: FLINCH, text: "You peg him as just another underpaid clerk sitting on money that isn't his — name the right number and he folds like anyone would. Then his hand drifts away from the cash drawer like it's live current. Not hunger in that flinch. Dread." },
      ],
      ask: "A man who flinches from money isn't shopping for a price. Careful how you open him now.",
      choices: [
        { id: 'bribe', label: 'Set money on the desk anyway — see how he actually reacts.', tone: 'bribe', to: 'a_bribe' },
        { id: 'press', label: "Crowd him instead — 'You keep checking that account because you know exactly whose money it is.'", tone: 'press', to: 'a_press' },
        { id: 'disarm', label: "Ask for something small. Nothing that costs him his job — not yet.", tone: 'disarm', to: 'a_disarm' },
        { id: 'info', label: "Show him you already know what these accounts really are.", tone: 'push', to: 'a_info' },
      ],
    },
    {
      id: 'r_threat',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: PHONEGLANCE, text: "You decide fear's the lever — corner a company man hard enough and he'll do anything to make the scary stranger leave. Then his eyes cut, just once, to the black telephone bolted by the vault door. That's not a man who folds quiet. That's a man deciding if he's brave enough to shout." },
      ],
      ask: "Push him and he might not fold — he might just reach for that phone. How do you open him, knowing that now?",
      choices: [
        { id: 'press', label: "Crowd him anyway — 'You keep checking that account because you know exactly whose money it is.'", tone: 'press', to: 'a_press' },
        { id: 'disarm', label: "Ask for something small instead. Nothing that costs him his job — not yet.", tone: 'disarm', to: 'a_disarm' },
        { id: 'info', label: "Show him you already know what these accounts really are.", tone: 'push', to: 'a_info' },
        { id: 'bribe', label: 'Set money on the desk.', tone: 'bribe', to: 'a_bribe' },
      ],
    },

    // --- the foot-in-the-door: the small ask, and the temptation to push too far ---
    {
      id: 'a_disarm',
      mood: 'tense',
      beats: [
        { who: 'you', art: DISARM, text: "You keep it small. Not the ledgers. Not the vault. Just — tell me if account 4471 clears through Mr. Cassar's personal book, or the general one. One line. Then I'm gone." },
        { who: 'them', art: HESITATE, text: "(a long beat, staring at the drawer, not at you) ...That's — that's nothing. That's not even really telling you anything." },
        { who: 'you', caption: true, art: HESITATE, text: "It wasn't nothing. It was the first true sentence he'd ever said out loud about what these books actually are. And a man who says the first one finds the second easier." },
      ],
      ask: "He's right on the edge of that first small yes. Let it land small, or push while he's off balance?",
      choices: [
        { id: 'small', label: 'Let it land small — just the one line, nothing more tonight.', tone: 'disarm', to: 'comp1' },
        { id: 'more', label: "Push now — 'And whose name is on the account behind it?'", tone: 'push', to: 'a_overreach' },
      ],
    },
    {
      id: 'a_overreach',
      mood: 'fear',
      beats: [
        { who: 'them', art: OVERREACH, text: "(flinches back, chair legs shrieking on the marble) That's — no. No, that's not what you— you said one line. You said just one line—" },
        { who: 'you', caption: true, art: OVERREACH, text: "I'd asked for an inch and reached for a mile before he'd even caught his breath. His hands are shaking now, and it isn't guilt anymore." },
      ],
      ask: "You spooked him reaching too fast. Back off, or press through the fear?",
      choices: [
        { id: 'backoff', label: "Back off — 'You're right. Just the one line, like I said.'", tone: 'disarm', to: 'comp1' },
        { id: 'pressthrough', label: "Press through it — 'Wyatt, you're already this far in.'", tone: 'press', to: 'o_burned' },
      ],
    },

    // --- THE COMPLICATION: the guard's rounds, then the same fork either way ---
    {
      id: 'comp1',
      mood: 'tense',
      beats: [
        { who: 'them', art: GUARD, text: "(both of you go still — keys jangling somewhere down the marble hall, footsteps unhurried, getting closer, the night guard on his rounds, one row over from yours)" },
      ],
      ask: 'Someone\'s coming. What do you do?',
      choices: [
        { id: 'freeze', label: 'Freeze — not a word, not a breath.', tone: 'disarm', to: 'comp1_freeze' },
        { id: 'cover', label: 'Cover it — call out easy and casual, like nothing\'s wrong.', tone: 'press', to: 'comp1_cover' },
        { id: 'rush', label: 'Step toward the sound — better to know who\'s there than wonder.', tone: 'push', to: 'comp1_rush' },
      ],
    },
    {
      id: 'comp1_freeze',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: FREEZE, text: 'You hold dead still. Wyatt does too, eyes locked past your shoulder. The footsteps pass the end of the row without slowing — a guard walking a route he\'s walked a thousand nights, never once expecting to find anyone in it.' },
      ],
      ask: "The moment's still yours, if you take it now. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Give him the out — 'That's all I need tonight. You did the right thing.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Push while he's grateful to still have a job — 'Good. Now the next one'll be easier.'", tone: 'push', to: 't_twist' },
      ],
    },
    {
      id: 'comp1_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: COVER, text: "(loud, easy, like it's nothing) Just closing out the Higgins transfer before I head home — long night, huh?" },
        { who: 'you', caption: true, art: COVER, text: "The footsteps hesitate half a beat — then move on, unbothered or unconvinced, you'll never know which. Wyatt's staring at you like you just walked a wire he didn't know was strung." },
      ],
      ask: "You bought the room back. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Give him the out — 'That's all I need tonight. You did the right thing.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Push while the adrenaline's still up — 'Good. Now the next one'll be easier.'", tone: 'push', to: 't_twist' },
      ],
    },
    {
      id: 'comp1_rush',
      mood: 'threat',
      beats: [
        { who: 'you', art: RUSH, text: "You're up and moving toward the sound before Wyatt can grab your sleeve—" },
        { who: 'you', caption: true, art: RUSH, text: "Empty row. Just a ring of keys still swinging on a hook where the guard hung them to check something in the back office, nothing more. Wyatt's face has gone the color of the ledger paper — you scared him worse chasing a ghost than the guard ever would have." },
      ],
      ask: "Nothing there — but he's rattled now. What do you do with the moment?",
      choices: [
        { id: 'absolve', label: "Steady him — 'Nothing. We're fine. That's all I need tonight.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Push anyway — 'Good. Now the next one'll be easier.'", tone: 'push', to: 't_twist' },
      ],
    },
    {
      id: 't_twist',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(flat, the gratitude curdling) ...So that's it. One favor and now I owe you the rest of my job. Same as everybody else in this building who ever asked me for 'just one small thing.'" },
      ],
      ask: "You turned his relief into a debt. He'll still give you more — but you're losing the man. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. I'm sorry. Forget I said that — you already did enough.'", tone: 'disarm', to: 'o_turned' },
        { id: 'take', label: "Take it and go — 'Just get me the next line, Wyatt.'", tone: 'push', to: 'o_shaky' },
      ],
    },

    // --- information asymmetry: show him you already know what he's hiding ---
    {
      id: 'a_info',
      mood: 'cold',
      beats: [
        { who: 'you', art: INFO, text: "You let him see you already know exactly what these shell names are — the same dummy accounts, the same routing, three of the numbers you could probably recite back to him yourself." },
        { who: 'them', art: SPOOKED, text: "(voice dropping to nearly nothing) How do you— nobody outside knows that. Nobody's supposed to." },
        { who: 'you', caption: true, art: SPOOKED, text: "Let it sit a second. A man who thinks his secret's safe holds every card. A man who realizes it's already out just wants to know how much worse this gets." },
      ],
      ask: "He's afraid now — not of you, of what you already know. Where do you take it?",
      choices: [
        { id: 'reassure', label: "Reassure him — 'I'm not here to expose you, Wyatt. I'm here to end this quietly.'", tone: 'disarm', to: 'a_disarm' },
        { id: 'exploit', label: "Press it — 'So you'd better make sure I stay happy.'", tone: 'push', to: 'a_info_exploit' },
      ],
    },
    {
      id: 'a_info_exploit',
      mood: 'fear',
      beats: [
        { who: 'them', art: SPOOKED, text: "(shrinks back into the chair, nodding fast, all the color gone) Whatever you need. Just — whatever you need." },
      ],
      ask: "He'll do anything now, out of raw fear rather than trust. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'Breathe. This stays between us.'", tone: 'disarm', to: 'o_shaky' },
        { id: 'menace', label: "Seal it with fear — 'Good. Because if this gets out, it's you they come for first.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- press: he threatens to call, then breaks ---
    {
      id: 'a_press',
      mood: 'threat',
      beats: [
        { who: 'you', art: PRESS, text: "You know exactly whose money that is, don't you, Wyatt. Sitting on it every night, hoping nobody ever asks." },
        { who: 'them', art: DIAL, text: "(hand darting for the black desk phone) I'll call security. I swear to God I will—" },
        { who: 'you', art: CALLBLUFF, text: "(quiet, unmoved) Go on, then. And explain to whoever answers why the account you keep re-checking every night just came up in the same breath as a stranger who walked in your side door." },
        { who: 'them', art: CHOKE, text: "(the hand stalls over the receiver, doesn't lift it)" },
      ],
      ask: "You've boxed him — scared and cornered, a dangerous mix. Ease off, or squeeze?",
      choices: [
        { id: 'easeoff', label: "Ease off — 'I'm not your enemy, Wyatt. Put the phone down.'", tone: 'disarm', to: 'a_disarm' },
        { id: 'ride', label: "Squeeze — 'The account number. Or I make the call for you.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', art: HANDOFF, text: "(hands shaking, he scrawls a routing number on a scrap and slides it across) That's — that's all I'll give you. Please. Just go." },
      ],
      ask: "You've got something — and a broken man. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'This stays between us. Breathe.'", tone: 'disarm', to: 'o_shaky' },
        { id: 'menace', label: "Seal it with fear — 'One word to anyone and it's your signature on every one of these.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money misreads a scared man ---
    {
      id: 'a_bribe',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CASHDROP, text: 'You set a fold of bills on the closed ledger. It sits there between you.' },
        { who: 'them', art: CASHSTARE, text: "(stares at it, doesn't touch it, doesn't look up) ...You think this is about money? I could lose my license. My name. You think a bank clerk sells that for a stack of bills?" },
        { who: 'you', caption: true, art: CASHSTARE, text: "The money landed wrong — insulted him, or maybe just tempted a man trying hard not to be tempted. Hard to tell which." },
      ],
      ask: "Read him. What do you do with the money now?",
      choices: [
        { id: 'double', label: "Push more — 'Enough to disappear on, then. Name the number.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pocket', label: "Take it back — 'You're right. Forget the money.'", tone: 'disarm', to: 'a_disarm' },
        { id: 'blackmail', label: "Turn it ugly — 'Take it, or I make sure everyone thinks you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'WYATT — THE FOOT IN THE DOOR',
        line: '"One line," he says, letting out a breath he\'s been holding for months, like he\'s convincing himself it\'s still true. "Just — one line, that\'s all this was." It wasn\'t. But he doesn\'t know that yet, and by the time he does, he\'ll already be in too deep to walk back out alone — same as you were, once.',
        ripple: 'One small favor becomes a standing one. Every week now an account number, a transfer, a name finds its way into your hands — nothing that looks like betrayal, everything that adds up to exactly where Cassar buries the wash.',
        reflect: "I didn't ask him for the vault. I asked him for one line he could tell himself didn't count. My father taught me that trick without meaning to — the day he signed the first paper he swore was harmless.",
        heatDelta: -1,
        grants: ['accountAccess', 'teller_turned'],
        dispositions: [{ nodeId: 'teller', set: 4 }],
        campaign: { bonds: [{ id: 'teller', delta: 2 }], faction: { id: 'bank', delta: 1 }, ledger: ['teller_turned'] },
        debrief: { principle: 'foot-in-the-door',
          note: "You never asked Wyatt for the ledgers. You asked for one line he could tell himself didn't count — and once he'd said it out loud, saying the next one felt like staying consistent with the man who'd already spoken up once. That's the **foot-in-the-door**: the small yes reshapes what a person believes about themselves, and the big yes just has to match it." },
      },
    },
    {
      id: 'o_shaky',
      mood: 'cold',
      portrait: SHAKY_END,
      outcome: {
        key: 'shaky', tone: 'mixed',
        title: 'WYATT — A NERVOUS ASSET',
        line: "He hands over what you asked for, hands still shaking, eyes on the door the whole time. You never told him why you needed it, or how far up this goes, or what happens to him if it ever comes out. He didn't ask. He was too scared to.",
        ripple: "You've got your access. But a frightened man who doesn't understand the stakes is a man who might say the wrong thing to the wrong person the moment the fear gets too big to carry alone.",
        reflect: "I kept him in the dark on purpose. Safer for me. I didn't stop to think what not knowing does to a man already this scared.",
        grants: ['accountAccess', 'teller_shaky'],
        dispositions: [{ nodeId: 'teller', set: 2 }],
        campaign: { bonds: [{ id: 'teller', delta: -1 }], ledger: ['teller_shaky'] },
        debrief: { principle: 'information-asymmetry',
          note: "You held every card in that room and showed him none of them. That protects you — but a source who doesn't understand what he's actually part of can't manage the risk either. **Information asymmetry** cuts both ways: the party left in the dark is also the party most likely to panic wrong." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT_END,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'WYATT — BOUGHT, NOT TURNED',
        line: "He takes the money without another word, counts it once, and slides the account details across like he's selling a car. First time in his life he's ever done this for cash instead of conscience. It won't be the last.",
        ripple: 'You have your access. But a man bought once stays for sale — to Cassar, to whoever counts higher next.',
        reflect: "Ricci buys people and calls it business. Tonight, so did I — and it worked faster than anything else I tried.",
        grants: ['accountAccess', 'teller_bought'],
        dispositions: [{ nodeId: 'teller', set: 3 }],
        campaign: { money: -300, bonds: [{ id: 'teller', delta: -1 }], ledger: ['teller_bought'] },
        debrief: { principle: 'foot-in-the-door',
          note: "You skipped the small yes and paid for the big one outright. There was no first small step to reshape who he believed himself to be — just a price on a man who'd never sold anything before. A bought yes isn't a **changed** man. It's a rental, and rentals run out." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'WYATT — FOREWARNED',
        line: "He doesn't hand you anything. The second you're out the side door, he's dialing compliance, or Cassar's people direct — whoever he thinks will be less frightening than you were. Better the devil who signs his check.",
        ripple: "No access. Worse — the bank now knows somebody's circling the shell accounts. Cassar tightens the books before you ever get close to the vault.",
        reflect: "I was so sure I held every card in that room. I forgot he had a phone, and a fear bigger than me standing in front of him.",
        heatDelta: 2,
        worldFlags: ['cassarForewarned'],
        dispositions: [{ nodeId: 'teller', set: 0 }],
        campaign: { bonds: [{ id: 'teller', delta: -2 }], faction: { id: 'bank', delta: -1 }, ledger: ['teller_burned'] },
        debrief: { principle: 'information-asymmetry',
          note: "You assumed the asymmetry ran one way — that you knew more than him and that was the whole game. You forgot he still knew one thing you didn't: exactly who to call, and how fast, once the fear tipped past what you were offering him. Whoever's left holding the last piece of information still has a move." },
      },
    },
  ],
};
