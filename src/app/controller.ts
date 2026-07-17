import type { AngleId, Band, DuelState, EndState, IntelId, MoodState, Opponent, Script } from '../domain/types';
import { initDuel, apply, moodFor } from '../domain/engine';
import { endStateFor } from '../domain/outcome';
import { bandForRegister, REGISTER_ANGLE } from '../domain/registers';
import type { Register } from '../domain/registers';
import { renderHands, attachGestures, HOLD_PEAK_MIN, HOLD_PEAK_MAX } from '../ui/hands';
import type { Act, HandsHandlers } from '../ui/hands';
import { renderAftermath } from '../ui/aftermath';

const TEST = import.meta.env.MODE === 'test';
const TIMING = { TYPE_MS: 30, WINDOW_MS: 3800, FLASH_MS: 1400, BEAT_PAUSE: 700 };

// ---- the economy (carried from v0.5.1) ----
const LAND_HIT = 20;
const NEUTRAL_HIS = 4;
const NEUTRAL_YOU = 6;
const BACKFIRE_HIS = 8;
const BACKFIRE_YOU = 20;
const CATCH_HIT = 28;
// Letting a moment pass costs you the beat: he re-composes and his patience
// burns. It does NOT bleed your nerve — otherwise idling (reading the dossier,
// looking away, putting the phone down) death-spirals you, which is nonsense.
// His patience is already the clock: sit there long enough and he walks out.
const MISS_HIS = 4;
const BLINK_YOU = 14;       // you held the stare too long and looked away first
const WEAK_STARE_YOU = 6;   // flinched off the stare early
const LEVERAGE_FINISH = 50;
const LEVERAGE_READY = 45;
const COLD_DEPLOY_HIS = 4;
const COLD_DEPLOY_YOU = 16;
const PATIENCE_START = 7;
const PATIENCE_MISFIRE = 2;

const NOTE: Record<Band, string> = {
  lands: 'that got in',
  neutral: 'nothing',
  backfires: 'wrong read',
};

const TELL_MOODS: MoodState[] = ['rattled', 'cornered', 'folding'];

function nerveWord(c: number): string {
  if (c > 75) return 'steady';
  if (c > 50) return 'shaken';
  if (c > 30) return 'rattled';
  if (c > 0) return 'cornered';
  return 'breaking';
}

function clamp(n: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, n)); }

/**
 * The HANDS-ON duel. No option list: his face is the interface and you act on
 * him with gestures inside a live window — swipe up to press, hold his eyes to
 * stare him down (release at the peak), swipe down to ease off, tap his tell
 * the instant it flashes, drag your card up to finish him.
 *
 * The read MOVES: recon gives you his nature (the rule), his face gives you his
 * state, and which register lands changes as he cracks (see domain/registers).
 * Miss the window and he takes it. Break his nerve to win; lose yours or his
 * patience and it's over. Spec: docs/superpowers/specs/2026-07-17-hands-on-duel-design.md
 */
