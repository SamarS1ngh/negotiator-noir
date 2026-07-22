import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the club → the tell → the read forks →
// the trade → the patron → each ending its own image + mood).
const BASE = 'assets/art/scene/vera.jpg';               // wide: the gold-lit club after hours, band packing up
const TAP = 'assets/art/scene/vera_tap.jpg';            // Vera behind the bar, cigarette case tapping a rhythm
const GREET = 'assets/art/scene/vera_greet.jpg';        // you, at the bar, on purpose
const STILL = 'assets/art/scene/vera_still.jpg';        // the tap stops — the tell
const FURS = 'assets/art/scene/vera_furs.jpg';          // the wrong read: the worn case, the diamonds she doesn't wear
const CALM = 'assets/art/scene/vera_calm.jpg';          // the wrong read: her eyes checking the room like furniture
const TRADE = 'assets/art/scene/vera_trade.jpg';        // you set the ledger page on the bar, not cash
const WARM = 'assets/art/scene/vera_warm.jpg';          // she warms — "somebody finally brought me something"
const NAME = 'assets/art/scene/vera_name.jpg';          // "Vidal" stops her cold
const MEMORY = 'assets/art/scene/vera_memory.jpg';      // her memory of Tomas's tab, paid down to the penny
const STUNG = 'assets/art/scene/vera_stung.jpg';        // the warmth drains — you leaned on the soft thing
const WARN = 'assets/art/scene/vera_warn.jpg';          // the case goes flat and silent — a warning, not yet a refusal
const CASH = 'assets/art/scene/vera_cash.jpg';          // a fold of bills set by her glass
const COLD = 'assets/art/scene/vera_cold.jpg';          // she looks almost sorry for you
const PATRON = 'assets/art/scene/vera_patron.jpg';      // the good coat crosses the floor, the room's temperature drops a degree
const BOOTH = 'assets/art/scene/vera_booth.jpg';        // she steers him to the private booth, warm and practiced
const RETURN = 'assets/art/scene/vera_return.jpg';      // she comes back, sits, and just watches you for a second
const TURNED_END = 'assets/art/scene/vera_turned_end.jpg'; // she talks — the first name upriver
const WARY_END = 'assets/art/scene/vera_wary_end.jpg';   // a guarded name, a colder distance
const BURNED_END = 'assets/art/scene/vera_burned_end.jpg'; // the door shuts, and stays shut

