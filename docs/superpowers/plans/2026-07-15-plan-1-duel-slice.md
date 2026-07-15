# Manipulation-Duel Vertical Slice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. **Task 8 is controller-executed** (art). Subagents do the rest.

**Goal:** Build ONE complete, playable manipulation duel (the collector, "Salvatore Ricci") — probe → read the Record → catch his lies → deploy leverage → press tells → break him — in the glossy-cel noir look, shipped as an installable Android APK, to prove the feel.

**Architecture:** A pure-TypeScript **domain engine** (`src/domain/`, zero DOM, fully unit-tested, deterministic) simulates the opponent brain and resolves every action into a new immutable `DuelState` + events. Authored **content** (`src/content/`) defines the collector. A thin **UI** (`src/ui/`) renders `DuelState` into the approved noir screens (ported from the HTML mockups already in `concept/`). A **duel controller** (`src/app/`) wires UI actions → engine → re-render. **Capacitor** wraps the web build into an Android APK.

**Tech Stack:** TypeScript, Vite, Vitest, Capacitor (Android). Fonts: Oswald + JetBrains Mono. No framework — plain TS + DOM (the mockups are plain HTML/CSS; keep it that way).

## Global Constraints

- **Scope = ONE duel.** No campaign map, no second opponent, no story chapters, no save system, no audio, no settings, no tutorial. (spec §3)
- **The duel must be active interrogation, never a labeled menu** — four verbs (PROBE, CATCH, DEPLOY, PRESS TELL); probe effects are HIDDEN pre-commit; contradictions must be *noticed and tapped*, not auto-flagged. This is the top requirement. (spec §1, §5, §7)
- **`src/domain/` is pure:** no DOM, no imports from `ui`/`app`, deterministic (any randomness seeded), 100% unit-tested with Vitest. (spec §10)
- **Look:** glossy cel manhwa-noir, crisp (never painterly). Per-opponent lighting palette (collector = **crimson**) drives room + UI accent. (spec §9)
- **Type:** Oswald (display/UI), **JetBrains Mono (all dialogue + Record entries)**. No cursive / italic-serif anywhere. (spec §9.3)
- **Debt economy (collector):** `marketValue = 0`. Winning (`folded`/`dealt` on your terms) costs *less than* the full debt; caving costs the **full debt** (500). (spec §6)
- **Slice ships ≥2 catchable contradictions (one vs a known fact, one vs an earlier statement) and ≥1 deployable leverage.** (spec §3)
- Delivery: build APK locally, ship via **GitHub release** on `SamarS1ngh/negotiator-noir` (player is not on the dev machine).
- Mockups to port live in `concept/ui/*.html` (duel_screen, screen_record, screen_catch, screen_deploy, screen_spike, screen_aftermath) — they are approved; reuse their CSS/layout, swap dialogue font to JetBrains Mono.

## File Structure

```
package.json, tsconfig.json, vite.config.ts, vitest.config.ts, index.html
capacitor.config.ts
src/
  domain/
    types.ts        # all shared types/enums (Task 2)
    matrix.ts       # angle×type effect bands + magnitudes + reciprocity (Task 2)
    agenda.ts       # agenda-leak / known% (Task 3)
    statements.ts   # contradiction detection + catch resolution (Task 3)
    leverage.ts     # deploy effects (Task 4)
    tells.ts        # composure thresholds → tell firing (Task 4)
    outcome.ts      # end-state transitions + debt economy (Task 4)
    engine.ts       # Duel: apply(action) -> {state, events} (Task 5)
  content/
    collector.ts    # the opponent + agenda + art refs (Task 6)
    script.ts       # angles, lines, statements, leverage (Task 6)
    validate.ts     # content sanity checks (Task 6)
  ui/
    theme.css       # tokens, fonts, palette (Task 7)
    face.ts         # CinematicFace: expression-state cross-fade + tell (Task 7)
    duel.ts         # probe screen (Task 7)
    record.ts       # Record panel + catch affordance (Task 8→9)
    deploy.ts       # deploy card (Task 9)
    spike.ts        # tell spike (Task 10)
    aftermath.ts    # aftermath card (Task 10)
  app/
    controller.ts   # walks a duel: engine state <-> UI (Task 11)
    main.ts         # entry (Task 11)
assets/art/collector/*.jpg   # generated (Task 8-art, controller)
scripts/gen_art.sh           # art pipeline (Task 8-art)
```

---

### Task 1: Project scaffold (Vite + TS + Vitest)

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/app/main.ts`, `src/smoke.test.ts`, `.gitignore`

**Interfaces:**
- Produces: a working `npm test` (Vitest) and `npm run build` (Vite). No app logic yet.

- [ ] **Step 1: Init + deps**

```bash
cd ~/Documents/projects/negotiator-noir
npm init -y
npm i -D typescript vite vitest @types/node
```

- [ ] **Step 2: Config files**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020", "module": "ESNext", "moduleResolution": "bundler",
    "strict": true, "noUncheckedIndexedAccess": true, "esModuleInterop": true,
    "skipLibCheck": true, "types": ["vitest/globals"], "lib": ["ES2020", "DOM"]
  },
  "include": ["src"]
}
```
`vite.config.ts`:
```ts
import { defineConfig } from 'vite';
export default defineConfig({ root: '.', build: { outDir: 'dist' } });
```
`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'jsdom' } });
```
Install jsdom: `npm i -D jsdom`.
Add to `package.json` `"scripts"`: `{ "dev": "vite", "build": "vite build", "test": "vitest run", "test:watch": "vitest" }`.
`.gitignore`: `node_modules/`, `dist/`, `.DS_Store`, `android/` (Capacitor output added later — keep source but ignore build artifacts as decided in Task 12).

- [ ] **Step 3: index.html + entry**

`index.html`:
```html
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Negotiator</title></head>
<body><div id="app"></div><script type="module" src="/src/app/main.ts"></script></body></html>
```
`src/app/main.ts`:
```ts
const app = document.querySelector<HTMLDivElement>('#app');
if (app) app.textContent = 'Negotiator — booting';
```

- [ ] **Step 4: Smoke test**

