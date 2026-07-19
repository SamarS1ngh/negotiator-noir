import type { Chapter } from '../domain/board';

const A = 'assets/art/cast';

// Chapter 1 — Marlowe's operation. You're nobody. You work the people around
// Ricci so that when you sit down with him, he's already cracking. Each action
// is a short face-to-face you play out — you MEET them, they react.
export const CHAPTER_1: Chapter = {
  title: "MARLOWE'S DOCKS",
  moves: 3,
  targetId: 'ricci',
  nodes: [
    { id: 'you', name: 'YOU', role: 'nobody — yet', disposition: 4, x: 50, y: 85 },
    { id: 'ricci', name: 'RICCI', role: 'the collector', disposition: 2, dealTarget: true, portrait: `${A}/ricci.jpg`, x: 50, y: 50 },
    { id: 'sal', name: 'SAL', role: "Marlowe's bookkeeper", disposition: 2, portrait: `${A}/sal.jpg`, x: 17, y: 38 },
    { id: 'crew', name: 'THE CREW', role: 'dock loaders', disposition: 2, portrait: `${A}/crew.jpg`, x: 83, y: 38 },
    { id: 'bianchi', name: 'BIANCHI', role: 'rival collector', disposition: 2, portrait: `${A}/bianchi.jpg`, x: 24, y: 67 },
    { id: 'marlowe', name: 'MARLOWE', role: 'the empire', disposition: 2, locked: true, portrait: `${A}/marlowe.jpg`, x: 50, y: 15 },
  ],
  edges: [
    { from: 'sal', to: 'ricci', label: 'hates' },
    { from: 'crew', to: 'ricci', label: 'fears' },
    { from: 'ricci', to: 'marlowe', label: 'fears' },
    { from: 'bianchi', to: 'ricci', label: 'envies' },
    { from: 'marlowe', to: 'ricci', label: 'trusts' },
  ],
  actions: [
    {
      id: 'sal_turn', nodeId: 'sal',
      label: 'Promise him a way out',
      blurb: "He's terrified of Marlowe and sick of covering Ricci. Give him a lifeline.",
      grants: ['skim'],
      dispositionDelta: { nodeId: 'sal', delta: 2 },
      scene: [
        { who: 'them', text: "I don't know you. And I don't talk to people I don't know." },
        { who: 'you', text: "You talk to Ricci. And Ricci's going to bury you when the numbers don't add up." },
        { who: 'them', text: "…You can't protect me. Nobody can." },
        { who: 'you', text: "I can. Give me the second book, and when Ricci falls, you're not standing next to him." },
        { who: 'them', text: "…God help me. Here. The real ledger. Everything he skims." },
      ],
      result: 'Sal slides you the second set of books. You hold Ricci’s skim.',
      ripple: "Sal keeps looking at the door now. If Ricci notices him sweating, this goes bad fast.",
    },
    {
      id: 'crew_spook', nodeId: 'crew',
      label: 'Spook them',
      blurb: "Whisper that Marlowe's about to clean house. Loyalty is thin on the docks.",
      grants: ['crewSpooked'],
      scene: [
        { who: 'you', text: "Word is Marlowe's trimming the fat. Anyone close to Ricci." },
        { who: 'them', text: "…That's not our problem. We just move crates." },
        { who: 'you', text: "You move Ricci's crates. To Marlowe, that's the same thing." },
        { who: 'them', text: "…We'll keep our heads down. Ricci's on his own." },
      ],
      result: "By morning Ricci's crew won't meet his eye. He sits down rattled.",
      ripple: "Ricci feels the cold shoulder from his own men. He's tense before you've said a word.",
    },
    {
      id: 'crew_manifests', nodeId: 'crew',
      label: 'Buy a loader for the manifests',
      blurb: 'A month of shipping numbers, if the price is right.',
      grants: ['ledger'],
      scene: [
        { who: 'you', text: "A month of manifests. What's it cost me?" },
        { who: 'them', text: "…More than you'd think. Ricci finds out, I'm in the harbor." },
        { who: 'you', text: "He won't. And this covers the risk." },
        { who: 'them', text: "…Forty crates in. Thirty-three on paper. Every week. Take it." },
      ],
      result: 'Forty crates in, thirty-three reported. The ledger is yours.',
      ripple: "A loader's been asking questions. Ricci's people start watching the paperwork.",
    },
    {
      id: 'ricci_study', nodeId: 'ricci',
      label: 'Study him first',
      blurb: 'Watch how he carries himself before you ever say a word.',
      grants: ['type'],
      scene: [
        { who: 'them', text: "(across the street) — you watch him work a debtor." },
        { who: 'you', text: "He doesn't threaten. He humiliates. Makes the man beg where people can see." },
        { who: 'you', text: "It's not about the money for him. It's about being the biggest man in the room." },
      ],
      result: 'Pure ego. Proud man — feed it, and never offer him charity.',
    },
    {
      id: 'bianchi_tip', nodeId: 'bianchi',
      label: 'Tip him that Ricci skims',
      blurb: 'Bianchi wants the territory. Give him a reason to circle.',
      grants: ['bianchiPressing'],
      dispositionDelta: { nodeId: 'bianchi', delta: 1 },
      scene: [
        { who: 'them', text: "Why would I trust anything you tell me?" },
        { who: 'you', text: "Because it's true, and it's worth Ricci's whole territory to you. He skims Marlowe." },
        { who: 'them', text: "…If that's real, he's already dead. He just doesn't know it." },
        { who: 'you', text: "So start circling. Make him feel it." },
      ],
      result: "Bianchi starts sniffing around Ricci's routes. Ricci needs to close fast now.",
      ripple: "Bianchi's men appear at the edge of Ricci's docks. Ricci knows a rival smells blood.",
    },
  ],
};
