import { describe, it, expect } from 'vitest';
import { initBoard, availableActions, takeAction, applyDealOutcome } from './board';
import { CHAPTER_1 } from '../content/chapter1';

const CH = CHAPTER_1;

describe('the web board', () => {
  it('starts with the moves budget and no flags', () => {
    const st = initBoard(CH);
    expect(st.movesLeft).toBe(3);
    expect(st.flags.size).toBe(0);
    expect(st.nodes.find((n) => n.id === 'marlowe')?.locked).toBe(true);
  });

  it('playing Sal right (success) grants the skim and warms him', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn', true);
    expect(st.flags.has('skim')).toBe(true);
    expect(st.movesLeft).toBe(2);
    expect(st.nodes.find((n) => n.id === 'sal')?.disposition).toBe(4);
  });

  it('playing him WRONG spends the move for nothing and can cost you', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn', false, { nodeId: 'sal', delta: -1 });
    expect(st.flags.has('skim')).toBe(false);       // you got nothing
    expect(st.movesLeft).toBe(2);                   // but the move is gone
    expect(st.nodes.find((n) => n.id === 'sal')?.disposition).toBe(1);  // and he's warier
    expect(st.done.has('sal_turn')).toBe(true);     // can't retry
  });

  it('every person-action offers an ASK and options where exactly one works', () => {
    const worked = CH.actions.filter((a) => a.options);
    expect(worked.length).toBeGreaterThan(0);
    for (const a of worked) {
      expect(a.ask).toBeTruthy();
      expect(a.options!.filter((o) => o.good).length).toBe(1);  // one right read
    }
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
