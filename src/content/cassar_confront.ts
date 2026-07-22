import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat (entrance, the frame
// he sets, the read, whichever leverage cracks him, the ice finally melting, each
// distinct ending). NOT YET GENERATED — CF image quota was exhausted at authoring
// time. Filenames are referenced here and queued in scripts/gen_cassar.sh (per-beat
// panels + the base establishing scene + the board cast portrait); run once quota
// resets, then verify every path below resolves before this mission ships.
const ENTER_SERENE = 'assets/art/scene/cassar_enter_serene.jpg';     // wide: marble vault office, he doesn't know why you're here
const GREET_SERENE = 'assets/art/scene/cassar_greet_serene.jpg';    // bored, unbothered, waves you to the chair
const ENTER_CRACKS = 'assets/art/scene/cassar_enter_cracks.jpg';    // cologne exact, hands folding the same paper twice
const DEMAND_CRACKS = 'assets/art/scene/cassar_demand_cracks.jpg'; // "let's establish how much trouble you're in"
const ENTER_FOREWARNED = 'assets/art/scene/cassar_enter_forewarned.jpg'; // two men in bank suits at the door
const THREAT_FOREWARNED = 'assets/art/scene/cassar_threat_forewarned.jpg'; // already decided how this ends
const OPEN_FRAME = 'assets/art/scene/cassar_open_frame.jpg';        // "precision is the only language I respect"
const SIZEUP = 'assets/art/scene/cassar_sizeup.jpg';                // you, caption — the lamp, the ledger, the checked watch
const READ_MISS_ARMOR = 'assets/art/scene/cassar_read_missarmor.jpg'; // the wrong read self-corrects: the private line, the leash
const READ_MISS_GREED = 'assets/art/scene/cassar_read_missgreed.jpg'; // the wrong read self-corrects: he waves off a number, bored
const READ_HIT = 'assets/art/scene/cassar_read_hit.jpg';            // the true read: the half-beat-too-long laugh
const TABLE_WAIT = 'assets/art/scene/cassar_table_wait.jpg';        // one manicured nail tapping, already bored of you
const LEDGER_ALARM = 'assets/art/scene/cassar_ledger_alarm.jpg';    // the hand goes still — "which teller"
const LEDGER_PRESS = 'assets/art/scene/cassar_ledger_press.jpg';    // you, unmoved — the copy already outside this building
const AUDIT_ALARM = 'assets/art/scene/cassar_audit_alarm.jpg';      // the coffee stops halfway to his mouth
const AUDIT_PRESS = 'assets/art/scene/cassar_audit_press.jpg';      // you — "a Tuesday, unannounced, your name circled"
const NAMES_ALARM = 'assets/art/scene/cassar_names_alarm.jpg';      // a flicker behind the contempt at Sable's name
const NAMES_PRESS = 'assets/art/scene/cassar_names_press.jpg';      // you — the upriver names, printed in your head
const CUSTOMS_ALARM = 'assets/art/scene/cassar_customs_alarm.jpg';  // the first real silence since you sat down
const CUSTOMS_PRESS = 'assets/art/scene/cassar_customs_press.jpg';  // you — the crate, the vault, the same sentence
const CRACK_STILL = 'assets/art/scene/cassar_crack_still.jpg';      // very still, doing arithmetic with his own life
const CRACK_PUSH = 'assets/art/scene/cassar_crack_push.jpg';        // you name what you actually want: the man at the Hall
const CRACK_SWEAT = 'assets/art/scene/cassar_crack_sweat.jpg';      // the ice finally goes — almost relief at not performing
const CRACK_DOUBT = 'assets/art/scene/cassar_crack_doubt.jpg';      // you, caption — "let him be exactly as bad as advertised"
const END_ALLY = 'assets/art/scene/cassar_end_ally.jpg';            // the vault stays his, the leash is yours
const END_BROKEN = 'assets/art/scene/cassar_end_broken.jpg';        // stripped bare, resigning within the week
const END_MONEY = 'assets/art/scene/cassar_end_money.jpg';          // a wired confirmation slid across the desk like a receipt
const END_WALK = 'assets/art/scene/cassar_end_walk.jpg';            // a button pressed under the desk, you're walked out

// CASSAR — the Chapter Four sit-down, the Act II climax. Where the empire's dirty
// cargo money gets washed clean, and where the reveal lands that the real partners
// are UPRIVER, federal-scale (the names Vera hinted at, and the ones Sable heard
// over cigars). Cassar is not muscle and not a boss — he's an AGENT, precise and
// contemptuous, who has convinced himself a wall of paper makes him untouchable.
// He is wrong, and the whole scene is about proving it to him before he proves it
// to himself.
//   • the OPENING reacts to your prep (serene / cracks / forewarned — chosen by
//     startAt in game.ts from world-flags and heat)
//   • THE WOVEN READ: what actually protects Cassar isn't the ledgers (a miss —
//     self-corrects), isn't greed (a miss — self-corrects), it's that he's an agent
//     of men who erase liabilities exactly the way he erases a bad quarter, and some
//     buried part of him knows he could become one
//   • the TABLE gates four different levers on four different prep threads —
//     the teller's account access, the auditor's exposure, Sable's upriver names,
//     the customs money trail from the docks — any one of them is enough to crack
//     the ice; without one, only nerve is left, and nerve alone doesn't work on a banker
//   • however you crack him, he gives up the name — COMMISSIONER VANE, the man at
//     the Hall who keeps the whole wash legally invisible — but how you leave him
//     (ally, broken, or bought off) decides what he does with that terror next
// Endings carry a `deal` {closed, gotName, faceIdx} the board applies: getting the
// name unlocks Chapter Five; gotName endings additionally `grant` 'vaneNamed'.
export const CASSAR_CONFRONT: Mission = {
  id: 'cassar_confront',
  actionId: 'cassar_confront',
  nodeId: 'cassar',
  label: 'Sit down with Cassar',
  palette: 'marlowe',
  scene: 'assets/art/scene/cassar.jpg',
  teaches: ['anchoring', 'follow-the-money', 'principal-agent', 'walk-away-power'],
  start: 's0_serene',
  nodes: [
    // --- reactive openings (game.ts picks one via startAt), all → 'open' ---
    {
      id: 's0_serene',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ENTER_SERENE, text: "Cassar's office sits behind two vault doors and a private elevator — marble floors, a single green banker's lamp, air so still and cold it feels sterile, like money that's been laundered so many times it forgot it was ever dirty. He built a career on the theory that numbers this clean can never be called a lie. He has no idea yet that theory has a hole in it." },
        { who: 'them', art: GREET_SERENE, text: "Mr. Cassar doesn't take walk-ins, but the appointment book had an opening, and I confess I was curious what a boy from the docks wanted with a private bank. Sit. You have exactly as long as my coffee stays hot." },
      ],
      choices: [{ id: 'go', label: "Take the chair he didn't expect to offer.", tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_cracks',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: ENTER_CRACKS, text: "Word travels even through marble. Somebody's been asking his tellers careful questions, somebody's gotten close enough to his numbers to smell what's rotting under them. Cassar's cologne is exact as ever. His hands, folding and refolding the same paper, are not." },
        { who: 'them', art: DEMAND_CRACKS, text: "You've been remarkably industrious in my building. My staff, my accounts — all suddenly very interested in a stranger's questions. Sit. Let's establish, precisely, how much trouble you think you're in." },
      ],
      choices: [{ id: 'go', label: 'Sit. Let him ask first.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: ENTER_FOREWARNED, text: "Someone warned him. Two men in bank-issue suits who are not tellers flank the door behind you now, and Cassar hasn't looked up from his ledger once — a man who's already decided how this ends and is simply finishing a sentence first." },
        { who: 'them', art: THREAT_FOREWARNED, text: "I know precisely who you are, Mr. Vidal's son, and precisely what you imagine you've found. Men who come at me with half a story leave through that door in a considerably worse condition than they arrived. Convince me you're not one of them." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. Don't blink.", tone: 'disarm', to: 'open' }],
    },

    // --- the table ---
    {
      id: 'open',
      mood: 'tense',
      beats: [
        { who: 'them', art: OPEN_FRAME, text: "Let's be precise, since precision is the only language I actually respect. You're here about money that isn't yours, belonging to men considerably more dangerous than either of us. What could a dockrat possibly hold that I should be afraid of?" },
        { who: 'you', caption: true, art: SIZEUP, text: "No raised voice, no tell in the hands — just the lamp, the ledger, and a watch he keeps checking though there's no clock in the room. A man that certain of his own armor has never once had to test it. Three weeks circling his bank taught you where the seams are. The question is whether he knows they're there." },
      ],
      ask: "Under the ice — what does Cassar actually believe keeps him safe?",
      choices: [
        { id: 'readArmor', label: "The paperwork. Shell companies layered deep enough that nothing traces back to him.", tone: 'push', to: 'read_missArmor' },
        { id: 'readGreed', label: "Nothing noble — just a mercenary. Pay him more than the danger's worth and he folds.", tone: 'push', to: 'read_missGreed' },
        { id: 'readAgent', label: "Not the paperwork — the men upriver. He launders for people who erase inconvenient liabilities exactly the way he erases a bad quarter, and some buried part of him knows he's exactly that kind of expense.", tone: 'disarm', to: 'read_hit' },
      ],
    },

    // --- the read: deduce him before you press (correct read colors the table,
    // wrong reads correct themselves — no dead end, just a worse first step) ---
    {
      id: 'read_missArmor',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_MISS_ARMOR, text: "You go in believing the wall of paper is the whole man — until you notice the private line on his desk, unlisted, no bank routing on it at all, and how his eyes drift to it like a man checking a leash is still slack. Paper doesn't sweat like that. Something upriver does." },
      ],
      choices: [{ id: 'go', label: 'File that away. Play the table.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_missGreed',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_MISS_GREED, text: "You size him for a mercenary — until you watch him wave off an assistant's whispered number without so much as glancing at it. A man who'd fold for a price doesn't get bored of prices. Whatever actually moves Cassar, it stopped being money a long time ago." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_hit',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_HIT, text: "You catch it in the stillness after his own joke — the half-beat too long before he laughs at it, like a man rehearsing being fine. He isn't guarding the ledger. He's guarding himself, from people who'd close his account the same cold way he closes anyone else's. Play to that, not to the ice." },
      ],
      choices: [{ id: 'go', label: 'Play him accordingly.', tone: 'disarm', to: 'table' }],
    },

    {
      id: 'table',
      mood: 'tense',
      beats: [
        { who: 'them', art: TABLE_WAIT, text: "(taps one manicured nail once against the desk, waiting, already bored of you)" },
      ],
      ask: "He's set his frame — cold, certain, expensive. What do you put against it?",
      choices: [
        { id: 'ledger', label: "The dirty ledgers — 'Your own teller walked me through the accounts you keep off the books.'", tone: 'push', requires: ['accountAccess'], to: 'c_ledger' },
        { id: 'audit', label: "The audit — 'One phone call, and the auditor's report ends your license by morning.'", tone: 'push', requires: ['auditLever'], to: 'c_audit' },
        { id: 'names', label: "The upriver names — 'I know exactly who you wash for. Sable was very forthcoming.'", tone: 'push', requires: ['upriverNames'], to: 'c_names' },
        { id: 'customs', label: "The customs trail — 'I followed the money from a dock crate straight into this vault.'", tone: 'push', requires: ['customsProof'], to: 'c_customs' },
        { id: 'nerve', label: "Nerve alone — 'I don't need proof. I need you scared.'", tone: 'push', to: 'o_walk' },
      ],
    },

    {
      id: 'c_ledger',
      mood: 'threat',
      beats: [
        { who: 'them', art: LEDGER_ALARM, text: "(the manicured hand stills on the desk, precise as a machine that's just found a decimal out of place) …Which teller." },
        { who: 'you', art: LEDGER_PRESS, text: "Doesn't matter which. What matters is the copy of your real books sitting outside this building right now, addressed to people who audit banks for a living." },
      ],
      choices: [{ id: 'go', label: 'Let it sit. Watch him do the arithmetic.', tone: 'disarm', to: 'crack' }],
    },
    {
      id: 'c_audit',
      mood: 'threat',
      beats: [
        { who: 'them', art: AUDIT_ALARM, text: "(for the first time, the coffee stops halfway to his mouth) …You don't have the standing to commission an audit." },
        { who: 'you', art: AUDIT_PRESS, text: "I don't need to commission one. I need you to imagine one landing on a Tuesday, unannounced, with your name already circled in someone else's red ink." },
      ],
      choices: [{ id: 'go', label: 'Let it sit. Watch him do the arithmetic.', tone: 'disarm', to: 'crack' }],
    },
    {
      id: 'c_names',
      mood: 'threat',
      beats: [
        { who: 'them', art: NAMES_ALARM, text: "(something flickers, quick and involuntary, behind the contempt) …Sable talks a great deal for a woman who knows so little." },
        { who: 'you', art: NAMES_PRESS, text: "She knew enough. Gentlemen upriver who'd very much prefer their names stayed printed nowhere. I have them printed in my head, which is a much harder place to subpoena." },
      ],
      choices: [{ id: 'go', label: 'Let it sit. Watch him do the arithmetic.', tone: 'disarm', to: 'crack' }],
    },
    {
      id: 'c_customs',
      mood: 'threat',
      beats: [
        { who: 'them', art: CUSTOMS_ALARM, text: "(a beat — the first real silence since you sat down) …That cargo was never manifested." },
        { who: 'you', art: CUSTOMS_PRESS, text: "It didn't need to be manifested. It just needed a place to become clean money afterward. You're sitting in it." },
      ],
      choices: [{ id: 'go', label: 'Let it sit. Watch him do the arithmetic.', tone: 'disarm', to: 'crack' }],
    },

    // --- the crack: the ice finally goes, and he gives up the name ---
    {
      id: 'crack',
      mood: 'threat',
      beats: [
        { who: 'them', art: CRACK_STILL, text: "(very still, doing arithmetic with his own life for perhaps the first time in his career) …And what is it you imagine buys my cooperation." },
        { who: 'you', art: CRACK_PUSH, text: "Not your bank. Not your license. I want the man who makes sure none of this ever reaches a courtroom — the one at the Hall who keeps your friends untouchable, and keeps you convinced you're one of them. Careful how you answer. I already know your father discussed 'the Vidal business' with him over cigars." },
        { who: 'them', art: CRACK_SWEAT, text: "(the ice finally goes, just for a moment — something almost like relief at being allowed to stop performing) …You have no idea the kind of man you're asking me to burn. Commissioner Vane. Eleven years he's kept this arrangement invisible. Eleven years, and I never once heard him raise his voice either." },
        { who: 'you', caption: true, art: CRACK_DOUBT, text: "Good. Let him be exactly as bad as advertised. You already knew the ledger would talk eventually. You just needed to be the one holding the pen when it did." },
      ],
      ask: "You have the ice king naming names. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'inFace', label: "Force the name, let him keep the bank — 'Give me Vane, and your vault stays yours. From tonight you launder nothing without my knowing first.'", tone: 'disarm', to: 'o_ally' },
        { id: 'inBreak', label: "Force the name, and break him — 'Vane's name, and then you resign, publicly, disgraced, before your friends decide a liability like you is cheaper erased than exposed.'", tone: 'push', to: 'o_broken' },
        { id: 'moneyOnly', label: "Take the money instead — 'Forget the name. Make it worth my silence.'", tone: 'bribe', to: 'o_deal_money' },
      ],
    },

    // --- endings (carry the deal result) ---
    {
      id: 'o_ally',
      mood: 'hope',
      portrait: END_ALLY,
      outcome: {
        key: 'ally', tone: 'good',
        title: 'CASSAR — THE VAULT STAYS OPEN',
        line: "He gives you Vane's name the way he'd approve a loan — clipped, precise, already calculating the terms of his own survival. \"Commissioner Vane. He has kept this... arrangement invisible for eleven years. That is who you want.\" You leave him his marble office, his green lamp, his contempt fully intact. You also leave him owned: every transaction from tonight runs past you first.",
        ripple: "Cassar is yours now, quietly, on his own institutional terms — the wash keeps flowing, but you read the ledger before Vane ever does. The Hall is next.",
        reflect: "He kept his office, his suit, his precious ice. I kept the leash. I'm starting to understand why Marlowe never bothered killing anyone he could simply own instead.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['vaneNamed'],
        campaign: { bonds: [{ id: 'cassar', delta: 2 }], faction: { id: 'bank', delta: 2 }, ledger: ['cassar_turned', 'vaneNamed'] },
        debrief: { principle: 'principal-agent',
          note: "Cassar was never truly loyal to the men upriver — he was their **agent**, watched imperfectly, serving himself in every gap the watching missed. That's the **principal-agent problem**: whoever hires the hand can't observe every transaction it makes, so the hand skims, hedges, protects itself first. Tonight you didn't destroy that arrangement. You simply became the new principal watching the gaps his real bosses forgot to fill." },
      },
    },
    {
      id: 'o_broken',
      mood: 'threat',
      portrait: END_BROKEN,
      outcome: {
        key: 'broken', tone: 'mixed',
        title: 'CASSAR — THE LEDGER, TORN OPEN',
        line: "You don't let him keep the performance. He gives up Vane's name in a voice gone thin and flat, then keeps talking — the shells, the layering, three years of it, because a broken man confesses everything, not just the one thing you asked for. By the time he's done there's a paper trail from the docks to the Hall with his own signature on every rung. He resigns within the week. He will never forgive you for it.",
        ripple: "The wash is exposed top to bottom — you have Vane's name and the proof to back it. But Cassar is ruined and humiliated, and a ruined banker has nothing left to lose by making a call of his own.",
        reflect: "I asked for one name and got a confession instead. Efficient. He'd have called that good arithmetic, before I made him the number that got subtracted.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        heatDelta: 1,
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['vaneNamed'],
        campaign: { bonds: [{ id: 'cassar', delta: -3 }], faction: { id: 'bank', delta: 1 }, ledger: ['cassar_broken', 'vaneNamed'] },
        debrief: { principle: 'follow-the-money',
          note: "You didn't stop at the one name — you rode the entire trail he'd built to hide it, placement to layering to integration, until dirty cargo money and a clean-looking bank account were the same sentence spoken out loud. That's **following the money**: a wash only survives while nobody traces it start to finish. You just did, in his own office, and left him nothing left to still call clean." },
      },
    },
    {
      id: 'o_deal_money',
      mood: 'cold',
      portrait: END_MONEY,
      outcome: {
        key: 'money', tone: 'mixed',
        title: 'CASSAR — YOU TOOK THE PRICE',
        line: "He names a figure before you've even finished your sentence — precise, generous, already wired by the time you leave the building. \"A sensible arrangement,\" he calls it, sliding the confirmation across the desk like a receipt. Your leverage bought you comfort. It didn't buy you Vane.",
        ripple: "You're richer, and Cassar now knows exactly how to buy silence, having just tested it on you. The Hall stays out of reach — for now.",
        reflect: "I had him arithmetic-scared and let him do the math instead of me. He priced my silence before I'd priced anything. That's not nothing. It's just not enough.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
        campaign: { bonds: [{ id: 'cassar', delta: 0 }], faction: { id: 'bank', delta: 1 }, ledger: ['cassar_bought'] },
        debrief: { principle: 'anchoring',
          note: "The instant you had him cornered, HE spoke the number first — fast, round, generous enough to sound like a favor instead of a ransom — and you let it become the whole conversation. That's **anchoring** working against you: whoever states the first hard figure owns the frame that follows. His number bought your silence at a price he set. You never even stated yours — the name." },
      },
    },
    {
      id: 'o_walk',
      mood: 'threat',
      portrait: END_WALK,
      outcome: {
        key: 'walk', tone: 'bad',
        title: 'CASSAR — NOTHING TO A BANK',
        line: "He lets you finish, entirely unimpressed, then presses a single button under the desk. \"Gentlemen who bring me nerve instead of paper usually discover how little nerve is worth in a building built entirely on paper.\" The two men who are not tellers walk you out. You learn nothing. He remembers your face precisely.",
        ripple: "No deal. Cassar's on guard now, and his private, unlisted line to the men upriver just placed a very interesting call about you.",
        reflect: "Pa never walked into a bank asking for credit he hadn't earned. I just did. A man who trades in numbers doesn't respect a story with none behind it.",
        heatDelta: 3,
        deal: { closed: false, gotName: false, faceIdx: 2 },
        campaign: { bonds: [{ id: 'cassar', delta: -2 }], faction: { id: 'bank', delta: -1 }, ledger: ['cassar_alerted'] },
        debrief: { principle: 'walk-away-power',
          note: "You sat down with nothing that made saying no cost him anything — no exposed ledger, no audit, no name in your pocket — and pushed anyway. He could afford to end the meeting, because he could. **Walk-away power** belongs to whoever survives 'no' the longest; in a room built entirely on other people's money, that was never going to be you, empty-handed." },
      },
    },
  ],
};
