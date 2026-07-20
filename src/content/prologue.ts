import type { Mission } from '../domain/mission';

// THE COLD-OPEN — played, not read. You're fourteen, in your father's shop, the
// night Ricci breaks his name in front of the neighbours. You make a powerless
// choice (all roads lead one place — that's the point; nothing you did then
// mattered, and it forged you). Then seven years jump, and you're the man who
// climbs. Answers who you are, where the skill came from, and who Ricci is — as
// a scene, not a paragraph.
const RICCI = 'assets/art/cast/ricci.jpg';
const SHOP = 'assets/art/scene/before.jpg';   // the warm past
const DOCKS = 'assets/art/scene/now.jpg';     // the cold present

export const PROLOGUE_MISSION: Mission = {
  id: 'prologue',
  actionId: 'prologue',
  nodeId: 'you',
  label: 'the cold-open',
  palette: 'ricci',
  start: 'before',
  nodes: [
    {
      id: 'before',
      mood: 'warm',
      portrait: SHOP,         // the warm shop — the good old times, his voice over it
      name: 'PA', role: 'your father',
      beats: [
        { who: 'you', caption: true, text: "But it wasn't always the gutter. Before the debt, before Ricci — there was the shop, the smell of tar and rope, and him." },
        { who: 'them', text: "Up here, boy — watch. See how the captain's eyes keep going to the door while he haggles? He wants to leave more than he wants to win. Read that, and you've already got him." },
        { who: 'you', text: "You always get them, Pa." },
        { who: 'them', text: "Not always. But I read them true. Knowing people — that's worth more than money. Remember it when I'm gone." },
        { who: 'you', caption: true, text: "My mother went when I was small. After that it was him, me, and the shop. He taught me to read a man across a table before I could read a book. I thought we had all the time in the world." },
      ],
      choices: [{ id: 'go', label: 'Then the world came for him.', to: 'fall' }],
    },
    {
      id: 'fall',
      mood: 'threat',
      portrait: RICCI,
      beats: [
        { who: 'you', caption: true, text: "Seven years ago. My father's shop, the night everything came apart. I was fourteen." },
        { who: 'them', text: "Word's going round, Tomas. You've been watering your shipments. Cheating your own customers." },
        { who: 'you', caption: true, text: "He wasn't. Ricci knew he wasn't. He said it anyway — loud, on the step, where every neighbour could hear." },
        { who: 'them', text: "Shame. A good name takes twenty years to build. One evening to rot." },
      ],
      ask: "Fourteen years old, watching a man unmake your father with nothing but words. What do you do?",
      choices: [
        { id: 'grab', label: "Grab his coat — 'Take it back!'", to: 'fall2' },
        { id: 'beg', label: "Beg — 'Please. You know he's honest.'", to: 'fall2' },
        { id: 'burn', label: "Say nothing. Burn his face into memory.", to: 'fall2' },
      ],
    },
    {
      id: 'fall2',
      mood: 'cold',
      portrait: RICCI,
      beats: [
        { who: 'them', text: "(peeling your hand off his sleeve, almost gentle) Easy, boy. Watch and learn. You don't break a man's legs. You break his name. Costs less. Lasts longer." },
        { who: 'you', caption: true, text: "My father was finished by morning. Dead within the month. The debt he left came looking — and it found me." },
      ],
      choices: [{ id: 'go', label: 'Seven years pass.', to: 'now' }],
    },
    {
      id: 'now',
      mood: 'cold',
      portrait: DOCKS,        // the cold rainy present — you, watching, alone
      name: '', role: '',
      beats: [
        { who: 'you', caption: true, text: "The year they came for him, I wasn't here. He'd scraped together everything to send me upriver — an apprenticeship, a shot at a life bigger than the shop. I took it. He faced them alone." },
        { who: 'you', caption: true, text: "I came home to a padlocked door and a fresh grave. All I have of him now is his watch — cold in my pocket — and the thing he put in my head: how to read a man." },
        { who: 'you', caption: true, text: "So that's what I've done. Eighteen months in the dark of these docks. Who skims. Who flinches. Who hates whom. No money, no name, no one left to lose. I built the whole rotten map in my head." },
        { who: 'you', text: "Ricci's still down there, collecting for Marlowe. He doesn't remember my face. He's going to." },
      ],
      choices: [{ id: 'begin', label: 'Open the map.', to: 'o_begin' }],
    },
    {
      id: 'o_begin',
      mood: 'cold',
      portrait: DOCKS,
      name: '', role: '',
      outcome: {
        key: 'begin', tone: 'good',
        tag: 'THE UNDERDOG',
        title: 'Take it apart — one frightened man at a time.',
        line: "You can't fight an empire from the gutter, so you don't. You start at the bottom, with the people around Ricci, and you climb. Marlowe sits at the top, untouchable. You climb to him — one rung at a time.",
        ripple: '',
        cta: 'STEP ONTO THE DOCKS ▸',
      },
    },
  ],
};
