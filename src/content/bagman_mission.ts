import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the count → the read forks → the name
// that cracks him → the complication at the door → each ending its own image +
// mood). Modeled exactly on sal_mission.ts / gallo_mission.ts.
const BASE = 'assets/art/scene/bagman.jpg';                 // wide: the back room, one bulb, cash on the table
const COUNT = 'assets/art/scene/bagman_count.jpg';          // Milo alone, tallying bricks of cash under the bulb
const TALLY = 'assets/art/scene/bagman_tally.jpg';          // your surveillance pov — the room, the sloppy stacks
const STARTLE = 'assets/art/scene/bagman_startle.jpg';      // he startles, sweeps cash into a drawer
const DOORFRAME = 'assets/art/scene/bagman_doorframe.jpg';  // your silhouette in the back-room doorway
const SWEAT = 'assets/art/scene/bagman_sweat.jpg';          // close on his damp, panicked face — "what do you want"
const FEARTELL = 'assets/art/scene/bagman_feartell.jpg';    // the tell: hands trembling, eyes on the exit not you
const SKIMLOOK = 'assets/art/scene/bagman_skimlook.jpg';    // the wrong read: his hand freezes over cash, flinches off it
const STIFFEN = 'assets/art/scene/bagman_stiffen.jpg';      // the wrong read: draws up at DeLuca's name — a flinch, not loyalty
const NAMEDROP = 'assets/art/scene/bagman_namedrop.jpg';    // you, quiet, naming Tomas Vidal
const RECOGNIZE = 'assets/art/scene/bagman_recognize.jpg';  // the color drains — he's seen that name on paper
const CONFESS = 'assets/art/scene/bagman_confess.jpg';      // fast, flat confession — "I never ask whose"
const DELIVERY = 'assets/art/scene/bagman_delivery.jpg';    // THE COMPLICATION: a satchel of cash thrown through the door slot
const CHECKIN = 'assets/art/scene/bagman_checkin.jpg';      // a fist on the door — DeLuca's man checking in
const HOLD = 'assets/art/scene/bagman_hold.jpg';            // freeze: both of you dead still, boots receding
const COVER = 'assets/art/scene/bagman_cover.jpg';          // cover: loud and bored, buys the room back
const LEAN = 'assets/art/scene/bagman_lean.jpg';            // push: you lean into the fear right through the door
const STUNG = 'assets/art/scene/bagman_stung.jpg';          // the twist: guilt hardens into wounded calculation
const EASE = 'assets/art/scene/bagman_ease.jpg';            // disarm: his shoulders drop half an inch
const VENT = 'assets/art/scene/bagman_vent.jpg';            // he vents — DeLuca pockets the cut, eats none of the risk
const OFFERHAND = 'assets/art/scene/bagman_offerhand.jpg';  // you offer him a door out
const DOUBT = 'assets/art/scene/bagman_doubt.jpg';          // he studies you, calculating something besides money
const WARM = 'assets/art/scene/bagman_warm.jpg';            // something close to relief crosses his face
const AUDIT = 'assets/art/scene/bagman_audit.jpg';          // he goes still — "you know about the audit"
const THREATEN = 'assets/art/scene/bagman_threaten.jpg';    // he threatens to call for help two rooms over
const CALLBLUFF = 'assets/art/scene/bagman_callbluff.jpg';  // you call the bluff, don't move
const CHOKE = 'assets/art/scene/bagman_choke.jpg';          // the shout dies behind his teeth
const HANDOVER = 'assets/art/scene/bagman_handover.jpg';    // shaking, he shoves the tally sheets across
const CASHOFFER = 'assets/art/scene/bagman_cashoffer.jpg';  // you add your own money to the pile already on the table
const STARE = 'assets/art/scene/bagman_stare.jpg';          // he stares at it like a trick
const MONEYTALK = 'assets/art/scene/bagman_moneytalk.jpg';  // "getting caught is the problem, not money"
const TURNED_END = 'assets/art/scene/bagman_turned_end.jpg'; // he drags out his own hidden tin-box count
const BOUGHT_END = 'assets/art/scene/bagman_bought_end.jpg'; // cold, transactional, sheets handed over without a look
const BURNED_END = 'assets/art/scene/bagman_burned_end.jpg'; // rigid, blank, already planning which door to run for

