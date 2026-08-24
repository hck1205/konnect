import { clamp, isFiniteNumber, percentage, toInt } from './number.util';

describe('number util', () => {
  it('clamp — 범위 밖은 경계로 잘린다', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });

  it('isFiniteNumber — NaN/Infinity 는 false', () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber('1')).toBe(false);
  });

  it('percentage — total 0 이면 0', () => {
    expect(percentage(1, 4)).toBe(25);
    expect(percentage(1, 0)).toBe(0);
  });

  it('toInt — 정수가 아니면 fallback', () => {
    expect(toInt('10', 1)).toBe(10);
    expect(toInt('abc', 1)).toBe(1);
    expect(toInt(1.5, 1)).toBe(1);
  });
});
