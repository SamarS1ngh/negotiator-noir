import type { IntelId, MoodState, Opponent, OpponentType } from '../domain/types';
import { moodFor } from '../domain/engine';
import type { DealSpec, Offer, Leverage, TermReaction } from '../domain/deal';
import { evaluate, scoreDeal, grade } from '../domain/deal';
import { renderDeal } from '../ui/dealsheet';
import type { DealHandlers, TermRow, LeverageChip } from '../ui/dealsheet';
import { renderDealOutcome } from '../ui/dealoutcome';

const TEST = import.meta.env.MODE === 'test';
const TIMING = { REACT: 1100 };
const COMPOSURE_PER_ROUND = 6;   // he wears down as the sit-down drags on

export interface LevTermMap { [leverageId: string]: { term: string; strength: number } }

// what your work on the board hands you when you sit down
export interface DealPrep {
  startComposureLost?: number;   // he's already rattled coming in
  patienceDelta?: number;
  thresholdDelta?: number;       // he's under pressure to close
}

// the deal's result, handed back so the board can rewrite itself
export interface DealOutcome { closed: boolean; gotName: boolean; faceIdx: number; }

/**
 * THE DEAL — the negotiation. You and Ricci both want several things, ranked
 * secretly and differently. You set a package on the deal sheet, lay down the
 * leverage you dug up, and put it to him; he weighs it against what he actually
 * cares about and accepts, counters, or walks. You win by trading what's cheap
 * to you (his pride, a little money) for what's dear (the name, the debt dead).
 * Spec: docs/superpowers/specs/2026-07-18-the-deal-mechanic-design.md
 */
