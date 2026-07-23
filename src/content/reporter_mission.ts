import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → the read → the guilt bomb →
// the complication → the branches → each ending its own image + mood).
const DESK = 'assets/art/scene/reporter_desk.jpg';           // establishing: the one lit desk left in a dead newsroom
const DRAWER = 'assets/art/scene/reporter_drawer.jpg';       // reflex — she slides the locked drawer shut, not looking up
const WARY = 'assets/art/scene/reporter_wary.jpg';           // "the paper's closed, try the front desk"
const DOORWAY = 'assets/art/scene/reporter_doorway.jpg';     // your silhouette in the newsroom aisle
const LEVEL = 'assets/art/scene/reporter_level.jpg';         // she looks up, pen stilling — "what do you want"
const SPIKED = 'assets/art/scene/reporter_spiked.jpg';       // the woven read, right: her glance at the drawer
const CALC = 'assets/art/scene/reporter_calc.jpg';           // the woven read, wrong: a hungry flicker, pricing you
const ITCH = 'assets/art/scene/reporter_itch.jpg';           // the woven read, wrong: her hand stills on the drawer, an old scar
const OFFER = 'assets/art/scene/reporter_offer.jpg';         // arms crossed — "what's the trade"
const WEIGH = 'assets/art/scene/reporter_weigh.jpg';         // the long calculating silence
const STUDY = 'assets/art/scene/reporter_study.jpg';         // studies you like a wire report for the lie
const DREAD = 'assets/art/scene/reporter_dread.jpg';         // jaw tight — the 3 a.m. nightmare
const NAME = 'assets/art/scene/reporter_name.jpg';           // you name her dead source
const DRAIN = 'assets/art/scene/reporter_drain.jpg';         // the pen stops, composure gone
const CONFESS = 'assets/art/scene/reporter_confess.jpg';     // "his name was Marek"
const PHONE = 'assets/art/scene/reporter_phone.jpg';         // THE COMPLICATION: the desk phone rings, blocked number
const STILLRING = 'assets/art/scene/reporter_stillring.jpg';// it rings out unanswered, the worse silence after
const ANSWERED = 'assets/art/scene/reporter_answered.jpg';   // you lift it — dead air, then a click
const CUTCORD = 'assets/art/scene/reporter_cutcord.jpg';     // you rip the cord from the wall
const STUNG = 'assets/art/scene/reporter_stung.jpg';         // grief hardens back into guarded cold
const DEFIANT = 'assets/art/scene/reporter_defiant.jpg';     // "I've had actual muscle sit where you're standing"
const COUNTER = 'assets/art/scene/reporter_counter.jpg';     // your quiet counter-threat
const CHECK = 'assets/art/scene/reporter_check.jpg';         // her eyes flick to the dark window, checking
const HANDOVER = 'assets/art/scene/reporter_handover.jpg';   // shaking, she slides the folder across
const CASH = 'assets/art/scene/reporter_cash.jpg';           // the envelope lands on the desk
const INSULT = 'assets/art/scene/reporter_insult.jpg';       // she doesn't touch it, doesn't blink
const WEARY = 'assets/art/scene/reporter_weary.jpg';         // "some of us are short on something you can't envelope"
const ALLIED_END = 'assets/art/scene/reporter_allied_end.jpg';       // she unlocks the drawer for real
const LEVERAGED_END = 'assets/art/scene/reporter_leveraged_end.jpg'; // hands it over, won't meet your eyes
const BOUGHT_END = 'assets/art/scene/reporter_bought_end.jpg';       // folds the envelope away, nothing behind the eyes
const BURNED_END = 'assets/art/scene/reporter_burned_end.jpg';       // already typing, decided you're a risk

