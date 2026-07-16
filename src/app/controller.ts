import type { AngleId, Band, DuelState, Opponent, Script } from '../domain/types';
import { initDuel, apply, riskOf } from '../domain/engine';
import { renderCine } from '../ui/scene';
import type { Choice, CineHandlers, Exchange } from '../ui/scene';
import { renderAftermath } from '../ui/aftermath';

// Vitest sets MODE 'test' — gate the typewriter so tests drive the duel
// synchronously (final state rendered at once, no setTimeout). The live app
// runs the unhurried reveal below.
const TEST = import.meta.env.MODE === 'test';
const TIMING = { TYPE_MS: 34, PRE_CHOICES: 550 };

// The felt intent behind each angle — this is the choice's tag, so the move
// reads as a manipulation ("hit his fear") not a mechanic ("lean").
const INTENT: Record<AngleId, string> = {
  lean: 'hit his fear',
  flatter: 'flatter him',
  plant_doubt: 'plant doubt',
  bluff: 'bluff him',
  offer_out: 'offer a way out',
};

// Fallback reaction + read for a probe whose line emits no scripted statement.
const GENERIC_REACTION: Record<Band, string> = {
  lands: "He doesn't answer right away — but something in his face just gave.",
  neutral: 'He just looks at you. Nothing given away.',
  backfires: 'He almost laughs in your face.',
};
const GENERIC_SUBTEXT: Record<Band, string> = {
  lands: "That got under the collar — he's rattled.",
  neutral: 'Nothing moved. He held.',
  backfires: 'Wrong move — that only steadied him.',
};

// His composure, said in plain language instead of a raw number.
function nerveWord(composure: number): string {
  if (composure > 75) return 'steady';
  if (composure > 50) return 'shaken';
  if (composure > 30) return 'rattled';
  if (composure > 0) return 'cornered';
  return 'breaking';
}

