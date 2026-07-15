import type { Script } from '../domain/types';

export const COLLECTOR_SCRIPT: Script = {
  angles: ['lean', 'flatter', 'plant_doubt', 'bluff', 'offer_out'],

  lines: [
    // lean — target: fear
    { id: 'l_lean1', angleId: 'lean', text: "You're a long way from your boss's office, Ricci.", emits: 's_leash' },
    { id: 'l_lean2', angleId: 'lean', text: 'Careful. I know exactly who signs your checks.' },
    { id: 'l_lean3', angleId: 'lean', text: 'One call and this becomes his problem, not yours.' },

    // flatter — target: bottomLine
    { id: 'l_flat1', angleId: 'flatter', text: 'Word is you never miss, never negotiate. Efficient.', emits: 's_efficient' },
    { id: 'l_flat2', angleId: 'flatter', text: 'A man who runs his own book — that takes discipline.' },
    { id: 'l_flat3', angleId: 'flatter', text: "You didn't get this territory by being sloppy." },

    // plant_doubt — target: lie
    { id: 'l_doubt1', angleId: 'plant_doubt', text: 'Marlowe quoted me different terms than you did.', emits: 's_book' },
    { id: 'l_doubt2', angleId: 'plant_doubt', text: "Funny — your own crew doesn't back that number.", emits: 's_number' },
    { id: 'l_doubt3', angleId: 'plant_doubt', text: 'You sure this is even your call to make?' },

    // bluff — target: lie
    { id: 'l_bluff1', angleId: 'bluff', text: "I've got the ledger. Every skim, dated.", emits: 's_count_self' },
    { id: 'l_bluff2', angleId: 'bluff', text: 'Keep lying, see how that plays upstairs.' },
    { id: 'l_bluff3', angleId: 'bluff', text: 'You really want to test what I already know?' },

    // offer_out — target: bottomLine
    { id: 'l_offer1', angleId: 'offer_out', text: 'Walk with half now — no one upstairs hears a word.', emits: 's_count_never' },
    { id: 'l_offer2', angleId: 'offer_out', text: 'Take the deal before it comes off the table.' },
    { id: 'l_offer3', angleId: 'offer_out', text: 'This is the easy way out, Ricci. Take it.' },
  ],

  statements: [
    { id: 's_leash', text: "He doesn't need to know how I collect.", truth: 'evasion' },
    { id: 's_efficient', text: "I don't miss. I don't negotiate. Not with anyone.", truth: 'lie' },
    { id: 's_book', text: "I run my own book. I don't answer to Marlowe.", truth: 'lie', contradicts: 'skims' },
    { id: 's_number', text: "The number's the number. Nobody argues it twice.", truth: 'lie' },
    { id: 's_count_self', text: 'I count every crate myself, down to the last case.', truth: 'lie' },
    { id: 's_count_never', text: "Counting? I've never once touched a crate myself.", truth: 'lie', contradicts: 's_count_self' },
  ],

  leverage: [
    { id: 'skims', label: 'He skims his own boss', text: 'He skims off the top and hides it in a second book.', targets: 'fear', heldAtStart: true },
    { id: 'ledger', label: 'The second ledger', text: 'A ledger proving he under-reports to Marlowe.', targets: 'bottomLine', heldAtStart: true },
  ],
};
