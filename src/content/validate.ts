import type { Opponent, Script } from '../domain/types';
import { initDuel, apply } from '../domain/engine';

const MAX_SMOKE_ACTIONS = 8;

export function validateContent(opp: Opponent, script: Script): string[] {
  const problems: string[] = [];

  for (const angleId of script.angles) {
    if (!script.lines.some((l) => l.angleId === angleId)) {
      problems.push(`angle "${angleId}" has no lines`);
    }
  }

  const statementIds = new Set(script.statements.map((s) => s.id));
  const leverageIds = new Set(script.leverage.map((l) => l.id));

  for (const line of script.lines) {
    if (line.emits && !statementIds.has(line.emits)) {
      problems.push(`line "${line.id}" emits unknown statement "${line.emits}"`);
    }
  }

  for (const stmt of script.statements) {
    if (stmt.contradicts && !statementIds.has(stmt.contradicts) && !leverageIds.has(stmt.contradicts)) {
      problems.push(`statement "${stmt.id}" contradicts unknown id "${stmt.contradicts}"`);
    }
  }

  const catchableCount = script.statements.filter((s) => s.contradicts).length;
  if (catchableCount < 2) {
    problems.push(`only ${catchableCount} catchable statement(s), need at least 2`);
  }

  if (!script.leverage.some((l) => l.heldAtStart)) {
    problems.push('no leverage is held at start');
  }

  if (!isWinnable(opp, script)) {
    problems.push(`no scripted line of play folds him within ${MAX_SMOKE_ACTIONS} actions`);
  }

  return problems;
}

// Smoke-run: probe the doubt angle, catch the contradiction it surfaces, deploy
// whatever leverage remains held, then keep probing fresh angles until he folds
// or the action budget runs out.
function isWinnable(opp: Opponent, script: Script): boolean {
  let state = initDuel(opp, script);
  let actions = 0;

  const doubtLine = script.lines.find((l) => l.angleId === 'plant_doubt');
  if (doubtLine) {
    state = apply(state, { kind: 'probe', lineId: doubtLine.id }, opp, script).state;
    actions++;
  }

  const contradiction = state.record.openContradictions[0];
  if (contradiction) {
    state = apply(state, { kind: 'catch', contradictionId: contradiction.id }, opp, script).state;
    actions++;
  }

  const leverage = state.record.heldLeverage[0];
  if (leverage) {
    state = apply(state, { kind: 'deploy', leverageId: leverage.id }, opp, script).state;
    actions++;
  }

  while (state.end === 'ongoing' && actions < MAX_SMOKE_ACTIONS) {
    const line = script.lines.find((l) => !state.spentAngles.includes(l.angleId));
    if (!line) break;
    state = apply(state, { kind: 'probe', lineId: line.id }, opp, script).state;
    actions++;
  }

  return state.end === 'folded';
}
