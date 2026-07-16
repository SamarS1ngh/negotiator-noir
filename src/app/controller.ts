import type { AngleId, Band, DuelState, MoodState, Opponent, Script } from '../domain/types';
import { initDuel, apply, moodFor } from '../domain/engine';
import { endStateFor } from '../domain/outcome';
import { renderCine } from '../ui/scene';
import type { Choice, CineHandlers, Exchange } from '../ui/scene';
import { renderAftermath } from '../ui/aftermath';

// Vitest sets MODE 'test' — gate the typewriter so tests drive synchronously.
const TEST = import.meta.env.MODE === 'test';
const TIMING = { TYPE_MS: 34, PRE_CHOICES: 550 };

// ---- the GAME layer (see the research call: this is what makes it a duel you
// can lose, not a menu). The domain engine stays the pure substrate; these are
// the duel rules layered on top. ----
const REGEN = 6;          // his nerve recovers this much on a weak (neutral) move — you can't stall
const MISREAD_YOU = 10;   // extra hit to YOUR nerve on a backfire (on top of the engine's) — misreads bite
const CALL_HIT_SOFT = 16; // calling a lie he told with no hard proof still lands, softer than a real catch
const CALL_WRONG_HIS = 8; // a false accusation steadies him…
const CALL_WRONG_YOU = 22;// …and costs YOU badly — only call it when you're sure

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
 * telegraph and nothing flagged as correct: you read his face + words and
 * judge. Land the right lever for his type and his nerve drops; misread (wrong
 * lever, or call a lie he isn't telling) and HE gains while YOUR nerve bleeds —
 * hit zero and he turns it on you. He recovers if you stall. Break his nerve to
 * zero to win. Reuses the domain engine unchanged; the duel rules live here.
 */
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void {
  let state: DuelState = initDuel(opp, script);
  const history: Exchange[] = [];
  let hisLine: string = opp.opener ?? 'Well? You wanted this meeting.';
  let face: string | undefined;
  let teach: string | undefined =
    "Read him — his words and his face tell you what lands. Feed a proud man's ego; don't offer him charity. Call his lies only when you're sure — guess wrong and he turns it on you.";
  let movesMade = 0;
  const shown = new Set<string>();
  const calledLies = new Set<string>();

  const handlers: CineHandlers = { choose, walk };

  // Re-settle after a game-layer nerve change: clamp, recompute his mood, and
  // re-evaluate win/lose (his nerve 0 → he folds; your nerve 0 → he turns it).
  function resettle(hisDelta: number, yourDelta: number): void {
    const his = clamp(state.hisComposure + hisDelta, 0, 100);
    const your = Math.max(0, state.yourComposure + yourDelta);
    const mood = moodFor(his);
    const end = state.end === 'walked' ? 'walked' : endStateFor(his, your);
    state = { ...state, hisComposure: his, yourComposure: your, mood, end };
  }

  // His OBSERVABLE tell — read material, never an interpretation. When he's
  // cracking, you can SEE the tell; otherwise just his face.
  function observedFace(): string | undefined {
    if (opp.tell && TELL_MOODS.includes(state.mood)) return opp.tell.text;
    return opp.expressions?.[state.mood];
  }

  // Your moves: the manipulation levers (no risk hint — you judge which fits
  // his type), plus the gambits once you've sized him up: call his lie, or play
  // your leverage. Nothing is highlighted as the "right" move.
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
    teach = undefined; // any action clears the standing steer
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

    const r = apply(state, { kind: 'probe', lineId: line.id }, opp, script);
    state = r.state;
    const said = r.events.find((e) => e.type === 'said')?.text;
    const band = (r.events.find((e) => e.type === 'band')?.text ?? 'neutral') as Band;
    const tellEvent = r.events.find((e) => e.type === 'tell');

    // game layer: a weak move lets him settle; a misread bleeds YOUR nerve.
    if (band === 'neutral') resettle(REGEN, 0);
    else if (band === 'backfires') resettle(0, -MISREAD_YOU);

    let newTeach: string | undefined;
    if (tellEvent && !shown.has('tell')) {
      shown.add('tell');
      newTeach = 'His hand drifts to his watch — a tell. His body betrays a lie his mouth won’t. That’s the moment to call him.';
    }
    play(said ?? GENERIC_REACTION[band], observedFace(), newTeach);
  }

  // Call him a liar — a JUDGMENT with no hint. Right (he's holding a real
  // contradiction, or he just lied) → it lands. Wrong (he told the truth) →
  // he steadies and your nerve takes the hit.
  function resolveCall(): void {
    pushExchange('"You’re lying. I can see it in your face."');

    const contra = state.record.openContradictions[0];
    if (contra) {
      const r = apply(state, { kind: 'catch', contradictionId: contra.id }, opp, script);
      state = r.state;
      play('…how the hell do you know that?', observedFace(), undefined);
      return;
    }

    const last = state.record.statements[state.record.statements.length - 1];
    if (last && last.truth !== 'true' && !calledLies.has(last.id)) {
      calledLies.add(last.id);
      resettle(-CALL_HIT_SOFT, 0);
      play('…that’s a hell of a thing to accuse a man of.', observedFace(), undefined);
      return;
    }

    resettle(CALL_WRONG_HIS, -CALL_WRONG_YOU);
    play('You’ve got nothing. Sit down before you embarrass yourself.', observedFace(), undefined);
  }

  function resolveDeploy(c: Choice): void {
    const lev = state.record.heldLeverage.find((l) => l.id === c.id);
    if (!lev) return;
    pushExchange(`You lay it on the table: ${lev.label.toLowerCase()}.`);
    const r = apply(state, { kind: 'deploy', leverageId: c.id }, opp, script);
    state = r.state;
    play('…okay. Okay. What do you want.', observedFace(), undefined);
  }

  function walk(): void {
    const r = apply(state, { kind: 'walk' }, opp, script);
    state = r.state;
    showAftermath();
  }

  if (TEST) showBeat({ choices: true });
  else typeThen(hisLine, () => showBeat({ choices: true }));
}
