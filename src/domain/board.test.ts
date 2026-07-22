import { describe, it, expect } from 'vitest';
import { initBoard, availableActions, takeAction, applyDealOutcome } from './board';
import { CHAPTER_1 } from '../content/chapter1';

const CH = CHAPTER_1;

describe('the web board', () => {
  it('starts clean — no flags, no heat, target locked', () => {
    const st = initBoard(CH);
    expect(st.flags.size).toBe(0);
    expect(st.heat).toBe(0);
    expect(st.nodes.find((n) => n.id === 'deluca')?.locked).toBe(true);
  });

  it('playing Sal right (success) grants the skim and warms him', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn', true);
    expect(st.flags.has('skim')).toBe(true);
    expect(st.nodes.find((n) => n.id === 'sal')?.disposition).toBe(4);
  });

  it('playing him WRONG grants nothing, marks him done, and can cost you', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn', false, { nodeId: 'sal', delta: -1 });
    expect(st.flags.has('skim')).toBe(false);       // you got nothing
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

  it('each person can be worked only once, but there is no move budget', () => {
    let st = initBoard(CH);
    st = takeAction(CH, st, 'sal_turn');
    expect(availableActions(CH, st, 'sal').some((a) => a.id === 'sal_turn')).toBe(false);
    // keep working people — nothing caps you now; heat is the only cost
    st = takeAction(CH, st, 'crew_spook');
    st = takeAction(CH, st, 'ricci_study');
    st = takeAction(CH, st, 'bianchi_tip');
    expect(st.done.size).toBe(4);             // all four worked, no budget stopped you
    // but a second attempt on someone already worked is a no-op
    const before = st;
    st = takeAction(CH, st, 'sal_turn');
    expect(st).toBe(before);                  // unchanged
  });

  it('taking the name unlocks Marlowe; saving his face makes him an ally', () => {
    const st = initBoard(CH);
    const after = applyDealOutcome(CH, st, { closed: true, gotName: true, faceIdx: 0 });
    expect(after.nodes.find((n) => n.id === 'deluca')?.locked).toBe(false);
    expect(after.nodes.find((n) => n.id === 'ricci')?.disposition).toBe(4);   // ally / mole
    expect(after.nodes.find((n) => n.id === 'ricci')?.dealTarget).toBe(false);
  });

  it('humiliating him makes him an enemy and does NOT unlock Marlowe', () => {
    const st = initBoard(CH);
    const after = applyDealOutcome(CH, st, { closed: true, gotName: false, faceIdx: 2 });
    expect(after.nodes.find((n) => n.id === 'ricci')?.disposition).toBe(0);   // enemy
    expect(after.nodes.find((n) => n.id === 'deluca')?.locked).toBe(true);
  });
});
