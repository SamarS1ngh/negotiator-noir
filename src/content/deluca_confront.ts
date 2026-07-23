import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene turns
// like a comic with every line (entering his domain → sizing you up → the leverage
// turn cracking his jovial mask → each ending its own image + mood).
const COURT = 'assets/art/scene/deluca_court.jpg';         // wide: his gilded throne room, you enter
const MOCK = 'assets/art/scene/deluca_mock.jpg';           // lounging grin, waves you to a chair
const RATTLED = 'assets/art/scene/deluca_rattled.jpg';     // the swagger cracking, a flicker of worry
const DEMAND = 'assets/art/scene/deluca_demand.jpg';       // leaning in, jabbing a ring-heavy finger
const AMBUSH = 'assets/art/scene/deluca_ambush.jpg';       // wide: the room stacked, men at every door
const COLDEYED = 'assets/art/scene/deluca_coldeyed.jpg';   // flat cold eyes, hand near the hidden gun
const TABLE = 'assets/art/scene/deluca_table.jpg';         // spreading his hands over the laden table
const FREEZE = 'assets/art/scene/deluca_freeze.jpg';       // his ringed hand goes still — the file lands
const ULTIMATUM = 'assets/art/scene/deluca_ultimatum.jpg'; // you lean in, cold and certain
const SWEAT = 'assets/art/scene/deluca_sweat.jpg';         // swagger drained, sweat at his collar
const EMPTYDOOR = 'assets/art/scene/deluca_emptydoor.jpg'; // he turns to the doorway where Santo isn't
const LOSTHIM = 'assets/art/scene/deluca_losthim.jpg';     // you, unbothered — 'you lost him years ago'
const DEFIANT = 'assets/art/scene/deluca_defiant.jpg';     // stung pride, hand sliding toward the gun
const GREED = 'assets/art/scene/deluca_greed.jpg';         // his eyes light up, hungry and calculating
const PITCH = 'assets/art/scene/deluca_pitch.jpg';         // you pitch the partnership, open-handed
const HUNGRY = 'assets/art/scene/deluca_hungry.jpg';       // leans in close — show me, not tell me
const END_ALLY = 'assets/art/scene/deluca_end_ally.jpg';       // resigned, wary respect, hand extended
const END_BROKEN = 'assets/art/scene/deluca_end_broken.jpg';   // slumped, humiliated before his own men
const END_DISTRICT = 'assets/art/scene/deluca_end_district.jpg'; // thin smug smile, kept his real secret
const END_SLIP = 'assets/art/scene/deluca_end_slip.jpg';       // triumphant grin, ushers you to the door
const END_CRUSHED = 'assets/art/scene/deluca_end_crushed.jpg'; // laughing, lifting the pistol into the light
const REVEAL = 'assets/art/scene/deluca_reveal.jpg';       // NEW (not yet generated — CF quota
  // exhausted; prompt appended to scripts/gen_deluca_panels.sh, not run): his eyes go distant,
  // past you, toward the window/the city — the mask drops for the cargo/upriver reveal

