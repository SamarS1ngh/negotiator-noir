import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene swaps
// like a webtoon as the words turn (the pier fire → your father's name → Pip's
// hurt hand → the branches → each ending its own image + mood).
const ESTABLISH = 'assets/art/scene/crew_establish.jpg';     // the pier, the crew, the drum fire
const APPROACH = 'assets/art/scene/crew_approach.jpg';       // you, alone, walking the long pier
const ENZO_BOTTLE = 'assets/art/scene/crew_enzo_bottle.jpg'; // Enzo not looking up, "pier's closed"
const ENZO_LOOKUP = 'assets/art/scene/crew_enzo_lookup.jpg'; // he looks up, slow — "Vidal"
const ENZO_ASK = 'assets/art/scene/crew_enzo_ask.jpg';       // "what do you want — for his sake"
const MC_PLEA = 'assets/art/scene/crew_mc_plea.jpg';         // "Ricci. I'm taking him down."
const ENZO_PUSHBACK = 'assets/art/scene/crew_enzo_pushback.jpg'; // "our necks on the block"
const PIP_INTRO = 'assets/art/scene/crew_pip_intro.jpg';     // Pip at the edge of the light
const PIP_OFFER = 'assets/art/scene/crew_pip_offer.jpg';     // Pip steps up, offers the tallies
const PIP_HIDE = 'assets/art/scene/crew_pip_hide.jpg';       // crew shifts to block your view of him
const ENZO_EXPLAIN = 'assets/art/scene/crew_enzo_explain.jpg'; // sets the bottle down, explains Pip
const MC_PRESS = 'assets/art/scene/crew_mc_press.jpg';       // "how long till it's your hand"
const ENZO_LIST = 'assets/art/scene/crew_enzo_list.jpg';     // "we're on some list"
const MC_WARN = 'assets/art/scene/crew_mc_warn.jpg';         // the Marlowe warning, delivered
const ENZO_FLAT = 'assets/art/scene/crew_enzo_flat.jpg';     // "you're buying us"
const MC_NUMBER = 'assets/art/scene/crew_mc_number.jpg';     // "everyone's got a number, Enzo"
const ENZO_SPIT = 'assets/art/scene/crew_enzo_spit.jpg';     // spits over the pier, the insult lands
const ALLY = 'assets/art/scene/crew_ally_end.jpg';           // Enzo's scarred hand, "for Tomas"
const MANIFESTS = 'assets/art/scene/crew_manifests_end.jpg'; // Pip slides the tallies across
const SPOOKED = 'assets/art/scene/crew_spooked_end.jpg';     // the crew stepping back, uneasy
const TIPPED = 'assets/art/scene/crew_tipped_end.jpg';       // Enzo, silent, already deciding to talk

