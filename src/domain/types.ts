export type OpponentType = 'proud' | 'greedy' | 'scared' | 'believer' | 'pro';
export type AngleId = 'lean' | 'flatter' | 'plant_doubt' | 'bluff' | 'offer_out';
export type AgendaField = 'bottomLine' | 'fear' | 'lie';
export type MoodState = 'guarded' | 'rattled' | 'angry' | 'cornered' | 'folding';
export type EndState = 'ongoing' | 'folded' | 'dealt' | 'walked' | 'turned';
export type Band = 'lands' | 'neutral' | 'backfires';
export type Risk = 'safe' | 'uncertain' | 'high';

export interface ProbeEffect { hisComposure: number; yourComposure: number; leak?: AgendaField; leakAmount: number; band: Band; }
