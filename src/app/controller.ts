import type { AngleId, Band, DuelState, EndState, MoodState, Opponent, Script } from '../domain/types';
import { initDuel, apply, moodFor } from '../domain/engine';
import { endStateFor } from '../domain/outcome';
import { renderCine } from '../ui/scene';
import type { Choice, CineHandlers, Exchange } from '../ui/scene';
import { renderAftermath } from '../ui/aftermath';

// Vitest sets MODE 'test' — gate the typewriter so tests drive synchronously.
const TEST = import.meta.env.MODE === 'test';
const TIMING = { TYPE_MS: 34, PRE_CHOICES: 550 };

// ---- the GAME layer. The domain engine stays the pure substrate (it does the
// band/leak/statement/contradiction/spent bookkeeping); the controller owns the
// whole NERVE + PATIENCE economy so the duel is genuinely hard and losable.
// The win is a tight line: read his type → land the levers that fit → catch his
// lie → finish with leverage, inside a patience budget. Flailing loses. ----
const LAND_HIT = 20;        // his nerve drop when you read him right (the only real progress)
const NEUTRAL_HIS = 4;      // a weak lever — he steadies, gains a little confidence…
const NEUTRAL_YOU = 6;      // …and you wasted breath: it costs you
const BACKFIRE_HIS = 8;     // the wrong lever entirely — he grows…
const BACKFIRE_YOU = 20;    // …and it hits YOU hard
const CATCH_HIT = 28;       // catching a real contradiction — a big, earned hit
const CALL_SOFT = 14;       // calling a lie he told, no hard proof — lands, smaller
const CALL_WRONG_HIS = 8;   // a false accusation steadies him…
const CALL_WRONG_YOU = 24;  // …and costs you badly. Only call it when you're sure.
const LEVERAGE_FINISH = 50; // leverage as a FINISHER — huge, but only once he's rattled
const LEVERAGE_READY = 45;  // his nerve must be <= this for leverage to land at all
const COLD_DEPLOY_HIS = 4;  // playing leverage while he's composed — he brushes it off…
const COLD_DEPLOY_YOU = 16; // …and you overplayed your hand
const PATIENCE_START = 6;   // he'll sit for about this many exchanges before he walks
const PATIENCE_MISFIRE = 2; // a backfire / wrong call / cold deploy burns extra patience

const INTENT: Record<AngleId, string> = {
  lean: 'hit his fear',
  flatter: 'flatter him',
  plant_doubt: 'plant doubt',
  bluff: 'bluff him',
  offer_out: 'offer a way out',
};

const GENERIC_REACTION: Record<Band, string> = {
  lands: "He doesn't answer right away — but something in his face just gave.",
  neutral: 'He just looks at you. Nothing given away.',
  backfires: 'He almost laughs in your face.',
};

const TELL_MOODS: MoodState[] = ['rattled', 'cornered', 'folding'];

function nerveWord(composure: number): string {
  if (composure > 75) return 'steady';
  if (composure > 50) return 'shaken';
  if (composure > 30) return 'rattled';
  if (composure > 0) return 'cornered';
  return 'breaking';
}

function clamp(n: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, n)); }

