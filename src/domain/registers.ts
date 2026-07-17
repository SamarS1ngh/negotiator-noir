import type { Band, MoodState, OpponentType } from './types';

// ---- REGISTERS: the three ways you can come at a man, as gestures.
//   press  (swipe up)   — lean on him, escalate
//   stare  (hold)       — silence, let doubt do the work
//   ease   (swipe down) — soften, give him a way out
//
// Which one lands is NOT fixed — it moves with his STATE. That's the whole
// read: recon tells you his nature (the rule), his face tells you where he is
// right now, and you judge each beat. A proud man reads mercy as weakness
// (ease always backfires), silence gets into him while he's composed, and once
// he's off balance you press. He re-sets between — so you have to keep reading,
// never settle into one move.
export type Register = 'press' | 'stare' | 'ease';

type MoodTable = Record<MoodState, Record<Register, Band>>;

const PROUD: MoodTable = {
  // composed: silence gets in; pressing bounces off ego; mercy insults him
  guarded: { stare: 'lands', press: 'neutral', ease: 'backfires' },
  // off balance: now pressure tells; silence lets him re-set
  rattled: { press: 'lands', stare: 'neutral', ease: 'backfires' },
  // he's loud and swinging: let silence hang, don't match his volume
  angry: { stare: 'lands', press: 'neutral', ease: 'backfires' },
  // cornered: push him over
  cornered: { press: 'lands', stare: 'neutral', ease: 'backfires' },
  folding: { press: 'lands', stare: 'lands', ease: 'neutral' },
};

// Other types are stubs for the campaign — the slice only ships Ricci (proud).
const GREEDY: MoodTable = {
  guarded: { ease: 'lands', press: 'neutral', stare: 'backfires' },
  rattled: { ease: 'lands', stare: 'neutral', press: 'backfires' },
  angry: { ease: 'lands', press: 'neutral', stare: 'backfires' },
  cornered: { press: 'lands', ease: 'neutral', stare: 'backfires' },
  folding: { press: 'lands', ease: 'lands', stare: 'neutral' },
};
const SCARED: MoodTable = {
  guarded: { ease: 'lands', stare: 'neutral', press: 'backfires' },
  rattled: { press: 'lands', ease: 'neutral', stare: 'backfires' },
  angry: { ease: 'lands', stare: 'neutral', press: 'backfires' },
  cornered: { press: 'lands', ease: 'neutral', stare: 'backfires' },
  folding: { press: 'lands', ease: 'lands', stare: 'neutral' },
};
const BELIEVER: MoodTable = {
  guarded: { stare: 'lands', ease: 'neutral', press: 'backfires' },
  rattled: { stare: 'lands', press: 'neutral', ease: 'backfires' },
  angry: { ease: 'lands', stare: 'neutral', press: 'backfires' },
  cornered: { stare: 'lands', press: 'neutral', ease: 'backfires' },
  folding: { stare: 'lands', press: 'lands', ease: 'neutral' },
};
const PRO: MoodTable = {
  guarded: { stare: 'lands', ease: 'neutral', press: 'backfires' },
  rattled: { press: 'lands', stare: 'neutral', ease: 'backfires' },
  angry: { stare: 'lands', ease: 'neutral', press: 'backfires' },
  cornered: { ease: 'lands', press: 'neutral', stare: 'backfires' },
  folding: { press: 'lands', stare: 'lands', ease: 'neutral' },
};

const TABLES: Record<OpponentType, MoodTable> = {
  proud: PROUD, greedy: GREEDY, scared: SCARED, believer: BELIEVER, pro: PRO,
};

export function bandForRegister(type: OpponentType, mood: MoodState, reg: Register): Band {
  return TABLES[type][mood][reg];
}

// Each register speaks through one of the scripted angles.
export const REGISTER_ANGLE = { press: 'lean', stare: 'plant_doubt', ease: 'offer_out' } as const;
