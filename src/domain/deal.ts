// ---- THE DEAL: a real negotiation, not a health bar. A set of TERMS, each a
// row of ordered positions from HIS ideal (index 0) to YOUR ideal (last). Both
// sides weight the terms differently and secretly. You assemble a package; he
// weighs it against what he actually cares about and accepts, counters, or
// walks. You win by trading what's cheap to you for what's dear to you.
// Grounded in the r/gamedesign negotiation thread. Pure + deterministic.

export interface Term {
  id: string;
  label: string;
  positions: string[];   // [0] = his ideal ... [n-1] = your ideal
  hisWeight: number;     // how hard he resists giving ground here (his priority)
  youValue: number;      // how much the OUTCOME here is worth to YOU
  hardline?: boolean;    // a line he will walk over if pushed far with no leverage
}

export interface DealSpec {
  terms: Term[];
  hisOpening: Record<string, number>;   // the package he opens with (usually all his-ideal)
  startThreshold: number;               // how good the deal must be for him at round 1
  relaxPerRound: number;                // threshold drop each round he stays
  composureRelax: number;               // extra threshold drop per point of composure lost
  patience: number;                     // rounds before he walks
}

export type Offer = Record<string, number>;          // your position index per term
export type Leverage = Record<string, number>;       // leverage strength attached per term

export type TermReaction = 'fine' | 'resists' | 'hardline';
export interface DealResult {
  verdict: 'accept' | 'counter' | 'walk';
  netToHim: number;
  threshold: number;
  counter?: Offer;                       // present only when verdict === 'counter'
  reactions: Record<string, TermReaction>;
}

function term(spec: DealSpec, id: string): Term {
  const t = spec.terms.find((x) => x.id === id);
  if (!t) throw new Error(`unknown term ${id}`);
  return t;
}

function effectiveWeight(t: Term, lev: number): number {
  return Math.max(0, t.hisWeight - lev);
}

// How much your position on a term gives him (+) or takes from him (−), in his
// weighted currency. Offering his ideal gives him the term's full weight;
// offering your ideal takes it. Leverage erodes his resistance to being taken.
function concessionToHim(t: Term, offerIndex: number, lev: number): number {
  const last = t.positions.length - 1;
  const takenSteps = offerIndex;                 // distance from his ideal (0) toward yours
  const givenSteps = last - offerIndex;          // distance still on his side
  const w = effectiveWeight(t, lev);
  // net: what he keeps minus what you took, scaled by how much he cares
  return (givenSteps - takenSteps) * w / last;
}

// Current threshold: he demands a lot at first, relaxes as rounds pass and as
// you wear his composure down. Never drops below a floor (he won't be robbed).
export function thresholdFor(spec: DealSpec, round: number, composureLost: number): number {
  const relaxed = spec.startThreshold
    - spec.relaxPerRound * (round - 1)
    - spec.composureRelax * composureLost;
  return Math.max(-1, relaxed);
}

// A term is a `hardline` refusal if he cares (hardline flag), you pushed most of
// the way to your side, and you brought no leverage to cover it.
function reactionFor(t: Term, offerIndex: number, lev: number): TermReaction {
  const last = t.positions.length - 1;
  const pushedFar = offerIndex >= last - 0.0001 || offerIndex >= Math.ceil(last * 0.75);
  const eff = effectiveWeight(t, lev);
  if (t.hardline && pushedFar && eff >= t.hisWeight) return 'hardline';
  if (offerIndex > 0 && eff > 0 && offerIndex >= Math.ceil(last / 2)) return 'resists';
  return 'fine';
}

/**
 * Evaluate a proposed package. `round` is 1-based; `composureLost` is how far
 * his composure has fallen (pressure makes him deal). Returns whether he takes
 * it, counters (with the package he'd accept instead), or walks.
 */
export function evaluate(
  spec: DealSpec,
  offer: Offer,
  leverage: Leverage,
  round: number,
  composureLost: number,
): DealResult {
  const threshold = thresholdFor(spec, round, composureLost);
  const reactions: Record<string, TermReaction> = {};
  let netToHim = 0;
  let crossedHardline = false;

  for (const t of spec.terms) {
    const idx = offer[t.id] ?? spec.hisOpening[t.id] ?? 0;
    const lev = leverage[t.id] ?? 0;
    netToHim += concessionToHim(t, idx, lev);
    const r = reactionFor(t, idx, lev);
    reactions[t.id] = r;
    if (r === 'hardline') crossedHardline = true;
  }

  if (crossedHardline) {
    // he might still swallow it if the rest of the package is generous AND the
    // round is late (desperate) — otherwise a hard line is a walk.
    if (netToHim < threshold + 1) return { verdict: 'walk', netToHim, threshold, reactions };
  }

  if (netToHim >= threshold) return { verdict: 'accept', netToHim, threshold, reactions };

  // he counters: pull the terms that hurt him most back toward his ideal until
  // the package clears the threshold (or he's back at his opening).
  const counter: Offer = {};
  for (const t of spec.terms) counter[t.id] = offer[t.id] ?? spec.hisOpening[t.id] ?? 0;

  const order = [...spec.terms].sort((a, b) => {
    const la = effectiveWeight(a, leverage[a.id] ?? 0);
    const lb = effectiveWeight(b, leverage[b.id] ?? 0);
    return lb - la; // hardest-for-him (still-weighted) first
  });

  let net = netToHim;
  let guard = 0;
  while (net < threshold && guard < 50) {
    guard += 1;
    let moved = false;
    for (const t of order) {
      const cur = counter[t.id] ?? 0;
      if (cur > 0) {
        const before = concessionToHim(t, cur, leverage[t.id] ?? 0);
        counter[t.id] = cur - 1;
        const after = concessionToHim(t, cur - 1, leverage[t.id] ?? 0);
        net += after - before;
        moved = true;
        if (net >= threshold) break;
      }
    }
    if (!moved) break; // everything is at his ideal already; can't counter further
  }

  return { verdict: 'counter', netToHim, threshold, counter, reactions };
}

// Your score on a closed deal: how much of what YOU wanted you actually got.
export function scoreDeal(spec: DealSpec, offer: Offer): number {
  let got = 0;
  let max = 0;
  for (const t of spec.terms) {
    const last = t.positions.length - 1;
    const idx = offer[t.id] ?? 0;
    got += (idx / last) * t.youValue;
    max += t.youValue;
  }
  return max === 0 ? 0 : got / max; // 0..1
}

export function grade(fraction: number): string {
  if (fraction >= 0.92) return 'S';
  if (fraction >= 0.78) return 'A';
  if (fraction >= 0.6) return 'B';
  if (fraction >= 0.4) return 'C';
  return 'F';
}
