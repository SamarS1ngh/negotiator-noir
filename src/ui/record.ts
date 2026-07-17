import type { DuelState } from '../domain/types';

// ---- THE RECORD: your notebook. Not an alarm, not an advisor.
// It writes down what he SAID, in order, verbatim, and what you're holding.
// It will never tell you which line is a lie, and it will never tell you what
// a line contradicts. To catch him you make the accusation YOURSELF: pick the
// line you think is the lie, then pick what you think makes it impossible.
// Right → you gut him. Wrong → you've called a man a liar with nothing in hand.

export interface RecordHandlers {
  accuse(statementId: string, againstId: string): void;
  deploy(leverageId: string): void;
  close(): void;
}

function el(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderRecord(root: HTMLElement, state: DuelState, on: RecordHandlers): void {
  let picked: string | null = null;   // the statement you're accusing

  function draw(): void {
    root.innerHTML = '';
    root.className = 'record-screen';

    const panel = el('div', 'rec');
    panel.appendChild(el('div', 'tab', 'THE RECORD'));

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'rec-close';
    close.dataset.close = '';
    close.textContent = '✕';
    close.addEventListener('click', () => on.close());
    panel.appendChild(close);

    panel.appendChild(el('div', 'title', picked ? 'what makes it a lie?' : "what he's told you"));
    panel.appendChild(el('div', 'sub', picked
      ? '// pick what makes that line impossible. wrong, and you have accused a man of nothing.'
      : '// his own words, in order. nothing here is marked for you.'));

    // ---- his statements ----
    panel.appendChild(el('div', 'sec', 'His statements'));
    if (state.record.statements.length === 0) {
      panel.appendChild(el('div', 'empty', "He hasn't said much yet."));
    }

    for (const stmt of state.record.statements) {
      const isPicked = picked === stmt.id;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `stmt pickable${isPicked ? ' picked' : ''}`;
      row.dataset.stmt = stmt.id;
      row.appendChild(el('div', 't', `“${stmt.text}”`));
      row.appendChild(el('div', 'm', isPicked ? '▲ you say this is the lie' : 'he said'));
      row.addEventListener('click', () => {
        // second pick = "this earlier line proves it" (he contradicted himself)
        if (picked && picked !== stmt.id) { on.accuse(picked, stmt.id); return; }
        picked = isPicked ? null : stmt.id;
        draw();
      });
      panel.appendChild(row);
    }

    // ---- what you're holding ----
    panel.appendChild(el('div', 'sec', picked ? 'Or use what you dug up' : "What you're holding"));
    if (state.record.heldLeverage.length === 0) {
      panel.appendChild(el('div', 'empty', 'Nothing — you came in light.'));
    }

    for (const lev of state.record.heldLeverage) {
      const row = el('div', 'lev');
      const t = el('div', 't');
      t.append(lev.label);
      const small = document.createElement('small');
      small.textContent = lev.text;
      t.appendChild(small);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn';
      if (picked) {
        btn.dataset.against = lev.id;
        btn.textContent = 'THIS ▸';
        btn.addEventListener('click', () => on.accuse(picked!, lev.id));
      } else {
        btn.dataset.deploy = lev.id;
        btn.textContent = 'PLAY IT';
        btn.addEventListener('click', () => on.deploy(lev.id));
      }
      row.append(t, btn);
      panel.appendChild(row);
    }

    if (picked) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'rec-cancel';
      cancel.dataset.cancel = '';
      cancel.textContent = '← never mind';
      cancel.addEventListener('click', () => { picked = null; draw(); });
      panel.appendChild(cancel);
    }

    root.appendChild(panel);
  }

  draw();
}
