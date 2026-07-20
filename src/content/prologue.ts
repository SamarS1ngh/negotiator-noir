import type { Beat } from '../domain/board';

// The frame. Answers the questions the missions kept skipping: who you are, why
// you're doing this NOW, and why anyone as small as you gets a hearing. Your
// angle isn't money or muscle — it's that you have nothing left to take, and
// you've spent months learning exactly who's afraid.
export const PROLOGUE: Beat[] = [
  { who: 'you', caption: true, text: 'Eighteen months ago my father owed the Marlowe empire more than he could ever pay. They didn\'t break his legs. They broke his name — in front of everyone he knew.' },
  { who: 'you', caption: true, text: 'Then he broke himself. And the debt didn\'t die with him. It walked across the city and knocked on my door.' },
  { who: 'you', caption: true, text: 'Ricci collects it now. Ricci answers to Marlowe. And Marlowe answers to no one — and lets no one within a mile of him. You don\'t walk up to a man like that. You climb to him. One rung at a time.' },
  { who: 'you', caption: true, text: 'You can\'t fight an empire from the gutter. So you don\'t fight it. You take it apart — one frightened man at a time.' },
  { who: 'you', caption: true, text: 'I\'ve spent months in the dark of these docks. Watching. Learning who flinches. Who drinks. Who\'s one bad night away from running.' },
  { who: 'you', caption: true, text: 'No money. No name. No one left to lose. People think that makes me harmless. It makes me the most dangerous thing on this waterfront — a man with nothing to take.' },
  { who: 'you', caption: true, text: 'It starts small. With the bookkeeper. Sal. The one who flinches when he hears the boss\'s name.' },
];
