import { describe, expect, it } from 'vitest';
import { formatRelativeTime, monthsBetween } from './RelativeTime.utils';

// 기준 시각을 고정한다 — 시스템 시계에 의존하는 테스트는 언젠가 깨진다
const NOW = new Date('2026-08-24T12:00:00Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms);

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe('formatRelativeTime', () => {
  it('1분 미만은 just now 로 수렴한다', () => {
    expect(formatRelativeTime(ago(5 * 1000), NOW)).toBe('just now');
    expect(formatRelativeTime(NOW, NOW)).toBe('just now');
  });

  it('과거를 "ago" 로 표현한다', () => {
    expect(formatRelativeTime(ago(3 * DAY), NOW)).toBe('3 days ago');
    expect(formatRelativeTime(ago(2 * HOUR), NOW)).toBe('2 hours ago');
  });

  it('미래를 "in" 으로 표현한다 — 체류 만료일 같은 미래 시각도 다룬다', () => {
    const future = new Date(NOW.getTime() + 5 * DAY);
    expect(formatRelativeTime(future, NOW)).toBe('in 5 days');
  });

  it('numeric:auto 라 어제/내일은 자연어로 나온다', () => {
    expect(formatRelativeTime(ago(DAY), NOW)).toBe('yesterday');
  });

  it('ISO 문자열도 받는다', () => {
    expect(formatRelativeTime('2026-08-21T12:00:00Z', NOW)).toBe('3 days ago');
  });

  it('잘못된 값은 빈 문자열 — 화면이 "Invalid Date" 를 보여주지 않게', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBe('');
  });

  it('로케일을 바꾸면 출력 언어가 바뀐다', () => {
    expect(formatRelativeTime(ago(3 * DAY), NOW, 'ko')).toContain('3');
  });
});

describe('monthsBetween', () => {
  it('개월 수를 내림한다', () => {
    expect(monthsBetween(ago(45 * DAY), NOW)).toBe(1);
    expect(monthsBetween(ago(200 * DAY), NOW)).toBe(6);
  });

  it('미래 시각은 0', () => {
    expect(monthsBetween(new Date(NOW.getTime() + DAY), NOW)).toBe(0);
  });

  it('잘못된 값은 0', () => {
    expect(monthsBetween('nope', NOW)).toBe(0);
  });
});
