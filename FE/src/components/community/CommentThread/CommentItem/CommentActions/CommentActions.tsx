import { useI18n } from '@/lib/i18n';
import { ReactionBar, type ReactionKind } from '@/components/community/ReactionBar';
import type { Comment } from '../../CommentThread.types';

export interface CommentActionsProps {
  comment: Comment;
  /** 비로그인이면 리액션과 답글이 잠긴다 — 읽기는 공개다 */
  canInteract: boolean;
  onReact?: (kind: ReactionKind) => void;
  onReply?: () => void;
}

/**
 * 댓글 아래 액션 줄 — 리액션 + 답글.
 *
 * 답글이 버튼이지 링크가 아닌 이유: 페이지를 옮기지 않고 **같은 화면에 입력창을
 * 여는** 동작이다. 링크로 만들면 새 탭 열기가 아무 일도 안 하는 것처럼 보인다.
 */
export function CommentActions({
  comment,
  canInteract,
  onReact,
  onReply,
}: CommentActionsProps) {
  const { t } = useI18n();

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <ReactionBar
        counts={comment.reactions}
        mine={comment.myReaction}
        disabled={!canInteract}
        onToggle={(kind) => onReact?.(kind)}
      />
      {onReply ? (
        <button
          type="button"
          onClick={onReply}
          className="cursor-pointer text-xs text-fg-muted hover:text-fg hover:underline"
        >
          {t('comment.reply')}
        </button>
      ) : null}
    </div>
  );
}
