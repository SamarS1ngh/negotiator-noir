import type { Node, Chapter } from '../domain/board';
import type { Mission, MissionOutcome } from '../domain/mission';
import { initBoard, takeAction, applyDealOutcome, applyMissionOutcome, bumpHeat } from '../domain/board';
import { initCampaign, applyCampaign, learn, atRisk, record } from '../domain/campaign';
import { saveGame, loadGame, clearSave } from './save';
import { CHAPTER_1 } from '../content/chapter1';
import { CHAPTER_2, buildCh2Recap } from '../content/chapter2';
import { CHAPTER_3 } from '../content/chapter3';
import { CHAPTER_4 } from '../content/chapter4';
import { CHAPTER_5 } from '../content/chapter5';
import { CHAPTER_6 } from '../content/chapter6';
import { buildInterlude } from '../content/interludes';
import { SAL_MISSION } from '../content/sal_mission';
import { CREW_MISSION } from '../content/crew_mission';
import { BIANCHI_MISSION } from '../content/bianchi_mission';
import { SANTO_MISSION } from '../content/santo_mission';
import { REESE_MISSION } from '../content/reese_mission';
import { OTTO_MISSION } from '../content/otto_mission';
import { ADLER_MISSION } from '../content/adler_mission';
import { GALLO_MISSION } from '../content/gallo_mission';
import { RUNNER_MISSION } from '../content/runner_mission';
import { VERA_MISSION } from '../content/vera_mission';
import { BAGMAN_MISSION } from '../content/bagman_mission';
import { HALLORAN_MISSION } from '../content/halloran_mission';
import { FINN_MISSION } from '../content/finn_mission';
import { BREEN_MISSION } from '../content/breen_mission';
import { DELANEY_MISSION } from '../content/delaney_mission';
import { TELLER_MISSION } from '../content/teller_mission';
import { AUDITOR_MISSION } from '../content/auditor_mission';
import { SABLE_MISSION } from '../content/sable_mission';
import { REPORTER_MISSION } from '../content/reporter_mission';
import { AIDE_MISSION } from '../content/aide_mission';
import { RIVAL_MISSION } from '../content/rival_mission';
import { RICCI_CONFRONT } from '../content/ricci_confront';
import { DELUCA_CONFRONT } from '../content/deluca_confront';
import { KASTNER_CONFRONT } from '../content/kastner_confront';
import { CASSAR_CONFRONT } from '../content/cassar_confront';
import { VANE_CONFRONT } from '../content/vane_confront';
import { MARLOWE_ENDGAME } from '../content/marlowe_endgame';
import { PROLOGUE_MISSION } from '../content/prologue';
import { renderBoard } from '../ui/board';
import { renderMeet } from '../ui/meet';
import { startMission } from './mission';

// board actions that open a full branching mission (Detroit-style), by action id.
// Ch1: Sal/crew/Bianchi · Ch2: Santo/Reese · Ch3: Otto/Adler.
const MISSIONS = [
  SAL_MISSION, CREW_MISSION, BIANCHI_MISSION, GALLO_MISSION, RUNNER_MISSION,   // ch1
  SANTO_MISSION, REESE_MISSION, VERA_MISSION, BAGMAN_MISSION,                  // ch2
  HALLORAN_MISSION, FINN_MISSION, BREEN_MISSION, DELANEY_MISSION,              // ch3
  TELLER_MISSION, AUDITOR_MISSION, SABLE_MISSION,                              // ch4
  REPORTER_MISSION, AIDE_MISSION, RIVAL_MISSION,                              // ch5
  OTTO_MISSION, ADLER_MISSION,                                                // ch6
];

