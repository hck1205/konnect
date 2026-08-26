'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { Button } from '@/components/primitives/Button';
import { Textarea } from '@/components/forms/Textarea';

export interface CommentComposerProps {
  /** 로그인 사용자. 없으면 로그인 안내로 대체된다. */
  currentUser?: { nickname: string; avatarUrl?: string | null } | null;
  /** 답글 대상. 주면 "{name}님에게 답글" 로 표시된다. */
  replyingTo?: string;
  onSubmit: (body: string) => void | Promise<void>;
  onCancel?: () => void;
  onSignIn?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * 댓글 입력.
 *
 * 비로그인 사용자에게 **입력창을 보여주고 나서** 로그인을 요구하지 않는다 —
 * 다 쓴 다음 로그인하라는 것만큼 확실한 이탈 유발이 없다. 처음부터 안내를 보여준다.
 *
 * 답글일 때 들여쓰기 대신 **"{name}님에게" 표기**로 대상을 알린다
 * (깊은 중첩을 만들지 않기 위해).
 */
export function CommentComposer({
  currentUser,
  replyingTo,
  onSubmit,
  onCancel,
  onSignIn,
  autoFocus,
  className,
}: CommentComposerProps) {
  const { t } = useI18n();
  const [body, setBody] = useState('');
  const [pending, setPending] = useState(false);

  if (!currentUser) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-sunken px-4 py-3',
          className,
        )}
      >
        <p className="text-sm text-fg-muted">{t('comment.signInToComment')}</p>
        <Button size="sm" onClick={onSignIn}>
          {t('common.signIn')}
        </Button>
      </div>
    );
  }

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || pending) return;
    setPending(true);
    try {
      await onSubmit(trimmed);
      setBody('');
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className={cn('flex gap-3', className)}
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <Avatar name={currentUser.nickname} src={currentUser.avatarUrl} size="sm" />

      <div className="flex flex-1 flex-col gap-2">
        {replyingTo ? (
          <p className="text-xs text-fg-subtle">
            {t('comment.replyTo', { name: replyingTo })}
          </p>
        ) : null}

        <Textarea
          value={body}
          autoFocus={autoFocus}
          rows={replyingTo ? 2 : 3}
          disabled={pending}
          aria-label={replyingTo ? t('comment.replyTo', { name: replyingTo }) : t('comment.post')}
          placeholder={t('comment.placeholder')}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2">
          {onCancel ? (
            <Button size="sm" variant="ghost" tone="neutral" type="button" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          ) : null}
          <Button size="sm" type="submit" loading={pending} disabled={body.trim().length === 0}>
            {replyingTo ? t('comment.reply') : t('comment.post')}
          </Button>
        </div>
      </div>
    </form>
  );
}
