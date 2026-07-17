import type { AngleId, Band, DuelState, EndState, IntelId, MoodState, Opponent, Push, Script } from '../domain/types';
import { initDuel, apply, moodFor } from '../domain/engine';
import { endStateFor } from '../domain/outcome';
import { renderCine } from '../ui/scene';
import type { Choice, CineHandlers, Exchange } from '../ui/scene';
import { renderAftermath } from '../ui/aftermath';

const TEST = import.meta.env.MODE === 'test';
const TIMING = { TYPE_MS: 34, PRE_CHOICES: 550 };

// ---- the GAME economy (v0.5.1). The engine does bookkeeping; the controller
// owns the nerve + patience numbers so the duel is hard and losable. ----
const LAND_HIT = 20;
const NEUTRAL_HIS = 4;
const NEUTRAL_YOU = 6;
const BACKFIRE_HIS = 8;
const BACKFIRE_YOU = 20;
const CATCH_HIT = 28;
const CALL_SOFT = 14;
const CALL_WRONG_HIS = 8;
const CALL_WRONG_YOU = 24;
const LEVERAGE_FINISH = 50;
const LEVERAGE_READY = 45;
const COLD_DEPLOY_HIS = 4;
const COLD_DEPLOY_YOU = 16;
const PATIENCE_START = 6;
const PATIENCE_MISFIRE = 2;
// his pushes (the volley): standing firm nudges him back; caving bleeds you.
const HOLD_HIS = 4;
const CAVE_HIS = 6;
const CAVE_YOU = 16;

// The move, as a button: a hard label + a 2-3 word hint. You pick the MOVE,
// not a sentence — the line you say is spoken after you commit.
const MOVE_LABEL: Record<AngleId, string> = {
  lean: 'HIT HIS FEAR',
  flatter: 'FLATTER',
  plant_doubt: 'PLANT DOUBT',
  bluff: 'BLUFF',
  offer_out: 'OFFER A WAY OUT',
};
const MOVE_HINT: Record<AngleId, string> = {
  lean: 'his boss',
  flatter: 'feed his ego',
  plant_doubt: 'crack his story',
  bluff: 'claim you have it',
  offer_out: 'let him off',
};

const GENERIC_REACTION: Record<Band, string> = {
  lands: 'Something in his face gives.',
  neutral: 'He just looks at you.',
  backfires: 'He almost laughs.',
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
 * The LIVING manipulation duel. What you dug up in recon (`intel`) is your hand:
 * leverage cards only exist if you found them; your dossier tells you how to
 * play him — or you walked in blind. He's not a dummy: he pushes back (the
 * volley), reacts with his body, and his tell flashes live. Break his nerve to
 * win; let yours hit zero or his patience run out and you lose.
 */
