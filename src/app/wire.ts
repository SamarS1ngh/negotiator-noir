import type { IntelId, Opponent } from '../domain/types';
import type { DealSpec, Offer, Leverage } from '../domain/deal';
import { evaluate, scoreDeal, grade, reactionFor } from '../domain/deal';
import { renderWire, resetWire } from '../ui/wire';
import type { WireMsg, WireOption, WireHandlers } from '../ui/wire';
import { renderDealOutcome } from '../ui/dealoutcome';
import type { LevTermMap, DealPrep, DealOutcome } from './controller';

const PRESS_MAX = 28;
const COMPOSURE_PER_ROUND = 6;
const TYPE_MS = 750;   // how long his "typing…" tell lingers before a line lands

// Per-term chat script: his demand, and your stances mapped to a position index
// (0 = his ideal … last = yours). Leverage attaches show up as a 📎 option when
// you hold the right card. The VERDICT is the deal engine — this is just its face.
interface Stance { label: string; idx: number; tone?: WireOption['tone']; }
interface TermChat { id: string; demand: string; stances: Stance[]; }

const SCRIPT: TermChat[] = [
  {
    id: 'debt',
    demand: 'The debt. Five hundred large — every cent, on time. Start there.',
    stances: [
      { label: "You'll get every cent.", idx: 0, tone: 'give' },
      { label: "Half. That's fair and you know it.", idx: 1 },
      { label: "I'm not paying a dime.", idx: 2, tone: 'push' },
      { label: 'You pay ME back — with interest.', idx: 3, tone: 'push' },
    ],
  },
  {
    id: 'name',
    demand: 'Who I answer to is my business. Leave it there.',
    stances: [
      { label: "Keep it. I don't care who.", idx: 0, tone: 'give' },
      { label: 'Just point me the right way.', idx: 1 },
      { label: 'Say it. Marlowe. I want the name.', idx: 2, tone: 'push' },
    ],
  },
  {
    id: 'face',
    demand: 'However this ends — I walk out of here clean. That part is not up for grabs.',
    stances: [
      { label: 'You walk clean. Nobody hears.', idx: 0, tone: 'give' },
      { label: 'Quiet. No show, no talk.', idx: 1 },
      { label: 'Everyone watches you fold.', idx: 2, tone: 'push' },
    ],
  },
  {
    id: 'paper',
    demand: "And your father's paper stays on the books. Signed is signed.",
    stances: [
      { label: 'It stands.', idx: 0, tone: 'give' },
      { label: "Tear it up. It's over.", idx: 1, tone: 'push' },
    ],
  },
];

const REACT = {
  fine: ['…Fine.', 'Noted.', 'That works.', 'Go on.'],
  resists: ["You're reaching.", 'Careful.', "That's a lot to ask.", "Don't push."],
  hardline: ['No. Not that.', 'Out of the question.', "You've got some nerve."],
};

/**
 * THE WIRE — the deal, played as an encrypted chat. Term by term he states what
 * he wants; you answer, send him what you dug up, and press-and-hold to lean when
 * you put the package to him. Same engine as the table (evaluate/threshold/
 * leverage/press) — a different, diegetic face on it.
 */
