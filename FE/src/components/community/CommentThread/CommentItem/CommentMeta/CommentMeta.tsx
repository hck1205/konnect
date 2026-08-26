import { Flag, MoreHorizontal, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { IconButton } from '@/components/primitives/IconButton';
import { Menu, MenuItem, MenuSeparator } from '@/components/overlays/Menu';
import type { Comment } from '../../CommentThread.types';

export interface CommentMetaProps {
  comment: Comment;
  /** 내 댓글이면 삭제가 뜬다 */
  isMine: boolean;
  onDelete?: () => void;
  onReport?: () => void;
}

/**
 * 댓글의 작성자·시각·더보기 메뉴 줄.
 *
 * 신고를 **내 댓글에도 남겨 두지 않는다** — 자기 글을 신고할 일이 없고,
 * 메뉴에 쓸모없는 항목이 있으면 급할 때 찾는 속도가 느려진다.
 */
export function CommentMeta({ comment, isMine, onDelete, onReport }: CommentMetaProps) {
  const { t } = useI18n();
  const hasMenu = Boolean(onDelete && isMine) || Boolean(onReport && !isMine);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-fg">{comment.author.nickname}</span>
      <span aria-hidden="true" className="text-fg-subtle">
        ·
      </span>
      <RelativeTime value={comment.createdAt} className="text-xs text-fg-subtle" />
      {comment.editedAt ? (
        <span className="text-xs text-fg-subtle">({t('comment.edited')})</span>
      ) : null}

      {hasMenu ? (
        <div className="ms-auto">
          <Menu
            trigger={(p) => (
              <IconButton
                {...p}
                size="sm"
                icon={<MoreHorizontal className="size-3.5" />}
                label={t('common.more')}
              />
            )}
          >
            {onReport && !isMine ? (
              <MenuItem icon={<Flag className="size-4" />} onSelect={onReport}>
                {t('report.title')}
              </MenuItem>
            ) : null}
            {isMine && onDelete ? (
              <>
                {onReport && !isMine ? <MenuSeparator /> : null}
                <MenuItem icon={<Trash2 className="size-4" />} destructive onSelect={onDelete}>
                  {t('common.delete')}
                </MenuItem>
              </>
            ) : null}
          </Menu>
        </div>
      ) : null}
    </div>
  );
}
