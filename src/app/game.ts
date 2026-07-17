import type { IntelId, Opponent, OpponentType, Script } from '../domain/types';
import { renderRecon } from '../ui/recon';
import { renderCallIt, TYPE_OPTIONS } from '../ui/callit';
import { startDuel } from './controller';

/**
 * One target's loop:
 *   RECON   — chase a limited number of leads. They give you RAW CLUES, never
 *             conclusions. Nobody tells you what he is.
 *   CALL IT — you look at what you turned up and commit to a read of the man.
 *             This is the earn-it gate: get it wrong and your instincts (and
 *             the risk you're shown at the table) are wrong all night.
 *   DUEL    — the wheel, his words, your notebook.
 * The mold for every person in the story.
 */
export function startGame(root: HTMLElement, opp: Opponent, script: Script, onFinish?: () => void): void {
  void onFinish;

  function runRecon(): void {
    const found = new Set<IntelId>();
    const taken = new Set<string>();
    let digsLeft = opp.recon?.digs ?? 0;
    const leads = opp.recon?.leads ?? [];

    function showRecon(): void {
      renderRecon(root, {
        targetName: opp.name.toUpperCase(),
        targetRole: opp.role,
        why: opp.objective?.why ?? '',
        digsLeft,
        digsTotal: opp.recon?.digs ?? 0,
        leads: leads.map((l) => ({
          id: l.id, label: l.label, blurb: l.blurb,
          taken: taken.has(l.id),
          dossier: taken.has(l.id) ? l.dossier : undefined,
        })),
      }, { chase, sit });
    }

    function chase(leadId: string): void {
      if (digsLeft <= 0 || taken.has(leadId)) return;
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;
      taken.add(leadId);
      found.add(lead.grants);
      digsLeft -= 1;
      showRecon();
    }

    // before the table: make the call yourself
    function sit(): void {
      renderCallIt(root, {
        targetName: opp.name.toUpperCase(),
        clues: leads.filter((l) => taken.has(l.id)).map((l) => l.dossier),
        options: TYPE_OPTIONS,
      }, { call });
    }

    function call(believed: OpponentType): void {
      startDuel(root, opp, script, found, believed, () => runRecon());
    }

    showRecon();
  }

  runRecon();
}
