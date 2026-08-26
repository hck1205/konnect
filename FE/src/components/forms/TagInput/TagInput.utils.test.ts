import { describe, expect, it } from 'vitest';
import { addTag, removeTag, splitTagInput } from './TagInput.utils';

describe('addTag', () => {
  it('정규화해서 추가한다', () => {
    expect(addTag([], 'Visa D_2')).toEqual({ next: ['visa-d-2'], added: true });
  });

  it('정규화 후 같으면 중복으로 막는다', () => {
    expect(addTag(['visa:d-2'], 'VISA:D_2').added).toBe(false);
  });

  it('빈 값이나 기호만 있는 입력은 추가하지 않는다', () => {
    expect(addTag([], '   ').added).toBe(false);
    expect(addTag([], '!!!').added).toBe(false);
  });

  it('정원이 차면 추가하지 않는다', () => {
    expect(addTag(['a', 'b'], 'c', 2).added).toBe(false);
    expect(addTag(['a'], 'b', 2).added).toBe(true);
  });

  it('원본 배열을 변형하지 않는다', () => {
    const original = ['a'];
    addTag(original, 'b');
    expect(original).toEqual(['a']);
  });
});

describe('removeTag', () => {
  it('해당 태그만 제거한다', () => {
    expect(removeTag(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });

  it('없는 태그를 지워도 안전하다', () => {
    expect(removeTag(['a'], 'z')).toEqual(['a']);
  });
});

describe('splitTagInput', () => {
  it('쉼표로 나누고 빈 항목을 버린다', () => {
    expect(splitTagInput('visa:d-2, seoul, ')).toEqual(['visa:d-2', 'seoul']);
  });

  it('쉼표가 없으면 한 개짜리 배열', () => {
    expect(splitTagInput('seoul')).toEqual(['seoul']);
  });
});