// THE CREW — Big Enzo's loaders. They don't scare and they don't trust, but two
// things open them: your father put this crew to work the winter the docks froze
// and never called it back, and Ricci docked young Pip a day's pay for a hand
// Ricci's own rush job crushed. Money reads as an insult (they tip Ricci).
// Four endings, each bending the board differently:
//   ALLY      — they slow Ricci's cargo + feed you what they see (crew loyal)
//   MANIFESTS — Pip slips you a month of tallies (the ledger), but it draws eyes
//   SPOOKED   — they step back from Ricci uneasily (he sits rattled, doesn't know why)
//   TIPPED    — you misread them; they carry it to Ricci, who hardens
// THE WOVEN READ: before you say a word, you judge what's actually holding this
// crew to Ricci's cargo they hate — a debt, fear, or a price. The true read (a
// debt owed to your father, never called in) opens straight onto the strong
// approaches in their natural order; a wrong read (fear, or a price) still
// reaches every approach, just foregrounds the weaker ones and costs you a beat
// of misjudging them first.
// THE COMPLICATION: on the name path, Enzo's ear is barely yours when a lookout
// whistles — one of Ricci's men, walking the pier. A choice under pressure
// (go still / talk past it / meet him) before the scene rejoins the same
// stand/slow/proof fork into the same three endings.
export const CREW_MISSION: Mission = {
  id: 'crew_mission',
  actionId: 'crew_spook',
  nodeId: 'crew',
  label: 'Work the crew',
  palette: 'crew',
  scene: 'assets/art/scene/crew.jpg',
  teaches: ['reciprocity', 'types-and-tells', 'loss-aversion', 'interests-not-positions'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: 'The crew drinks at the end of the pier when the whistle blows. Big Enzo runs them — bad back, worse temper, a long memory. They move Ricci\'s cargo. They also hate what it costs them.' },
        { who: 'you', caption: true, art: APPROACH, text: "They don't scare and they don't trust. But there are a couple of names that might open the door." },
        { who: 'them', art: ENZO_BOTTLE, text: "(not looking up from his bottle) Pier's closed to suits and to cops. You're one or the other." },
      ],
      ask: "Enzo's not looking at you yet — but the pier, the fire, and a crew that's never once walked off cargo it hates already told you something. What's your read: what's really keeping them on Ricci's line?",
      choices: [
        { id: 'read_debt', label: "Loyalty to something older than this job — a debt nobody's called in yet.", tone: 'disarm', to: 'r_debt' },
        { id: 'read_fear', label: "Fear. Ricci — or somebody worse — has this pier watched.", tone: 'press', to: 'r_fear' },
        { id: 'read_price', label: "A price. Everyone hauling this cargo is just waiting on a bigger number.", tone: 'bribe', to: 'r_price' },
      ],
    },

    // --- THE WOVEN READ: what you decide is actually holding this crew ---
    {
      id: 'r_debt',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ENZO_BOTTLE, text: "You watch his hands, not his face — thick knuckles wrapped around the bottle, not balled into fists, and he hasn't once glanced at the others for backup. A scared man watches the room. A bought man watches your hands for cash. Enzo's studying your face like he's trying to place it. That's not fear. That's a debt trying to remember whose son you are." },
      ],
      ask: "You know what's actually holding this crew before you've said a word. How do you open on it?",
      choices: [
        { id: 'name', label: "The name — 'My father was Tomas Vidal. He carried this crew through the frozen winter.'", tone: 'disarm', to: 'n1' },
        { id: 'grievance', label: "The wound — 'Ricci docked Pip a day for a hand his own rush job crushed.'", tone: 'press', to: 'g1' },
        { id: 'rumor', label: "The fear — 'Marlowe's cleaning house. Men who stand near Ricci get swept.'", tone: 'press', to: 'r1' },
        { id: 'money', label: 'The cash — \'There\'s money in walking off Ricci\'s jobs.\'', tone: 'bribe', to: 'm1' },
      ],
    },
    {
      id: 'r_fear',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: "You clock how quiet the whole crew went the second you stepped into the firelight, and decide this is a pier that's already been warned to behave. Then Enzo doesn't drop his voice. Doesn't check who's in earshot. A frightened man watches the shadows. Enzo's not watching anything but you." },
      ],
      ask: "If it's fear, lean too hard and a rattled crew turns ugly or clams up for good. How do you open, knowing that?",
      choices: [
        { id: 'rumor', label: "The fear — 'Marlowe's cleaning house. Men who stand near Ricci get swept.'", tone: 'press', to: 'r1' },
        { id: 'money', label: 'The cash — \'There\'s money in walking off Ricci\'s jobs.\'', tone: 'bribe', to: 'm1' },
        { id: 'name', label: "The name — 'My father was Tomas Vidal. He carried this crew through the frozen winter.'", tone: 'disarm', to: 'n1' },
        { id: 'grievance', label: "The wound — 'Ricci docked Pip a day for a hand his own rush job crushed.'", tone: 'press', to: 'g1' },
      ],
    },
    {
      id: 'r_price',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: APPROACH, text: "Loaders working a wage they hate — you decide this is a crew with a price, same as any other. Then Enzo doesn't so much as glance at your hands, doesn't blink at the idea of money before you've even offered it. A mercenary crew looks for the number first. Nobody here's looking for it." },
      ],
      ask: "If it's about price, careful — you can always be outbid, and insulting a proud man costs more than it buys. How do you open, knowing that?",
      choices: [
        { id: 'money', label: 'The cash — \'There\'s money in walking off Ricci\'s jobs.\'', tone: 'bribe', to: 'm1' },
        { id: 'rumor', label: "The fear — 'Marlowe's cleaning house. Men who stand near Ricci get swept.'", tone: 'press', to: 'r1' },
        { id: 'name', label: "The name — 'My father was Tomas Vidal. He carried this crew through the frozen winter.'", tone: 'disarm', to: 'n1' },
        { id: 'grievance', label: "The wound — 'Ricci docked Pip a day for a hand his own rush job crushed.'", tone: 'press', to: 'g1' },
      ],
    },

    // --- name: your father's goodwill ---
    {
      id: 'n1',
      mood: 'warm',
      beats: [
        { who: 'them', art: ENZO_LOOKUP, text: '(looks up now, slow) …Vidal. The chandler. He put my whole crew on the winter the harbor froze and never asked a cent back.' },
        { who: 'them', art: ENZO_ASK, text: "So. Tomas Vidal's kid, on my pier. What do you want — for his sake?" },
        { who: 'you', art: MC_PLEA, text: "Ricci. I'm taking him down. I need the docks to look the other way when it comes." },
        { who: 'them', art: ENZO_PUSHBACK, text: "(a sharp two-note whistle cuts the dark — the youngest loader, posted up the pier as lookout, jabbing a finger back the way you came) Enzo — someone's coming. Walking like one of Ricci's." },
      ],
      ask: "Ricci's man could be on top of you inside a minute, and the whole crew's gone still. What do you do?",
      choices: [
        { id: 'still', label: "Go still — let the dark and the crowd swallow you.", tone: 'disarm', to: 'n1_still' },
        { id: 'talk', label: "Keep talking, loud and easy — like there's nothing here worth a second look.", tone: 'press', to: 'n1_talk' },
        { id: 'meet', label: "Walk out to meet him before he reaches the fire.", tone: 'push', to: 'n1_meet' },
      ],
    },

    // --- THE COMPLICATION: the scene turns, then rejoins the same fork ---
    {
      id: 'n1_still',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: APPROACH, text: "You don't move, don't blink. The whistle fades and the shape at the far end of the pier keeps walking — one of Ricci's runners, not slowing, gone past the warehouses into the dark. Close. Not close enough to matter." },
      ],
      ask: "The danger's passed, and Enzo's still watching you close. You've still got their ear on your father's name — how do you cash it in?",
      choices: [
        { id: 'stand', label: "Ask them to stand with you, openly.", tone: 'push', to: 'n2' },
        { id: 'slow', label: "Ask only that they slow his cargo — quietly.", tone: 'disarm', to: 'o_ally' },
        { id: 'proof', label: "Ask for the shipping manifests — proof.", tone: 'disarm', to: 'n_pip' },
      ],
    },
    {
      id: 'n1_talk',
      mood: 'tense',
      beats: [
        { who: 'you', art: MC_PLEA, text: '(loud, easy, like it costs you nothing) "Just admiring the fire, that\'s all."' },
        { who: 'you', caption: true, art: MC_PLEA, text: "The runner's stride doesn't break — he clocks the crowd around the drum, decides there's nothing here worth a second look, and walks on. Enzo's watching you now the way you watch a man who just palmed a card." },
      ],
      ask: "You bought the room back — and you've still got their ear on your father's name. How do you cash it in?",
      choices: [
        { id: 'stand', label: "Ask them to stand with you, openly.", tone: 'push', to: 'n2' },
        { id: 'slow', label: "Ask only that they slow his cargo — quietly.", tone: 'disarm', to: 'o_ally' },
        { id: 'proof', label: "Ask for the shipping manifests — proof.", tone: 'disarm', to: 'n_pip' },
      ],
    },
    {
      id: 'n1_meet',
      mood: 'threat',
      beats: [
        { who: 'you', art: APPROACH, text: "You're already walking toward the dark before anyone can stop you —" },
        { who: 'you', caption: true, art: APPROACH, text: "— and it's nobody. A dockhand cutting through on his way home, gone without a glance at the fire. Enzo's face doesn't ease up; if anything, you've just told him something about yourself he didn't know before." },
      ],
      ask: "Nothing came of it, but you've shown Enzo a side of yourself. You've still got their ear on your father's name — how do you cash it in?",
      choices: [
        { id: 'stand', label: "Ask them to stand with you, openly.", tone: 'push', to: 'n2' },
        { id: 'slow', label: "Ask only that they slow his cargo — quietly.", tone: 'disarm', to: 'o_ally' },
        { id: 'proof', label: "Ask for the shipping manifests — proof.", tone: 'disarm', to: 'n_pip' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: ENZO_PUSHBACK, text: "Stand with you? Openly? Against Ricci, for a dead man's boy? That's our necks on the block, not yours." },
      ],
      ask: "You asked for too much. Pull back, or lean on the debt to your father?",
      choices: [
        { id: 'pull', label: "Pull back — 'Then just slow him down. That's all I need.'", tone: 'disarm', to: 'o_ally' },
        { id: 'guilt', label: "Lean on it — 'He'd have stood for you. Every one of you.'", tone: 'push', to: 'o_spooked' },
      ],
    },
    {
      id: 'n_pip',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: PIP_INTRO, text: 'A young loader with a splinted hand hangs at the edge of the light. Pip.' },
        { who: 'them', art: PIP_OFFER, text: "(quiet, stepping up) I keep the tallies. Ricci docked me a day for this hand. …If it hurts him, I've got a month of his numbers." },
      ],
      ask: "Pip's offering the manifests — scared, and angry enough to risk it. What do you do with the boy?",
      choices: [
        { id: 'protect', label: "Protect him — 'Only if it won't come back on you, Pip.'", tone: 'disarm', to: 'o_manifests' },
        { id: 'grab', label: "Take them fast — 'Give me the book. Now, before Enzo changes his mind.'", tone: 'push', to: 'o_manifests' },
        { id: 'overpromise', label: "Overpromise — 'Do this and you'll never load another crate.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- grievance: Pip's hand ---
    {
      id: 'g1',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: PIP_HIDE, text: "The kid can't be seventeen. He keeps the splinted hand tucked behind his back like it shames him — and when I glance his way, the whole crew shifts, quiet, to block my view of him." },
        { who: 'them', art: ENZO_EXPLAIN, text: "(follows my eyes, sets the bottle down) Pip. Good kid. Fast hands — was. Ricci's rush job took three fingers, then Ricci docked him a day for 'improper handling.' We look after our own down here. Nobody else does." },
        { who: 'you', art: MC_PRESS, text: "A man who bleeds you and calls it your fault. How long till it's your hand, Enzo? Your day?" },
      ],
      ask: "The resentment's lit. Where do you aim it?",
      choices: [
        { id: 'atRicci', label: "At Ricci — 'Slow his cargo. Make the man sweat.'", tone: 'disarm', to: 'o_ally' },
        { id: 'atMarlowe', label: "At Marlowe — 'Word is the boss is already cleaning house.'", tone: 'press', to: 'r1' },
        { id: 'atPay', label: "At their wages — 'I'll make it worth more than Ricci pays.'", tone: 'bribe', to: 'm1' },
      ],
    },

    // --- rumor: fear of Marlowe ---
    {
      id: 'r1',
      mood: 'fear',
      beats: [
        { who: 'them', art: ENZO_LIST, text: "Cleaning house. You're saying we're on some list." },
        { who: 'you', art: MC_WARN, text: "I'm saying when Marlowe swings, anyone standing too close to Ricci is standing in the wrong place." },
      ],
      ask: "Fear's in the air now. Seal it, or overplay your hand?",
      choices: [
        { id: 'seal', label: "Seal it — 'Step back from his jobs. Quietly. That's all.'", tone: 'disarm', to: 'o_spooked' },
        { id: 'over', label: "Overplay — 'Unless you throw in with me first. Then you're covered.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- money: the insult ---
    {
      id: 'm1',
      mood: 'cold',
      beats: [
        { who: 'them', art: ENZO_FLAT, text: "(flat) You're buying us. Off Ricci's jobs. With what — a stranger's roll." },
        { who: 'you', art: MC_NUMBER, text: "Everyone's got a number, Enzo." },
        { who: 'them', art: ENZO_SPIT, text: "(spits over the pier) Ricci pays regular. And Ricci's here. You're a dead man's name and a fat mouth." },
      ],
      ask: "The money landed like a slap. Recover, or double down?",
      choices: [
        { id: 'recover', label: "Recover — 'Forget the money. This is Pip. This is your father's friend.'", tone: 'disarm', to: 'o_spooked' },
        { id: 'double', label: "Double down — 'Name your price, then. Everyone breaks.'", tone: 'push', to: 'o_tipped' },
      ],
    },

    // --- endings ---
    {
      id: 'o_ally',
      mood: 'warm',
      portrait: ALLY,
      outcome: {
        key: 'ally', tone: 'good',
        title: 'THE CREW — WITH YOU',
        line: "Enzo spits over the pier and puts out a scarred hand. 'For Tomas. We'll slow the bastard's cargo and tell you what we see. Quiet-like.'",
        ripple: "Ricci's shipments start running late and his own men won't meet his eye. He'll sit down rattled — and half-blind.",
        reflect: "They stood with me for my father's name. I hope I'm still worth that name when this is finished.",
        grants: ['crewSpooked', 'crewLoyal'],
        dispositions: [{ nodeId: 'crew', set: 4 }],
        campaign: { bonds: [{ id: 'crew', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['crew_ally'] },
        debrief: { principle: 'reciprocity',
          note: "Enzo didn't need paying — he needed the winter your father carried this crew through called back to mind. You didn't buy loyalty; you reminded him a debt was still open, and he closed it himself. That's **reciprocity**: an old kindness, unspent, outweighs new cash every time." },
      },
    },
    {
      id: 'o_manifests',
      mood: 'hope',
      portrait: MANIFESTS,
      outcome: {
        key: 'manifests', tone: 'good',
        title: "THE MANIFESTS — PIP'S GIFT",
        line: "Pip slides you a month of tallies with his good hand. 'Make it count,' he says. 'For the day he took off me.'",
        ripple: "You hold hard proof of everything moving through Ricci's docks. But a loader asking after the book gets noticed — his people start watching the paper.",
        reflect: "I'm spending a crippled kid's courage to hurt the man who crippled him. I tell myself it's for something bigger than me. I'll have to keep telling myself that.",
        grants: ['ledger'],
        worldFlags: ['ricciForewarned'],
        dispositions: [{ nodeId: 'crew', set: 3 }],
        campaign: { bonds: [{ id: 'crew', delta: 1 }, { id: 'pip', delta: 2 }], faction: { id: 'docks', delta: 1 }, ledger: ['crew_manifests', 'pip_helped'] },
        debrief: { principle: 'types-and-tells',
          note: "Pip wasn't a scared kid to be managed or Enzo's property to protect — he was a wounded young man who needed his hand to have meant something. You read past the fear on the surface to what kind of man he actually is, and let him keep the choice while easing Enzo's worry too. That's reading the **type** underneath, not just the tell on the face." },
      },
    },
    {
      id: 'o_spooked',
      mood: 'cold',
      portrait: SPOOKED,
      outcome: {
        key: 'spooked', tone: 'mixed',
        title: 'THE CREW — STEPPING BACK',
        line: "They don't throw in with you. But by morning they're finding reasons not to be near Ricci's cargo. Uneasy. Watching you almost as close as him.",
        ripple: "Ricci feels the cold shoulder from his own crew and can't say why. He'll sit down tense.",
        reflect: "Fear worked. Fear always works. That's the part that's starting to scare me.",
        grants: ['crewSpooked'],
        dispositions: [{ nodeId: 'crew', set: 2 }],
        campaign: { bonds: [{ id: 'crew', delta: -1 }], faction: { id: 'docks', delta: 1 }, ledger: ['crew_spooked'] },
        debrief: { principle: 'loss-aversion',
          note: "You didn't offer them a single thing to gain. You showed them what Marlowe's housecleaning could cost men who stand too close to Ricci, and they stepped back to protect the little safety they've got. That's **loss aversion**: the fear of losing what you have moves people harder than the promise of winning more — and it works on you a little too, every time you reach for it." },
      },
    },
    {
      id: 'o_tipped',
      mood: 'threat',
      portrait: TIPPED,
      outcome: {
        key: 'tipped', tone: 'bad',
        title: 'THE CREW — THEY TIP HIM',
        line: 'Enzo listens, nods, says nothing. Within the hour Ricci knows a stranger has been on his pier, buying his men.',
        ripple: "No help here. Ricci hears someone's circling his people — and hardens against you.",
        reflect: "I tried to buy men who can't be bought. My father would have led with the boy's hand, not a roll of cash. I'm learning the wrong lessons fast.",
        heatDelta: 3,
        worldFlags: ['ricciHardened'],
        dispositions: [{ nodeId: 'crew', set: 1 }],
        campaign: { bonds: [{ id: 'crew', delta: -2 }], faction: { id: 'docks', delta: -1 }, ledger: ['crew_tipped'] },
        debrief: { principle: 'interests-not-positions',
          note: "Whether it was cash on the ledger, a threat dressed as a warning, or brushing past what Enzo was actually guarding — you answered a **position** (a price, a warning, a request) and missed the **interest** underneath it (respect, an old debt, a boy's safety). Trade to the position instead of the interest, and the table turns on you." },
      },
    },
  ],
};
