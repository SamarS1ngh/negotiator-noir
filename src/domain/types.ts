export type OpponentType = 'proud' | 'greedy' | 'scared' | 'believer' | 'pro';
export type AngleId = 'lean' | 'flatter' | 'plant_doubt' | 'bluff' | 'offer_out';
export type AgendaField = 'bottomLine' | 'fear' | 'lie';
export type MoodState = 'guarded' | 'rattled' | 'angry' | 'cornered' | 'folding';
export type EndState = 'ongoing' | 'folded' | 'dealt' | 'walked' | 'turned';
export type Band = 'lands' | 'neutral' | 'backfires';
export type Risk = 'safe' | 'uncertain' | 'high';

export interface ProbeEffect { hisComposure: number; yourComposure: number; leak?: AgendaField; leakAmount: number; band: Band; }

// subtext = the plain-language read of what he's REALLY doing beneath this reply.
export interface Statement { id: string; text: string; truth: 'true' | 'evasion' | 'lie'; contradicts?: string; subtext?: string; }
export interface Contradiction { id: string; statementId: string; against: string; kind: 'leverage' | 'statement'; }
export interface Leverage { id: string; label: string; text: string; targets: AgendaField; heldAtStart: boolean; }

export interface Line { id: string; angleId: AngleId; text: string; emits?: string; }
export interface Opponent {
  id: string; name: string; role: string; type: OpponentType; palette: string;
  moodStart: number; composureStart: number; yourComposureStart: number;
  agenda: Record<AgendaField, string>; debtAmount: number;
  art: { seed: number; states: Record<MoodState, string> };
  // presentation content (optional; UI falls back if absent) —
  objective?: { goal: string; why: string };            // on-screen stakes
  expressions?: Record<MoodState, string>;              // his face, per mood ("jaw tight · eyes flicking")
  tell?: { text: string; teach: string };               // a live tell + first-time plain-language teach
}
export interface Script { angles: AngleId[]; lines: Line[]; statements: Statement[]; leverage: Leverage[]; }
export interface DuelState {
  hisComposure: number; yourComposure: number; mood: MoodState;
  known: Record<AgendaField, number>; spentAngles: AngleId[];
  record: { statements: Statement[]; heldLeverage: Leverage[]; openContradictions: Contradiction[] };
  end: EndState; log: string[];
}
export type DuelAction =
  | { kind: 'probe'; lineId: string }
  | { kind: 'catch'; contradictionId: string }
  | { kind: 'deploy'; leverageId: string }
  | { kind: 'pressTell' }
  | { kind: 'walk' };   // player chooses to leave -> 'walked'
export interface DuelEvent { type: 'said' | 'band' | 'tell' | 'caught' | 'deployed' | 'leak' | 'end'; text: string; }
