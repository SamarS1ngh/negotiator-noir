import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, grounded in
// Delaney's own world: a cramped back room over The Anchor, a union bar,
// mimeographed leaflets pinned three-deep on a corkboard, a bottle of cheap
// rye sweating on a card table, the bar's jukebox thumping faintly through
// the floorboards below.
const ESTABLISH = 'assets/art/scene/delaney_establish.jpg'; // wide: pinning a fresh leaflet, back to the door
const DISMISS = 'assets/art/scene/delaney_dismiss.jpg';     // "dues box is by the door" without turning
const APPROACH = 'assets/art/scene/delaney_approach.jpg';   // "I'm neither" — your silhouette in his doorway
const WATCHFUL = 'assets/art/scene/delaney_watchful.jpg';   // turns fast, sizing you up, eyes to the petitions
const PROOFREAD = 'assets/art/scene/delaney_proofread.jpg'; // reads the proof cold, no smile, already calculating
const INTERRUPT = 'assets/art/scene/delaney_interrupt.jpg'; // head snaps to the door — boots on the stairs
const FREEZE = 'assets/art/scene/delaney_freeze.jpg';       // dead still, calls the boots off like it's nothing
const COVER = 'assets/art/scene/delaney_cover.jpg';         // you cover loud, he clocks how smooth that was
const CONFRONT = 'assets/art/scene/delaney_confront.jpg';  // door wrenched open — empty landing, rattled
const EDGE = 'assets/art/scene/delaney_edge.jpg';           // turns the knife back — leash or just his?
const TRUST = 'assets/art/scene/delaney_trust.jpg';         // something eases — not a leash, then
const SKEPTIC = 'assets/art/scene/delaney_skeptic.jpg';     // unimpressed, wants something he can hold
const TRAP = 'assets/art/scene/delaney_trap.jpg';           // names the sunk-cost trap before you can set it
const BACKING = 'assets/art/scene/delaney_backing.jpg';     // ink-stained handshake — common cause, not friendship
const ALONE = 'assets/art/scene/delaney_alone.jpg';         // pockets it, already gone, unleashed
const WAVED = 'assets/art/scene/delaney_waved.jpg';         // back at the corkboard, you were never there
const INSULTED = 'assets/art/scene/delaney_insulted.jpg';   // flat cold eyes, already moving for the bar phone