/**
 * The cinematic manipulation duel — a game you can LOSE. His portrait fills the
 * frame, his line reads out, and you pick a manipulation move with NO risk
 * telegraph and nothing flagged as correct: you read his face + words and judge
 * which lever fits his TYPE. Land the right ones and his nerve drops; misread
 * and HE gains while YOUR nerve bleeds. Leverage only finishes a man already
 * rattled — play it cold and he laughs it off. And he won't sit forever: waste
 * his patience and he walks. Break his nerve to zero to win. The engine's
 * composure numbers are overridden here so the controller owns the economy.
 */
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void {
  let state: DuelState = initDuel(opp, script);
  let patience = PATIENCE_START;
  const history: Exchange[] = [];
  let hisLine: string = opp.opener ?? 'Well? You wanted this meeting.';
  let face: string | undefined;
  let teach: string | undefined =
    "Read what kind of man he is — aim at the right weakness, and the wrong lever bleeds you. He won't sit long. Break his nerve before he loses patience or reads you.";
  let movesMade = 0;
  const shown = new Set<string>();
  const calledLies = new Set<string>();

  const handlers: CineHandlers = { choose, walk };

  // Apply a game-layer nerve change, then re-derive his mood + the win/lose
  // state. His nerve 0 → he folds (win); your nerve 0 → he turns it (lose).
  function resettle(hisDelta: number, yourDelta: number): void {
    const his = clamp(state.hisComposure + hisDelta, 0, 100);
    const your = Math.max(0, state.yourComposure + yourDelta);
    const mood = moodFor(his);
    const end: EndState = state.end === 'walked' ? 'walked' : endStateFor(his, your);
    state = { ...state, hisComposure: his, yourComposure: your, mood, end };
  }

  // Spend patience for a move; if he's had enough, he walks out — you lose.
  function spendPatience(cost: number): void {
    patience -= cost;
    if (patience <= 0 && state.end === 'ongoing') state = { ...state, end: 'walked' };
  }

  // Run the engine for its bookkeeping (bands, leaks, statements,
  // contradictions, spent angles, consumed leverage) but KEEP the controller's
  // own nerve numbers — the engine's composure deltas are discarded here.
  function bookkeep(action: Parameters<typeof apply>[1]): ReturnType<typeof apply>['events'] {
    const prevHis = state.hisComposure;
    const prevYour = state.yourComposure;
    const r = apply(state, action, opp, script);
    state = { ...r.state, hisComposure: prevHis, yourComposure: prevYour };
    return r.events;
  }

  function observedFace(): string | undefined {
    if (opp.tell && TELL_MOODS.includes(state.mood)) return opp.tell.text;
    return opp.expressions?.[state.mood];
  }

  function choicesFor(): Choice[] {
    const cs: Choice[] = [];
    if (movesMade >= 1) {
      cs.push({ id: 'call', kind: 'call', text: '"You’re lying. I can see it in your face."' });
      for (const l of state.record.heldLeverage) {
        cs.push({ id: l.id, kind: 'deploy', text: `Use what you know — ${l.label.toLowerCase()}.` });
      }
    }
    for (const a of script.angles) {
      if (state.spentAngles.includes(a)) continue;
      const line = script.lines.find((l) => l.angleId === a);
      if (!line) continue;
      cs.push({ id: line.id, kind: 'move', text: `"${line.text}"`, intent: INTENT[a] });
    }
    return cs;
  }

  function showBeat(opts: { typing?: number; choices?: boolean } = {}): void {
    renderCine(root, opp, {
      objective: opp.objective?.goal ?? 'BREAK HIM',
      hisName: opp.name,
      mood: state.mood,
      hisNerveWord: nerveWord(state.hisComposure),
      hisNervePct: state.hisComposure,
      yourNervePct: state.yourComposure,
      patiencePct: clamp((patience / PATIENCE_START) * 100, 0, 100),
      history: history.slice(-4),
      hisLine,
      typedLen: opts.typing,
      face,
      teach,
      choices: opts.choices ? choicesFor() : [],
    }, handlers);
  }

  function showAftermath(): void {
    renderAftermath(root, state, opp, { continue: () => onDone?.() });
  }

  function play(reply: string, newFace: string | undefined, newTeach: string | undefined): void {
    hisLine = reply;
    face = newFace;
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
    teach = undefined;
    if (c.kind === 'move') resolveMove(c);
    else if (c.kind === 'call') resolveCall();
    else if (c.kind === 'deploy') resolveDeploy(c);
  }

  function pushExchange(yourLine: string): void {
    history.push({ who: 'him', text: hisLine });
    history.push({ who: 'you', text: yourLine });
  }

  function resolveMove(c: Choice): void {
    const line = script.lines.find((l) => l.id === c.id);
    if (!line) return;
    movesMade += 1;
    pushExchange(line.text);

    const events = bookkeep({ kind: 'probe', lineId: line.id });
    const said = events.find((e) => e.type === 'said')?.text;
    const band = (events.find((e) => e.type === 'band')?.text ?? 'neutral') as Band;
    const tellEvent = events.find((e) => e.type === 'tell');

    if (band === 'lands') { resettle(-LAND_HIT, 0); spendPatience(1); }
    else if (band === 'neutral') { resettle(NEUTRAL_HIS, -NEUTRAL_YOU); spendPatience(1); }
    else { resettle(BACKFIRE_HIS, -BACKFIRE_YOU); spendPatience(PATIENCE_MISFIRE); }

    let newTeach: string | undefined;
    if (tellEvent && !shown.has('tell')) {
      shown.add('tell');
      newTeach = 'His hand drifts to his watch — a tell. His body betrays a lie his mouth won’t. That’s the moment to call him, or to finish him.';
    }
    play(said ?? GENERIC_REACTION[band], observedFace(), newTeach);
  }

  // Call him a liar — a judgment, no hint. Right (a real contradiction, or a lie
  // he just told) lands; wrong (he told the truth) steadies him and bleeds you.
  function resolveCall(): void {
    pushExchange('"You’re lying. I can see it in your face."');

    const contra = state.record.openContradictions[0];
    if (contra) {
      bookkeep({ kind: 'catch', contradictionId: contra.id });
      resettle(-CATCH_HIT, 0);
      spendPatience(1);
      play('…how the hell do you know that?', observedFace(), undefined);
      return;
    }

    const last = state.record.statements[state.record.statements.length - 1];
    if (last && last.truth !== 'true' && !calledLies.has(last.id)) {
      calledLies.add(last.id);
      resettle(-CALL_SOFT, 0);
      spendPatience(1);
      play('…that’s a hell of a thing to accuse a man of.', observedFace(), undefined);
      return;
    }

    resettle(CALL_WRONG_HIS, -CALL_WRONG_YOU);
    spendPatience(PATIENCE_MISFIRE);
    play('You’ve got nothing. Sit down before you embarrass yourself.', observedFace(), undefined);
  }

  // Leverage is a FINISHER. Cold (while he's still composed) he laughs it off and
  // you've tipped your hand. Only once he's rattled does it break him.
  function resolveDeploy(c: Choice): void {
    const lev = state.record.heldLeverage.find((l) => l.id === c.id);
    if (!lev) return;

    if (state.hisComposure > LEVERAGE_READY) {
      // cold — don't even consume the card, but it costs you
      pushExchange(`You reach for it too early: ${lev.label.toLowerCase()}.`);
      resettle(COLD_DEPLOY_HIS, -COLD_DEPLOY_YOU);
      spendPatience(PATIENCE_MISFIRE);
      play("Cute. That’s all you’ve got? You’ll have to do better than that.", observedFace(), undefined);
      return;
    }

    pushExchange(`You lay it on the table: ${lev.label.toLowerCase()}.`);
    bookkeep({ kind: 'deploy', leverageId: c.id });
    resettle(-LEVERAGE_FINISH, 0);
    spendPatience(1);
    play('…okay. Okay. What do you want.', observedFace(), undefined);
  }

  function walk(): void {
    state = { ...state, end: 'walked' };
    showAftermath();
  }

  if (TEST) showBeat({ choices: true });
  else typeThen(hisLine, () => showBeat({ choices: true }));
}
