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
