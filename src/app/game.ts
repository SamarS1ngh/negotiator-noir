import type { Opponent } from '../domain/types';
import { initBoard, takeAction, dealPrep, applyDealOutcome } from '../domain/board';
import { CHAPTER_1 } from '../content/chapter1';
import { COLLECTOR_DEAL, LEVERAGE_TERM } from '../content/collector_deal';
import { renderBoard } from '../ui/board';
import { startDeal } from './controller';

/**
 * The campaign loop: work THE WEB (a board of people around your target — limited
 * moves), then SIT DOWN (the deal, its difficulty set by your prep), then the
 * outcome rewrites the board. You're the underdog; you climb by turning the
 * empire's own people. Spec: docs/superpowers/specs/2026-07-19-the-web-board-design.md
 */
export function startGame(root: HTMLElement, opp: Opponent, onFinish?: () => void): void {
  void onFinish;
  const ch = CHAPTER_1;
  let st = initBoard(ch);
  let selected: string | null = null;
  let result: string | undefined;

  function showBoard(): void {
    renderBoard(root, ch, st, selected, { act, select, sitDown }, result);
  }

  function select(nodeId: string | null): void {
    selected = nodeId;
    result = undefined;
    showBoard();
  }

  function act(actionId: string): void {
    const a = ch.actions.find((x) => x.id === actionId);
    st = takeAction(ch, st, actionId);
    result = a?.result;
    selected = null;
    showBoard();
  }

  function sitDown(): void {
    const prep = dealPrep(st.flags);
    startDeal(
      root, opp, COLLECTOR_DEAL, LEVERAGE_TERM, prep.intel, 'proud',
      { startComposureLost: prep.startComposureLost, patienceDelta: prep.patienceDelta, thresholdDelta: prep.thresholdDelta },
      (outcome) => {
        st = applyDealOutcome(ch, st, outcome);
        selected = null;
        result = outcome.gotName
          ? 'Ricci gave up the name. MARLOWE is in reach now.'
          : outcome.closed
            ? 'Deal closed. The docks remember how you played it.'
            : 'He walked. Nothing changed — this time.';
        showBoard();
      },
    );
  }

  showBoard();
}
