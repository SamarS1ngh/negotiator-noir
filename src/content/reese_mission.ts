import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the read → the approach → the guilt
// bomb → the complication → the fear math → each ending its own image + mood).
const ALONE = 'assets/art/scene/reese_alone.jpg';         // slumped alone in the back booth, hat + whisky
const TAIL = 'assets/art/scene/reese_tail.jpg';           // "I know a tail when I feel one, kid"
const STOPS = 'assets/art/scene/reese_stops.jpg';         // the glass stops halfway
const ASK = 'assets/art/scene/reese_ask.jpg';              // "what happened to him?"
const ENVELOPE = 'assets/art/scene/reese_envelope.jpg';    // sets the glass down, the confession
const HOLLOW = 'assets/art/scene/reese_hollow.jpg';        // the hollow laugh, the fear math
const WEIGH = 'assets/art/scene/reese_weigh.jpg';          // weighing witness vs. loose end
const HARD = 'assets/art/scene/reese_hard.jpg';            // NEW — wrong read (threat): jaw sets, not fear — anger
const TELL = 'assets/art/scene/reese_tell.jpg';            // NEW — wrong read (money): can't meet his own eyes in the glass
const SHADOW = 'assets/art/scene/reese_shadow.jpg';        // NEW — the complication: DeLuca's watcher settles two stools down
const FILE_END = 'assets/art/scene/reese_file_end.jpg';    // pulls the folder from his coat
const SHAKE_END = 'assets/art/scene/reese_shake_end.jpg';  // shaking, drinking faster
const FOLD_END = 'assets/art/scene/reese_fold_end.jpg';    // at the phone booth, dialing DeLuca

