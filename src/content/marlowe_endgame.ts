import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat (the final climax
// of the whole game): the long approach across the dark office, the measured
// opening, the first crack in his calm, the leverage laid onto the desk, and
// each distinct ending.
const APPROACH = 'assets/art/scene/marlowe_approach.jpg';         // wide: the long approach across the vast dark office
const CALMTHREAT = 'assets/art/scene/marlowe_calmthreat.jpg';     // his calm opening threat
const PENSTOPS = 'assets/art/scene/marlowe_penstops.jpg';         // the pen freezes mid-stroke, he's listening
const SCENT = 'assets/art/scene/marlowe_scent.jpg';               // "something is off in my house"
const SPIDERWAIT = 'assets/art/scene/marlowe_spiderwait.jpg';     // perfectly still, waiting like a spider
const FOREWARNED = 'assets/art/scene/marlowe_forewarned.jpg';     // the thin chilling smile, he already knew
const MOCK = 'assets/art/scene/marlowe_mock.jpg';                 // contemptuous, "clawed up out of the gutter"
const PENDOWN = 'assets/art/scene/marlowe_pendown.jpg';           // the pen goes down — the first crack
const LEVERAGE = 'assets/art/scene/marlowe_leverage.jpg';         // the leverage fanned onto the desk
const CONCEDE = 'assets/art/scene/marlowe_concede.jpg';           // slow, controlled concession
const SEVENYEARS = 'assets/art/scene/marlowe_sevenyears.jpg';     // your reflection — seven years, this silence
const RECOVERSMILE = 'assets/art/scene/marlowe_recoversmile.jpg';// the cold smile returns — one piece isn't enough
const PRESSHURT = 'assets/art/scene/marlowe_presshurt.jpg';       // "it's enough to hurt you"
const DISMISS = 'assets/art/scene/marlowe_dismiss.jpg';           // his composure fully restored
const END_EMPIRE = 'assets/art/scene/marlowe_end_empire.jpg';     // portrait: you take his chair
const END_BURN = 'assets/art/scene/marlowe_end_burn.jpg';         // portrait: exposed, small, in the light
const END_ESCAPE = 'assets/art/scene/marlowe_end_escape.jpg';     // portrait: wary, mended, doubled locks
const END_CRUSHED = 'assets/art/scene/marlowe_end_crushed.jpg';   // portrait: calm hand on the bell
// THE ROLL CALL — new panels for the who-lived reckoning + the two earned poles
const LEGACY_LOST = 'assets/art/scene/marlowe_legacy_lost.jpg';         // the faces of the dead, half-seen
const LEGACY_BETRAYED = 'assets/art/scene/marlowe_legacy_betrayed.jpg'; // the ones who sold you out
const LEGACY_STOOD = 'assets/art/scene/marlowe_legacy_stood.jpg';       // the ones who stayed anyway
const TAKE_HOLLOW = 'assets/art/scene/marlowe_take_hollow.jpg';         // the instant the throne's light changes your face
const BURN_WORTH = 'assets/art/scene/marlowe_burn_worth.jpg';           // turning from the desk, costly and clear

// THE ENDGAME — Marlowe. You can't break him with a secret; you break him by
// making his own machine fail him. What you turned decides what's possible:
//   booksExposed (Adler)            → the paper that ends the empire — a clean win
//   ottoTurned + ricciMole together → his whole house is yours — a clean win
//   only one of them                → you hurt him, he slips (escape)
//   nothing                          → he's in full control; he crushes you
// The reached ending carries a `deal` the board applies (marks Marlowe dealt).
// The final choice is the theme's climax: TAKE his empire (become the cold man
// at the top — the mirror) or BURN it (keep yourself, inherit nothing but justice).
//
// THE WHO-LIVED ROLL CALL (near the climax, after the reactive opening, before
// you lay anything on the table): three beats — legacy_lost / legacy_betrayed /
// legacy_stood — read the persistent campaign LEDGER (not the board's worldFlags)
// and name allies by what became of them. Each is a self-looping node: every
// ledger flag you carry surfaces as its own line (click through as many as
// apply), and a single always-available choice moves you on once you're ready.
// Ledger flags read here: 'sal_dead' 'pip_dead' 'finn_dead' 'vera_dead' (died) ·
// 'bianchi_betrayed' 'vera_betrayed' (sold you out) · 'sal_mole' 'runner_turned'
// 'vera_turned' 'bianchi_partner' 'pip_helped' 'finn_helped' (stood by you).
// Six of these (the deaths + betrayals) don't exist anywhere yet — they're
// written by the not-yet-built interlude/fate system per
// docs/superpowers/specs/2026-07-22-chapters-3-6-buildout.md. The other six
// already exist as `campaign.ledger` entries from sal_mission / runner_mission /
// vera_mission / bianchi_mission / crew_mission / finn_mission today.
//
// THE TWO POLES, EARNED: take_reckon / burn_reckon sit between 'c_take' and its
// outcomes, coloring TAKE (hollow — the ones who trusted or died for this don't
// get a vote) vs BURN (righteous — naming who it's actually for) with the same
// ledger, before landing on the unchanged o_empire / o_burn nodes.
export const MARLOWE_ENDGAME: Mission = {
  id: 'marlowe_endgame',
  actionId: 'marlowe_move',
  nodeId: 'marlowe',
  label: 'Move on Marlowe',
  palette: 'marlowe',
  scene: 'assets/art/scene/marlowe.jpg',
  teaches: ['the-mirror', 'walk-away-power', 'prisoners-dilemma', 'leverage-and-batna'],
  start: 's0_serene',
  nodes: [
    // --- reactive openings (game.ts picks via startAt), all → the roll call ---
    {
      id: 's0_serene',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: APPROACH, text: "Marlowe's study. The pen, the ledger, the same cold patience. He doesn't yet know his house has been walked through in the dark. He thinks he is, as he has always been, in control." },
        { who: 'them', art: CALMTHREAT, text: "You wanted a moment of my time. You have it. Use it to tell me you've learned your place — or to make a mistake I can correct permanently." },
      ],
      choices: [{ id: 'go', label: 'Lay it on the table.', tone: 'disarm', to: 'legacy_lost' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: PENSTOPS, text: "He feels it before you say a word — a house that's gone quiet in the wrong way. His pen has stopped. Marlowe, who is never surprised, is listening for footsteps." },
        { who: 'them', art: SCENT, text: "Something is off in my house. I can smell it. And here you are, Vidal's stray, wearing a face that's much too calm. …Talk." },
      ],
      choices: [{ id: 'go', label: 'Let the silence work, then speak.', tone: 'disarm', to: 'legacy_lost' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: SPIDERWAIT, text: "One of them ran to him. Marlowe knew you were coming, and he's waiting the way a spider waits — perfectly still, everything already in place." },
        { who: 'them', art: FOREWARNED, text: "You tried to turn my people. One of them has more sense than the rest and told me. So. You've walked into my study to be buried in it. By all means — say your piece first." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. He's rattled under the ice — use it.", tone: 'disarm', to: 'legacy_lost' }],
    },

    // --- THE WHO-LIVED ROLL CALL: reads the campaign ledger, names the cost.
    // Self-looping nodes — click through every applicable flag, then move on. ---
    {
      id: 'legacy_lost',
      mood: 'guilt',
      beats: [
        { who: 'you', caption: true, art: LEGACY_LOST, text: "Before you lay anything on his desk, the faces come up — uninvited, all at once. Everyone this climb has cost you, starting with the ones who aren't here to see how it ends." },
      ],
      ask: "The ones who didn't make it out of your climb.",
      choices: [
        { id: 'sal', requires: ['sal_dead'], label: "Sal Moretti isn't answering anymore. Whoever's protecting this house found him before you could turn him into anything more than a warning.", to: 'legacy_lost' },
        { id: 'pip', requires: ['pip_dead'], label: "Pip — a kid with a splinted hand who handed you a month of tallies for nothing but his dignity back — is a name on no one's board now.", to: 'legacy_lost' },
        { id: 'finn', requires: ['finn_dead'], label: "Mrs. Finn wanted exactly one thing: her husband's name cleared. She didn't live to find out if you'd manage it.", to: 'legacy_lost' },
        { id: 'vera', requires: ['vera_dead'], label: "Vera never got her price. Somebody decided her silence was worth more than her life, and paid it.", to: 'legacy_lost' },
        { id: 'on', label: "Carry it, and move. 'Everyone I spent to get here.'", tone: 'disarm', to: 'legacy_betrayed' },
      ],
    },
    {
      id: 'legacy_betrayed',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: LEGACY_BETRAYED, text: "Then the ones who traded you away, the second the price got high enough." },
      ],
      ask: "The ones who sold you out.",
      choices: [
        { id: 'bianchi', requires: ['bianchi_betrayed'], label: "Bianchi sold you to Cassar the day your back was turned. You should have expected it — you never once gave him a reason not to.", to: 'legacy_betrayed' },
        { id: 'vera', requires: ['vera_betrayed'], label: "Vera named her price for you once. Then she named a better one for someone else. She was never lying about being for sale — you just didn't want to hear it.", to: 'legacy_betrayed' },
        { id: 'on', label: "Carry it, and move. 'Everyone who decided I wasn't worth the risk.'", tone: 'disarm', to: 'legacy_stood' },
      ],
    },
    {
      id: 'legacy_stood',
      mood: 'warm',
      beats: [
        { who: 'you', caption: true, art: LEGACY_STOOD, text: "And, God help them, the ones who stayed anyway." },
      ],
      ask: "The ones who didn't run. Sit with it — then finish this.",
      choices: [
        { id: 'sal', requires: ['sal_mole'], label: "Sal's still cooking Ricci's numbers wrong on purpose, every week, for you. He never once asked what it was for.", to: 'legacy_stood' },
        { id: 'pip', requires: ['pip_helped'], label: "Pip's hand healed crooked and he never once asked you for anything back.", to: 'legacy_stood' },
        { id: 'finn', requires: ['finn_helped'], label: "Mrs. Finn is still waiting on the one thing you promised her. She believed you'd keep it.", to: 'legacy_stood' },
        { id: 'runner', requires: ['runner_turned'], label: "Tommy could've run a hundred times over. He's still on the corner, watching your back instead of Ricci's.", to: 'legacy_stood' },
        { id: 'vera', requires: ['vera_turned'], label: "Vera picked you over every name she could have sold you for instead. She's the one debt on this whole climb you actually want to pay.", to: 'legacy_stood' },
        { id: 'bianchi', requires: ['bianchi_partner'], label: "Bianchi threw in with you all the way, and never once made you regret it.", to: 'legacy_stood' },
        { id: 'on', label: "That's the cost so far. Make it worth something — face him.", tone: 'push', to: 'move' },
      ],
    },

    // --- the move ---
    {
      id: 'move',
      mood: 'threat',
      beats: [
        { who: 'them', art: MOCK, text: "Well? You clawed up out of the gutter I made your father die in. What could you possibly have that frightens me." },
      ],
      ask: "Everything you turned in his house comes down to this. What do you put on the table?",
      choices: [
        { id: 'books', label: "The books — 'Adler's true ledger. Every dollar, every grave. The empire doesn't survive this.'", tone: 'push', requires: ['booksExposed'], to: 'c_take' },
        { id: 'siege', label: "His whole house — 'Otto's stepped aside. Ricci's been mine for months. There's no one in this house who's still yours.'", tone: 'push', requires: ['ottoTurned', 'ricciMole'], to: 'c_take' },
        { id: 'house', label: "His shield — 'Otto won't cover you. Your oldest hand already chose. You're alone in that chair.'", tone: 'push', requires: ['ottoTurned'], to: 'c_slip' },
        { id: 'mole', label: "Your collector — 'Ricci's been mine since the docks. Everything he did for you, he lays at your feet.'", tone: 'push', requires: ['ricciMole'], to: 'c_slip' },
        { id: 'nothing', label: "Face him with nerve alone — 'I'm taking all of it from you.'", tone: 'push', to: 'o_crushed' },
      ],
    },

    // --- decisive: you have enough. He loses control for the first time. ---
    {
      id: 'c_take',
      mood: 'threat',
      beats: [
        { who: 'them', art: PENDOWN, text: "(the pen goes down. for the first time, something moves behind the eyes — not fear, he has none, but the thing under it: he is not in control) …You've been in my house." },
        { who: 'you', art: LEVERAGE, text: "Every room. I didn't come to threaten the machine, Marlowe. I came to own the fact that it's already mine. Your people, your paper, your name. All of it, in my hand." },
        { who: 'them', art: CONCEDE, text: "(very slowly) …Then you understand what you're holding. What it makes you. Name your terms, boy. You've earned that much." },
        { who: 'you', caption: true, art: SEVENYEARS, text: "There it was. The floor coming out from under the man who took everything from us. Seven years, for this exact silence. And a choice I didn't expect to have to make." },
      ],
      ask: "He's finished — the empire is yours to name. So: what do you do with the machine that ate your father?",
      choices: [
        { id: 'take', label: "Take it — 'You sign it all to me. You retire. Quietly, or in a cell. I run it now.'", tone: 'push', to: 'take_reckon' },
        { id: 'burn', label: "Burn it — 'I don't want your empire. I want it gone. Everyone sees exactly what you are.'", tone: 'disarm', to: 'burn_reckon' },
      ],
    },

    // --- THE TWO POLES, EARNED: the ledger colors which one is hollow and which
    // is righteous. Self-looping the same way the roll call does, then landing
    // on the unchanged o_empire / o_burn. ---
    {
      id: 'take_reckon',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: TAKE_HOLLOW, text: "The word's out of your mouth before the weight of it lands. Somewhere under the floor of this house, every name you turned or spent to get here goes quiet at once." },
      ],
      ask: "You're about to become the machine that ate your father. Does anyone else get a say in that?",
      choices: [
        { id: 'sal', requires: ['sal_mole'], label: "Sal believed this would be someone's good deed for once, not a rung on somebody's ladder. He doesn't get a vote either.", to: 'take_reckon' },
        { id: 'runner', requires: ['runner_turned'], label: "Tommy watched your back for nothing but the idea that you were different from Ricci. You're one signature from proving him wrong.", to: 'take_reckon' },
        { id: 'vera', requires: ['vera_turned'], label: "Vera picked you over every buyer she had lined up. This is what she picked.", to: 'take_reckon' },
        { id: 'sallost', requires: ['sal_dead'], label: "Sal didn't live to see what his silence bought. It bought this.", to: 'take_reckon' },
        { id: 'veralost', requires: ['vera_dead'], label: "Vera didn't live to see what her silence bought either. Same answer.", to: 'take_reckon' },
        { id: 'go', label: "None of them are in the room. Only you are. Sign it.", tone: 'push', to: 'o_empire' },
      ],
    },
    {
      id: 'burn_reckon',
      mood: 'hope',
      beats: [
        { who: 'you', caption: true, art: BURN_WORTH, text: "The word costs you everything you could have owned. For one breath you let yourself feel exactly what that's worth, before it's gone for good." },
      ],
      ask: "You're about to walk away with nothing. Who was this actually for?",
      choices: [
        { id: 'sal', requires: ['sal_dead'], label: "For Sal, who never got to see Ricci's numbers add up honest.", to: 'burn_reckon' },
        { id: 'pip', requires: ['pip_dead'], label: "For Pip, whose hand never got the apology it was owed.", to: 'burn_reckon' },
        { id: 'finn', requires: ['finn_dead'], label: "For Mrs. Finn, who asked for exactly this and nothing more.", to: 'burn_reckon' },
        { id: 'vera', requires: ['vera_dead'], label: "For Vera, whose price finally got paid in something other than money.", to: 'burn_reckon' },
        { id: 'salstood', requires: ['sal_mole'], label: "For Sal too, still alive, still believing this could mean something.", to: 'burn_reckon' },
        { id: 'runnerstood', requires: ['runner_turned'], label: "For Tommy, who bet you were different and turned out to be right.", to: 'burn_reckon' },
        { id: 'go', label: "For your father, in the end. Say it.", tone: 'disarm', to: 'o_burn' },
      ],
    },

    // --- partial: one lever, not enough to finish him ---
    {
      id: 'c_slip',
      mood: 'cold',
      beats: [
        { who: 'them', art: RECOVERSMILE, text: "(a long, cold pause — then the faintest smile returns) …One piece. You turned one piece of my house and thought it was the whole board. Otto is old. Ricci is a dog on a long leash. Neither is the machine." },
        { who: 'you', art: PRESSHURT, text: "It's enough to hurt you." },
        { who: 'them', art: DISMISS, text: "Hurt. Yes. You've cost me a night's sleep and a loyal man. I'll have both back by morning. You should have brought the paper, boy. Everyone always forgets the paper." },
      ],
      choices: [{ id: 'go', label: 'He\'s right. You didn\'t bring enough.', tone: 'disarm', to: 'o_escape' }],
    },

    // --- endings ---
    {
      id: 'o_empire',
      mood: 'cold',
      portrait: END_EMPIRE,
      outcome: {
        key: 'empire', tone: 'mixed',
        title: 'MARLOWE — THE CHAIR IS YOURS',
        line: "He signs. Of course he signs — a cornered man always chooses the cell over the grave. By dawn the empire that broke your father answers to you. Every collector, every judge, every frightened bookkeeper. Yours.",
        ripple: "The Marlowe empire is yours. The man who ended your family is finished — and you sit in his chair now, holding his pen.",
        reflect: "I won. I have everything. And the first thing I did with it was study the room for exits and weakness, the way he always did. Ricci warned me. Ten years, he said. It didn't take ten.",
        deal: { closed: true, gotName: false, faceIdx: 0 },
        tag: 'THE END OF THE CLIMB',
        cta: 'SIT IN HIS CHAIR ▸',
        campaign: { money: 5000, ledger: ['ending_empire'] },
        debrief: { principle: 'the-mirror',
          note: "Notice what you reached for first, the second the chair was yours: exits, weaknesses, who's still loyal. That's not victory talking — that's **Marlowe's own instinct**, already installed. The mirror isn't a metaphor at the end of a six-chapter climb, it's the only tool you have left standing, because it's the one you spent every chapter sharpening on everyone else." },
      },
    },
    {
      id: 'o_burn',
      mood: 'hope',
      portrait: END_BURN,
      outcome: {
        key: 'burn', tone: 'good',
        title: 'MARLOWE — YOU BURNED IT DOWN',
        line: "You don't take the pen. You take the books to every paper and prosecutor who ever feared him. The empire doesn't change hands — it comes apart, in the light, for everyone to see. Marlowe ends not as a king dethroned but as a man in a courtroom, small.",
        ripple: "The Marlowe empire is ash. You inherit nothing but the truth — your father's name, cleared, and a coast finally free of him. You're still nobody. You're still yourself.",
        reflect: "I could have had all of it. I gave it away to keep the one thing he could never buy from me. For the first time since the shop, I think Pa would know my face.",
        deal: { closed: true, gotName: false, faceIdx: 2 },
        tag: 'THE END OF THE CLIMB',
        cta: 'WALK AWAY CLEAN ▸',
        campaign: { ledger: ['ending_burn'] },
        debrief: { principle: 'walk-away-power',
          note: "You had the whole empire signed and waiting, and you stood up from the table anyway. That's **walk-away power** taken to its limit — not just leaving a bad deal, but refusing a good one because what it costs you to keep it isn't worth what it lets you win. The hardest walk-away of the whole climb was never from the table where you were losing. It was from the one where you'd finally get everything." },
      },
    },
    {
      id: 'o_escape',
      mood: 'cold',
      portrait: END_ESCAPE,
      outcome: {
        key: 'escape', tone: 'mixed',
        title: 'MARLOWE — HE SLIPS THE NOOSE',
        line: "He was right — one lever wasn't the machine. By morning he's mended the crack, quietly disappeared the man you turned, and doubled the locks. You bloodied him. You didn't finish him. And now he knows your face and your reach.",
        ripple: "Marlowe survives — wounded, wary, and aware of you now. The war isn't lost, but it just got much harder. You should have brought the paper.",
        reflect: "I moved before I had enough, because I wanted it too badly. That's how men like me die — not from too little nerve, but from too much want.",
        deal: { closed: false, gotName: false, faceIdx: 1 },
        tag: 'HE GOT AWAY',
        cta: 'REGROUP ▸',
        heatDelta: 2,
        campaign: { ledger: ['ending_escape'] },
        debrief: { principle: 'leverage-and-batna',
          note: "One turned man wasn't the machine, and Marlowe's already recovering to prove it. **Leverage** is whatever makes him NEED to deal with you; without enough of it, his best alternative to dealing with you at all — quietly disappearing the crack, doubling the locks — beats anything you offered him. You moved with a fraction of what the moment needed, and a fraction of a BATNA isn't one." },
      },
    },
    {
      id: 'o_crushed',
      mood: 'threat',
      portrait: END_CRUSHED,
      outcome: {
        key: 'crushed', tone: 'bad',
        title: 'MARLOWE — HE BURIES YOU',
        line: "He lets you finish. Then he rings a small bell on his desk. \"You brought nothing but your father's temper. He had that too, at the end.\" The men who come through the door are very calm. So is he. He was always going to be.",
        ripple: "You moved on the untouchable man with nothing in your hand. Marlowe, never once out of control, ends you the way he ends every inconvenience — quietly, completely.",
        reflect: "Pa taught me to read a man before I moved on him. I forgot the lesson at the last table that mattered. …I hope, wherever he is, he wasn't watching.",
        deal: { closed: false, gotName: false, faceIdx: 2 },
        tag: 'THE END',
        cta: '— fade —',
        heatDelta: 4,
        campaign: { ledger: ['ending_crushed'] },
        debrief: { principle: 'prisoners-dilemma',
          note: "You didn't turn a single one of his people against each other, or against him — you walked in on nerve alone and hoped he'd fold rather than call it. Real leverage over a man like Marlowe comes from making his own people **afraid of each other's silence breaking first**; that manufactured fear of the other defecting is what wins a standoff like this one. You brought none of it, and a man who never blinks doesn't blink for nerve." },
      },
    },
  ],
};