// DELUCA — Chapter Two's sit-down, and the ACT I FINALE. Ricci's old boss, the
// district king who's been robbing Marlowe blind to build his own little empire.
// His crack is that secret: Marlowe murders men who steal from him, and DeLuca
// knows it. Your prep decides what's possible — Reese's file ('delucaProof') is
// the blade; Santo turned ('santoTurned') strips his muscle. A way-up outcome
// (deal.gotName) climbs you to Chapter Three; anything less leaves you stuck in
// his district.
// THE WOVEN READ: right after he starts performing for you, you judge what's
// actually driving him — simple greed, or the truth (he's terrified the men
// above him have noticed how big he's grown). Both reads still reach the same
// approach fork; the true read (fear) is the one the rest of the scene bears out.
// THE TWIST — the Act I -> Act II hinge: on the endings where the file breaks him
// (ally or broken), a falling DeLuca stops protecting Marlowe's secret and blurts
// a bigger one — the empire's a front over real cargo, moving for partners
// upriver who'd bury whole families to keep it quiet. "You think this was ever
// about you?" Plants the conspiracy (`cargoRevealed`/`upriverThread`) the player
// chases for the rest of the game. The district-only and no-proof endings never
// hear it — DeLuca keeps that secret exactly as hard as he keeps everything else.
export const DELUCA_CONFRONT: Mission = {
  id: 'deluca_confront',
  actionId: 'deluca_sitdown',
  nodeId: 'deluca',
  label: 'Sit down with DeLuca',
  palette: 'deluca',
  scene: 'assets/art/scene/deluca.jpg',
  teaches: ['leverage-and-batna', 'golden-bridge', 'anchoring', 'the-mirror', 'walk-away-power'],
  start: 's0_serene',
  nodes: [
    {
      id: 's0_serene',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: COURT, text: "DeLuca holds court in the back of his club, gold rings catching the light, a man who enjoys being the biggest thing in the room. He doesn't know his room's been quietly taken apart around him." },
        { who: 'them', art: MOCK, text: "So you're the little dockrat who did for Ricci. Cute. You climbed one rung and think you're a mountaineer. Sit. Amuse me before I have you thrown in the river with the rest of the trash." },
      ],
      choices: [{ id: 'go', label: 'Sit. Let him swagger.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: RATTLED, text: "The swagger's thinner tonight. Word's reached him that his people are being worked, and Vito DeLuca does not like surprises in his own house." },
        { who: 'them', art: DEMAND, text: "Somebody's been in my district, turning my men. If that somebody's you, dockrat, you've got about a minute to explain why you're still breathing." },
      ],
      choices: [{ id: 'go', label: 'Sit. He\'s rattled — use it.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: AMBUSH, text: "Someone ran to him. DeLuca knew you were coming and he's stacked the room — Santo's men at the doors, a pistol just under the tablecloth by his hand." },
        { who: 'them', art: COLDEYED, text: "I know all about you, Vidal's whelp. Turned my cop, sniffed at my muscle. And here you are anyway. Bold, or stupid. Talk fast — I've already decided which." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. Don't blink.", tone: 'disarm', to: 'open' }],
    },

    {
      id: 'open',
      mood: 'threat',
      beats: [
        { who: 'them', art: TABLE, text: "Well? What does a dockrat bring to Vito DeLuca's table that keeps him out of the river?" },
        { who: 'you', caption: true, art: MOCK, text: "He's putting on a show — booming voice, hands wide, rings flashing, playing king for an audience of one. Men don't perform this loud unless something's chasing them." },
      ],
      choices: [{ id: 'read', label: "Let him boom. Read what's under it. ▸", tone: 'disarm', to: 'read_deluca' }],
    },
    // --- THE WOVEN READ: investigate the performance, judge what's under it ---
    {
      id: 'read_deluca',
      mood: 'threat',
      portrait: MOCK,
      read: {
        ask: "Under the gold and the noise — what's actually chasing Vito DeLuca?",
        hint: 'A man performs this loud to drown something out. Tap what you notice.',
        clues: [
          { x: 50, y: 24, label: 'his laugh', note: "Half a beat too loud, and it never reaches his eyes. A man laughing to fill a silence that scares him." },
          { x: 31, y: 56, label: 'the rings', note: "He keeps turning them, flashing them — reminding himself, more than you, that he's still a big man." },
          { x: 72, y: 38, label: 'his eyes', note: "They cut to the street outside, once, when money comes up. The real threat in his life isn't across this table." },
          { x: 57, y: 73, label: 'his hand', note: "Never far from the tablecloth, and the pistol under it. That's comfort he's reaching for, not confidence." },
        ],
        options: [
          { id: 'read_greed', label: "Simple hunger. He wants more than Marlowe lets him keep.", to: 'r_greed' },
          { id: 'read_fear', label: "Fear — not of you. Of the man above him noticing how big he's grown.", to: 'r_fear' },
        ],
      },
    },
    {
      id: 'r_greed',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: GREED, text: "You size him up as a man who just wants more — feed the hunger and he folds. Then you catch it: his eyes don't light up at the first mention of money. They cut, just once, toward the street outside — like the real threat in his life isn't sitting across this table at all." },
      ],
      choices: [{ id: 'go', label: 'File that away. Play the table.', tone: 'disarm', to: 'approach' }],
    },
    {
      id: 'r_fear',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: RATTLED, text: "You read the real thing under the show: he's not hungry, he's scared. Every laugh half a beat too loud, every ring flashed like a man convincing himself he's still safe. He hasn't stopped being Marlowe's man in his own head — and he's terrified Marlowe's noticed he's stopped acting like one." },
      ],
      choices: [{ id: 'go', label: "Play to that fear, not his greed.", tone: 'disarm', to: 'approach' }],
    },
    {
      id: 'approach',
      mood: 'threat',
      beats: [
        { who: 'them', art: TABLE, text: "(taps a ringed finger on the table, waiting)" },
      ],
      ask: "Everything you did in his district comes to this. What do you put on the table?",
      choices: [
        { id: 'blade', label: "The file — 'You've been robbing Marlowe blind to build your own kingdom. I can prove it. Marlowe kills men for less.'", tone: 'push', requires: ['delucaProof'], to: 'c_blade' },
        { id: 'muscle', label: "His muscle — 'Santo won't lift a hand for you. Your own dog stepped back. You're not as protected as you think.'", tone: 'push', requires: ['santoTurned'], to: 'c_muscle' },
        { id: 'ego', label: "His ambition — 'A man like you shouldn't answer to anyone. I can help you stop being Marlowe's middleman.'", tone: 'disarm', to: 'c_ego' },
        { id: 'nothing', label: "Face him with nerve alone — 'I did for Ricci. I can do for you.'", tone: 'push', to: 'o_crushed' },
      ],
    },

    {
      id: 'c_blade',
      mood: 'threat',
      beats: [
        { who: 'them', art: FREEZE, text: "(the gold rings go still on the tablecloth) …Where did you get that." },
        { who: 'you', art: ULTIMATUM, text: "Doesn't matter. What matters is Marlowe never sees it — if you give me what I want. You know what he does to men who skim from him. Ricci did it small and he's finished. You did it big." },
        { who: 'them', art: SWEAT, text: "(the swagger gone, sweat at his collar) …Name it, then. Name it and let's both walk away from this." },
      ],
      ask: "You've got the district king by the throat, and he's more afraid of Marlowe than of you. What do you force — and how do you leave him?",
      choices: [
        { id: 'upFace', label: "Your climb, let him save face — 'You stay king of the Nine Streets. But from tonight you answer to me, and you open the door up to Marlowe.'", tone: 'disarm', to: 'c_twist_ally' },
        { id: 'upBreak', label: "Your climb, and break him — 'You're done. Sign the district to me and crawl to Marlowe's door ahead of me.'", tone: 'push', to: 'c_twist_broken' },
        { id: 'district', label: "Just the district — 'Hand me the Nine Streets and keep your secret. I'll find my own way up.'", tone: 'disarm', to: 'o_district' },
      ],
    },

    // --- THE TWIST — the Act I -> Act II hinge. Only on the endings where the
    // file has actually broken him does he stop protecting Marlowe's secret and
    // let slip the bigger one underneath it: the empire's a front over real,
    // ongoing cargo, moving for partners upriver. Same physical beat (REVEAL),
    // played to pity on the ally path and to spite on the broken path — the deal
    // itself is untouched; this happens in the gap between the choice and the
    // consequence card. ---
    {
      id: 'c_twist_ally',
      mood: 'threat',
      beats: [
        { who: 'them', art: COLDEYED, text: "(the fear drains into something colder — not defeat, almost pity) …You think this is the whole thing. The district. The skim. Marlowe's little empire. Kid, you have no idea what you just put your hand on." },
        { who: 'them', art: REVEAL, text: "There's cargo moving through this port that's never been on a manifest in its life — crates that don't exist, ships that were never here. Marlowe's just the front door. The men who actually own that door are upriver. A commissioner. Men who'd bury three families deep to keep their names out of a newspaper." },
        { who: 'them', art: DEMAND, text: "Your father found that out asking the wrong questions on the wrong dock. You think this was ever about you? About Ricci? You're not climbing a ladder, dockrat. You're walking into a room with men in it who don't officially exist." },
        { who: 'you', caption: true, art: ULTIMATUM, text: "The room tilts a half-inch. Sal's second ledger. The numbers that never matched any cargo. My father, asking questions he had no business asking. It was never Ricci's script. It was never even Marlowe's." },
      ],
      choices: [{ id: 'go', label: "Let it land. Keep your face still.", tone: 'disarm', to: 'o_up_ally' }],
    },
    {
      id: 'c_twist_broken',
      mood: 'threat',
      beats: [
        { who: 'them', art: DEFIANT, text: "(even stripped bare, something ugly curls at the corner of his mouth) …Go on, then. Take it all. Won't matter. You think you just climbed something? You think Ricci, me, any of us — that was ever the game?" },
        { who: 'them', art: REVEAL, text: "There's real cargo moving through this port, kid. Crates that were never on paper, protected by men upriver who make district bosses like me disappear for sport. A commissioner. Maybe higher. You think this was about your father? About YOU?" },
        { who: 'them', art: FREEZE, text: "(a last ugly laugh as his own men haul him up) You're not a mountaineer. You're a mouse who found a door into a house with real monsters behind it. Enjoy the climb." },
        { who: 'you', caption: true, art: ULTIMATUM, text: "He means it as a curse on his way down. It lands like a key turning. Sal's ledger. My father's questions. Somewhere upriver, men who've never heard my name are about to." },
      ],
      choices: [{ id: 'go', label: "Say nothing. Watch him go.", tone: 'push', to: 'o_up_broken' }],
    },
    {
      id: 'c_muscle',
      mood: 'cold',
      beats: [
        { who: 'them', art: EMPTYDOOR, text: "(a glance at the door where Santo should be, and isn't) …Santo. That mountain of meat. You turned Santo." },
        { who: 'you', art: LOSTHIM, text: "I didn't turn him. You lost him — years ago, every time you called him your dog. I just told him he could put the leash down." },
        { who: 'them', art: DEFIANT, text: "(rattled now, but proud) So I'm short a bodyguard. I've got twenty more men and a pistol under this table, boy. Muscle isn't the whole game." },
      ],
      ask: "His shield's gone but he's still got teeth and pride. Force it, or ease off?",
      choices: [
        { id: 'strongarm', label: "Force it — 'Twenty men who'll follow the winner. And that's not you anymore. Give me the way up.'", tone: 'push', to: 'c_twist_broken' },
        { id: 'backoff', label: "Ease off — settle for what you can get without the blade.", tone: 'disarm', to: 'o_slip' },
      ],
    },
    {
      id: 'c_ego',
      mood: 'tense',
      beats: [
        { who: 'them', art: GREED, text: "(the greed lights up) …Now that. That's interesting talk. You think I like being Marlowe's errand boy? Collecting his coast, kissing his ring?" },
        { who: 'you', art: PITCH, text: "I think you've already built your own kingdom in the cracks of his. I think you want more. And I think we could want it together." },
        { who: 'them', art: HUNGRY, text: "(leaning in, hungry) …Show me you're worth more than talk, then. Give me a reason, not a wish." },
      ],
      ask: "His ambition's wide open — but a hungry man wants proof, not promises.",
      choices: [
        { id: 'press', label: "Show him the file (needs proof) — 'Here's your reason. I hold what could end you. Partner up, or hang.'", tone: 'push', requires: ['delucaProof'], to: 'c_blade' },
        { id: 'promise', label: "Promise it — 'Move with me now and I'll make you a king. Trust me.'", tone: 'push', to: 'o_slip' },
      ],
    },

    {
      id: 'o_up_ally',
      mood: 'hope',
      portrait: END_ALLY,
      outcome: {
        key: 'up_ally', tone: 'good',
        title: 'DELUCA — BENT, NOT BROKEN',
        line: "He signs the district over in everything but name and, terrified of Marlowe, opens the door above him. \"You keep my secret, I keep your road clear. We understand each other.\" You've climbed another rung — and the district runs on your say-so now.",
        ripple: "DeLuca is yours — the Nine Streets answer to you, and the way up to Marlowe is open. You climb. And now you're climbing toward something bigger than Marlowe ever was.",
        reflect: "Another man kept alive because he's more useful breathing. I'm getting good at that calculation. Ricci made it about me once. DeLuca just made it about himself. Neither of them was right.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['cargoRevealed', 'upriverThread'],
        campaign: { bonds: [{ id: 'deluca', delta: 2 }], faction: { id: 'district', delta: 2 }, ledger: ['deluca_turned', 'cargoRevealed', 'upriverThread'] },
        debrief: { principle: 'golden-bridge',
          note: "You had the blade at his throat and used it to build a door, not a wall — he keeps the club, the rings, the room that still fears him, and in trade he opens the road above him for you. A cornered man with no way out claws you on the way down; hand him one he can walk through with his coat still on and he becomes useful instead of desperate. That's the **golden bridge** — Sun Tzu's rule for beating an enemy without making a martyr of him. It's also the only reason he talked at all." },
      },
    },
    {
      id: 'o_up_broken',
      mood: 'threat',
      portrait: END_BROKEN,
      outcome: {
        key: 'up_broken', tone: 'mixed',
        title: 'DELUCA — YOU TOOK IT ALL',
        line: "You strip him of everything in front of his own men and send him crawling to Marlowe's door ahead of you, a broken king announcing his conqueror. You have the district and the road up. You also have a humiliated man who'll knife you the first chance he gets.",
        ripple: "You've taken the district by force — the climb continues. But DeLuca is destroyed and vengeful, and he's telling everyone your name. And on his way down he told you something that isn't about him at all.",
        reflect: "I put a king on his knees in front of his court and felt the old thing again — the enjoyment. Ten years, Ricci said. I keep proving him right, one broken man at a time. And the man I just broke swears none of them were ever the real fight.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        heatDelta: 1,
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
        grants: ['cargoRevealed', 'upriverThread'],
        campaign: { bonds: [{ id: 'deluca', delta: -2 }], faction: { id: 'district', delta: 1 }, ledger: ['deluca_broken', 'cargoRevealed', 'upriverThread'] },
        debrief: { principle: 'the-mirror',
          note: "You didn't just take the district — you paraded him through his own loss in front of his own men, because some part of you enjoyed watching a king kneel. That's not strategy anymore, that's appetite. Every tool you just used — fear, humiliation, making an example of a beaten man — is the exact toolkit Marlowe built his empire on. This is **the mirror**: the cost of getting good at this isn't paid in cash or blood. It's paid in becoming, one satisfying cruelty at a time, the man you started out hunting." },
      },
    },
    {
      id: 'o_district',
      mood: 'cold',
      portrait: END_DISTRICT,
      outcome: {
        key: 'district', tone: 'mixed',
        title: 'DELUCA — THE STREETS, NOT THE STAIRS',
        line: "He hands you the Nine Streets to keep his secret buried — but not the door above. \"Find your own way up to the boss, dockrat. This is all I'm giving.\" You're richer, higher. You're not one rung closer to Marlowe.",
        ripple: "You hold the district now. But DeLuca kept the road up for himself — Marlowe stays out of reach. You've climbed sideways, not up.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
        campaign: { bonds: [{ id: 'deluca', delta: 0 }], faction: { id: 'district', delta: 1 }, ledger: ['deluca_district'] },
        debrief: { principle: 'leverage-and-batna',
          note: "You had him cornered with the one thing that could end him, and you cashed it in for a street map instead of the staircase. That's leverage spent small, not leverage used well. Your **BATNA** — his best alternative if he'd said no — was as bad as it will ever get with that file in your pocket: give you everything, or Marlowe finds out. A king with no better option had no better option. You just didn't ask him for everything he had." },
      },
    },
    {
      id: 'o_slip',
      mood: 'cold',
      portrait: END_SLIP,
      outcome: {
        key: 'slip', tone: 'mixed',
        title: 'DELUCA — HE WRIGGLES FREE',
        line: "Without the file at his throat, he smells the bluff. \"Bold, kid. But you came to a knife fight with a strong opinion.\" He gives you nothing, ushers you out with a smile, and doubles his guard. You should have brought the proof.",
        ripple: "DeLuca slips the noose — wary now, and warned. The road up stays shut, and he knows your face.",
        reflect: "I moved without enough, again. I want the top so badly I keep reaching before my hand's full. That's how men like me fall.",
        deal: { closed: false, gotName: false, faceIdx: 1 },
        heatDelta: 1,
        campaign: { bonds: [{ id: 'deluca', delta: -1 }], faction: { id: 'district', delta: -1 }, ledger: ['deluca_slipped'] },
        debrief: { principle: 'anchoring',
          note: "You opened with a big frame — partner, kingmaker — dressed up as a promise, but you never priced it, because you had nothing behind it to make the number real. Whoever states the first hard figure owns the room; that's **anchoring**. A promise isn't a figure. He tested it, felt no weight under it, and set his own frame instead: bold kid, empty hand. Next time bring the number that can't be waved off — proof, not persuasion." },
      },
    },
    {
      id: 'o_crushed',
      mood: 'threat',
      portrait: END_CRUSHED,
      outcome: {
        key: 'crushed', tone: 'bad',
        title: 'DELUCA — INTO THE RIVER',
        line: "He lets you finish, then laughs and lifts the pistol from under the tablecloth. \"You did for Ricci because Ricci was soft. I'm not soft.\" His men close the doors. You brought nerve to a room full of guns.",
        ripple: "You moved on the district king with nothing in your hand. DeLuca ends you the way he ends every dockrat who forgets his place.",
        reflect: "Pa taught me to know a man's strength before I moved on him. I walked into a room full of guns with a speech. …I hope he wasn't watching.",
        deal: { closed: false, gotName: false, faceIdx: 2 },
        heatDelta: 3,
        tag: 'THE END',
        cta: '— the river —',
        campaign: { bonds: [{ id: 'deluca', delta: -1 }], faction: { id: 'district', delta: -1 }, ledger: ['deluca_crushed'] },
        debrief: { principle: 'walk-away-power',
          note: "You walked into a room stacked with his men holding nothing but nerve, because you wanted the win badly enough to skip the part where you check whether you can survive losing it. That's the flip side of **walk-away power** — knowing when the table itself is the trap, and the only winning move is not sitting down at all. Pa's real lesson was never 'talk your way out of anything.' It was 'know a man's strength before you're in the room with it.' You found his strength out from the wrong side of the tablecloth." },
      },
    },
  ],
};