export function startDeal(
  root: HTMLElement,
  opp: Opponent,
  spec: DealSpec,
  levTerm: LevTermMap,
  intel: Set<IntelId>,
  believed: OpponentType,
  prep: DealPrep,
  onDone?: (o: DealOutcome) => void,
): void {
  void believed;

  const offer: Offer = { ...spec.hisOpening };
  const hisStance: Offer = { ...spec.hisOpening };
  const attached: Record<string, string> = {};             // termId -> leverageId
  // the leverage cards you actually dug up in recon
  const held: LeverageChip[] = Object.keys(levTerm)
    .filter((id) => intel.has(`lev:${id}` as IntelId))
    .map((id) => ({ id, label: cardLabel(id), term: levTerm[id]!.term }));

  const effSpec: DealSpec = {
    ...spec,
    patience: Math.max(2, spec.patience + (prep.patienceDelta ?? 0)),
    startThreshold: spec.startThreshold + (prep.thresholdDelta ?? 0),
  };

  let round = 1;
  let patienceLeft = effSpec.patience;
  let composureLost = prep.startComposureLost ?? 0;   // your board-work already wore him down
  let reactions: Record<string, TermReaction> = {};
  let hisLine = opp.opener ?? "Let's hear it. What are you offering?";
  let reacting = false;
  let closed = false;

  const handlers: DealHandlers = { setTerm, attach, detach, propose, acceptCounter, walk };

  function cardLabel(id: string): string {
    const map: Record<string, string> = { skims: 'He skims his boss', ledger: 'The second ledger' };
    return map[id] ?? id;
  }

  function leverageMap(): Leverage {
    const l: Leverage = {};
    for (const [termId, levId] of Object.entries(attached)) {
      const m = levTerm[levId];
      if (m) l[termId] = (l[termId] ?? 0) + m.strength;
    }
    return l;
  }

  function mood(): MoodState { return moodFor(100 - composureLost); }

  function chipsAvailable(): LeverageChip[] {
    const used = new Set(Object.values(attached));
    return held.filter((c) => !used.has(c.id));
  }

  function rows(): TermRow[] {
    return spec.terms.map((t) => {
      const levId = Object.entries(attached).find(([term]) => term === t.id)?.[1];
      return {
        id: t.id,
        label: t.label,
        positions: t.positions,
        yourIdx: offer[t.id] ?? 0,
        hisIdx: hisStance[t.id] ?? 0,
        reaction: reactions[t.id],
        leverageId: levId,
        leverageLabel: levId ? cardLabel(levId) : undefined,
      };
    });
  }

  function hasCounter(): boolean {
    return spec.terms.some((t) => (hisStance[t.id] ?? 0) !== (offer[t.id] ?? 0));
  }

  function draw(): void {
    renderDeal(root, opp, {
      objective: opp.objective?.goal ?? 'THE DEAL',
      hisName: opp.name,
      mood: mood(),
      rows: rows(),
      round,
      patienceLeft,
      patienceTotal: effSpec.patience,
      hisLine,
      chips: chipsAvailable(),
      hasCounter: hasCounter(),
      reacting,
    }, handlers);
  }

  function setTerm(termId: string, idx: number): void {
    if (reacting) return;
    offer[termId] = idx;
    reactions = {};   // clear last read once you start rebuilding
    draw();
  }

  function attach(leverageId: string): void {
    if (reacting) return;
    const m = levTerm[leverageId];
    if (!m) return;
    attached[m.term] = leverageId;
    draw();
  }

  function detach(termId: string): void {
    if (reacting) return;
    delete attached[termId];
    draw();
  }

  function propose(): void {
    if (reacting || closed) return;
    const res = evaluate(effSpec, offer, leverageMap(), round, composureLost);
    reactions = res.reactions;

    if (res.verdict === 'accept') {
      closeDeal({ ...offer }, 'accept');
      return;
    }
    if (res.verdict === 'walk') {
      hisLine = walkLine(res.reactions);
      react('settle', () => showOutcome({ walked: true }));
      return;
    }

    // counter
    round += 1;
    patienceLeft -= 1;
    composureLost += COMPOSURE_PER_ROUND;
    if (res.counter) for (const t of spec.terms) hisStance[t.id] = res.counter[t.id] ?? hisStance[t.id] ?? 0;

    if (patienceLeft <= 0) {
      hisLine = "I'm done haggling. Take what's on the table or get out.";
      react('lean', draw);   // his stance stands; you must accept it or walk
      return;
    }
    hisLine = counterLine(res.reactions);
    react(worst(res.reactions) === 'fine' ? 'shift' : 'lean', draw);
  }

  function acceptCounter(): void {
    if (reacting || closed) return;
    for (const t of spec.terms) offer[t.id] = hisStance[t.id] ?? 0;
    closeDeal({ ...hisStance }, 'accept');
  }

  function walk(): void {
    if (closed) return;
    showOutcome({ walked: true });
  }

  function closeDeal(finalOffer: Offer, _how: 'accept'): void {
    void _how;
    closed = true;
    hisLine = '…Fine. We have a deal.';
    const frac = scoreDeal(spec, finalOffer);
    react('impact', () => showOutcome({ finalOffer, frac }));
  }

  // his reply plays: portrait reacts, controls locked, then `after`
  function react(shot: 'impact' | 'lean' | 'settle' | 'shift', after: () => void): void {
    reacting = true;
    const stage = renderStage();
    if (stage) {
      if (shot === 'impact') { stage.shot('shake'); stage.impact(); stage.strike('lands'); }
      else if (shot === 'lean') stage.shot('push');
      else if (shot === 'settle') { stage.shot('pull'); stage.strike('backfires'); }
      else stage.shift();
    }
    if (TEST) { reacting = false; after(); return; }
    setTimeout(() => { reacting = false; after(); }, TIMING.REACT);
  }

  function renderStage() {
    return renderDeal(root, opp, {
      objective: opp.objective?.goal ?? 'THE DEAL',
      hisName: opp.name, mood: mood(), rows: rows(), round,
      patienceLeft, patienceTotal: effSpec.patience, hisLine,
      chips: chipsAvailable(), hasCounter: hasCounter(), reacting: true,
    }, handlers);
  }

  function showOutcome(o: { walked?: boolean; finalOffer?: Offer; frac?: number }): void {
    const nameTerm = spec.terms.find((t) => t.id === 'name');
    if (o.walked) {
      renderDealOutcome(root, opp, {
        walked: true, gradeLetter: 'F',
        terms: spec.terms.map((t) => ({ label: t.label, got: 'no deal' })),
        namedHim: false,
      }, () => onDone?.({ closed: false, gotName: false, faceIdx: 2 }));
      return;
    }
    const frac = o.frac ?? 0;
    const g = grade(frac);
    const fin = o.finalOffer!;
    const gotName = Boolean(nameTerm && (fin.name ?? 0) >= nameTerm.positions.length - 1);
    const faceIdx = fin.face ?? 0;
    renderDealOutcome(root, opp, {
      walked: false, gradeLetter: g,
      terms: spec.terms.map((t) => ({ label: t.label, got: t.positions[fin[t.id] ?? 0]! })),
      namedHim: gotName,
    }, () => onDone?.({ closed: true, gotName, faceIdx }));
  }

  draw();
}

function worst(r: Record<string, TermReaction>): TermReaction {
  const v = Object.values(r);
  if (v.includes('hardline')) return 'hardline';
  if (v.includes('resists')) return 'resists';
  return 'fine';
}

function counterLine(r: Record<string, TermReaction>): string {
  switch (worst(r)) {
    case 'hardline': return "No. That part's not happening — and you know it. Here's what I'll do.";
    case 'resists': return "You're reaching. This is closer to fair.";
    default: return "…Almost. Meet me here and we're done.";
  }
}

function walkLine(r: Record<string, TermReaction>): string {
  if (worst(r) === 'hardline') return "You've got some nerve. We're finished. Get out.";
  return "I don't think you're serious. We're done.";
}