// VERA — the woman who owns the district's best nightclub, and the only person on
// this waterfront both the dock underworld and the powerful men UPRIVER (a police
// commissioner, a state senator — the ones who actually keep Marlowe's pipeline
// invisible) trust enough to leave a message with. Sharp, warm on the surface,
// unbought, a twenty-year survivor who trades in information and favors and has
// never once sold either. She is a RECURRING ally across Act II: treat her well
// here and she opens doors later; use her coldly and it costs you when you can
// least afford it. Working her is the first thread to who protects the empire
// from ABOVE — the conspiracy widening past Marlowe himself.
// THE WOVEN READ: before you say a real word, you judge what she actually IS from
// a single tell — a gold cigarette case she taps against the bar, a habit that
// stops dead the moment something matters to her. The true read (a broker who
// trades value for value, never bought, never bullied) opens the strong
// approaches with her attention, not her fear; misreading her as buyable or
// frightened still reaches every approach, but foregrounds the ones guaranteed to
// cost you.
// THE COMPLICATION: mid-conversation, a well-dressed man crosses the floor like
// he owns the deed and Vera steers him, warm and practiced, into a private booth
// — the Commissioner's office, you realize, keeps strange hours, and so does she.
// The real test isn't the man at all. It's whether you can be trusted with what
// you just saw, in a room built entirely on discretion.
// Three endings: TURNED — a name upriver, and a recurring ally who trusts you;
// WARY — the same name, hedged, and a source who stays a stranger; BURNED — you
// broke her one rule, and the fixer who could have bridged you to the men above
// Marlowe now has every reason to make sure no one else ever does either.
// Palette 'vera' lights the club in jazzy magenta stage-wash and brass-gold bar
// light; each beat's mood re-grades the room as the scene turns.
export const VERA_MISSION: Mission = {
  id: 'vera_mission',
  actionId: 'vera_turn',
  nodeId: 'vera',
  label: 'Work the fixer',
  palette: 'vera',
  scene: 'assets/art/scene/vera.jpg',
  teaches: ['information-asymmetry', 'triangulation', 'reciprocity'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BASE, text: "Everyone on the waterfront agreed on one thing about Vera's: it was the only room in the district where a dock boss and a police captain could drink at the same bar and neither would mention it in the morning. Twenty years she built that trust, one favor at a time, and never once sold it." },
        { who: 'you', caption: true, art: TAP, text: "My father's ledger has entries that don't end at the water. Somebody upriver keeps that cargo invisible — a badge, a bench, an office with a view of the harbor. If anyone on this whole waterfront knows who, it's the woman both sides trust enough to leave a message with." },
        { who: 'them', art: TAP, text: "(not looking up, a slim gold cigarette case tapping a slow four-count against the mahogany) Last call was twenty minutes ago. You're either lost, or you walked in on purpose, and you don't have the face of a man who gets lost." },
        { who: 'you', art: GREET, text: "On purpose. I need something only you'd know." },
        { who: 'them', art: STILL, text: "(the tapping stops, dead) Everyone who says that sentence to me thinks they're the first. Sit down before the bartender starts wondering why I haven't thrown you out." },
      ],
      ask: "She never asked your name, never blinked at 'need' — the only thing that's moved since you walked in is that case going still the second you said only you'd know. Twenty seconds of her, and you have to decide what she actually is before you say another word. What is she?",
      choices: [
        { id: 'read_broker', label: "A broker, not a mark. She trades value for value — that stillness is her attention, not her fear.", tone: 'disarm', to: 'r_broker' },
        { id: 'read_forsale', label: "A woman who built a palace on other people's secrets has a price for her own. Find it.", tone: 'bribe', to: 'r_forsale' },
        { id: 'read_scared', label: "She keeps dangerous men on both sides happy. Whatever that stillness was, it was fear — and fear negotiates cheap.", tone: 'press', to: 'r_scared' },
      ],
    },

    // --- THE WOVEN READ: what you decide she truly is, before you say more ---
    {
      id: 'r_broker',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: STILL, text: "That case doesn't stop for a threat and it doesn't stop for flattery — you'd bet money it doesn't stop for much at all. It stopped because you offered a trade and she's deciding if you're worth the other half of it. She isn't selling anything tonight, and she isn't scared of you. She's pricing you." },
      ],
      ask: "You're not here to buy her and you're not here to scare her — you're here to trade with her, as an equal, for something she'll actually value. How do you open that?",
      choices: [
        { id: 'disarm', label: "Put something real on the bar — not cash, worth.", tone: 'disarm', to: 't1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'disarm', to: 'n1' },
        { id: 'press', label: "Push — 'You know who really keeps this pipeline invisible. Give me a name.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set a fold of bills next to her glass.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_forsale',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: FURS, text: "You clock the marble bar, the chandelier, a small fortune in bottles behind her, and decide: everyone with a palace like this got there the same way, one price at a time. Then you notice the case itself — dented at one corner, carried years past when she could've upgraded it, while half the men she's pouring for wear watches that would buy this bar twice over. That's not a woman still doing the math on a bigger number." },
      ],
      ask: "Misprice a woman like this as a woman with a price and you'll spend the whole night hunting a number that doesn't exist. What do you actually do?",
      choices: [
        { id: 'bribe', label: 'Set a fold of bills next to her glass.', tone: 'bribe', to: 'c1' },
        { id: 'press', label: "Push — 'You know who really keeps this pipeline invisible. Give me a name.'", tone: 'press', to: 'p1' },
        { id: 'disarm', label: "Put something real on the bar — not cash, worth.", tone: 'disarm', to: 't1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'disarm', to: 'n1' },
      ],
    },
    {
      id: 'r_scared',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: CALM, text: "You decide the stillness was fear — a woman running both sides of this town must be terrified of the day she's caught between them, and fear negotiates cheap. Then her eyes flick, once, to a table of men built like longshoremen playing cards in the corner — not with worry, with the mild proprietary glance of a woman checking her own furniture is where she left it. That's not a woman bracing for a threat. That's a woman who owns the room, danger included." },
      ],
      ask: "Push a woman like that expecting her to fold and you'll learn exactly how many people in this room work for her, not against her. What do you do instead?",
      choices: [
        { id: 'press', label: "Push — 'You know who really keeps this pipeline invisible. Give me a name.'", tone: 'press', to: 'p1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal.'", tone: 'disarm', to: 'n1' },
        { id: 'disarm', label: "Put something real on the bar — not cash, worth.", tone: 'disarm', to: 't1' },
        { id: 'bribe', label: 'Set a fold of bills next to her glass.', tone: 'bribe', to: 'c1' },
      ],
    },

    // --- the trade: value for value ---
    {
      id: 't1',
      mood: 'warm',
      beats: [
        { who: 'you', caption: true, art: TRADE, text: "You don't ask for anything. You set it down instead — a page torn from your father's real ledger, the honest one nobody was ever supposed to find. A route. A date. Cargo that never existed anywhere except in his own hand. Something true, something that cost you to learn, and nothing she could have gotten from anyone else in the room tonight." },
        { who: 'them', art: WARM, text: "(turns the page over once, sets it down like it might still bite) Huh. Somebody finally brought me something instead of a hand out. (looks up — the first real look) All right. Ask your question. But ask it like you already know I might not answer, or don't ask it at all." },
      ],
      ask: "She's listening for real now — but respect costs patience. Give her time to decide what she owes you, or press while the door's open?",
      choices: [
        { id: 'reassure', label: "Take your time. I'm not going anywhere.", tone: 'disarm', to: 'turn' },
        { id: 'hurry', label: "There isn't time for that. I need this tonight.", tone: 'push', to: 'o_wary' },
      ],
    },

    // --- the name: a rare, unguarded memory ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', art: NAME, text: "(stops mid-motion, actually stops) Vidal. (a long pause, the case forgotten in her hand) Tomas Vidal ran the cleanest manifest on this waterfront and everybody down here knew it — which is exactly why nobody was surprised when Marlowe decided clean was a problem." },
        { who: 'you', art: GREET, text: 'You knew him.' },
        { who: 'them', art: MEMORY, text: "(something almost gentle) He ran a tab here he never once let go past a month. Paid it down to the penny every time — even the month before. (stops herself) Even the month everything happened to him. I remember thinking that man's honesty was going to get him killed one day. I didn't think I'd be right." },
      ],
      ask: "She's just handed you something rare — an actual, unguarded memory of him. Build on it, or use it?",
      choices: [
        { id: 'bond', label: "Then help me finish what he couldn't.", tone: 'disarm', to: 'turn' },
        { id: 'leverage', label: "Then you owe him. And you owe me. Give me what you gave him — but this time, with the name.", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the warmth drains out fast, replaced by something flatter, older) …There it is. For a second I thought you walked in here different from the rest. Everyone finds the one soft thing in this room eventually, and leans on it." },
      ],
      ask: "You just proved every wall she's ever built was worth building. Pull back, or take what the leverage still buys you?",
      choices: [
        { id: 'ease', label: "No. I'm sorry. Help me because it's true, not because I made you.", tone: 'disarm', to: 'turn' },
        { id: 'take', label: "Just the name, Vera.", tone: 'push', to: 'o_wary' },
      ],
    },

    // --- press: a warning, not yet a refusal ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: WARN, text: "(sets the case down flat on the bar, no more tapping — and for the first time you see exactly how much room she takes up when she isn't being charming) You don't push me for names, sugar. Not the docks', not the ones with badges, not the ones that sit in chambers with a gavel. Every man on that list can be replaced by a rumor I start over a bad drink. You cannot." },
      ],
      ask: "That was a warning, not a refusal — she's still talking to you, which means the door's not shut yet. Back off, or push through it?",
      choices: [
        { id: 'easeoff', label: "Fair. I'm not here to be another man who pushes you.", tone: 'disarm', to: 'turn' },
        { id: 'pushfurther', label: "I don't have time for careful. Give me the name.", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money wounds her, doesn't tempt her ---
    {
      id: 'c1',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CASH, text: 'You set a fold of bills by her glass and watch it sit there.' },
        { who: 'them', art: COLD, text: "(glances at it, doesn't touch it, and for a moment looks almost sorry for you) That's real money. Somewhere in this district that's exactly the wrong amount, in front of exactly the wrong woman. Every man who's ever tried to buy me first tried to buy somebody cheaper. It never once worked on them either." },
      ],
      ask: "The money didn't scare her, and it didn't tempt her — she just filed you under a type she's seen a hundred times. Pull it back, or double down?",
      choices: [
        { id: 'retract', label: "You're right. Forget the money — I don't know another way to ask, except honestly.", tone: 'disarm', to: 'turn' },
        { id: 'doubledown', label: "Everyone's got a number. Name yours.", tone: 'bribe', to: 'o_burned' },
      ],
    },

    // --- THE COMPLICATION: the real test, dressed as a stranger crossing the floor ---
    {
      id: 'turn',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: PATRON, text: "The front doors swing before the doorman can announce anybody, and the whole room's temperature drops a degree without anyone visibly reacting. A man in a good coat and better shoes crosses the floor like he owns the deed — and the way the bandleader nods at him without missing a bar tells you he might as well." },
        { who: 'them', art: BOOTH, text: "(already moving, warm and practiced, a hand light on his elbow, steering him toward a private booth in back before he can so much as ask; over her shoulder, low, just for you) Commissioner's office keeps strange hours. So do I. Sit tight." },
        { who: 'you', caption: true, art: BOOTH, text: "You watch her seat a man who runs half the badges in this city like an old friend she's genuinely fond of — because, watching them laugh at something you can't hear, she probably is." },
      ],
      ask: "You just saw exactly who Vera answers to when the docks don't — and she knows you saw it. What she does next depends entirely on what you do with it.",
      choices: [
        { id: 'protect', label: "Keep talking like the room didn't just tilt. Whatever you saw, you didn't.", tone: 'disarm', to: 'aftermath' },
        { id: 'clock', label: "Let your eyes linger on the booth a beat too long — let her know you clocked him.", tone: 'press', to: 'aftermath' },
        { id: 'outloud', label: "So that's the Commissioner. Buys his gin where the dock money launders, does he.", tone: 'push', to: 'o_burned' },
      ],
    },
    {
      id: 'aftermath',
      mood: 'tense',
      beats: [
        { who: 'them', art: RETURN, text: "(sliding back onto her stool a long while later, unreadable, studying you before she says a word) You didn't say anything. Most people can't help themselves — they either pretend so hard it's obvious, or they can't resist showing me how clever they are for noticing. You did neither. That's either very good manners, or exactly what I've traded in my whole life. Discretion." },
      ],
      ask: "This was never really about the Commissioner. It was about whether you'd spend what you saw. What do you do with the trust she's handing you now?",
      choices: [
        { id: 'stayquiet', label: "Let her decide what to tell you, in her own time.", tone: 'disarm', to: 'o_turned' },
        { id: 'askdirect', label: "Then tell me straight — is it the Commissioner, or someone he answers to?", tone: 'press', to: 'o_wary' },
      ],
    },

    // --- endings ---
    {
      id: 'o_turned',
      mood: 'warm',
      portrait: TURNED_END,
      outcome: {
        key: 'turned', tone: 'good',
        title: 'VERA — THE FIRST NAME UPRIVER',
        line: "She lights a cigarette from that case for the first time all night, and talks. The Commissioner's office has been sitting on Marlowe's pipeline for years — not blind to it, invested in it, right alongside a state senator who never once has to touch the money himself. \"That's as far as I'll take you tonight,\" she says, \"but you come back sober and polite, you'll find I remember exactly who brought me something real instead of a hand out.\"",
        ripple: "You have the first name that answers 'who protects this from above' — and a woman with rooms full of secrets on both sides of the water now considers you worth talking to again.",
        reflect: "Sal gave me a ledger because he was drowning and I threw him a rope. Vera gave me a name because I gave her something worth having and then didn't spend it the second I got the chance. Different currency. Same lesson, maybe, dressed better.",
        grants: ['upriverThread', 'vera_turned'],
        dispositions: [{ nodeId: 'vera', set: 4 }],
        campaign: { bonds: [{ id: 'vera', delta: 2 }], faction: { id: 'district', delta: 1 }, ledger: ['vera_turned'] },
        debrief: { principle: 'triangulation',
          note: "Vera never had to pick a side between the docks and the men upriver — she made sure both sides needed HER to reach the other. You didn't try to pull her onto your side either; you gave her something to trade and let her stay exactly where she's always stood, between everyone. That's **triangulation**: instead of fighting the strong men flanking her, you became a third point they both now have a reason to keep standing. The docks can't reach the Commissioner without her. Now, neither can you afford to burn her — and neither can he." },
      },
    },
    {
      id: 'o_wary',
      mood: 'cold',
      portrait: WARY_END,
      outcome: {
        key: 'wary', tone: 'mixed',
        title: 'VERA — A GUARDED NAME',
        line: "She gives you the name — the Commissioner's office keeps the pipeline invisible, and has for years — but she says it the way you settle a bill, flat and final, already reaching to close the tab. \"There. We're square.\" No cigarette lit, no second look. Whatever door was open a minute ago, you can feel it swinging shut behind the words.",
        ripple: "You have a thread on who protects this from above. You also have a fixer who'll deal with you strictly as a source from here — useful, watched, and never quite trusted with the rest of what she knows.",
        reflect: "I got the name. I didn't get the room, or the woman who runs it, or whatever she was about to become to me if I'd waited one more minute. My father would've waited the minute.",
        grants: ['upriverWhisper'],
        dispositions: [{ nodeId: 'vera', set: 2 }],
        campaign: { bonds: [{ id: 'vera', delta: 0 }], ledger: ['vera_wary'] },
        debrief: { principle: 'information-asymmetry',
          note: "You've got a name now. Notice what you don't have: how far it runs past the Commissioner, who he answers to, what it costs to keep the pipeline invisible. Vera has all of that. That gap between what you know and what she knows is **information asymmetry**, and it still runs entirely her direction. She'll deal with you as a source for exactly as long as that gap stays wide — the day you know as much as she does is the day you stop being useful to her, one way or the other." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'VERA — THE DOOR SHUTS',
        line: "Whatever you spent — her one rule, said too loud, or a threat dressed up as a question, or a second fold of bills after the first — it lands the same. The warmth doesn't just leave her face; it leaves the room. Two of the card players are on their feet before she even lifts a hand. \"Get out of my club,\" she says, quiet enough that only you hear it, \"and pray nobody upriver ever finds out you were in it.\"",
        ripple: "No name, no thread — and worse, the one person who could have bridged you to the men above Marlowe now has every reason to make sure nobody else ever does either.",
        heatDelta: 2,
        dispositions: [{ nodeId: 'vera', set: 0 }],
        campaign: { bonds: [{ id: 'vera', delta: -2 }], faction: { id: 'district', delta: -1 }, ledger: ['vera_burned'] },
        reflect: "Marlowe buys silence and calls it business. Tonight I tried to take it instead, from a woman who's spent twenty years making sure nobody ever could. My father knew the difference between the two. I'm starting to forget it.",
        debrief: { principle: 'reciprocity',
          note: "You never put anything real on that bar — you took, or you threatened, or you spent her one rule (discretion) in front of the one man who could end her for it. **Reciprocity** only runs if something moves first, freely, in good faith. You waited for her to give, or tried to make her, and both read to a woman like Vera exactly the same way: a man who thinks a favor is something you take, not something you earn. She doesn't owe you anything now. Worse — she has a reason to make sure no one else upriver ever does either." },
      },
    },
  ],
};