export function startDuel(
  root: HTMLElement,
  opp: Opponent,
  script: Script,
  intel: Set<IntelId>,
  onDone?: () => void,
): void {
  let state: DuelState = initDuel(opp, script);
  state = {
    ...state,
    record: {
      ...state.record,
      heldLeverage: script.leverage.filter((l) => intel.has(`lev:${l.id}` as IntelId)),
    },
  };
  const dossier: string[] = (opp.recon?.leads ?? []).filter((l) => intel.has(l.grants)).map((l) => l.dossier);

  let patience = PATIENCE_START;
  let hisLine = opp.opener ?? 'Well? You wanted this meeting.';
  let note: string | undefined;
  let live = false;
  let flashLive = false;
  let dossierOpen = false;
  let teachOpen = !TEST;              // the gesture card, once
  let reaction: 'hit' | 'lean' | 'settle' | undefined;
  let windowTimer: ReturnType<typeof setTimeout> | undefined;
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  let acted = false;                   // one act per window
  const usedPerAngle = new Map<AngleId, number>();
  let hud: { surface: HTMLElement; setHold(ms: number): void } | undefined;
  let detach: (() => void) | undefined;

  const handlers: HandsHandlers = {
    act, walk,
    // Checking what you know is free — the moment pauses while the panel is up,
    // and the window restarts clean when you close it.
    openDossier: () => {
      dossierOpen = true;
      if (windowTimer) clearTimeout(windowTimer);
      draw();
    },
    closeDossier: () => {
      dossierOpen = false;
      if (live && !acted) openWindow(); else draw();
    },
    closeTeach: () => { teachOpen = false; openWindow(); },
  };

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

  function heldCard() { return state.record.heldLeverage[0]; }

  function draw(typedLen?: number): void {
    hud = renderHands(root, opp, {
      objective: opp.objective?.goal ?? 'BREAK HIM',
      mood: state.mood,
      hisNerveWord: nerveWord(state.hisComposure),
      hisNervePct: state.hisComposure,
      yourNervePct: state.yourComposure,
      patiencePct: clamp((patience / PATIENCE_START) * 100, 0, 100),
      hisLine,
      typedLen,
      face: observedFace(),
      live,
      windowMs: TIMING.WINDOW_MS,
      flash: flashLive ? opp.tell?.text : undefined,
      hasCard: Boolean(heldCard()),
      cardLabel: heldCard()?.label.toUpperCase(),
      note,
      reaction,
      dossier,
      dossierOpen,
      teachOpen,
    }, handlers);
    reaction = undefined;

    detach?.();
    detach = attachGestures(
      hud.surface,
      () => live && !acted && !dossierOpen && !teachOpen,
      () => flashLive,
      handlers,
      (ms) => hud?.setHold(ms),
    );
  }

  function openWindow(): void {
    if (state.end !== 'ongoing') { showAftermath(); return; }
    live = true;
    acted = false;
    draw();
    if (TEST) return;
    windowTimer = setTimeout(() => {
      if (acted || dossierOpen || teachOpen) return; // never expire behind a panel
      live = false;
      flashLive = false;
      resettle(MISS_HIS, 0);
      spendPatience(1);
      say('The silence goes nowhere. He settles back.', 'lean', 'moment gone');
    }, TIMING.WINDOW_MS);
  }

  function closeWindow(): void {
    live = false;
    acted = true;
    if (windowTimer) clearTimeout(windowTimer);
    if (flashTimer) clearTimeout(flashTimer);
    hud?.setHold(0);
  }

  // his reply lands, then the next moment goes live
  function say(line: string, react?: 'hit' | 'lean' | 'settle', beatNote?: string): void {
    hisLine = line;
    note = beatNote;
    reaction = react;
    if (state.end !== 'ongoing') { draw(); showAftermath(); return; }
    if (TEST) { openWindow(); return; }
    typeThen(line, () => setTimeout(openWindow, TIMING.BEAT_PAUSE));
  }

  function typeThen(text: string, done: () => void): void {
    let i = 0;
    const step = (): void => {
      i += 1;
      draw(i);
      if (i >= text.length) { done(); return; }
      setTimeout(step, TIMING.TYPE_MS);
    };
    draw(0);
    setTimeout(step, TIMING.TYPE_MS);
  }

  function showAftermath(): void {
    detach?.();
    renderAftermath(root, state, opp, { continue: () => onDone?.() });
  }

  // ---- acts ----

  function act(a: Act): void {
    if (!live || acted) return;
    if (a.kind === 'catch') { doCatch(); return; }
    if (a.kind === 'slam') { doSlam(); return; }
    if (a.kind === 'stare') { doStare(a.holdMs); return; }
    doRegister(a.kind === 'press' ? 'press' : 'ease');
  }

  // press / ease / (a well-timed stare) — the read is which fits his state NOW
  function doRegister(reg: Register): void {
    closeWindow();
    const band = bandForRegister(opp.type, state.mood, reg);
    const angle = REGISTER_ANGLE[reg] as AngleId;
    const lines = script.lines.filter((l) => l.angleId === angle);
    const used = usedPerAngle.get(angle) ?? 0;
    const line = lines[used % Math.max(1, lines.length)];
    usedPerAngle.set(angle, used + 1);

    let said: string | undefined;
    let tellFired = false;
    if (line) {
      const events = bookkeep({ kind: 'probe', lineId: line.id });
      said = events.find((e) => e.type === 'said')?.text;
      tellFired = events.some((e) => e.type === 'tell');
    }

    if (band === 'lands') { resettle(-LAND_HIT, 0); spendPatience(1); }
    else if (band === 'neutral') { resettle(NEUTRAL_HIS, -NEUTRAL_YOU); spendPatience(1); }
    else { resettle(BACKFIRE_HIS, -BACKFIRE_YOU); spendPatience(PATIENCE_MISFIRE); }

    // his tell slips as he cracks — it flashes on the NEXT moment; tap it
    if (tellFired || (band === 'lands' && TELL_MOODS.includes(state.mood))) armFlash();

    const react = band === 'lands' ? 'hit' : band === 'backfires' ? 'settle' : undefined;
    say(said ?? fallbackLine(band), react, NOTE[band]);
  }

  function doStare(holdMs: number): void {
    if (holdMs < HOLD_PEAK_MIN) {
      closeWindow();
      resettle(NEUTRAL_HIS, -WEAK_STARE_YOU);
      spendPatience(1);
      say('You look away first. He almost smiles.', 'lean', 'you flinched');
      return;
    }
    if (holdMs > HOLD_PEAK_MAX + 400) {
      closeWindow();
      resettle(BACKFIRE_HIS, -BLINK_YOU);
      spendPatience(1);
      say('You hold it too long. It turns awkward, and he knows it.', 'lean', 'you overheld');
      return;
    }
    doRegister('stare');
  }

  function armFlash(): void {
    if (!opp.tell) return;
    flashLive = true;
    if (TEST) return;
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { flashLive = false; if (live) draw(); }, TIMING.FLASH_MS);
  }

  function doCatch(): void {
    if (!flashLive) return;
    closeWindow();
    flashLive = false;
    const contra = state.record.openContradictions[0];
    if (contra) bookkeep({ kind: 'catch', contradictionId: contra.id });
    resettle(-CATCH_HIT, 0);
    spendPatience(1);
    say('…how the hell do you know that?', 'hit', 'caught him');
  }

  function doSlam(): void {
    const lev = heldCard();
    if (!lev) return;
    closeWindow();
    if (state.hisComposure > LEVERAGE_READY) {
      resettle(COLD_DEPLOY_HIS, -COLD_DEPLOY_YOU);
      spendPatience(PATIENCE_MISFIRE);
      say('Cute. That’s all you’ve got?', 'settle', 'too early');
      return;
    }
    bookkeep({ kind: 'deploy', leverageId: lev.id });
    resettle(-LEVERAGE_FINISH, 0);
    spendPatience(1);
    say('…okay. Okay. What do you want.', 'hit', 'that broke him');
  }

  function fallbackLine(band: Band): string {
    if (band === 'lands') return 'Something in his face gives.';
    if (band === 'neutral') return 'He just looks at you.';
    return 'He almost laughs.';
  }

  function walk(): void {
    closeWindow();
    state = { ...state, end: 'walked' };
    showAftermath();
  }

  // open on his line; the teach card gates the first window
  if (TEST) { draw(); openWindow(); }
  else typeThen(hisLine, () => { draw(); });
}
