import type { AgendaField, DuelState } from '../domain/types';

const AGENDA_LABELS: Record<AgendaField, string> = {
  bottomLine: 'His bottom line',
  fear: 'His fear',
  lie: "The lie he's selling",
};

const AGENDA_ORDER: AgendaField[] = ['bottomLine', 'fear', 'lie'];

function pct(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n * 100)));
}

/**
 * Renders the case-file drawer — ported from concept/ui/screen_record.html.
 * His statements (flagging the one behind an open contradiction), leverage
 * you hold (each with a DEPLOY button), the agenda known-% bars, and every
 * open contradiction with a CATCH button.
 */
export function renderRecord(
  root: HTMLElement,
  state: DuelState,
  on: { catch(contradictionId: string): void; deploy(leverageId: string): void; close(): void },
): void {
  root.innerHTML = '';
  root.classList.add('record-screen');

  const panel = document.createElement('div');
  panel.className = 'rec';

  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = 'THE RECORD';
  panel.appendChild(tab);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'rec-close';
  closeBtn.dataset.close = '';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => on.close());
  panel.appendChild(closeBtn);

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = "the case you're building";
  panel.appendChild(title);

  const sub = document.createElement('div');
  sub.className = 'sub';
  sub.textContent = "// what he's told you, what you're holding, what you've pieced together";
  panel.appendChild(sub);

  // ---- His statements ----
  const stmtSec = document.createElement('div');
  stmtSec.className = 'sec';
  stmtSec.textContent = 'His statements';
  panel.appendChild(stmtSec);

  if (state.record.statements.length === 0) {
    panel.appendChild(emptyRow("He hasn't said much yet."));
  }

  const flaggedIds = new Set(state.record.openContradictions.map((c) => c.statementId));

  for (const stmt of state.record.statements) {
    const flagged = flaggedIds.has(stmt.id);
    const div = document.createElement('div');
    div.className = flagged ? 'stmt flag' : 'stmt';

    if (flagged) {
      const glint = document.createElement('div');
      glint.className = 'glint';
      glint.textContent = "◆ doesn't add up";
      div.appendChild(glint);
    }

    const t = document.createElement('div');
    t.className = 't';
    t.textContent = `“${stmt.text}”`;

    const m = document.createElement('div');
    m.className = 'm';
    m.textContent = 'he said';

    div.append(t, m);
    panel.appendChild(div);
  }

  // ---- Leverage you hold ----
  const levSec = document.createElement('div');
  levSec.className = 'sec';
  levSec.textContent = 'Leverage you hold';
  panel.appendChild(levSec);

  if (state.record.heldLeverage.length === 0) {
    panel.appendChild(emptyRow('Nothing in hand — yet.'));
  }

  for (const lev of state.record.heldLeverage) {
    const row = document.createElement('div');
    row.className = 'lev';

    const t = document.createElement('div');
    t.className = 't';
    t.append(lev.label);
    const small = document.createElement('small');
    small.textContent = lev.text;
    t.appendChild(small);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.dataset.deploy = lev.id;
    btn.textContent = 'DEPLOY';
    btn.addEventListener('click', () => on.deploy(lev.id));

    row.append(t, btn);
    panel.appendChild(row);
  }

  // ---- What you've pieced together (agenda) ----
  const agendaSec = document.createElement('div');
  agendaSec.className = 'sec';
  agendaSec.textContent = "What you've pieced together";
  panel.appendChild(agendaSec);

  const agenda = document.createElement('div');
  agenda.className = 'agenda';
  for (const field of AGENDA_ORDER) {
    const amount = pct(state.known[field]);

    const row = document.createElement('div');
    row.className = 'row';

    const lab = document.createElement('div');
    lab.className = 'lab';
    lab.textContent = AGENDA_LABELS[field];

    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('i');
    fill.style.width = `${amount}%`;
    bar.appendChild(fill);

    const pctEl = document.createElement('div');
    pctEl.className = 'pct';
    pctEl.textContent = amount >= 100 ? '✓' : `${amount}%`;

    row.append(lab, bar, pctEl);
    agenda.appendChild(row);
  }
  panel.appendChild(agenda);

  // ---- Open contradictions ----
  if (state.record.openContradictions.length > 0) {
    const contraSec = document.createElement('div');
    contraSec.className = 'sec';
    const count = state.record.openContradictions.length;
    contraSec.textContent = `Open contradiction${count > 1 ? 's' : ''} · ${count}`;
    panel.appendChild(contraSec);

    for (const c of state.record.openContradictions) {
      const said = state.record.statements.find((s) => s.id === c.statementId);
      const against =
        c.kind === 'leverage'
          ? state.record.heldLeverage.find((l) => l.id === c.against)?.label
          : state.record.statements.find((s) => s.id === c.against)?.text;

      const card = document.createElement('div');
      card.className = 'catchcard';

      const x = document.createElement('div');
      x.className = 'x';
      const h = document.createElement('div');
      h.className = 'h';
      h.textContent = `"${said?.text ?? '…'}"  ⟷  ${against ?? '…'}`;
      const l = document.createElement('div');
      l.className = 'l';
      l.textContent = "He just contradicted himself. Corner him on it.";
      x.append(h, l);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn';
      btn.dataset.catch = c.id;
      btn.textContent = 'CATCH ▸';
      btn.addEventListener('click', () => on.catch(c.id));

      card.append(x, btn);
      panel.appendChild(card);
    }
  }

  root.appendChild(panel);
}

function emptyRow(text: string): HTMLElement {
  const div = document.createElement('div');
  div.className = 'empty';
  div.textContent = text;
  return div;
}
