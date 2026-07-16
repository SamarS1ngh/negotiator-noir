import type { AgendaField, AngleId, DuelState, EndState, Opponent, OpponentType } from '../domain/types';
import { payout } from '../domain/outcome';

const HEADLINES: Record<Exclude<EndState, 'ongoing'>, string> = {
  folded: 'HE FOLDED',
  walked: 'HE WALKED',
  turned: 'HE TURNED IT ON YOU',
  dealt: 'YOU SETTLED',
};

const TYPE_LABEL: Record<OpponentType, string> = {
  proud: 'proud',
  greedy: 'greedy',
  scared: 'scared',
  believer: 'a true believer',
  pro: 'a cold professional',
};

const ANGLE_LABELS: Record<AngleId, string> = {
  lean: 'leaned on his fear',
  flatter: 'flattered his pride',
  plant_doubt: 'planted doubt',
  bluff: 'bluffed him',
  offer_out: 'offered him a way out',
};

const AGENDA_LABELS: Record<AgendaField, string> = {
  bottomLine: 'his bottom line',
  fear: 'his fear',
  lie: 'the lie he was selling',
};

const AGENDA_ORDER: AgendaField[] = ['bottomLine', 'fear', 'lie'];

function headlineFor(end: EndState): string {
  return end === 'ongoing' ? 'IT’S NOT OVER' : HEADLINES[end];
}

function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function buildSummary(state: DuelState, opp: Opponent): string {
  const parts: string[] = [`You read him as ${TYPE_LABEL[opp.type]}.`];

  if (state.spentAngles.length > 0) {
    const moves = state.spentAngles.map((a) => ANGLE_LABELS[a]);
    parts.push(`You ${joinList(moves)}.`);
  }

  if (state.log.some((l) => l.startsWith('caught:'))) {
    parts.push('You caught him in a lie and cornered him on it.');
  }
  if (state.log.some((l) => l.startsWith('deployed:'))) {
    parts.push('You slapped down your leverage and he had nowhere to go.');
  }
  if (state.log.includes('pressed the tell')) {
    parts.push('You pressed a tell before he could set his face again.');
  }

  return parts.join(' ');
}

function ghostedFields(state: DuelState): AgendaField[] {
  return AGENDA_ORDER.filter((f) => state.known[f] < 1);
}

/**
 * Renders the aftermath screen — ported from concept/ui/screen_aftermath.html.
 * The duel's outcome (headline + payout), a "how you broke him" recap built
 * from the log/known-agenda, the agenda fields you never cracked (ghosted
 * roads-not-taken), and a CONTINUE button.
 */
export function renderAftermath(
  root: HTMLElement,
  state: DuelState,
  opp: Opponent,
  on: { continue(): void },
): void {
  root.innerHTML = '';
  root.className = 'aftermath-screen';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const kicker = document.createElement('div');
  kicker.className = 'kicker';
  kicker.textContent = 'the duel is over';
  wrap.appendChild(kicker);

  const headline = document.createElement('div');
  headline.className = 'headline';
  headline.textContent = headlineFor(state.end);
  wrap.appendChild(headline);

  const who = document.createElement('div');
  who.className = 'who';
  who.textContent = `${opp.name} · ${opp.role}`;
  wrap.appendChild(who);

  // ---- the break payoff: only when you ground him to zero (folded). This is
  // the promised reward — he stops lying, and he names who's above him. ----
  if (state.end === 'folded' && opp.breakReveal) {
    const reveal = document.createElement('div');
    reveal.className = 'reveal';

    const rk = document.createElement('div');
    rk.className = 'blabel';
    rk.textContent = 'he breaks';

    const quote = document.createElement('div');
    quote.className = 'reveal-quote';
    quote.textContent = `“${opp.breakReveal.quote}”`;

    const names = document.createElement('div');
    names.className = 'reveal-names';
    const nk = document.createElement('span');
    nk.className = 'nk';
    nk.textContent = 'he names ▸ ';
    names.append(nk, document.createTextNode(opp.breakReveal.names));

    const teach = document.createElement('div');
    teach.className = 'reveal-teach';
    teach.textContent = opp.breakReveal.teach;

    reveal.append(rk, quote, names, teach);
    wrap.appendChild(reveal);
  }

  // ---- what you walked away with ----
  const { cost, label } = payout(state.end, opp.debtAmount);
  const gotBlock = document.createElement('div');
  gotBlock.className = 'block';
  const gotLabel = document.createElement('div');
  gotLabel.className = 'blabel';
  gotLabel.textContent = 'what you walked away with';
  const got = document.createElement('div');
  got.className = 'got';
  const gotMark = document.createElement('span');
  gotMark.className = 'c';
  gotMark.textContent = cost === 0 ? '✓' : '✕';
  got.append(gotMark, document.createTextNode(cost === 0 ? `The debt — ${label}.` : `$${cost} — ${label}.`));
  gotBlock.append(gotLabel, got);
  wrap.appendChild(gotBlock);

  // ---- how you broke him ----
  const howBlock = document.createElement('div');
  howBlock.className = 'block';
  const howLabel = document.createElement('div');
  howLabel.className = 'blabel';
  howLabel.textContent = 'how you broke him';
  const how = document.createElement('div');
  how.className = 'how';
  how.textContent = buildSummary(state, opp);
  howBlock.append(howLabel, how);
  wrap.appendChild(howBlock);

  // ---- roads you didn't take ----
  const ghosts = ghostedFields(state);
  const ghostBlock = document.createElement('div');
  ghostBlock.className = 'block';
  const ghostLabel = document.createElement('div');
  ghostLabel.className = 'blabel';
  ghostLabel.textContent = "roads you didn't take";
  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  if (ghosts.length === 0) {
    ghost.textContent = 'You read him clean — nothing left in the dark.';
  } else {
    for (const field of ghosts) {
      const line = document.createElement('div');
      const x = document.createElement('span');
      x.className = 'x';
      x.textContent = '✕';
      line.append(x, document.createTextNode(`You never learned ${AGENDA_LABELS[field]}.`));
      ghost.appendChild(line);
    }
  }
  ghostBlock.append(ghostLabel, ghost);
  wrap.appendChild(ghostBlock);

  // ---- footer: continue ----
  const foot = document.createElement('div');
  foot.className = 'foot';
  foot.appendChild(continueButton(on));
  wrap.appendChild(foot);

  root.appendChild(wrap);
}

function continueButton(on: { continue(): void }): HTMLElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cont';
  btn.dataset.continue = '';
  btn.textContent = 'CONTINUE ▸';
  btn.addEventListener('click', () => on.continue());
  return btn;
}
