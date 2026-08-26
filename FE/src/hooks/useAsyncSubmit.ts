'use client';

import { useState } from 'react';

/**
 * "제출 중" 상태를 가진 비동기 제출.
 *
 * CommentComposer·MessageThread·ReportDialog 가 각자 같은 코드를 갖고 있었다:
 * `pending` state → try/finally → 성공 시 입력 비우기.
 * try/finally 를 빠뜨리면 **실패했을 때 버튼이 영원히 잠긴다** — 실제로 틀리기 쉬운 부분이다.
 *
 * 성공했을 때만 `onSuccess` 를 부른다. 실패 시 입력을 비우면 사용자가 쓴 글이 사라진다.
 */
export function useAsyncSubmit(action: (value: string) => void | Promise<void>) {
  const [pending, setPending] = useState(false);

  const submit = async (value: string, onSuccess?: () => void) => {
    const trimmed = value.trim();
    if (!trimmed || pending) return;

    setPending(true);
    try {
      await action(trimmed);
      onSuccess?.();
    } finally {
      // 실패해도 반드시 잠금을 푼다
      setPending(false);
    }
  };

  return { pending, submit };
}
