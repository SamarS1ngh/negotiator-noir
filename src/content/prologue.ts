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
      portrait: TEACH,
      name: 'PA', role: 'your father',
      beats: [
        { who: 'you', caption: true, art: TEACH, text: "Before the debt, before Ricci — there was the shop. Tar and rope and lamp-oil, the lamps kept low, him behind the counter and me on a stool, learning the only trade that ever stuck." },
        { who: 'them', art: TEACH, text: "Up here, boy. See the captain? Twenty minutes he's haggled me down, hard as nails. But a man's mouth lies while his body tells the truth. So don't listen to him yet. WATCH him." },
        { who: 'them', art: TEACH, text: "Go on. Tell me what he really wants — not the thing he keeps saying. What he WANTS." },
      ],
      choices: [{ id: 'look', label: 'Watch the captain.', to: 'read_captain' }],
    },
    {
      id: 'read_captain',
      mood: 'warm',
      portrait: TEACH,
      name: 'THE CAPTAIN', role: 'haggling over rope',
      read: {
        ask: "So — what does the captain want more than a cheap price?",
        hint: "Pa's lesson: a man's mouth lies, his body tells the truth. Tap every tell you can find on him.",
        clues: [
          { x: 85, y: 22, label: 'His eyes', note: "They keep sliding to the door. Every few words — flick, back, flick. He's already halfway down the street in his head." },
          { x: 80, y: 58, label: 'His hands', note: "One of them is doing up a coat button while he argues. A man getting dressed to leave — not one settling in to bargain." },
          { x: 90, y: 74, label: 'His shoulder', note: "Half-turned toward the door. His body's angled at the street, not at the goods on the counter." },
          { x: 54, y: 21, label: 'The tide clock', note: "On the wall behind him. His ship rides the tide — miss it and he loses a day at anchor he can't afford." },
          { x: 66, y: 40, label: 'His voice', note: "Fast, loud, pushing — not the slow needling of a man who enjoys a haggle. He's rushing to close, not to win." },
        ],
        options: [
          { id: 'out', label: "He wants OUT — to catch his tide and be gone.", to: 'r_right' },
          { id: 'price', label: "He wants to grind me down on price.", to: 'r_wrong' },
          { id: 'win', label: "He wants to win — to feel he beat me.", to: 'r_wrong' },
        ],
      },
    },
    {
      id: 'r_right',
      mood: 'warm',
      portrait: TEACH,
      name: 'PA', role: 'your father',
      beats: [
        { who: 'them', art: TEACH, text: "(low, pleased) There. You've got him. He'll talk price till dawn — but what he NEEDS is his tide. So don't fight him on price. That's his ground; he'll beat you on it all night." },
        { who: 'them', art: TEACH, text: "Now — don't just stand there behind me. YOU close him. Go on, boy. Say the thing that ends it." },
      ],
      ask: "Your first deal. You've read what he wants. Now use it — what do you say to the captain?",
      choices: [
        { id: 'door', tone: 'press', label: "\"Take it now, captain — or explain to your crew why you missed the tide.\"", to: 'close_good' },
        { id: 'cut', tone: 'bribe', label: "\"Alright, alright. I'll shave a little off the price for you.\"", to: 'close_meh' },
        { id: 'pride', tone: 'disarm', label: "\"You won't find rope this good on the whole coast, captain.\"", to: 'close_meh' },
      ],
    },
    {
      id: 'r_wrong',
      mood: 'warm',
      portrait: TEACH,
      name: 'PA', role: 'your father',
      beats: [
        { who: 'them', art: TEACH, text: "(shaking his head, not unkind) That's what his MOUTH says. Look again — eyes at the door, the coat button, the shoulder turned to the street. That's a man who wants OUT. His ship rides the tide and he's burning daylight in here." },
        { who: 'them', art: TEACH, text: "The price is his ground — fight him there and you'll lose. What he NEEDS is the door. So. You try it now. Close him. Say the thing that ends it." },
      ],
      ask: "Pa's shown you what he really wants. Now use it — what do you say to the captain?",
      choices: [
        { id: 'door', tone: 'press', label: "\"Take it now, captain — or explain to your crew why you missed the tide.\"", to: 'close_good' },
        { id: 'cut', tone: 'bribe', label: "\"Alright, alright. I'll shave a little off the price for you.\"", to: 'close_meh' },
        { id: 'pride', tone: 'disarm', label: "\"You won't find rope this good on the whole coast, captain.\"", to: 'close_meh' },
      ],
    },
    {
      id: 'close_good',
      mood: 'warm',
      portrait: TEACH,
      name: 'THE CAPTAIN', role: 'out of time',
      beats: [
        { who: 'them', art: TEACH, text: "(already turning for the door) ...Damn you. Fine. Full price. Wrap it and be quick — I've a tide that won't wait on me." },
        { who: 'you', caption: true, art: TEACH, text: "He paid what he'd sworn for twenty minutes he'd never pay. Glad to. He was out the door before the coins stopped rattling." },
        { who: 'them', art: BOND, text: "(quiet, just to me, once the door swung shut) See it? Never touched the price. I gave him the one thing he wanted more than a cheap deal — the door — and I charged him for it. THAT'S the whole trade, Cass. Find the need. Stand in front of it." },
      ],
      choices: [{ id: 'go', label: 'Something settled in me, watching that.', to: 'bond' }],
    },
    {
      id: 'close_meh',
      mood: 'warm',
      portrait: TEACH,
      name: 'THE CAPTAIN', role: 'smelling weakness',
      beats: [
        { who: 'them', art: TEACH, text: "(the coat button comes undone again; he settles back in) Now THAT'S more like it. A little off, you said? Then a little more, while we're friends about it..." },
        { who: 'you', caption: true, art: TEACH, text: "The moment I moved on price, he stopped watching the door. I'd handed him his own game to play, and he meant to play it a while." },
        { who: 'them', art: BOND, text: "(stepping in, closing it himself, then low to me) You gave him what he ASKED for, boy. He wanted what he NEEDED — to be GONE. Learn the difference or you'll bleed a little at every table for the rest of your life." },
      ],
      choices: [{ id: 'go', label: 'I never forgot the difference.', to: 'bond' }],
    },
    {
      id: 'bond',
      mood: 'warm',
      portrait: BOND,
      name: 'PA', role: 'your father',
      beats: [
        { who: 'them', art: BOND, text: "Knowing people, Cass — really knowing them — that's worth more than money. A full till gets robbed. What's up here doesn't. Remember it when I'm gone." },
        { who: 'you', caption: true, art: BOND, text: "He taught me to read a man across a table before I could read a book. My mother had gone when I was small; after that it was him, me, and the shop. I thought we had all the time in the world." },
        { who: 'you', caption: true, art: BOND, text: "But some nights, after the shop was locked and he thought I was asleep, I'd catch him at the back table with the freight books instead of the till — not counting. Frowning. Running the same column twice." },
        { who: 'them', art: BOND, text: "(to himself, not seeing me there) These numbers don't move the way the cargo moves... (he catches me watching, shuts the ledger fast, forces a smile) Go on to bed, Cass. Nothing here for you to carry." },
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
        { who: 'you', caption: true, text: "So that's what I've done. Eighteen months in the dark of these docks — as 'Cass,' just another face on the pier nobody looks at twice. My first name and nothing more; the Vidal I keep buried, because the day Ricci hears it is the day I lose the one edge I've got. Who skims. Who flinches. Who hates whom. No money, no name I dare use, no one left to lose. I built the whole rotten map in my head." },
        { who: 'you', text: "Ricci's still down there, collecting for Marlowe. He doesn't remember the boy from that doorstep. He doesn't know Cass is Vidal's son. He's going to." },
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
