import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the wall of a man → the crack → the
// empty place under the muscle → each ending its own image + mood).
const WALL = 'assets/art/scene/santo_wall.jpg';           // establishing: Santo like part of the wall, neon over the club door
const DISMISS = 'assets/art/scene/santo_dismiss.jpg';     // barely looks down, "members only... walk"
const FLATLINE = 'assets/art/scene/santo_flatline.jpg';   // the flat eyes finally move — "you heard that"
const ACCUSE = 'assets/art/scene/santo_accuse.jpg';       // you lay out "my dog" to his face
const SIMMER = 'assets/art/scene/santo_simmer.jpg';       // the long dangerous silence, jaw clenched
const GRUNT = 'assets/art/scene/santo_grunt.jpg';         // the grunt that might be a laugh — "it's never been the money"
const PRESS = 'assets/art/scene/santo_press.jpg';         // you press him — "what's it for, Santo?"
const EMPTY = 'assets/art/scene/santo_empty.jpg';         // the hollow honest admission — "I stopped knowing"
const TURNED = 'assets/art/scene/santo_turned_end.jpg';   // looks at his own scarred hands, quiet resolve
const HEDGES = 'assets/art/scene/santo_hedges_end.jpg';   // turns back to the door, a wall again
const LOYAL = 'assets/art/scene/santo_loyal_end.jpg';     // the shovel-hand closes on your collar