// REESE — the detective DeLuca owns. Twenty years ago he took his first envelope
// "just once." Now he's in so deep he books the district's murders as accidents.
// Tired, guilty, drinking. He knows where DeLuca's real money moves and where the
// bodies went — the proof that DeLuca's been building his own empire behind
// Marlowe's back. Money insults him; he's drowning, not greedy.
// THE WOVEN READ: before you say a word past the opening needle, you have to
// judge what Reese truly IS — a drowning man who wants OUT (a shot at
// absolution, not more money, not another threat), a man who only moves under a
// bigger fear, or a cop with a price like any other on DeLuca's payroll. Only
// the first is true. It doesn't lock the board — every read still reaches every
// approach — but a wrong read gets its own fumble beat (he hardens, or you
// nearly insult him) before you recover into the same fork, and a right read
// walks straight in.
// THE COMPLICATION: on the conscience path, mid-confession, DeLuca's watcher sits
// down two stools away — a beat under real pressure (go still, or talk over it)
// before the scene rejoins the same rope-or-push fork into the same three
// endings.
//   PROOF   — he gives you the file: DeLuca's secret empire ('delucaProof')
//   SCARED  — you get the file, but leave a wreck who may run to DeLuca
//   BOLTS   — you spook him; he runs to DeLuca, who's forewarned
export const REESE_MISSION: Mission = {
  id: 'reese_mission',
  actionId: 'reese_turn',
  nodeId: 'reese',
  label: 'Work the detective',
  palette: 'sal',
  scene: 'assets/art/scene/reese.jpg',
  teaches: ['golden-bridge', 'interests-not-positions', 'loss-aversion'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ALONE, text: "Detective Reese drinks alone in the back of a bar that isn't his precinct's, which tells you everything. He's the man who signs off DeLuca's bodies as drownings and bar fights. He hates himself for it in a quiet, professional way." },
        { who: 'them', art: TAIL, text: "(not turning) I know a tail when I feel one, kid. Whatever you're selling, I've already bought worse. Sit down or walk — you're blocking my light." },
      ],
      ask: "He's guarded, sharp, three drinks past careful — and every one of those things is a tell if you read it right. What IS Reese, underneath the badge he's stopped believing in?",
      choices: [
        { id: 'read_out', label: "A drowning man looking for a way out — not more money, not another threat. A shot at being clean again.", tone: 'disarm', to: 'r_wantout' },
        { id: 'read_scared', label: "A man who only moves when the fear's big enough. Lean on it.", tone: 'press', to: 'r_threatened' },
        { id: 'read_money', label: "A cop on a payroll like any other. Everyone on DeLuca's take has a price.", tone: 'bribe', to: 'r_forsale' },
      ],
    },

    // --- THE WOVEN READ: what you decide he truly is, before you say a word ---
    {
      id: 'r_wantout',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: ALONE, text: "The late nights alone. The flinch at questions he used to ask for a living. The drink that's more habit than pleasure. That's not a man guarding a score, and it's not a man haggling a price — it's a man who's been waiting years for someone to ask him to be a good cop again." },
      ],
      ask: "You know what he needs before he's said it. How do you open a drowning man?",
      choices: [
        { id: 'conscience', label: "His conscience — 'You joined to catch men like DeLuca. Now you bury them for him.'", tone: 'disarm', to: 'n_conscience' },
        { id: 'fear', label: "His fear — 'When DeLuca falls — and he's going to — the cop who covered it falls with him.'", tone: 'press', to: 'n_fear' },
        { id: 'money', label: "Offer him cash — 'Name your price for what you know about DeLuca.'", tone: 'bribe', to: 'o_bolts' },
      ],
    },
    {
      id: 'r_threatened',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: HARD, text: "You clock the fear on him and decide that's the lever — scare him hard enough and he folds. Except the moment you frame it that way in your head, something in his jaw doesn't crack. It sets. That's not a man about to be threatened into anything. That's a man who's already been threatening himself, every night, in the mirror, for years." },
      ],
      ask: "Wrong lever, and some part of him already clocked you reaching for it. Recover, or keep pushing?",
      choices: [
        { id: 'fear', label: "Push on anyway — 'When DeLuca falls — and he's going to — the cop who covered it falls with him.'", tone: 'press', to: 'n_fear' },
        { id: 'conscience', label: "Recover — 'You joined to catch men like DeLuca. Now you bury them for him.'", tone: 'disarm', to: 'n_conscience' },
        { id: 'money', label: "Offer him cash — 'Name your price for what you know about DeLuca.'", tone: 'bribe', to: 'o_bolts' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: TELL, text: "You size him up as a man with a price — DeLuca pays him, so you figure you can outbid DeLuca. But right as you go to open with a number, his eyes drop to his own reflection in the whisky glass, and he can't hold it there either. That's not a man doing math on an offer. You're about to insult someone who isn't for sale." },
      ],
      ask: "You almost priced a man who wants absolution, not cash. Catch yourself, or make the mistake anyway?",
      choices: [
        { id: 'money', label: "Make the offer anyway — 'Name your price for what you know about DeLuca.'", tone: 'bribe', to: 'o_bolts' },
        { id: 'conscience', label: "Catch yourself — 'You joined to catch men like DeLuca. Now you bury them for him.'", tone: 'disarm', to: 'n_conscience' },
        { id: 'fear', label: "His fear instead — 'When DeLuca falls — and he's going to — the cop who covered it falls with him.'", tone: 'press', to: 'n_fear' },
      ],
    },

    // --- the conscience path: the guilt bomb, then a complication ---
    {
      id: 'n_conscience',
      mood: 'guilt',
      beats: [
        { who: 'them', art: STOPS, text: "(the glass stops halfway) …Low blow, kid. Accurate. But low." },
        { who: 'you', art: ASK, text: "There was a version of you that would've put DeLuca away in a week. What happened to him?" },
        { who: 'them', art: ENVELOPE, text: "(sets the glass down) He took an envelope. Once. To pay for his kid's operation. And 'once' is a lie you only get to tell yourself one time." },
        { who: 'you', caption: true, art: SHADOW, text: "The confession's barely out of his mouth when the stool two down creaks — a big, quiet man in a cheap suit settles in without a word to the bartender. You've seen his face before, in a photo in DeLuca's file: the one who watches the watchers. If Reese's expression slips now, you're both made." },
      ],
      ask: "One wrong flicker and DeLuca knows his own cop is talking. What do you do?",
      choices: [
        { id: 'quiet', label: "Go dead still — let it pass without a word.", tone: 'disarm', to: 'n_conscience_quiet' },
        { id: 'cover', label: "Talk over it, loud and easy — 'Same time next week, then, Detective.'", tone: 'press', to: 'n_conscience_cover' },
      ],
    },

    // --- THE COMPLICATION: the scene turns under pressure, then rejoins the same fork ---
    {
      id: 'n_conscience_quiet',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: TAIL, text: "Neither of you so much as breathes wrong. The big man orders a rye, drinks it without once looking over, and finally ambles back out into the rain. Reese lets go a breath he's been holding since the word 'envelope.'" },
      ],
      ask: "The old cop is still in there, drowning. Throw him a rope, or push him under?",
      choices: [
        { id: 'redeem', label: "The rope — 'Then let this be the once you take it back. Give me what you've got on him.'", tone: 'disarm', to: 'o_proof' },
        { id: 'shame', label: "Shame him — 'So you sold your badge for a hospital bill. Cheap.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'n_conscience_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: ALONE, text: "(easy, unbothered, like finishing a sentence) '…Same time next week, then, Detective.' The big man doesn't even glance over — pays for a coffee he never touches, and drifts back out." },
      ],
      ask: "The old cop is still in there, drowning. Throw him a rope, or push him under?",
      choices: [
        { id: 'redeem', label: "The rope — 'Then let this be the once you take it back. Give me what you've got on him.'", tone: 'disarm', to: 'o_proof' },
        { id: 'shame', label: "Shame him — 'So you sold your badge for a hospital bill. Cheap.'", tone: 'push', to: 'o_scared' },
      ],
    },

    {
      id: 'n_fear',
      mood: 'fear',
      beats: [
        { who: 'them', art: HOLLOW, text: "(a hollow laugh) You think I haven't done that math? Every night. DeLuca goes down, I go down. That's not a threat, kid, that's my whole retirement plan — hoping he outlives me." },
        { who: 'you', art: WEIGH, text: "Or you get ahead of it. The man who brings DeLuca down isn't the man who covered for him. He's a witness. There's a difference, and it's the difference between a pension and a cell." },
      ],
      ask: "He's weighing it — the terror of moving against the terror of standing still. Which way do you tip him?",
      choices: [
        { id: 'witness', label: "Make him the witness — 'Give me the file. Be the one who ended it, not the one who hid it.'", tone: 'disarm', to: 'o_proof' },
        { id: 'push', label: "Push the fear — 'Give it to me now, or I make sure DeLuca knows we talked.'", tone: 'push', to: 'o_scared' },
      ],
    },
    {
      id: 'o_proof',
      mood: 'hope',
      portrait: FILE_END,
      outcome: {
        key: 'proof', tone: 'good',
        title: 'REESE — THE FILE',
        line: "He pulls a folder from inside his coat — he's been carrying it, you realise, for a long time, waiting for someone to ask. \"Every property DeLuca's bought that Marlowe doesn't know about. Every dollar he's skimmed off the top. The man's been building his own kingdom. This is the rope. Hang him with it.\"",
        ripple: "You hold proof DeLuca's been robbing Marlowe blind to build his own empire — the one secret that terrifies him. The blade for the sit-down.",
        reflect: "He'd been waiting years for someone to ask him to be a good man again. I obliged him. I needed the file. Both things are true, and I can't tell anymore which one I meant.",
        heatDelta: -1,
        grants: ['delucaProof'],
        dispositions: [{ nodeId: 'reese', set: 4 }],
        campaign: { bonds: [{ id: 'reese', delta: 2 }], faction: { id: 'district', delta: 1 }, ledger: ['reese_proof'] },
        debrief: { principle: 'golden-bridge',
          note: "Reese didn't want a bribe and he didn't want a threat — he wanted a way to be the cop he meant to be twenty years ago. You built him a **bridge back to himself** instead of a wall to break through. A man who can cross with his dignity intact hands you more than one you corner ever will." },
      },
    },
    {
      id: 'o_scared',
      mood: 'cold',
      portrait: SHAKE_END,
      outcome: {
        key: 'scared', tone: 'mixed',
        title: 'REESE — A SHAKING SOURCE',
        line: "You get the file — but you got it by opening the wound and pouring salt. He's shaking, and he starts drinking faster the moment it leaves his hand. A man like that talks when he's frightened, and he's frightened now.",
        ripple: "You hold the proof. But Reese is a wreck, and a wreck of a cop who knows too much is exactly the kind of loose end DeLuca watches. He may sit down forewarned.",
        reflect: "I got the file and left the man worse than I found him. My father would have found a way to do the first without the second. I'm not sure I even tried.",
        grants: ['delucaProof'],
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'reese', set: 2 }],
        campaign: { bonds: [{ id: 'reese', delta: -1 }], ledger: ['reese_scared'] },
        debrief: { principle: 'interests-not-positions',
          note: "You wanted the file — your **position**. He needed to be forgiven — his **interest**. You got what you came for by pressing the position and ignoring the interest, and it worked. It also left you a source who's one bad night from bolting to DeLuca himself." },
      },
    },
    {
      id: 'o_bolts',
      mood: 'threat',
      portrait: FOLD_END,
      outcome: {
        key: 'bolts', tone: 'bad',
        title: 'REESE — HE FOLDS THE WRONG WAY',
        line: "The cash lands on the bar between you and something in his face closes. \"Buying a cop. You came to buy a cop with a stranger's money.\" He leaves fast, and he doesn't go home — he goes to a phone, and the number he dials belongs to DeLuca.",
        ripple: "No file. Reese runs to DeLuca: a stranger with money is asking about the district's secrets. DeLuca tightens everything and waits for you.",
        reflect: "I tried to buy a drowning man. He didn't want money — he wanted absolution, and I offered him a bribe. I read him exactly wrong.",
        heatDelta: 3,
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'reese', set: 1 }],
        campaign: { bonds: [{ id: 'reese', delta: -2 }], faction: { id: 'district', delta: -1 }, ledger: ['reese_bolts'] },
        debrief: { principle: 'loss-aversion',
          note: "You offered a **gain** — cash — to a man whose whole life now runs on not losing what's left of it: his badge, his freedom, his one shot at not being DeLuca's fall guy. A gain never outweighs a feared **loss**. Show a scared man what he stands to lose by staying quiet, not what he could pocket by talking." },
      },
    },
  ],
};
