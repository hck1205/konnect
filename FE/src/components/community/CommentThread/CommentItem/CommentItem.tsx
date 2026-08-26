'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { CommentMeta } from './CommentMeta';
import { CommentActions } from './CommentActions';
import type { Comment } from '../CommentThread.types';
import type { ReactionKind } from '@/components/community/ReactionBar';

export interface CommentItemProps {
  comment: Comment;
  /** 답글인지 — 아바타 크기가 달라진다 */
  isReply?: boolean;
  currentUserId?: string | null;
  onReply?: (comment: Comment) => void;
  onReact?: (comment: Comment, kind: ReactionKind) => void;
  onDelete?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
  className?: string;
}

/**
 * 댓글 한 개 — 조립만 한다.
 *
 * 삭제된 댓글은 **자리를 남긴다.** 답글이 달려 있는데 통째로 지우면
 * 그 답글들이 무엇에 대한 답인지 알 수 없게 된다.
 */
export function CommentItem({
  comment,
  isReply,
  currentUserId,
  onReply,
  onReact,
  onDelete,
  onReport,
  className,
}: CommentItemProps) {
  const { t } = useI18n();
  const isMine = currentUserId != null && comment.author.id === currentUserId;

  if (comment.deleted) {
    return (
      <div className={cn('py-3 text-sm text-fg-subtle italic', className)}>
        {t('comment.deleted')}
      </div>
    );
  }

  return (
    <article className={cn('flex gap-3 py-3', className)}>
      <Avatar
        name={comment.author.nickname}
        src={comment.author.avatarUrl}
        size={isReply ? 'sm' : 'md'}
      />

      <div className="min-w-0 flex-1">
        <CommentMeta
          comment={comment}
          isMine={isMine}
          onDelete={onDelete ? () => onDelete(comment) : undefined}
          onReport={onReport ? () => onReport(comment) : undefined}
        />

        {/* 사용자가 쓴 본문 — 줄바꿈을 보존한다 */}
        <p className="mt-1 text-sm whitespace-pre-wrap text-fg">{comment.body}</p>

        <CommentActions
          comment={comment}
          canInteract={Boolean(currentUserId)}
          onReact={onReact ? (kind) => onReact(comment, kind) : undefined}
          onReply={onReply ? () => onReply(comment) : undefined}
        />
      </div>
    </article>
  );
}
