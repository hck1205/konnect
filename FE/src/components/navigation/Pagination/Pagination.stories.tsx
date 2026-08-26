import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Pagination } from './Pagination';
import {
  canGoBack,
  initialCursorStack,
  popCursor,
  pushCursor,
} from './Pagination.utils';

export default { title: 'Navigation / Pagination' };

/**
 * **페이지 번호가 없다.** 커서 방식은 전체 개수를 모르기 때문이고, 그건 의도다 —
 * 시간순 목록에 새 글이 계속 들어오는 상황에서 offset 페이지는 중복·누락을 만든다.
 *
 * 커서 스택은 순수 함수로 관리한다(테스트됨).
 */
export const CursorStack: Story = () => {
  const [stack, setStack] = useState(initialCursorStack);
  // 데모용 — 실제로는 서버 응답의 nextCursor 다
  const page = stack.history.length;
  const nextCursor = page < 3 ? `cursor-${page + 1}` : null;

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="rounded-md bg-surface-sunken p-4 text-sm text-fg-muted">
        <p>현재 커서: {stack.current ?? '(첫 페이지)'}</p>
        <p>기록 깊이: {stack.history.length}</p>
      </div>
      <Pagination
        nextCursor={nextCursor}
        hasPrevious={canGoBack(stack)}
        onNext={() => nextCursor && setStack(pushCursor(stack, nextCursor))}
        onPrevious={() => setStack(popCursor(stack))}
      />
    </div>
  );
};

export const Loading: Story = () => (
  <div className="max-w-xl">
    <Pagination nextCursor="c1" hasPrevious loading onNext={() => {}} onPrevious={() => {}} />
  </div>
);
