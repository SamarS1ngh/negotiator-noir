import type { Opponent } from '../domain/types';
import type { Node } from '../domain/board';
import { initBoard, takeAction, dealPrep, applyDealOutcome } from '../domain/board';
import { CHAPTER_1 } from '../content/chapter1';
import { COLLECTOR_DEAL, LEVERAGE_TERM } from '../content/collector_deal';
import { renderBoard } from '../ui/board';
import { renderMeet } from '../ui/meet';
import { startDeal } from './controller';

/**
 * The campaign loop, alive: THE WEB is a corkboard of people you MEET in short
 * face-to-face scenes; working them shifts the board (which reacts) and sets the
 * difficulty of the sit-down; the deal outcome rewrites the board. You climb by
 * turning the empire's own people. Spec: docs/superpowers/specs/2026-07-19-*.
 */
export function startGame(root: HTMLElement, opp: Opponent, onFinish?: () => void): void {
  void onFinish;
  const ch = CHAPTER_1;
  let st = initBoard(ch);
  let selected: string | null = null;
  let toast: string | undefined;
  let changed: Set<string> | undefined;

  function showBoard(): void {
    renderBoard(root, ch, st, selected, { act, select, sitDown }, toast, changed);
    changed = undefined;   // flare is a one-shot
  }

  function select(nodeId: string | null): void {
    selected = nodeId;
    toast = undefined;
    showBoard();
  }

  // working someone is a SCENE — you meet them, they react, then it lands
  function act(actionId: string): void {
    const a = ch.actions.find((x) => x.id === actionId);
    if (!a) return;
    const nodeOf = (id: string): Node | undefined => st.nodes.find((n) => n.id === id);

    const apply = (): void => {
      st = takeAction(ch, st, actionId);
      selected = null;
      toast = undefined;
      changed = new Set([a.nodeId, ...(a.dispositionDelta ? [a.dispositionDelta.nodeId] : [])]);
      showBoard();
    };

    if (a.scene && a.scene.length > 0) {
      const n = nodeOf(a.nodeId);
      renderMeet(root, {
        name: n?.name ?? '', role: n?.role ?? '', portrait: n?.portrait,
        beats: a.scene, result: a.result, ripple: a.ripple,
      }, apply);
    } else {
      apply();
    }
  }

  function sitDown(): void {
    const prep = dealPrep(st.flags);
    startDeal(
      root, opp, COLLECTOR_DEAL, LEVERAGE_TERM, prep.intel, 'proud',
      { startComposureLost: prep.startComposureLost, patienceDelta: prep.patienceDelta, thresholdDelta: prep.thresholdDelta },
      (outcome) => {
        const wasLocked = new Set(st.nodes.filter((n) => n.locked).map((n) => n.id));
        st = applyDealOutcome(ch, st, outcome);
        const nowUnlocked = st.nodes.filter((n) => !n.locked && wasLocked.has(n.id)).map((n) => n.id);
        selected = null;
        changed = new Set(['ricci', ...nowUnlocked]);
        toast = outcome.gotName
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