// DELANEY — the young union firebrand who wants Kastner's chair. A PEER, not
// a mark, and unlike Bianchi's money and muscle, Delaney has only nerve, a
// slow-built following, and three years of quiet, careful work he's terrified
// of losing. THE WOVEN READ is the opening fork: his tell isn't fear of a
// stranger, it's a glance at his own stack of signed petition sheets — a man
// checking his investment is still safe. The correct read is that he moves on
// PROOF plus his own ambition and nothing else; he despises being led (offering
// to patronize/mentor him) and despises being threatened same as any proud
// peer, but he *also* despises being told to keep waiting — a wrong read that
// walks straight into the sunk-cost trap he's already half-escaped once.
// THE COMPLICATION: the moment he's hooked by the proof, boots on the stairs
// and a shout up through the floor interrupt the exchange — Kastner's people
// are jumpier than usual lately (echoing the vanished men over the crates) —
// a freeze/cover/confront choice under pressure, before he turns the knife
// back on you same as Bianchi did: is this a leash, or is it really his?
// Four endings:
//   BACKING  — he works Kastner from inside while feeding you what he learns (triangulation, done right)
//   ALONE    — he takes the proof and cuts you loose, moving for the chair solo (the danger: he could take it all himself)
//   WAVED    — no proof, or a promise instead of one → dismissed, nothing moves
//   INSULTED — threatened, he protects what he's built and warns Kastner instead
// Using Delaney at all means arming an ambitious twenty-six-year-old against a
// man who's held that chair for twenty years — even the good ending is a bet
// you don't get to call in early.
export const DELANEY_MISSION: Mission = {
  id: 'delaney_mission',
  actionId: 'delaney_turn',
  nodeId: 'delaney',
  label: 'Set the union rival loose',
  palette: 'bianchi',
  scene: 'assets/art/scene/delaney.jpg',
  teaches: ['triangulation', 'sunk-cost'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: ESTABLISH, text: "Delaney runs the back room over The Anchor two nights a week — dues meetings that are really planning sessions, and everyone on the docks knows it. Twenty-six years old, ink on both cuffs from running his own leaflets off a borrowed mimeograph because the union hall won't touch them. Kastner's held that chair twenty years. Delaney's the first man in a decade who actually thinks he can take it." },
        { who: 'you', caption: true, art: ESTABLISH, text: "He's not like Bianchi — no muscle behind him, no money of his own. Just nerve, a following that keeps quietly growing, and the patience to wait for an opening. Which is exactly what you're about to hand him." },
        { who: 'them', art: DISMISS, text: "(pinning a fresh leaflet to the corkboard without turning around) If you're here about dues, the box is by the door. If Kastner sent you, tell him the rent on this room's still fair." },
        { who: 'you', art: APPROACH, text: 'Neither one.' },
        { who: 'them', art: WATCHFUL, text: "(turns, fast, sizing you up) Then you've got about two minutes before the bar needs me back downstairs. Talk." },
        { who: 'you', caption: true, art: WATCHFUL, text: "His eyes don't go to your face, or your hands. They flick to the stack of signed petition sheets on his desk — three years of quiet work — checking it's still there, still safe, before he even looks at you properly. Not a man afraid of a stranger. A man afraid of losing what he's already built." },
      ],
      ask: "A young rival already deep into his own long game. Read him past the two minutes: does he move because you lead him, because you threaten him, because he's owed patience for the years he's put in, or only because you hand him something real and let his own want finish the job?",
      choices: [
        { id: 'proof_manifest', label: "Hand him Halloran's manifest — 'Kastner signs off on cargo that never existed. It's real, and it's yours to use.'", tone: 'disarm', requires: ['manifestProof'], to: 'p_proof' },
        { id: 'proof_customs', label: "Hand him Breen's customs ledger — 'Kastner's cargo moves on a bought customs man. Proof, not rumor.'", tone: 'disarm', requires: ['customsProof'], to: 'p_proof' },
        { id: 'interest', label: "His hunger — 'That chair's yours the day Kastner slips. You know it.'", tone: 'press', to: 'i1' },
        { id: 'patience', label: "His patience — 'You've built this much in three years. A few more won't kill you.'", tone: 'disarm', to: 'pt1' },
        { id: 'threaten', label: "Lean on him — 'Help me, or Kastner hears exactly whose leaflets these are.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- you have proof: cold and calculating, then the complication hits ---
    {
      id: 'p_proof',
      mood: 'cold',
      beats: [
        { who: 'them', art: PROOFREAD, text: "(takes it, reads fast — no smile, nothing that easy) …Kastner's own hand on paper for cargo that was never on any boat. Three hundred men's dues have been paying his lawyer every time one of those crates costs somebody a name. (looks up, flat and certain) This is him. Finished. He just doesn't know the date yet." },
        { who: 'you', caption: true, art: PROOFREAD, text: "No wolf's grin, not like Bianchi. Delaney's colder than that — he's not savoring it, he's already three moves down the board, working out how to spend it." },
        { who: 'them', art: INTERRUPT, text: "(folding it away fast, all business) — then his head snaps toward the door. Boots on the stairs outside, unhurried, and a voice bawling up through the floor: 'Delaney! Sully wants to know if you're still closing up, or if he oughta send someone to check!'" },
      ],
      ask: "Someone's already on the stairs, calling his name — and 'send someone to check' means Kastner's people are jumpier than usual lately. What do you do?",
      choices: [
        { id: 'freeze', label: 'Freeze — stay dead still, let him handle it.', tone: 'disarm', to: 'p_freeze' },
        { id: 'cover', label: "Cover it, loud and easy — 'Closing up, two minutes!'", tone: 'press', to: 'p_cover' },
        { id: 'confront', label: 'Get ahead of it — open the door yourself.', tone: 'push', to: 'p_confront' },
      ],
    },

    // --- THE COMPLICATION: three ways through it, all landing on the same test ---
    {
      id: 'p_freeze',
      mood: 'tense',
      beats: [
        { who: 'them', art: FREEZE, text: "(dead still, listening — then calls back down, easy as breathing) Closing up, five minutes, tell Sully to keep his shirt on. (the boots recede) …I've had a lot of practice sounding like nothing's happening up here." },
        { who: 'them', art: EDGE, text: "(turns back to you, and it lands — you just watched exactly how careful he has to be, every single week) You saw that. Same as you saw the petition sheets. So now you know precisely what I've got to lose — which means I need to know precisely why you're handing me a way to lose it. Are you here to make me useful, walk me around on a leash the same as Kastner walks his stewards? Or is this actually just… mine?" },
      ],
      ask: "He's not testing whether you're a spy. He's testing whether you're just another man who wants to run him. Hold your answer steady.",
      choices: [
        { id: 'nerve', label: "Steady — 'Yours. What you do with it after is yours. I just need Kastner rattled — however you manage that.'", tone: 'disarm', to: 'p_edge' },
        { id: 'overpromise', label: "Flinch, talk fast — 'Just use it, we're square, forget you saw any of this—'", tone: 'press', to: 'o_alone' },
        { id: 'counterthreat', label: "Threaten him too — 'And if you run to Kastner with this, everyone downstairs learns exactly who sold them out.'", tone: 'push', to: 'o_insulted' },
      ],
    },
    {
      id: 'p_cover',
      mood: 'tense',
      beats: [
        { who: 'you', art: COVER, text: "(loud, breezy, before he can even open his mouth) Just finishing the count up here — two minutes!" },
        { who: 'them', art: EDGE, text: "(the boots move off; he studies you a beat too long) That was smooth. Smoother than a stranger off the street has any business being. (sets the proof down slow) So now I've got to ask — are you here to make me useful, walk me around on a leash the same as Kastner walks his stewards? Or is this actually just… mine?" },
      ],
      ask: "He's not testing whether you're a spy. He's testing whether you're just another man who wants to run him. Hold your answer steady.",
      choices: [
        { id: 'nerve', label: "Steady — 'Yours. What you do with it after is yours. I just need Kastner rattled — however you manage that.'", tone: 'disarm', to: 'p_edge' },
        { id: 'overpromise', label: "Flinch, talk fast — 'Just use it, we're square, forget you saw any of this—'", tone: 'press', to: 'o_alone' },
        { id: 'counterthreat', label: "Threaten him too — 'And if you run to Kastner with this, everyone downstairs learns exactly who sold them out.'", tone: 'push', to: 'o_insulted' },
      ],
    },
    {
      id: 'p_confront',
      mood: 'threat',
      beats: [
        { who: 'you', art: CONFRONT, text: "You're at the door before he can stop you, wrenching it open — empty landing, just the jukebox thumping up from the bar below and a fire door swinging shut on its own hinge. Whoever it was is already gone, or never came up at all." },
        { who: 'them', art: EDGE, text: "(rattled — first time anyone but him has seen how thin his cover really runs) Nobody's supposed to see that. Nobody. So now you know precisely how careful I've had to be — which means I need to know precisely why you're handing me a way to blow it all. Are you here to make me useful, walk me around on a leash the same as Kastner walks his stewards? Or is this actually just… mine?" },
      ],
      ask: "He's not testing whether you're a spy. He's testing whether you're just another man who wants to run him. Hold your answer steady.",
      choices: [
        { id: 'nerve', label: "Steady — 'Yours. What you do with it after is yours. I just need Kastner rattled — however you manage that.'", tone: 'disarm', to: 'p_edge' },
        { id: 'overpromise', label: "Flinch, talk fast — 'Just use it, we're square, forget you saw any of this—'", tone: 'press', to: 'o_alone' },
        { id: 'counterthreat', label: "Threaten him too — 'And if you run to Kastner with this, everyone downstairs learns exactly who sold them out.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- the edge: partner, or he takes it and goes alone ---
    {
      id: 'p_edge',
      mood: 'cold',
      beats: [
        { who: 'them', art: TRUST, text: "(something eases in him — whatever he was listening for, it wasn't there) …Not a leash, then. Good. I've had one of those on me since I was nineteen, and I've spent three years chewing through it." },
      ],
      ask: "He's hooked, and thinking for himself now — the same knife's edge Bianchi tested you with, younger and hungrier. Keep him needing you, or let him go and hope he does the job clean?",
      choices: [
        { id: 'leash', label: "Keep it — 'There's more coming. Halloran's books, the customs skim. You want the rest, you work with me, not around me.'", tone: 'disarm', to: 'o_backing' },
        { id: 'free', label: "Let him go — 'Take it and run. I don't need a partner. I need Kastner rattled.'", tone: 'push', to: 'o_alone' },
        { id: 'threaten2', label: "Threaten him too — 'And don't get any ideas about cutting me out after.'", tone: 'push', to: 'o_insulted' },
      ],
    },

    // --- no proof: he wants something he can hold ---
    {
      id: 'i1',
      mood: 'tense',
      beats: [
        { who: 'them', art: SKEPTIC, text: "(a short, humorless laugh) 'The chair's yours the day he slips' — I've had that whispered at me by every steward who wanted my signature on something and had nothing to show me after. You want me to move on Kastner, bring me something he can't talk his way around. Not a feeling. Not a maybe." },
      ],
      ask: "He wants something he can hold, not a compliment. What do you actually have?",
      choices: [
        { id: 'proof_manifest2', label: "Then here it is — Halloran's manifest.", tone: 'disarm', requires: ['manifestProof'], to: 'p_proof' },
        { id: 'proof_customs2', label: "Then here it is — Breen's customs ledger.", tone: 'disarm', requires: ['customsProof'], to: 'p_proof' },
        { id: 'promise', label: "Promise it — 'Get me in a room with him and I'll bring you the rest after.'", tone: 'press', to: 'o_waved' },
        { id: 'push', label: "Push — 'You're really going to keep waiting for a nod that's never coming?'", tone: 'push', to: 'o_waved' },
      ],
    },

    // --- patience misread: the sunk-cost trap, named before you can set it ---
    {
      id: 'pt1',
      mood: 'cold',
      beats: [
        { who: 'them', art: TRAP, text: "(the look on his face isn't amused) Three more years. That's cute. You know how many men have told me to just wait a little longer — like the years I've already spent are a reason to spend more, not a reason to stop? Nine years I've told myself that exact thing. Every leaflet, every dues meeting, every 'not yet.' I'm not doing that math again for a stranger." },
        { who: 'you', caption: true, art: TRAP, text: "He named the trap out loud before you could even set it — he's already caught himself in it once. 'Wait' isn't currency with a man like this. Not anymore." },
      ],
      ask: "He just talked himself out of the exact thing you were selling. Salvage this, or let it die?",
      choices: [
        { id: 'proof_manifest3', label: "Don't ask him to wait — 'Here's why you don't have to.'", tone: 'disarm', requires: ['manifestProof'], to: 'p_proof' },
        { id: 'proof_customs3', label: "Don't ask him to wait — 'Here's why you don't have to.'", tone: 'disarm', requires: ['customsProof'], to: 'p_proof' },
        { id: 'plead', label: "Press it anyway — 'Still — a little more patience—'", tone: 'press', to: 'o_waved' },
      ],
    },

    // --- endings ---
    {
      id: 'o_backing',
      mood: 'hope',
      portrait: BACKING,
      outcome: {
        key: 'backing', tone: 'good',
        title: 'DELANEY — A RIVAL WORTH HAVING',
        line: "He pockets the proof and it's already decided. \"Halloran's books too, when you've got them. I'll start on the shop stewards quiet, one at a time, till Kastner's the only man on the docks who doesn't see it coming.\" He offers a hand — ink-stained, sure grip. Not friendship. Common cause.",
        ripple: "Delaney starts working the union floor out from under Kastner, steward by steward. By the time you sit across the table from him, Kastner will already feel his own chair shifting and have no idea why.",
        reflect: "I just set a hungry twenty-six-year-old loose on a man twice his age and called it strategy. My father would know the shape of this. He just wouldn't have had the stomach for it.",
        grants: ['unionRival', 'delaney_backing'],
        dispositions: [{ nodeId: 'delaney', set: 4 }],
        campaign: { bonds: [{ id: 'delaney', delta: 2 }], faction: { id: 'union', delta: 1 }, ledger: ['delaney_backing'] },
        debrief: { principle: 'triangulation',
          note: "You didn't fight Kastner yourself — you handed a hungry rival the one thing he needed and let his own ambition do the work no punch of yours could manage. That's **triangulation**: instead of matching Kastner's strength directly, you made a third party's self-interest do it for you, and you stayed the one point both sides still need. The empire fights itself; you just have to stand where the fighting needs you." },
      },
    },
    {
      id: 'o_alone',
      mood: 'cold',
      portrait: ALONE,
      outcome: {
        key: 'alone', tone: 'mixed',
        title: 'DELANEY — GONE HIS OWN WAY',
        line: "He folds the proof away and he's already halfway to the door. \"Appreciate it. Truly.\" And he's gone — not your rival anymore, not your ally either. Just a young man with a live grenade and nobody left to tell him when to pull the pin.",
        ripple: "Kastner will feel the shake regardless — Delaney's not subtle and he's not waiting on you. But whatever happens next, you won't see it coming, and neither will he see the twenty years Kastner's spent learning exactly how to survive a young man's ambition.",
        reflect: "I handed him a knife and told him to go find his own throat to cut. Cheaper than staying his handler. I'm getting good at cheap.",
        grants: ['unionRival'],
        worldFlags: ['delaneyRival'],
        dispositions: [{ nodeId: 'delaney', set: 1 }],
        campaign: { bonds: [{ id: 'delaney', delta: -1 }], ledger: ['delaney_alone'] },
        debrief: { principle: 'triangulation',
          note: "You built the triangle and then let go of it. Real **triangulation** means staying the pivot both sides still need — the moment the proof cost him nothing, he had no reason left to keep you in the room. Kastner's survived twenty years of ambitious young men; Delaney alone against that is a gamble you started and won't get to finish." },
      },
    },
    {
      id: 'o_waved',
      mood: 'cold',
      portrait: WAVED,
      outcome: {
        key: 'waved', tone: 'bad',
        title: 'DELANEY — NOT WORTH THE RISK',
        line: "He's already back at the corkboard, pinning the leaflet like you were never in the room. \"Come back with something real, or don't come back.\" Nothing moves. He's exactly where Kastner left him.",
        ripple: "Delaney files you under 'wasted my two minutes' — and a man that careful doesn't hand out a second audience easily.",
        reflect: "Wishes and patience. He's spent nine years learning neither one pays out, and I offered him more of both.",
        dispositions: [{ nodeId: 'delaney', set: 2 }],
        campaign: { bonds: [{ id: 'delaney', delta: -1 }], ledger: ['delaney_waved'] },
        debrief: { principle: 'sunk-cost',
          note: "He's already lived the **sunk-cost fallacy** once — nine years telling himself the time already spent was a reason to spend more — and clawed his own way out of believing it. Asking for more patience, or trading on a promise instead of proof, asks him to fall back into the exact trap he's spent years escaping. He's not sinking one more year into a maybe." },
      },
    },
    {
      id: 'o_insulted',
      mood: 'threat',
      portrait: INSULTED,
      outcome: {
        key: 'insulted', tone: 'bad',
        title: 'DELANEY — YOU MADE AN ENEMY',
        line: "Something goes flat and cold behind his eyes. \"You just threatened to hand my name to Kastner. Funny — I was about to do you a favor.\" He's already moving past you, down toward the bar phone, and you don't get to stop him.",
        ripple: "Delaney doesn't gamble on you — he cuts the new threat loose the fast way and warns Kastner someone's circling. Kastner tightens up before you ever reach the table.",
        reflect: "I threatened a kid who's survived worse men than me for three years, and he did the smart thing: got rid of the new danger before it cost him what he'd already built.",
        heatDelta: 2,
        worldFlags: ['kastnerForewarned'],
        dispositions: [{ nodeId: 'delaney', set: 0 }],
        campaign: { bonds: [{ id: 'delaney', delta: -2 }], faction: { id: 'union', delta: -1 }, ledger: ['delaney_insulted'] },
        debrief: { principle: 'sunk-cost',
          note: "Kastner has twenty years sunk into that chair — enough that a young man's proof alone was never going to topple him fast, and Delaney understood that better than you did. Rather than gamble the three years he's already built protecting a stranger who threatens him, he cut his losses immediately and warned the one man who could actually protect what's left of it. You threatened someone who knew exactly what he had to lose, and exactly how to protect it." },
      },
    },
  ],
};
