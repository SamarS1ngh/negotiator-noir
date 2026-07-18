import { describe, it, expect } from 'vitest';
import { evaluate, scoreDeal, grade, thresholdFor } from './deal';
import type { Offer, Leverage } from './deal';
import { COLLECTOR_DEAL, LEVERAGE_TERM } from '../content/collector_deal';

const R = COLLECTOR_DEAL;
const noLev: Leverage = {};
function lev(...cards: string[]): Leverage {
  const l: Leverage = {};
  for (const c of cards) { const m = LEVERAGE_TERM[c]; if (m) l[m.term] = (l[m.term] ?? 0) + m.strength; }
  return l;
}

describe('the deal — a negotiation, not a health bar', () => {
  it('his opening package is all his — you accepting it is a total loss', () => {
    const offer: Offer = { ...R.hisOpening };
    const res = evaluate(R, offer, noLev, 1, 0);
    // he'd of course take his own dream deal
    expect(res.verdict).toBe('accept');
    expect(scoreDeal(R, offer)).toBeLessThan(0.2);
    expect(grade(scoreDeal(R, offer))).toBe('F');
  });

  it('grabbing everything for yourself, cold, makes him WALK', () => {
    const greedy: Offer = { debt: 3, name: 2, face: 2, paper: 1 }; // take it all, humiliate him, no leverage
    const res = evaluate(R, greedy, noLev, 1, 0);
    expect(res.verdict).toBe('walk');
  });

  it('pushing for the name with NO leverage is a hard line he refuses', () => {
    const offer: Offer = { debt: 0, name: 2, face: 0, paper: 0 }; // only ask: name Marlowe, give him everything else
    const res = evaluate(R, offer, noLev, 1, 0);
    expect(res.reactions.name).toBe('hardline');
    expect(res.verdict).not.toBe('accept');
  });

  it('the skim leverage erodes his resistance — now he WILL give the name', () => {
    const offer: Offer = { debt: 0, name: 2, face: 0, paper: 0 };
    const res = evaluate(R, offer, lev('skims'), 1, 0);
    expect(res.reactions.name).not.toBe('hardline');
    expect(res.verdict).toBe('accept');
  });

  it('the winning TRADE: give him face + half the money to take the name (with skim) + paper', () => {
    // cheap-to-you gives: he saves face (youValue 0), you pay half. dear takes:
    // he names Marlowe (backed by the skim), the paper is torn.
    const trade: Offer = { debt: 1, name: 2, face: 0, paper: 1 };
    const res = evaluate(R, trade, lev('skims'), 2, 8);
    expect(res.verdict).toBe('accept');
    const s = scoreDeal(R, trade);
    expect(s).toBeGreaterThan(0.6);          // you got most of what mattered to you
    expect(['S', 'A', 'B']).toContain(grade(s));
  });

  it('when he cannot accept, he COUNTERS with a package he would take', () => {
    const tooGreedy: Offer = { debt: 2, name: 2, face: 1, paper: 1 }; // pay nothing, name, no leverage
    const res = evaluate(R, tooGreedy, noLev, 2, 0);
    expect(res.verdict === 'counter' || res.verdict === 'walk').toBe(true);
    if (res.verdict === 'counter') {
      // his counter must be something he'd actually accept
      const check = evaluate(R, res.counter!, noLev, 2, 0);
      expect(check.verdict).toBe('accept');
      // and it pulls the terms back toward HIS side
      expect(res.counter!.name ?? 0).toBeLessThanOrEqual(tooGreedy.name ?? 0);
    }
  });

  it('he gets more willing over time and under pressure (threshold relaxes)', () => {
    const early = thresholdFor(R, 1, 0);
    const late = thresholdFor(R, 5, 40);
    expect(late).toBeLessThan(early);
  });

  it('the ledger leverage lets you drop the money he would otherwise fight for', () => {
    const noProof = evaluate(R, { debt: 2, name: 0, face: 0, paper: 0 }, noLev, 1, 0);   // pay nothing, cold
    const withProof = evaluate(R, { debt: 2, name: 0, face: 0, paper: 0 }, lev('ledger'), 1, 0);
    // proof makes the same "pay nothing" package sit better with him
    expect(withProof.netToHim).toBeGreaterThan(noProof.netToHim);
  });
});
