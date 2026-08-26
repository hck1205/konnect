import { describe, expect, it } from 'vitest';
import { completedCount, stepStatus } from './Steps.utils';

describe('stepStatus', () => {
  it('현재보다 앞이면 완료, 같으면 현재, 뒤면 예정', () => {
    expect(stepStatus(0, 1)).toBe('complete');
    expect(stepStatus(1, 1)).toBe('current');
    expect(stepStatus(2, 1)).toBe('upcoming');
  });

  it('첫 단계에서는 완료가 없다', () => {
    expect(stepStatus(0, 0)).toBe('current');
  });

  it('전부 끝난 상태를 표현할 수 있다', () => {
    expect(stepStatus(2, 3)).toBe('complete');
  });
});

describe('completedCount', () => {
  it('범위를 벗어난 값을 잘라 낸다 — 저장된 상태가 오래됐을 수 있다', () => {
    expect(completedCount(5, 3)).toBe(3);
    expect(completedCount(-1, 3)).toBe(0);
    expect(completedCount(2, 3)).toBe(2);
  });
});
