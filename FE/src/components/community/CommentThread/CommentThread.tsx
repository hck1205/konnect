'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Heading } from '@/components/primitives/Heading';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CommentComposer } from '@/components/community/CommentComposer';
import { CommentItem } from './CommentItem';
import { useReplyTarget } from './hooks';
import { buildCommentTree, countComments } from './CommentThread.utils';
import type { Comment } from './CommentThread.types';
import type { ReactionKind } from '@/components/community/ReactionBar';

export interface CommentThreadProps {
  comments: readonly Comment[];
  currentUser?: { id: string; nickname: string; avatarUrl?: string | null } | null;
  onSubmit: (body: string, parentId: string | null) => void | Promise<void>;
  onReact?: (comment: Comment, kind: ReactionKind) => void;
  onDelete?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
  onSignIn?: () => void;
  className?: string;
}

/**
 * 댓글 영역 — 목록 + 한 단계 답글 + 입력.
 *
 * **대대댓글이 없다.** 답글의 답글은 원 댓글의 답글로 접힌다
 * (→ `buildCommentTree`). 누구에게 답하는지는 들여쓰기가 아니라 표기로 알린다.
 *
 * 답글 대상 상태는 `useReplyTarget` 이 들고 있다 — "한 번에 하나만 열린다"는
 * 규칙이 그 훅 안에 있어 화면이 그걸 다시 구현할 필요가 없다.
 */
export function CommentThread({
  comments,
  currentUser,
  onSubmit,
  onReact,
  onDelete,
  onReport,
  onSignIn,
  className,
}: CommentThreadProps) {
  const { t } = useI18n();
  const reply = useReplyTarget();

  const tree = buildCommentTree(comments);
  const total = countComments(comments);

  const itemProps = {
    currentUserId: currentUser?.id,
    onReply: currentUser ? reply.setTarget : undefined,
    onReact,
    onDelete,
    onReport,
  };

  return (
    <section
      aria-label={t('comment.count', { count: total })}
      className={cn('flex flex-col gap-4', className)}
    >
      <Heading level={2} size="sm">
        {t('comment.count', { count: total })}
      </Heading>

      <CommentComposer
        currentUser={currentUser}
        onSignIn={onSignIn}
        onSubmit={(body) => onSubmit(body, null)}
      />

      {tree.length === 0 ? (
        <EmptyState title={t('comment.empty')} />
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {tree.map((node) => (
            <li key={node.id}>
              <CommentItem comment={node} {...itemProps} />

              {node.replies.length > 0 ? (
                // 들여쓰기는 한 단계뿐 — 더 깊어지지 않는다
                <ul className="ms-6 flex flex-col border-s border-border ps-4">
                  {node.replies.map((r) => (
                    <li key={r.id}>
                      <CommentItem comment={r} isReply {...itemProps} />
                    </li>
                  ))}
                </ul>
              ) : null}

              {reply.isUnder(node) ? (
                <CommentComposer
                  className="ms-6 border-s border-border ps-4 pb-3"
                  currentUser={currentUser}
                  replyingTo={reply.target?.author.nickname}
                  autoFocus
                  onCancel={reply.clear}
                  onSubmit={async (body) => {
                    await onSubmit(body, node.id);
                    reply.clear();
                  }}
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
