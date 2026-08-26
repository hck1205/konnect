import { describe, expect, it } from 'vitest';
import {
  canGoBack,
  initialCursorStack,
  popCursor,
  pushCursor,
} from './Pagination.utils';

describe('cursor stack', () => {
  it('첫 페이지에서는 뒤로 갈 수 없다', () => {
    expect(canGoBack(initialCursorStack)).toBe(false);
    expect(initialCursorStack.current).toBeNull();
  });

  it('다음으로 가면 현재 커서가 기록에 쌓인다', () => {
    const s1 = pushCursor(initialCursorStack, 'c1');
    expect(s1.current).toBe('c1');
    expect(s1.history).toEqual([null]);
    expect(canGoBack(s1)).toBe(true);
  });

  it('앞뒤로 오가면 원래 자리로 돌아온다', () => {
    const s1 = pushCursor(initialCursorStack, 'c1');
    const s2 = pushCursor(s1, 'c2');
    expect(s2.current).toBe('c2');

    const back1 = popCursor(s2);
    expect(back1.current).toBe('c1');

    const back2 = popCursor(back1);
    expect(back2.current).toBeNull();
    expect(canGoBack(back2)).toBe(false);
  });

  it('기록이 비었을 때 뒤로 가도 안전하다', () => {
    expect(popCursor(initialCursorStack)).toEqual(initialCursorStack);
  });

  it('원본 스택을 변형하지 않는다', () => {
    const s = pushCursor(initialCursorStack, 'c1');
    pushCursor(s, 'c2');
    expect(s.history).toEqual([null]);
  });
});