// THE CLIMB — the six rungs, in order. Each stage = a chapter board + its target's
// confrontation. Beating the target with a WAY UP (deal.gotName) advances to the
// next stage; the last (Marlowe) ends the game. `forewarned`/`cracks` pick the
// confrontation's reactive opening from what you did on the board.
interface Stage { ch: Chapter; confront: Mission; target: string; forewarned: string; cracks: string[]; }
const STAGES: Stage[] = [
  { ch: CHAPTER_1, confront: RICCI_CONFRONT,   target: 'ricci',   forewarned: 'ricciForewarned',   cracks: ['crewSpooked', 'crewLoyal', 'bianchiPressing', 'salMole', 'skim', 'ledger', 'moneyTrail', 'insideRicci'] },
  { ch: CHAPTER_2, confront: DELUCA_CONFRONT,  target: 'deluca',  forewarned: 'delucaForewarned',  cracks: ['santoTurned', 'delucaProof', 'cashProof', 'bagman_turned', 'reese_proof', 'upriverThread'] },
  { ch: CHAPTER_3, confront: KASTNER_CONFRONT, target: 'kastner', forewarned: 'kastnerForewarned', cracks: ['manifestProof', 'customsProof', 'witnessLead', 'unionRival', 'halloran_turned', 'breenTurned', 'finn_helped', 'delaney_backing'] },
  { ch: CHAPTER_4, confront: CASSAR_CONFRONT,  target: 'cassar',  forewarned: 'cassarForewarned',  cracks: ['accountAccess', 'auditLever', 'upriverNames', 'customsProof', 'teller_turned', 'auditor_turned', 'sable_turned'] },
  { ch: CHAPTER_5, confront: VANE_CONFRONT,    target: 'vane',    forewarned: 'vaneForewarned',    cracks: ['pressLever', 'hallAccess', 'rivalBacking', 'upriverNames', 'reporter_allied', 'aide_turned', 'rival_allied'] },
  { ch: CHAPTER_6, confront: MARLOWE_ENDGAME,  target: 'marlowe', forewarned: 'marloweForewarned', cracks: ['ottoTurned', 'booksExposed', 'ricciMole', 'adler_turned'] },
];

// THE FATE SYSTEM — the human cost of a hot, careless climb. A recurring ally you
// let get too exposed (high heat + weak bond) dies on the transition into the named
// chapter; one you used coldly turns on you. These write persistent ledger flags
// the interludes surface and the finale reads for its who-lived roll-call.
const FATE_DEATHS = [
  { at: 'ch3', id: 'sal',  alive: 'sal_mole',    dead: 'sal_dead' },
  { at: 'ch3', id: 'pip',  alive: 'pip_helped',  dead: 'pip_dead' },
  { at: 'ch4', id: 'finn', alive: 'finn_helped', dead: 'finn_dead' },
  { at: 'ch5', id: 'vera', alive: 'vera_turned', dead: 'vera_dead' },
];
const FATE_BETRAYALS = [
  { at: 'ch4', id: 'bianchi', betray: 'bianchi_betrayed' },
  { at: 'ch4', id: 'vera',    betray: 'vera_betrayed' },
];

// prep flags → derived flags the confrontation gates approaches on, so every
// thing you did on the board changes what you can do at the table:
//   proof     = hard evidence dug up (skim or ledger)      → the blade for the way in
//   knowsFear = you learned Ricci's terror of Marlowe      → the fear read
//               (from Sal turned, the crew's gossip, or studying him)
function missionFlags(flags: Set<string>): Set<string> {
  const f = new Set(flags);
  if (f.has('skim') || f.has('ledger') || f.has('moneyTrail')) f.add('proof');   // the fence's cash thread is hard evidence too
  if (f.has('salMole') || f.has('crewLoyal') || f.has('type') || f.has('insideRicci')) f.add('knowsFear');  // the runner sees Ricci's fear up close
  return f;
}

/**
 * The campaign loop, alive: THE WEB is a corkboard of people you MEET in short
 * face-to-face scenes; working them shifts the board (which reacts) and sets the
 * difficulty of the sit-down; the deal outcome rewrites the board. You climb by
 * turning the empire's own people. Spec: docs/superpowers/specs/2026-07-19-*.
 */
