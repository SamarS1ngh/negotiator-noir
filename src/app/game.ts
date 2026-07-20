import type { Node } from '../domain/board';
import type { MissionOutcome } from '../domain/mission';
import { initBoard, takeAction, applyDealOutcome, applyMissionOutcome, bumpHeat } from '../domain/board';
import { CHAPTER_1 } from '../content/chapter1';
import { CHAPTER_2, buildCh2Recap } from '../content/chapter2';
import { CHAPTER_3, buildCh3Recap } from '../content/chapter3';
import { SAL_MISSION } from '../content/sal_mission';
import { CREW_MISSION } from '../content/crew_mission';
import { BIANCHI_MISSION } from '../content/bianchi_mission';
import { SANTO_MISSION } from '../content/santo_mission';
import { REESE_MISSION } from '../content/reese_mission';
import { OTTO_MISSION } from '../content/otto_mission';
import { ADLER_MISSION } from '../content/adler_mission';
import { RICCI_CONFRONT } from '../content/ricci_confront';
import { DELUCA_CONFRONT } from '../content/deluca_confront';
import { MARLOWE_CONTACT } from '../content/marlowe_contact';
import { MARLOWE_ENDGAME } from '../content/marlowe_endgame';
import { PROLOGUE_MISSION } from '../content/prologue';
import { renderBoard } from '../ui/board';
import { renderMeet } from '../ui/meet';
import { startMission } from './mission';

// board actions that open a full branching mission (Detroit-style), by action id.
// Ch1: Sal/crew/Bianchi · Ch2: Santo/Reese · Ch3: Otto/Adler.
const MISSIONS = [SAL_MISSION, CREW_MISSION, BIANCHI_MISSION, SANTO_MISSION, REESE_MISSION, OTTO_MISSION, ADLER_MISSION];

