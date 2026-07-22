import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat (manhwa pacing),
// modeled exactly on scripts/gen_sal.sh / gen_gallo.sh: base establishing scene →
// the tell → the read forks → the interruption → each ending its own image + mood.
const BASE = 'assets/art/scene/halloran.jpg';                     // wide: the manifest shed at night, ledgers, caged bulb
const LOG = 'assets/art/scene/halloran_log.jpg';                  // Halloran alone, switching pens, signing a manifest
const STARTLE = 'assets/art/scene/halloran_startle.jpg';          // head snaps up, pen freezing mid-signature
const DOORWAY = 'assets/art/scene/halloran_doorway.jpg';          // your silhouette in the shed doorway
const WARY = 'assets/art/scene/halloran_wary.jpg';                // sets the pen down, precise, parallel to the ledger edge
const REALIZE = 'assets/art/scene/halloran_realize.jpg';          // the woven read: the correct read, his careful hedge exposed
const SLY = 'assets/art/scene/halloran_sly.jpg';                  // wrong read: you peg him greedy, his mouth tightens instead
const STIFF = 'assets/art/scene/halloran_stiff.jpg';              // wrong read: you peg him untouchable, his eyes flick to the door
const FREEZE_TELL = 'assets/art/scene/halloran_freeze_tell.jpg';  // the name lands — Vidal — the pen tears the line
const CONFESS = 'assets/art/scene/halloran_confess.jpg';          // quiet confession — Finn's husband, the crew sheet
const PANIC = 'assets/art/scene/halloran_panic.jpg';              // the complication: boots outside, or the dispatch line ringing
const HOLD = 'assets/art/scene/halloran_hold.jpg';                // freeze: both of you dead still, waiting it out
const COVER = 'assets/art/scene/halloran_cover.jpg';              // cover: loud and easy, buying the room back
const RUSH = 'assets/art/scene/halloran_rush.jpg';                // rush: the window hauled back, an empty pier
const STUNG = 'assets/art/scene/halloran_stung.jpg';              // guilt twisted into a debt — the softness closes over
const SINK = 'assets/art/scene/halloran_sink.jpg';                // disarm: sags back, doing the funeral math
const BITTER = 'assets/art/scene/halloran_bitter.jpg';            // the short humorless laugh — he's run the numbers himself
const DOUBT = 'assets/art/scene/halloran_doubt.jpg';              // studies you, deciding whether to believe a stranger
const RELIEF = 'assets/art/scene/halloran_relief.jpg';            // something in his shoulders finally lets go
const DREAD = 'assets/art/scene/halloran_dread.jpg';              // goes rigid, the 3am thought said out loud
const DEFENSIVE = 'assets/art/scene/halloran_defensive.jpg';      // press: the official voice, "that's the job"
const CRACK = 'assets/art/scene/halloran_crack.jpg';              // the official tone cracks down the middle
const HANDOVER = 'assets/art/scene/halloran_handover.jpg';        // shaking hands, the real log shoved across
const CASH = 'assets/art/scene/halloran_cash.jpg';                // a fold of bills set on the ledger, beside the spare pen
const STARE = 'assets/art/scene/halloran_stare.jpg';              // stares at the money, doesn't touch it
const REFUSE = 'assets/art/scene/halloran_refuse.jpg';            // quiet, almost sad — the arithmetic money can't fix
const TURNED_END = 'assets/art/scene/halloran_turned_end.jpg';    // hands over the real log, insurance for himself as much as you
const SCARED_END = 'assets/art/scene/halloran_scared_end.jpg';    // shaking, still running the sums, worse off than before
const BURNED_END = 'assets/art/scene/halloran_burned_end.jpg';    // rigid, silent, already reaching for the dispatch line

