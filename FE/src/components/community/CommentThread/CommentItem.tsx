'use client';

import { Flag, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { Menu, MenuItem, MenuSeparator } from '@/components/overlays/Menu';
import { IconButton } from '@/components/primitives/IconButton';
import { ReactionBar, type ReactionKind } from '@/components/community/ReactionBar';
import type { Comment } from './CommentThread.types';

export interface CommentItemProps {
  comment: Comment;
  /** 답글인지 — 들여쓰기와 밀도가 달라진다 */
  isReply?: boolean;
  currentUserId?: string | null;
  onReply?: (comment: Comment) => void;
  onReact?: (comment: Comment, kind: ReactionKind) => void;
  onDelete?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
  className?: string;
}

/**
 * 댓글 한 개.
 *
 * 삭제된 댓글은 **자리를 남긴다** — 답글이 달려 있으면 통째로 지울 때
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
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-fg">{comment.author.nickname}</span>
          <span aria-hidden="true" className="text-fg-subtle">
            ·
          </span>
          <RelativeTime value={comment.createdAt} className="text-xs text-fg-subtle" />
          {comment.editedAt ? (
            <span className="text-xs text-fg-subtle">({t('comment.edited')})</span>
          ) : null}

          <div className="ms-auto">
            <Menu
              trigger={(p) => (
                <IconButton
                  {...p}
                  size="sm"
                  icon={<MessageSquare className="size-3.5" />}
                  label={t('common.more')}
                />
              )}
            >
              {onReport ? (
                <MenuItem icon={<Flag className="size-4" />} onSelect={() => onReport(comment)}>
                  {t('report.title')}
                </MenuItem>
              ) : null}
              {isMine && onDelete ? (
                <>
                  <MenuSeparator />
                  <MenuItem
                    icon={<Trash2 className="size-4" />}
                    destructive
                    onSelect={() => onDelete(comment)}
                  >
                    {t('common.delete')}
                  </MenuItem>
                </>
              ) : null}
            </Menu>
          </div>
        </div>

        {/* 사용자가 쓴 본문 — 줄바꿈을 보존한다 */}
        <p className="mt-1 text-sm whitespace-pre-wrap text-fg">{comment.body}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ReactionBar
            counts={comment.reactions}
            mine={comment.myReaction}
            disabled={!currentUserId}
            onToggle={(kind) => onReact?.(comment, kind)}
          />
          {onReply ? (
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="cursor-pointer text-xs text-fg-muted hover:text-fg hover:underline"
            >
              {t('comment.reply')}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
