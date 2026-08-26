/**
 * 키셋(커서) 페이지네이션의 커서 스택.
 *
 * 우리 API 는 offset 이 아니라 커서를 쓴다 — 목록이 시간순이고 새 글이 계속
 * 들어와서 offset 은 중복·누락이 생기기 때문이다
 * (→ docs/30-architecture/03-api-conventions.md).
 *
 * 커서는 "다음"만 알려주므로 **뒤로 가려면 지나온 커서를 쌓아 둬야 한다.**
 * 그 스택 조작을 순수 함수로 뺀다.
 */

export interface CursorStack {
  /** 지금 요청에 쓸 커서. null 이면 첫 페이지 */
  current: string | null;
  /** 지나온 커서들 (뒤로 가기용) */
  history: readonly (string | null)[];
}

export const initialCursorStack: CursorStack = { current: null, history: [] };

/** 다음 페이지로 — 현재 커서를 기록에 밀어 넣는다 */
export function pushCursor(stack: CursorStack, nextCursor: string): CursorStack {
  return { current: nextCursor, history: [...stack.history, stack.current] };
}

/** 이전 페이지로 — 기록에서 하나 꺼낸다. 비어 있으면 그대로 둔다. */
export function popCursor(stack: CursorStack): CursorStack {
  if (stack.history.length === 0) return stack;
  const history = stack.history.slice(0, -1);
  const current = stack.history[stack.history.length - 1];
  return { current, history };
}

export function canGoBack(stack: CursorStack): boolean {
  return stack.history.length > 0;
}