`src/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
describe('scaffold', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 5: Verify + commit**

Run: `npm test` → 1 passed. `npm run build` → builds to `dist/` with no errors.
```bash
git add -A && git commit -m "chore: scaffold Vite + TS + Vitest web project"
```

---

### Task 2: Domain types + angle×type effect matrix (the probe core)

**Files:**
- Create: `src/domain/types.ts`, `src/domain/matrix.ts`, `src/domain/matrix.test.ts`

**Interfaces:**
- Produces (`types.ts`):
```ts
export type OpponentType = 'proud' | 'greedy' | 'scared' | 'believer' | 'pro';
export type AngleId = 'lean' | 'flatter' | 'plant_doubt' | 'bluff' | 'offer_out';
export type AgendaField = 'bottomLine' | 'fear' | 'lie';
export type MoodState = 'guarded' | 'rattled' | 'angry' | 'cornered' | 'folding';
export type EndState = 'ongoing' | 'folded' | 'dealt' | 'walked' | 'turned';
export type Band = 'lands' | 'neutral' | 'backfires';
export type Risk = 'safe' | 'uncertain' | 'high';

export interface ProbeEffect { hisComposure: number; yourComposure: number; leak?: AgendaField; leakAmount: number; band: Band; }
```
- Produces (`matrix.ts`):
```ts
export function bandFor(angle: AngleId, type: OpponentType): Band
export function probeEffect(angle: AngleId, type: OpponentType, alreadySpent: boolean): ProbeEffect
```
  Rules (verbatim): the band table below; magnitudes: `lands` → hisComposure −14, leakAmount 0.34; `neutral` → hisComposure −4, leak 0.10; `backfires` → hisComposure +6, yourComposure −12, leak 0. **Reciprocity:** if `alreadySpent`, force effect to hisComposure 0, yourComposure −8, leakAmount 0, band unchanged (a repeated angle yields nothing and costs you). A `lands`/`neutral` sets `leak` to the angle's target field (see `angleTarget`); `backfires` has no leak.

- [ ] **Step 1: Write the failing test**

`src/domain/matrix.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { bandFor, probeEffect } from './matrix';

