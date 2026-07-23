import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat (entering the Hall's
// cold civic marble → sizing up a man who performs through stillness, not noise →
// each lever cracking his practiced calm a little further → the cut-out offer →
// the mirror turn → each distinct ending its own image + mood). NOT YET GENERATED —
// CF quota exhausted; see scripts/gen_vane.sh (not run). Filenames referenced here
// are the contract the art script fulfils later.
const OFFICE = 'assets/art/scene/vane_office.jpg';           // wide: his marble/brass office above the Hall stairwell, you enter
const GREET = 'assets/art/scene/vane_greet.jpg';             // composed, gestures you to a chair, checking a pocket watch
const AWARE = 'assets/art/scene/vane_aware.jpg';             // you, caption — he's heard, the composure costing him more
const WARNING = 'assets/art/scene/vane_warning.jpg';         // leaning forward, precise and cold, a warning dressed as courtesy
const PREPARED = 'assets/art/scene/vane_prepared.jpg';       // wide: grey-suited men at the outer door, a too-clean desk
const COLDLINE = 'assets/art/scene/vane_coldline.jpg';       // flat, exact, "I know precisely who you are"
const TABLE_WAIT = 'assets/art/scene/vane_table_wait.jpg';   // seated, unbothered, testing your nerve with silence
const SIZEUP = 'assets/art/scene/vane_sizeup.jpg';           // you, caption — reading a man who threatens through stillness
const CONVICTION = 'assets/art/scene/vane_conviction.jpg';   // you, caption — the read lands: he believes his own myth
const MISS_FEAR = 'assets/art/scene/vane_miss_fear.jpg';     // you, caption — wrong read corrects itself, he doesn't scare
const MISS_LEASH = 'assets/art/scene/vane_miss_leash.jpg';   // you, caption — wrong read corrects, he isn't owned, he owns
const PENTAP = 'assets/art/scene/vane_pentap.jpg';           // a fountain pen tapped once against the blotter, unhurried
const PRESS_STILL = 'assets/art/scene/vane_press_still.jpg'; // dismissive, "that's a Tuesday"
const PRESS_PUSH = 'assets/art/scene/vane_press_push.jpg';   // you, level — "you're not the subject, you're the pattern"
const PRESS_CRACK = 'assets/art/scene/vane_press_crack.jpg'; // the first real pause, half a second too long
const CHAIN_DISMISS = 'assets/art/scene/vane_chain_dismiss.jpg'; // mild, bored — "my aide keeps excellent records"
const CHAIN_MAP = 'assets/art/scene/vane_chain_map.jpg';     // you laying out the ledger of who-owes-whom
const CHAIN_STILL = 'assets/art/scene/vane_chain_still.jpg'; // very still, doing the arithmetic of his own exposure
const RIVAL_SNORT = 'assets/art/scene/vane_rival_snort.jpg'; // "that vulture's been circling my chair for years"
const RIVAL_PRESS = 'assets/art/scene/vane_rival_press.jpg'; // you, calm — handing a wolf a headline for free
const RIVAL_CALC = 'assets/art/scene/vane_rival_calc.jpg';   // a flicker of real fear, quickly filed away
const UPRIVER_FLAT = 'assets/art/scene/vane_upriver_flat.jpg'; // flat denial, testing what you actually know
const UPRIVER_NAME = 'assets/art/scene/vane_upriver_name.jpg'; // you naming Cassar's upriver partners outright
const UPRIVER_STILL = 'assets/art/scene/vane_upriver_still.jpg'; // fear of THEM, not you, surfacing at last
const OFFER = 'assets/art/scene/vane_offer.jpg';             // tired, reaching for a familiar drawer — the fall guy
const SEETHROUGH = 'assets/art/scene/vane_seethrough.jpg';   // you, caption — recognising the cut-out for what it is
const STRIPPED = 'assets/art/scene/vane_stripped.jpg';       // quiet, brittle, out of drawers to reach into
const LEVER_CHOICE = 'assets/art/scene/vane_lever_choice.jpg'; // you, caption — the one thing he never armored
const END_BREAK = 'assets/art/scene/vane_end_break.jpg';     // something behind his eyes finally gives, and it costs you too
const END_ALLY = 'assets/art/scene/vane_end_ally.jpg';       // grudging near-respect, the road opened untouched
const END_CUTOUT = 'assets/art/scene/vane_end_cutout.jpg';   // sliding a name across the desk like a toll paid in someone else's coin
const END_STANDOFF = 'assets/art/scene/vane_end_standoff.jpg'; // standing, unbothered, "I have a committee"

// COMMISSIONER VANE — the penultimate sit-down, Act III. The law-and-order public
// man who is the empire's real shield: he SIGNED the order that erased your
// father; Marlowe only executed it. Urbane, righteous, and clean-handed by design
// — every dirty thing he's touched, he's touched through a cut-out. Your prep
// decides what's on the table (`pressLever`/`hallAccess`/`rivalBacking`/
// `upriverNames`); the OPENING reacts to what you did (`vaneForewarned` or high
// heat, or having already turned his people / holding proof on him).
// THE WOVEN READ: the wrong reads treat him like DeLuca (scare him) or Ricci
// (he's leashed to someone bigger). Neither fits. He's a true believer — he thinks
// every order he's ever signed kept the city clean, including the one that erased
// your father — and that conviction is exactly why threats to himself don't move
// him.
// THE LAST SHIELD: cornered, his instinct is the cut-out itself — he tries to hand
// you a deniable fall guy (his aide) instead of the truth. Refuse it and he's out
// of exits.
// THE MIRROR: to actually break a man built entirely out of plausible deniability,
// you have to use HIS method — find the one person he never armored (his daughter
// Eleanor, whose whole career rests on the myth he's clean) and decide whether to
// weaponize her name to force the win. Either way you get Marlowe. Only one way
// leaves you looking like the man who did this to your own father.
export const VANE_CONFRONT: Mission = {
  id: 'vane_confront',
  actionId: 'vane_confront',
  nodeId: 'vane',
  label: 'Sit down with Commissioner Vane',
  palette: 'marlowe',
  scene: 'assets/art/scene/vane.jpg',
  teaches: ['plausible-deniability', 'power-mapping', 'prisoners-dilemma', 'the-mirror'],
  start: 's0_serene',
  nodes: [
    // --- reactive openings (game.ts picks one via startAt), all → 'open' ---
    {
      id: 's0_serene',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: OFFICE, text: "Vane's office sits above the Hall's marble stairwell like a judge's bench — brass fittings, storm-grey light through tall windows, not a paper out of place. He built this room to look like a man with nothing to hide has nothing to hide." },
        { who: 'them', art: GREET, text: "Ah. Tomas Vidal's boy. I wondered when you'd work your way up here. Sit. I have eleven minutes before a committee, and you're already spending one of them." },
      ],
      choices: [{ id: 'go', label: 'Sit. Let him keep his clock.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: AWARE, text: "He's heard by now — someone's been quietly working his people, and Vane does not care for quiet things he didn't order himself. The composure's still there. It's just costing him more to hold." },
        { who: 'them', art: WARNING, text: "Somebody's been making calls in my Hall, asking my people questions they shouldn't know to ask. If that's you, you have exactly as long as it takes me to decide whether you're a nuisance or a problem." },
      ],
      choices: [{ id: 'go', label: "Sit. He's paying for his calm now.", tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: PREPARED, text: "Someone ran ahead of you. There are two men in grey by the outer door who don't belong to any committee, and his desk is too clean — cleared on purpose before you ever walked in." },
        { who: 'them', art: COLDLINE, text: "I know precisely who you are, what you've been doing, and who you buried it for. That door behind you locks from my side. Convince me in the next minute that it shouldn't." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. Don't reach for the door.", tone: 'disarm', to: 'open' }],
    },

    {
      id: 'open',
      mood: 'cold',
      beats: [
        { who: 'them', art: TABLE_WAIT, text: "Your father. I remember the name, if not the face — we process a great many names in this office. What is it you imagine I did to him?" },
        { who: 'you', caption: true, art: SIZEUP, text: "He doesn't bluster like DeLuca or posture like Ricci. He sits very still and lets silence do the threatening — a man who's never once needed to raise his voice, because the whole machinery of the Hall raises it for him." },
      ],
      choices: [{ id: 'read', label: "Say nothing yet. Read the stillness. ▸", tone: 'disarm', to: 'read_vane' }],
    },
    // --- THE WOVEN READ: investigate the stillness, judge what's under it ---
    {
      id: 'read_vane',
      mood: 'cold',
      portrait: SIZEUP,
      read: {
        ask: "Under the calm and the credentials — what's actually driving Commissioner Vane?",
        hint: 'He lets silence do his threatening. Tap what you notice.',
        clues: [
          { x: 50, y: 30, label: 'his eyes', note: "You named your father. Not a flicker — no guilt, no fear. Whatever he did, he squared it with himself long ago." },
          { x: 37, y: 62, label: 'his hands', note: "Folded, perfectly still. Not a man guarding a pension — a man who has never once had to reach for anything." },
          { x: 80, y: 27, label: 'the commendations', note: "A wall of them. Years of keeping the city 'clean.' He's built his whole self around being the good man in the room." },
          { x: 62, y: 71, label: 'the clock', note: "He keeps it in view — your minutes are a courtesy he is granting. Control is the air he breathes." },
        ],
        options: [
          { id: 'read_believer', label: "He believes it. Every order he's signed, he's convinced himself it kept the city clean.", to: 'r_believer' },
          { id: 'read_coward', label: "A frightened bureaucrat protecting his pension. Corner him and he folds.", to: 'r_coward' },
          { id: 'read_bought', label: "Just another man on somebody's leash — upriver owns him the same as everyone else.", to: 'r_bought' },
        ],
      },
    },
    {
      id: 'r_believer',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CONVICTION, text: "You catch it in how he says 'process,' not 'kill.' He isn't hiding from what he did — he's filed it. Somewhere behind that marble calm is a man utterly convinced every order he's signed kept the city clean, including your father's name off a ledger it was never safe for him to be on. He isn't scared of being caught. He's never once doubted he was right." },
      ],
      choices: [{ id: 'go', label: "Don't threaten his guilt — he hasn't got any to threaten.", tone: 'disarm', to: 'approach' }],
    },
    {
      id: 'r_coward',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: MISS_FEAR, text: "You come in ready to rattle a frightened man clutching his pension — and watch it not land. Vane doesn't flinch at scandal; he's survived worse than you across this desk. Whatever's actually holding him together, it isn't fear of being fired." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'approach' }],
    },
    {
      id: 'r_bought',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: MISS_LEASH, text: "You go looking for the leash, the bigger man who really owns him — and find the wrong shape entirely. Vane doesn't take orders in this room. He gives them. Whatever's waiting further upriver, he's a partner in it, not a possession of it." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'approach' }],
    },

    {
      id: 'approach',
      mood: 'cold',
      beats: [
        { who: 'them', art: PENTAP, text: "(taps a fountain pen once against the blotter, unhurried) You have my eleven minutes. Or what's left of them. Say something worth the rest." },
      ],
      ask: "Everything you built to reach this desk comes to this. What do you put on it?",
      choices: [
        { id: 'press', label: "The press — 'A reporter has the erasure of my father, in writing, ready to run. You end up a footnote in your own scandal.'", tone: 'push', requires: ['pressLever'], to: 'c_press' },
        { id: 'chain', label: "The chain — 'Your own aide kept a ledger of who signed what. Including whose signature erased my father.'", tone: 'push', requires: ['hallAccess'], to: 'c_chain' },
        { id: 'rival', label: "The rival — 'Reyes is one vote from your chair and would love your name on this. I can hand it to him, or hold him off.'", tone: 'push', requires: ['rivalBacking'], to: 'c_rival' },
        { id: 'upriver', label: "The money — 'I know exactly who upriver you've been protecting, and what it costs you if their names surface with yours.'", tone: 'push', requires: ['upriverNames'], to: 'c_upriver' },
        { id: 'nerve', label: "Nerve alone — 'You signed the order that erased my father. I know it.'", tone: 'push', to: 'o_standoff' },
      ],
    },

    {
      id: 'c_press',
      mood: 'threat',
      beats: [
        { who: 'them', art: PRESS_STILL, text: "(sets the pen down precisely) A reporter with an unverifiable story about an unsigned order. That's a Tuesday. I've buried better journalists than her with one call to an editor." },
        { who: 'you', art: PRESS_PUSH, text: "Not this time. She's not running it through you — she's running it through your own Hall's record of every 'unfortunate incident' quietly filed away over the years. You're not the subject anymore, Commissioner. You're the pattern." },
        { who: 'them', art: PRESS_CRACK, text: "(the first real pause — half a second too long) …A pattern is a considerably longer story than a mistake." },
      ],
      choices: [{ id: 'go', label: 'Let the pause answer for him.', tone: 'disarm', to: 'c_cutout' }],
    },
    {
      id: 'c_chain',
      mood: 'threat',
      beats: [
        { who: 'them', art: CHAIN_DISMISS, text: "(mild, almost bored) My aide keeps excellent records. That's his job." },
        { who: 'you', art: CHAIN_MAP, text: "His job, and his insurance — a ledger of every favor this Hall's ever called in, going back years. Including a signature, yours, on an order that was never supposed to have one. He didn't build that file to protect you. He built it to survive you." },
        { who: 'them', art: CHAIN_STILL, text: "(very still, doing the arithmetic of exactly how expendable his own insurance has become) …Price wouldn't." },
      ],
      choices: [{ id: 'go', label: 'Let him do the math.', tone: 'disarm', to: 'c_cutout' }],
    },
    {
      id: 'c_rival',
      mood: 'threat',
      beats: [
        { who: 'them', art: RIVAL_SNORT, text: "Reyes. That vulture's been circling my chair for three years on nothing but ambition." },
        { who: 'you', art: RIVAL_PRESS, text: "He doesn't need proof, Commissioner. He needs a headline, and I can hand him one for free whenever I like. Every day you stall me is a day closer to his committee finding out I already have." },
        { who: 'them', art: RIVAL_CALC, text: "(a flicker of something almost like fear, quickly filed away) …You'd be handing a wolf a very large weapon." },
      ],
      choices: [{ id: 'go', label: 'Let him weigh the wolf.', tone: 'disarm', to: 'c_cutout' }],
    },
    {
      id: 'c_upriver',
      mood: 'threat',
      beats: [
        { who: 'them', art: UPRIVER_FLAT, text: "(flat, testing) I don't know what you imagine I've been protecting." },
        { who: 'you', art: UPRIVER_NAME, text: "Cassar's partners. The ones who never sign anything, never appear on a manifest, and pay men like you to keep it that way. Say their names surface with yours attached — how long do you last as their clean-handed friend at the Hall?" },
        { who: 'them', art: UPRIVER_STILL, text: "(the first flicker of something under all that calm — not fear of you, fear of them) …You do not want to be the reason those names surface. Neither, I promise you, do I." },
      ],
      choices: [{ id: 'go', label: 'Let that fear sit with him a moment.', tone: 'disarm', to: 'c_cutout' }],
    },

    // --- THE LAST SHIELD: his instinct, cornered, is a cut-out — offer a name
    // below him and let it absorb the fall. Refuse it and he's out of exits. ---
    {
      id: 'c_cutout',
      mood: 'threat',
      beats: [
        { who: 'them', art: OFFER, text: "(exhales, and for the first time looks almost tired — a man reaching for a familiar drawer) There is a name I can give you. A deputy commissioner — Price handles the paperwork end of things I never touch personally. It was his signature that authorized the... unfortunate matter with your father. Take him. Take everything on him. Leave this office out of it." },
        { who: 'you', caption: true, art: SEETHROUGH, text: "It's smooth, practiced, and it's the exact trick he's run his whole career — hand down a name below you and let it absorb the fall so the man at the top stays clean. It's the very shield you came here to take away from him." },
      ],
      ask: "He's handing you a name. Is it the one you actually want?",
      choices: [
        { id: 'reject', label: "No. 'I know a cut-out when I'm handed one. I want the man whose signature actually mattered. You.'", tone: 'push', to: 'c_mirror' },
        { id: 'accept', label: "Take it — 'A name's a name. I'll take Price and call it a night.'", tone: 'disarm', to: 'o_cutout' },
      ],
    },

    // --- THE MIRROR: the last shield is gone. The only lever left is the one
    // thing he never armored. Both choices get you Marlowe — only one of them
    // costs you the same coin he's always spent. ---
    {
      id: 'c_mirror',
      mood: 'guilt',
      beats: [
        { who: 'them', art: STRIPPED, text: "(quiet now, the calm gone brittle, out of drawers to reach into) …Then what is it you actually want from me, Mr. Vidal." },
        { who: 'you', caption: true, art: LEVER_CHOICE, text: "Everything else in this room is armor he built himself — the record, the reputation, even Price. There's exactly one thing he never armored, because he never imagined needing to: his daughter. Eleanor Vane, prosecutor, rising fast, her whole young name built on the story that her father is the one clean man in this Hall. That's the lever. The only question left is whether you use it." },
      ],
      ask: "He's out of exits. What do you reach for to make sure it holds?",
      choices: [
        { id: 'throughEleanor', label: "'Give me Marlowe — or the first thing your daughter ever prosecutes is her own father's name.'", tone: 'push', to: 'o_break' },
        { id: 'holdLine', label: "'Give me Marlowe. Everything else in this room stays exactly where it is. Including her.'", tone: 'disarm', to: 'o_ally' },
      ],
    },

    // --- endings (carry the deal result) ---
    {
      id: 'o_break',
      mood: 'threat',
      portrait: END_BREAK,
      outcome: {
        key: 'break', tone: 'mixed',
        title: 'VANE — THE NAME AND THE PRICE',
        line: "His hand doesn't shake, but something behind his eyes finally does. \"Marlowe,\" he says, quiet, like the word costs him a tooth. \"Everything runs through Marlowe, and Marlowe answers to me.\" He gives you the road up — because you left him no version of tomorrow where his daughter's name survives you telling the truth.",
        ripple: "Vane names Marlowe and opens the last door — you're one room from the top. But you got there by aiming at a woman who's done nothing but believe her father's lie, and Vane will spend whatever power he has left making sure you regret it.",
        reflect: "I told myself I'd never do this — reach past the man in the chair to something that never asked to be part of it. Pa didn't die so I could learn to erase people the way they erased him. Tonight I did it anyway, and it worked exactly as well as it worked for them.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        heatDelta: 2,
        tag: 'YOU CLIMB',
        cta: 'THE LAST DOOR ▸',
        grants: ['marloweExposed'],
        campaign: { bonds: [{ id: 'vane', delta: -3 }], faction: { id: 'hall', delta: 1 }, ledger: ['vane_broken', 'marloweExposed'] },
        debrief: { principle: 'the-mirror',
          note: "You broke plausible deniability the only way it actually breaks — by making the fall personal, and picking the one person he'd never let fall. That's not leverage anymore. It's the exact tool that erased your father: a name, threatened, to buy a signature. **The mirror** doesn't care that your reasons were better than his. It only tracks the method — and tonight the method was identical." },
      },
    },
    {
      id: 'o_ally',
      mood: 'hope',
      portrait: END_ALLY,
      outcome: {
        key: 'ally', tone: 'good',
        title: 'VANE — EVERY THREAD BUT ONE',
        line: "He sees exactly what you didn't reach for, and something in his face — not gratitude, he's too proud for that — comes close to respect. \"Marlowe,\" he says. \"Ask him what he did in my name, and he'll tell you it was never his to refuse.\" He gives you the road up untouched, and Eleanor Vane never has to learn what her father actually is.",
        ripple: "Vane names Marlowe — the last door is open, and you climb without burning the one thing in that room that was innocent.",
        reflect: "I had the exact tool that would've finished him twice as fast, and I left it in the drawer. Maybe that's not mercy. Maybe it's just the one line I still know how to hold.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        heatDelta: 1,
        tag: 'YOU CLIMB',
        cta: 'THE LAST DOOR ▸',
        grants: ['marloweExposed'],
        campaign: { bonds: [{ id: 'vane', delta: 1 }], faction: { id: 'hall', delta: 2 }, ledger: ['vane_turned', 'marloweExposed'] },
        debrief: { principle: 'power-mapping',
          note: "You didn't need his heart to break him — you needed his **map**. Price's ledger, the reporter's story, Reyes's ambition, the upriver names: four threads of who-owes-whom converging on one desk until there was no direction left for him to hide in. That's **power mapping**: chart real dependency, not the title on the door, and you find every lever a man actually has — including the ones that let you leave the one person he loves entirely out of the room." },
      },
    },
    {
      id: 'o_cutout',
      mood: 'cold',
      portrait: END_CUTOUT,
      outcome: {
        key: 'cutout', tone: 'mixed',
        title: "VANE — THE NAME HE COULD AFFORD TO LOSE",
        line: "He slides Price's name across the desk like a man paying a toll with someone else's coin, and you take it — and it works exactly as well for you as it's worked for him his entire career. Price goes down loud and public. Vane walks back to committee in nine minutes, untouched, and Marlowe stays exactly as far away as he was this morning.",
        ripple: "You get a name, a real one — a man who'll actually answer for something. It just isn't the name that mattered. Vane keeps his desk, his committee, and the road to Marlowe sealed.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
        campaign: { bonds: [{ id: 'vane', delta: 0 }], faction: { id: 'hall', delta: 1 }, ledger: ['vane_cutout'] },
        debrief: { principle: 'plausible-deniability',
          note: "He handed you exactly what **plausible deniability** is built to hand you — a name below him, deniable, disposable, dressed up as the truth — and you took it because a body on the table felt like winning. That's **the cut-out** doing precisely its job: a layer that absorbs the fall so the signature that actually mattered never gets read out loud. You came here to collapse that shield. Instead, you helped him use it." },
      },
    },
    {
      id: 'o_standoff',
      mood: 'threat',
      portrait: END_STANDOFF,
      outcome: {
        key: 'standoff', tone: 'bad',
        title: 'VANE — HE OUTWAITS YOU',
        line: "You came in banking on the idea that a man this deep in a conspiracy is scared of the men beside him in it. You weren't wrong. You just gave him nothing that made silence more dangerous than talking — and a patient man, choosing between a certain small risk and an uncertain larger one, always chooses the smaller one. \"I have a committee,\" he says, and stands, and that's the whole answer you get.",
        ripple: "Nothing moves. Vane goes back to his eleven minutes exactly as untouched as he started, and now he knows your face and your name in a building full of people who owe him favors.",
        reflect: "Sal's ledger, the file, everything I've built to reach this room — and I walked in and just talked. Like the truth by itself was ever going to move a man who's spent a career being unmovable.",
        heatDelta: 3,
        deal: { closed: false, gotName: false, faceIdx: 2 },
        campaign: { bonds: [{ id: 'vane', delta: -1 }], faction: { id: 'hall', delta: -1 }, ledger: ['vane_stonewalled'] },
        debrief: { principle: 'prisoners-dilemma',
          note: "Somewhere under that calm, Vane and Marlowe are exactly two conspirators wondering whether the other one talks first if this ever comes apart — that mutual fear was always your real weapon. But a **prisoner's dilemma** only breaks when staying silent looks riskier than defecting, and you gave him no reason to believe that. Faced with a certain small cost — waiting you out — against an uncertain larger one, the rational conspirator does what rational conspirators do. He said nothing. So did Marlowe, wherever he is." },
      },
    },
  ],
};
