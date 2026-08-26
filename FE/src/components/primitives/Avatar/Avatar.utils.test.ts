import { describe, expect, it } from 'vitest';
import { toColorIndex, toInitials } from './Avatar.utils';

describe('toInitials', () => {
  it('두 토큰이면 각 첫 글자를 딴다', () => {
    expect(toInitials('Maria Santos')).toBe('MS');
  });

  it('세 토큰 이상이면 앞 두 개만 쓴다', () => {
    expect(toInitials('Jean Luc Picard')).toBe('JL');
  });

  it('한 덩어리면 한 글자만 딴다 — 한글은 이름 일부가 그대로 노출되면 안 된다', () => {
    expect(toInitials('아마르')).toBe('아');
    expect(toInitials('chen')).toBe('C');
  });

  it('빈 문자열/공백은 물음표로 수렴한다', () => {
    expect(toInitials('')).toBe('?');
    expect(toInitials('   ')).toBe('?');
  });

  it('서로게이트 페어를 반으로 자르지 않는다', () => {
    expect(toInitials('👩‍🚀')).toBe('👩');
  });

  it('앞뒤 공백과 연속 공백을 무시한다', () => {
    expect(toInitials('  Maria   Santos  ')).toBe('MS');
  });
});

describe('toColorIndex', () => {
  it('같은 이름은 항상 같은 색을 받는다', () => {
    expect(toColorIndex('Maria', 6)).toBe(toColorIndex('Maria', 6));
  });

  it('항상 범위 안이다', () => {
    for (const name of ['a', '아마르', 'Jean Luc', '👩‍🚀', '']) {
      const i = toColorIndex(name, 6);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(6);
    }
  });
});