// SANTO — DeLuca's enforcer. A slab of scarred muscle who's hurt more men than he
// can count and felt nothing doing it. You can't frighten him and you can't out-
// muscle him. But DeLuca treats his most dangerous man like a dog — underpays
// him, talks down to him in front of the crew — and even a dog remembers.
//   TURNED  — he steps aside; when you move on DeLuca, he won't lift a hand
//   HEDGES  — he stays out of it; won't help, won't warn
//   LOYAL   — you misjudge him; he tells DeLuca someone's circling (heat)
//
// THE WOVEN READ: before you pick an approach, you have to decide what Santo
// truly IS from thirty seconds of him not looking at you — a proud man whose job
// stopped feeling like pride (correct), muscle for hire (wrong — money never
// moves him, it insults him), or a dog that folds under pressure (wrong — force
// bounces off a man this size and this scarred; it's the one lever guaranteed to
// backfire). The right read foregrounds the strong approaches; the wrong reads
// still reach every approach, just with the weaker ones surfaced first.
// THE COMPLICATION: on the winning path, right as he's about to choose you, one
// of DeLuca's crew leans out and orders him — in front of you — to "teach" a
// debtor a lesson, calling him "dog" while he does it. It's a live test of
// whether the respect you offered was real: speak over him and you've just done
// to him what DeLuca does; hold still and let him refuse it himself, and the
// choice becomes truly his.
export const SANTO_MISSION: Mission = {
  id: 'santo_mission',
  actionId: 'santo_turn',
  nodeId: 'santo',
  label: 'Work the enforcer',
  palette: 'marlowe',
  scene: 'assets/art/scene/santo.jpg',
  teaches: ['interests-not-positions', 'types-and-tells', 'reciprocity', 'loss-aversion'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: WALL, text: "Santo stands outside DeLuca's club like part of the wall, and about as talkative. I've watched him break a man's jaw and then hold a door for the next one. You don't threaten a man like this. You find the one crack in the stone." },
        { who: 'them', art: DISMISS, text: "(without looking down at me) Members only. And you're not. Walk." },
      ],
      choices: [
        { id: 'read', label: "Find the crack before you speak. ▸", tone: 'disarm', to: 'read_santo' },
      ],
    },

    // THE READ — study Santo, then judge what he really is (routes to the same
    // three branches the old text-fork did, but the player earns the read).
    {
      id: 'read_santo',
      mood: 'threat',
      portrait: WALL,
      read: {
        ask: "Two seconds of a man who won't look at you. What is Santo, really?",
        hint: 'Tap what you notice.',
        clues: [
          { x: 48, y: 26, label: 'his eyes', note: "Flat, absent. Never scan your hands, never price the room — whatever moves him isn't standing in front of him." },
          { x: 38, y: 60, label: 'his hands', note: "Scarred to the knuckle. They've broken men and felt nothing doing it." },
          { x: 58, y: 74, label: 'his stance', note: 'Still as the wall behind him. No fear to fold, no fight to pick.' },
          { x: 80, y: 38, label: "DeLuca's door", note: 'He guards it like it\'s his — and gets called "dog" for the privilege.', grants: 'saw_leash' },
          { x: 28, y: 46, label: 'the held door', note: "Broke a man's jaw, then held the door for the next one. Twenty years, no relish left in any of it." },
        ],
        options: [
          { id: 'read_dignity', label: "A proud man doing a job that's stopped being worth his pride.", to: 'r_dignity' },
          { id: 'read_money', label: "Muscle for hire — loyal to whoever's paying, nothing more.", to: 'r_money' },
          { id: 'read_fear', label: "A dog beaten into obedience — lean hard enough, he folds.", to: 'r_fear' },
        ],
      },
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_dignity',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: WALL, text: "Two seconds, and there's nothing hungry in him — no threat performed for a stranger's benefit, no relish in the size of him. That's not a killer proud of his work. That's a man doing a job he stopped being able to feel good about a long time ago." },
      ],
      ask: "A wall of a man you can't scare or fight. What's your way in?",
      choices: [
        { id: 'respect', label: "His dignity — 'DeLuca called you his dog in front of the crew last week. I heard it. So did they.'", tone: 'disarm', to: 'n_respect' },
        { id: 'worth', label: "His worth — 'You're the most dangerous man on these streets, and he pays you like a doorman.'", tone: 'disarm', to: 'n_worth' },
        { id: 'threat', label: "Lean on him — 'Help me, or I make sure DeLuca hears you and I talked.'", tone: 'push', requires: ['saw_leash'], to: 'o_loyal' },
      ],
    },
    {
      id: 'r_money',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: DISMISS, text: "A man his size, doing this job this long, must have a price — everyone in this business does. Then you watch him again: no glance at your hands, no read of whether you're carrying, nothing. Whatever moves him, it isn't the transaction sitting in front of him." },
      ],
      ask: "A wall of a man you can't scare or fight. What's your way in?",
      choices: [
        { id: 'worth', label: "His worth — 'You're the most dangerous man on these streets, and he pays you like a doorman.'", tone: 'disarm', to: 'n_worth' },
        { id: 'respect', label: "His dignity — 'DeLuca called you his dog in front of the crew last week. I heard it. So did they.'", tone: 'disarm', to: 'n_respect' },
        { id: 'threat', label: "Lean on him — 'Help me, or I make sure DeLuca hears you and I talked.'", tone: 'push', requires: ['saw_leash'], to: 'o_loyal' },
      ],
    },
    {
      id: 'r_fear',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: SIMMER, text: "You decide he's obedience with a body attached — find the right threat, he folds like anyone paid to stand still. Then you clock the scars, the total stillness, the total absence of anything that looks like fear in him, and a colder thought: some men stopped being frightened of anything a long time ago." },
      ],
      ask: "A wall of a man you can't scare or fight. What's your way in?",
      choices: [
        { id: 'threat', label: "Lean on him — 'Help me, or I make sure DeLuca hears you and I talked.'", tone: 'push', requires: ['saw_leash'], to: 'o_loyal' },
        { id: 'respect', label: "His dignity — 'DeLuca called you his dog in front of the crew last week. I heard it. So did they.'", tone: 'disarm', to: 'n_respect' },
        { id: 'worth', label: "His worth — 'You're the most dangerous man on these streets, and he pays you like a doorman.'", tone: 'disarm', to: 'n_worth' },
      ],
    },

    {
      id: 'n_respect',
      mood: 'tense',
      beats: [
        { who: 'them', art: FLATLINE, text: "(the flat eyes move, finally, down to me) …You heard that." },
        { who: 'you', art: ACCUSE, text: "Everyone heard it. 'My dog.' A man who's bled for him twenty years, and that's the word he uses. Where I come from, you don't say that about a man you respect. You say it about a thing you own." },
        { who: 'them', art: SIMMER, text: "(a long, dangerous silence) …He's said worse. I don't need respect from a fat man in a loud suit." },
      ],
      ask: "The stone's cracked — there's a slow anger under it. Push it, or offer him something?",
      choices: [
        { id: 'offer', label: "Offer him out — 'Then stop being his dog. Step aside when I move on him. That's all.'", tone: 'disarm', to: 'n_test' },
        { id: 'goad', label: "Goad him — 'Prove me wrong, then. Go run and tell him like a good dog.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'n_worth',
      mood: 'tense',
      beats: [
        { who: 'them', art: GRUNT, text: "(a grunt that might be a laugh) Money. Everyone thinks it's money. It's never been the money." },
        { who: 'you', art: PRESS, text: "Then what? Twenty years, the same corner, the same club, breaking the same men for a man who calls you a dog. What's it for, Santo?" },
        { who: 'them', art: EMPTY, text: "(quiet) …I don't know anymore. That's the honest answer. I stopped knowing a long time ago." },
      ],
      ask: "You've found the empty place under the muscle. What do you put in it?",
      choices: [
        { id: 'choice', label: "A choice of his own — 'Then for once, do a thing because you chose it. Step aside.'", tone: 'disarm', to: 'n_test' },
        { id: 'pity', label: "Pity him — 'You poor bastard. You've got nothing.'", tone: 'push', to: 'o_hedges' },
      ],
    },

    // --- THE COMPLICATION: the offer's on the table — DeLuca's crew tests it live ---
    {
      id: 'n_test',
      mood: 'threat',
      beats: [
        { who: 'them', art: DISMISS, text: "(a voice from the club door — one of DeLuca's crew, jerking a thumb at some poor bastard shuffling past, short on his corner money) Oi. Dog. Boss wants Petrov taught a lesson before close. You know the drill." },
        { who: 'you', caption: true, art: SIMMER, text: "Santo doesn't answer. His hand curls into a fist at his side — twenty years of habit closing before his head's caught up to what you just said to him." },
      ],
      ask: "He's one word from doing exactly what you just told him he doesn't have to do anymore. What do you do?",
      choices: [
        { id: 'interject', label: "Answer for him — 'Tell your boy Santo doesn't fetch. Not tonight.'", tone: 'push', to: 'o_hedges' },
        { id: 'hold', label: "Say nothing. Let him make this call himself.", tone: 'disarm', to: 'o_turned' },
      ],
    },

    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'SANTO — HE STEPS BACK',
        line: "He looks at his own scarred hands for a while. \"When you move on him,\" he says, \"I'll be somewhere else. I've been his hand for twenty years. Let's see how he does without one.\"",
        ripple: "DeLuca's muscle just quietly stepped back. When you make your move, the most dangerous man in the district will be looking the other way.",
        reflect: "I gave a killer his first choice in twenty years, and he chose me. I should feel like I saved something. Mostly I feel like I found a better weapon.",
        grants: ['santoTurned'],
        dispositions: [{ nodeId: 'santo', set: 4 }],
        campaign: { bonds: [{ id: 'santo', delta: 2 }], faction: { id: 'district', delta: 1 }, ledger: ['santo_turned'] },
        debrief: { principle: 'interests-not-positions',
          note: "Santo's position was 'members only, walk' — a wall doing a wall's job. His **interest**, underneath, was never being called somebody's dog again. You never matched his money or his muscle; you paid the debt DeLuca never did — respect — and let him spend it himself. That's what bought you a man DeLuca can't buy back." },
      },
    },
    {
      id: 'o_hedges',
      mood: 'cold',
      portrait: HEDGES,
      outcome: {
        key: 'hedges', tone: 'mixed',
        title: 'SANTO — HE STAYS OUT OF IT',
        line: "He turns back to the door and the conversation is over. \"I won't help you. I won't stop you. Do what you came to do and leave me my corner.\" Neutral, immovable, a wall again.",
        ripple: "Santo won't warn DeLuca — but he won't step aside either. You'll have to move on DeLuca with his muscle still standing.",
        dispositions: [{ nodeId: 'santo', set: 2 }],
        campaign: { bonds: [{ id: 'santo', delta: -1 }], ledger: ['santo_hedges'] },
        debrief: { principle: 'reciprocity',
          note: "You'd almost proven you saw him as a man and not a tool — then, at the one moment it mattered, you spoke over him and decided his answer for him. **Reciprocity** only pays out when the respect is real and his to spend; borrow his voice even once, even to defend him, and the debt cancels itself." },
      },
    },
    {
      id: 'o_loyal',
      mood: 'threat',
      portrait: LOYAL,
      outcome: {
        key: 'loyal', tone: 'bad',
        title: 'SANTO — STILL THE DOG',
        line: "\"Threaten me.\" He says it slowly, like tasting it. \"You threaten ME.\" A hand the size of a shovel closes on your collar and walks you to the street. He's already deciding whether to mention you to DeLuca. He decides yes.",
        ripple: "You leaned on the one man who can't be leaned on. Santo tells DeLuca a stranger's been circling — DeLuca tightens the district and waits.",
        reflect: "Threatened a killer to his face. My father would have read the man before he opened his mouth. I keep leading with the thing I hate about the men I'm hunting.",
        heatDelta: 3,
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'santo', set: 0 }],
        campaign: { bonds: [{ id: 'santo', delta: -2 }], faction: { id: 'district', delta: -1 }, ledger: ['santo_loyal'] },
        debrief: { principle: 'types-and-tells',
          note: "You read him as muscle that folds under a threat — the exact lever DeLuca's been pulling on him for twenty years. Wrong **type**, wrong **tell**: a proud man doesn't buckle under force, he remembers who used it on him. You just put your name on that list." },
      },
    },
  ],
};
