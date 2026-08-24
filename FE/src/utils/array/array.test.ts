import { describe, expect, it } from 'vitest';
import { chunk, compact, groupBy, head, last, unique } from './array';

describe('array util', () => {
  it('head / last — 빈 배열은 undefined', () => {
    expect(head([1, 2])).toBe(1);
    expect(last([1, 2])).toBe(2);
    expect(head([])).toBeUndefined();
  });

  it('compact / unique', () => {
    expect(compact([1, 0, 2, null, '', 3])).toEqual([1, 2, 3]);
    expect(unique([1, 1, 2])).toEqual([1, 2]);
  });

  it('chunk — size 0 이하는 빈 배열', () => {
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([1, 2, 3], 0)).toEqual([]);
  });

  it('groupBy — 키별로 묶는다', () => {
    expect(groupBy(['a', 'bb', 'cc'], (s) => s.length)).toEqual({
      1: ['a'],
      2: ['bb', 'cc'],
    });
  });
});
