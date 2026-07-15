import type { AngleId, DuelState, Opponent, Risk, Script } from '../domain/types';
import { riskOf } from '../domain/engine';
import { mountFace } from './face';

const ANGLE_LABELS: Record<AngleId, string> = {
  lean: 'Lean',
  flatter: 'Flatter',
  plant_doubt: 'Plant doubt',
  bluff: 'Bluff',
  offer_out: 'Offer a way out',
};

const RISK_LABELS: Record<Risk, string> = {
  safe: 'safe · buys a read, gives no ground',
  uncertain: 'uncertain · could go either way',
  high: 'high risk · could rattle him or blow up',
};

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

/**
 * Renders the probe/duel screen — the CinematicFace stage, name + read,
 * angle chips, and (once an angle is picked) the word cards for that
 * angle's lines. Effects stay hidden: only a risk dot is shown, never a
 * raw number.
 */
export function renderDuel(
  root: HTMLElement,
  state: DuelState,
  opp: Opponent,
  script: Script,
  on: { probe(lineId: string): void; pickAngle(a: AngleId): void; openRecord(): void },
  selectedAngle: AngleId | null,
): void {
  root.innerHTML = '';
  root.classList.add('duel-screen');

  // ---- stage: CinematicFace + who/read + his line ----
  const stage = document.createElement('div');
  const face = mountFace(stage, opp);
  face.setMood(state.mood);

  const toprow = document.createElement('div');
  toprow.className = 'toprow';

  const who = document.createElement('div');
  who.className = 'who';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = opp.name.toUpperCase();
  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.textContent = opp.role;
  who.append(name, tag);

  const read = document.createElement('div');
  read.className = 'read';
  const moodEl = document.createElement('div');
  moodEl.className = 'mood';
  moodEl.textContent = state.mood.toUpperCase();
  const moodSmall = document.createElement('small');
  moodSmall.textContent = 'reading you back';
  moodEl.appendChild(moodSmall);
  const meter = document.createElement('div');
  meter.className = 'meter';
  const meterFill = document.createElement('i');
  meterFill.style.width = `${clampPct(state.hisComposure)}%`;
  meter.appendChild(meterFill);
  const meterLbl = document.createElement('div');
  meterLbl.className = 'meterlbl';
  meterLbl.textContent = 'COMPOSURE';
  read.append(moodEl, meter, meterLbl);

  toprow.append(who, read);
  stage.appendChild(toprow);

  const lineEl = document.createElement('div');
  lineEl.className = 'line';
  lineEl.textContent = state.log.length > 0 ? state.log[state.log.length - 1]! : "He's waiting on you.";
  stage.appendChild(lineEl);

  root.appendChild(stage);

  // ---- console: your move ----
  const consoleEl = document.createElement('div');
  consoleEl.className = 'console';

  const step = document.createElement('div');
  step.className = 'step';
  step.textContent = selectedAngle
    ? `Your move · angle › ${ANGLE_LABELS[selectedAngle].toLowerCase()} · now the words`
    : 'Your move · pick an angle';
  consoleEl.appendChild(step);

  const angles = document.createElement('div');
  angles.className = 'angles';
  for (const a of script.angles) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `angle${a === selectedAngle ? ' on' : ''}`;
    chip.dataset.angle = a;
    chip.textContent = ANGLE_LABELS[a];
    chip.addEventListener('click', () => on.pickAngle(a));
    angles.appendChild(chip);
  }
  consoleEl.appendChild(angles);

  if (selectedAngle) {
    const words = document.createElement('div');
    words.className = 'words';
    const lines = script.lines.filter((l) => l.angleId === selectedAngle);
    for (const l of lines) {
      const risk = riskOf(state, opp, l);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `word${risk === 'high' ? ' risk-high-card' : ''}`;
      card.dataset.line = l.id;

      const txt = document.createElement('div');
      txt.className = 'txt';
      txt.textContent = l.text;

      const cue = document.createElement('div');
      cue.className = 'cue';
      const dot = document.createElement('span');
      dot.className = `dot risk-${risk}`;
      dot.dataset.risk = risk;
      cue.append(dot, document.createTextNode(RISK_LABELS[risk]));

      card.append(txt, cue);
      card.addEventListener('click', () => on.probe(l.id));
      words.appendChild(card);
    }
    consoleEl.appendChild(words);
  }

  const footer = document.createElement('div');
  footer.className = 'footer';

  const comp = document.createElement('div');
  comp.className = 'comp';
  comp.append('Your composure ');
  const pips = document.createElement('span');
  pips.className = 'pips';
  const pipCount = 4;
  const filled = Math.round((clampPct(state.yourComposure) / 100) * pipCount);
  for (let i = 0; i < pipCount; i += 1) {
    const pip = document.createElement('i');
    pip.className = `pip${i < filled ? '' : ' off'}`;
    pips.appendChild(pip);
  }
  comp.appendChild(pips);

  const recordBtn = document.createElement('button');
  recordBtn.type = 'button';
  recordBtn.className = 'record-btn';
  recordBtn.dataset.openRecord = '';
  recordBtn.textContent = 'THE RECORD';
  recordBtn.addEventListener('click', () => on.openRecord());

  footer.append(comp, recordBtn);
  consoleEl.appendChild(footer);

  root.appendChild(consoleEl);
}