export function startGame(root: HTMLElement, onFinish?: () => void): void {
  void onFinish;
  let ch = CHAPTER_1;
  let st = initBoard(ch);
  // the campaign purse/standing/bonds/ledger/codex — persists across every chapter
  // (same closure, so it survives the climb without extra carry)
  let camp = initCampaign();
  let selected: string | null = null;
  let toast: string | undefined;
  let changed: Set<string> | undefined;
  // snapshot of how the current chapter began — lets "restart chapter" undo a bad run
  let chapterEntry = { flags: [] as string[], heat: 0, camp };
  function snapChapter(): void { chapterEntry = { flags: [...st.flags], heat: st.heat, camp }; }

  // apply a mission outcome's persistent effects (money/faction/bond/ledger) and
  // bank the principle it taught into the codex
  function applyOutcomeToCampaign(o: MissionOutcome): void {
    camp = applyCampaign(camp, o.campaign);
    if (o.debrief) camp = learn(camp, o.debrief.principle);
  }

  function showBoard(): void {
    saveGame(ch.id, st, camp);   // the board is the safe point — checkpoint here
    renderBoard(root, ch, st, selected, { act, select, sitDown, restartChapter, restartGame }, toast, changed);
    changed = undefined;   // flare is a one-shot
  }

  // restore the current chapter to how it began (undo a botched run of prep + a lost sit-down)
  function restartChapter(): void {
    st = initBoard(ch, chapterEntry.heat);
    st = { ...st, flags: new Set(chapterEntry.flags) };
    camp = chapterEntry.camp;
    if (ch.id === 'ch2') st = { ...st, nodes: st.nodes.map((n) => (n.id === 'ricci' ? { ...n, disposition: (st.flags.has('ricciMole') ? 4 : 1) as Node['disposition'] } : n)) };
    selected = null; toast = 'Chapter reset.'; changed = undefined; showBoard();
  }

  // wipe the save and start the whole climb over from the cold-open
  function restartGame(): void {
    clearSave();
    ch = CHAPTER_1; st = initBoard(ch); camp = initCampaign();
    selected = null; toast = undefined; changed = undefined;
    snapChapter();
    startMission(root, PROLOGUE_MISSION, { name: 'RICCI', role: 'the collector', portrait: 'assets/art/cast/ricci.jpg' }, new Set<string>(), showBoard);
  }

  function select(nodeId: string | null): void {
    selected = nodeId;
    toast = undefined;
    showBoard();
  }

  // working someone is a MANIPULATION: you meet them, they want something, and
  // you pick how to play them. The right read gets the goods; a wrong one fails
  // and can cost you. Nobody hands you anything for free.
  function act(actionId: string): void {
    // some board actions open a full branching mission (Detroit-style): several
    // approaches, each ending bends the board its own way. The reached outcome
    // rewrites it.
    const mission = MISSIONS.find((m) => m.actionId === actionId);
    if (mission) {
      const person = st.nodes.find((x) => x.id === mission.nodeId);
      startMission(root, mission, { name: person?.name ?? '', role: person?.role ?? '', portrait: person?.portrait }, missionFlags(st.flags), (outcome) => {
        st = applyMissionOutcome(st, actionId, outcome);
        applyOutcomeToCampaign(outcome);   // money/faction/bond/ledger + bank the lesson
        selected = null;
        toast = outcome.ripple;
        changed = new Set([mission.nodeId, ...(outcome.dispositions?.map((d) => d.nodeId) ?? [])]);
        showBoard();
      });
      return;
    }

    const a = ch.actions.find((x) => x.id === actionId);
    if (!a) return;
    const n = st.nodes.find((x) => x.id === a.nodeId);

    // meet options are built fresh; we map the chosen one back to its content
    const opts = (a.options ?? []).map((o) => ({ text: o.text, good: o.good, result: o.result, ripple: o.ripple }));

    renderMeet(root, {
      name: n?.name ?? '', role: n?.role ?? '', portrait: n?.portrait,
      beats: a.scene ?? [],
      ask: a.ask,
      options: a.options ? opts : undefined,
      result: a.options ? undefined : a.result,
      ripple: a.options ? undefined : a.ripple,
    }, (chosen) => {
      let success = true;
      let failDelta: { nodeId: string; delta: number } | undefined;
      if (a.options && chosen) {
        const src = a.options.find((o) => o.text === chosen.text);
        success = src?.good ?? false;
        failDelta = src?.failDelta;
      }
      st = takeAction(ch, st, actionId, success, failDelta);
      selected = null;
      toast = undefined;
      changed = new Set([a.nodeId, ...(a.dispositionDelta ? [a.dispositionDelta.nodeId] : []), ...(failDelta ? [failDelta.nodeId] : [])]);
      showBoard();
    });
  }

  // ---- THE CLIMB: each chapter's sit-down is a branching confrontation. Beating
  // the target with a WAY UP (deal.gotName) climbs you to the next chapter; a
  // lesser result leaves you stuck on this rung. Chapter Three (Marlowe) is the end.
  function sitDown(): void {
    const i = STAGES.findIndex((s) => s.ch.id === ch.id);
    if (i <= 0) { ricciSitDown(); return; }   // Ricci has bespoke openings; keep it
    runConfront(i);
  }

  // stages 1..5 (DeLuca → Marlowe) share one generic confrontation runner
  function runConfront(i: number): void {
    const stage = STAGES[i]!;
    const flags = missionFlags(new Set([...st.flags, ...camp.ledger]));
    const startAt = (flags.has(stage.forewarned) || st.heat >= 6) ? 's0_forewarned'
      : stage.cracks.some((f) => flags.has(f)) ? 's0_cracks' : 's0_serene';
    const node = st.nodes.find((n) => n.id === stage.target);
    startMission(root, stage.confront, { name: node?.name ?? '', role: node?.role ?? '', portrait: node?.portrait }, flags, (outcome) => {
      applyOutcomeToCampaign(outcome);
      const heat = bumpHeat(st.heat, outcome.heatDelta ?? 0);
      if (outcome.deal?.gotName && STAGES[i + 1]) { climbTo(i + 1, outcome, heat); return; }
      if (STAGES[i + 1]) {
        // a climbing chapter with no way up this time — DON'T dead-end; keep him
        // sit-able so you can work more people and try the sit-down again
        st = { ...st, heat };
        toast = (outcome.ripple ? outcome.ripple + ' ' : '') + '— no way up yet. Work more of his people, then sit down again.';
      } else {
        // the finale (Marlowe): this outcome ends the game
        st = applyDealOutcome(ch, st, outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 });
        st = { ...st, heat }; toast = outcome.ripple;
      }
      selected = null; changed = new Set([stage.target]); showBoard();
    }, startAt);
  }

  // who dies / who turns on you crossing into chapter `atCh` (writes ledger flags)
  function computeFates(atCh: string): void {
    for (const f of FATE_DEATHS) {
      if (f.at === atCh && camp.ledger.has(f.alive) && atRisk(camp, f.id, st.heat) && !camp.ledger.has(f.dead)) camp = record(camp, f.dead);
    }
    for (const f of FATE_BETRAYALS) {
      if (f.at === atCh && (camp.bonds[f.id] ?? 2) < 2 && !camp.ledger.has(f.betray)) camp = record(camp, f.betray);
    }
  }

  // advance to the next rung: carry your web, resolve fates, play the interlude, seed the board
  function climbTo(nextIndex: number, outcome: MissionOutcome, heat: number): void {
    const next = STAGES[nextIndex]!;
    const prevTarget = STAGES[nextIndex - 1]!.target;
    const carried = new Set<string>([...st.flags, ...camp.ledger]);
    for (const f of outcome.worldFlags ?? []) carried.add(f);
    if ((outcome.deal?.faceIdx ?? 2) <= 0) carried.add(`${prevTarget}Mole`);
    if (next.ch.id === 'ch6') carried.add('marloweMet');
    computeFates(next.ch.id);
    for (const f of camp.ledger) carried.add(f);
    const recap = next.ch.id === 'ch2' ? buildCh2Recap(carried) : buildInterlude(next.ch.id, carried);
    startMission(root, recap, { name: '', role: '', portrait: 'assets/art/scene/now.jpg' }, carried, () => {
      ch = next.ch;
      st = initBoard(ch, heat);
      st = { ...st, flags: new Set([...st.flags, ...carried]),
        nodes: st.nodes.map((n) => (n.id === 'ricci' && ch.id === 'ch2' ? { ...n, disposition: (carried.has('ricciMole') ? 4 : 1) as Node['disposition'] } : n)) };
      selected = null; changed = new Set(); toast = undefined; snapChapter(); showBoard();
    });
  }

  function ricciSitDown(): void {
    const flags = missionFlags(st.flags);
    let startAt = 's0_cold';
    if (flags.has('ricciHardened')) startAt = 's0_hardened';
    else if (flags.has('ricciForewarned') || flags.has('salBought') || st.heat >= 6) startAt = 's0_forewarned';
    else if (flags.has('crewSpooked') || flags.has('crewLoyal') || flags.has('bianchiPressing') || flags.has('salMole')) startAt = 's0_rattled';
    const ricci = st.nodes.find((n) => n.id === 'ricci');
    startMission(root, RICCI_CONFRONT, { name: ricci?.name ?? 'RICCI', role: ricci?.role ?? '', portrait: ricci?.portrait }, flags,
      (outcome) => {
        applyOutcomeToCampaign(outcome);
        const heat = bumpHeat(st.heat, outcome.heatDelta ?? 0);
        if (outcome.deal?.gotName) { climbTo(1, outcome, heat); return; }
        // no way up — keep Ricci sit-able so you can regroup and try again
        st = { ...st, heat };
        selected = null; changed = new Set(['ricci']);
        toast = (outcome.ripple ? outcome.ripple + ' ' : '') + '— no way up yet. Work more of his people, then sit down again.';
        showBoard();
      }, startAt);
  }

  // (DeLuca → Marlowe sit-downs + all chapter climbs now run through the generic
  // runConfront/climbTo above, driven by the STAGES table.)

  // dev shortcut: ?ch2 … ?ch6 jump straight into a later chapter for playtesting,
  // seeded with enough carried threads that the confrontation approaches unlock.
  const chJump = typeof location !== 'undefined'
    ? (/[?&#](ch[2-6])\b/.exec(location.search + location.hash)?.[1] ?? '')
    : '';
  if (chJump) {
    const stage = STAGES.find((s) => s.ch.id === chJump);
    if (stage) {
      ch = stage.ch;
      st = initBoard(ch, 2);
      const seed = ['ricciMole', 'delucaMole', 'skim', 'moneyTrail', 'insideRicci', 'upriverThread', 'cargoRevealed',
        'manifestProof', 'customsProof', 'witnessLead', 'unionRival', 'cassarNamed',
        'accountAccess', 'auditLever', 'upriverNames', 'vaneNamed',
        'pressLever', 'hallAccess', 'rivalBacking', 'marloweExposed', 'marloweMet', 'ottoTurned'];
      st = { ...st, flags: new Set(seed),
        nodes: st.nodes.map((n) => (n.id === 'ricci' ? { ...n, disposition: 4 as Node['disposition'] } : n)) };
      camp = { ...camp, ledger: new Set(['sal_mole', 'vera_turned', 'finn_helped']) };
      snapChapter(); showBoard();
      return;
    }
  }

  // dev shortcut: ?m=<actionId|id> drops straight into one mission for art/flow
  // playtesting (skips the prologue + board), then returns to the board.
  const mjump = typeof location !== 'undefined'
    ? (/[?&#]m=([\w-]+)/.exec(location.search + location.hash)?.[1] ?? '')
    : '';
  if (mjump) {
    const m = MISSIONS.find((x) => x.actionId === mjump || x.id === mjump);
    if (m) {
      const person = st.nodes.find((x) => x.id === m.nodeId);
      startMission(root, m, { name: person?.name ?? '', role: person?.role ?? '', portrait: person?.portrait }, missionFlags(st.flags), showBoard);
      return;
    }
  }

  // resume a saved climb (a dev shortcut above would have taken over first)
  const saved = typeof localStorage !== 'undefined' ? loadGame() : null;
  if (saved) {
    const stage = STAGES.find((s) => s.ch.id === saved.chId);
    if (stage) {
      ch = stage.ch; st = saved.st; camp = saved.camp;
      selected = null; toast = 'Resumed.'; changed = undefined; snapChapter(); showBoard();
      return;
    }
  }

  // fresh game: open on the lived cold-open (the fall, played through Ricci's face
  // + a choice) — then the board
  snapChapter();
  startMission(
    root, PROLOGUE_MISSION,
    { name: 'RICCI', role: 'the collector', portrait: 'assets/art/cast/ricci.jpg' },
    new Set<string>(),
    showBoard,
  );
}