// HALLORAN — the waterfront dockmaster who signs the phantom manifests. He isn't
// greedy and he isn't a fanatic; he's a careful, cornered bureaucrat who never
// opens a crate and never asks a question, because not-knowing is the only armor
// he's got. What he hasn't fully worked out — what the READ is really about — is
// that his signature was never his protection. It's Kastner's: the one name that
// can always be handed to whoever comes looking, so the men above him never have
// to. He's not hoarding a profit. He's slowly realizing he's the fall guy, not the
// beneficiary, and that dawning terror is the lever, not cash and not threats.
// Two vanished names ground it: your father, Tomas Vidal, who asked about crates
// that didn't match anything — and young Fitzy Finn, three months gone, whose
// widow still asks after him at the union hall (seeds finn_mission).
// THE WOVEN READ: right after the opening, before you've said a real word, you
// judge what Halloran truly IS — a scapegoat realizing it, a greedy man, or an
// untouchable company man. The true read (scapegoat) opens the strong approaches
// with the ground already under your feet; a wrong read still reaches every
// approach, but the flavor text tells you where you misjudged him.
// THE COMPLICATION: on the name path, his confession is interrupted — boots
// outside, or the dispatch line ringing at an hour nobody rings it — a choice
// under pressure (freeze/cover/rush) before rejoining the same absolve/twist
// fork that decides whether you turned a man or just used one.
// Three endings:
//   TURNED — clean: he hands you his own hidden log, insurance for himself
//   SCARED — you get the manifest proof, but leave him rattled and exposed
//   BURNED — no proof; he bolts straight back to warn Kastner
// Palette 'sal' reused: the same sickly ledger-lamp green lights a man drowning
// in paperwork instead of debt — the color of a desk built to look clean.
export const HALLORAN_MISSION: Mission = {
  id: 'halloran_mission',
  actionId: 'halloran_turn',
  nodeId: 'halloran',
  label: 'Turn the dockmaster',
  palette: 'sal',
  scene: BASE,
  teaches: ['information-asymmetry', 'plausible-deniability', 'loss-aversion'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: LOG, text: "Three nights running I watched Halloran close out the manifest shed alone after the last gang clocked off — Waterfront Local 4's dockmaster, the man whose signature turns a crate on paper into cargo that officially arrived. He never touches the wood. He never asks what's inside. He just signs, and switches pens to do it." },
        { who: 'you', caption: true, art: LOG, text: "Twenty-two manifests this year for crates that don't match a single line in the shipping company's own books. 'Machine parts.' 'Textiles.' Nothing that weighs like machine parts weigh. And every man who's asked him about it has stopped showing up for his shift." },
        { who: 'them', art: STARTLE, text: "(the pen freezes mid-signature, his head coming up too fast) We're closed for the night. Whatever this is, take it up with the union hall in the morning." },
        { who: 'you', art: DOORWAY, text: "I'm not from the hall, Mr. Halloran. And I'm not leaving." },
        { who: 'them', art: WARY, text: "(sets the pen down very precisely, exactly parallel to the ledger's edge) Nobody civil walks into a dockmaster's office after hours. State your business or I call the yard watch." },
      ],
      ask: "He didn't shout. Didn't reach for anything. Just set that pen down like it mattered exactly where it landed. Three weeks of watching him boil down to one question. What IS Halloran, really?",
      choices: [
        { id: 'read_scapegoat', label: "A man laying his own paper trail — not guarding a profit, guarding himself from being the one left holding the signature.", tone: 'disarm', to: 'r_scapegoat' },
        { id: 'read_greedy', label: 'A man on the take, comfortable and paid well to look away.', tone: 'bribe', to: 'r_greedy' },
        { id: 'read_shielded', label: 'A company man who thinks his paperwork makes him untouchable.', tone: 'press', to: 'r_shielded' },
      ],
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_scapegoat',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: REALIZE, text: "The careful pen. The precise parallel edges. The way he says 'as far as I know' instead of 'yes.' That's not comfort — that's a man building a record he can point to later, when someone comes looking for who signed off on this. He's not protected. He's positioned. And some nights, I'd bet, he's starting to work out the difference." },
      ],
      ask: "A man armoring himself with paperwork doesn't need muscle or money to move him — he needs to see the wall he's built isn't going to hold. How do you open him?",
      choices: [
        { id: 'disarm', label: "Careful and quiet — 'You didn't sign up to be the fall guy. I can make sure you're not.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Plainly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Crowd him — 'Every one of those manifests has your name on it. Not Kastner's. Yours.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set a fold of bills on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_greedy',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: SLY, text: "You decide he's dirty for money, plain and simple — then you notice the tight, unhappy line of his mouth on every signature, like each one costs him something no amount fixes. That's not appetite. That's dread." },
      ],
      ask: "Careful — a man you just misread as greedy has already shown you money isn't the lever. What do you do anyway?",
      choices: [
        { id: 'bribe', label: 'Set a fold of bills on the ledger.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Crowd him — 'Every one of those manifests has your name on it. Not Kastner's. Yours.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Careful and quiet — 'You didn't sign up to be the fall guy. I can make sure you're not.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Plainly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
      ],
    },
    {
      id: 'r_shielded',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: STIFF, text: "You peg him for a careful company man, sure his paperwork keeps him clean and untouchable — then his eyes flick to the door for the third time in as many minutes. A man who feels safe doesn't watch the door. He's not shielded. He's scared of being found." },
      ],
      ask: "Rattle a man who thinks he's already safe and he digs in harder. How do you open someone already this on edge?",
      choices: [
        { id: 'press', label: "Crowd him — 'Every one of those manifests has your name on it. Not Kastner's. Yours.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Careful and quiet — 'You didn't sign up to be the fall guy. I can make sure you're not.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Plainly — 'My father was Tomas Vidal.'", tone: 'push', to: 'n1' },
        { id: 'bribe', label: 'Set a fold of bills on the ledger.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the name: your father's ghost, and Finn's ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', art: FREEZE_TELL, text: '(the careful pen stops dead, a small tear in the line) Vidal. …Tomas Vidal. Longshoreman, gone — what, seven years now? I remember the name because nobody at the hall would say it after. Like saying it too loud might catch.' },
        { who: 'you', art: FREEZE_TELL, text: 'He asked about crates that didn\'t match anything. Same as I\'m asking. Then he was gone.' },
        { who: 'them', art: CONFESS, text: "(very quiet, not looking up) He wasn't the last one, either. Young Finn — Fitzy — stood right where you're standing, three months back, and asked the same fool question. He's not on any crew sheet since. His wife still comes by the hall asking after him. Nobody there can look at her." },
        { who: 'them', art: PANIC, text: "(his head snaps toward the door — boots on the boards outside, slow, stopping dead. Or the wall phone starts up, insistent, wrong for the hour.) …That's the dispatch line. Nobody rings the dispatch line this late unless somebody's checking up on something." },
      ],
      ask: "His confession's still hanging in the air and now something outside wants his attention right now. What do you do?",
      choices: [
        { id: 'freeze', label: "Freeze — not a word, not a breath.", tone: 'disarm', to: 'n1_freeze' },
        { id: 'cover', label: "Cover it — loud and easy: 'Wrong number, pal. Dockmaster's off the clock.'", tone: 'press', to: 'n1_cover' },
        { id: 'rush', label: "Go to the window — better to know than wonder.", tone: 'push', to: 'n1_rush' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'n1_freeze',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HOLD, text: "Neither of you moves. The ringing dies on its own after the eighth ring, or the boots outside shuffle and move off toward the next shed. Long seconds pass before Halloran lets his shoulders down half an inch." },
      ],
      ask: "The moment's still open, if you take it now.",
      choices: [
        { id: 'absolve', label: "Offer him the way out — 'Then help me close this before it's Finn's wife I'm apologizing to instead of you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you owe him. And me. The real log.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: COVER, text: "(loud, easy, like it's nothing) Wrong number, pal. Dockmaster's off the clock." },
        { who: 'you', caption: true, art: COVER, text: "The ringing cuts off. Or the boots move on, unconvinced or indifferent, you'll never know which. Halloran's staring at you like you just proved something he didn't want proved." },
      ],
      ask: "You bought the room back. He's still open — what do you do with it?",
      choices: [
        { id: 'absolve', label: "Offer him the way out — 'Then help me close this before it's Finn's wife I'm apologizing to instead of you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you owe him. And me. The real log.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n1_rush',
      mood: 'threat',
      beats: [
        { who: 'you', art: RUSH, text: "You're at the window before Halloran can stop you, hauling back the frosted glass —" },
        { who: 'you', caption: true, art: RUSH, text: "Empty pier. Coiled cable, a gull startled off a bollard, nothing else. Whoever it was is already gone — or was never anyone at all. Halloran's face has gone the color of the ledger paper, worse than before." },
      ],
      ask: "Nothing there — or nothing you could catch. He's rattled worse than before. What do you do with the moment?",
      choices: [
        { id: 'absolve', label: "Offer him the way out — 'Then help me close this before it's Finn's wife I'm apologizing to instead of you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'twist', label: "Twist it — 'Good. Then you owe him. And me. The real log.'", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: '(the fear curdling into something harder, more familiar) …So that\'s it. Another one holding a debt over me instead of a hand out. Same as every man who\'s ever stood in this doorway.' },
      ],
      ask: "You turned his fear into a debt. He'll give you the log now — but you're losing the man. Ease off, or take it?",
      choices: [
        { id: 'ease', label: "Pull back — 'No. You're right. Help me because it's true, not because I made you.'", tone: 'disarm', to: 'o_turned' },
        { id: 'take', label: "Take it and go — 'Just the log, Halloran.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- disarm: dread curdles into resignation ---
    {
      id: 'd1',
      mood: 'cold',
      beats: [
        { who: 'them', art: SINK, text: '(sets the pen down, sags back into the chair) …The same man. You mean Kastner.' },
        { who: 'you', art: SINK, text: "I mean whoever's above Kastner. Those crates aren't textiles and we both know it. When this comes apart, it's your name on every page of it — not his." },
        { who: 'them', art: BITTER, text: "(a short, humorless laugh) You think I haven't run those numbers myself, nights like this one? There's no version where I walk into a courtroom and my signature isn't the first exhibit. And no version where I stop signing and I'm still breathing next week." },
      ],
      ask: "He's not fighting anymore — he's just doing the math on his own funeral. What breaks a man that resigned?",
      choices: [
        { id: 'hope', label: "Give him an out — 'There's a version where you're a witness instead of a suspect. I can build that version.'", tone: 'disarm', to: 'd_hope' },
        { id: 'fear', label: "Give him a worse fear — 'Or you keep signing until the day it's your name they need gone, not just your handwriting.'", tone: 'press', to: 'd_fear' },
      ],
    },
    {
      id: 'd_hope',
      mood: 'hope',
      beats: [
        { who: 'them', art: DOUBT, text: '(studies you, wary) And who exactly are you, that you get to hand a future out to a man who signs cargo he\'s not supposed to look at?' },
        { who: 'you', art: DOUBT, text: 'Nobody official. Just somebody who wants the men you\'re afraid of caught more than I want anything else.' },
        { who: 'them', art: RELIEF, text: '(something in his shoulders finally lets go) …God help me. All right.' },
      ],
      ask: "He's leaning your way. Seal it plain, or bind him tighter while he's soft?",
      choices: [
        { id: 'word', label: "Plain and steady — 'Then we understand each other.'", tone: 'disarm', to: 'o_turned' },
        { id: 'bind', label: "Push it — 'Then hand me the log now, before you talk yourself out of it.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'd_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: DREAD, text: '(goes rigid, color draining) You think I haven\'t had that exact thought at three in the morning? Every night this month.' },
      ],
      ask: "He's afraid now, not hopeful. Pull him back, or ride it?",
      choices: [
        { id: 'pullback', label: "Pull him back — 'Then let me be the version where you don't have to find out.'", tone: 'disarm', to: 'o_turned' },
        { id: 'pushon', label: "Ride it — 'So move first. Before they decide for you.'", tone: 'push', to: 'o_scared' },
      ],
    },

    // --- press: the official front cracks ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: DEFENSIVE, text: "(voice rising, official) I sign what dispatch tells me to sign. Every crate on that manifest's logged exactly as received. That's the job. If you've got a complaint, it goes through the hall—" },
        { who: 'you', art: DEFENSIVE, text: "Every one of those crates is a lie you've signed your name to twenty-two times this year. That's not a complaint, Halloran. That's a rope, and it's got your name braided into it." },
        { who: 'them', art: CRACK, text: '(the official tone cracks down the middle) …You think I don\'t know what I\'m holding.' },
      ],
      ask: "You've cracked the shell — furious, and genuinely rattled underneath it. Ease off, or squeeze?",
      choices: [
        { id: 'easeoff', label: "Let him breathe — 'I'm not here to hang you with it. Sit down.'", tone: 'disarm', to: 'd1' },
        { id: 'ride', label: "Squeeze — 'Then hand it over, or I make sure the hall reads it before you do.'", tone: 'push', to: 'p2' },
      ],
    },
    {
      id: 'p2',
      mood: 'fear',
      beats: [
        { who: 'them', art: HANDOVER, text: '(hands shaking, he pulls the real log from under the false one and shoves it across) Take it. Take it and forget which drawer it came out of.' },
      ],
      ask: "You've got the log — and a man rattled past reasoning. What do you leave him as?",
      choices: [
        { id: 'calm', label: "Steady him — 'Nobody hears this from me. Breathe.'", tone: 'disarm', to: 'o_scared' },
        { id: 'menace', label: "Seal it with fear — 'One word to Kastner and you're the next name on a crew sheet nobody updates.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money misreads a man who's already priced the real cost ---
    {
      id: 'c1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CASH, text: 'You set a fold of bills on the ledger, next to the spare pen he switches to for the signatures he can\'t stomach.' },
        { who: 'them', art: STARE, text: "(doesn't touch it, stares at it a long beat) …Money. You think I sign these for money." },
        { who: 'you', art: STARE, text: 'Everyone signs for something.' },
        { who: 'them', art: REFUSE, text: "(quiet, almost sad) The pay's the same whether I sign or don't. I sign because the last man at this desk who refused a shipment isn't at this desk anymore, or anywhere else, three years running. You think a roll of bills outweighs that arithmetic?" },
      ],
      ask: "The money landed wrong — he's not tempted, he's insulted by how simple you think this is. Read him.",
      choices: [
        { id: 'double', label: "Push more — 'Enough to disappear on tonight. Name it.'", tone: 'bribe', to: 'o_burned' },
        { id: 'pocket', label: "Take it back — 'You're right. Forget the money.'", tone: 'disarm', to: 'd1' },
        { id: 'blackmail', label: "Turn it ugly — 'Take it, or I tell Kastner you already did.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'HALLORAN — THE SIGNATURE TURNS',
        line: 'He pulls the real log out from under the false one — every crate, every date, every discrepancy, in the same meticulous hand he\'s used to sign his own leash. "I\'ve kept this since the second month. Not for you. For me — so when it comes apart, there\'s a version of events where I told someone before I disappeared, instead of after." He hands it over. "Copy it. Then bring it back. It\'s the only insurance I\'ve got left."',
        ripple: "You're holding proof the cargo is real and matches no legitimate shipment on the books — and an inside man who'll keep logging every crate that crosses his desk while you climb toward Kastner.",
        reflect: "He didn't want to be a hero. He wanted to stop being the only name anyone could pin this on. I know exactly what that feels like from the other side of a courtroom that never happened.",
        heatDelta: -1,
        grants: ['manifestProof', 'halloran_turned'],
        dispositions: [{ nodeId: 'halloran', set: 4 }],
        campaign: { bonds: [{ id: 'halloran', delta: 2 }], faction: { id: 'union', delta: 1 }, ledger: ['halloran_turned'] },
        debrief: { principle: 'loss-aversion',
          note: "You never offered Halloran a single new thing to gain — no reward, no promise of profit. You showed him what he was already about to lose: his one shot at not being the fall guy. **Loss aversion** says protecting what a man already has (or is about to lose) moves him harder than any prize you could dangle in front of him. He signed for the same reason he was terrified — the same arithmetic, worked the other way." },
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      portrait: SCARED_END,
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'HALLORAN — A SCARED SIGNATURE',
        line: "You walk out with the manifest log, copied fast, his hands shaking too hard to keep the pages parallel anymore. You got the proof. You didn't get the man — he's still standing there running the same funeral sums he was running before you arrived, just with one more variable in them: you.",
        ripple: "The proof is real and it's yours. But a man rattled that badly either freezes solid or bolts to the first person who might protect him — and right now, that's still Kastner.",
        reflect: "He gave me what I needed and I left him worse off than I found him. My father was a name on somebody else's ledger once too. I keep telling myself that's different.",
        grants: ['manifestProof'],
        dispositions: [{ nodeId: 'halloran', set: 2 }],
        campaign: { bonds: [{ id: 'halloran', delta: -1 }], ledger: ['halloran_scared'] },
        debrief: { principle: 'information-asymmetry',
          note: "The instant Halloran realized you already knew what his signature meant, the gap between what he knew and what you knew collapsed — and with it, his only leverage. **Information asymmetry** says whoever holds the secret sets the price; once the secret was common knowledge, he had nothing left to sell you but the paper itself. You closed that gap and got the proof. You never closed the OTHER gap — the one between him and whoever's still protecting Kastner." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'HALLORAN — CORNERED WRONG',
        line: "He goes rigid and silent, eyes fixed somewhere past your shoulder, and you know that look — the second you clear the door, he's on the dispatch line to whoever he really answers to, trading what just happened for one more month of being useful instead of expendable.",
        ripple: "No manifest, no inside man — and Kastner hears, before you ever sit down across from him, that somebody's circling his cargo. He'll be ready for you.",
        reflect: "I leaned on a cornered man like he was a proud one, and cornered men don't break — they bolt for the nearest exit, even if the exit runs straight back to the thing that scares them most. My father never made that mistake twice. I just made it once.",
        heatDelta: 3,
        worldFlags: ['kastnerForewarned'],
        dispositions: [{ nodeId: 'halloran', set: 0 }],
        campaign: { bonds: [{ id: 'halloran', delta: -2 }], faction: { id: 'union', delta: -1 }, ledger: ['halloran_burned'] },
        debrief: { principle: 'plausible-deniability',
          note: "Halloran's whole life runs on **plausible deniability** — never opening the crate, never asking the question, so nothing can be proven he 'knew.' You didn't out-maneuver that shield; you shattered it and left him nothing to replace it with. A man with no deniability left, and no protector but the very people threatening him, has exactly one move: run back to them, confess everything, and rebuild the wall from the inside. You didn't turn him. You told him exactly who to warn." },
      },
    },
  ],
};
