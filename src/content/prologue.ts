import type { Mission } from '../domain/mission';

// THE COLD-OPEN — played, not read. You're fourteen, in your father's shop, the
// night Ricci breaks his name in front of the neighbours. You make a powerless
// choice (all roads lead one place — that's the point; nothing you did then
// mattered, and it forged you). Then seven years jump, and you're the man who
// climbs. Answers who you are, where the skill came from, and who Ricci is — as
// a scene, not a paragraph.
// manhwa panels — the scene changes beat to beat
const TEACH = 'assets/art/scene/shop_teach.jpg';   // Pa teaching you, a captain haggling
const BOND = 'assets/art/scene/shop_bond.jpg';     // father and son, close
const FALL = 'assets/art/scene/fall.jpg';          // Ricci on the doorstep
const SHAME = 'assets/art/scene/fall_shame.jpg';   // the public shaming
const BROKEN = 'assets/art/scene/fall_broken.jpg'; // the father, finished
const DEPART = 'assets/art/scene/depart.jpg';      // you, leaving home
const DOCKS = 'assets/art/scene/now.jpg';          // the cold present

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
      portrait: BOND,
      name: 'PA', role: 'your father',
      beats: [
        { who: 'you', caption: true, art: TEACH, text: "But it wasn't always the gutter. Before the debt, before Ricci — there was the shop, the smell of tar and rope, and him." },
        { who: 'them', art: TEACH, text: "Up here, boy — watch. See how the captain's eyes keep going to the door while he haggles? He wants to leave more than he wants to win. Read that, and you've already got him." },
        { who: 'you', art: BOND, text: "You always get them, Pa." },
        { who: 'them', art: BOND, text: "Not always. But I read them true. Knowing people — that's worth more than money. Remember it when I'm gone." },
        { who: 'you', caption: true, art: BOND, text: "But some nights, after the shop was locked and he thought I was asleep, I'd catch him at the back table with the freight books instead of the till — not counting, frowning, running the same column twice." },
        { who: 'them', art: BOND, text: "(to himself, not seeing you there) These numbers don't move the way the cargo moves... (he catches you watching, shuts the ledger fast, forces a smile) Go on to bed. Nothing here for you to carry." },
        { who: 'you', caption: true, art: BOND, text: "My mother went when I was small. After that it was him, me, and the shop. He taught me to read a man across a table before I could read a book. I thought we had all the time in the world." },
      ],
      choices: [{ id: 'go', label: 'Then the world came for him.', to: 'fall' }],
    },
    {
      id: 'fall',
      mood: 'threat',
      portrait: FALL,
      beats: [
        { who: 'you', caption: true, art: FALL, text: "Seven years ago. My father's shop, the night everything came apart. I was fourteen." },
        { who: 'them', art: FALL, text: "Word's going round, Tomas. You've been watering your shipments. Cheating your own customers." },
        { who: 'you', caption: true, art: SHAME, text: "He wasn't. Ricci knew he wasn't. He said it anyway — loud, on the step, where every neighbour could hear." },
        { who: 'them', art: SHAME, text: "Shame. A good name takes twenty years to build. One evening to rot." },
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
      portrait: FALL,
      beats: [
        { who: 'them', art: SHAME, text: "(peeling your hand off his sleeve, almost gentle) Easy, boy. Watch and learn. You don't break a man's legs. You break his name. Costs less. Lasts longer." },
        { who: 'you', caption: true, art: BROKEN, text: "He was finished by morning — the name gone, the shop dead inside a week. And a ruined man's last proud act was to get me clear of it: he scraped together everything he had and sent me upriver. An apprenticeship. A shot at a life bigger than the wreck he'd become. 'Don't come back,' he told me, 'for anything less than everything.'" },
      ],
      choices: [{ id: 'go', label: 'So I went. Seven years pass.', to: 'now' }],
    },
    {
      id: 'now',
      mood: 'cold',
      portrait: DOCKS,        // the cold rainy present — you, watching, alone
      name: '', role: '',
      beats: [
        { who: 'you', caption: true, art: DEPART, text: "So I wasn't there for the end. While I was gone chasing that bigger life, the debt and the shame did what Ricci started. He died alone. And that's the part I'll carry to my own grave — that when it finished him, I was a hundred miles away, chasing a future." },
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
