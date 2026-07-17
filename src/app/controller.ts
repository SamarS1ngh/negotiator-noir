import type { AngleId, Band, DuelState, EndState, IntelId, MoodState, Opponent, OpponentType, Script } from '../domain/types';
import { initDuel, apply, moodFor } from '../domain/engine';
import { endStateFor } from '../domain/outcome';
import { renderDuel } from '../ui/duel';
import type { ConvoTurn, DuelHandlers, DuelReaction } from '../ui/duel';
import { renderRecord } from '../ui/record';
import { renderAftermath } from '../ui/aftermath';

const TEST = import.meta.env.MODE === 'test';
// Unhurried on purpose. Each beat gets room: your line lands, he answers, the
// scene reacts, the verdict holds. Nothing here should feel snatched away.
//   FLY_IN — your line sits before he answers
//   TYPE_MS— per character of his reply
//   SETTLE — his fully-typed line holds before the scene reacts
//   REACT  — the cinematic (shake / snap / flash) plays out before the verdict
//   PUNCH  — the verdict holds big
const TIMING = { MODAL_CLOSE: 220, FLY_IN: 700, TYPE_MS: 40, SETTLE: 950, REACT: 900, PUNCH: 2000, POST: 700 };

// ---- the economy. Hard on purpose: only a correct read moves him, and every
// wrong pull costs you. Nothing here is handed over — the player earns it. ----
const LAND_HIT = 20;
const NEUTRAL_HIS = 4;
const NEUTRAL_YOU = 6;
const BACKFIRE_HIS = 8;
const BACKFIRE_YOU = 20;
const CATCH_HIT = 28;
const CATCH_WRONG_YOU = 18;   // called him a liar with nothing → you look desperate
const LEVERAGE_FINISH = 50;
const LEVERAGE_READY = 45;
const COLD_DEPLOY_HIS = 4;
const COLD_DEPLOY_YOU = 16;
const PATIENCE_START = 7;
const PATIENCE_MISFIRE = 2;

const TELL_MOODS: MoodState[] = ['rattled', 'cornered', 'folding'];

function clamp(n: number, lo: number, hi: number): number { return Math.min(hi, Math.max(lo, n)); }

/**
 * The duel — the wheel, the cyan word modal, the floating reads (his face, what
 * you notice, his tell), the record. What's different from the old build is
 * what the game REFUSES to do for you:
 *
 *  - it never tells you what kind of man he is (you called that yourself in
 *    the read gate — and the risk dots here are computed from YOUR call, so a
 *    wrong read means your own instruments lie to you all night),
 *  - it never interprets him (the reads are what you SEE, not what it means),
 *  - it never lights up "catch him" (you have to notice the contradiction in
 *    his own words and decide to call it — and calling wrong costs you),
 *  - leverage only finishes a man already breaking, and only if you dug it up.
 *
 * Break his nerve to 0 to win. Your nerve hits 0 → he turns it on you. His
 * patience hits 0 → he walks. Spec: docs/superpowers/specs/2026-07-17-*.
 */