// MILO — DeLuca's bagman. He doesn't collect, doesn't lean on anybody, doesn't
// carry a gun. He counts. Every dollar DeLuca skims off the Nine Streets passes
// through this back room before it goes anywhere else, and Milo pockets a cut off
// the top for the privilege of never asking questions. That's made him sloppy —
// and it's made him easy to misread as either a greedy skimmer or a loyal soldier,
// when he's neither. He's a scared middle-man who eats none of the risk DeLuca
// runs and knows it, and some of what crosses his table doesn't trace to any
// cargo at all — the same phantom-manifest hole the player first found in Father
// Gallo's book (moneyTrail). The true read: he's not for sale and he's not
// devoted. He's terrified of the coming audit and looking for a way to not be the
// one left holding the bag when it lands. THE COMPLICATION: mid-confession, a
// fresh satchel of cash gets thrown through the door slot and someone raps on the
// door checking he's alone — a real interruption with real danger, not a delay.
// Three endings:
//   TURNED — you give him an exit from the loss he already sees coming; he opens
//            his own side-count of the phantom cash and stays your source
//   BOUGHT — you pay for it and get it, cold and transactional; a bought agent
//            stays for sale to whoever counts DeLuca's money next
//   BURNED — you push the fear past what he can carry; he stops calculating and
//            just runs — straight to DeLuca
// Palette 'sal' reused deliberately: another sickly, single-bulb money man.
export const BAGMAN_MISSION: Mission = {
  id: 'bagman_mission',
  actionId: 'bagman_turn',
  nodeId: 'bagman',
  label: 'Turn the bagman',
  palette: 'sal',
  scene: 'assets/art/scene/bagman.jpg',
  teaches: ['follow-the-money', 'principal-agent', 'loss-aversion'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: TALLY, text: "Milo Kessler doesn't run anything on the Nine Streets. He doesn't collect, doesn't lean on anybody, doesn't carry a gun anyone's ever seen. He counts. Every dollar DeLuca skims off this district passes through this one back room — a scale, an adding machine, a bulb on a cord — before it goes anywhere else." },
        { who: 'you', caption: true, art: COUNT, text: "Gallo's book told me where the money gets clean. This room is where it moves next. And some of what crosses Milo's table doesn't trace to any cargo I can find — the same hole my father found in his own ledgers, seven years before it killed him." },
        { who: 'them', art: STARTLE, text: "(cash vanishing into a drawer, the adding machine spilling tape onto the floor) Christ— this door was locked. I locked this door." },
        { who: 'you', art: DOORFRAME, text: "It was. Sit down, Milo. I didn't come to take anything off this table." },
        { who: 'them', art: SWEAT, text: "(hasn't stopped sweating since the word 'Milo') You know my name. Nobody who knows my name is just visiting. What do you want." },
      ],
      ask: "He's not reaching for a weapon and he's not calling for help — he's doing math, fast, on what you might already know. Three weeks of watching this room boil down to one question. What IS Milo, really?",
      choices: [
        { id: 'read_scared', label: "A man who never asks what he's counting — because not knowing is the only alibi he's got left.", tone: 'disarm', to: 'r_scared' },
        { id: 'read_greedy', label: "A skimmer who pockets his cut and risks nothing. Money moves him, plain and simple.", tone: 'bribe', to: 'r_greedy' },
        { id: 'read_loyal', label: "DeLuca's man to the bone — too scared of the boss to ever turn.", tone: 'press', to: 'r_loyal' },
      ],
    },

    // --- THE WOVEN READ: what you decide Milo truly is, before you say a word ---
    {
      id: 'r_scared',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: FEARTELL, text: "His hands are trembling around a stack he's already counted twice. His eyes keep going to the door, not to me. A guilty man watches the man accusing him. A scared man watches his own exit. Milo's watching the exit." },
      ],
      ask: "You know what's eating him before he's said a word. How do you open a man counting his own way out?",
      choices: [
        { id: 'disarm', label: "Hands open — 'I'm not DeLuca's, and I'm not here to hurt you.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'The manifest you move cash for doesn't match a single crate. My father found that hole first.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Corner him — 'You're not half as careful as you think you are, Milo.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set your own money next to his.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_greedy',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: SKIMLOOK, text: "You decide he's simple — a man who skims because skimming's easy, and easy men deal with whoever pays best. Then his hand freezes over a brick of DeLuca's cash like it might bite him, and pulls back like it was never really his to want." },
      ],
      ask: "If he were simply greedy, that hand wouldn't have flinched off his own boss's money. Careful how you open a man who's scared of the cash in front of him.",
      choices: [
        { id: 'bribe', label: 'Set your own money next to his.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Corner him — 'You're not half as careful as you think you are, Milo.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Hands open — 'I'm not DeLuca's, and I'm not here to hurt you.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'The manifest you move cash for doesn't match a single crate. My father found that hole first.'", tone: 'push', to: 'n1' },
      ],
    },
    {
      id: 'r_loyal',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: STIFFEN, text: "You peg him for one of DeLuca's — loyal by fear, the kind who'd eat a beating before he'd talk. Then his shoulders come up at DeLuca's name like a flinch dressed as respect, and it isn't the boss's temper he's bracing for. It's something bigger, coming, that DeLuca can't stop either." },
      ],
      ask: "That's not the posture of a loyal man. That's a man bracing for something past his own boss. How do you open him now?",
      choices: [
        { id: 'press', label: "Corner him — 'You're not half as careful as you think you are, Milo.'", tone: 'press', to: 'p1' },
        { id: 'name', label: "Quietly — 'The manifest you move cash for doesn't match a single crate. My father found that hole first.'", tone: 'push', to: 'n1' },
        { id: 'disarm', label: "Hands open — 'I'm not DeLuca's, and I'm not here to hurt you.'", tone: 'disarm', to: 'd1' },
        { id: 'bribe', label: 'Set your own money next to his.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the name: it lands on the phantom-manifest thread, then THE COMPLICATION ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'you', art: NAMEDROP, text: "The manifest with the hole in it — the one that never once matched a crate. My father found that same hole in his own books, and it cost him his name, and then it cost him his life. Tomas Vidal." },
        { who: 'them', art: RECOGNIZE, text: "(the color drains out of him, a key still under his thumb) Vidal. That's— (he doesn't finish it) I've seen that name. On paper. Three years of paper." },
        { who: 'them', art: CONFESS, text: "(fast, flat, like it hurts less said quick) I move the skim for a manifest that's never had cargo behind it. Never asked whose. Never wrote down more than I had to. That's the job — you carry the bag, you don't look inside it twice." },
        { who: 'you', caption: true, art: DELIVERY, text: "A slot in the door bangs open — a canvas satchel drops onto the floor between you, thrown by someone who didn't wait for an answer. More cash. More weight for a room that already doesn't add up." },
        { who: 'them', art: CHECKIN, text: "(a fist on the door, a voice behind it) 'Milo. You in there talkin' to yourself again? Open up.' He's gone rigid, eyes flicking between the door and you like he's about to bolt through the wall." },
      ],
      ask: "Whoever's outside is one wrong word from finding you both. What do you do?",
      choices: [
        { id: 'freeze', label: "Freeze — not a word, not a breath.", tone: 'disarm', to: 'n1_freeze' },
        { id: 'cover', label: "Cover it — loud and bored: 'Milo, if you can't count past a hundred without help, that's your problem.'", tone: 'press', to: 'n1_cover' },
        { id: 'push', label: "Lean into it — quiet and fast, right through the knocking: 'You really want to be holding this bag when somebody finally counts it?'", tone: 'push', to: 'n1_push' },
      ],
    },

    // --- THE COMPLICATION resolves, then rejoins the same fork ---
    {
      id: 'n1_freeze',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HOLD, text: "Neither of you breathes. A long five-count. Then a grunt, boots receding — whoever it was decided Milo talking to himself wasn't worth the walk back." },
      ],
      ask: "The room's yours again, and Milo's still standing on the edge of a confession. What do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him a way through it — 'Help me trace it. Not for DeLuca. For the truth.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'You already know too much to walk away clean. Give me the rest.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: COVER, text: "(loud, bored, easy) 'Milo, if you can't count past a hundred without help, that's your problem, not mine.'" },
        { who: 'you', caption: true, art: COVER, text: "A pause. Then a short laugh through the door, and the boots move off, satisfied it was nothing. Milo's staring at you like you just walked a wire he didn't know was strung." },
      ],
      ask: "You bought the room back. He's still shaken, still open — what do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him a way through it — 'Help me trace it. Not for DeLuca. For the truth.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'You already know too much to walk away clean. Give me the rest.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_push',
      mood: 'threat',
      beats: [
        { who: 'you', art: LEAN, text: "You lean in instead of backing off, voice low and fast under the knocking. 'That's the delivery, isn't it. Cash for cargo that isn't real. You really want to be holding this bag when somebody finally counts it?'" },
        { who: 'them', art: CHOKE, text: "(swallows, calls back through the door, voice cracking only a little) 'Fine! Counting's fine — give me a minute!' (the boots go, and he rounds on you, badly shaken) You want me twitchy enough to short a count in front of DeLuca's own runner?" },
      ],
      ask: "You used the fear right when it was sharpest, and it worked — but he's rattled, not ready. Ease off, or press it further?",
      choices: [
        { id: 'absolve', label: "Ease off — 'Breathe. Help me trace it and I'm gone before the next knock.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Press it — 'Then talk fast. You already know too much to walk away clean.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the fear hardens into something flatter, more guarded) ...So that's the play. Scare me, then squeeze me. You're not so different from the man I already work for." },
      ],
      ask: "You turned his fear into a demand. He'll still hand it over — but you're losing the man to get it. Ease off, or take it anyway?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. You're right. Help me because it's true, not because I made you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'take', label: "Take it and go — 'Just the count, Milo.'", tone: 'push', to: 'o_bought' },
      ],
    },

    // --- disarm: fear eases into a vent about the man who's never at risk ---
    {
      id: 'd1',
      mood: 'cold',
      beats: [
        { who: 'them', art: EASE, text: "(the sweat doesn't stop, but his shoulders drop half an inch) ...Not DeLuca's. Then who sent you." },
        { who: 'you', art: EASE, text: "Nobody. I want the same thing you want — DeLuca never finding out what's actually moving through this room." },
        { who: 'them', art: VENT, text: "(a short, ugly laugh) You think DeLuca cares what moves through here, long as his cut's right? He doesn't know the manifest numbers and doesn't want to. I'm the one who has to know, and not know, at the same time. He pockets his end and goes home clean. I'm the one sitting in this room when the count comes up short." },
      ],
      ask: "He's just told you exactly what scares him without meaning to — not DeLuca's temper, DeLuca's absence. The day nobody upstairs takes the blame but him. What breaks it open?",
      choices: [
        { id: 'hope', label: "Give him hope — 'Then be the one who's already gone before that day comes.'", tone: 'disarm', to: 'd_hope' },
        { id: 'fear', label: "Give him a worse fear — 'The audit's not a maybe, Milo. It's already started.'", tone: 'press', to: 'd_fear' },
      ],
    },
    {
      id: 'd_hope',
      mood: 'hope',
      beats: [
        { who: 'them', art: DOUBT, text: "(studies you, calculating something other than money for once) And what exactly does 'gone' look like for a man who's never done anything but count somebody else's cash?" },
        { who: 'you', art: OFFERHAND, text: "It looks like you're not in this room the day it stops mattering whose cash it was. I can see to that. What I need is what actually moves through here — the cargo that isn't real." },
        { who: 'them', art: WARM, text: "(something in his face that isn't quite relief yet, but close) ...You'd do that. For a man you don't owe a thing." },
      ],
      ask: "He's close. This is where you win him whole — or grab too fast and spook the trust you just built.",
      choices: [
        { id: 'word', label: "Your word, plain — 'We understand each other.'", tone: 'disarm', to: 'o_turned' },
        { id: 'bind', label: "Bind him now — 'Then start talking. Tonight. Everything.'", tone: 'push', to: 'o_bought' },
      ],
    },
    {
      id: 'd_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: AUDIT, text: "(goes very still) You know about the audit." },
        { who: 'you', art: AUDIT, text: "I know DeLuca's been sloppy long enough that somebody upriver's finally counting. And when they do, they're not going to find him. They're going to find you — a name on every page, no cargo behind any of it." },
      ],
      ask: "He's not scared of you anymore. He's scared of the ledger itself. Pull him back before it breaks him, or push it further?",
      choices: [
        { id: 'pullback', label: "Pull him back — 'That's exactly why you need me on your side of it.'", tone: 'disarm', to: 'o_turned' },
        { id: 'pushon', label: "Push it — 'So talk fast, before they get to you first.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- press: he panics, threatens to call for help ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: THREATEN, text: "(backs toward the door, voice climbing) You think I don't have people two rooms over? I yell, it's you explaining yourself to men who don't ask twice." },
        { who: 'you', art: CALLBLUFF, text: "(quiet, doesn't move) Yell, then. And explain to DeLuca why a stranger walked straight to his money room and knew your name before you said it." },
        { who: 'them', art: CHOKE, text: "(the shout dies somewhere behind his teeth)" },
      ],
      ask: "You've cornered a scared man, not a proud one — dangerous in a different way. Let him breathe, or keep squeezing?",
      choices: [
        { id: 'easeoff', label: "Let him breathe — 'I'm not your problem, Milo. Sit down.'", tone: 'disarm', to: 'd1' },
        { id: 'ride', label: "Squeeze — 'The count, or DeLuca hears you've been talking regardless.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', art: HANDOVER, text: "(hands shaking so badly the tally sheets slide off the table) Take it. Take all of it. I never saw you. You were never in this room." },
      ],
      ask: "You have what you came for, and a wrecked man standing over an empty table. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'This stays quiet. Breathe.'", tone: 'disarm', to: 'o_bought' },
        { id: 'menace', label: "Seal it — 'One word and it's you they come looking for.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money answers a question he wasn't asking ---
    {
      id: 'c1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CASHOFFER, text: "You add a fold of your own bills to the pile already covering his table — a strange gift, cash for a man drowning in cash." },
        { who: 'them', art: STARE, text: "(stares at it like it might be a trick) ...You brought money. Into this room. To a man who's got more of DeLuca's sitting right here than you could carry out the door." },
        { who: 'you', art: STARE, text: "Everyone's got a price. Even the man counting somebody else's." },
        { who: 'them', art: MONEYTALK, text: "(a short, humorless laugh) You think I'm scared of running short on cash? I could vanish tonight with what's on this table and never look back. I don't, because vanishing means somebody comes looking — and when they find me, they don't ask nicely. Money's never been the problem, friend. Getting caught is." },
      ],
      ask: "The bribe landed wrong — it answered a question he wasn't asking. Read that, or dig the hole deeper?",
      choices: [
        { id: 'double', label: "Push more — 'Enough to actually vanish on. Name it.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pocket', label: "Take it back — 'You're right. It was never about the money.'", tone: 'disarm', to: 'd1' },
        { id: 'blackmail', label: "Turn it ugly — 'Take it, or I make sure DeLuca hears you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'MILO — THE BAGMAN INSIDE',
        line: "He drags a battered tin box out from under a loose floorboard — his OWN count, kept on the side, of every dollar that ever moved through this room without a crate behind it. \"Kept it because I figured someday somebody'd need proof I didn't know what I was carrying. Take it. And next time a satchel comes through that slot — I'll know who to walk it to first.\"",
        ripple: "You're holding a live feed into the wash itself — amounts, dates, drop points, no cargo attached to any of it. Cross it against Gallo's book and the shape of what's moving through DeLuca's district starts to show.",
        reflect: "For once I didn't have to break something to get it. I gave a scared man a door and he walked through it on his own. My father would've called that the easy way. It didn't feel easy.",
        heatDelta: -1,
        grants: ['cashProof', 'bagman_turned'],
        dispositions: [{ nodeId: 'bagman', set: 4 }],
        campaign: { bonds: [{ id: 'bagman', delta: 2 }], faction: { id: 'district', delta: 1 }, ledger: ['bagman_turned'] },
        debrief: { principle: 'follow-the-money',
          note: "Gallo showed you where the money enters clean — **placement**. Milo is the next stage, **layering**: spreading the wash through enough hands that no single dollar ever looks wrong. You didn't chase him for loyalty. You chased him because he's the room the cash physically moves through, and now you're holding dates, sums, and drop points with no cargo behind any of them — one stage closer to whoever the wash serves at the top." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT_END,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'MILO — BOUGHT, NOT TURNED',
        line: "He counts what you handed him twice, the way he counts everything, then slides the tally sheets across without meeting your eyes. \"There's your cash-proof. We're square.\" No warmth in it. No offer to flag the next satchel. Just a transaction, closed.",
        ripple: "You've got the paper trail — dates, sums, the shape of the wash. But a man who sold this cheap sells just as easy to whoever counts DeLuca's money after you do.",
        reflect: "DeLuca pays Milo to move money and never ask questions. Tonight, so did I.",
        grants: ['cashProof'],
        worldFlags: ['bagmanBought'],
        dispositions: [{ nodeId: 'bagman', set: 3 }],
        campaign: { money: -180, bonds: [{ id: 'bagman', delta: -1 }], ledger: ['bagman_bought'] },
        debrief: { principle: 'principal-agent',
          note: "DeLuca can't watch this room every hour of every day — so the man he trusts with the count serves himself the second the boss looks away. That gap between what the **principal** (DeLuca) wants and what his **agent** (Milo) actually does when unsupervised is the **principal–agent problem**, and you just proved how wide it runs: cheap enough to buy, careless enough to sell. It's also why nothing Milo hands you twice is worth trusting fully — the next bidder gets the same deal." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'MILO — BURNED',
        line: "He goes rigid, then blank — the particular stillness of a man who's stopped doing math and started planning which door he runs for. Whatever you needed from this room, you're not getting it tonight. And a rattled bagman with DeLuca's cash still on the table is a man who talks to somebody, fast, just to not be the one holding the bag alone.",
        ripple: "No cash-proof. Worse — Milo goes straight to DeLuca with a story about a stranger asking after phantom manifests. DeLuca's not stupid. He'll start covering his tracks before you ever sit across from him.",
        reflect: "I leaned on the one thing that was already about to break him. My father spent his whole life being careful with frightened men. Tonight I wasn't.",
        heatDelta: 3,
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'bagman', set: 0 }],
        campaign: { bonds: [{ id: 'bagman', delta: -2 }], faction: { id: 'district', delta: -1 }, ledger: ['bagman_burned'] },
        debrief: { principle: 'loss-aversion',
          note: "**Loss aversion** is a lever, not a hammer — frame what he stands to lose and let the fear do calculated work, and a man moves harder than any reward could push him. Push past his own arithmetic and he stops weighing costs at all; he just runs, or talks, whichever clears the room faster. You read the fear right. You didn't read how much of it a scared man can carry before it stops being useful to you." },
      },
    },
  ],
};
