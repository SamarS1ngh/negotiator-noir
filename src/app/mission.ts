import type { Mission, MissionOutcome } from '../domain/mission';
import { missionNode } from '../domain/mission';
import { renderMissionNode } from '../ui/mission';

// Drive a branching mission: start at its first node, follow the fork the player
// picks node to node, and when we reach an ending, hand its outcome back so the
// board can rewrite itself. The runner holds the position; each node renders as
// its own scene.
export function startMission(
  root: HTMLElement,
  mission: Mission,
  meta: { name: string; role: string; portrait?: string },
  flags: Set<string>,
  onDone: (outcome: MissionOutcome) => void,
  startAt?: string,   // override the first node — used to react the opening to prep
): void {
  let current = startAt ?? mission.start;

  function show(): void {
    const node = missionNode(mission, current);
    if (!node) return;
    // an approach is only offered if you carry the flags it needs — prep you did
    // elsewhere (proof dug up, people turned) unlocks how you can play this scene
    const choices = node.choices?.filter((c) => (c.requires ?? []).every((f) => flags.has(f)));
    renderMissionNode(root, {
      name: node.name ?? meta.name, role: node.role ?? meta.role,
      portrait: node.portrait ?? mission.scene ?? meta.portrait,   // node override → mission scene → the board face
      beats: node.beats ?? [],
      ask: node.ask,
      mood: node.mood,
      palette: mission.palette,
      choices,
      outcome: node.outcome
        ? { tone: node.outcome.tone, title: node.outcome.title, line: node.outcome.line, ripple: node.outcome.ripple, tag: node.outcome.tag, cta: node.outcome.cta, reflect: node.outcome.reflect }
        : undefined,
    }, {
      choose(choiceId) {
        const c = node.choices?.find((x) => x.id === choiceId);
        if (c) { current = c.to; show(); }
      },
      finish() {
        if (node.outcome) onDone(node.outcome);
      },
    });
  }

  show();
}
