import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the smug shed → the crack in the
// smugness → the live radio call → each ending its own image + mood).
const SHED = 'assets/art/scene/breen_shed.jpg';           // establishing: the customs shed on the water at night
const DESK = 'assets/art/scene/breen_desk.jpg';           // stamped forms, the bottle in the bottom drawer
const GREET = 'assets/art/scene/breen_greet.jpg';         // Breen, feet up, not even sitting up to greet you
const LAUGH = 'assets/art/scene/breen_laugh.jpg';         // his easy, unbothered laugh — pours a drink, offers one
const SHIELDED = 'assets/art/scene/breen_shielded.jpg';   // the woven read: no sweat, no flinch — nothing's ever touched him
const GREEDY = 'assets/art/scene/breen_greedy.jpg';       // the woven read: no hunger in his eyes, the greed math doesn't fit
const COWARD = 'assets/art/scene/breen_coward.jpg';       // the woven read: no flinch at all — not nerve, just no fear ever earned
const CHARM = 'assets/art/scene/breen_charm.jpg';         // you play easy, buddy up
const UNMOVED = 'assets/art/scene/breen_unmoved.jpg';     // charm just makes him more comfortable, unmoved
const CRACK = 'assets/art/scene/breen_crack.jpg';         // the reality lever lands — his grin actually falters
const RADIO = 'assets/art/scene/breen_radio.jpg';         // THE COMPLICATION: the radio crackles, live, right now
const COACH = 'assets/art/scene/breen_coach.jpg';         // you coach him through the call, low and fast
const STEADY = 'assets/art/scene/breen_steady.jpg';       // his voice comes back steadier than his hands
const SILENT = 'assets/art/scene/breen_silent.jpg';       // you say nothing, let him handle it on instinct
const SWEAT = 'assets/art/scene/breen_sweat.jpg';         // old reflexes get him through it — then his hands start shaking
const BRIBE = 'assets/art/scene/breen_bribe.jpg';         // you set cash on the blotter
const COUNT = 'assets/art/scene/breen_count.jpg';         // he barely glances over, sips, unbothered — money's money
const DOUBLE = 'assets/art/scene/breen_double.jpg';       // he shrugs and reaches for more, nothing else changes
const THREAT = 'assets/art/scene/breen_threat.jpg';       // you threaten to expose him
const LAUGHOFF = 'assets/art/scene/breen_laughoff.jpg';   // he actually laughs in your face
const TURNED_END = 'assets/art/scene/breen_turned_end.jpg';   // pours out the rye he never finished
const SHAKY_END = 'assets/art/scene/breen_shaky_end.jpg';     // hands shaking, shoves the manifests over, wants you gone
const BOUGHT_END = 'assets/art/scene/breen_bought_end.jpg';   // pockets the fold, same easy grin, nothing's changed
const HARDENED_END = 'assets/art/scene/breen_hardened_end.jpg'; // face closes over, cold and careful — of you, specifically

