import { describe, it, expect } from 'vitest';
import { initBoard, availableActions, takeAction, dealPrep, applyDealOutcome } from './board';
import { CHAPTER_1 } from '../content/chapter1';

const CH = CHAPTER_1;

describe('the web board', () => {
  it('starts with the moves budget and no flags', () => {
    const st = initBoard(CH);
    expect(st.movesLeft).toBe(3);
    expect(st.flags.size).toBe(0);
    expect(st.nodes.find((n) => n.id === 'marlowe')?.locked).toBe(true);
  });

  it('turning Sal grants the skim and warms him', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn');
    expect(st.flags.has('skim')).toBe(true);
    expect(st.movesLeft).toBe(2);
    expect(st.nodes.find((n) => n.id === 'sal')?.disposition).toBe(4);
  });

  it('an action can only be taken once, and not past the move budget', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn');
    expect(availableActions(CH, st, 'sal').some((a) => a.id === 'sal_turn')).toBe(false);
    // burn the last two moves
    st = takeAction(CH, st, 'crew_spook');
    st = takeAction(CH, st, 'ricci_study');
    expect(st.movesLeft).toBe(0);
    const before = st;
    st = takeAction(CH, st, 'bianchi_tip');   // no moves left
    expect(st).toBe(before);                  // unchanged
  });

  it('prep: the flags you set become the hand you carry into the deal', () => {
    const p = dealPrep(new Set(['skim', 'ledger', 'type', 'crewSpooked', 'bianchiPressing']));
    expect([...p.intel]).toContain('lev:skims');
    expect([...p.intel]).toContain('lev:ledger');
    expect([...p.intel]).toContain('type');
    expect(p.startComposureLost).toBe(12);    // crew spooked → he's rattled
    expect(p.thresholdDelta).toBeCloseTo(-0.4); // Bianchi pressing → he wants to close
  });

  it('no prep = you walk in cold and empty-handed', () => {
    const p = dealPrep(new Set());
    expect(p.intel.size).toBe(0);
    expect(p.startComposureLost).toBe(0);
    expect(p.thresholdDelta).toBe(0);
  });

  it('taking the name unlocks Marlowe; saving his face makes him an ally', () => {
    const st = initBoard(CH);
    const after = applyDealOutcome(CH, st, { closed: true, gotName: true, faceIdx: 0 });
    expect(after.nodes.find((n) => n.id === 'marlowe')?.locked).toBe(false);
    expect(after.nodes.find((n) => n.id === 'ricci')?.disposition).toBe(4);   // ally / mole
    expect(after.nodes.find((n) => n.id === 'ricci')?.dealTarget).toBe(false);
  });

  it('humiliating him makes him an enemy and does NOT unlock Marlowe', () => {
    const st = initBoard(CH);
    const after = applyDealOutcome(CH, st, { closed: true, gotName: false, faceIdx: 2 });
    expect(after.nodes.find((n) => n.id === 'ricci')?.disposition).toBe(0);   // enemy
    expect(after.nodes.find((n) => n.id === 'marlowe')?.locked).toBe(true);
  });
});
