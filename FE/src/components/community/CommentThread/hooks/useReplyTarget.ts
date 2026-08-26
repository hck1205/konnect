'use client';

import { useState } from 'react';
import type { Comment, CommentNode } from '../CommentThread.types';

/**
 * 답글 입력 대상 관리.
 *
 * 답글 입력창은 **한 번에 하나만** 열린다. 여러 개가 열려 있으면 어디에 쓰는지
 * 헷갈리고, 모바일에서 화면이 입력창으로 덮인다.
 *
 * `isUnder` 가 필요한 이유: 답글은 **원 댓글 아래**에 입력창이 뜬다.
 * 대상이 답글이어도(대대댓글 시도) 그 답글이 속한 최상위 댓글 아래에 열려야 한다 —
 * 트리가 한 단계뿐이기 때문이다.
 */
export function useReplyTarget() {
  const [target, setTarget] = useState<Comment | null>(null);

  return {
    target,
    setTarget,
    clear: () => setTarget(null),
    /** 이 최상위 댓글 아래에 입력창을 열어야 하는가 */
    isUnder: (node: CommentNode) =>
      target !== null &&
      (target.id === node.id || node.replies.some((r) => r.id === target.id)),
  };
}