// BREEN — the customs officer who waves the cargo through for cash. Smug,
// comfortable, and reckless because of it: he's never once eaten the downside
// of what he lets past his stamp, so nothing about the job frightens him. The
// crates matching no manifest, the men who ask about them vanishing — none of
// it touches him, in his head. It's someone else's risk. That's the read: not
// greed (there's no hunger in him), not cowardice (nothing's ever scared him) —
// pure moral hazard, a man who keeps every dollar of the upside and none of
// the downside. The lever that actually turns him isn't a bigger bribe (feeds
// the same broken deal) and isn't a threat (bounces off a man who's never once
// been made to be careful). It's making the coming audit — him, personally,
// left holding it — feel REAL for the first time in eight months.
//   TURNED  — he feels the fall for real and hands over the manifests, an ally
//   SHAKY   — scared into giving the proof, but the man himself stays a loose end
//   BOUGHT  — more cash "works," but a man never made to fear the risk stays reckless
//   HARDENS — no proof, and now HE'S careful — of you, specifically (heat)
// THE WOVEN READ: three lines into the shed and you already have to decide what
// Breen truly is — shielded and reckless (correct), greedy (wrong — there's no
// hunger in him), or a coward (wrong — nothing's ever scared him, that's the
// whole problem). The true read opens the audit-reality lever with confidence;
// wrong reads still reach every approach, just foregrounding weaker ones first,
// with an open pivot back to the reality lever if you catch your own mistake.
// THE COMPLICATION: right as the reality lever cracks his smugness for the
// first time, the shed radio comes alive — a live, real-time call demanding an
// answer NOW — a genuine test of whether the risk you just named actually
// changed how he handles himself under pressure.
export const BREEN_MISSION: Mission = {
  id: 'breen_mission',
  actionId: 'breen_turn',
  nodeId: 'breen',
  label: 'Turn the customs man',
  palette: 'sal',
  scene: 'assets/art/scene/breen.jpg',
  teaches: ['follow-the-money', 'moral-hazard'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: SHED, text: "The customs shed sits right on the water, close enough that the pilings creak under the floor with the tide. Breen's desk faces the door, boots up on the blotter, a police-band radio muttering static in the corner. He's the only stamp between whatever's in a crate and open water — and he's never once had to explain what he lets through it." },
        { who: 'you', caption: true, art: DESK, text: "Towers of manifests around him, most never read past the first line. Bottom drawer, quarter-open: a bottle of rye, three fingers gone before noon." },
        { who: 'them', art: GREET, text: "(not even sitting up) Well, look at you. Lost, or you got business with customs, chief?" },
        { who: 'you', art: GREET, text: "Heard you're the man who signs off on cargo nobody else wants to look at too close." },
        { who: 'them', art: LAUGH, text: "(a real laugh, easy, unbothered — pouring himself another) Everybody down here wants something looked-at or not-looked-at. Sit. Have a drink. What's your angle?" },
      ],
      ask: "Thirty seconds in his shed and you already know something about Breen: whatever he's been doing, he's never once paid for it. What IS he, really?",
      choices: [
        { id: 'read_shielded', label: "A man who's never eaten a single consequence for what he lets through — he genuinely believes none of this can touch him.", tone: 'press', to: 'r_shielded' },
        { id: 'read_greedy', label: "Just greedy. Name a high enough number and he'll stamp anything.", tone: 'bribe', to: 'r_greedy' },
        { id: 'read_coward', label: "A coward hiding behind a badge — corner him and he folds.", tone: 'push', to: 'r_coward' },
      ],
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_shielded',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: SHIELDED, text: "No sweat on him, no glance at the door, no flinch when you say 'cargo nobody looks at too close.' That's not a brave man. That's a man who's never once been made to eat what he's let happen. The risk belongs to somebody else, in his head — it always has." },
      ],
      ask: "You know what he is now. How do you open a man who's never once paid for anything?",
      choices: [
        { id: 'friendly', label: "Play it easy — one professional to another.", tone: 'disarm', to: 'f1' },
        { id: 'reality', label: "Lay out exactly how the coming audit ends at his stamp, not Kastner's.", tone: 'press', to: 'a1' },
        { id: 'bribe', label: 'Set a fold of cash on the blotter.', tone: 'bribe', to: 'c1' },
        { id: 'threat', label: "Threaten to expose him yourself.", tone: 'push', to: 't1' },
      ],
    },
    {
      id: 'r_greedy',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: GREEDY, text: "You peg him as a man with a price, and for a second it fits — until you notice what's missing. No hunger in his eyes at the mention of money. No calculation. A greedy man does math. Breen just doesn't think there's a bill coming, period." },
      ],
      ask: "If it's not the money moving him, careful how you spend yours. How do you open him?",
      choices: [
        { id: 'bribe', label: 'Set a fold of cash on the blotter.', tone: 'bribe', to: 'c1' },
        { id: 'reality', label: "Lay out exactly how the coming audit ends at his stamp, not Kastner's.", tone: 'press', to: 'a1' },
        { id: 'friendly', label: "Play it easy — one professional to another.", tone: 'disarm', to: 'f1' },
        { id: 'threat', label: "Threaten to expose him yourself.", tone: 'push', to: 't1' },
      ],
    },
    {
      id: 'r_coward',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: COWARD, text: "A coward flinches. Breen doesn't — not once, not at the badge talk, not at the mention of cargo. Whatever's keeping him this loose, it isn't nerve. It's the total absence of anything he's ever had to be afraid of." },
      ],
      ask: "Lean on a man who's never been made to fear anything and you'll find out fast whether that lever even exists. How do you open him?",
      choices: [
        { id: 'threat', label: "Threaten to expose him yourself.", tone: 'push', to: 't1' },
        { id: 'reality', label: "Lay out exactly how the coming audit ends at his stamp, not Kastner's.", tone: 'press', to: 'a1' },
        { id: 'friendly', label: "Play it easy — one professional to another.", tone: 'disarm', to: 'f1' },
        { id: 'bribe', label: 'Set a fold of cash on the blotter.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- friendly: charm bounces off a man who feels untouchable ---
    {
      id: 'f1',
      mood: 'cold',
      beats: [
        { who: 'you', art: CHARM, text: "(easy, matching his tone) Relax. I'm not customs, I'm not Marlowe's — I'm just a guy who noticed you're good at your job." },
        { who: 'them', art: UNMOVED, text: "(grinning, pouring another) Damn right I am. Best stamp on this stretch of water. Fourteen years, nobody's ever once had a complaint." },
        { who: 'you', caption: true, art: UNMOVED, text: "Charm just made him more comfortable. You can buddy up to this man all night and he'll pour you a drink and tell you nothing's ever going to change — because in his head, nothing ever has." },
      ],
      ask: "Friendly's not going to shake a man this sure nothing can touch him. What's your next move?",
      choices: [
        { id: 'reality', label: "Lay out exactly how the coming audit ends at his stamp, not Kastner's.", tone: 'press', to: 'a1' },
        { id: 'bribe', label: 'Set a fold of cash on the blotter.', tone: 'bribe', to: 'c1' },
        { id: 'threat', label: "Threaten to expose him yourself.", tone: 'push', to: 't1' },
      ],
    },

    // --- the reality lever + THE COMPLICATION: the mask cracks, live and now ---
    {
      id: 'a1',
      mood: 'tense',
      beats: [
        { who: 'you', art: CRACK, text: "Forget the badge, forget Marlowe. Those crates don't match a manifest anywhere on this coast. When that gets traced — and it will — it doesn't stop at Kastner and it doesn't stop at whoever's paying you. It ends at your stamp. Your signature. This shed." },
        { who: 'them', art: CRACK, text: "(the grin actually falters — first time all day) …That's not — nobody traces customs paperwork. That's not how—" },
        { who: 'you', art: CRACK, text: "It's exactly how. Follow where the cash for those crates really goes and it runs straight back through here. You're not the guy taking a little skim anymore. You're the guy holding the bag when the wrong people go looking for someone to blame." },
        { who: 'them', art: RADIO, text: "(the color's gone out of his face for the first time — and right then the radio on the shelf crackles alive) — Shed Four, Shed Four, confirm manifest on the eleven-thirty, dockmaster wants it inside the hour, over." },
      ],
      ask: "He's staring at that radio like it's a loaded gun, and at you like you're the only thing standing between him and whatever's on the other end. What do you do?",
      choices: [
        { id: 'coach', label: "Coach him through it, low and fast — exactly what to say.", tone: 'disarm', to: 'a1_coach' },
        { id: 'silent', label: "Say nothing. Let him handle a real emergency on his own for once.", tone: 'press', to: 'a1_silent' },
        { id: 'force', label: "Grab the radio — make him tell the dockmaster the truth right now.", tone: 'push', to: 'o_hardens' },
      ],
    },
    {
      id: 'a1_coach',
      mood: 'hope',
      beats: [
        { who: 'you', art: COACH, text: "(low, fast) Say it's routine. Say the count's clean, say the paperwork's coming by end of day. Don't oversell it — a man with nothing to hide doesn't apologize." },
        { who: 'them', art: STEADY, text: "(picks up the radio, and — steadier than he's sounded all conversation — reads it back word for word) …Copy that, dockmaster. Count's clean, paperwork's coming end of day. Shed Four out." },
        { who: 'them', caption: true, art: STEADY, text: "He sets the radio down. His hand isn't quite steady, but his voice was. For the first time since you walked in, Breen looks like a man who just understood, for real, what he's been sitting on top of." },
      ],
      ask: "He just found out what it feels like to actually need someone. Close it out.",
      choices: [
        { id: 'partner', label: "Offer the real trade — 'Help me bury this before it buries you, and I keep your name clean.'", tone: 'disarm', to: 'o_turned' },
        { id: 'squeeze', label: "Press your advantage — 'That favor's going to cost you. Everything you know, and the number I mentioned.'", tone: 'bribe', to: 'o_bought' },
      ],
    },
    {
      id: 'a1_silent',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: SILENT, text: "You don't say a word. Let's see what a man does with a real emergency when nobody's coaching him through it." },
        { who: 'them', art: SWEAT, text: "(grabs the radio, and the old ease comes rushing back like a reflex) …Copy, dockmaster. Count's clean, we're good here. Shed Four out. (hangs up — and only then do his hands start shaking)" },
        { who: 'them', caption: true, art: SWEAT, text: "He got through it on pure muscle memory — years of lying smooth to people who never once checked. But something's different in his face now. He just watched himself do it with someone standing there who could've stopped him. He didn't like how easy it still was." },
      ],
      ask: "He's rattled by his own reflexes, not by you. What do you do with that?",
      choices: [
        { id: 'name_it', label: "Name what he just saw — 'That's the problem, Breen. You didn't even think about it.'", tone: 'press', to: 'o_shaky' },
        { id: 'offer_now', label: "Offer the trade anyway — 'You felt that. Good. Let me make sure it's the last time.'", tone: 'disarm', to: 'o_turned' },
      ],
    },

    // --- bribe: money misreads a man who's never risked anything ---
    {
      id: 'c1',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: BRIBE, text: "You set a fold of bills on the blotter, next to his boots." },
        { who: 'them', art: COUNT, text: "(barely glances over, keeps sipping) Sure, why not. You're the fourth guy this month wanting something waved through. Money's money." },
        { who: 'you', art: COUNT, text: "This isn't for one crate. This is for the whole lane, quiet, on my say-so." },
        { who: 'them', art: DOUBLE, text: "(shrugs, already reaching for it) Costs the same to me either way, chief. I stamp, I don't ask, I go home. Numbers just get bigger. Nothing else does." },
      ],
      ask: "He'll take double, triple — whatever you offer. The number was never going to change what he actually risks. Keep buying, or cut it off?",
      choices: [
        { id: 'double', label: "Push more — 'Then here's triple. Everything through, no questions, starting now.'", tone: 'bribe', to: 'o_bought' },
        { id: 'pivot', label: "Pull it back — 'Money's not the problem, Breen. What happens when this traces to your stamp is.'", tone: 'press', to: 'a1' },
      ],
    },

    // --- threat: he laughs, insulated by fourteen years of nothing ever landing ---
    {
      id: 't1',
      mood: 'threat',
      beats: [
        { who: 'you', art: THREAT, text: "Wave the wrong crate through one more time and I make sure every badge on this coast knows your name." },
        { who: 'them', art: LAUGHOFF, text: "(actually laughs, head tipping back) Go ahead. Tell 'em. Tell the Coast Guard, tell the papers, tell your mother. Fourteen years, nobody's so much as looked at this shed twice. You think you're the first to try that line?" },
      ],
      ask: "He's laughing in your face, not even bothering to sit up straighter. What now?",
      choices: [
        { id: 'push_harder', label: "Push it further — 'Then let's find out. Today.'", tone: 'push', to: 'o_hardens' },
        { id: 'pivot', label: "Drop the threat, try truth instead — 'Forget me. Let's talk about what happens when this actually traces.'", tone: 'press', to: 'a1' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'BREEN — HE FEELS IT NOW',
        line: 'He pours out the rye he never finished and doesn\'t pour another. "Nobody\'s ever once made me think about the day this goes wrong," he says, quieter than you\'ve heard him all night. "I can get you the manifests — real weights, real dates, every crate I\'ve stamped blind for eight months. Just help me not be the one standing here alone when it does."',
        ripple: "Breen hands over eight months of stamped paper trail — proof the crates never matched a manifest, and exactly whose signature let them through. Kastner's operation just lost its quietest, most reliable door.",
        reflect: "First time all night his hands actually shook. Not from me threatening him — from him finally doing the math himself. Funny how that's the only thing that ever works.",
        heatDelta: -1,
        grants: ['customsProof', 'breenTurned'],
        dispositions: [{ nodeId: 'breen', set: 4 }],
        campaign: { bonds: [{ id: 'breen', delta: 2 }], faction: { id: 'union', delta: 1 }, ledger: ['breen_turned'] },
        debrief: { principle: 'moral-hazard',
          note: "Breen was never brave, and never greedy in the way you first guessed — he was just a man who'd never once been made to feel the downside of what he was doing. That's **moral hazard**: pocket the upside, let someone else eat the risk, and of course you get reckless. You didn't threaten him and you didn't outbid him. You made the risk his, for the first time in eight months — and a man who finally feels the fall gets very careful about who's standing next to him when it happens." },
      },
    },
    {
      id: 'o_shaky',
      mood: 'cold',
      portrait: SHAKY_END,
      outcome: {
        key: 'shaky', tone: 'mixed',
        title: 'BREEN — SCARED STRAIGHT, FOR NOW',
        line: 'He\'s shaking by the time he digs the manifests out of the bottom drawer and shoves them at you — not from anything you did, from watching his own hands do what they always do without him deciding to. "Take it. Just take it and get out of my shed." No trade offered. No thanks given.',
        ripple: "You've got the paper trail — but you left a rattled, cagey man behind who now knows exactly how thin his cover really is. Scared men talk, sometimes to the wrong people, just to feel less alone with it.",
        reflect: "I had him rattled and I named the wound instead of offering the bandage. Got the same paper. Left a different man behind.",
        grants: ['customsProof'],
        worldFlags: ['breenRattled'],
        dispositions: [{ nodeId: 'breen', set: 2 }],
        campaign: { bonds: [{ id: 'breen', delta: -1 }], ledger: ['breen_shaky'] },
        debrief: { principle: 'follow-the-money',
          note: "You actually proved the trail leads to him — every crate, every date, all the way back through his stamp. That's real **following of the money** to a name, not just a threat gestured at the danger. But proof scared out of a man isn't the same as a man who's changed sides. You have the paper. You don't have him — and paper doesn't warn you when the next crate's coming." },
      },
    },
    {
      id: 'o_bought',
      mood: 'cold',
      portrait: BOUGHT_END,
      outcome: {
        key: 'bought', tone: 'mixed',
        title: 'BREEN — STILL NOT HIS PROBLEM',
        line: 'He pockets the fold without counting it twice and slides you a stack of manifests like it\'s a receipt. "Pleasure doing business." Same easy grin as when you walked in. Nothing about him has changed — you just bought a slightly bigger version of the same reckless man.',
        ripple: "You've got paperwork on the lane. But Breen still doesn't believe anything can touch him, which means he'll wave the next crate through just as carelessly — for you, or for whoever pays next.",
        reflect: "Marlowe's whole empire runs on men who never pay for what they do. Tonight I just became one more person renting that same broken deal.",
        grants: ['customsProof'],
        dispositions: [{ nodeId: 'breen', set: 3 }],
        campaign: { money: -300, bonds: [{ id: 'breen', delta: -1 }], ledger: ['breen_bought'] },
        debrief: { principle: 'moral-hazard',
          note: "The bribe 'worked' — he handed the paper over same as anyone would for a price. But you didn't fix anything: he still keeps every dollar of the upside and eats none of the downside, so he'll take the same reckless risk for the next number too. **Moral hazard** doesn't get cured by feeding it more money. It only gets cured by making the risk his." },
      },
    },
    {
      id: 'o_hardens',
      mood: 'threat',
      portrait: HARDENED_END,
      outcome: {
        key: 'hardens', tone: 'bad',
        title: 'BREEN — HARDENED AGAINST YOU',
        line: "Whatever cracked, it wasn't him. Breen's face closes over, cold and careful for the first time all night — not scared of the audit, scared of you, specifically, and already deciding who to call about it. You get nothing. You leave knowing he's describing your face to somebody by morning.",
        ripple: "No manifests, no proof, and now a customs officer with something to protect is telling whoever protects HIS lane that a stranger's circling. The union's crew hears it before you've even sat down with Kastner.",
        reflect: "I came at a man who's never once been made to be careful, waving a threat with nothing real behind it. All I proved is that he should be careful of me.",
        heatDelta: 3,
        worldFlags: ['breenForewarned'],
        dispositions: [{ nodeId: 'breen', set: 0 }],
        campaign: { bonds: [{ id: 'breen', delta: -2 }], faction: { id: 'union', delta: -1 }, ledger: ['breen_burned'] },
        debrief: { principle: 'follow-the-money',
          note: "A threat only has teeth if it's actually tied to something real — a name, a date, a trail. You waved an empty one at a man who's spent fourteen years learning nothing ever traces back to him, and he called it instantly. If you haven't actually **followed the money** to proof, don't pretend you have it; a bluff that thin just tells him exactly how little you've got." },
      },
    },
  ],
};
