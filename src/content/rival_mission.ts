import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, grounded in
// Coyle's own world: the private card room at the Corinthian Club, low brass
// lamps over green felt, cigar haze, a Hall operator's careful, unreadable face.
const ESTABLISH = 'assets/art/scene/rival_establish.jpg'; // wide: Coyle dealing his own game, the club room around him
const WATCHFUL = 'assets/art/scene/rival_watchful.jpg';   // sizing up the stranger without looking up
const GUARDED = 'assets/art/scene/rival_guarded.jpg';     // "I don't discuss the Hall's business at my table"
const TELL = 'assets/art/scene/rival_tell.jpg';           // the tell: his hand keeps finding his breast pocket
const AMBITION = 'assets/art/scene/rival_ambition.jpg';   // dismissive laugh — heard the chair-pitch before
const GRUDGE = 'assets/art/scene/rival_grudge.jpg';       // unmoved, dealing on through old sentiment
const FEARLOCK = 'assets/art/scene/rival_fearlock.jpg';   // the first real crack — eyes come up off the cards
const NOTE = 'assets/art/scene/rival_note.jpg';           // a steward slides the folded note across the felt
const READNOTE = 'assets/art/scene/rival_readnote.jpg';   // unfolds it, reads, jaw tightens
const GUESS = 'assets/art/scene/rival_guess.jpg';         // rattled that you named it before he opened it
const BOLD = 'assets/art/scene/rival_bold.jpg';           // watches you instead of the note, weighing your nerve
const ALLIED = 'assets/art/scene/rival_allied.jpg';       // decision made — moving first, cold resolve
const WAVERED = 'assets/art/scene/rival_wavered.jpg';     // folds his hand, waits, gives nothing away
const HEDGE = 'assets/art/scene/rival_hedge.jpg';         // rises, already reaching for the house telephone

