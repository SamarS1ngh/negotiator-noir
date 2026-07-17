import { describe, it, expect, beforeEach } from 'vitest';
import { renderRecon } from './recon';
import type { ReconView } from './recon';

function view(over: Partial<ReconView> = {}): ReconView {
  return {
    targetName: 'RICCI',
    targetRole: 'the collector',
    why: 'Break him.',
    digsLeft: 3,
    digsTotal: 3,
    leads: [
      { id: 'crew', label: 'His crew', blurb: 'ask around', taken: false },
      { id: 'file', label: 'His file', blurb: 'pull records', taken: false },
    ],
    ...over,
  };
}

describe('recon board', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders the target, the leads and a sit-down button', () => {
    renderRecon(root, view(), { chase() {}, sit() {} });
    expect(root.textContent).toContain('RICCI');
    expect(root.querySelectorAll('[data-lead]').length).toBe(2);
    expect(root.querySelector('[data-sit]')).not.toBeNull();
  });

  it('chasing a lead fires chase() with its id', () => {
    let chased: string | null = null;
    renderRecon(root, view(), { chase: (id) => { chased = id; }, sit() {} });
    root.querySelector<HTMLElement>('[data-lead="file"]')!.click();
    expect(chased).toBe('file');
  });

  it('a taken lead shows its dossier and can\'t be chased again', () => {
    renderRecon(root, view({
      digsLeft: 2,
      leads: [
        { id: 'crew', label: 'His crew', blurb: 'ask around', taken: true, dossier: 'PROUD — feed his ego.' },
        { id: 'file', label: 'His file', blurb: 'pull records', taken: false },
      ],
    }), { chase() {}, sit() {} });
    const taken = root.querySelector<HTMLButtonElement>('[data-lead="crew"]')!;
    expect(taken.disabled).toBe(true);
    expect(taken.textContent).toContain('PROUD');
  });

  it('out of digs disables every remaining lead but still lets you sit down', () => {
    renderRecon(root, view({ digsLeft: 0 }), { chase() {}, sit() {} });
    const leads = root.querySelectorAll<HTMLButtonElement>('[data-lead]');
    for (const l of leads) expect(l.disabled).toBe(true);
    expect(root.querySelector<HTMLButtonElement>('[data-sit]')!.disabled).toBe(false);
  });

  it('sitting down fires sit()', () => {
    let sat = false;
    renderRecon(root, view(), { chase() {}, sit: () => { sat = true; } });
    root.querySelector<HTMLElement>('[data-sit]')!.click();
    expect(sat).toBe(true);
  });
});
