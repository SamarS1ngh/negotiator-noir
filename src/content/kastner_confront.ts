import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, hard-varied framing
// across the sit-down (entrance, sizing-up, tense exchanges, leverage reveals,
// Kastner's throne cracking, and each distinct ending).
const HALL_THRONE = 'assets/art/scene/kastner_hall_throne.jpg';           // wide: the hiring hall, fifty men in line, Kastner over the chalk board
const SERENE_DISMISS = 'assets/art/scene/kastner_serene_dismiss.jpg';     // dismissive, "impress me"
const CRACKS_TENSE = 'assets/art/scene/kastner_cracks_tense.jpg';         // shoulders set, word's reached him
const CRACKS_WARN = 'assets/art/scene/kastner_cracks_warn.jpg';          // "somebody's been asking my men questions"
const FOREWARNED_STACK = 'assets/art/scene/kastner_forewarned_stack.jpg'; // wide: the hall stacked with his biggest men
const FOREWARNED_THREAT = 'assets/art/scene/kastner_forewarned_threat.jpg'; // "this is a courtesy"
const OPEN_BOARD = 'assets/art/scene/kastner_open_board.jpg';            // him at the manifest board, laying his terms
const OPEN_SIZEUP = 'assets/art/scene/kastner_open_sizeup.jpg';          // you, caption — the tell you catch
const READ_FEAR = 'assets/art/scene/kastner_read_fear.jpg';              // the correct read lands
const READ_MISS_MUSCLE = 'assets/art/scene/kastner_read_missmuscle.jpg'; // wrong read: just brutality
const READ_MISS_BELIEVER = 'assets/art/scene/kastner_read_missbeliever.jpg'; // wrong read: true believer
const TABLE_WAIT = 'assets/art/scene/kastner_table_wait.jpg';            // impatient, tapping the board
const MANIFEST_ALARM = 'assets/art/scene/kastner_manifest_alarm.jpg';    // the manifests land
const MANIFEST_PRESS = 'assets/art/scene/kastner_manifest_press.jpg';    // you, pressing the paper trail
const CUSTOMS_ALARM = 'assets/art/scene/kastner_customs_alarm.jpg';      // Breen's name lands
const CUSTOMS_PRESS = 'assets/art/scene/kastner_customs_press.jpg';      // you, naming the federal word
const WITNESS_GUILT = 'assets/art/scene/kastner_witness_guilt.jpg';      // old guarded guilt, the vanished man
const WITNESS_PRESS = 'assets/art/scene/kastner_witness_press.jpg';      // you, naming Finn's husband
const RIVAL_ALARM = 'assets/art/scene/kastner_rival_alarm.jpg';         // Delaney's name lands
const RIVAL_PRESS = 'assets/art/scene/kastner_rival_press.jpg';         // you, laying out the chair he could lose
const NAMES_ALLY = 'assets/art/scene/kastner_names_ally.jpg';           // he gives up Cassar, relieved
const NAMES_BROKEN = 'assets/art/scene/kastner_names_broken.jpg';       // he spits the name out, dragged up
const NAMES_PIVOT = 'assets/art/scene/kastner_names_pivot.jpg';         // bitter laugh, caught between two blades
const END_ALLY = 'assets/art/scene/kastner_end_ally.jpg';               // your man on the piers
const END_BROKEN = 'assets/art/scene/kastner_end_broken.jpg';           // torn down in his own hall
const END_PIVOT = 'assets/art/scene/kastner_end_pivot.jpg';             // the man both sides need
const END_WALK = 'assets/art/scene/kastner_end_walk.jpg';               // thrown back in the line

