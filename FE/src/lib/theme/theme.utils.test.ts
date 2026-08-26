import { describe, expect, it } from 'vitest';
import { isTheme, nextTheme, resolveTheme } from './theme.utils';

describe('isTheme', () => {
  it('알려진 값만 통과시킨다 — 손상된 localStorage 값을 막는다', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('system')).toBe(true);
    expect(isTheme('blue')).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

describe('resolveTheme', () => {
  it('명시적 선택은 시스템 선호를 무시한다', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('system 일 때만 시스템 선호를 따른다', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});

describe('nextTheme', () => {
  it('light → dark → system → light 로 순환한다', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
    expect(nextTheme('system')).toBe('light');
  });

  it('세 번 돌면 제자리로 온다', () => {
    expect(nextTheme(nextTheme(nextTheme('light')))).toBe('light');
  });
});
