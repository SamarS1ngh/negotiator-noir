import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the terrace → the tell → the read forks →
// the trade → the elevator → each ending its own image + mood).
const BASE = 'assets/art/scene/sable.jpg';                  // wide: Cassar's penthouse, the party dead, city lights past the glass
const SMOKE = 'assets/art/scene/sable_smoke.jpg';           // Sable alone on the terrace, cigarette, utterly unbothered
const GREET = 'assets/art/scene/sable_greet.jpg';           // you, crossing the room toward her, on purpose
const STILL = 'assets/art/scene/sable_still.jpg';           // the tell — the bored mask drops for half a second
const BORED = 'assets/art/scene/sable_bored.jpg';           // the wrong read: rings, silk, a fortune already on her wrist
const FLINCH = 'assets/art/scene/sable_flinch.jpg';         // the wrong read: she doesn't flinch at Cassar's name — she rolls her eyes
const TRADE = 'assets/art/scene/sable_trade.jpg';           // you offer her something Cassar never has — leverage of her own
const WARM = 'assets/art/scene/sable_warm.jpg';             // she warms — "nobody's offered me an exit before, only a price"
const NAME = 'assets/art/scene/sable_name.jpg';             // "Vidal" stops her cold
const MEMORY = 'assets/art/scene/sable_memory.jpg';         // her memory — Cassar, the Commissioner, "the Vidal business," over cigars
const STUNG = 'assets/art/scene/sable_stung.jpg';           // the warmth drains — you leaned on the one soft thing
const WARN = 'assets/art/scene/sable_warn.jpg';             // a warning, not yet a refusal — the mask goes glass-flat
const CASH = 'assets/art/scene/sable_cash.jpg';             // a folded bill, a bracelet — offered like she's for sale
const COLD = 'assets/art/scene/sable_cold.jpg';             // she's not tempted, she's insulted — and filing you under a type
const ELEVATOR = 'assets/art/scene/sable_elevator.jpg';     // THE COMPLICATION: the private elevator numbers climbing, too early
const COVER = 'assets/art/scene/sable_cover.jpg';           // she decides, fast, whether to hide you or brazen it out
const RETURN = 'assets/art/scene/sable_return.jpg';         // Cassar gone to bed, she comes back and just studies you
const TURNED_END = 'assets/art/scene/sable_turned_end.jpg'; // she talks — the Commissioner, the Senator, all of it
const WARY_END = 'assets/art/scene/sable_wary_end.jpg';     // a hedged name, the tab settled, the door easing shut
const BURNED_END = 'assets/art/scene/sable_burned_end.jpg'; // she's already lifting the house phone to Cassar's line