// IRIS KELL — a hungry, endangered investigative reporter chasing the one story
// that could bring the whole Hall down. She keeps a locked drawer of spiked
// stories — pieces her editor killed the day a call came in from upriver — and
// she's still here at midnight instead of asleep. Two years ago a source inside
// the Hall, a clerk named Marek, fed her the first thread on Vane. He stopped
// answering. The story never ran. She hasn't trusted an offer of protection
// since. Four endings, each bending the board its own way:
//   ALLIED     — a fair trade, protection for print: she's your ally, armed
//   LEVERAGED  — you get the lever, but as a source used, not a partner trusted
//   BOUGHT     — cash "worked", but you paid for the wrong currency
//   BURNED     — you never earned the trade, so she runs it alone and early —
//                Vane reads it forewarned, and it costs you
// No option is simply correct. Fair dealing wins her outright; force, cash, or
// grief-as-leverage all get you *something*, but never her, and pushed far
// enough she protects herself the only way left — with the presses, without you.
// Palette 'reese' (reused, no theme edit) lights her cold and civic, brass and
// storm-grey, same register as the Hall itself.
// THE WOVEN READ: before a word is spoken, you size up what she really IS —
// a fair trader, a mercenary, or a woman one bad night from recklessness. The
// true read (a trader, not a mark) opens the strong approaches with her actual
// leverage already understood; a wrong read still reaches every approach, but
// costs you a beat of misjudging a woman who's been misjudged into an early grave
// once already.
// THE COMPLICATION: on the name/guilt path, her confession about Marek is cut off
// by her desk phone ringing — a blocked number, the second call tonight — a
// choice under pressure (ignore/answer/cut the cord) before the scene rejoins the
// same offer-the-real-trade/use-her-grief fork into the same four endings.
export const REPORTER_MISSION: Mission = {
  id: 'reporter_mission',
  actionId: 'reporter_turn',
  nodeId: 'reporter',
  label: 'Turn the reporter',
  palette: 'reese',
  scene: 'assets/art/scene/reporter.jpg',
  teaches: ['information-asymmetry', 'plausible-deniability'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: DESK, text: "Newsrooms empty out by midnight — except for Iris Kell's corner, buried in carbons and cold coffee, one lamp burning over a typewriter that never quite stops. She's chasing something. So am I." },
        { who: 'you', caption: true, art: DRAWER, text: "There's a locked drawer by her knee. I've heard what's in it — stories her editor spiked the day a call came in from the Hall. She kept them anyway. Nobody keeps a dead story unless they mean to raise it." },
        { who: 'them', art: WARY, text: "(not looking up, pen still moving) Whoever sent you, the answer's no. I don't do favors for strangers who wait till the building's empty." },
        { who: 'you', art: DOORWAY, text: "Nobody sent me. I'm here about the same story that drawer's full of." },
        { who: 'them', art: LEVEL, text: "(finally looks up, the pen stilling) …That's a specific thing to know. Sit down before I decide you're lying. What do you want." },
      ],
      choices: [
        { id: 'read', label: "Read her before you make an offer. ▸", tone: 'disarm', to: 'read_reporter' },
      ],
    },

    // THE READ — size Iris up, then judge what she really is (routes to the same
    // three branches the old text-fork did, but the player earns the read).
    {
      id: 'read_reporter',
      mood: 'tense',
      portrait: DESK,
      read: {
        ask: "Paranoia's kept her alive three years on this beat. Before you say another word — what IS Iris Kell, really?",
        hint: 'Tap what you notice.',
        clues: [
          { x: 48, y: 26, label: 'her eyes', note: "They price you on sight — a quick, hungry flicker, fast-hidden. She reads people for a living." },
          { x: 36, y: 60, label: 'the still pen', note: "A typewriter that never quite stops. Past midnight and she's chasing, not sleeping." },
          { x: 58, y: 74, label: 'the locked drawer', note: "By her knee. She touches it like a scar — spiked stories, and a source they cost her.", grants: 'saw_scar' },
          { x: 80, y: 38, label: 'the dark window', note: "She keeps checking it. Three years on this beat, never once out from under a watching eye." },
          { x: 28, y: 46, label: 'cold coffee', note: "One lamp, coffee gone cold, no bed. Whatever's in that drawer, she means to raise it." },
        ],
        options: [
          { id: 'read_fairtrade', label: "A trader, not a mark. The story's her only currency — she'll spend it, but only for a fair price.", to: 'r_fairtrade' },
          { id: 'read_forsale', label: 'A byline-chaser. Dangle enough access or cash and she prints whatever you want.', to: 'r_forsale' },
          { id: 'read_reckless', label: "A woman one bad night from running it all regardless of cost. She just needs a shove.", to: 'r_reckless' },
        ],
      },
    },

    // --- THE WOVEN READ: what you decide she truly is, before you say a word ---
    {
      id: 'r_fairtrade',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: SPIKED, text: "The spiked stories she wouldn't throw out. The lamp still burning at midnight instead of a bed. She isn't for sale and she isn't reckless — she's a trader who got burned trusting the wrong buyer once, and now she prices everything. Including you." },
      ],
      ask: "You know what she's actually selling and what she needs back for it. How do you open a trader who checks the exits twice?",
      choices: [
        { id: 'disarm', label: "Level with her — 'I'm not here to use you. I'm here to make a fair trade.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'Two years ago you had a source inside the Hall.'", tone: 'push', requires: ['saw_scar'], to: 'n1' },
        { id: 'press', label: "Crowd her — 'You don't get this story without me, and you know it.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set an envelope on the desk.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CALC, text: "You peg her as an operator angling for a payday. For a second something in her face agrees with you — a quick, hungry flicker at the thought of an exclusive. Then it's gone, replaced by something colder: she's already deciding what you're worth to sell to someone else." },
      ],
      ask: "Price a story like a paycheck and she'll deal — but she'll shop your interest to whoever tops your bid. Careful how you open her.",
      choices: [
        { id: 'bribe', label: 'Set an envelope on the desk.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Crowd her — 'You don't get this story without me, and you know it.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Level with her — 'I'm not here to use you. I'm here to make a fair trade.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'Two years ago you had a source inside the Hall.'", tone: 'push', requires: ['saw_scar'], to: 'n1' },
      ],
    },
    {
      id: 'r_reckless',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: ITCH, text: "You decide she's one bad night from just running the whole thing and daring the Hall to come for her. Then her hand goes still on that locked drawer, like touching a scar. That's not a woman itching to burn it all down. That's a woman who already did that once, and it cost her someone." },
      ],
      ask: "Push a woman like that and she doesn't recklessly leap — she remembers exactly why she stopped. How do you open her, knowing that now?",
      choices: [
        { id: 'name', label: "Quietly — 'Two years ago you had a source inside the Hall.'", tone: 'push', requires: ['saw_scar'], to: 'n1' },
        { id: 'press', label: "Crowd her — 'You don't get this story without me, and you know it.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Level with her — 'I'm not here to use you. I'm here to make a fair trade.'", tone: 'disarm', to: 'd1' },
        { id: 'bribe', label: 'Set an envelope on the desk.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the name: the guilt bomb ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'you', art: NAME, text: 'Two years ago you had a source inside the Hall. He gave you the first thread on Vane. Then he stopped answering, and the story never ran.' },
        { who: 'them', art: DRAIN, text: '(the pen finally stops; all the composure goes out of her at once) …How do you know about him.' },
        { who: 'you', art: DRAIN, text: "Because I've been three names behind you the whole time. His name was the one your editor made you cut." },
        { who: 'them', art: CONFESS, text: '(quiet, raw) Marek. His name was Marek. I promised him a byline and a lawyer if it went bad. I got him a shallow grave in the tide flats instead. I haven\'t touched that story since — until tonight.' },
        { who: 'them', art: PHONE, text: "(the desk phone rings, cutting through the quiet — she freezes, eyes on it) That's the second blocked call tonight. Nobody hides their number at this desk unless they want me to know they can reach me anywhere." },
      ],
      ask: "The phone won't stop ringing and she's staring at it like it's already decided something. What do you do?",
      choices: [
        { id: 'ignore', label: "Cover it with your hand — 'Don't. Whatever it is, it wants a reaction.'", tone: 'disarm', to: 'n1_ignore' },
        { id: 'answer', label: "Take it yourself — 'Give it here.'", tone: 'press', to: 'n1_answer' },
        { id: 'cut', label: 'Yank the cord from the wall before it rings again.', tone: 'push', to: 'n1_cut' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'n1_ignore',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: STILLRING, text: "You lay a hand over the receiver without lifting it. It rings out — eight, nine, ten times — then stops. The silence after is worse than the ringing. Iris breathes like she's just surfaced from underwater." },
      ],
      ask: "The moment's still yours, if you take it now. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer her the real trade — 'Protection for print. That's the deal, and you choose what you give.'", tone: 'disarm', to: 'o_allied' },
        { id: 'twist', label: "Use it — 'Good. That fear's useful. You need me more than you did an hour ago.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_answer',
      mood: 'tense',
      beats: [
        { who: 'you', art: ANSWERED, text: "You lift the receiver before she can stop you. Dead air, a held breath on the other end, then a click and a dial tone." },
        { who: 'you', caption: true, art: ANSWERED, text: "Whoever it was got exactly what they wanted — confirmation someone new is in the room with her." },
      ],
      ask: "You took the call meant to rattle her. Now what do you do with the moment it bought?",
      choices: [
        { id: 'absolve', label: "Offer her the real trade — 'Protection for print. That's the deal, and you choose what you give.'", tone: 'disarm', to: 'o_allied' },
        { id: 'twist', label: "Use it — 'Good. That fear's useful. You need me more than you did an hour ago.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_cut',
      mood: 'threat',
      beats: [
        { who: 'you', art: CUTCORD, text: "You rip the cord out of the wall before it can ring a third time." },
        { who: 'you', caption: true, art: CUTCORD, text: "Iris stares at the dangling wire like it just proved every paranoid thing she's ever believed about this job — including the part where you're one more thing she can't control." },
      ],
      ask: "Silence, but a harder one than she wanted. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer her the real trade — 'Protection for print. That's the deal, and you choose what you give.'", tone: 'disarm', to: 'o_allied' },
        { id: 'twist', label: "Use it — 'Good. That fear's useful. You need me more than you did an hour ago.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the rawness closes back into something harder, colder) …There it is. For a second I forgot what everyone who's ever 'helped' me actually wanted. Fine. Tell me what you need, then get out of my newsroom." },
      ],
      ask: "You turned her grief into leverage. She'll still deal — but you've spent something you can't easily buy back. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. I'm sorry. This is a trade, not a debt. You choose what you give.'", tone: 'disarm', to: 'o_allied' },
        { id: 'take', label: "Take it anyway — 'Just get me the story when it's ready.'", tone: 'push', to: 'o_leveraged' },
      ],
    },

    // --- disarm: the offer, weighed by a woman who's been burned before ---
    {
      id: 'd1',
      mood: 'cold',
      beats: [
        { who: 'them', art: OFFER, text: '(sets the pen down, arms crossed, watching you carefully) Everyone who\'s ever told me "I\'m not here to use you" was here to use me. So. What\'s the trade.' },
        { who: 'you', art: OFFER, text: 'Protection while you dig, and I go first — I tell you what I know before you give me a line. You print when it\'s safe to print, not when it\'s safe for me.' },
        { who: 'them', art: WEIGH, text: "(a long silence, calculating something old) …That's the first offer I've had in two years that didn't ask me to go first." },
      ],
      ask: "She's listening past her guard for the first time tonight. Careful — mishandle this and it closes again.",
      choices: [
        { id: 'hope', label: "Give her something to hold — 'I mean it. Ask anyone who owes me.'", tone: 'disarm', to: 'd_hope' },
        { id: 'fear', label: "Press the clock — 'Vane's men don't wait for you to be ready.'", tone: 'press', to: 'd_fear' },
      ],
    },
    {
      id: 'd_hope',
      mood: 'hope',
      beats: [
        { who: 'them', art: STUDY, text: "(studies you like she's reading a wire report for the lie) …God help me, I've heard worse pitches from my own editor." },
      ],
      ask: "She's close to trusting you outright. Seal it plain, or lock it down fast before she can change her mind?",
      choices: [
        { id: 'word', label: "Your word, plain — 'Then we have a deal. Protection for print.'", tone: 'disarm', to: 'o_allied' },
        { id: 'bind', label: "Push it faster — 'Then give me what you've got tonight.'", tone: 'push', to: 'o_leveraged' },
      ],
    },
    {
      id: 'd_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: DREAD, text: "(jaw tightens) You think I don't know that? I've had the same nightmare about a knock at 3 a.m. since the last time someone promised me protection and meant it right up until they didn't." },
      ],
      ask: "She's more scared now than persuaded. Pull back into the deal you offered, or use the fear to close her faster?",
      choices: [
        { id: 'pullback', label: "Pull back — 'Then let's do this on your terms, not mine.'", tone: 'disarm', to: 'o_allied' },
        { id: 'pushon', label: "Close it now — 'Then don't wait. Give me something tonight.'", tone: 'push', to: 'o_leveraged' },
      ],
    },

    // --- press: she calls your bluff, until she can't quite ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: DEFIANT, text: "(a short humorless laugh) You think crowding a reporter's desk is a threat? I've had actual muscle sit where you're standing. Try harder, or get out." },
        { who: 'you', art: COUNTER, text: "(quiet) Then you already know how this goes. I'm not the one you need to worry about walking through that door tonight." },
        { who: 'them', art: CHECK, text: "(the defiance flickers — just for a second, her eyes cut to the dark newsroom windows, checking)" },
      ],
      ask: "You've rattled the one thing she can't quite laugh off — that she's still being watched. Let her breathe, or squeeze?",
      choices: [
        { id: 'easeoff', label: "Let her breathe — 'I'm not one of them, Iris. Sit down.'", tone: 'disarm', to: 'd1' },
        { id: 'ride', label: "Squeeze — 'Then give me something before whoever's watching decides you're not worth the risk.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', art: HANDOVER, text: '(jaw tight, she slides a folder across — carbons of the spiked story, names and dates half-redacted) Take it. Don\'t ask me for a name tonight. I don\'t have one left to spare.' },
      ],
      ask: "You've got the lever — and a woman who just gave up ground out of fear, not trust. What do you leave her as?",
      choices: [
        { id: 'calm', label: "Steady her — 'This stays quiet until you're ready. You still call it.'", tone: 'disarm', to: 'o_leveraged' },
        { id: 'menace', label: "Seal it hard — 'Good. Now you've got a reason to move fast.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: cash misprices a woman whose currency was never money ---
    {
      id: 'c1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CASH, text: "You set an envelope of cash on the desk, next to the typewriter." },
        { who: 'them', art: INSULT, text: "(doesn't touch it, doesn't blink) …You think this is what I'm short on." },
        { who: 'you', art: INSULT, text: "Everyone's got a price." },
        { who: 'them', art: WEARY, text: "(tired, almost sad) Some of us are short on something you can't put in an envelope. Try again, or walk." },
      ],
      ask: "The money landed like an accusation. Read her.",
      choices: [
        { id: 'double', label: "Push more — 'Enough to relocate on, if it comes to that. Name it.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pocket', label: "Take it back — 'You're right. Forget the money. What do you actually need.'", tone: 'disarm', to: 'd1' },
        { id: 'turnugly', label: "Turn it ugly — 'Take it, or I make sure your editor hears you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_allied',
      mood: 'warm',
      portrait: ALLIED_END,
      outcome: {
        key: 'allied', tone: 'good',
        title: 'IRIS KELL — THE PRESS IS ARMED',
        line: 'She unlocks the drawer for real this time — not just tonight\'s notes, but the old spiked file on Marek — and slides both across. "Protection for print. You keep your word, I keep digging. When it\'s ready, this runs above the fold, and your name stays out of it unless you want it in."',
        ripple: "She feeds you what she's already confirmed on Vane before you ever sit down with him — and the day it breaks, the Hall won't be able to bury it fast enough.",
        reflect: "First time in this whole climb somebody handed me something and I didn't have to take it. Marek would've liked her.",
        heatDelta: -1,
        grants: ['pressLever', 'reporter_allied'],
        dispositions: [{ nodeId: 'reporter', set: 4 }],
        campaign: { bonds: [{ id: 'reporter', delta: 2 }], faction: { id: 'hall', delta: 1 }, ledger: ['reporter_allied'] },
        debrief: { principle: 'information-asymmetry',
          note: "Her story was the one thing the Hall didn't have. Your protection was the one thing she couldn't get alone. Neither of you gave that up for free — you traded the gap evenly. That's exactly what **information asymmetry** rewards: whoever holds the missing piece sets the price, and a fair price buys loyalty a threat never could." },
      },
    },
    {
      id: 'o_leveraged',
      mood: 'cold',
      portrait: LEVERAGED_END,
      outcome: {
        key: 'leveraged', tone: 'mixed',
        title: 'IRIS KELL — A SOURCE, NOT A PARTNER',
        line: "She hands over what you asked for — but won't meet your eyes doing it. You got the lever. You didn't get her.",
        ripple: "If this comes back on her, she's got nothing from you in writing, no promise she believed — just a favor she'll remember you took, not gave.",
        reflect: "I got the story out of her the way Ricci gets a signature — fast, and before anyone could think better of it.",
        grants: ['pressLever', 'reporter_wary'],
        dispositions: [{ nodeId: 'reporter', set: 2 }],
        campaign: { bonds: [{ id: 'reporter', delta: -1 }], ledger: ['reporter_wary'] },
        debrief: { principle: 'plausible-deniability',
          note: "You wanted the lever without owning the risk — no real promise, nothing that traces back to you if this goes bad for her. That's **plausible deniability**, the cut-out's whole trick: keep your hands clean of the fallout. Save it for the men who'd burn you. Use it on the one ally ready to trust you first, and it costs you the very thing you needed her for." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT_END,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'IRIS KELL — BOUGHT, NOT BACKED',
        line: 'She takes the envelope without a word and folds it into her coat like something shameful, then slides you a folder in return. Transactional. Cold. Nothing behind the eyes that were burning an hour ago.',
        ripple: "You've got the lever — but a source who was paid instead of trusted checks whether the next envelope comes from the other side.",
        reflect: 'Marlowe pays people to forget who they were. Tonight I did the same thing to a woman who used to believe in something.',
        grants: ['pressLever', 'reporter_bought'],
        dispositions: [{ nodeId: 'reporter', set: 3 }],
        campaign: { money: -200, bonds: [{ id: 'reporter', delta: -1 }], ledger: ['reporter_bought'] },
        debrief: { principle: 'information-asymmetry',
          note: "The cash 'worked' — but you priced the wrong thing. Her currency was never dollars, it was a fair trade for the one asset she actually held: the story. **Information asymmetry** means the missing piece decides the price. Pay for the wrong piece and you buy a source instead of an ally." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: "IRIS KELL — SHE RUNS IT WITHOUT YOU",
        line: "She doesn't answer. She just starts typing — fast, final, a woman who's decided you're one more risk she can't afford to carry. By morning a half-sourced version of the story is already moving through the wire desk, weeks before you were ready.",
        ripple: "Vane reads the early edition same as everyone else — and knows exactly who's been circling him. You just told him you're coming.",
        reflect: "She protected herself the only way she had left. I can't even say she was wrong to.",
        heatDelta: 2,
        worldFlags: ['vaneForewarned'],
        dispositions: [{ nodeId: 'reporter', set: 0 }],
        campaign: { bonds: [{ id: 'reporter', delta: -2 }], faction: { id: 'hall', delta: -1 }, ledger: ['reporter_burned'] },
        debrief: { principle: 'plausible-deniability',
          note: "You gave her every reason to cut you loose and none to trust you, so she used her own cut-out — ran the story on her own timeline, unnamed sources, nothing that traces to you or shields you. That's **plausible deniability** working exactly as designed, just not for your side. Fail to earn the trade, and the other side's insulation becomes your exposure." },
      },
    },
  ],
};
