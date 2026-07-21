import type { Mission } from '../domain/mission';

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
  start: 's0_cold',
  nodes: [
    // --- reactive openings (game.ts picks one via startAt), all → 'open' ---
    {
      id: 's0_cold',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "Ricci sits like he owns the room — because on this dock, he does. He doesn't know your face. He doesn't know you're Tomas Vidal's kid. Not yet." },
        { who: 'them', text: "So you're the one who wanted the meeting. Sit. You've got until my cigarette's done." },
      ],
      choices: [{ id: 'go', label: 'Sit down across from him.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_rattled',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "You worked his people before you ever sat down, and it shows. Ricci's jaw is tight; his eyes keep flicking to the door." },
        { who: 'them', text: "You've been busy. Turning my own dock against me. …Sit. Say your piece, and make it fast." },
      ],
      choices: [{ id: 'go', label: 'Take the seat. Let him stew.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, text: "Someone talked. Ricci knows a stranger's been circling his people — and he's watching you the way a man counts the exits." },
        { who: 'them', text: "Somebody's been in my house. If that somebody is you, you'd better have a reason I don't put you in the water tonight." },
      ],
      choices: [{ id: 'go', label: 'Hold his eye. Sit.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_hardened',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, text: "You spooked the wrong man and it got back to him. Ricci decided he hated you before you walked in." },
        { who: 'them', text: "I know exactly who you are and what you've been doing on my docks. This meeting is a courtesy before I end it. Talk." },
      ],
      choices: [{ id: 'go', label: 'Sit anyway. Show no fear.', tone: 'disarm', to: 'open' }],
    },

    // --- the table ---
    {
      id: 'open',
      mood: 'tense',
      beats: [
        { who: 'them', text: "Your father's debt. Five hundred. Mine to collect, yours to pay — that's the whole conversation. Unless you brought something better than a sad story." },
      ],
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
        { who: 'them', text: "(a thin smile) …Finally. Someone on this pier with manners. Go on, then. Impress me." },
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
        { who: 'them', text: "(leans back, amused) At least you know your place. Fine. Amuse me, nobody." },
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
        { who: 'them', text: "(a flicker behind the eyes) You don't know the first thing about me." },
        { who: 'you', text: "Sal told me enough. You lie awake over Marlowe the same way the men you squeeze lie awake over you." },
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
        { who: 'them', text: "(the smile dies) …Where did you get that. WHO showed you—" },
        { who: 'you', text: "Doesn't matter. What matters is Marlowe never sees it — if you give me what I want." },
        { who: 'them', text: "(very still) …And what is it you think you want, kid." },
        { who: 'you', text: "The men above you. The district, the empire, all the way to the top. I want up — and you're going to be my first rung." },
        { who: 'them', text: "(a long look, and something almost like recognition) …I know you. Not the face — the kind. A nobody with a dead father and a fire where his gut should be. I was you, once. Look what I clawed my way into. Look what it cost. Give it ten years — you'll be the one on this side of the table, doing this to some other boy." },
        { who: 'you', caption: true, text: "The worst of it wasn't the threat. It was that he wasn't wrong." },
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
        { who: 'them', text: "(a flicker of fear he can't mask) Bianchi. That circling son of a bitch. …What do you know." },
        { who: 'you', text: "That he's about to have everything you built. And that Marlowe protects earners — not men who let a rival walk in his front door. When Bianchi takes your water, you stop being a collector. You become a loose end." },
        { who: 'them', text: "(very still) …And you're offering. To hold him off." },
        { who: 'you', text: "Marlowe. Not his name — I want the man. Get me in, and I keep Bianchi off your throat. Refuse, and I hand him the last push myself." },
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
        { who: 'them', text: "(a long look, then a shrug) …The paper. Fine. Your father's debt dies tonight. But my business stays mine. We clear?" },
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
      outcome: {
        key: 'in_ally', tone: 'good',
        title: 'RICCI — YOUR WAY IN',
        line: "Terrified of what you hold, he folds — and because you let him keep his dignity, he does the unthinkable to his master: he stays in place on the docks as YOUR man. Your father's debt burns in the ashtray. And a door into the empire, closed to everyone, is open to you.",
        ripple: "Ricci is your man inside Marlowe's operation now — the way up is open. And your father's debt is dead.",
        reflect: "I left him his dignity. Maybe that's the line — the last thing that keeps me from becoming exactly what he said I'd become.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
      },
    },
    {
      id: 'o_in_broken',
      mood: 'threat',
      outcome: {
        key: 'in_broken', tone: 'mixed',
        title: 'RICCI — THE DOOR, PRIED OPEN',
        line: "You force the way in — Marlowe's rooms, his routines, his blind spots, spilled by a broken man on his knees in front of his own crew. You have your path up. You also have an enemy who'll burn it all to stop you.",
        ripple: "You've pried open the way to Marlowe — the climb goes on. But Ricci is destroyed and vengeful. Watch your back on these docks.",
        reflect: "I put a man on his knees in front of his crew, and some part of me enjoyed it. That's the part I'll remember. That's the part of him that's in me now.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
      },
    },
    {
      id: 'o_deal_noname',
      mood: 'cold',
      outcome: {
        key: 'debt_only', tone: 'mixed',
        title: 'RICCI — THE DEBT DIES',
        line: "Your father's paper tears in his hands. The thing that's strangled you for a year is gone. But you leave his line to Marlowe untouched — and the man at the top stays a mile out of reach.",
        ripple: "The debt is dead and you're free of it. But you forced no way up — Marlowe stays sealed off, for now.",
        reflect: "Free of the debt. Not free of the wanting. It was never really just the debt, was it.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
      },
    },
    {
      id: 'o_walk',
      mood: 'threat',
      outcome: {
        key: 'walk', tone: 'bad',
        title: 'RICCI — HE WALKS',
        line: "You overplayed a man who's clawed through worse than you'll ever be. He stands, straightens his coat, and has his men show you out. You got nothing — and now he has your face.",
        ripple: "No deal. Nothing changes on the board — and Ricci is on his guard now.",
        reflect: "I overplayed it. My father would have read the room. I'm not the man he made yet — I'm becoming a worse one.",
        heatDelta: 3,
        deal: { closed: false, gotName: false, faceIdx: 2 },
      },
    },
  ],
};
