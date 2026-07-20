import type { Mission } from '../domain/mission';

// THE ENDGAME — Marlowe. You can't break him with a secret; you break him by
// making his own machine fail him. What you turned decides what's possible:
//   booksExposed (Adler)            → the paper that ends the empire — a clean win
//   ottoTurned + ricciMole together → his whole house is yours — a clean win
//   only one of them                → you hurt him, he slips (escape)
//   nothing                          → he's in full control; he crushes you
// The reached ending carries a `deal` the board applies (marks Marlowe dealt).
// The final choice is the theme's climax: TAKE his empire (become the cold man
// at the top — the mirror) or BURN it (keep yourself, inherit nothing but justice).
export const MARLOWE_ENDGAME: Mission = {
  id: 'marlowe_endgame',
  actionId: 'marlowe_move',
  nodeId: 'marlowe',
  label: 'Move on Marlowe',
  palette: 'marlowe',
  start: 's0_serene',
  nodes: [
    // --- reactive openings (game.ts picks via startAt), all → 'move' ---
    {
      id: 's0_serene',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, text: "Marlowe's study. The pen, the ledger, the same cold patience. He doesn't yet know his house has been walked through in the dark. He thinks he is, as he has always been, in control." },
        { who: 'them', text: "You wanted a moment of my time. You have it. Use it to tell me you've learned your place — or to make a mistake I can correct permanently." },
      ],
      choices: [{ id: 'go', label: 'Lay it on the table.', tone: 'disarm', to: 'move' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "He feels it before you say a word — a house that's gone quiet in the wrong way. His pen has stopped. Marlowe, who is never surprised, is listening for footsteps." },
        { who: 'them', text: "Something is off in my house. I can smell it. And here you are, Vidal's stray, wearing a face that's much too calm. …Talk." },
      ],
      choices: [{ id: 'go', label: 'Let the silence work, then speak.', tone: 'disarm', to: 'move' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, text: "One of them ran to him. Marlowe knew you were coming, and he's waiting the way a spider waits — perfectly still, everything already in place." },
        { who: 'them', text: "You tried to turn my people. One of them has more sense than the rest and told me. So. You've walked into my study to be buried in it. By all means — say your piece first." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. He's rattled under the ice — use it.", tone: 'disarm', to: 'move' }],
    },

    // --- the move ---
    {
      id: 'move',
      mood: 'threat',
      beats: [
        { who: 'them', text: "Well? You clawed up out of the gutter I made your father die in. What could you possibly have that frightens me." },
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
        { who: 'them', text: "(the pen goes down. for the first time, something moves behind the eyes — not fear, he has none, but the thing under it: he is not in control) …You've been in my house." },
        { who: 'you', text: "Every room. I didn't come to threaten the machine, Marlowe. I came to own the fact that it's already mine. Your people, your paper, your name. All of it, in my hand." },
        { who: 'them', text: "(very slowly) …Then you understand what you're holding. What it makes you. Name your terms, boy. You've earned that much." },
        { who: 'you', caption: true, text: "There it was. The floor coming out from under the man who took everything from us. Seven years, for this exact silence. And a choice I didn't expect to have to make." },
      ],
      ask: "He's finished — the empire is yours to name. So: what do you do with the machine that ate your father?",
      choices: [
        { id: 'take', label: "Take it — 'You sign it all to me. You retire. Quietly, or in a cell. I run it now.'", tone: 'push', to: 'o_empire' },
        { id: 'burn', label: "Burn it — 'I don't want your empire. I want it gone. Everyone sees exactly what you are.'", tone: 'disarm', to: 'o_burn' },
      ],
    },

    // --- partial: one lever, not enough to finish him ---
    {
      id: 'c_slip',
      mood: 'cold',
      beats: [
        { who: 'them', text: "(a long, cold pause — then the faintest smile returns) …One piece. You turned one piece of my house and thought it was the whole board. Otto is old. Ricci is a dog on a long leash. Neither is the machine." },
        { who: 'you', text: "It's enough to hurt you." },
        { who: 'them', text: "Hurt. Yes. You've cost me a night's sleep and a loyal man. I'll have both back by morning. You should have brought the paper, boy. Everyone always forgets the paper." },
      ],
      choices: [{ id: 'go', label: 'He\'s right. You didn\'t bring enough.', tone: 'disarm', to: 'o_escape' }],
    },

    // --- endings ---
    {
      id: 'o_empire',
      mood: 'cold',
      outcome: {
        key: 'empire', tone: 'mixed',
        title: 'MARLOWE — THE CHAIR IS YOURS',
        line: "He signs. Of course he signs — a cornered man always chooses the cell over the grave. By dawn the empire that broke your father answers to you. Every collector, every judge, every frightened bookkeeper. Yours.",
        ripple: "The Marlowe empire is yours. The man who ended your family is finished — and you sit in his chair now, holding his pen.",
        reflect: "I won. I have everything. And the first thing I did with it was study the room for exits and weakness, the way he always did. Ricci warned me. Ten years, he said. It didn't take ten.",
        deal: { closed: true, gotName: false, faceIdx: 0 },
        tag: 'THE END OF THE CLIMB',
        cta: 'SIT IN HIS CHAIR ▸',
      },
    },
    {
      id: 'o_burn',
      mood: 'hope',
      outcome: {
        key: 'burn', tone: 'good',
        title: 'MARLOWE — YOU BURNED IT DOWN',
        line: "You don't take the pen. You take the books to every paper and prosecutor who ever feared him. The empire doesn't change hands — it comes apart, in the light, for everyone to see. Marlowe ends not as a king dethroned but as a man in a courtroom, small.",
        ripple: "The Marlowe empire is ash. You inherit nothing but the truth — your father's name, cleared, and a coast finally free of him. You're still nobody. You're still yourself.",
        reflect: "I could have had all of it. I gave it away to keep the one thing he could never buy from me. For the first time since the shop, I think Pa would know my face.",
        deal: { closed: true, gotName: false, faceIdx: 2 },
        tag: 'THE END OF THE CLIMB',
        cta: 'WALK AWAY CLEAN ▸',
      },
    },
    {
      id: 'o_escape',
      mood: 'cold',
      outcome: {
        key: 'escape', tone: 'mixed',
        title: 'MARLOWE — HE SLIPS THE NOOSE',
        line: "He was right — one lever wasn't the machine. By morning he's mended the crack, quietly disappeared the man you turned, and doubled the locks. You bloodied him. You didn't finish him. And now he knows your face and your reach.",
        ripple: "Marlowe survives — wounded, wary, and aware of you now. The war isn't lost, but it just got much harder. You should have brought the paper.",
        reflect: "I moved before I had enough, because I wanted it too badly. That's how men like me die — not from too little nerve, but from too much want.",
        deal: { closed: false, gotName: false, faceIdx: 1 },
        tag: 'HE GOT AWAY',
        cta: 'REGROUP ▸',
      },
    },
    {
      id: 'o_crushed',
      mood: 'threat',
      outcome: {
        key: 'crushed', tone: 'bad',
        title: 'MARLOWE — HE BURIES YOU',
        line: "He lets you finish. Then he rings a small bell on his desk. \"You brought nothing but your father's temper. He had that too, at the end.\" The men who come through the door are very calm. So is he. He was always going to be.",
        ripple: "You moved on the untouchable man with nothing in your hand. Marlowe, never once out of control, ends you the way he ends every inconvenience — quietly, completely.",
        reflect: "Pa taught me to read a man before I moved on him. I forgot the lesson at the last table that mattered. …I hope, wherever he is, he wasn't watching.",
        deal: { closed: false, gotName: false, faceIdx: 2 },
        tag: 'THE END',
        cta: '— fade —',
      },
    },
  ],
};
