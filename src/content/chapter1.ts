import type { Chapter } from '../domain/board';

// Chapter 1 — Marlowe's operation. You're nobody. You work the people around
// Ricci so that when you sit down with him, he's already cracking.
export const CHAPTER_1: Chapter = {
  title: "MARLOWE'S DOCKS",
  moves: 3,
  targetId: 'ricci',
  nodes: [
    { id: 'you', name: 'YOU', role: 'nobody — yet', disposition: 4, x: 50, y: 84 },
    { id: 'ricci', name: 'RICCI', role: 'the collector', disposition: 2, dealTarget: true, x: 50, y: 52 },
    { id: 'sal', name: 'SAL', role: "Marlowe's bookkeeper", disposition: 2, x: 18, y: 40 },
    { id: 'crew', name: 'THE CREW', role: 'dock loaders', disposition: 2, x: 82, y: 40 },
    { id: 'bianchi', name: 'BIANCHI', role: 'rival collector', disposition: 2, x: 26, y: 66 },
    { id: 'marlowe', name: 'MARLOWE', role: 'the empire', disposition: 2, locked: true, x: 50, y: 16 },
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
      result: 'Sal slides you the second set of books. You hold Ricci’s skim.',
    },
    {
      id: 'crew_spook', nodeId: 'crew',
      label: 'Spook them',
      blurb: "Whisper that Marlowe's about to clean house. Loyalty is thin on the docks.",
      grants: ['crewSpooked'],
      result: "By morning Ricci's crew won't meet his eye. He sits down rattled.",
    },
    {
      id: 'crew_manifests', nodeId: 'crew',
      label: 'Buy a loader for the manifests',
      blurb: 'A month of shipping numbers, if the price is right.',
      grants: ['ledger'],
      result: 'Forty crates in, thirty-three reported. The ledger is yours.',
    },
    {
      id: 'ricci_study', nodeId: 'ricci',
      label: 'Study him first',
      blurb: 'Watch how he carries himself before you ever say a word.',
      grants: ['type'],
      result: 'Pure ego. Proud man — feed it, and never offer him charity.',
    },
    {
      id: 'bianchi_tip', nodeId: 'bianchi',
      label: 'Tip him that Ricci skims',
      blurb: 'Bianchi wants the territory. Give him a reason to circle.',
      grants: ['bianchiPressing'],
      dispositionDelta: { nodeId: 'bianchi', delta: 1 },
      result: "Bianchi starts sniffing around Ricci's routes. Ricci needs to close fast now.",
    },
  ],
};
