import type { Mission, MissionOutcome } from '../domain/mission';
import type { Beat } from '../domain/board';

// ---- CHAPTER INTERLUDES + THE FATE SYSTEM ----
// The recap that crosses into each Act II/III chapter. It carries the widening
// reveal AND the cost: recurring allies you let get too exposed (high heat, low
// bond) turn up dead here, and allies you used coldly turn up as knives. The
// death/betrayal ledger flags are written by game.ts (computeFates) BEFORE this
// builds, so the beats below simply surface whichever fates fired. The finale
// (marlowe_endgame) reads the same ledger for its who-lived roll-call.

const NOW = 'assets/art/scene/now.jpg';

// the human cost of the climb — one beat per fate that fired this transition
function fateBeats(flags: Set<string>): Beat[] {
  const b: Beat[] = [];
  if (flags.has('sal_dead')) b.push({ who: 'you', caption: true, mood: 'guilt', text: "Word came up from the docks: Sal Moretti, pulled out of the harbor. He fed me too long and I let the heat climb too high to shield him. My father's honest book — and the one that could hang Ricci — went down with him." });
  if (flags.has('pip_dead')) b.push({ who: 'you', caption: true, mood: 'guilt', text: "Pip. The kid with the ruined hand. They made an example of him for standing too close to me. He was nineteen." });
  if (flags.has('finn_dead')) b.push({ who: 'you', caption: true, mood: 'guilt', text: "Mrs. Finn went asking the same question her husband did. She got the same answer. I handed her the nerve and the cargo took her for it — the way it took mine." });
  if (flags.has('vera_dead')) b.push({ who: 'you', caption: true, mood: 'guilt', text: "Vera's club burned down with Vera inside. Twenty years she never took a side, and I made her take mine. The favor came due." });
  if (flags.has('bianchi_betrayed')) b.push({ who: 'you', caption: true, mood: 'threat', text: "Bianchi sold me to the men above for a bigger piece of the water. I used him like a blade once, and left him nothing but the grudge. A blade turns in the hand." });
  if (flags.has('vera_betrayed')) b.push({ who: 'you', caption: true, mood: 'cold', text: "Vera gave me up — not for money, for survival. I burned her trust and called it business. She only did the same back." });
  return b;
}

interface Recap { pre: string; beats: string[]; title: string; line: string; cta: string; palette: string; }

const RECAPS: Record<string, Recap> = {
  ch3: {
    pre: 'PREVIOUSLY — THE DISTRICT.', palette: 'deluca',
    beats: [
      "You broke DeLuca and forced your way up. But going down, he laughed at you: you think this was ever about your father?",
      "There's cargo moving through this port that no manifest admits to. And men upriver who'd bury three families to keep it quiet. The revenge you came for was only ever the doorway.",
    ],
    title: 'THE WATERFRONT UNION',
    line: "The crates are real. Follow them to the piers, where a man named Kastner decides who works, who starves — and who asks the wrong question and never comes home.",
    cta: 'ONTO THE PIERS ▸',
  },
  ch4: {
    pre: 'PREVIOUSLY — THE WATERFRONT.', palette: 'marlowe',
    beats: [
      "You climbed through Kastner and saw the cargo with your own eyes. Unmarked crates. And the men who moved them turning up in the water, one honest question at a time.",
      "Kastner gave up where the money goes to get washed. It runs off the docks and into marble.",
    ],
    title: 'THE CASSAR BANK',
    line: "Dirty money gets made clean here, under chandeliers. And the accounts run upriver — to names you were never meant to know. Cassar keeps them. Take them from him.",
    cta: 'INTO THE BANK ▸',
  },
  ch5: {
    pre: 'PREVIOUSLY — THE BANK.', palette: 'marlowe',
    beats: [
      "Cassar's numbers gave up the last secret: who protects all of it from above. Not a gangster. A man of law and order.",
      "Every rung, I've become a little more like the men I'm climbing toward. I can feel it now, in how easily I reach for the cruel thing.",
    ],
    title: 'THE HALL',
    line: "Commissioner Vane. The clean-handed public man who signs what other men carry out — including, seven years ago, the order that erased your father. Break him, and only the top is left.",
    cta: 'INTO THE HALL ▸',
  },
  ch6: {
    pre: 'PREVIOUSLY — THE HALL.', palette: 'marlowe',
    beats: [
      "You broke Vane and learned the last truth: your father's ruin was ordered from a marble office, signed by a righteous hand, and Marlowe was only the hand that fell.",
      "Everyone who helped me up is turned, spent, or gone. There's one man left above me — and I'm no longer sure which of us I'm walking in to kill.",
    ],
    title: "MARLOWE'S HOUSE",
    line: "The top. You can't break Marlowe with a secret — he has no fear, only control. So rot his house out from under him: turn his people, take his paper, and end it.",
    cta: 'INTO THE HOUSE ▸',
  },
};

// build the recap/interlude Mission that crosses into chapter `chId`
export function buildInterlude(chId: string, flags: Set<string>): Mission {
  const r = RECAPS[chId]!;
  const beats: Beat[] = [
    { who: 'you', caption: true, text: r.pre },
    ...r.beats.map((t) => ({ who: 'you' as const, caption: true, text: t })),
    ...fateBeats(flags),
  ];
  const outcome: MissionOutcome = {
    key: chId, tone: 'good',
    tag: `CHAPTER ${({ ch3: 'THREE', ch4: 'FOUR', ch5: 'FIVE', ch6: 'SIX' } as Record<string, string>)[chId]}`,
    title: r.title, line: r.line, ripple: '', cta: r.cta,
  };
  return {
    id: `${chId}_recap`, actionId: `${chId}_recap`, nodeId: 'you', label: 'previously',
    palette: r.palette, start: 'r',
    nodes: [{ id: 'r', mood: 'cold', portrait: NOW, beats, outcome }],
  };
}