export function startWire(
  root: HTMLElement,
  opp: Opponent,
  spec: DealSpec,
  levTerm: LevTermMap,
  intel: Set<IntelId>,
  prep: DealPrep,
  onDone?: (o: DealOutcome) => void,
): void {
  resetWire(root);

  const offer: Offer = { ...spec.hisOpening };
  const attached: Record<string, string> = {};             // termId -> leverageId
  const held = Object.keys(levTerm).filter((id) => intel.has(`lev:${id}` as IntelId));
  const worked = intel.size > 0;

  const effSpec: DealSpec = {
    ...spec,
    patience: Math.max(2, spec.patience + (prep.patienceDelta ?? 0)),
    startThreshold: spec.startThreshold + (prep.thresholdDelta ?? 0),
  };

  const log: WireMsg[] = [];
  let round = 1;
  let patienceLeft = effSpec.patience;
  let composureLost = prep.startComposureLost ?? 0;
  let step = 0;               // index into SCRIPT
  let typing = false;
  let ask: string | undefined;
  let options: WireOption[] | undefined;
  let hold = false;
  let ended = false;
  let lastCounter: Offer | null = null;

  const handlers: WireHandlers = { choose, lean };

  function leverageMap(): Leverage {
    const l: Leverage = {};
    for (const [termId, levId] of Object.entries(attached)) {
      const m = levTerm[levId];
      if (m) l[termId] = (l[termId] ?? 0) + m.strength;
    }
    return l;
  }
  function pressCeil(): number { return Object.keys(attached).length > 0 ? 0.9 : 0.72; }
  function cardLabel(id: string): string {
    const map: Record<string, string> = { skims: 'he skims Marlowe', ledger: 'the second ledger' };
    return map[id] ?? id;
  }

  function draw(): void {
    renderWire(root, {
      name: opp.name, portrait: opp.art.states.guarded, status: worked ? 'encrypted · rattled' : 'encrypted · online',
      log, typing, ask, options, hold, pressCeil: pressCeil(), ended,
    }, handlers);
  }

  // he "types", then the line lands — the pause is part of the read
  function him(text: string, then?: () => void, file = false): void {
    typing = true; options = undefined; hold = false; ask = undefined; draw();
    setTimeout(() => {
      typing = false;
      log.push({ who: 'them', text, file });
      draw();
      then?.();
    }, TYPE_MS);
  }
  function youSay(text: string, file = false): void { log.push({ who: 'you', text, file }); }

  // ---- flow ----
  function open(): void {
    him(worked
      ? "You've been busy — turning my people, asking my name in the wrong rooms. Sit. Talk."
      : "So. You wanted the meeting. You've got it. Don't waste my evening.",
    () => promptTerm());
  }

  function promptTerm(): void {
    if (step >= SCRIPT.length) { toSend(); return; }
    const t = SCRIPT[step]!;
    him(t.demand, () => showStances(t));
  }

  function showStances(t: TermChat): void {
    const opts: WireOption[] = t.stances.map((s) => ({ id: `set:${s.idx}`, label: s.label, tone: s.tone }));
    // a 📎 attach option if you hold leverage that bears on THIS term and haven't sent it
    for (const levId of held) {
      if (levTerm[levId]!.term === t.id && !Object.values(attached).includes(levId)) {
        opts.unshift({ id: `lever:${levId}`, label: `Send: ${cardLabel(levId)}`, tone: 'lever' });
      }
    }
    ask = 'your move';
    options = opts;
    hold = false;
    draw();
  }

  function choose(id: string): void {
    if (ended) return;

    // counter-round buttons (no active term)
    if (id === 'take' && lastCounter) { finish({ finalOffer: { ...lastCounter } }, '…Done. We have a deal.'); return; }
    if (id === 'again') { youSay('Not good enough.'); ask = 'lean on him — hold'; options = undefined; hold = true; draw(); return; }
    if (id === 'walk') { finish({ walked: true }, "Then we're finished. Get out."); return; }

    const t = SCRIPT[step];
    if (!t) return;

    if (id.startsWith('lever:')) {
      const levId = id.slice(6);
      attached[t.id] = levId;
      youSay(`[${cardLabel(levId)}]`, true);
      him('…Where did you get that.', () => showStances(t));   // he's rattled; same term, softer
      composureLost += 4;
      return;
    }

    const idx = Number(id.slice(4));
    offer[t.id] = idx;
    const stance = t.stances.find((s) => s.idx === idx);
    youSay(stance?.label ?? '');
    const term = spec.terms.find((x) => x.id === t.id)!;
    const r = reactionFor(term, idx, leverageMap()[t.id] ?? 0);
    const line = REACT[r][step % REACT[r].length]!;
    step += 1;
    him(line, () => promptTerm());
  }

  function toSend(): void {
    him('Alright. Put it all together. What are you actually offering me?', () => {
      ask = 'lean on him — hold, and watch how he takes it';
      options = undefined;
      hold = true;
      draw();
    });
  }

  function lean(press: number): void {
    if (ended) return;
    hold = false;
    const leverageOn = Object.keys(attached).length > 0;
    const over = pressCeil();

    if (press > over) {
      if (leverageOn) {
        round += 1; patienceLeft -= 1; composureLost += COMPOSURE_PER_ROUND;
        him(patienceLeft <= 0 ? "Enough. Take what's there or lose the line." : "You're squeezing too hard. Careful.",
          () => { hold = true; draw(); });
        return;
      }
      finish({ walked: true }, 'You tried to break me. Wrong move. This line’s dead.');
      return;
    }

    const res = evaluate(effSpec, offer, leverageMap(), round, composureLost + Math.round(press * PRESS_MAX));

    if (res.verdict === 'accept') { finish({ finalOffer: { ...offer } }, "…Alright. You've got a deal."); return; }
    if (res.verdict === 'walk') { finish({ walked: true }, "You're not serious. We're done here."); return; }

    // counter — he pushes back; take it, or lean again as it drags on
    round += 1; patienceLeft -= 1; composureLost += COMPOSURE_PER_ROUND;
    const counter = res.counter ?? { ...spec.hisOpening };
    const summary = spec.terms
      .filter((tm) => (counter[tm.id] ?? 0) !== (offer[tm.id] ?? 0))
      .map((tm) => `${tm.label}: ${tm.positions[counter[tm.id] ?? 0]}`)
      .join(' · ') || 'the same as I said.';
    him(`Not those terms. Here's mine — ${summary}`, () => {
      ask = patienceLeft <= 0 ? 'last word — take it or walk' : 'take his counter, or lean again';
      options = [
        { id: 'take', label: 'Take his terms', tone: 'give' },
        ...(patienceLeft > 0 ? [{ id: 'again', label: 'Keep leaning', tone: 'push' as const }] : []),
        { id: 'walk', label: 'Walk out', tone: 'push' },
      ];
      hold = false;
      lastCounter = counter;   // stash his counter so "take" can accept it
      draw();
    });
  }

  function finish(o: { walked?: boolean; finalOffer?: Offer }, line: string): void {
    ended = true;
    him(line, () => {
      const nameTerm = spec.terms.find((t) => t.id === 'name');
      if (o.walked || !o.finalOffer) {
        renderDealOutcome(root, opp, {
          walked: true, gradeLetter: 'F',
          terms: spec.terms.map((t) => ({ label: t.label, got: 'no deal' })),
          namedHim: false,
        }, () => onDone?.({ closed: false, gotName: false, faceIdx: 2 }));
        return;
      }
      const fin = o.finalOffer;
      const frac = scoreDeal(spec, fin);
      const gotName = Boolean(nameTerm && (fin.name ?? 0) >= nameTerm.positions.length - 1);
      renderDealOutcome(root, opp, {
        walked: false, gradeLetter: grade(frac),
        terms: spec.terms.map((t) => ({ label: t.label, got: t.positions[fin[t.id] ?? 0]! })),
        namedHim: gotName,
      }, () => onDone?.({ closed: true, gotName, faceIdx: fin.face ?? 0 }));
    });
  }

  open();
}
