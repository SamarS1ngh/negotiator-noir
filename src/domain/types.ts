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

// ---- RECON: intel you dig up before the sit-down. What you find becomes your
// hand at the table (see the recon spec). `lev:<leverageId>` unlocks that
// leverage card; 'type'/'tell'/'lie' fill your dossier on him. ----
export type IntelId = 'type' | 'tell' | 'lie' | `lev:${string}`;
export interface Lead { id: string; label: string; blurb: string; grants: IntelId; dossier: string; }
export interface Recon { digs: number; leads: Lead[]; }

// ---- his PUSHES: moves he makes against YOU, so the duel volleys both ways.
// `hold` = standing firm (the right read); `cave` = giving ground (bleeds you). ----
export interface PushOption { text: string; kind: 'hold' | 'cave'; reply: string; dossier?: string; }
export interface Push { id: string; line: string; options: PushOption[]; }

export interface Opponent {
  id: string; name: string; role: string; type: OpponentType; palette: string;
  moodStart: number; composureStart: number; yourComposureStart: number;
  agenda: Record<AgendaField, string>; debtAmount: number;
  art: { seed: number; states: Record<MoodState, string> };
  // presentation content (optional; UI falls back if absent) —
  objective?: { goal: string; why: string };            // on-screen stakes
  opener?: string;                                       // his first line before you've moved (cinematic scene)
  expressions?: Record<MoodState, string>;              // his face, per mood ("jaw tight · eyes flicking")
  tell?: { text: string; teach: string };               // a live tell + first-time plain-language teach
  breakReveal?: { quote: string; names: string; teach: string }; // what he coughs up at composure 0 (the fold payoff)
  recon?: Recon;                                        // leads you can chase before the sit-down
  pushes?: Push[];                                       // his moves against you (the volley)
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
