import { describe, it, expect } from 'vitest';
import {
  initCampaign, canAfford, earn, spend, bumpFaction, bumpBond, record, learn,
  atRisk, applyCampaign, BOND_MAX, STAND_MAX, RISK_HEAT,
} from './campaign';

describe('campaign money', () => {
  it('earns and spends, never below zero', () => {
    let st = initCampaign(100);
    st = earn(st, 50);
    expect(st.money).toBe(150);
    st = spend(st, 40);
    expect(st.money).toBe(110);
  });
  it('refuses a spend it cannot afford (state unchanged)', () => {
    const st = initCampaign(30);
    expect(canAfford(st, 50)).toBe(false);
    expect(spend(st, 50).money).toBe(30);
  });
  it('is immutable', () => {
    const st = initCampaign(100);
    earn(st, 25);
    expect(st.money).toBe(100);
  });
});

describe('campaign standing & bonds clamp 0..MAX', () => {
  it('faction defaults to neutral 2 and clamps', () => {
    let st = initCampaign();
    st = bumpFaction(st, 'docks', 5);
    expect(st.factions.docks).toBe(STAND_MAX);
    st = bumpFaction(st, 'docks', -10);
    expect(st.factions.docks).toBe(0);
  });
  it('bond defaults to 2 and clamps', () => {
    let st = bumpBond(initCampaign(), 'sal', 9);
    expect(st.bonds.sal).toBe(BOND_MAX);
    st = bumpBond(st, 'sal', -9);
    expect(st.bonds.sal).toBe(0);
  });
});

describe('ledger & codex accrete', () => {
  it('records consequence flags without duplication', () => {
    let st = record(initCampaign(), 'sal_mole', 'ricci_broken');
    st = record(st, 'sal_mole');
    expect([...st.ledger].sort()).toEqual(['ricci_broken', 'sal_mole']);
  });
  it('learns principles into the codex', () => {
    const st = learn(initCampaign(), 'golden-bridge', 'loss-aversion', 'golden-bridge');
    expect(st.learned.size).toBe(2);
    expect(st.learned.has('golden-bridge')).toBe(true);
  });
});

describe('atRisk — weak bond + high heat is danger', () => {
  it('a weak bond is at risk once heat is high', () => {
    const st = bumpBond(initCampaign(), 'pip', -1); // 2 -> 1
    expect(atRisk(st, 'pip', RISK_HEAT)).toBe(true);
    expect(atRisk(st, 'pip', RISK_HEAT - 1)).toBe(false);
  });
  it('a strong bond rides out a hot chapter', () => {
    const st = bumpBond(initCampaign(), 'pip', 2); // 2 -> 4
    expect(atRisk(st, 'pip', 10)).toBe(false);
  });
});

describe('applyCampaign combines outcome deltas', () => {
  it('applies money, faction, bonds, ledger, learns together', () => {
    const st = applyCampaign(initCampaign(100), {
      money: -40,
      faction: { id: 'docks', delta: 1 },
      bonds: [{ id: 'sal', delta: 1 }, { id: 'pip', delta: -1 }],
      ledger: ['sal_mole'],
      learns: ['interests-not-positions'],
    });
    expect(st.money).toBe(60);
    expect(st.factions.docks).toBe(3);
    expect(st.bonds.sal).toBe(3);
    expect(st.bonds.pip).toBe(1);
    expect(st.ledger.has('sal_mole')).toBe(true);
    expect(st.learned.has('interests-not-positions')).toBe(true);
  });
  it('undefined delta is a no-op', () => {
    const st = initCampaign(50);
    expect(applyCampaign(st, undefined)).toBe(st);
  });
});
