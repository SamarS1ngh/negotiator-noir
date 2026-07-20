import type { Node } from '../domain/board';
import { initBoard, takeAction, applyDealOutcome, applyMissionOutcome } from '../domain/board';
import { CHAPTER_1 } from '../content/chapter1';
import { CHAPTER_2 } from '../content/chapter2';
import { SAL_MISSION } from '../content/sal_mission';
import { CREW_MISSION } from '../content/crew_mission';
import { BIANCHI_MISSION } from '../content/bianchi_mission';
import { OTTO_MISSION } from '../content/otto_mission';
import { ADLER_MISSION } from '../content/adler_mission';
import { RICCI_CONFRONT } from '../content/ricci_confront';
import { MARLOWE_CONTACT } from '../content/marlowe_contact';
import { MARLOWE_ENDGAME } from '../content/marlowe_endgame';
import { PROLOGUE_MISSION } from '../content/prologue';
import { renderBoard } from '../ui/board';
import { renderMeet } from '../ui/meet';
import { startMission } from './mission';

// board actions that open a full branching mission (Detroit-style), by action id
const MISSIONS = [SAL_MISSION, CREW_MISSION, BIANCHI_MISSION, OTTO_MISSION, ADLER_MISSION];

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
    renderBoard(root, ch, st, selected, { act, select, sitDown, confrontMarlowe }, toast, changed);
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

  // THE CONFRONTATION — the sit-down is a branching scene like the missions, but
  // it's the payoff: your prep picks the opening (rattled/forewarned/hardened) and
  // gates the approaches (the skim = the blade for the name; Sal = his fear). Its
  // ending carries a deal result the board applies (name → Marlowe unlocked; how
  // he walked out → ally or enemy).
  function sitDown(): void {
    if (ch.id === 'ch2') { marloweEndgame(); return; }
    const flags = missionFlags(st.flags);
    let startAt = 's0_cold';
    if (flags.has('ricciHardened')) startAt = 's0_hardened';
    // a bought man talks — salBought tips Ricci off, same as being forewarned
    else if (flags.has('ricciForewarned') || flags.has('salBought')) startAt = 's0_forewarned';
    else if (flags.has('crewSpooked') || flags.has('crewLoyal') || flags.has('bianchiPressing') || flags.has('salMole')) startAt = 's0_rattled';

    const ricci = st.nodes.find((n) => n.id === 'ricci');
    startMission(
      root, RICCI_CONFRONT,
      { name: ricci?.name ?? 'RICCI', role: ricci?.role ?? '', portrait: ricci?.portrait },
      flags,
      (outcome) => {
        const deal = outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 };
        const wasLocked = new Set(st.nodes.filter((n) => n.locked).map((n) => n.id));
        st = applyDealOutcome(ch, st, deal);
        const nowUnlocked = st.nodes.filter((n) => !n.locked && wasLocked.has(n.id)).map((n) => n.id);
        selected = null;
        changed = new Set(['ricci', ...nowUnlocked]);
        toast = outcome.ripple;
        showBoard();
      },
      startAt,
    );
  }

  // THE ENDGAME — Chapter Two's sit-down with Marlowe. The opening reacts to what
  // you turned in his house; the ending closes the game.
  function marloweEndgame(): void {
    const flags = missionFlags(st.flags);
    let startAt = 's0_serene';
    if (flags.has('marloweForewarned')) startAt = 's0_forewarned';
    else if (flags.has('ottoTurned') || flags.has('booksExposed') || flags.has('ricciMole')) startAt = 's0_cracks';

    const marlowe = st.nodes.find((n) => n.id === 'marlowe');
    startMission(
      root, MARLOWE_ENDGAME,
      { name: marlowe?.name ?? 'MARLOWE', role: marlowe?.role ?? 'the empire', portrait: marlowe?.portrait },
      flags,
      (outcome) => {
        st = applyDealOutcome(ch, st, outcome.deal ?? { closed: false, gotName: false, faceIdx: 2 });
        selected = null;
        changed = new Set(['marlowe']);
        toast = outcome.ripple;
        showBoard();
      },
      startAt,
    );
  }

  // FIRST CONTACT WITH MARLOWE — the capstone of Chapter One, once Ricci earned
  // you the way in. Not a takedown (he has no fear to press); your first move
  // inside the machine. Sets your standing, closes the chapter. No move cost.
  function confrontMarlowe(): void {
    const marlowe = st.nodes.find((n) => n.id === 'marlowe');
    startMission(
      root, MARLOWE_CONTACT,
      { name: marlowe?.name ?? 'MARLOWE', role: marlowe?.role ?? 'the empire', portrait: marlowe?.portrait },
      missionFlags(st.flags),
      (outcome) => {
        // what you carry from Chapter One into Chapter Two
        const carried = new Set(st.flags);
        carried.add('marloweMet');
        for (const f of outcome.worldFlags ?? []) carried.add(f);
        const ricciDisp = st.nodes.find((n) => n.id === 'ricci')?.disposition ?? 2;
        if (ricciDisp >= 4) carried.add('ricciMole');   // Ricci turned mole → your inside man in Ch2
        const marloweStanding = ((outcome.dispositions ?? []).find((d) => d.nodeId === 'marlowe')?.set ?? 2) as Node['disposition'];

        // TRANSITION into Chapter Two — Marlowe's house
        ch = CHAPTER_2;
        st = initBoard(ch);
        st = {
          ...st,
          flags: new Set([...st.flags, ...carried]),
          nodes: st.nodes.map((n) => {
            if (n.id === 'ricci') return { ...n, disposition: ricciDisp };
            if (n.id === 'marlowe') return { ...n, disposition: marloweStanding };
            return n;
          }),
        };
        selected = null;
        changed = new Set(['marlowe', 'ricci']);
        toast = "Chapter Two — Marlowe's house. His people. His weakness. Turn them, then make your move.";
        showBoard();
      },
    );
  }

  // dev shortcut: ?ch2 jumps straight into Chapter Two so you can playtest the
  // endgame without replaying the whole climb. Seeds a sensible carried state
  // (Ricci turned mole in Ch1) so every endgame approach is reachable.
  if (typeof location !== 'undefined' && (location.search.includes('ch2') || location.hash.includes('ch2'))) {
    ch = CHAPTER_2;
    st = initBoard(ch);
    st = {
      ...st,
      flags: new Set(['ricciMole']),
      nodes: st.nodes.map((n) => (n.id === 'ricci' ? { ...n, disposition: 4 as Node['disposition'] } : n)),
    };
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
