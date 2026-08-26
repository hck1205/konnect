'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Heading } from '@/components/primitives/Heading';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CommentComposer } from '@/components/community/CommentComposer';
import { CommentItem } from './CommentItem';
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
 * 답글 입력창은 **한 번에 하나만** 열린다. 여러 개가 열려 있으면 어디에 쓰는지
 * 헷갈리고, 모바일에서 화면이 입력창으로 덮인다.
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
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  const tree = buildCommentTree(comments);
  const total = countComments(comments);

  return (
    <section aria-label={t('comment.count', { count: total })} className={cn('flex flex-col gap-4', className)}>
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
              <CommentItem
                comment={node}
                currentUserId={currentUser?.id}
                onReply={currentUser ? setReplyingTo : undefined}
                onReact={onReact}
                onDelete={onDelete}
                onReport={onReport}
              />

              {node.replies.length > 0 ? (
                // 들여쓰기는 한 단계뿐 — 더 깊어지지 않는다
                <ul className="ms-6 flex flex-col border-s border-border ps-4">
                  {node.replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentItem
                        comment={reply}
                        isReply
                        currentUserId={currentUser?.id}
                        onReply={currentUser ? setReplyingTo : undefined}
                        onReact={onReact}
                        onDelete={onDelete}
                        onReport={onReport}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* 답글 입력은 한 번에 하나만 */}
              {replyingTo &&
              (replyingTo.id === node.id ||
                node.replies.some((r) => r.id === replyingTo.id)) ? (
                <CommentComposer
                  className="ms-6 border-s border-border ps-4 pb-3"
                  currentUser={currentUser}
                  replyingTo={replyingTo.author.nickname}
                  autoFocus
                  onCancel={() => setReplyingTo(null)}
                  onSubmit={async (body) => {
                    await onSubmit(body, node.id);
                    setReplyingTo(null);
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
