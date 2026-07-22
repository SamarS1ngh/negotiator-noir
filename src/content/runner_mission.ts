import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (approach → the read → the lever →
// the complication → each ending its own image + mood).
const WATCH = 'assets/art/scene/runner_watch.jpg';         // establishing: the alley, the bulb, the kid
const COUNT = 'assets/art/scene/runner_count.jpg';         // Tommy alone, counting the take
const STARTLE = 'assets/art/scene/runner_startle.jpg';     // he spins, bills scattering
const SWAGGER = 'assets/art/scene/runner_swagger.jpg';     // the tough-guy recovery, too fast
const APPROACH = 'assets/art/scene/runner_approach.jpg';   // your silhouette in the bulb light
const CRACK = 'assets/art/scene/runner_crack.jpg';         // the voice breaks, the mask slips
const BRAG = 'assets/art/scene/runner_brag.jpg';           // chest out, bragging on the job
const HOLLOW = 'assets/art/scene/runner_hollow.jpg';       // the grin holds a beat too long
const DEFENSIVE = 'assets/art/scene/runner_defensive.jpg'; // the brag drops, he bristles
const LOYAL = 'assets/art/scene/runner_loyal.jpg';         // asserting loyalty, too fast
const SUSPICIOUS = 'assets/art/scene/runner_suspicious.jpg'; // flips the question back on you
const WARN = 'assets/art/scene/runner_warn.jpg';           // backing toward the stairs, about to call out
const FEAR = 'assets/art/scene/runner_fear.jpg';           // the swagger folds — he's just nineteen
const ASK = 'assets/art/scene/runner_ask.jpg';             // you lean in with the small ask
const FLINCH = 'assets/art/scene/runner_flinch.jpg';       // he flinches like you swung at him
const CASH = 'assets/art/scene/runner_cash.jpg';           // the roll fanned out, he won't reach for it
const CALLOUT = 'assets/art/scene/runner_callout.jpg';     // Deak's voice down the stairwell
const BOLT = 'assets/art/scene/runner_bolt.jpg';           // half-risen, torn, about to run
const CONFESS = 'assets/art/scene/runner_confess.jpg';     // what he's seen Ricci do, out at last
const TURNED_END = 'assets/art/scene/runner_turned_end.jpg'; // relief — chose something for himself
const SHAKY_END = 'assets/art/scene/runner_shaky_end.jpg';   // pale, jittery, gave it up scared
const BURNED_END = 'assets/art/scene/runner_burned_end.jpg'; // gone, up the stairs, to Ricci

// TOMMY — Ricci's newest runner. Maybe nineteen. Does the actual footwork: the
// pickups, the drops, the counting in doorways nobody's supposed to watch. Wears
// Ricci's swagger like a coat two sizes too big over a kid who's scared of the
// job, sick of what he's seen it do to other people, and stuck because nobody
// ever offered him a door out. THE WOVEN READ is the spine: the swagger is a
// front, not a belief — read past it to the fear and a SMALL ask turns him; feed
// the front (pride/loyalty) or overplay the fear (force/a big bribe) and it
// costs you. THE COMPLICATION — Ricci's other man, Deak, calls him up the stairs
// mid-conversation — is where the fear either becomes trust or becomes a bolt.
// Three endings:
//   TURNED — the only fully clean path: right read, right lever (fear + a small
//            ask), patient under the complication. He's your man inside Ricci's
//            daily operation.
//   SHAKY  — you get something, but rattled, coerced, or recovered too late to
//            fully land — a source who might crack the wrong way under pressure.
//   BURNED — force, a big bribe pushed too far, or panic under the complication:
//            he runs straight to Ricci.
// Palette 'crew' — grimy dockside amber, rain-slick and cold, for a kid still
// young enough to be somebody's crew before he's anybody's collector.
export const RUNNER_MISSION: Mission = {
  id: 'runner_mission',
  actionId: 'runner_turn',
  nodeId: 'runner',
  label: 'Flip the runner',
  palette: 'crew',
  scene: 'assets/art/scene/runner.jpg',
  teaches: ['foot-in-the-door', 'types-and-tells', 'loss-aversion'],
  start: 'r0',
  nodes: [
    {
      id: 'r0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WATCH, text: "Three nights I watched this alley before I said a word. Ricci doesn't run his own numbers anymore — he's got a kid for that. Nineteen, maybe. Does the actual walking: the pickups, the drops, the counting in doorways where nobody's supposed to see." },
        { who: 'you', caption: true, art: COUNT, text: "Ricci's ledger doesn't even know his name. Just a runner. But a runner sees every door Ricci walks through — and nobody ever thinks to watch the runner back." },
        { who: 'them', art: STARTLE, text: "(a board creaks under your boot — he spins, bills scattering off his knee) Jesus — ! Who's— (scrambling for the money, for his nerve)" },
        { who: 'them', art: SWAGGER, text: "(chin up too fast, voice pitched a half-step deep) Yeah? Who's asking. This is Ricci's collection, pal. You don't want to be standing in it." },
        { who: 'you', art: APPROACH, text: "Just watching you work the count, Tommy. You're fast with the numbers. Slower with the rest of the act." },
        { who: 'them', art: CRACK, text: "(the deep voice slips) H-how do you— (catches himself, too late)" },
      ],
      ask: "His voice just broke on the second word and he still hasn't let go of that roll of bills. Who's actually standing in front of you?",
      choices: [
        { id: 'proud', label: "A kid puffed up on the job Ricci gave him — feed the pride.", tone: 'press', to: 'rp1' },
        { id: 'believer', label: "A true believer — proud to run for Ricci, whatever it costs him.", tone: 'push', to: 'rb1' },
        { id: 'scared', label: "A scared kid wearing Ricci's swagger like a coat two sizes too big.", tone: 'disarm', to: 'rs1' },
      ],
    },

    // --- wrong read: proud — the brag rings hollow ---
    {
      id: 'rp1',
      mood: 'tense',
      beats: [
        { who: 'you', art: BRAG, text: "Ricci picked you special, huh. Out of everybody on the docks." },
        { who: 'them', art: BRAG, text: "(chest out, grin spreading) Damn right he did. Out of everybody. I got the eye for numbers, the nerve for the walk — Ricci says I remind him of himself at my age." },
        { who: 'you', art: HOLLOW, text: "Must be something, carrying that kind of trust." },
        { who: 'them', art: HOLLOW, text: "(the grin holds a beat too long, eyes flicking to the rain, the street, anywhere but you) …Yeah. Something." },
      ],
      ask: "The brag's getting louder and there's nothing behind his eyes when he says it — you're feeding a hunger that isn't real. Cut through it, or pour it on?",
      choices: [
        { id: 'ease', label: "Cut it clean — 'Drop it. Your hand's shaking on that roll and it's not the cold.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'push', label: "Pour it on — 'Bet Ricci tells you everything. Big man like you.'", tone: 'press', to: 'rp2' },
      ],
    },
    {
      id: 'rp2',
      mood: 'cold',
      beats: [
        { who: 'them', art: DEFENSIVE, text: "(the grin drops like a dropped plate) …You making fun of me? (a step back, hand tightening on the roll) I don't gotta stand here and take that from a stranger." },
      ],
      ask: "You leaned on the wrong button and he's two seconds from walking or shouting for Deak. Pull back, or bury him further?",
      choices: [
        { id: 'pullback', label: "Pull it back — 'No games. I saw a kid scared out of his skin and called it wrong. My mistake.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'push', label: "Bury him — 'Big man who jumps at shadows. Half this block already knows it.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- wrong read: true believer — loyalty flips back on you ---
    {
      id: 'rb1',
      mood: 'tense',
      beats: [
        { who: 'you', art: LOYAL, text: "You believe in this. In Ricci." },
        { who: 'them', art: LOYAL, text: "(too fast) I do the job right. Ricci trusts me with the count — that's not nothing on these docks." },
        { who: 'you', art: SUSPICIOUS, text: "Trust, or he just hasn't caught you slipping yet." },
        { who: 'them', art: SUSPICIOUS, text: "(eyes narrow, something calculating under the nerves) …Why do you care if I'm loyal. You testing me. For who?" },
      ],
      ask: "He just flipped the question back on you, sharper than his age should let him. Ease off the loyalty test, or press it?",
      choices: [
        { id: 'ease', label: "Ease off — 'Nobody's testing you. I'm asking because loyalty like that usually costs a man something.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'press', label: "Press it — 'Fair question. What's loyal to Ricci ever gotten anybody but dead or scared?'", tone: 'press', to: 'rb2' },
      ],
    },
    {
      id: 'rb2',
      mood: 'threat',
      beats: [
        { who: 'them', art: WARN, text: "(backing toward the stairs, voice rising) You don't get to talk about Ricci like that. I'll call Deak down here right now—" },
      ],
      ask: "He's one word from bringing the whole street down on you. Pull him back from the edge, or push through it?",
      choices: [
        { id: 'pullback', label: "Pull him back — 'Wait — wait. I'm not your enemy. I got that wrong, all of it.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'push', label: "Push through — 'Go on, call him. Explain why Ricci's runner's out here arguing philosophy instead of finishing his count.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- the correct read: the swagger folds, the fear's real ---
    {
      id: 'rs1',
      mood: 'fear',
      beats: [
        { who: 'you', art: FEAR, text: "You're not proud of this. You're not even sure you believe in it. You're just scared of what happens if you stop." },
        { who: 'them', art: FEAR, text: "(the swagger folds up like wet paper — for a second he just looks nineteen) …I didn't ask for this job. Guy before me, Ricci's last runner — just stopped showing up one day. Nobody asked where he went. You just get handed the bag and you don't ask." },
        { who: 'you', art: ASK, text: "I'm not here to hand you a bigger bag. I'm asking for something small. Something he'd never even miss." },
      ],
      ask: "The fear's real and it's yours to work with now. What do you actually put in front of him?",
      choices: [
        { id: 'smallask', label: "A small, cheap ask — 'Just tell me when he runs the far-pier pickup. That's all, tonight.'", tone: 'disarm', to: 'complication' },
        { id: 'force', label: "Lean on the fear harder — 'Help me, or I make sure Ricci hears you've been talking to someone.'", tone: 'push', to: 'rs_force' },
        { id: 'bribe', label: "Skip the fear, go big — 'Here. Enough to walk away from all of it tonight.'", tone: 'bribe', to: 'rs_bribe' },
      ],
    },

    // --- wrong lever on the right read: force ---
    {
      id: 'rs_force',
      mood: 'threat',
      beats: [
        { who: 'them', art: FLINCH, text: "(flinches like you'd swung at him, eyes filling) You'd do that? You'd— (a ragged breath) You're no different than him, then." },
      ],
      ask: "You just threatened a scared kid with the exact thing he's scared of, and it landed as a threat, not a bridge. Pull it back, or keep the boot on his neck?",
      choices: [
        { id: 'ease', label: "Pull it back — 'No — God, no. I'm sorry. That's not what I meant.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'push', label: "Keep it — 'Doesn't matter what I am. You've got till tomorrow to decide.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- wrong lever on the right read: the big bribe ---
    {
      id: 'rs_bribe',
      mood: 'tense',
      beats: [
        { who: 'you', art: CASH, text: "(you fan out a roll of bills) Enough to be somewhere else by morning." },
        { who: 'them', art: CASH, text: "(stares at it, doesn't reach, something wounded in his face) …You think this is a money problem. (a short, humourless laugh) I'm not scared of being broke. I'm scared of the guy Ricci sends after runners who disappear." },
      ],
      ask: "The cash just told him you don't understand what he's actually afraid of. Pull it back and read him right, or push more money at the wrong problem?",
      choices: [
        { id: 'pivot', label: "Pull it back — 'You're right. It's not the money. Tell me what you actually need.'", tone: 'disarm', to: 'complication_shaky' },
        { id: 'push', label: "Push more — 'Then it's enough to disappear somewhere he'll never look. Take it.'", tone: 'bribe', to: 'o_shaky' },
      ],
    },

    // --- THE COMPLICATION: Deak calls, the confession, ten seconds to decide ---
    // clean track — reached only from the smallask lever on the correct read
    {
      id: 'complication',
      mood: 'threat',
      beats: [
        { who: 'them', art: CALLOUT, text: "(a voice cuts down the stairwell from the street — Deak, Ricci's other man, impatient) DEAK (off): Tommy! Ricci wants tonight's count, not next Tuesday!" },
        { who: 'them', art: BOLT, text: "(his whole body jerks toward the sound, half-risen, torn between the stairs and you) I gotta— he'll come looking if I don't—" },
        { who: 'them', art: CONFESS, text: "(a breath, and it just comes out) You know what he did to the last guy who came up short? Made him count his own fingers first. I've watched him do it twice. I throw up after, every time. I didn't sign up to watch that. I just— I didn't have anywhere else to go." },
      ],
      ask: "Ten seconds before Deak comes down those stairs looking for him. What do you do with what he just handed you?",
      choices: [
        { id: 'cover', label: "Give him the out — 'Go. Tell him the drain backed up. I'll find you tomorrow — same time.'", tone: 'disarm', to: 'o_turned' },
        { id: 'push_now', label: "Seize it now — 'Then decide right now. In, or you go up those stairs and it's over.'", tone: 'push', to: 'o_shaky' },
      ],
    },
    // recovered track — reached after a fumbled read or a misplayed lever; the
    // fear's still real, but it took too long to get here to fully land clean
    {
      id: 'complication_shaky',
      mood: 'threat',
      beats: [
        { who: 'them', art: CALLOUT, text: "(the same voice, down the stairwell — Deak, impatient) DEAK (off): Tommy! Ricci wants the count!" },
        { who: 'them', art: BOLT, text: "(he flinches toward the sound — slower to trust you than he should be after the rocky start, but still torn) I gotta go, he'll—" },
        { who: 'them', art: CONFESS, text: "(it comes out anyway, like he can't hold it in anymore) You know what he did to the last guy who came up short? I've watched him do it. I throw up after. I didn't sign up for this. I just didn't have anywhere else to go." },
      ],
      ask: "It took longer to get here than it should have — but the fear's real and the clock's still running. What now?",
      choices: [
        { id: 'cover', label: "Give him the out — 'Go. Say the drain backed up. Find me tomorrow, same time.'", tone: 'disarm', to: 'o_shaky' },
        { id: 'push_now', label: "Push now — 'No more tomorrow. Decide before you climb those stairs.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'TOMMY — YOUR MAN INSIDE',
        line: "He doesn't run. He stands there a second, rain running off his collar, and something in his face lets go — like he's been waiting three weeks for someone to tell him he could stop performing. \"Tomorrow. Same time. I'll— I'll have something for you.\" Then he's up the stairs, and you hear him laugh at whatever Deak says, easy, like nothing happened.",
        ripple: "Tommy walks Ricci's route every day — every pickup, every drop, every mood Ricci's in before you ever sit down across from him. Ricci won't know he's carrying a passenger.",
        reflect: "First time in maybe a year anybody asked that kid for something small instead of everything. Funny how much easier the big yes gets once he's already said one small one.",
        heatDelta: -1,
        grants: ['insideRicci', 'runner_turned'],
        dispositions: [{ nodeId: 'runner', set: 4 }],
        campaign: { bonds: [{ id: 'runner', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['runner_turned'] },
        debrief: { principle: 'foot-in-the-door',
          note: "You didn't ask Tommy to betray Ricci tonight — you asked him to notice one pickup time. That's the whole trick of the **foot-in-the-door**: a small yes reshapes how a man sees himself, so the bigger yes tomorrow just feels like staying consistent with who he already agreed to be." },
      },
    },
    {
      id: 'o_shaky',
      mood: 'cold',
      portrait: SHAKY_END,
      outcome: {
        key: 'shaky', tone: 'mixed',
        title: 'TOMMY — RATTLED, NOT RUINED',
        line: "He gives you what you asked for — a name, a time, a scrap of Ricci's route — but his hands won't stop moving and he won't hold your eyes past the first second. You got the thing you came for. You didn't get a man you can trust to hold up under pressure.",
        ripple: "Tommy's yours for now, but a spooked source second-guesses himself. If Ricci so much as raises his voice at him, there's no telling what comes out.",
        reflect: "He handed it over shaking. I told myself that still counts as a win.",
        grants: ['insideRicci', 'runnerShaky'],
        dispositions: [{ nodeId: 'runner', set: 2 }],
        campaign: { bonds: [{ id: 'runner', delta: -1 }], ledger: ['runner_shaky'] },
        debrief: { principle: 'loss-aversion',
          note: "Threatening what he stood to lose — his skin, his getaway, his nerve — moved him faster than patience would have. **Loss aversion**: a threatened loss hits about twice as hard as an offered gain. It works. It also leaves you a man who only moved because he was scared, not because he chose you — and scared men are the first to fold back the other way." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'TOMMY — BURNED',
        line: "He doesn't answer. He just goes, up the stairs two at a time, and you already know which door he's running to. By morning Ricci knows a stranger's been working his runner — and knows your face to go with it.",
        ripple: "No inside man. Worse — Ricci's been told exactly what you look like and exactly what you're after, before you ever sit down across from him.",
        reflect: "Ricci taught that kid what fear does to a man a long time before I ever showed up. I just proved the lesson right again.",
        heatDelta: 3,
        worldFlags: ['ricciForewarned'],
        dispositions: [{ nodeId: 'runner', set: 0 }],
        campaign: { bonds: [{ id: 'runner', delta: -2 }], faction: { id: 'docks', delta: -1 }, ledger: ['runner_burned'] },
        debrief: { principle: 'types-and-tells',
          note: "You read the swagger and missed the fear under it, or you leaned on the fear like a hammer instead of a hand. Either way you picked the lever for a **type** he isn't. Force doesn't turn a scared kid — it confirms the one thing he already believed about people like you: everybody wants to use him. He ran to the only certainty he had left." },
      },
    },
  ],
};
