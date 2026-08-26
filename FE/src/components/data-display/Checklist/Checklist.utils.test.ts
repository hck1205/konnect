import { describe, expect, it } from 'vitest';
import { countCompleted, toggleChecked } from './Checklist.utils';

const ITEMS = ['visa', 'arc', 'bank'];

describe('countCompleted', () => {
  it('완료 개수를 센다', () => {
    expect(countCompleted(ITEMS, ['visa', 'arc'])).toBe(2);
    expect(countCompleted(ITEMS, [])).toBe(0);
  });

  it('사라진 항목의 저장된 id 는 세지 않는다 — 저장 상태가 오래됐을 수 있다', () => {
    expect(countCompleted(ITEMS, ['visa', 'removed-item'])).toBe(1);
  });
});

describe('toggleChecked', () => {
  it('켜고 끈다', () => {
    expect(toggleChecked([], 'visa', true)).toEqual(['visa']);
    expect(toggleChecked(['visa'], 'visa', false)).toEqual([]);
  });

  it('이미 켜진 것을 다시 켜도 중복되지 않는다', () => {
    expect(toggleChecked(['visa'], 'visa', true)).toEqual(['visa']);
  });

  it('원본을 변형하지 않는다', () => {
    const original = ['visa'];
    toggleChecked(original, 'arc', true);
    expect(original).toEqual(['visa']);
  });
});