describe('effect matrix', () => {
  it('flatter lands on the proud, backfires on the scared', () => {
    expect(bandFor('flatter', 'proud')).toBe('lands');
    expect(bandFor('flatter', 'scared')).toBe('backfires');
  });
  it('lands cracks his composure and leaks agenda', () => {
    const e = probeEffect('plant_doubt', 'proud', false);
    expect(e.band).toBe('lands');
    expect(e.hisComposure).toBeLessThan(0);
    expect(e.leakAmount).toBeGreaterThan(0);
  });
  it('backfires costs YOUR composure and leaks nothing', () => {
    const e = probeEffect('flatter', 'scared', false);
    expect(e.band).toBe('backfires');
    expect(e.yourComposure).toBeLessThan(0);
    expect(e.leakAmount).toBe(0);
  });
  it('reciprocity: repeating a spent angle yields nothing and costs you', () => {
    const e = probeEffect('plant_doubt', 'proud', true);
    expect(e.hisComposure).toBe(0);
    expect(e.leakAmount).toBe(0);
    expect(e.yourComposure).toBeLessThan(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test src/domain/matrix.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement**

`src/domain/types.ts` — the block above.
`src/domain/matrix.ts`:
```ts
import type { AngleId, OpponentType, Band, AgendaField, ProbeEffect } from './types';

const TABLE: Record<AngleId, Record<OpponentType, Band>> = {
  lean:        { proud: 'neutral',  greedy: 'neutral',  scared: 'lands',    believer: 'backfires', pro: 'neutral'   },
  flatter:     { proud: 'lands',    greedy: 'lands',    scared: 'backfires',believer: 'neutral',   pro: 'backfires' },
  plant_doubt: { proud: 'lands',    greedy: 'neutral',  scared: 'lands',    believer: 'lands',     pro: 'neutral'   },
  bluff:       { proud: 'neutral',  greedy: 'lands',    scared: 'backfires',believer: 'backfires', pro: 'lands'     },
  offer_out:   { proud: 'backfires',greedy: 'lands',    scared: 'lands',    believer: 'neutral',   pro: 'neutral'   },
};

const TARGET: Record<AngleId, AgendaField> = {
  lean: 'fear', flatter: 'bottomLine', plant_doubt: 'lie', bluff: 'lie', offer_out: 'bottomLine',
};

export function bandFor(angle: AngleId, type: OpponentType): Band { return TABLE[angle][type]; }
export function angleTarget(angle: AngleId): AgendaField { return TARGET[angle]; }

export function probeEffect(angle: AngleId, type: OpponentType, alreadySpent: boolean): ProbeEffect {
  const band = bandFor(angle, type);
  if (alreadySpent) return { hisComposure: 0, yourComposure: -8, leakAmount: 0, band };
  if (band === 'lands')     return { hisComposure: -14, yourComposure: 0,   leak: TARGET[angle], leakAmount: 0.34, band };
  if (band === 'neutral')   return { hisComposure: -4,  yourComposure: 0,   leak: TARGET[angle], leakAmount: 0.10, band };
  /* backfires */           return { hisComposure: 6,   yourComposure: -12, leakAmount: 0, band };
}
```

- [ ] **Step 4: Run tests** — `npm test src/domain/matrix.test.ts` → 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/domain && git commit -m "feat(domain): opponent types + angle×type effect matrix with reciprocity"
```

---

### Task 3: Agenda leak + statements + contradiction/catch

**Files:**
- Create: `src/domain/agenda.ts`, `src/domain/statements.ts`, their tests

**Interfaces:**
- Consumes: `types.ts` (`AgendaField`), plus adds to `types.ts`:
```ts
export interface Statement { id: string; text: string; truth: 'true' | 'evasion' | 'lie'; contradicts?: string; }
export interface Contradiction { id: string; statementId: string; against: string; kind: 'leverage' | 'statement'; }
export interface Leverage { id: string; label: string; text: string; targets: AgendaField; heldAtStart: boolean; }
```
- Produces (`agenda.ts`):
```ts
export function leak(known: Record<AgendaField, number>, field: AgendaField, amount: number): Record<AgendaField, number>
// returns a NEW record, clamped 0..1
```
- Produces (`statements.ts`):
```ts
export function findContradictions(fresh: Statement, priorStatements: Statement[], heldLeverage: Leverage[]): Contradiction[]
export function catchEffect(leakField: AgendaField): { hisComposure: number; leak: AgendaField; leakAmount: number }
```
  Contradiction detection: a `fresh` statement whose `contradicts` id equals a held leverage id → `{kind:'leverage', against: thatId}`; or equals a prior statement id → `{kind:'statement', against: thatId}`. Catch effect: hisComposure −30, leakAmount **1.0** (fully reveals the targeted field).

- [ ] **Step 1: Write the failing tests**

`src/domain/agenda.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { leak } from './agenda';
describe('agenda leak', () => {
  const zero = { bottomLine: 0, fear: 0, lie: 0 };
  it('adds and clamps to 1', () => {
    expect(leak(zero, 'fear', 0.34).fear).toBeCloseTo(0.34);
    expect(leak({ ...zero, fear: 0.8 }, 'fear', 0.5).fear).toBe(1);
  });
  it('does not mutate input', () => {
    const r = leak(zero, 'lie', 0.2); expect(zero.lie).toBe(0); expect(r.lie).toBeCloseTo(0.2);
  });
});
```
`src/domain/statements.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { findContradictions, catchEffect } from './statements';
import type { Statement, Leverage } from './types';

const lev: Leverage = { id: 'skims', label: 'He skims his boss', text: '...', targets: 'fear', heldAtStart: true };
const s1: Statement = { id: 's1', text: 'I answer to no one', truth: 'lie', contradicts: 'skims' };
const s2: Statement = { id: 's2', text: 'I never touch the count', truth: 'lie', contradicts: 's_earlier' };
const earlier: Statement = { id: 's_earlier', text: 'I count it myself', truth: 'true' };

describe('contradictions', () => {
  it('detects a statement that conflicts with held leverage', () => {
    const c = findContradictions(s1, [], [lev]);
    expect(c).toHaveLength(1); expect(c[0].kind).toBe('leverage'); expect(c[0].against).toBe('skims');
  });
  it('detects a statement that conflicts with an earlier statement', () => {
    const c = findContradictions(s2, [earlier], []);
    expect(c).toHaveLength(1); expect(c[0].kind).toBe('statement'); expect(c[0].against).toBe('s_earlier');
  });
  it('no contradiction when nothing matches', () => {
    expect(findContradictions({ id: 'x', text: 'hi', truth: 'true' }, [earlier], [lev])).toHaveLength(0);
  });
  it('catch fully reveals the field and craters composure', () => {
    const e = catchEffect('fear'); expect(e.hisComposure).toBe(-30); expect(e.leak).toBe('fear'); expect(e.leakAmount).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL (modules missing).

- [ ] **Step 3: Implement**

Add the three interfaces to `types.ts`.
`src/domain/agenda.ts`:
```ts
import type { AgendaField } from './types';
export function leak(known: Record<AgendaField, number>, field: AgendaField, amount: number) {
  const next = { ...known };
  next[field] = Math.min(1, Math.max(0, next[field] + amount));
  return next;
}
```
`src/domain/statements.ts`:
```ts
import type { Statement, Leverage, Contradiction, AgendaField } from './types';

export function findContradictions(fresh: Statement, prior: Statement[], held: Leverage[]): Contradiction[] {
  if (!fresh.contradicts) return [];
  const id = fresh.contradicts;
  if (held.some(l => l.id === id)) return [{ id: `c_${fresh.id}`, statementId: fresh.id, against: id, kind: 'leverage' }];
  if (prior.some(s => s.id === id)) return [{ id: `c_${fresh.id}`, statementId: fresh.id, against: id, kind: 'statement' }];
  return [];
}

export function catchEffect(leakField: AgendaField): { hisComposure: number; leak: AgendaField; leakAmount: number } {
  return { hisComposure: -30, leak: leakField, leakAmount: 1 };
}
```

- [ ] **Step 4: Run tests** — both files pass (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/domain && git commit -m "feat(domain): agenda leak + statement contradiction detection & catch"
```

---

### Task 4: Deploy leverage + tells + end states (debt economy)

**Files:**
- Create: `src/domain/leverage.ts`, `src/domain/tells.ts`, `src/domain/outcome.ts`, their tests

**Interfaces:**
- Consumes: `types.ts`.
- Produces (`leverage.ts`):
```ts
import type { Leverage, AgendaField } from './types';
export function deployEffect(lev: Leverage): { hisComposure: number; leak: AgendaField; leakAmount: number }
// fixed: hisComposure -41, leak = lev.targets, leakAmount 1
```
- Produces (`tells.ts`):
```ts
export function tellFires(prevComposure: number, nextComposure: number): boolean
// true when composure crosses DOWNWARD through a threshold in [66, 33]
export const TELL_THRESHOLDS: number[]; // [66, 33]
export function pressTellEffect(): { hisComposure: number }; // hisComposure -18
```
- Produces (`outcome.ts`):
```ts
import type { EndState } from './types';
export function endStateFor(hisComposure: number, yourComposure: number): EndState
// hisComposure<=0 -> 'folded'; yourComposure<=0 -> 'turned'; else 'ongoing'
export function payout(end: EndState, debtAmount: number): { cost: number; label: string }
// folded -> cost debtAmount*0 (0 owed) ... see rules
```
  End rules: `hisComposure <= 0` → `folded`; `yourComposure <= 0` → `turned`; otherwise `ongoing`. (`dealt`/`walked` are produced by explicit player actions in the engine — Task 5 — not by this pure threshold fn.) Debt payout: `folded` → `{ cost: 0, label: 'debt cleared' }`; `dealt` → `{ cost: Math.round(debtAmount * 0.4), label: 'settled down' }`; `walked` / `turned` → `{ cost: debtAmount, label: 'paid in full' }`.

- [ ] **Step 1: Write the failing tests**

`src/domain/leverage.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { deployEffect } from './leverage';
import type { Leverage } from './types';
const lev: Leverage = { id: 'skims', label: '', text: '', targets: 'fear', heldAtStart: true };
describe('deploy', () => {
  it('shatters composure and fully reveals the targeted field', () => {
    const e = deployEffect(lev);
    expect(e.hisComposure).toBe(-41); expect(e.leak).toBe('fear'); expect(e.leakAmount).toBe(1);
  });
});
```
`src/domain/tells.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { tellFires, pressTellEffect } from './tells';
describe('tells', () => {
  it('fires when composure crosses a threshold downward', () => {
    expect(tellFires(70, 64)).toBe(true);   // crossed 66
    expect(tellFires(40, 30)).toBe(true);   // crossed 33
  });
  it('does not fire without crossing', () => {
    expect(tellFires(90, 80)).toBe(false);
    expect(tellFires(64, 60)).toBe(false);
  });
  it('pressing a tell hurts composure', () => { expect(pressTellEffect().hisComposure).toBeLessThan(0); });
});
```
`src/domain/outcome.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { endStateFor, payout } from './outcome';
describe('outcome', () => {
  it('folds when his composure is gone', () => { expect(endStateFor(0, 50)).toBe('folded'); });
  it('turns when your composure is gone', () => { expect(endStateFor(50, 0)).toBe('turned'); });
  it('ongoing otherwise', () => { expect(endStateFor(50, 50)).toBe('ongoing'); });
  it('debt economy: folding clears the debt, caving pays full', () => {
    expect(payout('folded', 500).cost).toBe(0);
    expect(payout('walked', 500).cost).toBe(500);
    expect(payout('dealt', 500).cost).toBe(200);
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement**

`src/domain/leverage.ts`:
```ts
import type { Leverage, AgendaField } from './types';
export function deployEffect(lev: Leverage): { hisComposure: number; leak: AgendaField; leakAmount: number } {
  return { hisComposure: -41, leak: lev.targets, leakAmount: 1 };
}
```
`src/domain/tells.ts`:
```ts
export const TELL_THRESHOLDS = [66, 33];
export function tellFires(prev: number, next: number): boolean {
  return TELL_THRESHOLDS.some(t => prev > t && next <= t);
}
export function pressTellEffect(): { hisComposure: number } { return { hisComposure: -18 }; }
```
`src/domain/outcome.ts`:
```ts
import type { EndState } from './types';
export function endStateFor(hisComposure: number, yourComposure: number): EndState {
  if (hisComposure <= 0) return 'folded';
  if (yourComposure <= 0) return 'turned';
  return 'ongoing';
}
export function payout(end: EndState, debtAmount: number): { cost: number; label: string } {
  switch (end) {
    case 'folded': return { cost: 0, label: 'debt cleared' };
    case 'dealt':  return { cost: Math.round(debtAmount * 0.4), label: 'settled down' };
    default:       return { cost: debtAmount, label: 'paid in full' };
  }
}
```

- [ ] **Step 4: Run tests** — all pass (9 tests across 3 files).

- [ ] **Step 5: Commit**

```bash
git add src/domain && git commit -m "feat(domain): deploy, tells, end-states + debt economy"
```

---

### Task 5: The Duel engine (ties it together)

**Files:**
- Create: `src/domain/engine.ts`, `src/domain/engine.test.ts`
- Modify: `src/domain/types.ts` (add `DuelState`, `DuelAction`, `DuelEvent`, `Line`, `Opponent`, `Script`)

**Interfaces:**
- Adds to `types.ts`:
```ts
export interface Line { id: string; angleId: AngleId; text: string; emits?: string; }
export interface Opponent {
  id: string; name: string; role: string; type: OpponentType; palette: string;
  moodStart: number; composureStart: number; yourComposureStart: number;
  agenda: Record<AgendaField, string>; debtAmount: number;
  art: { seed: number; states: Record<MoodState, string> };
}
export interface Script { angles: AngleId[]; lines: Line[]; statements: Statement[]; leverage: Leverage[]; }
export interface DuelState {
  hisComposure: number; yourComposure: number; mood: MoodState;
  known: Record<AgendaField, number>; spentAngles: AngleId[];
  record: { statements: Statement[]; heldLeverage: Leverage[]; openContradictions: Contradiction[] };
  end: EndState; log: string[];
}
export type DuelAction =
  | { kind: 'probe'; lineId: string }
  | { kind: 'catch'; contradictionId: string }
  | { kind: 'deploy'; leverageId: string }
  | { kind: 'pressTell' }
  | { kind: 'walk' };   // player chooses to leave -> 'walked'
export interface DuelEvent { type: 'said' | 'band' | 'tell' | 'caught' | 'deployed' | 'leak' | 'end'; text: string; }
```
- Produces (`engine.ts`):
```ts
export function initDuel(opp: Opponent, script: Script): DuelState
export function moodFor(hisComposure: number): MoodState
// >75 guarded, >50 rattled, >30 angry, >0 cornered, <=0 folding
export function apply(state: DuelState, action: DuelAction, opp: Opponent, script: Script): { state: DuelState; events: DuelEvent[] }
export function riskOf(state: DuelState, opp: Opponent, line: Line): Risk
// derived from band + how much of the target field is known: lands&known>0.5 -> safe; backfires -> high; else uncertain
```
  `apply` rules:
  - **probe**: look up the line; compute `probeEffect(angleId, opp.type, spentAngles.includes(angleId))`; apply composure deltas (clamped 0..100 for his, floor 0 for yours); mark angle spent; if `line.emits` set, push that statement into `record.statements`, then run `findContradictions(stmt, priorStatements, heldLeverage)` and append any to `record.openContradictions`; apply leak; recompute mood + end; emit events (`said` with the statement text if any, `band`, `leak`, `tell` if `tellFires`).
  - **catch**: find the open contradiction; apply `catchEffect(leakField)` where the leak field = the target of the leverage/earlier statement being contradicted (map via the leverage's `targets`, or `'lie'` for statement-vs-statement); remove it from open; if the contradiction was vs a leverage, that leverage is consumed too; recompute; emit `caught`.
  - **deploy**: find held leverage, apply `deployEffect`, remove it from `heldLeverage`, leak its field fully, recompute; emit `deployed`.
  - **pressTell**: apply `pressTellEffect`, recompute; emit `tell`.
  - **walk**: set `end = 'walked'`.
  - After any action, if `endStateFor` says folded/turned, set `end` accordingly; `walked` is set by the explicit `walk` action. **`dealt` is a reserved end state (defined in `EndState` + handled by `payout`/aftermath) but is NOT player-reachable in this slice** — there is no "accept his terms" action yet; it arrives with the campaign. Leaving it defined-but-unreached is intentional, not a gap. All returns are new immutable states.

- [ ] **Step 1: Write the failing test** (an end-to-end scripted duel)

`src/domain/engine.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { initDuel, apply, moodFor } from './engine';
import type { Opponent, Script } from './types';

const opp: Opponent = {
  id: 'collector', name: 'Ricci', role: 'the collector', type: 'proud', palette: 'crimson',
  moodStart: 100, composureStart: 100, yourComposureStart: 100,
  agenda: { bottomLine: 'settles for less if the boss stays blind', fear: 'the boss finding out', lie: 'the sum is non-negotiable' },
  debtAmount: 500, art: { seed: 501, states: { guarded:'', rattled:'', angry:'', cornered:'', folding:'' } },
};
const script: Script = {
  angles: ['lean','flatter','plant_doubt','bluff','offer_out'],
  lines: [
    { id: 'l_doubt1', angleId: 'plant_doubt', text: 'Marlowe quoted me different.', emits: 's_book' },
    { id: 'l_flat1', angleId: 'flatter', text: 'You run a tight ship.' },
  ],
  statements: [
    { id: 's_book', text: "I run my own book. I don't answer to Marlowe.", truth: 'lie', contradicts: 'skims' },
  ],
  leverage: [
    { id: 'skims', label: 'He skims his own boss', text: 'He skims off the top.', targets: 'fear', heldAtStart: true },
  ],
};

describe('duel engine', () => {
  it('probing a proud man with plant_doubt lands and logs his statement + a contradiction', () => {
    const s0 = initDuel(opp, script);
    const { state, events } = apply(s0, { kind: 'probe', lineId: 'l_doubt1' }, opp, script);
    expect(state.hisComposure).toBeLessThan(100);
    expect(state.record.statements.map(s => s.id)).toContain('s_book');
    expect(state.record.openContradictions).toHaveLength(1);
    expect(events.some(e => e.type === 'said')).toBe(true);
  });
  it('catching the contradiction craters composure and reveals fear', () => {
    let s = initDuel(opp, script);
    s = apply(s, { kind: 'probe', lineId: 'l_doubt1' }, opp, script).state;
    const cid = s.record.openContradictions[0].id;
    const after = apply(s, { kind: 'catch', contradictionId: cid }, opp, script).state;
    expect(after.hisComposure).toBeLessThan(s.hisComposure);
    expect(after.known.fear).toBe(1);
    expect(after.record.openContradictions).toHaveLength(0);
  });
  it('deploying leverage can fold him', () => {
    let s = initDuel(opp, script);
    // grind him down then deploy
    for (let i = 0; i < 4; i++) s = apply(s, { kind: 'probe', lineId: 'l_doubt1' }, opp, script).state;
    s = apply(s, { kind: 'deploy', leverageId: 'skims' }, opp, script).state;
    expect(['folded','ongoing']).toContain(s.end);
    expect(s.record.heldLeverage).toHaveLength(0);
  });
  it('mood tracks composure', () => {
    expect(moodFor(100)).toBe('guarded'); expect(moodFor(10)).toBe('cornered'); expect(moodFor(0)).toBe('folding');
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement `engine.ts`** per the Interfaces rules above (compose Tasks 2–4). Keep every state update immutable (spread + clamp). Clamp `hisComposure` to `[0,100]`, `yourComposure` floor `0`. `moodFor`: `>75 guarded, >50 rattled, >30 angry, >0 cornered, else folding`. `initDuel` seeds `heldLeverage` from `script.leverage.filter(l => l.heldAtStart)`, `known` all 0, `end 'ongoing'`.

- [ ] **Step 4: Run tests** — 4 pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain && git commit -m "feat(domain): duel engine — apply(probe/catch/deploy/pressTell/walk)"
```

---

### Task 6: The collector content + validator

**Files:**
- Create: `src/content/collector.ts`, `src/content/script.ts`, `src/content/validate.ts`, `src/content/validate.test.ts`

**Interfaces:**
- Consumes: `types.ts` (`Opponent`, `Script`, `Line`, `Statement`, `Leverage`), `matrix.angleTarget`, `engine`.
- Produces:
```ts
export const COLLECTOR: Opponent          // collector.ts
export const COLLECTOR_SCRIPT: Script     // script.ts (angles = the fixed 5; ≥2-3 lines per angle; statements incl. ≥2 that create catchable contradictions — one vs leverage, one vs an earlier statement; ≥1 leverage heldAtStart)
export function validateContent(opp: Opponent, script: Script): string[]  // returns list of problems (empty = valid)
```
  `validateContent` checks: every angle in `script.angles` has ≥1 line; every `line.emits` references an existing statement; every `statement.contradicts` references an existing statement or leverage; ≥2 statements are catchable (their `contradicts` resolves); ≥1 leverage has `heldAtStart`; a scripted path exists to `folded` (a smoke-run: probing + catching + deploying reduces his composure to ≤0 within 8 actions — run the engine).

- [ ] **Step 1: Write the failing test**

`src/content/validate.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { COLLECTOR } from './collector';
import { COLLECTOR_SCRIPT } from './script';
import { validateContent } from './validate';
import { initDuel, apply } from '../domain/engine';

describe('collector content', () => {
  it('validates clean', () => { expect(validateContent(COLLECTOR, COLLECTOR_SCRIPT)).toEqual([]); });
  it('has at least 2 catchable contradictions and 1 held leverage', () => {
    const catchable = COLLECTOR_SCRIPT.statements.filter(s => s.contradicts).length;
    expect(catchable).toBeGreaterThanOrEqual(2);
    expect(COLLECTOR_SCRIPT.leverage.some(l => l.heldAtStart)).toBe(true);
  });
  it('is winnable: a scripted line of play folds him', () => {
    let s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    s = apply(s, { kind: 'probe', lineId: doubt.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    if (s.record.openContradictions[0]) s = apply(s, { kind: 'catch', contradictionId: s.record.openContradictions[0].id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    const lev = s.record.heldLeverage[0];
    if (lev) s = apply(s, { kind: 'deploy', leverageId: lev.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    // a couple more presses
    for (let i = 0; i < 3 && s.end === 'ongoing'; i++) {
      const line = COLLECTOR_SCRIPT.lines.find(l => !s.spentAngles.includes(l.angleId));
      if (!line) break; s = apply(s, { kind: 'probe', lineId: line.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    }
    expect(s.end).toBe('folded');
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Author the content** — write `COLLECTOR` (type `proud`, crimson, debtAmount 500, agenda per spec §6, art seed 501 + 5 mood-state paths `assets/art/collector/<state>.jpg`) and `COLLECTOR_SCRIPT`: the five angles; 2–3 JetBrains-Mono-voiced lines per angle; statements including `s_book` (contradicts leverage `skims`) and a pair where a later statement contradicts an earlier one (e.g. `s_count_never` contradicts `s_count_self`); leverage `skims` (`heldAtStart:true`, targets `fear`). Implement `validateContent` per rules (run the engine for the winnability check). Tune magnitudes/line count until the winnability test passes.

- [ ] **Step 4: Run tests** — 3 pass.

- [ ] **Step 5: Commit**

```bash
git add src/content && git commit -m "feat(content): the collector — opponent, script, validator"
```

---

### Task 7: UI foundation — theme, CinematicFace, probe (duel) screen

**Files:**
- Create: `src/ui/theme.css`, `src/ui/face.ts`, `src/ui/duel.ts`, `src/ui/duel.test.ts`
- Reference (port from): `concept/ui/duel_screen.html`

**Interfaces:**
- Consumes: `DuelState`, `Opponent`, `Script`, `Line`, `riskOf`, `moodFor`.
- Produces:
```ts
export function mountFace(root: HTMLElement, opp: Opponent): { setMood(m: MoodState): void; flashTell(text: string): void }
export function renderDuel(root: HTMLElement, state: DuelState, opp: Opponent, script: Script, on: {
  probe(lineId: string): void; pickAngle(a: AngleId): void; openRecord(): void;
}, selectedAngle: AngleId | null): void
```
  `theme.css`: port tokens from the mockups (`--ink #0a0a0c`, `--crimson #d1272e`, etc.), load Oswald + JetBrains Mono (bundle via `@fontsource` — `npm i @fontsource/oswald @fontsource/jetbrains-mono` and import in `main.ts`; do NOT use a remote `<link>` — must work offline). **All dialogue/line text uses `font-family: 'JetBrains Mono'`; UI/labels use Oswald. No italic-serif.** `CinematicFace`: an element stacking the 5 mood images (only current visible, cross-fade via opacity transition), a subtle idle breathing transform (CSS keyframes, respects `prefers-reduced-motion`), and a `flashTell` overlay. Missing art → a solid `--ink` box (never breaks). `renderDuel`: layout ported from `duel_screen.html` — the face/stage, name + role, composure read + mood word, the angle chips (calls `pickAngle`), and when an angle is selected the word cards (each shows the line text + its `riskOf` dot), a button to `openRecord`. Effects hidden pre-commit (show only the risk dot, never numbers).

- [ ] **Step 1: Write the failing test**

`src/ui/duel.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderDuel } from './duel';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';
import { initDuel } from '../domain/engine';

describe('duel screen', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  it('renders angle chips and no word cards until an angle is picked', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, null);
    expect(root.querySelectorAll('[data-angle]').length).toBe(5);
    expect(root.querySelectorAll('[data-line]').length).toBe(0);
  });
  it('shows word cards for the selected angle, with a risk dot, and no numbers', () => {
    const s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    renderDuel(root, s, COLLECTOR, COLLECTOR_SCRIPT, { probe(){}, pickAngle(){}, openRecord(){} }, 'plant_doubt');
    const cards = root.querySelectorAll('[data-line]');
    expect(cards.length).toBeGreaterThan(0);
    expect(root.querySelector('[data-risk]')).not.toBeNull();
    expect(root.textContent).not.toMatch(/[-+]\d+/); // no raw effect numbers leaked
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement** `theme.css` (ported tokens + `@fontsource` imports), `face.ts`, `duel.ts` per the interface, porting layout/CSS from `concept/ui/duel_screen.html` and swapping dialogue font to JetBrains Mono. Use `data-angle`, `data-line`, `data-risk` attributes for testability.

- [ ] **Step 4: Run tests + build** — `npm test src/ui/duel.test.ts` → 2 pass; `npm run build` clean.

- [ ] **Step 5: Commit**

```bash
git add src/ui package.json package-lock.json && git commit -m "feat(ui): theme, CinematicFace, probe/duel screen"
```

---

### Task 8 (CONTROLLER-EXECUTED): Collector art (glossy-cel mood states)

**Files:**
- Create: `scripts/gen_art.sh`, `assets/art/collector/{guarded,rattled,angry,cornered,folding}.jpg`, `assets/art/PROMPTS.md`

**Interfaces:** Produces the 5 mood-state images the `CinematicFace` references (`src/content/collector.ts` art paths).

- [ ] **Step 1: Art pipeline + generation**

`scripts/gen_art.sh` — the proven Flux pipeline (Pollinations `&model=flux`, `sleep 8` between calls), **locked seed 501** for the collector, glossy-cel noir style phrase: `glossy cel-shaded manhwa noir, crisp clean digital rendering, sharp detailed eyes, dramatic crimson overhead light, single hanging bulb, film-noir crime backroom, high production, medium close-up across the table`. Generate 5 states on seed 501, same base ("a dangerous calculating debt collector in his 40s across a table facing the viewer"), varying only expression: guarded (wary narrowed eyes), rattled (jaw tight, uneasy), angry (snarl, leaning in), cornered (sweat, eyes darting), folding (defeated, looking down). Crimson palette.

- [ ] **Step 2: Visual QA (controller loop)** — Read each image; accept only if glossy-cel (NOT painterly), crisp, consistent same man across all 5 (seed 501), crimson-lit, expression reads. Reject → bump seed/sharpen expression clause.

- [ ] **Step 3: pubspec/paths + PROMPTS + commit** — confirm paths match `collector.ts`; record style + seed in `PROMPTS.md`; `du -sh assets/art` (≤2MB).
```bash
git add scripts assets/art && git commit -m "feat(art): collector glossy-cel mood states (seed 501)"
```

---

### Task 9: UI — Record panel + catch affordance + deploy card

**Files:**
- Create: `src/ui/record.ts`, `src/ui/deploy.ts`, `src/ui/record.test.ts`
- Reference: `concept/ui/screen_record.html`, `concept/ui/screen_catch.html`, `concept/ui/screen_deploy.html`

**Interfaces:**
- Consumes: `DuelState`, `Contradiction`, `Leverage`.
- Produces:
```ts
export function renderRecord(root: HTMLElement, state: DuelState, on: {
  catch(contradictionId: string): void; deploy(leverageId: string): void; close(): void;
}): void
export function renderCatch(root: HTMLElement, said: string, against: string, leakField: AgendaField, on: { continue(): void }): void
export function renderDeploy(root: HTMLElement, lev: Leverage, on: { continue(): void }): void
```
  `renderRecord`: the case-file drawer ported from `screen_record.html` — his statements (JetBrains Mono), leverage cards with a DEPLOY button (`data-deploy=<id>`), agenda known-% bars, and **open contradictions each with a CATCH button** (`data-catch=<id>`). `renderCatch`/`renderDeploy`: the "THAT'S NOT WHAT YOU SAID" and "LEVERAGE" cinematic beats ported from those mockups (Oswald headline, JetBrains-Mono quotes), each with a continue tap.

- [ ] **Step 1: Write the failing test**

`src/ui/record.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderRecord } from './record';
import { initDuel, apply } from '../domain/engine';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('record panel', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });
  it('shows a catch button when a contradiction is open, and deploy for held leverage', () => {
    let s = initDuel(COLLECTOR, COLLECTOR_SCRIPT);
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    s = apply(s, { kind: 'probe', lineId: doubt.id }, COLLECTOR, COLLECTOR_SCRIPT).state;
    renderRecord(root, s, { catch(){}, deploy(){}, close(){} });
    expect(root.querySelector('[data-catch]')).not.toBeNull();
    expect(root.querySelector('[data-deploy]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement** the three renderers, porting the approved mockups; `data-catch` / `data-deploy` attributes for wiring + tests.

- [ ] **Step 4: Run tests + build** — pass; build clean.

- [ ] **Step 5: Commit**

```bash
git add src/ui && git commit -m "feat(ui): Record panel, catch + deploy beats"
```

---

### Task 10: UI — tell spike + aftermath

**Files:**
- Create: `src/ui/spike.ts`, `src/ui/aftermath.ts`, `src/ui/aftermath.test.ts`
- Reference: `concept/ui/screen_spike.html`, `concept/ui/screen_aftermath.html`

**Interfaces:**
- Consumes: `DuelState`, `EndState`, `payout`.
- Produces:
```ts
export function renderSpike(root: HTMLElement, tellText: string, palette: string, on: { press(): void; pass(): void }, timed: boolean): void
// when timed=false (tests) no auto-timer; when true, a ~2.5s window -> pass() on lapse
export function renderAftermath(root: HTMLElement, state: DuelState, opp: Opponent, on: { continue(): void }): void
```
  `renderSpike`: the burst ported from `screen_spike.html` (accent = `palette`), a `data-press` and `data-pass`; the timed window uses a CSS-driven ring and a `setTimeout` **only when `timed`** (so tests are deterministic). `renderAftermath`: headline from `state.end` (`HE FOLDED` / `HE WALKED` / `HE TURNED IT ON YOU` / `YOU SETTLED`), the `payout` result, a "how you broke him" summary built from `state.log`/`known`, ghosted roads-not-taken (agenda fields still `<1`), and `CONTINUE` (`data-continue`).

- [ ] **Step 1: Write the failing test**

`src/ui/aftermath.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderAftermath, renderSpike } from './aftermath'; // aftermath.ts re-exports renderSpike from spike.ts, OR import from spike
import { initDuel } from '../domain/engine';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('aftermath + spike', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });
  it('folded aftermath shows the win + a continue', () => {
    const s = { ...initDuel(COLLECTOR, COLLECTOR_SCRIPT), end: 'folded' as const, hisComposure: 0 };
    renderAftermath(root, s, COLLECTOR, { continue(){} });
    expect(root.textContent).toMatch(/FOLDED/i);
    expect(root.querySelector('[data-continue]')).not.toBeNull();
  });
  it('spike (untimed) renders press/pass without a timer', () => {
    renderSpike(root, 'his eyes cut to the door', 'crimson', { press(){}, pass(){} }, false);
    expect(root.querySelector('[data-press]')).not.toBeNull();
    expect(root.querySelector('[data-pass]')).not.toBeNull();
  });
});
```
(Note: import `renderSpike` from `./spike` in the test if not re-exported.)

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement** both, porting the mockups. Guard the spike timer behind `timed`.

- [ ] **Step 4: Run tests + build** — pass; clean.

- [ ] **Step 5: Commit**

```bash
git add src/ui && git commit -m "feat(ui): tell spike + aftermath screens"
```

---

### Task 11: The duel controller — wire the whole slice

**Files:**
- Create: `src/app/controller.ts`, `src/app/controller.test.ts`
- Modify: `src/app/main.ts`

**Interfaces:**
- Consumes: everything.
- Produces:
```ts
export function startDuel(root: HTMLElement, opp: Opponent, script: Script, onDone?: () => void): void
```
  The controller owns the live `DuelState` and a `selectedAngle`, and re-renders on every change:
  - default view: `renderDuel` (probe). Picking an angle sets `selectedAngle` + re-renders; tapping a word → `apply(probe)` → if the resulting events include a `tell`, show `renderSpike` (timed) whose `press` applies `pressTell` and `pass` returns to duel; else re-render duel. Reset `selectedAngle` after a probe.
  - `openRecord` → `renderRecord`; its `catch` → `apply(catch)` then `renderCatch` beat → back to record/duel; its `deploy` → `apply(deploy)` then `renderDeploy` beat → back to duel; `close` → duel.
  - after every `apply`, if `state.end !== 'ongoing'` → `renderAftermath`, whose `continue` calls `onDone`.
  - a WALK affordance on the duel screen → `apply(walk)`.

- [ ] **Step 1: Write the failing integration test**

`src/app/controller.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { startDuel } from './controller';
import { COLLECTOR } from '../content/collector';
import { COLLECTOR_SCRIPT } from '../content/script';

describe('duel controller (integration)', () => {
  let root: HTMLElement;
  beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });

  function tap(sel: string) { root.querySelector<HTMLElement>(sel)!.click(); }

  it('plays a full duel to a fold via probe → catch → deploy', () => {
    let done = false;
    startDuel(root, COLLECTOR, COLLECTOR_SCRIPT, () => { done = true; });
    // probe with plant_doubt's first line
    const doubt = COLLECTOR_SCRIPT.lines.find(l => l.angleId === 'plant_doubt')!;
    tap(`[data-angle="plant_doubt"]`);
    tap(`[data-line="${doubt.id}"]`);
    // if a spike appeared, pass it
    if (root.querySelector('[data-pass]')) tap('[data-pass]');
    // open record, catch, then deploy
    tap('[data-open-record]');
    if (root.querySelector('[data-catch]')) { tap('[data-catch]'); if (root.querySelector('[data-continue]')) tap('[data-continue]'); }
    if (root.querySelector('[data-open-record]')) tap('[data-open-record]');
    if (root.querySelector('[data-deploy]')) { tap('[data-deploy]'); if (root.querySelector('[data-continue]')) tap('[data-continue]'); }
    // grind remaining probes until an end screen appears
    for (let i = 0; i < 6 && !done; i++) {
      const a = root.querySelector<HTMLElement>('[data-angle]'); if (a) { a.click();
        const l = root.querySelector<HTMLElement>('[data-line]'); if (l) l.click();
        if (root.querySelector('[data-pass]')) tap('[data-pass]'); }
      if (root.querySelector('[data-continue]')) tap('[data-continue]');
    }
    expect(done).toBe(true);
  });
});
```
(The duel screen must expose `[data-open-record]` for the record button and `[data-angle="..."]` / `[data-line="..."]`; ensure Task 7/9 use these hooks.)

- [ ] **Step 2: Run to verify fail** — FAIL.

- [ ] **Step 3: Implement** `controller.ts` per the interface; wire `main.ts` to `startDuel(document.querySelector('#app')!, COLLECTOR, COLLECTOR_SCRIPT)`. Use `GameFx`-free deterministic rendering (no idle timers that block tests except the spike, which is `timed:true` only in the live app — the controller passes `timed:true`, but the integration test taps `[data-pass]`/acts before lapse, so no real timer fires in tests; if flakiness appears, have the controller read a module-level `TIMED` flag defaulting true and set false in the test setup).

- [ ] **Step 4: Run FULL suite + build** — `npm test` (all domain + ui + integration green); `npm run build` clean; `npm run dev` loads the duel in a browser.

- [ ] **Step 5: Commit**

```bash
git add src/app && git commit -m "feat(app): duel controller — full slice wired end to end"
```

---

### Task 12: Capacitor Android build + APK + release

**Files:**
- Create: `capacitor.config.ts`; Modify: `package.json`, `.gitignore`

**Interfaces:** Produces an installable APK, shipped via GitHub release.

- [ ] **Step 1: Add Capacitor**

```bash
npm i @capacitor/core @capacitor/android
npm i -D @capacitor/cli
npx cap init "Negotiator" "com.samar.negotiator" --web-dir=dist
npm run build
npx cap add android
```
`capacitor.config.ts` sets `webDir: 'dist'`, `appId: 'com.samar.negotiator'`, `appName: 'Negotiator'`. Commit `capacitor.config.ts` + `android/` project files (git-ignore only `android/app/build/`, `android/.gradle/`, `android/build/`).

- [ ] **Step 2: Build the APK** (reuse the machine's Android SDK/JDK — already present from earlier work)

```bash
npm run build && npx cap sync android
cd android && ./gradlew assembleDebug
ls app/build/outputs/apk/debug/app-debug.apk
```
Expected: `app-debug.apk` produced.

- [ ] **Step 3: Verify on the emulator (controller/human)** — install to the Pixel_9a emulator (`adb install -r app-debug.apk`), launch, screenshot; confirm the duel screen renders (crimson, the collector, angle chips) and a probe → catch → deploy → fold path is playable. Fix any crash before release.

- [ ] **Step 4: Ship the release**

```bash
cd ~/Documents/projects/negotiator-noir
gh release create v0.1.0 android/app/build/outputs/apk/debug/app-debug.apk \
  --title "v0.1.0 — the first duel (playable)" \
  --notes "One complete manipulation duel: the collector. Probe → read the Record → catch his lies → deploy leverage → press the tell → break him. Install and play the ~2-3 min duel on your phone."
```

- [ ] **Step 5: Commit + phone check (human — Samar)**

```bash
git add -A && git commit -m "feat: Capacitor Android build → APK → v0.1.0 release"
```
Then Samar installs from the release and plays the duel. **The verdict that matters:** does hunting the collector — probing, catching him in the lie, deploying the knife, pressing the tell — *feel like a game*? If yes, we build the campaign outward. If not, the problem is deeper than presentation and we rethink before investing further.

---

## Done Criteria

- Full Vitest suite green (domain + ui + integration); `npm run build` clean.
- The collector duel plays end to end in-browser and as an installed APK: all four verbs (probe, catch ≥2 contradictions, deploy ≥1 leverage, press tell), the Record, the debt economy, the four end states, glossy-cel crimson look, Oswald + JetBrains Mono, no cursive.
- `v0.1.0` APK on GitHub, installable.
- Samar's gut verdict on the feel recorded — the decision this whole slice exists to unblock.
