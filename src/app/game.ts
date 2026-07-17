import type { IntelId, Opponent, Script } from '../domain/types';
import { renderRecon } from '../ui/recon';
import { startDuel } from './controller';

/**
 * One target's loop: RECON (dig up intel, limited digs) → the live DUEL wired
 * to what you found → aftermath → back to recon (replay with different prep).
 * The mold for every person in the story. See the recon spec.
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
          id: l.id,
          label: l.label,
          blurb: l.blurb,
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

    function sit(): void {
      startDuel(root, opp, script, found, () => runRecon());
    }

    showRecon();
  }

  runRecon();
}