// SABLE — Cassar's mistress, and the only person in that penthouse the upriver
// names actually forget to watch themselves around. Sharp, bored, chronically
// underestimated: powerful men talk business in front of her the way they'd talk
// in front of a lamp, and twenty minutes of listening to the Commissioner's
// cigars-and-brandy circle has taught her more about who really owns this city
// than Cassar's own ledgers ever could. She is not a mark being cracked; she's a
// woman doing her own quiet arithmetic on how to stop being furniture. She trades
// in value for value and prizes exactly one thing above money — not being OWNED.
// Bully her and she's spent her whole adult life being bullied by men with real
// power, so yours won't register as new. Buy her cheap and you insult her twice —
// once by assuming she has a price, once by assuming it's small. Offer her
// something Cassar can't — leverage that's actually hers, a door out that isn't
// his to close — and she'll open like nobody's asked her a real question in years.
// Setting: Cassar's penthouse well after the party's officially over, cigarette
// smoke gone stale, champagne gone flat and warm in abandoned glasses, the city
// spread out cold and gold through floor-to-ceiling glass.
// THE WOVEN READ: before you say a real word, you have to decide what she actually
// IS from the ten seconds after you cross the room — the bored mask, the rings,
// the way her eyes don't move when Cassar's name comes up. The true read (a
// broker in her own right, underestimated on purpose, who wants a way out that's
// hers) opens the strong approaches; misreading her as bought-and-paid-for or
// as a frightened trophy still reaches every approach, but foregrounds the ones
// guaranteed to cost you.
// THE COMPLICATION: mid-conversation, the private elevator panel by the door
// starts climbing — Cassar, home hours early. The real test isn't whether you can
// hide. It's whether Sable decides, in the two seconds she has to choose, that
// you're worth covering for — and whether you give her a reason to regret it.
// Three endings: TURNED — the full upriver names (the Commissioner, the Senator)
// and a woman who now owes YOU discretion, not the other way around; WARY — the
// same names, hedged and transactional, a source who stays a stranger; BURNED —
// she decides you're not worth the risk and puts the house phone to her ear
// before you've even reached the elevator.
// Palette 'vera' (reused) lights the penthouse in the same jazzy magenta-and-gold
// wash as the club — money and discretion look the same under the right light.
export const SABLE_MISSION: Mission = {
  id: 'sable_mission',
  actionId: 'sable_turn',
  nodeId: 'sable',
  label: "Work Cassar's mistress",
  palette: 'vera',
  scene: 'assets/art/scene/sable.jpg',
  teaches: ['information-asymmetry', 'reciprocity'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BASE, text: "Cassar's penthouse, an hour past when the last of his guests should have left. Champagne gone flat in a dozen abandoned glasses, the band's sheet music still on the stands, the city laid out cold and gold through glass that costs more than most people's houses. Everyone left the same way — past a woman on the terrace nobody said goodnight to." },
        { who: 'you', caption: true, art: SMOKE, text: "Sable. Cassar's mistress for three years, on his arm at every dinner where the men who wash the docks' money talk to the men who protect it. Nobody at those dinners has ever once lowered their voice for her. That's either very stupid of them, or very useful for her." },
        { who: 'them', art: SMOKE, text: "(not turning, cigarette trailing smoke into the cold air) The party's over. You're either lost, or you're the kind of lost that walks in on purpose. Cassar's men would already have you on the elevator if you were actually a problem, so — which is it." },
        { who: 'you', art: GREET, text: "On purpose. I need something only you'd know." },
        { who: 'them', art: STILL, text: "(the bored mask drops, just for half a second, before it slides back on) Everyone who's ever said that sentence to me thought they'd discovered something. Sit. Before one of the staff decides you're worth mentioning to him." },
      ],
      ask: "She never asked who let you up. Never blinked at 'need.' The only thing that moved in ten seconds was that half-second where the boredom cracked — right when you said only you'd know. You have to decide what she actually is before you say another word.",
      choices: [
        { id: 'read_broker', label: "A broker in her own right, playing bored on purpose. She trades value for value — that crack was interest, not fear.", tone: 'disarm', to: 'r_broker' },
        { id: 'read_forsale', label: "A kept woman with three years of Cassar's money on her fingers. She has a price like everyone in this room. Find it.", tone: 'bribe', to: 'r_forsale' },
        { id: 'read_scared', label: "A trophy who knows exactly what happens to women who cross a man like Cassar. Whatever that was, it was fear — and fear negotiates cheap.", tone: 'press', to: 'r_scared' },
      ],
    },

    // --- THE WOVEN READ: what you decide she truly is, before you say more ---
    {
      id: 'r_broker',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: STILL, text: "Every man in this penthouse has spent three years talking past her like she's part of the furniture, and she's let every one of them believe it. That's not boredom you saw crack. That's a woman who noticed you're the first person tonight who didn't. She isn't scared, and she isn't shopping. She's deciding whether you're worth the trouble of being seen." },
      ],
      ask: "You're not here to buy her and you're not here to scare her — you're here to offer an equal something Cassar never has. How do you open that?",
      choices: [
        { id: 'disarm', label: "Put something real on the table — not cash, leverage that's actually hers.", tone: 'disarm', to: 't1' },
        { id: 'name', label: "Quietly — 'My name's Vidal. Tomas Vidal was my father.'", tone: 'disarm', to: 'n1' },
        { id: 'press', label: "Push — 'You've heard the Commissioner's name over cigars more than once. Give me the names.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set a folded bill and a bracelet on the table between you.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: BORED, text: "You clock the rings, the silk, a bracelet worth more than most men on the docks make in a year, and decide: a woman kept this well got there by knowing her price and naming it early. Then you notice she's still wearing last season's — while Cassar's own wife wears this year's stones two rooms over at every one of these things. That's not a woman still shopping for a bigger number." },
      ],
      ask: "Misprice a woman like this as a woman with a price and you'll spend the whole night hunting a number that was never the point. What do you actually do?",
      choices: [
        { id: 'bribe', label: 'Set a folded bill and a bracelet on the table between you.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Push — 'You've heard the Commissioner's name over cigars more than once. Give me the names.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Put something real on the table — not cash, leverage that's actually hers.", tone: 'disarm', to: 't1' },
        { id: 'name', label: "Quietly — 'My name's Vidal. Tomas Vidal was my father.'", tone: 'disarm', to: 'n1' },
      ],
    },
    {
      id: 'r_scared',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: FLINCH, text: "You decide three years under a man like Cassar must have taught her real fear, and fear negotiates cheap. Then you drop his name mid-thought, testing her — and she doesn't flinch. She rolls her eyes, the exact look of a woman who's heard that name used to intimidate people for so long it's stopped landing. That's not a woman bracing for a threat. That's a woman who stopped being afraid of him a long time before you walked in." },
      ],
      ask: "Push a woman like that expecting her to fold and you'll learn exactly how little Cassar's name means to her — and exactly how much yours is about to. What do you do instead?",
      choices: [
        { id: 'press', label: "Push — 'You've heard the Commissioner's name over cigars more than once. Give me the names.'", tone: 'press', to: 'p1' },
        { id: 'name', label: "Quietly — 'My name's Vidal. Tomas Vidal was my father.'", tone: 'disarm', to: 'n1' },
        { id: 'disarm', label: "Put something real on the table — not cash, leverage that's actually hers.", tone: 'disarm', to: 't1' },
        { id: 'bribe', label: 'Set a folded bill and a bracelet on the table between you.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the trade: value for value, not ownership ---
    {
      id: 't1',
      mood: 'warm',
      beats: [
        { who: 'you', caption: true, art: TRADE, text: "You don't ask for anything first. You lay out what you actually have — a name on a shell account, a route through a lawyer, something small and true that gives HER a lever on Cassar she didn't have an hour ago. Not a gift. Not a bribe. A tool, hers to keep, whether she gives you anything back or not." },
        { who: 'them', art: WARM, text: "(turns it over slowly, like it might still be a trick) Huh. Three years of men in this apartment, and you're the first one who's offered me an exit instead of a price. (a long look, the first real one) All right. Ask your question. But ask it knowing I decide how much of the answer you get." },
      ],
      ask: "She's actually listening now — but respect costs patience. Give her room to decide what she owes you, or press while the door's open?",
      choices: [
        { id: 'reassure', label: "Take your time. I'm not going anywhere tonight.", tone: 'disarm', to: 'turn' },
        { id: 'hurry', label: "There isn't time for that. I need this now.", tone: 'push', to: 'o_wary' },
      ],
    },

    // --- the name: a memory she wasn't supposed to be listening to ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', art: NAME, text: "(goes very still) Vidal. (a beat) I've heard that name. Cassar and the Commissioner, over cigars, maybe eight months back — 'the Vidal business,' one of them called it, like it was a spill somebody'd already mopped up." },
        { who: 'you', art: GREET, text: 'You remember that.' },
        { who: 'them', art: MEMORY, text: "(something colder now, more precise) I remember everything they say in front of me. It's the one advantage of being furniture — nobody edits themselves for the lamp. I just never had a reason to care what it meant. Until now, apparently." },
      ],
      ask: "She's just handed you something she didn't have to — a memory from a room you'll never get into any other way. Build on it, or use it?",
      choices: [
        { id: 'bond', label: "Then help me finish what that room started.", tone: 'disarm', to: 'turn' },
        { id: 'leverage', label: "Then you owe him an answer. And you owe me one too — the names, now.", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the precision curdles into something flatter, older) …There it is. For a second I thought you were different from every man who's ever decided the one real thing I said to them was a debt to collect." },
      ],
      ask: "You just proved every wall she keeps up is worth keeping. Pull back, or take what the leverage still buys you?",
      choices: [
        { id: 'ease', label: "No. I'm sorry. Tell me because it's true, not because I made you.", tone: 'disarm', to: 'turn' },
        { id: 'take', label: "Just the names, Sable.", tone: 'push', to: 'o_wary' },
      ],
    },

    // --- press: a warning, not yet a refusal ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: WARN, text: "(the boredom goes glass-flat, no performance left in it at all) You don't push me for those names, sugar. Cassar I can handle — I've been handling him for three years. The men he answers to would end my whole life and call it a Tuesday. You are not worth that math yet. Convince me you could be." },
      ],
      ask: "That was a warning, not a refusal — she's still talking, which means the door's not shut. Back off, or push through it?",
      choices: [
        { id: 'easeoff', label: "Fair. I'm not here to make you do that math for a stranger.", tone: 'disarm', to: 'turn' },
        { id: 'pushfurther', label: "I don't have time for careful. Give me the names.", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money and jewelry insult her, don't move her ---
    {
      id: 'c1',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CASH, text: 'You set a folded bill and a bracelet on the table between you and watch them sit there, untouched.' },
        { who: 'them', art: COLD, text: "(glances at it, doesn't reach for it, something almost pitying crossing her face) Cassar buys me things like that every week — it's the leash, dressed up as a gift. You just handed me a smaller version of the exact thing I'm trying to get out from under. Every man who's tried to buy me first tried to buy somebody cheaper. It never worked on them either." },
      ],
      ask: "The money didn't scare her and it didn't tempt her — it just told her exactly what kind of man she's dealing with. Pull it back, or double down?",
      choices: [
        { id: 'retract', label: "You're right. Take it back — I don't know another way to ask, except honestly.", tone: 'disarm', to: 'turn' },
        { id: 'doubledown', label: "Everyone's got a number. Name yours.", tone: 'bribe', to: 'o_burned' },
      ],
    },

    // --- THE COMPLICATION: the elevator, and the two seconds she has to choose ---
    {
      id: 'turn',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ELEVATOR, text: "A soft chime, and the numbers over the private elevator start climbing from the lobby — far too early for the driver Cassar always sends ahead first. She's on her feet before the thought finishes forming in your head, cigarette already crushed out, every trace of bored gone from her face." },
        { who: 'them', art: COVER, text: "(low, fast, already deciding) He's not supposed to be back for two hours. You have about ten seconds to be someone I know, or Cassar has about ten seconds to have you thrown off this floor. Which is it going to be." },
        { who: 'you', caption: true, art: COVER, text: "She's not asking whether you can hide. She's asking whether she can afford to cover for you — and she has to decide before the doors open, on nothing but what she's seen of you so far." },
      ],
      ask: "The elevator's still climbing. What do you give her to work with?",
      choices: [
        { id: 'protect', label: "Steady, quiet — 'Whoever you need me to be. Your call.'", tone: 'disarm', to: 'aftermath' },
        { id: 'clock', label: "Let her see you clock exactly how much this costs her — she should know you understand the risk.", tone: 'press', to: 'aftermath' },
        { id: 'outloud', label: "So THIS is what Cassar's money actually buys — a woman running interference at midnight.", tone: 'push', to: 'o_burned' },
      ],
    },
    {
      id: 'aftermath',
      mood: 'tense',
      beats: [
        { who: 'them', art: RETURN, text: "(the elevator doors close again behind Cassar's own back a long while later, headed for bed instead of the terrace; she sinks back down, studying you before she says a word) You didn't oversell it and you didn't fall apart either. Most people do one or the other. That's either very good instincts, or exactly what I've spent three years learning to fake myself. Discretion." },
      ],
      ask: "This was never really about the elevator. It was about whether you'd cost her anything with what you just saw. What do you do with the trust she's handing you now?",
      choices: [
        { id: 'stayquiet', label: "Let her decide what to tell you, in her own time.", tone: 'disarm', to: 'o_turned' },
        { id: 'askdirect', label: "Then tell me straight — the Commissioner, the Senator, all of it.", tone: 'press', to: 'o_wary' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'SABLE — THE NAMES UPRIVER',
        line: "She lights a fresh cigarette and, for the first time all night, actually talks. The Commissioner and a state senator both sit on Cassar's books as silent partners — not depositors, owners, laundering their own take through the same wash as the dock cargo. \"That's everything I've got,\" she says, \"and more than I've given anyone in three years. You come back when you've actually got a way to burn this whole apartment down, and you'll find I remember exactly who offered me a door instead of a leash.\"",
        ripple: "You have the names that connect the Cassar Bank straight up to the Hall — and a woman inside Cassar's own house who now considers you worth more than his money.",
        reflect: "Vera taught me a favor costs nothing if it's real. Sable just taught me the same lesson from the other side of a gilded cage — the door out is worth more to her than anything Cassar's ever put on her wrist, and I was the first one who thought to offer it instead of another bar of it.",
        grants: ['upriverNames', 'sable_turned'],
        dispositions: [{ nodeId: 'sable', set: 4 }],
        campaign: { bonds: [{ id: 'sable', delta: 2 }], faction: { id: 'bank', delta: 1 }, ledger: ['sable_turned'] },
        debrief: { principle: 'reciprocity',
          note: "Sable didn't owe you anything when you sat down — every man in that penthouse had spent three years teaching her that nothing moves without a price attached. You gave her something real first, unprompted, that was hers to keep whether she gave you anything back or not. That's **reciprocity**: the pull to repay isn't triggered by a bribe, it's triggered by a genuine first move. You didn't buy the names upriver. You earned them, by being the one person all night who gave before asking." },
      },
    },
    {
      id: 'o_wary',
      mood: 'cold',
      portrait: WARY_END,
      outcome: {
        key: 'wary', tone: 'mixed',
        title: 'SABLE — A HEDGED NAME',
        line: "She gives you the names — the Commissioner, a state senator, both silent partners in Cassar's bank — but she says it like she's closing a tab, flat and already done with you. \"There. We're square. Don't come back expecting a second round on the house.\" The cigarette case stays shut. Whatever door was open a minute ago, you can feel it swinging back to its latch.",
        ripple: "You have the names that reach past Cassar to the Hall. You also have a source who'll deal with you strictly on the transaction from here — useful, careful, and never again quite as unguarded as she was tonight.",
        reflect: "I got what I came for. I didn't get the woman who could've kept giving me more than names, one careful conversation at a time. My father would have waited the extra minute for that.",
        grants: ['upriverLead'],
        dispositions: [{ nodeId: 'sable', set: 2 }],
        campaign: { bonds: [{ id: 'sable', delta: 0 }], ledger: ['sable_wary'] },
        debrief: { principle: 'information-asymmetry',
          note: "You've got two names now. Notice everything you still don't have: how the wire actually runs between them, what Cassar's told them about you, how much further this goes than a bank president's bedroom. Sable holds all of that. That gap between what you know and what she knows is **information asymmetry**, and tonight it stayed entirely hers — she gave you exactly enough to close the account, and kept the rest as the only leverage she has left over a man who could still end her with one phone call." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'SABLE — SHE CHOOSES CASSAR',
        line: "Whatever you spent — the names pushed for too hard, a second offer after the first landed wrong, or a careless line said one floor below a man who owns her whole life — it costs the same. She doesn't even raise her voice. She's already crossing to the house phone, dialing an internal line, when she looks back at you almost gently. \"You were a nice ten minutes,\" she says, \"but I've had three years to learn exactly which risks are worth my own neck. You weren't one of them.\"",
        ripple: "No names, no thread to the Hall — and Cassar now knows someone's been circling his own penthouse asking about the men upriver, before you've ever sat down across from him.",
        heatDelta: 2,
        worldFlags: ['cassarForewarned'],
        dispositions: [{ nodeId: 'sable', set: 0 }],
        campaign: { bonds: [{ id: 'sable', delta: -2 }], faction: { id: 'bank', delta: -1 }, ledger: ['sable_burned'] },
        reflect: "Cassar keeps her the way Marlowe keeps everyone — well-paid and completely owned. Tonight I asked her to risk the one thing she's spent three years protecting, and gave her nothing worth that math. She did exactly what I'd have done in her place.",
        debrief: { principle: 'reciprocity',
          note: "You never gave Sable anything real before you asked her to gamble Cassar's goodwill on you — you pushed, or you tried to buy her cheap, or you cost her more than you were worth in the ten seconds that mattered most. **Reciprocity** only runs if something moves first, freely, in good faith; you either skipped that step or spent it recklessly the moment it counted. She doesn't owe you discretion now. She owes Cassar three more years of being exactly as careful as this — and you just became the reason she has to prove it." },
      },
    },
  ],
};
