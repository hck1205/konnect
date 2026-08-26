import { describe, expect, it } from 'vitest';
import { monthsBetween } from './time';

const NOW = new Date('2026-08-24T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;

describe('monthsBetween', () => {
  it('개월 수를 내림한다', () => {
    expect(monthsBetween(new Date(NOW.getTime() - 45 * DAY), NOW)).toBe(1);
    expect(monthsBetween(new Date(NOW.getTime() - 200 * DAY), NOW)).toBe(6);
  });

  it('미래 시각은 0', () => {
    expect(monthsBetween(new Date(NOW.getTime() + DAY), NOW)).toBe(0);
  });

  it('잘못된 값은 0 — 던지지 않는다', () => {
    expect(monthsBetween('nope', NOW)).toBe(0);
  });

  it('ISO 문자열도 받는다', () => {
    expect(monthsBetween('2026-06-24T12:00:00Z', NOW)).toBe(2);
  });
});