// KASTNER — the Chapter Three sit-down, the Act II midpoint. He runs the union
// hiring hall: fifty men a morning beg him for a chalk mark that decides whether
// they eat. He's brutal and entrenched — but the reveal underneath the throne is
// that he's not just muscle or true believer, he's COMPLICIT: he knows unmarked
// war-surplus crates move through his piers, and he looks away for a cut. Men who
// ask what's in those crates vanish. What he can't survive is his own four hundred
// men finding out what he traded their trust for.
//   • the OPENING reacts to your prep — s0_serene (default) / s0_cracks (you
//     turned his people or hold proof) / s0_forewarned (kastnerForewarned or high
//     heat), chosen by startAt in game.ts from your world-flags.
//   • the READ (fear vs muscle vs true-believer) colors nothing mechanically but
//     the fumble beats correct themselves before the table — no dead end.
//   • the four prep flags (manifestProof/customsProof/witnessLead/unionRival) are
//     the only ways past his throne; nerve alone gets you thrown back in line.
//   • three of the four levers (manifest/customs/witness) converge on the same
//     mercy-or-cruelty choice; the FOURTH — Delaney, the rival — opens a THIRD
//     option unique to it: don't spare him and don't break him, become the reason
//     neither Kastner nor Delaney can move without you. That's triangulation.
// Every winning path forces him to give up where the cargo money goes: the
// CASSAR BANK. Endings carry a `deal` {closed, gotName, faceIdx} the board applies
// — gotName climbs you to Chapter Four; faceIdx 0 = ally-coded, 2 = enemy.
export const KASTNER_CONFRONT: Mission = {
  id: 'kastner_confront',
  actionId: 'kastner_confront',
  nodeId: 'kastner',
  label: 'Sit down with Kastner',
  palette: 'deluca',
  scene: 'assets/art/scene/kastner.jpg',
  teaches: ['leverage-and-batna', 'triangulation', 'walk-away-power', 'the-mirror'],
  start: 's0_serene',
  nodes: [
    // --- reactive openings (game.ts picks one via startAt), all → 'open' ---
    {
      id: 's0_serene',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HALL_THRONE, text: "Fifty men in a line outside Kastner's hiring hall before six every morning, waiting on a chalk mark that says which of them eats this week. He sits over that board like it's a throne — because on this waterfront, in every way that matters, it is. He doesn't know your face yet. Just another body wanting something from him." },
        { who: 'them', art: SERENE_DISMISS, text: "Every morning I decide who works and who starves, and every morning somebody thinks his sob story's the one that moves me. Sit down. Impress me before I remember I've got fifty better uses for this chair." },
      ],
      choices: [{ id: 'go', label: 'Sit. Let him hold court.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: CRACKS_TENSE, text: "Word travels faster through a hiring hall than through any back room in the district. Kastner's people have been talking, and it's in the set of his shoulders before you've said a word." },
        { who: 'them', art: CRACKS_WARN, text: "Somebody's been asking my men questions they've got no business asking. If that's you, dockrat, you'd better make this fast — before I decide you're the reason my hall's gone quiet." },
      ],
      choices: [{ id: 'go', label: "Sit. He's already rattled.", tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: FOREWARNED_STACK, text: "Someone ran to him first. Kastner's stacked the hall with his biggest men, arms crossed at every door, and he isn't bothering to hide it." },
        { who: 'them', art: FOREWARNED_THREAT, text: "I know exactly whose blood you're carrying and exactly what you've been doing on my piers. This is a courtesy, dockrat — one I don't extend twice. Talk." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. Don't flinch.", tone: 'disarm', to: 'open' }],
    },

    // --- the table ---
    {
      id: 'open',
      mood: 'tense',
      beats: [
        { who: 'them', art: OPEN_BOARD, text: "You want on these docks, you go through me — same as every man in that line outside. I decide who loads, who starves, who disappears quiet and who disappears loud. So convince me you're worth more than a chalk mark." },
        { who: 'you', caption: true, art: OPEN_SIZEUP, text: "He talks like a king, but his eyes keep drifting past you to the manifest board pinned on the wall — not the one that decides wages, the other one, the one that doesn't match what actually comes off those ships. A man that in control of a room doesn't need to check his own lie this often." },
      ],
      ask: "What's actually running Kastner, underneath the throne?",
      choices: [
        { id: 'readFear', label: "Not muscle, not conviction — fear. He's terrified of what his own men do to him the day they learn what he's let move under their noses.", tone: 'disarm', to: 'read_hit' },
        { id: 'readMuscle', label: "Just brutality with a union card. Scare him harder than the docks do and he folds.", tone: 'push', to: 'read_missMuscle' },
        { id: 'readBeliever', label: "A true union man to the bone — everything he does, he tells himself is for his men.", tone: 'disarm', to: 'read_missBeliever' },
      ],
    },

    // --- the read: deduce him before you open (correct read colors the table,
    // wrong reads correct themselves — no dead end, just a worse first step) ---
    {
      id: 'read_hit',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_FEAR, text: "There it is again — that half-second flick toward the manifest board whenever the cargo comes up, gone before he can catch it. Not guilt over the wage-fixing; something bigger he's built his whole reign on hiding. Threaten his exposure, not his body — his body's the one thing on this dock nobody's ever managed to touch." },
      ],
      choices: [{ id: 'go', label: 'Play him accordingly.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_missMuscle',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_MISS_MUSCLE, text: "You're sizing up how hard to push before you catch yourself — men don't run a hiring hall fifteen years on muscle alone. Every boss tougher than him is dead or in the river. Whatever keeps Kastner sitting in that chair, it isn't that he hits hardest." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'table' }],
    },
    {
      id: 'read_missBeliever',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: READ_MISS_BELIEVER, text: "A true believer doesn't look away when one of his own men vanishes asking a question. He'd have torn the docks apart looking for answers. Kastner didn't. Whatever's buying his silence, it isn't loyalty to the line outside." },
      ],
      choices: [{ id: 'go', label: 'Adjust your play.', tone: 'disarm', to: 'table' }],
    },

    {
      id: 'table',
      mood: 'tense',
      beats: [
        { who: 'them', art: TABLE_WAIT, text: "(taps two fingers on the manifest board, waiting, already bored of you)" },
      ],
      ask: "Everything this chapter handed you comes down to this table. What do you put on it?",
      choices: [
        { id: 'manifest', label: "The manifests — 'Halloran's signed proof these ships carry cargo that's on no inventory anywhere. You knew every time you looked away.'", tone: 'push', requires: ['manifestProof'], to: 'c_manifest' },
        { id: 'customs', label: "Customs — 'Breen's been paid to wave it through. I have the transactions. That's a word the feds like: conspiracy.'", tone: 'push', requires: ['customsProof'], to: 'c_customs' },
        { id: 'witness', label: "The vanished — 'A man asked what moves through your piers and never came home. His widow wants the truth. So do I.'", tone: 'push', requires: ['witnessLead'], to: 'c_witness' },
        { id: 'rival', label: "Delaney — 'Your own rank and file are one bad morning from handing him your chair, and he's got proof you don't.'", tone: 'push', requires: ['unionRival'], to: 'c_rival' },
        { id: 'nothing', label: "Face him with nothing but nerve — 'I did for Ricci. I did for DeLuca. I can do for you.'", tone: 'push', to: 'o_walk' },
      ],
    },

    {
      id: 'c_manifest',
      mood: 'threat',
      beats: [
        { who: 'them', art: MANIFEST_ALARM, text: "(the tapping stops dead) …Where did a dockrat get a signed manifest out of Halloran's cabinet." },
        { who: 'you', art: MANIFEST_PRESS, text: "Doesn't matter. What matters is who else sees it — every phantom crate you signed off on, laid out for the men in that line outside to read for themselves." },
      ],
      ask: "He's cornered by paper now, not muscle. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'faceSave', label: "Let him save face — 'Keep the hall. From tonight you tell me everything that moves through it.'", tone: 'disarm', to: 'r_ally' },
        { id: 'break', label: "Break him — 'Stand up in front of that hall and tell them what you let through it.'", tone: 'push', to: 'r_broken' },
      ],
    },
    {
      id: 'c_customs',
      mood: 'threat',
      beats: [
        { who: 'them', art: CUSTOMS_ALARM, text: "(a flicker of real alarm) Breen wouldn't. Breen's smart enough not to—" },
        { who: 'you', art: CUSTOMS_PRESS, text: "Breen already did. It's dated, it's signed, and it's got your name on the docks he waved it through. That's not a union problem anymore. That's a federal one." },
      ],
      ask: "He's staring down men with badges now, not you. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'faceSave', label: "Let him save face — 'Keep the hall. From tonight you tell me everything that moves through it.'", tone: 'disarm', to: 'r_ally' },
        { id: 'break', label: "Break him — 'You're going to hand your own men the proof yourself.'", tone: 'push', to: 'r_broken' },
      ],
    },
    {
      id: 'c_witness',
      mood: 'guilt',
      beats: [
        { who: 'them', art: WITNESS_GUILT, text: "(something guarded and old crosses his face) …That man made his own choice, asking what he asked." },
        { who: 'you', art: WITNESS_PRESS, text: "He asked a question and you let him vanish for it. His widow's still telling people he ran off owing money. You're going to tell her the truth — and tell me where the money that bought his silence actually goes." },
      ],
      ask: "You've hit something that isn't fear of exposure — it's guilt he's carried alone. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'faceSave', label: "Let him save face — 'Clear her husband's name quietly. Keep the hall. From tonight you tell me everything.'", tone: 'disarm', to: 'r_ally' },
        { id: 'break', label: "Break him — 'Stand in that hall and tell every man in line exactly what you let happen to one of their own.'", tone: 'push', to: 'r_broken' },
      ],
    },
    {
      id: 'c_rival',
      mood: 'fear',
      beats: [
        { who: 'them', art: RIVAL_ALARM, text: "(a flicker of fear he can't smother) Delaney. That firebrand pup's been circling for a year. What's he got." },
        { who: 'you', art: RIVAL_PRESS, text: "Proof, and patience, and four hundred men who'd follow a clean pair of hands over a dirty one in a heartbeat. I can hold him off you. Or I can hand him the last push myself." },
      ],
      ask: "It's not you he's afraid of — it's his own chair. What do you force out of him — and how do you leave him?",
      choices: [
        { id: 'triangulate', label: "Neither mercy nor cruelty — 'You keep the hall exactly as long as I hold Delaney back. He keeps his shot exactly as long as I let him. You both answer to me now.'", tone: 'disarm', to: 'r_pivot' },
        { id: 'break', label: "Break him — 'Hand the hall to Delaney yourself, in front of everyone.'", tone: 'push', to: 'r_broken' },
      ],
    },

    // --- THE REVEAL — shared beat where the cracked lever forces the name out:
    // the Cassar Bank, where the cargo money washes clean upriver ---
    {
      id: 'r_ally',
      mood: 'cold',
      beats: [
        { who: 'them', art: NAMES_ALLY, text: "(a long, ugly silence, then something like relief) …You don't want the hall. You want to know where it goes. Fine. It doesn't stop with me — never did. Every dollar that buys a blind eye on these piers ends up upriver, in a vault at the Cassar Bank. Man named Cassar keeps it clean. Above me. Above anybody you've met so far." },
      ],
      choices: [{ id: 'go', label: 'Let it land. Keep your face still.', tone: 'disarm', to: 'o_in_ally' }],
    },
    {
      id: 'r_broken',
      mood: 'threat',
      beats: [
        { who: 'them', art: NAMES_BROKEN, text: "(dragged half-upright by his own collar, spitting it out like a curse) Cassar. The Cassar Bank. That's where it washes clean, upriver, out of my hands and yours both. Happy? You think you just won something, dockrat? You just found out how deep the water actually goes." },
      ],
      choices: [{ id: 'go', label: 'Say nothing. Watch him go down.', tone: 'push', to: 'o_in_broken' }],
    },
    {
      id: 'r_pivot',
      mood: 'cold',
      beats: [
        { who: 'them', art: NAMES_PIVOT, text: "(caught between two blades, he laughs once, bitter) …Clever. Cassar Bank. That's the name you want — upriver, where it all gets washed clean. Congratulations. You just made yourself the only man on this waterfront both me and that pup trust to hold the knife steady." },
      ],
      choices: [{ id: 'go', label: "Take the name. Don't take sides — yet.", tone: 'disarm', to: 'o_pivot' }],
    },

    // --- endings (carry the deal result) ---
    {
      id: 'o_in_ally',
      mood: 'hope',
      portrait: END_ALLY,
      outcome: {
        key: 'in_ally', tone: 'good',
        title: 'KASTNER — YOUR MAN ON THE PIERS',
        line: "Terrified of what happens the moment his own hall learns what he let through it, Kastner folds — and keeps his chalk, his chair, his throne over the line of hungry men outside. In trade, he's yours: your eyes on every manifest, your ears on every deal, and the name of the men who wash the cargo's money clean. The Cassar Bank. You've climbed another rung.",
        ripple: "Kastner is your man inside the union hall now — the docks feed you everything that moves through them, and the road to the Cassar Bank is open.",
        reflect: "Another man kept breathing because he's worth more to me alive and owned. I keep telling myself that's mercy. Some nights it just feels like an inventory.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['cassarNamed'],
        campaign: { bonds: [{ id: 'kastner', delta: 2 }], faction: { id: 'union', delta: 2 }, ledger: ['kastner_turned', 'cassarNamed'] },
        debrief: { principle: 'leverage-and-batna',
          note: "You didn't have to touch him to move him — the manifests made silence more dangerous than talking, and a man with a worse alternative to yes always says yes. That's **leverage and BATNA** in one move: his walk-away, if he refused you, was his own dockworkers finding a body count with his name on it. You didn't threaten Kastner. You just made sure his best alternative to cooperating was worse than cooperating." },
      },
    },
    {
      id: 'o_in_broken',
      mood: 'threat',
      portrait: END_BROKEN,
      outcome: {
        key: 'in_broken', tone: 'mixed',
        title: 'KASTNER — TORN DOWN IN HIS OWN HALL',
        line: "You make him stand in front of four hundred men who trusted him with their next meal and confess exactly what he let move past them — and what it cost the ones who asked. He gives up the name, the Cassar Bank, spitting it like poison. You have your way up. You also have four hundred men who just watched their boss break, and a boss who'll spend whatever's left of his life making you pay for watching.",
        ripple: "You've torn Kastner down in front of his own hall — the road to the Cassar Bank stands open. But he's a broken, vengeful enemy now, and word of what you did travels fast on a waterfront.",
        reflect: "I put a man on his knees in front of the people who depended on him, and some part of me needed them to see it. That part's getting louder every chapter. I used to wonder what kind of man does this for a living. I'm starting to worry I'll find out.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        heatDelta: 1,
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['cassarNamed'],
        campaign: { bonds: [{ id: 'kastner', delta: -3 }], faction: { id: 'union', delta: 1 }, ledger: ['kastner_broken', 'cassarNamed'] },
        debrief: { principle: 'the-mirror',
          note: "You had a cleaner way to get the same name and chose the one that made four hundred men watch their boss break — because some part of you wanted the room to see what you're capable of. That want has a name: the exact appetite Marlowe built an empire feeding. **The mirror** doesn't grade you on whether you got the name. It asks what you enjoyed on the way to getting it." },
      },
    },
    {
      id: 'o_pivot',
      mood: 'cold',
      portrait: END_PIVOT,
      outcome: {
        key: 'pivot', tone: 'good',
        title: 'KASTNER — THE MAN BOTH SIDES NEED',
        line: "You don't save Kastner's face and you don't break him — you make yourself the only thing standing between him and the chair Delaney wants, and the only thing standing between Delaney and getting torn apart for taking it too soon. Cornered from both directions at once, Kastner gives up the name to buy your patience: the Cassar Bank, where the cargo money goes to come out clean. Neither man above him nor below him moves again without checking with you first.",
        ripple: "Kastner keeps his chalk board, Delaney keeps his patience, and you're the reason both of them still can. The road to the Cassar Bank is open — and you didn't have to spend a friend or make an enemy to get there.",
        reflect: "Ricci taught me the golden bridge — leave a man his face. Kastner taught me something colder: sometimes you don't need to leave anyone a bridge. You just need to become the only road.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['cassarNamed'],
        campaign: { bonds: [{ id: 'kastner', delta: 1 }], faction: { id: 'union', delta: 2 }, ledger: ['kastner_pivoted', 'delaney_leveraged', 'cassarNamed'] },
        debrief: { principle: 'triangulation',
          note: "You never had to out-muscle a man who decides who eats on this waterfront. You just found the second man who wanted his chair and stood exactly between them — Kastner needs you to hold Delaney off, Delaney needs you to hold the door open. That's **triangulation**: don't fight the strong man, make yourself the pivot two of his own people have to go through. Neither one can move against you without helping the other." },
      },
    },
    {
      id: 'o_walk',
      mood: 'threat',
      portrait: END_WALK,
      outcome: {
        key: 'walk', tone: 'bad',
        title: 'KASTNER — THROWN BACK IN THE LINE',
        line: "Nerve alone doesn't crack a man who's outlasted three district wars and a dozen would-be replacements. Kastner doesn't even raise his voice — he just nods once, and two of his biggest men walk you out through the line of hungry dockworkers you thought you were better than. You got nothing. He's got your face, and a reason to remember it.",
        ripple: "No deal. Nothing changes on the board — and Kastner knows exactly who came looking for a fight he didn't have to have.",
        reflect: "Pa always said know a man's weight before you lean on him. Kastner's weight is fifteen years and four hundred men who owe him their next meal. I brought a speech to a scale I hadn't even checked.",
        heatDelta: 3,
        deal: { closed: false, gotName: false, faceIdx: 2 },
        campaign: { bonds: [{ id: 'kastner', delta: -2 }], faction: { id: 'union', delta: -1 }, ledger: ['kastner_alerted'] },
        debrief: { principle: 'walk-away-power',
          note: "You walked in with nothing that could cost him anything if he said no — no manifest, no federal exposure, no widow's grief, no rival at his back — so his best alternative to hearing you out was exactly what he did: nothing at all, at no cost. **Walk-away power** belongs to whoever can survive 'no' the longest. Tonight, cornered by nothing but your own nerve, that man was Kastner, not you." },
      },
    },
  ],
};
