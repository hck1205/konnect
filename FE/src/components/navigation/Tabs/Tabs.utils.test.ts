import { describe, expect, it } from 'vitest';
import { nextTabIndex, parseTabValue } from './Tabs.utils';

const TABS = ['questions', 'answers', 'guides'] as const;

describe('parseTabValue', () => {
  it('알려진 값은 그대로 통과한다', () => {
    expect(parseTabValue('answers', TABS, 'questions')).toBe('answers');
  });

  it('모르는 값·빈 값은 fallback 으로 수렴한다 — 빈 화면보다 낫다', () => {
    expect(parseTabValue('nope', TABS, 'questions')).toBe('questions');
    expect(parseTabValue(null, TABS, 'questions')).toBe('questions');
    expect(parseTabValue(undefined, TABS, 'questions')).toBe('questions');
  });
});

describe('nextTabIndex', () => {
  it('양끝에서 순환한다', () => {
    expect(nextTabIndex(0, 3, 1)).toBe(1);
    expect(nextTabIndex(2, 3, 1)).toBe(0);
    expect(nextTabIndex(0, 3, -1)).toBe(2);
  });

  it('항목이 없으면 0', () => {
    expect(nextTabIndex(0, 0, 1)).toBe(0);
  });
});