// prep flags → derived flags the confrontation gates approaches on, so every
// thing you did on the board changes what you can do at the table:
//   proof     = hard evidence dug up (skim or ledger)      → the blade for the way in
//   knowsFear = you learned Ricci's terror of Marlowe      → the fear read
//               (from Sal turned, the crew's gossip, or studying him)
function missionFlags(flags: Set<string>): Set<string> {
  const f = new Set(flags);
  if (f.has('skim') || f.has('ledger')) f.add('proof');
  if (f.has('salMole') || f.has('crewLoyal') || f.has('type')) f.add('knowsFear');
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
  let selected: string | null = null;
  let toast: string | undefined;
  let changed: Set<string> | undefined;

  function showBoard(): void {
    renderBoard(root, ch, st, selected, { act, select, sitDown }, toast, changed);
    changed = undefined;   // flare is a one-shot
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
    if (ch.id === 'ch3') { marloweEndgame(); return; }
    if (ch.id === 'ch2') { delucaSitDown(); return; }
    ricciSitDown();
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
        const heat = bumpHeat(st.heat, outcome.heatDelta ?? 0);
        if (outcome.deal?.gotName) { climbToChapter2(outcome, heat); return; }
        st = applyDealOutcome(ch, st, outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 });
        st = { ...st, heat };
        selected = null; changed = new Set(['ricci']); toast = outcome.ripple; showBoard();
      }, startAt);
  }

  function delucaSitDown(): void {
    const flags = missionFlags(st.flags);
    let startAt = 's0_serene';
    if (flags.has('delucaForewarned') || st.heat >= 6) startAt = 's0_forewarned';
    else if (flags.has('santoTurned') || flags.has('delucaProof')) startAt = 's0_cracks';
    const deluca = st.nodes.find((n) => n.id === 'deluca');
    startMission(root, DELUCA_CONFRONT, { name: deluca?.name ?? 'DELUCA', role: deluca?.role ?? '', portrait: deluca?.portrait }, flags,
      (outcome) => {
        const heat = bumpHeat(st.heat, outcome.heatDelta ?? 0);
        if (outcome.deal?.gotName) { climbToChapter3(outcome, heat); return; }
        st = applyDealOutcome(ch, st, outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 });
        st = { ...st, heat };
        selected = null; changed = new Set(['deluca']); toast = outcome.ripple; showBoard();
      }, startAt);
  }

  // THE ENDGAME — Chapter Three's sit-down with Marlowe. Opening reacts to what you
  // turned in his house; the ending closes the game.
  function marloweEndgame(): void {
    const flags = missionFlags(st.flags);
    let startAt = 's0_serene';
    if (flags.has('marloweForewarned') || st.heat >= 6) startAt = 's0_forewarned';
    else if (flags.has('ottoTurned') || flags.has('booksExposed') || flags.has('ricciMole')) startAt = 's0_cracks';
    const marlowe = st.nodes.find((n) => n.id === 'marlowe');
    startMission(root, MARLOWE_ENDGAME, { name: marlowe?.name ?? 'MARLOWE', role: marlowe?.role ?? 'the empire', portrait: marlowe?.portrait }, flags,
      (outcome) => {
        st = applyDealOutcome(ch, st, outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 });
        st = { ...st, heat: bumpHeat(st.heat, outcome.heatDelta ?? 0) };
        selected = null; changed = new Set(['marlowe']); toast = outcome.ripple; showBoard();
      }, startAt);
  }

  // Ch1 → Ch2: you forced your way up off the docks. Carry standing, recap, board.
  function climbToChapter2(outcome: MissionOutcome, heat: number): void {
    const carried = new Set(st.flags);
    if ((outcome.deal?.faceIdx ?? 2) <= 0) carried.add('ricciMole');
    for (const f of outcome.worldFlags ?? []) carried.add(f);
    startMission(root, buildCh2Recap(carried), { name: '', role: '', portrait: 'assets/art/scene/now.jpg' }, carried, () => {
      ch = CHAPTER_2;
      st = initBoard(ch, heat);
      st = { ...st, flags: new Set([...st.flags, ...carried]),
        nodes: st.nodes.map((n) => (n.id === 'ricci' ? { ...n, disposition: (carried.has('ricciMole') ? 4 : 1) as Node['disposition'] } : n)) };
      selected = null; changed = new Set(); toast = undefined; showBoard();
    });
  }

  // Ch2 → Ch3: past DeLuca, you finally reach the top. First contact with Marlowe,
  // then the recap, then his house.
  function climbToChapter3(outcome: MissionOutcome, heat: number): void {
    const carried = new Set(st.flags);
    carried.add('marloweMet');
    carried.add((outcome.deal?.faceIdx ?? 2) <= 0 ? 'delucaTurned' : 'delucaEnemy');
    for (const f of outcome.worldFlags ?? []) carried.add(f);
    startMission(root, MARLOWE_CONTACT, { name: 'MARLOWE', role: 'the empire', portrait: 'assets/art/cast/marlowe.jpg' }, carried, (contact) => {
      for (const f of contact.worldFlags ?? []) carried.add(f);
      const marloweStanding = ((contact.dispositions ?? []).find((d) => d.nodeId === 'marlowe')?.set ?? 2) as Node['disposition'];
      const heat2 = bumpHeat(heat, contact.heatDelta ?? 0);
      startMission(root, buildCh3Recap(carried), { name: '', role: '', portrait: 'assets/art/scene/now.jpg' }, carried, () => {
        ch = CHAPTER_3;
        st = initBoard(ch, heat2);
        st = { ...st, flags: new Set([...st.flags, ...carried]),
          nodes: st.nodes.map((n) => (n.id === 'marlowe' ? { ...n, disposition: marloweStanding } : n)) };
        selected = null; changed = new Set(); toast = undefined; showBoard();
      });
    });
  }

  // dev shortcut: ?ch2 / ?ch3 jump straight into a later chapter for playtesting,
  // seeded with sensible carried standing so approaches are reachable.
  const jump = typeof location !== 'undefined'
    ? (/ch3/.test(location.search + location.hash) ? 'ch3' : /ch2/.test(location.search + location.hash) ? 'ch2' : '')
    : '';
  if (jump === 'ch3') {
    ch = CHAPTER_3;
    st = initBoard(ch, 2);
    st = { ...st, flags: new Set(['ricciMole', 'delucaTurned', 'marloweMet']) };
    showBoard();
    return;
  }
  if (jump === 'ch2') {
    ch = CHAPTER_2;
    st = initBoard(ch);
    st = { ...st, flags: new Set(['ricciMole']), nodes: st.nodes.map((n) => (n.id === 'ricci' ? { ...n, disposition: 4 as Node['disposition'] } : n)) };
    showBoard();
    return;
  }

  // open on the lived cold-open (the fall, played through Ricci's face + a choice)
  // — then the board
  startMission(
    root, PROLOGUE_MISSION,
    { name: 'RICCI', role: 'the collector', portrait: 'assets/art/cast/ricci.jpg' },
    new Set<string>(),
    showBoard,
  );
}