// ALDERMAN COYLE — a City Hall rival who'd love Commissioner Vane gone, and has
// wanted it for years: passed over for the chair three times, twice for men
// Vane installed himself because they were safer than Coyle, meaning quieter,
// meaning owned. A PEER, not a mark — a career politico who has survived a
// decade by never once backing a hand that could lose. He won't move on a
// rumor, a grudge, or a threat. THE WOVEN READ: the observed tell is his hand
// checking the same breast pocket mid-deal — a careful man's carefulness
// leaking through. The correct read isn't his ambition or his old grudge, it's
// his fear: he's afraid of still standing next to Vane when Vane falls, of
// being the safe, quiet, owned man Vane reaches for first when someone needs
// blaming. THE COMPLICATION: mid-scene, a steward delivers him a note from the
// Hall — proof his name is already being quietly measured for the fall — and
// the player must decide how to use the moment before his fear cools. This is
// the engineered PRISONER'S DILEMMA: make staying loyal look like the losing
// bet regardless of what Vane does, and defecting to you stops being betrayal
// and becomes just the rational move. Three endings:
//   ALLIED  — he moves first against Vane (clean win, he's yours)
//   WAVERED — he won't commit either way, waits to see who wins first
//   HEDGE   — you point his fear at yourself instead of Vane, so he insures
//             the safer way: a quiet word to Vane's people (heat, forewarned)
// Even the good ending is a knife by the blade — you taught a careful man that
// fear decides things faster than loyalty does, and now he knows you can do it
// to him too.
export const RIVAL_MISSION: Mission = {
  id: 'rival_mission',
  actionId: 'rival_turn',
  nodeId: 'rival',
  label: 'Turn the rival',
  palette: 'bianchi',
  scene: 'assets/art/scene/rival.jpg',
  teaches: ['triangulation', 'prisoners-dilemma'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: "Alderman Coyle's held his City Hall seat eleven years and been passed over for Commissioner three times — twice for men Vane put in the chair himself. Tonight he's dealing his own game in the card room at the Corinthian Club, the one room uptown where money changes hands quietly enough nobody has to explain it later." },
        { who: 'you', caption: true, art: WATCHFUL, text: "He plays the Hall the way he plays this table — never showing what he's holding. A peer, not a mark. He won't move on a stranger's word, and a career built on outlasting other men's mistakes doesn't get spent on a losing hand." },
        { who: 'them', art: GUARDED, text: "(not looking up from the cards) I don't discuss the Hall's business at my own table. Sit and lose politely, or leave standing." },
        { who: 'you', caption: true, art: TELL, text: "He deals the next hand clean and easy — but his free hand keeps finding the same breast pocket, like there's a folded paper in there he can't stop checking. A careful man's carefulness always leaks somewhere." },
      ],
      ask: "A cautious peer who's spent a career never backing the losing hand. Read him past the cards: does he move on an old grudge against Vane, on the chair Vane's sitting in, on being pushed — or only once staying loyal starts to look like the bet that loses?",
      choices: [
        { id: 'fear', label: "His real math — 'You're not scared of Vane winning. You're scared of still standing next to him when he falls.'", tone: 'disarm', to: 'p_fear' },
        { id: 'ambition', label: "His hunger — 'Vane's chair's got your name half-written on it, if he's gone.'", tone: 'press', to: 'i1' },
        { id: 'grudge', label: "His old grudge — 'Passed over three times for men he trusted more. That still sits with you.'", tone: 'disarm', to: 'f1' },
        { id: 'threaten', label: "Lean on him — 'Help me, or your own ledgers get read out loud next.'", tone: 'push', to: 'o_hedge' },
      ],
    },

    // --- ambition misread: he's heard the pitch before, wants substance ---
    {
      id: 'i1',
      mood: 'cold',
      beats: [
        { who: 'them', art: AMBITION, text: "(a short humorless laugh, eyes still on his cards) Every operator who wants something dangles that chair first. Half the Hall's promised me Vane's job to get one favor out of me. What have you actually got, besides a nicer story than the last one?" },
      ],
      ask: "He's heard the ambition pitch from a dozen men who wanted something free. What do you actually have?",
      choices: [
        { id: 'fear2', label: "Skip the chair — 'It's not the chair. It's that you're the name Vane reaches for first when he needs someone to blame.'", tone: 'disarm', to: 'p_fear' },
        { id: 'promise', label: "Promise it plainer — 'Back me, and I make sure it's your name on that door.'", tone: 'press', to: 'o_wavered' },
        { id: 'push', label: "Push — 'You'd really rather stay third chair the rest of your career?'", tone: 'push', to: 'o_wavered' },
      ],
    },

    // --- grudge misread: sentiment bounces off a decade of practiced patience ---
    {
      id: 'f1',
      mood: 'cold',
      beats: [
        { who: 'them', art: GRUDGE, text: "(unmoved, dealing the next hand) Three times. I've had a decade to make my peace with it, or a decent impression of one. A grudge doesn't survive a call to the wrong ear, and it doesn't pay for anything. Bring me something that does more than make me feel better." },
      ],
      ask: "He's armored the sting into patience. Fold, or find the lever underneath it?",
      choices: [
        { id: 'fear3', label: "Give him the real lever — 'Patience is fine. Until the ground under it starts moving. And it is.'", tone: 'disarm', to: 'p_fear' },
        { id: 'plead', label: "Press the grudge anyway — 'Still. Three times is a long time to keep smiling at a man who owes you.'", tone: 'press', to: 'o_wavered' },
      ],
    },

    // --- THE WOVEN READ lands: his fear cracks the careful surface ---
    {
      id: 'p_fear',
      mood: 'tense',
      beats: [
        { who: 'them', art: FEARLOCK, text: "(the first real crack — his eyes finally come up off the cards) …Go on, then. Say what you think you know." },
        { who: 'you', art: FEARLOCK, text: "Vane doesn't trust easy, and he trusts less the longer this runs. Every man he's put where you wanted to be, he put there because he's safer than you — meaning quieter, meaning owned outright. You've been loyal a long time to a man who's never once made you safe for it." },
        { who: 'them', art: FEARLOCK, text: "(quiet, careful, a warning) …Careful. That's the kind of talk that gets repeated to the wrong people." },
        { who: 'you', caption: true, art: NOTE, text: "Before he can decide whether to have you removed for it, a club steward leans in at his shoulder and slides a folded note across the felt. Coyle's dealing hand stops mid-shuffle." },
      ],
      ask: "The note's sitting under his fingers, unopened, and his caution just became fear in real time. What do you do with the moment?",
      choices: [
        { id: 'read', label: "Don't crowd it — let him open it. 'Read it. I'll wait.'", tone: 'disarm', to: 'p_note_read' },
        { id: 'name', label: "Name it before he does — 'That's the Hall, isn't it. Someone's already asking who's still loyal.'", tone: 'press', to: 'p_note_guess' },
        { id: 'force', label: "Talk over it — 'Forget the note. Decide before you know what's in it.'", tone: 'push', to: 'p_note_force' },
      ],
    },

    // --- THE COMPLICATION: the note, played three ways, each rejoining the same engineered fork ---
    {
      id: 'p_note_read',
      mood: 'fear',
      beats: [
        { who: 'them', art: READNOTE, text: "(unfolds it, reads, jaw tightening, refolds it slow and deliberate) …Someone in the Commissioner's office is asking around who still takes Vane's calls without hesitating first. My name came up. Second time this month." },
      ],
      ask: "He's just confirmed it himself — the Hall's already measuring him for the fall. The fear is real now. Land it, or lose him.",
      choices: [
        { id: 'defect', label: "Make the math plain — 'Wait for Vane to decide you're a liability, and you lose either way. Move first, and you're the one who saw it coming.'", tone: 'disarm', to: 'o_allied' },
        { id: 'reassure', label: "Only reassure — 'Relax. I'm not asking you to do anything tonight.'", tone: 'press', to: 'o_wavered' },
        { id: 'overplay', label: "Push the fear into a threat — 'Move now — or I make sure Vane hears exactly how scared you already are.'", tone: 'push', to: 'o_hedge' },
      ],
    },
    {
      id: 'p_note_guess',
      mood: 'fear',
      beats: [
        { who: 'them', art: GUESS, text: "(a long, measuring look, the note still unopened under his fingers) …How exactly do you know that." },
        { who: 'you', art: GUESS, text: "Because I know what a man being quietly measured for the fall looks like from across a table. You're wearing it right now." },
      ],
      ask: "You named his fear before he could hide it. It's raw now — the only question is whose fear wins tonight.",
      choices: [
        { id: 'defect', label: "Make the math plain — 'Wait for Vane to decide you're a liability, and you lose either way. Move first, and you're the one who saw it coming.'", tone: 'disarm', to: 'o_allied' },
        { id: 'reassure', label: "Only reassure — 'Relax. I'm not asking you to do anything tonight.'", tone: 'press', to: 'o_wavered' },
        { id: 'overplay', label: "Push the fear into a threat — 'Move now — or I make sure Vane hears exactly how scared you already are.'", tone: 'push', to: 'o_hedge' },
      ],
    },
    {
      id: 'p_note_force',
      mood: 'tense',
      beats: [
        { who: 'them', art: BOLD, text: "(doesn't touch the note — watches you instead, something between insult and reluctant respect) …Bold, for a stranger who hasn't bought a single hand yet." },
      ],
      ask: "He still hasn't opened it. The fear's sitting right there, unclaimed. Whoever names it first owns the room.",
      choices: [
        { id: 'defect', label: "Make the math plain — 'Wait for Vane to decide you're a liability, and you lose either way. Move first, and you're the one who saw it coming.'", tone: 'disarm', to: 'o_allied' },
        { id: 'reassure', label: "Only reassure — 'Relax. I'm not asking you to do anything tonight.'", tone: 'press', to: 'o_wavered' },
        { id: 'overplay', label: "Push the fear into a threat — 'Move now — or I make sure Vane hears exactly how scared you already are.'", tone: 'push', to: 'o_hedge' },
      ],
    },

    // --- endings ---
    {
      id: 'o_allied',
      mood: 'hope',
      portrait: ALLIED,
      outcome: {
        key: 'allied', tone: 'good',
        title: 'COYLE — HE MOVES FIRST',
        line: "He sets his cards face-down, finally, and looks straight at you for the first time all night. \"…Fine. If I'm going to be somebody's fall either way, better it costs Vane something on the way down. What do you need from me.\"",
        ripple: "Coyle starts quietly working the Hall against Vane — nothing loud enough to trace back to a card table, but doors that were locked start opening a crack. Vane will feel the ground shift before he can name why.",
        reflect: "I never once said the word betray. I just made sure the losing bet was the one he was already making. My father sold rope and lanterns. I sell men their own fear back to them.",
        grants: ['rivalBacking', 'rival_allied'],
        dispositions: [{ nodeId: 'rival', set: 4 }],
        campaign: { bonds: [{ id: 'rival', delta: 2 }], faction: { id: 'hall', delta: 1 }, ledger: ['rival_allied'] },
        debrief: { principle: 'prisoners-dilemma',
          note: "You never had to say 'betray Vane.' You just made the losing move — staying loyal — look dangerous no matter what Vane does. That's the **prisoner's dilemma**: two players who'd both do fine cooperating instead defect on each other because each fears the OTHER defects first. Coyle didn't need proof Vane was finished. He needed to believe that whichever way this goes, loyalty is the hand that loses. Once that's true, moving on you stops being betrayal and becomes just the rational play." },
      },
    },
    {
      id: 'o_wavered',
      mood: 'cold',
      portrait: WAVERED,
      outcome: {
        key: 'wavered', tone: 'mixed',
        title: 'COYLE — HE FOLDS, FOR TONIGHT',
        line: "He gathers the cards, unhurried, giving nothing away. \"I didn't last eleven years at that Hall by betting on a stranger's story. Come back when you're the one holding the winning hand — not just the louder one.\"",
        ripple: "Nothing moves. Coyle stays exactly where he's sat for a decade, watching both directions at once. He might reconsider once someone else tips the balance — but he isn't the one who tips it first.",
        reflect: "I gave him a reason to want me to win. I never made him feel the floor was already cracking. Wanting isn't moving — I keep forgetting that's the whole job.",
        dispositions: [{ nodeId: 'rival', set: 2 }],
        campaign: { bonds: [{ id: 'rival', delta: -1 }], ledger: ['rival_wavered'] },
        debrief: { principle: 'triangulation',
          note: "**Triangulation** only pays off once you make yourself the pivot BOTH sides need — the third point that forces a choice. You dangled a possible future without ever making the present one feel unsafe. A careful man with no real fear doesn't pick a side; he just keeps dealing and watches which way the table leans before he risks a chip." },
      },
    },
    {
      id: 'o_hedge',
      mood: 'threat',
      portrait: HEDGE,
      outcome: {
        key: 'hedge', tone: 'bad',
        title: 'COYLE — HE HEDGES TO VANE',
        line: "He rises, buttons his coat, already moving toward the house telephone in the club's back hall. \"You threaten a man at his own table, you've told him exactly which way to jump for cover. And it isn't toward you.\"",
        ripple: "Coyle doesn't need to name you outright — a quiet word to Vane's aide that 'someone's been asking careful questions about loyalty' buys him all the insurance he needs. Vane tightens his circle and starts looking for whoever's asking.",
        heatDelta: 2,
        worldFlags: ['vaneForewarned'],
        dispositions: [{ nodeId: 'rival', set: 0 }],
        campaign: { bonds: [{ id: 'rival', delta: -2 }], faction: { id: 'hall', delta: -1 }, ledger: ['rival_hedged'] },
        reflect: "I made him afraid. Just of the wrong man. A career spent surviving other men's falls, and I handed him one more reason to keep surviving — at my expense this time.",
        debrief: { principle: 'prisoners-dilemma',
          note: "The **prisoner's dilemma** only breaks your way if the fear of defection points at the man you want him to leave. Point it at yourself instead — a stranger threatening him at his own table — and the calculation flips: Vane becomes the known, survivable danger, and you're the new, untested one. A frightened, cautious man buys insurance from whichever side scares him less. Tonight, that side wasn't you." },
      },
    },
  ],
};
