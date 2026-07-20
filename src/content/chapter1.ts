import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// Chapter 1 — Marlowe's operation. Every person you work is a MANIPULATION: they
// want something, and only the right read gets you what you came for. Nobody
// gives you anything for free. Sal fears for his life (safety works, money and
// threats backfire). The loader wants cash. The crew moves on self-interest.
// Bianchi's a peer — he needs proof it's worth his while, not your word or a
// threat.
export const CHAPTER_1: Chapter = {
  id: 'ch1',
  title: "MARLOWE'S DOCKS",
  moves: 3,
  targetId: 'ricci',
  nodes: [
    { id: 'you', name: 'YOU', role: 'nobody — yet', disposition: 4, x: 50, y: 85 },
    { id: 'ricci', name: 'RICCI', role: 'the collector', disposition: 2, dealTarget: true, portrait: `${A}/ricci.jpg`, x: 50, y: 50 },
    { id: 'sal', name: 'SAL', role: "Marlowe's bookkeeper", disposition: 2, portrait: `${A}/sal.jpg`, x: 17, y: 38 },
    { id: 'crew', name: 'THE CREW', role: 'dock loaders', disposition: 2, portrait: `${A}/crew.jpg`, x: 83, y: 38 },
    { id: 'bianchi', name: 'BIANCHI', role: 'rival collector', disposition: 2, portrait: `${A}/bianchi.jpg`, x: 24, y: 67 },
    { id: 'deluca', name: 'DELUCA', role: 'the man above Ricci', disposition: 2, locked: true, portrait: `${A}/deluca.jpg`, x: 50, y: 15 },
  ],
  edges: [
    { from: 'sal', to: 'ricci', label: 'hates' },
    { from: 'crew', to: 'ricci', label: 'fears' },
    { from: 'ricci', to: 'deluca', label: 'answers to' },
    { from: 'bianchi', to: 'ricci', label: 'envies' },
    { from: 'deluca', to: 'ricci', label: 'runs' },
  ],
  actions: [
    {
      id: 'sal_turn', nodeId: 'sal',
      label: 'Turn the bookkeeper',
      blurb: "He covers Ricci's books. He also knows exactly what Ricci skims.",
      grants: ['skim'],
      dispositionDelta: { nodeId: 'sal', delta: 2 },
      result: '',
      scene: [
        { who: 'them', text: "I don't know you. And I don't talk to people I don't know." },
        { who: 'you', text: "You keep Ricci's books. When the numbers don't add up, you're the one who hangs for it." },
        { who: 'them', text: "…So what. What do you want, and what's in it for me?" },
      ],
      ask: "Out. He's terrified of what Marlowe does to loose ends — he wants to survive Ricci.",
      options: [
        { text: "Promise to keep him clear when Ricci falls", good: true,
          result: 'Sal slides you the second set of books. You hold Ricci’s skim.',
          ripple: "Sal keeps looking at the door now. If Ricci sees him sweating, this goes bad." },
        { text: "Offer him cash for the ledger", good: false,
          result: "“Money? You think this is about money? They'll kill me.” He shuts down.",
          failDelta: { nodeId: 'sal', delta: -1 } },
        { text: "Threaten to tell Ricci he's been talking", good: false,
          result: "He goes white and bolts. Now he's more scared of you than useful.",
          failDelta: { nodeId: 'sal', delta: -1 },
          ripple: "Sal might warn Ricci that someone's circling." },
      ],
    },
    {
      id: 'crew_spook', nodeId: 'crew',
      label: 'Work the crew',
      blurb: "Big Enzo's loaders — squeezed by Ricci, and they knew your father.",
      grants: ['crewSpooked'],
      result: '',
      scene: [
        { who: 'you', text: "Word is Marlowe's trimming the fat. Anyone standing too close to Ricci." },
        { who: 'them', text: "…That's not our problem. We just move crates." },
        { who: 'you', text: "You move Ricci's crates. To Marlowe, that's the same thing." },
      ],
      ask: "A reason to step back from Ricci that doesn't make them look like rats.",
      options: [
        { text: "Let the rumor do it — Marlowe's cleaning house", good: true,
          result: "By morning Ricci's crew won't meet his eye. He'll sit down rattled.",
          ripple: "Ricci feels the cold shoulder from his own men. He's tense before you speak." },
        { text: "Pay them to walk off the job", good: false,
          result: "“You buying us? Ricci pays better — and he's here.” They tip him off.",
          failDelta: { nodeId: 'crew', delta: -1 },
          ripple: "Ricci hears someone tried to buy his crew out from under him." },
        { text: "Lean on them hard", good: false,
          result: "Dockworkers don't scare easy. They laugh you off the pier.",
          failDelta: { nodeId: 'crew', delta: -1 } },
      ],
    },
    {
      id: 'ricci_study', nodeId: 'ricci',
      label: 'Study him first',
      blurb: 'Watch how he carries himself before you ever say a word.',
      grants: ['type'],
      result: 'Pure ego. Proud man — feed it, and never offer him charity.',
      scene: [
        { who: 'them', text: "(across the street) — you watch him work a debtor." },
        { who: 'you', text: "He doesn't threaten. He humiliates. Makes the man beg where people can see." },
        { who: 'you', text: "It's not about the money for him. It's about being the biggest man in the room." },
      ],
    },
    {
      id: 'bianchi_tip', nodeId: 'bianchi',
      label: 'Set the rival on him',
      blurb: "Bianchi wants Ricci's territory. Give him a reason to move.",
      grants: ['bianchiPressing'],
      dispositionDelta: { nodeId: 'bianchi', delta: 1 },
      result: '',
      scene: [
        { who: 'them', text: "Why would I trust a word out of your mouth?" },
        { who: 'you', text: "Because it's worth Ricci's whole territory to you. He skims Marlowe." },
      ],
      ask: "Proof, or a reason it's in his interest — not just your say-so, and not a threat. He's a peer.",
      options: [
        { text: "Show him the skim is real — and it's his to take", good: true,
          result: "“If that's real, he's already dead. He just doesn't know it.” Bianchi starts circling.",
          ripple: "Bianchi's men appear at the edge of Ricci's docks. Ricci smells a rival." },
        { text: "Just tell him and expect him to act", good: false,
          result: "“Rumors. Come back when you've got something real.” He waves you off.",
          failDelta: { nodeId: 'bianchi', delta: -1 } },
        { text: "Pressure him into it", good: false,
          result: "“You don't lean on me, kid.” A peer doesn't take threats.",
          failDelta: { nodeId: 'bianchi', delta: -1 } },
      ],
    },
  ],
};
