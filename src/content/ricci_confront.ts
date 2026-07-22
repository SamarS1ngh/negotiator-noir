import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, hard-varied framing
// across the duel (entrance, sizing-up, tense exchanges, leverage reveals, Ricci's
// composure cracking, and each distinct ending).
const ENTHRONE = 'assets/art/scene/ricci_enthrone.jpg';       // wide: Ricci owns the room, you enter
const COLD_SIT = 'assets/art/scene/ricci_cold_sit.jpg';       // "sit, cigarette's done"
const RATTLED_JAW = 'assets/art/scene/ricci_rattled_jaw.jpg'; // jaw tight, eyes flick to the door
const RATTLED_SIT = 'assets/art/scene/ricci_rattled_sit.jpg';// "you've been busy... sit"
const FOREWARNED_WATCH = 'assets/art/scene/ricci_forewarned_watch.jpg'; // counting exits
const FOREWARNED_THREAT = 'assets/art/scene/ricci_forewarned_threat.jpg'; // "in the water tonight"
const HARDENED_HATE = 'assets/art/scene/ricci_hardened_hate.jpg'; // already decided to hate you
const HARDENED_ULTIMATUM = 'assets/art/scene/ricci_hardened_ultimatum.jpg'; // "this is a courtesy"
const OPEN_TABLE = 'assets/art/scene/ricci_open_table.jpg';   // wide symmetrical: the duel begins
const EGO_SMILE = 'assets/art/scene/ricci_ego_smile.jpg';     // thin pleased smile, guard drops
const SMALL_AMUSED = 'assets/art/scene/ricci_small_amused.jpg'; // condescending, "amuse me"
const FEAR_FLICKER = 'assets/art/scene/ricci_fear_flicker.jpg'; // extreme close-up, mask slips
const FEAR_NAMED = 'assets/art/scene/ricci_fear_named.jpg';   // over-the-shoulder, you name his fear
const SKIM_ALARM = 'assets/art/scene/ricci_skim_alarm.jpg';   // the smile dies, half-risen
const SKIM_LEVERAGE = 'assets/art/scene/ricci_skim_leverage.jpg'; // you, calm, proof on the table
const SKIM_STILL = 'assets/art/scene/ricci_skim_still.jpg';   // "very still" — recalculating
const SKIM_AMBITION = 'assets/art/scene/ricci_skim_ambition.jpg'; // your hunger laid bare
const SKIM_MIRROR = 'assets/art/scene/ricci_skim_mirror.jpg'; // his monologue — recognition
const SKIM_DOUBT = 'assets/art/scene/ricci_skim_doubt.jpg';   // your composure cracks a beat
const RIVAL_FEAR = 'assets/art/scene/ricci_rival_fear.jpg';   // Bianchi's name lands
const RIVAL_TRAP = 'assets/art/scene/ricci_rival_trap.jpg';   // you close the trap
const RIVAL_CONSIDER = 'assets/art/scene/ricci_rival_consider.jpg'; // pride vs survival
const RIVAL_ULTIMATUM = 'assets/art/scene/ricci_rival_ultimatum.jpg'; // your terms, final
const DEBT_SHRUG = 'assets/art/scene/ricci_debt_shrug.jpg';   // the grudging concession
const ALLY_END = 'assets/art/scene/ricci_ally_end.jpg';       // debt burns, quiet resignation
const BROKEN_END = 'assets/art/scene/ricci_broken_end.jpg';   // on his knees, eyes vengeful
const NONAME_END = 'assets/art/scene/ricci_noname_end.jpg';   // tears the paper, closed door
const WALK_END = 'assets/art/scene/ricci_walk_end.jpg';       // he stands, straightens his coat