export function startDuel(
  root: HTMLElement,
  opp: Opponent,
  script: Script,
  intel: Set<IntelId>,
  onDone?: () => void,
): void {
  let state: DuelState = initDuel(opp, script);
  // your hand at the table is exactly the leverage you dug up
  state = {
    ...state,
    record: {
      ...state.record,
      heldLeverage: script.leverage.filter((l) => intel.has(`lev:${l.id}` as IntelId)),
    },
  };
  const dossier: string[] = (opp.recon?.leads ?? []).filter((l) => intel.has(l.grants)).map((l) => l.dossier);

  let patience = PATIENCE_START;
  const history: Exchange[] = [];
  let hisLine: string = opp.opener ?? 'Well? You wanted this meeting.';
  let face: string | undefined;
  let teach: string | undefined = intel.has('type')
    ? 'Break his nerve. Your dossier says how.'
    : "You came in blind. Read him — wrong move bleeds you.";
  let movesMade = 0;
  const shown = new Set<string>();
  const calledLies = new Set<string>();
  const fired = new Set<string>();
  let currentPush: Push | null = null;
  let dossierOpen = false;
  let typing = false;
  let pendingReaction: 'hit' | 'lean' | 'settle' | undefined;
  let pendingFlash: string | undefined;

  const handlers: CineHandlers = { choose, respond, walk, openDossier, closeDossier };

  function resettle(hisDelta: number, yourDelta: number): void {
    const his = clamp(state.hisComposure + hisDelta, 0, 100);
    const your = Math.max(0, state.yourComposure + yourDelta);
    const mood = moodFor(his);
    const end: EndState = state.end === 'walked' ? 'walked' : endStateFor(his, your);
    state = { ...state, hisComposure: his, yourComposure: your, mood, end };
  }

  function spendPatience(cost: number): void {
    patience -= cost;
    if (patience <= 0 && state.end === 'ongoing') state = { ...state, end: 'walked' };
  }

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
      cs.push({ id: 'call', kind: 'call', label: 'CALL HIS LIE' });
      for (const l of state.record.heldLeverage) {
        cs.push({ id: l.id, kind: 'deploy', label: 'PLAY YOUR CARD', hint: l.label.toLowerCase() });
      }
    }
    for (const a of script.angles) {
      if (state.spentAngles.includes(a)) continue;
      const line = script.lines.find((l) => l.angleId === a);
      if (!line) continue;
      cs.push({ id: line.id, kind: 'move', label: MOVE_LABEL[a], hint: MOVE_HINT[a] });
    }
    return cs;
  }

  function consume<T>(ref: () => T, clear: () => void): T { const v = ref(); clear(); return v; }

  function renderView(opts: { typing?: number; choices?: boolean; push?: boolean } = {}): void {
    const animate = Boolean(opts.choices || opts.push);
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
      choices: opts.choices && !opts.push ? choicesFor() : [],
      pushOptions: opts.push && currentPush ? currentPush.options.map((o, i) => ({ id: String(i), text: o.text })) : undefined,
      reaction: animate ? consume(() => pendingReaction, () => { pendingReaction = undefined; }) : undefined,
      flashTell: animate ? consume(() => pendingFlash, () => { pendingFlash = undefined; }) : undefined,
      dossier,
      dossierOpen,
    }, handlers);
  }

  function showAftermath(): void {
    renderAftermath(root, state, opp, { continue: () => onDone?.() });
  }

  // After a beat resolves: end it, let him push back, or hand you the choices.
  function nextBeat(): void {
    if (state.end !== 'ongoing') { showAftermath(); return; }
    const push = pendingPush();
    if (push) { showPush(push); return; }
    renderView({ choices: true });
  }

  function pendingPush(): Push | null {
    const pushes = opp.pushes ?? [];
    if (!fired.has('p_threat') && movesMade >= 1) return pushes.find((p) => p.id === 'p_threat') ?? null;
    if (!fired.has('p_lowball') && state.hisComposure <= 55) return pushes.find((p) => p.id === 'p_lowball') ?? null;
    return null;
  }

  function showPush(push: Push): void {
    currentPush = push;
    hisLine = push.line;
    face = observedFace();
    teach = undefined;
    pendingReaction = 'lean';
    if (TEST) { renderView({ push: true }); return; }
    typeThen(push.line, () => renderView({ push: true }));
  }

  function play(reply: string, newFace: string | undefined, newTeach: string | undefined): void {
    hisLine = reply;
    face = newFace;
    teach = newTeach;
    if (TEST) { nextBeat(); return; }
    typeThen(reply, nextBeat);
  }

  function typeThen(text: string, done: () => void): void {
    typing = true;
    let i = 0;
    const step = (): void => {
      i += 1;
      renderView({ typing: i });
      if (i >= text.length) { typing = false; setTimeout(done, TIMING.PRE_CHOICES); return; }
      setTimeout(step, TIMING.TYPE_MS);
    };
    renderView({ typing: 0 });
    setTimeout(step, TIMING.TYPE_MS);
  }

  function openDossier(): void { if (typing) return; dossierOpen = true; refresh(); }
  function closeDossier(): void { dossierOpen = false; refresh(); }
  function refresh(): void { if (currentPush) renderView({ push: true }); else renderView({ choices: true }); }

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

    if (band === 'lands') { resettle(-LAND_HIT, 0); spendPatience(1); pendingReaction = 'hit'; }
    else if (band === 'neutral') { resettle(NEUTRAL_HIS, -NEUTRAL_YOU); spendPatience(1); }
    else { resettle(BACKFIRE_HIS, -BACKFIRE_YOU); spendPatience(PATIENCE_MISFIRE); pendingReaction = 'settle'; }

    let newTeach: string | undefined;
    if (tellEvent) {
      pendingFlash = opp.tell?.text;
      if (!shown.has('tell')) {
        shown.add('tell');
        newTeach = 'A tell. He’s lying — call him.';
      }
    }
    play(said ?? GENERIC_REACTION[band], observedFace(), newTeach);
  }

  function resolveCall(): void {
    pushExchange('"You’re lying. I can see it in your face."');

    const contra = state.record.openContradictions[0];
    if (contra) {
      bookkeep({ kind: 'catch', contradictionId: contra.id });
      resettle(-CATCH_HIT, 0);
      spendPatience(1);
      pendingReaction = 'hit';
      play('…how the hell do you know that?', observedFace(), undefined);
      return;
    }

    const last = state.record.statements[state.record.statements.length - 1];
    if (last && last.truth !== 'true' && !calledLies.has(last.id)) {
      calledLies.add(last.id);
      resettle(-CALL_SOFT, 0);
      spendPatience(1);
      pendingReaction = 'hit';
      play('…that’s a hell of a thing to accuse a man of.', observedFace(), undefined);
      return;
    }

    resettle(CALL_WRONG_HIS, -CALL_WRONG_YOU);
    spendPatience(PATIENCE_MISFIRE);
    pendingReaction = 'settle';
    play('You’ve got nothing. Sit down before you embarrass yourself.', observedFace(), undefined);
  }

  function resolveDeploy(c: Choice): void {
    const lev = state.record.heldLeverage.find((l) => l.id === c.id);
    if (!lev) return;

    if (state.hisComposure > LEVERAGE_READY) {
      pushExchange(`You reach for it too early: ${lev.label.toLowerCase()}.`);
      resettle(COLD_DEPLOY_HIS, -COLD_DEPLOY_YOU);
      spendPatience(PATIENCE_MISFIRE);
      pendingReaction = 'settle';
      play('Cute. That’s all you’ve got?', observedFace(), undefined);
      return;
    }

    pushExchange(`You lay it on the table: ${lev.label.toLowerCase()}.`);
    bookkeep({ kind: 'deploy', leverageId: c.id });
    resettle(-LEVERAGE_FINISH, 0);
    spendPatience(1);
    pendingReaction = 'hit';
    play('…okay. Okay. What do you want.', observedFace(), undefined);
  }

  // his PUSH — you responded. Hold firm and you keep control; give ground and
  // your nerve bleeds while his confidence climbs.
  function respond(optionId: string): void {
    if (!currentPush) return;
    const opt = currentPush.options[Number(optionId)];
    if (!opt) return;
    fired.add(currentPush.id);
    pushExchange(opt.text);
    if (opt.kind === 'hold') { resettle(-HOLD_HIS, 0); pendingReaction = 'settle'; }
    else { resettle(CAVE_HIS, -CAVE_YOU); pendingReaction = 'lean'; }
    currentPush = null;
    play(opt.reply, observedFace(), undefined);
  }

  function walk(): void {
    state = { ...state, end: 'walked' };
    showAftermath();
  }

  if (TEST) renderView({ choices: true });
  else typeThen(hisLine, () => renderView({ choices: true }));
}