/**
 * The cinematic manipulation duel. Reuses the domain engine (composure /
 * agenda / statements / leverage / tells / outcome) unchanged — this owns the
 * lived-scene flow over it: his line reads out, you pick a manipulation move
 * (a normal line, or a hot catch/deploy/press opening when it's live), his
 * reaction plays, his nerve shifts, repeat until he breaks. See
 * docs/superpowers/specs/2026-07-16-cinematic-manipulation-duel-design.md.
 */
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void {
  let state: DuelState = initDuel(opp, script);
  const history: Exchange[] = [];
  let hisLine: string = opp.opener ?? 'Well? You wanted this meeting.';
  let read: string | undefined;
  let teach: string | undefined =
    'Break his nerve to zero. Every line you pick is a move — read him, work him.';
  let tellLive = false;
  let movesMade = 0;
  const shown = new Set<string>();

  const handlers: CineHandlers = { choose, walk };

  // Every move the player has this beat: the hot openings (catch / deploy /
  // press) first, then a manipulation line for each angle he hasn't shut down.
  function choicesFor(): Choice[] {
    const cs: Choice[] = [];
    for (const c of state.record.openContradictions) {
      cs.push({ id: c.id, kind: 'catch', text: '"That’s not what you said."' });
    }
    // Leverage surfaces only once you've sized him up — the opening beat stays
    // a clean set of manipulation moves, then your hold appears a beat in.
    if (movesMade >= 1) {
      for (const l of state.record.heldLeverage) {
        cs.push({ id: l.id, kind: 'deploy', text: `Use what you know — ${l.label.toLowerCase()}.` });
      }
    }
    if (tellLive) cs.push({ id: 'press', kind: 'press', text: 'Lean in. Say nothing. Let it sit.' });
    for (const a of script.angles) {
      if (state.spentAngles.includes(a)) continue;
      const line = script.lines.find((l) => l.angleId === a);
      if (!line) continue;
      cs.push({ id: line.id, kind: 'move', text: `"${line.text}"`, intent: INTENT[a], risk: riskOf(state, opp, line) });
    }
    return cs;
  }

  function showBeat(opts: { typing?: number; choices?: boolean } = {}): void {
    renderCine(root, opp, {
      objective: opp.objective?.goal ?? 'BREAK HIM',
      hisName: opp.name,
      mood: state.mood,
      nerveWord: nerveWord(state.hisComposure),
      nervePct: state.hisComposure,
      history: history.slice(-4),
      hisLine,
      typedLen: opts.typing,
      read,
      teach,
      choices: opts.choices ? choicesFor() : [],
    }, handlers);
  }

  function showAftermath(): void {
    renderAftermath(root, state, opp, { continue: () => onDone?.() });
  }

  // Reveal his reply — typewritered live, instant under test — then either the
  // aftermath (if the duel just ended) or the next set of choices.
  function play(reply: string, newRead: string | undefined, newTeach: string | undefined): void {
    hisLine = reply;
    read = newRead;
    teach = newTeach;
    const done = (): void => {
      if (state.end !== 'ongoing') showAftermath();
      else showBeat({ choices: true });
    };
    if (TEST) { done(); return; }
    typeThen(reply, done);
  }

  function typeThen(text: string, done: () => void): void {
    let i = 0;
    const step = (): void => {
      i += 1;
      showBeat({ typing: i });
      if (i >= text.length) { setTimeout(done, TIMING.PRE_CHOICES); return; }
      setTimeout(step, TIMING.TYPE_MS);
    };
    showBeat({ typing: 0 });
    setTimeout(step, TIMING.TYPE_MS);
  }

  function choose(c: Choice): void {
    teach = undefined; // any action clears the standing teach/steer
    if (c.kind === 'move') resolveMove(c);
    else if (c.kind === 'catch') resolveCatch(c);
    else if (c.kind === 'deploy') resolveDeploy(c);
    else resolvePress();
  }

  function pushExchange(yourLine: string): void {
    history.push({ who: 'him', text: hisLine });
    history.push({ who: 'you', text: yourLine });
  }

  function resolveMove(c: Choice): void {
    const line = script.lines.find((l) => l.id === c.id);
    if (!line) return;
    movesMade += 1;
    const contradictionsBefore = state.record.openContradictions.length;
    pushExchange(line.text);

    const r = apply(state, { kind: 'probe', lineId: line.id }, opp, script);
    state = r.state;
    const said = r.events.find((e) => e.type === 'said')?.text;
    const band = (r.events.find((e) => e.type === 'band')?.text ?? 'neutral') as Band;
    const tellEvent = r.events.find((e) => e.type === 'tell');
    tellLive = Boolean(tellEvent);

    const reply = said ?? GENERIC_REACTION[band];
    const lastStmt = state.record.statements[state.record.statements.length - 1];
    const newRead = (said && lastStmt?.subtext) ? lastStmt.subtext : GENERIC_SUBTEXT[band];

    let newTeach: string | undefined;
    const crackOpened = state.record.openContradictions.length > contradictionsBefore;
    if (crackOpened && !shown.has('crack')) {
      shown.add('crack');
      newTeach = 'He just contradicted himself — that’s a crack. Take "catch him in it" to corner him.';
    } else if (tellEvent && !shown.has('tell')) {
      shown.add('tell');
      newTeach = opp.tell?.teach;
    }
    play(reply, newRead, newTeach);
  }

  function resolveCatch(c: Choice): void {
    if (!state.record.openContradictions.some((x) => x.id === c.id)) return;
    pushExchange('"That’s not what you said."');
    const r = apply(state, { kind: 'catch', contradictionId: c.id }, opp, script);
    state = r.state;
    tellLive = false;
    play('…how the hell do you know that?', 'His lie just broke open — he’s rattled and scrambling.', undefined);
  }

  function resolveDeploy(c: Choice): void {
    const lev = state.record.heldLeverage.find((l) => l.id === c.id);
    if (!lev) return;
    pushExchange(`You lay it on the table: ${lev.label.toLowerCase()}.`);
    const r = apply(state, { kind: 'deploy', leverageId: c.id }, opp, script);
    state = r.state;
    tellLive = false;
    play('…okay. Okay. What do you want.', 'He knows you’ve got him. His guard is dropping.', undefined);
  }

  function resolvePress(): void {
    pushExchange('You lean in. Say nothing. Let it sit.');
    const r = apply(state, { kind: 'pressTell' }, opp, script);
    state = r.state;
    tellLive = false;
    play('He catches himself — but the crack already showed.', 'You pressed the tell. His nerve buckles.', undefined);
  }

  function walk(): void {
    const r = apply(state, { kind: 'walk' }, opp, script);
    state = r.state;
    showAftermath();
  }

  // opening beat
  if (TEST) showBeat({ choices: true });
  else typeThen(hisLine, () => showBeat({ choices: true }));
}