// RICCI — THE CONFRONTATION. The payoff of the whole prep web, played in the same
// branching form as the missions. Your prep reshapes it:
//   • the OPENING reacts to what you did (cold / rattled / forewarned / hardened —
//     chosen by startAt in game.ts from your world-flags)
//   • the SKIM you dug up ('proof') unlocks the blade that cracks his hardline on
//     Marlowe's NAME — without it you can free your father's debt but never climb
//   • what Sal told you ('salMole') lets you name his fear of Marlowe out loud
//   • how you leave him — save his face or break him — makes him an ally-mole or a
//     vengeful enemy
// Endings carry a `deal` {closed, gotName, faceIdx} the board applies: getting the
// name unlocks Marlowe; faceIdx 0 = ally, 2 = enemy.
export const RICCI_CONFRONT: Mission = {
  id: 'ricci_confront',
  actionId: 'ricci_sitdown',
  nodeId: 'ricci',
  label: 'Sit down with Ricci',
  palette: 'ricci',
  scene: 'assets/art/scene/ricci.jpg',
  teaches: ['leverage-and-batna', 'golden-bridge', 'walk-away-power', 'the-mirror'],
  start: 's0_cold',
  nodes: [
    // --- reactive openings (game.ts picks one via startAt), all → 'open' ---
    {
      id: 's0_cold',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ENTHRONE, text: "Ricci sits like he owns the room — because on this dock, he does. He doesn't know your face. He doesn't know you're Tomas Vidal's kid. Not yet." },
        { who: 'them', art: COLD_SIT, text: "So you're the one who wanted the meeting. Sit. You've got until my cigarette's done." },
      ],
      choices: [{ id: 'go', label: 'Sit down across from him.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_rattled',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: RATTLED_JAW, text: "You worked his people before you ever sat down, and it shows. Ricci's jaw is tight; his eyes keep flicking to the door." },
        { who: 'them', art: RATTLED_SIT, text: "You've been busy. Turning my own dock against me. …Sit. Say your piece, and make it fast." },
      ],
      choices: [{ id: 'go', label: 'Take the seat. Let him stew.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: FOREWARNED_WATCH, text: "Someone talked. Ricci knows a stranger's been circling his people — and he's watching you the way a man counts the exits." },
        { who: 'them', art: FOREWARNED_THREAT, text: "Somebody's been in my house. If that somebody is you, you'd better have a reason I don't put you in the water tonight." },
      ],
      choices: [{ id: 'go', label: 'Hold his eye. Sit.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_hardened',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: HARDENED_HATE, text: "You spooked the wrong man and it got back to him. Ricci decided he hated you before you walked in." },
        { who: 'them', art: HARDENED_ULTIMATUM, text: "I know exactly who you are and what you've been doing on my docks. This meeting is a courtesy before I end it. Talk." },
      ],
      choices: [{ id: 'go', label: 'Sit anyway. Show no fear.', tone: 'disarm', to: 'open' }],
    },

    // --- the table ---
    {
      id: 'open',
      mood: 'tense',
      beats: [
        { who: 'them', art: OPEN_TABLE, text: "Your father's debt. Five hundred. Mine to collect, yours to pay — that's the whole conversation. Unless you brought something better than a sad story." },
        { who: 'you', caption: true, art: SKIM_STILL, text: "Three weeks of watching taught you the shape of him before he ever opened his mouth — the rings, the chair set like a throne, the timed cigarette that says he owns the clock too. A man that loud about being untouchable is running from something. The question is what." },
      ],
      ask: "Before you answer, size him up. What is Ricci, really?",
      choices: [
        { id: 'readEgo', label: "An act — pride on top, and underneath it, something he's terrified of.", tone: 'disarm', to: 'read_hit' },
        { id: 'readMuscle', label: "Just muscle. Scare him and he folds.", tone: 'push', to: 'read_missMuscle' },
        { id: 'readBroken', label: "Already owned outright — Marlowe's got him on a leash.", tone: 'disarm', to: 'read_missBroken' },
      ],
    },

    // --- the read: deduce him before you open (correct read colors the table,
    // wrong reads correct themselves — no dead end, just a worse first step) ---
    {
      id: 'read_hit',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: FEAR_FLICKER, text: "You catch it before he buries it — half a second where his eyes flick to the door Marlowe might walk through, then it's gone, smoothed back under the tilt of a man who wants applause. Feed the ego and he'll hand you the room. Beg him for charity and he'll smell the weakness and shut like a fist." },
      ],
      choices: [{ id: 'go', label: 'Play him accordingly.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_missMuscle',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HARDENED_HATE, text: "You're already reaching for a threat when you catch yourself — the rings, the ledger, the way he's outlasted three bosses before this one. Men who fold to a raised voice don't sit where he sits. Whatever he is, it isn't simple muscle." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_missBroken',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: DEBT_SHRUG, text: "If Marlowe had him leashed that tight, he wouldn't need the performance — the throne of a chair, the cigarette clock. A man already broken doesn't posture. He's still playing his own game underneath Marlowe's, not just running its errands." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'table' }],
    },

    {
      id: 'table',
      mood: 'tense',
      ask: "He's laid the debt and his authority on the table. How do you come at him?",
      choices: [
        { id: 'skim', label: "The blade (needs proof) — 'You skim Marlowe. I can prove it. He'd love to see this.'", tone: 'push', requires: ['proof'], to: 'c_skim' },
        { id: 'rival', label: "The rival (Bianchi's circling) — 'He's about to take everything you built. I'm your only way to survive it.'", tone: 'push', requires: ['bianchiPressing'], to: 'c_rival' },
        { id: 'fear', label: "His fear (you've read it) — 'You lie awake over Marlowe. Don't bother denying it.'", tone: 'push', requires: ['knowsFear'], to: 'c_fear' },
        { id: 'ego', label: "His ego — 'A man like you doesn't need five hundred. You need respect. I can give you both.'", tone: 'disarm', to: 'c_ego' },
        { id: 'small', label: "Play small — 'I know I'm nothing to you. That's why you can afford to hear me out.'", tone: 'disarm', to: 'c_small' },
      ],
    },

    {
      id: 'c_ego',
      mood: 'warm',
      beats: [
        { who: 'them', art: EGO_SMILE, text: "(a thin smile) …Finally. Someone on this pier with manners. Go on, then. Impress me." },
      ],
      ask: "His guard dropped a notch. Where do you take it?",
      choices: [
        { id: 'toName', label: "Press the blade now (requires proof) — while he's warm.", tone: 'push', requires: ['proof'], to: 'c_skim' },
        { id: 'toDebt', label: "To the debt — 'Kill my father's paper. Pennies to you, and it buys my loyalty.'", tone: 'disarm', to: 'c_debt_soft' },
        { id: 'toomuch', label: "Lay the flattery on thick — 'You could run this whole coast.'", tone: 'push', to: 'o_walk' },
      ],
    },

    {
      id: 'c_small',
      mood: 'tense',
      beats: [
        { who: 'them', art: SMALL_AMUSED, text: "(leans back, amused) At least you know your place. Fine. Amuse me, nobody." },
      ],
      ask: "He thinks you're harmless. Spend that — or you've made yourself small for nothing.",
      choices: [
        { id: 'spring', label: "Spring the blade (requires proof) — 'My place? I'm the man holding proof you rob your boss.'", tone: 'push', requires: ['proof'], to: 'c_skim' },
        { id: 'humble', label: "Ask for the debt, humbly.", tone: 'disarm', to: 'c_debt_soft' },
        { id: 'grovel', label: "Keep playing small — beg a little.", tone: 'disarm', to: 'o_walk' },
      ],
    },

    {
      id: 'c_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: FEAR_FLICKER, text: "(a flicker behind the eyes) You don't know the first thing about me." },
        { who: 'you', art: FEAR_NAMED, text: "Sal told me enough. You lie awake over Marlowe the same way the men you squeeze lie awake over you." },
      ],
      ask: "You said his fear out loud. He's rattled — and a cornered proud man is dangerous. Press it how?",
      choices: [
        { id: 'out', label: "Offer him an out (requires proof) — the skim, and a way to survive it.", tone: 'push', requires: ['proof'], to: 'c_skim' },
        { id: 'together', label: "Without proof — 'Help me take Marlowe down before he gets to you.'", tone: 'disarm', to: 'c_debt_soft' },
        { id: 'bluff', label: "Bluff — 'I'll tell Marlowe myself.' (you can't prove a thing)", tone: 'push', to: 'o_walk' },
      ],
    },

    {
      id: 'c_skim',
      mood: 'threat',
      beats: [
        { who: 'them', art: SKIM_ALARM, text: "(the smile dies) …Where did you get that. WHO showed you—" },
        { who: 'you', art: SKIM_LEVERAGE, text: "Doesn't matter. What matters is Marlowe never sees it — if you give me what I want." },
        { who: 'them', art: SKIM_STILL, text: "(very still) …And what is it you think you want, kid." },
        { who: 'you', art: SKIM_AMBITION, text: "The men above you. The district, the empire, all the way to the top. I want up — and you're going to be my first rung." },
        { who: 'them', art: SKIM_MIRROR, text: "(a long look, and something almost like recognition) …I know you. Not the face — the kind. A nobody with a dead father and a fire where his gut should be. I was you, once. Look what I clawed my way into. Look what it cost. Give it ten years — you'll be the one on this side of the table, doing this to some other boy." },
        { who: 'you', caption: true, art: SKIM_DOUBT, text: "The worst of it wasn't the threat. It was that he wasn't wrong." },
      ],
      ask: "You have him by the throat, and he's more afraid of Marlowe than of you. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'inFace', label: "Your way in, let him save face — 'Keep your job, your skim stays buried. From tonight you're my man on these docks, feeding me up the ladder.'", tone: 'disarm', to: 'o_in_ally' },
        { id: 'inBreak', label: "Your way in, and break him — 'You're walking me up the ladder, past every man above you. On your knees, in front of your own men.'", tone: 'push', to: 'o_in_broken' },
        { id: 'debtOnly', label: "Just the debt — 'Tear up my father's paper and I keep your secret. That's all.'", tone: 'disarm', to: 'o_deal_noname' },
      ],
    },

    {
      id: 'c_rival',
      mood: 'fear',
      beats: [
        { who: 'them', art: RIVAL_FEAR, text: "(a flicker of fear he can't mask) Bianchi. That circling son of a bitch. …What do you know." },
        { who: 'you', art: RIVAL_TRAP, text: "That he's about to have everything you built. And that Marlowe protects earners — not men who let a rival walk in his front door. When Bianchi takes your water, you stop being a collector. You become a loose end." },
        { who: 'them', art: RIVAL_CONSIDER, text: "(very still) …And you're offering. To hold him off." },
        { who: 'you', art: RIVAL_ULTIMATUM, text: "Marlowe. Not his name — I want the man. Get me in, and I keep Bianchi off your throat. Refuse, and I hand him the last push myself." },
      ],
      ask: "Not a secret this time — his own desperation has him by the neck. What do you force out of him, and how do you leave him?",
      choices: [
        { id: 'inFace', label: "Your way in, let him save face — 'Keep your name. From tonight you're my man on these docks, feeding me up the ladder.'", tone: 'disarm', to: 'o_in_ally' },
        { id: 'inBreak', label: "Your way in, and break him — 'Beg me to keep Bianchi off you. On your knees.'", tone: 'push', to: 'o_in_broken' },
        { id: 'debtOnly', label: "Just the debt — 'Tear up my father's paper and I'll keep Bianchi busy. That's all.'", tone: 'disarm', to: 'o_deal_noname' },
      ],
    },

    {
      id: 'c_debt_soft',
      mood: 'cold',
      beats: [
        { who: 'them', art: DEBT_SHRUG, text: "(a long look, then a shrug) …The paper. Fine. Your father's debt dies tonight. But my business stays mine. We clear?" },
      ],
      ask: "He'll kill the debt — but he'll never name Marlowe without a blade to his throat. Take it, or overreach?",
      choices: [
        { id: 'take', label: "Take it — the debt dies, you walk out free.", tone: 'disarm', to: 'o_deal_noname' },
        { id: 'pushName', label: "Push for the name anyway — you've got nothing to hold him with.", tone: 'push', to: 'o_walk' },
      ],
    },

    // --- endings (carry the deal result) ---
    {
      id: 'o_in_ally',
      mood: 'hope',
      portrait: ALLY_END,
      outcome: {
        key: 'in_ally', tone: 'good',
        title: 'RICCI — YOUR WAY IN',
        line: "Terrified of what you hold, he folds — and because you let him keep his dignity, he does the unthinkable to his master: he stays in place on the docks as YOUR man. Your father's debt burns in the ashtray. And a door into the empire, closed to everyone, is open to you.",
        ripple: "Ricci is your man inside Marlowe's operation now — the way up is open. And your father's debt is dead.",
        reflect: "I left him his dignity. Maybe that's the line — the last thing that keeps me from becoming exactly what he said I'd become.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        campaign: { bonds: [{ id: 'ricci', delta: 2 }], faction: { id: 'docks', delta: 2 }, ledger: ['ricci_turned'] },
        debrief: { principle: 'golden-bridge',
          note: "You had him — proof in hand, his whole operation one word from Marlowe — and you spent that power buying him a way to keep his name instead of grinding it into the floor. A man who walks away with his face intact doesn't spend the rest of his life plotting yours. That's the **golden bridge**: leave the loser a road, and today's mark becomes tomorrow's asset instead of tomorrow's bullet." },
      },
    },
    {
      id: 'o_in_broken',
      mood: 'threat',
      portrait: BROKEN_END,
      outcome: {
        key: 'in_broken', tone: 'mixed',
        title: 'RICCI — THE DOOR, PRIED OPEN',
        line: "You force the way in — Marlowe's rooms, his routines, his blind spots, spilled by a broken man on his knees in front of his own crew. You have your path up. You also have an enemy who'll burn it all to stop you.",
        ripple: "You've pried open the way to Marlowe — the climb goes on. But Ricci is destroyed and vengeful. Watch your back on these docks.",
        reflect: "I put a man on his knees in front of his crew, and some part of me enjoyed it. That's the part I'll remember. That's the part of him that's in me now.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        campaign: { bonds: [{ id: 'ricci', delta: -3 }], faction: { id: 'docks', delta: 1 }, ledger: ['ricci_broken'] },
        debrief: { principle: 'the-mirror',
          note: "You had the leverage to spare him and ground him down instead — on his knees, in front of his own men, because part of you wanted to watch it happen. Marlowe built his whole empire on exactly that pleasure: the taste of making men kneel. Tonight you got a taste of it too. **The mirror** doesn't ask whether you won. It asks who you're becoming to keep winning." },
      },
    },
    {
      id: 'o_deal_noname',
      mood: 'cold',
      portrait: NONAME_END,
      outcome: {
        key: 'debt_only', tone: 'mixed',
        title: 'RICCI — THE DEBT DIES',
        line: "Your father's paper tears in his hands. The thing that's strangled you for a year is gone. But you leave his line to Marlowe untouched — and the man at the top stays a mile out of reach.",
        ripple: "The debt is dead and you're free of it. But you forced no way up — Marlowe stays sealed off, for now.",
        reflect: "Free of the debt. Not free of the wanting. It was never really just the debt, was it.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
        campaign: { bonds: [{ id: 'ricci', delta: 1 }], ledger: ['ricci_debt_cleared'] },
        debrief: { principle: 'leverage-and-batna',
          note: "He tore up the paper easily enough — pocket change to a man like him. But he never blinked on Marlowe's name, because you never gave him a reason to. Without the skim in your hand or Bianchi at his throat, his **BATNA** — silence and a shrug — cost him nothing. **Leverage** isn't asking harder. It's making his alternative to saying yes worse than saying yes." },
      },
    },
    {
      id: 'o_walk',
      mood: 'threat',
      portrait: WALK_END,
      outcome: {
        key: 'walk', tone: 'bad',
        title: 'RICCI — HE WALKS',
        line: "You overplayed a man who's clawed through worse than you'll ever be. He stands, straightens his coat, and has his men show you out. You got nothing — and now he has your face.",
        ripple: "No deal. Nothing changes on the board — and Ricci is on his guard now.",
        reflect: "I overplayed it. My father would have read the room. I'm not the man he made yet — I'm becoming a worse one.",
        heatDelta: 3,
        deal: { closed: false, gotName: false, faceIdx: 2 },
        campaign: { bonds: [{ id: 'ricci', delta: -2 }], faction: { id: 'docks', delta: -1 }, ledger: ['ricci_alerted'] },
        debrief: { principle: 'walk-away-power',
          note: "You pushed on a man with nothing to lose by refusing you — no exposed skim, no Bianchi at his door, nothing but your nerve against his patience. He called it, because he could afford to: his cigarette was never really the clock. Yours was. **Walk-away power** belongs to whoever can survive 'no' the longest — and tonight, that wasn't you." },
      },
    },
  ],
};
