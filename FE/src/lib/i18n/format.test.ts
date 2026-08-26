import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatList, formatNumber, formatRelative } from './format';

const NOW = new Date('2026-08-24T12:00:00Z');
const DAY = 24 * 3600_000;

describe('formatNumber', () => {
  it('로케일별 천 단위 구분자를 쓴다', () => {
    expect(formatNumber(1234567, 'en')).toBe('1,234,567');
    expect(formatNumber(1234567, 'ko')).toBe('1,234,567');
    // 베트남어는 마침표를 천 단위로 쓴다 — 우리가 규칙을 갖고 있으면 안 되는 이유
    expect(formatNumber(1234567, 'vi')).toBe('1.234.567');
  });

  it('같은 로케일을 반복 호출해도 같은 결과다(캐시가 결과를 바꾸지 않는다)', () => {
    expect(formatNumber(1000, 'en')).toBe(formatNumber(1000, 'en'));
  });
});

describe('formatCurrency', () => {
  it('KRW 는 소수 단위가 없다 — Intl 이 통화별로 처리한다', () => {
    expect(formatCurrency(600000, 'en')).not.toContain('.00');
  });

  it('로케일마다 기호 위치가 다르다', () => {
    const en = formatCurrency(1000, 'en');
    const vi = formatCurrency(1000, 'vi');
    expect(en).not.toBe(vi);
  });
});

describe('formatDate', () => {
  it('로케일별 형식으로 낸다', () => {
    expect(formatDate('2026-08-24T12:00:00Z', 'en')).toMatch(/Aug/);
    expect(formatDate('2026-08-24T12:00:00Z', 'ko')).toMatch(/8/);
  });

  it('잘못된 값은 빈 문자열 — 화면에 "Invalid Date" 를 내보내지 않는다', () => {
    expect(formatDate('nope', 'en')).toBe('');
  });
});

describe('formatList', () => {
  it('언어별 접속사를 붙인다 — 쉼표 join 으로는 안 된다', () => {
    expect(formatList(['Seoul', 'Busan', 'Daegu'], 'en')).toBe('Seoul, Busan, and Daegu');
  });

  it('항목이 하나면 그대로', () => {
    expect(formatList(['Seoul'], 'en')).toBe('Seoul');
  });

  it('빈 목록은 빈 문자열', () => {
    expect(formatList([], 'en')).toBe('');
  });
});

describe('formatRelative', () => {
  it('과거와 미래를 구분한다', () => {
    expect(formatRelative(new Date(NOW.getTime() - 3 * DAY), NOW, 'en')).toBe('3 days ago');
    expect(formatRelative(new Date(NOW.getTime() + 3 * DAY), NOW, 'en')).toBe('in 3 days');
  });

  it('로케일에 따라 언어가 바뀐다', () => {
    const ko = formatRelative(new Date(NOW.getTime() - 3 * DAY), NOW, 'ko');
    expect(ko).toContain('3');
    expect(ko).not.toBe('3 days ago');
  });

  it('1분 미만은 빈 문자열 — 사전의 justNow 문구를 쓰라는 뜻이다', () => {
    expect(formatRelative(NOW, NOW, 'en')).toBe('');
  });

  it('잘못된 값은 빈 문자열', () => {
    expect(formatRelative('nope', NOW, 'en')).toBe('');
  });
});
