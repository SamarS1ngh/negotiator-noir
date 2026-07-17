// ---- RECON board: the prep phase before the sit-down. You chase a limited
// number of leads; what you dig up (the dossier) becomes your hand at the
// table. See docs/superpowers/specs/2026-07-17-recon-and-living-duel-design.md.

export interface ReconLeadView {
  id: string;
  label: string;
  blurb: string;
  taken: boolean;
  dossier?: string; // shown once the lead is chased
}

export interface ReconView {
  targetName: string;
  targetRole: string;
  why: string;
  digsLeft: number;
  digsTotal: number;
  leads: ReconLeadView[];
}

export interface ReconHandlers {
  chase(leadId: string): void;
  sit(): void;
}

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderRecon(root: HTMLElement, view: ReconView, on: ReconHandlers): void {
  root.innerHTML = '';
  root.className = 'recon';

  const wrap = el('div', 'recon-wrap');

  // header
  const kicker = el('div', 'rc-kicker', 'before the sit-down');
  wrap.appendChild(kicker);
  const head = el('div', 'rc-head');
  head.appendChild(el('span', 'rc-name', view.targetName));
  head.appendChild(el('span', 'rc-role', ` · ${view.targetRole}`));
  wrap.appendChild(head);
  wrap.appendChild(el('div', 'rc-why', view.why));

  // digs counter
  const digs = el('div', 'rc-digs');
  digs.appendChild(el('span', 'rc-digs-lab', 'leads you can still chase'));
  const pips = el('div', 'rc-pips');
  for (let i = 0; i < view.digsTotal; i += 1) {
    pips.appendChild(el('span', `pip${i < view.digsLeft ? ' on' : ''}`));
  }
  digs.appendChild(pips);
  wrap.appendChild(digs);

  const outOfDigs = view.digsLeft <= 0;

  // leads
  const list = el('div', 'rc-leads');
  for (const lead of view.leads) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lead${lead.taken ? ' taken' : ''}`;
    card.dataset.lead = lead.id;
    const disabled = lead.taken || outOfDigs;
    if (disabled) card.disabled = true;

    const top = el('div', 'lead-top');
    top.appendChild(el('span', 'lead-label', lead.label));
    if (lead.taken) top.appendChild(el('span', 'lead-check', '✓ dug'));
    card.appendChild(top);

    if (lead.taken && lead.dossier) {
      card.appendChild(el('div', 'lead-dossier', lead.dossier));
    } else {
      card.appendChild(el('div', 'lead-blurb', lead.blurb));
    }

    if (!disabled) card.addEventListener('click', () => on.chase(lead.id));
    list.appendChild(card);
  }
  wrap.appendChild(list);

  // sit down
  const foot = el('div', 'rc-foot');
  const hint = el('div', 'rc-foot-hint',
    outOfDigs ? "That's all the time you have. Walk in with what you've got."
      : 'Chase what matters — you can walk in early, but you go in only as ready as you made yourself.');
  foot.appendChild(hint);
  const sit = document.createElement('button');
  sit.type = 'button';
  sit.className = 'rc-sit';
  sit.dataset.sit = '';
  sit.textContent = 'SIT DOWN WITH HIM ▸';
  sit.addEventListener('click', () => on.sit());
  foot.appendChild(sit);
  wrap.appendChild(foot);

  root.appendChild(wrap);
}
