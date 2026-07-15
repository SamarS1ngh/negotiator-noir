export type OpponentType = 'proud' | 'greedy' | 'scared' | 'believer' | 'pro';
export type AngleId = 'lean' | 'flatter' | 'plant_doubt' | 'bluff' | 'offer_out';
export type AgendaField = 'bottomLine' | 'fear' | 'lie';
export type MoodState = 'guarded' | 'rattled' | 'angry' | 'cornered' | 'folding';
export type EndState = 'ongoing' | 'folded' | 'dealt' | 'walked' | 'turned';
export type Band = 'lands' | 'neutral' | 'backfires';
export type Risk = 'safe' | 'uncertain' | 'high';

export interface ProbeEffect { hisComposure: number; yourComposure: number; leak?: AgendaField; leakAmount: number; band: Band; }

export interface Statement { id: string; text: string; truth: 'true' | 'evasion' | 'lie'; contradicts?: string; }
export interface Contradiction { id: string; statementId: string; against: string; kind: 'leverage' | 'statement'; }
export interface Leverage { id: string; label: string; text: string; targets: AgendaField; heldAtStart: boolean; }