export function startDuel(
  root: HTMLElement,
  opp: Opponent,
  script: Script,
  intel: Set<IntelId>,
  believedType: OpponentType,
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

  let patience = PATIENCE_START;
  let selectedAngle: AngleId | null = null;
  let transcript: ConvoTurn[] = [];
  let lastReaction: DuelReaction | null = null;
  let stage: ReturnType<typeof renderDuel> | undefined;

  const handlers: DuelHandlers = { probe, pickAngle, openRecord, closeModal };

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

  // engine for bookkeeping (statements, contradictions, spent angles, leverage);
  // the controller keeps its own nerve numbers.
  function bookkeep(action: Parameters<typeof apply>[1]): ReturnType<typeof apply>['events'] {
    const prevHis = state.hisComposure;
    const prevYour = state.yourComposure;
    const r = apply(state, action, opp, script);
    state = { ...r.state, hisComposure: prevHis, yourComposure: prevYour };
    return r.events;
  }

  function view(extra: Partial<Parameters<typeof renderDuel>[5]> = {}) {
    return {
      selectedAngle,
      transcript,
      reaction: lastReaction ?? undefined,
      believedType,
      yourNervePct: state.yourComposure,
      patiencePct: clamp((patience / PATIENCE_START) * 100, 0, 100),
      ...extra,
    };
  }

  function showDuel(): void {
    stage = renderDuel(root, state, opp, script, handlers, view());
    appendWalk();
  }

  function renderBeat(s: DuelState, reaction?: DuelReaction, cutToHim?: Parameters<typeof renderDuel>[5]['cutToHim']): void {
    stage = renderDuel(root, s, opp, script, inert, view({ selectedAngle: null, reaction, cutToHim }));
    appendWalk();
  }

  // The scene is STILL until something happens — then it acts, hard. Nothing
  // here runs on a loop; every move below is caused by a beat landing.
  function cinematic(band: Band): void {
    if (TEST || !stage) return;
    if (band === 'lands') {
      // the blow: camera jolts, the bulb rocks, he snaps to his reaction
      stage.shot('shake'); stage.impact(); stage.strike('lands');
    } else if (band === 'backfires') {
      // it goes wrong: the camera gives him the room back
      stage.shot('pull'); stage.impact(); stage.strike('backfires');
    } else {
      // nothing got in — he just shifts, and the camera leans a little closer
      stage.shot('push'); stage.shift();
    }
  }

  const inert: DuelHandlers = { probe() {}, pickAngle() {}, openRecord() {}, closeModal() {} };

  function appendWalk(): void {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'walk-btn';
    btn.dataset.walk = '';
    btn.textContent = 'WALK AWAY';
    btn.addEventListener('click', walk);
    root.appendChild(btn);
  }

  function showAftermath(): void { renderAftermath(root, state, opp, { continue: () => onDone?.() }); }

  function pickAngle(a: AngleId): void { selectedAngle = a; showDuel(); }
  function closeModal(): void { selectedAngle = null; showDuel(); }

  function probe(lineId: string): void {
    const line = script.lines.find((l) => l.id === lineId);
    if (!line) return;
    selectedAngle = null;

    const prev = state;
    const events = bookkeep({ kind: 'probe', lineId });
    const said = events.find((e) => e.type === 'said')?.text;
    const band = (events.find((e) => e.type === 'band')?.text ?? 'neutral') as Band;
    const quoted = Boolean(said);

    if (band === 'lands') { resettle(-LAND_HIT, 0); spendPatience(1); }
    else if (band === 'neutral') { resettle(NEUTRAL_HIS, -NEUTRAL_YOU); spendPatience(1); }
    else { resettle(BACKFIRE_HIS, -BACKFIRE_YOU); spendPatience(PATIENCE_MISFIRE); }

    const reply = said ?? GENERIC[band];
    play({ who: 'you', text: line.text }, { who: 'him', text: reply, quoted }, band, prev);
  }

  // the animated reveal: your line flies in, cut to him, his reply types out,
  // reads update, the verdict punches then docks.
  function play(you: ConvoTurn, him: ConvoTurn, band: Band, prev: DuelState): void {
    const spent = false;
    if (TEST) {
      transcript = [...transcript, you, him];
      lastReaction = { band, fresh: false, spent };
      finish();
      return;
    }
    transcript = [...transcript, you];
    renderBeat(prev, lastReaction ?? undefined);
    setTimeout(() => {
      typewriter(him.text, (typed, done) => {
        renderBeat(prev, lastReaction ?? undefined, { text: him.text, typed, done, quoted: him.quoted ?? false });
        if (!done) return;
        setTimeout(() => {
          // his line settles into the log, the reads update — and the SCENE
          // reacts here: camera, his body, the flash. It gets its own moment.
          transcript = [...transcript, him];
          lastReaction = { band, fresh: false, spent };
          renderBeat(state, lastReaction);
          cinematic(band);
          setTimeout(() => {
            // only once you've seen him react does the verdict punch out
            lastReaction = { band, fresh: true, spent };
            renderBeat(state, lastReaction);
            setTimeout(() => {
              lastReaction = { band, fresh: false, spent };
              setTimeout(finish, TIMING.POST);
            }, TIMING.PUNCH);
          }, TIMING.REACT);   // let him finish reacting before the verdict lands
        }, TIMING.SETTLE);
      });
    }, TIMING.FLY_IN);
  }

  function typewriter(text: string, onTick: (typed: string, done: boolean) => void): void {
    let i = 0;
    const step = (): void => {
      i += 1;
      onTick(text.slice(0, i), i >= text.length);
      if (i < text.length) setTimeout(step, TIMING.TYPE_MS);
    };
    step();
  }

  function finish(): void {
    if (state.end !== 'ongoing') { showAftermath(); return; }
    showDuel();
  }

  function openRecord(): void {
    renderRecord(root, state, { accuse, deploy: doDeploy, close: showDuel });
  }

  // Calling him a liar is a JUDGMENT you assemble yourself. The record lists
  // what he said and never flags anything — YOU pick the line you think is the
  // lie and YOU pick what makes it impossible. Land it and he comes apart. Get
  // it wrong and you've accused a man of lying with nothing in your hand.
  function accuse(statementId: string, againstId: string): void {
    const real = state.record.openContradictions.find(
      (c) => c.statementId === statementId && c.against === againstId,
    );
    const said = state.record.statements.find((s) => s.id === statementId)?.text ?? '';

    if (!real) {
      resettle(0, -CATCH_WRONG_YOU);
      spendPatience(PATIENCE_MISFIRE);
      transcript = [...transcript,
        { who: 'you', text: `"That's a lie — ${said}"` },
        { who: 'him', text: "Is it? Show me. …No? Then sit down.", quoted: true }];
      lastReaction = { band: 'backfires', fresh: false };
      finish();
      return;
    }

    bookkeep({ kind: 'catch', contradictionId: real.id });
    resettle(-CATCH_HIT, 0);
    spendPatience(1);
    transcript = [...transcript,
      { who: 'you', text: "That's not what you said." },
      { who: 'him', text: '…how the hell do you know that?', quoted: true }];
    lastReaction = { band: 'lands', fresh: false };
    finish();
  }

  function doDeploy(leverageId: string): void {
    const lev = state.record.heldLeverage.find((l) => l.id === leverageId);
    if (!lev) { openRecord(); return; }
    if (state.hisComposure > LEVERAGE_READY) {
      resettle(COLD_DEPLOY_HIS, -COLD_DEPLOY_YOU);
      spendPatience(PATIENCE_MISFIRE);
      transcript = [...transcript, { who: 'you', text: `You put it on the table: ${lev.label.toLowerCase()}.` },
        { who: 'him', text: 'Cute. That’s all you’ve got?', quoted: true }];
      lastReaction = { band: 'backfires', fresh: false };
      finish();
      return;
    }
    bookkeep({ kind: 'deploy', leverageId });
    resettle(-LEVERAGE_FINISH, 0);
    spendPatience(1);
    transcript = [...transcript, { who: 'you', text: `You put it on the table: ${lev.label.toLowerCase()}.` },
      { who: 'him', text: '…okay. Okay. What do you want.', quoted: true }];
    lastReaction = { band: 'lands', fresh: false };
    finish();
  }

  function walk(): void {
    state = { ...state, end: 'walked' };
    showAftermath();
  }

  void TELL_MOODS;
  showDuel();
}

const GENERIC: Record<Band, string> = {
  lands: 'Something in his face gives.',
  neutral: 'He just looks at you.',
  backfires: 'He almost laughs.',
};
