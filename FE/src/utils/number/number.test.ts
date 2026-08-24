import { describe, expect, it } from 'vitest';
import { clamp, formatCount, isFiniteNumber, percentage } from './number';

describe('number util', () => {
  it('clamp — 범위 밖은 경계로 잘린다', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });

  it('isFiniteNumber — NaN 은 false', () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(NaN)).toBe(false);
  });

  it('percentage — total 0 이면 0', () => {
    expect(percentage(1, 4)).toBe(25);
    expect(percentage(1, 0)).toBe(0);
  });

  it('formatCount — 자릿수 구분', () => {
    expect(formatCount(1234567)).toBe('1,234,567');
  });
});
