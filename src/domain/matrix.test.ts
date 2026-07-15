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
