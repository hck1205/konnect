'use client';

import { useState } from 'react';
import { Ban, Flag, Send, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { Button } from '@/components/primitives/Button';
import { IconButton } from '@/components/primitives/IconButton';
import { Textarea } from '@/components/forms/Textarea';
import { Banner } from '@/components/feedback/Banner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Menu, MenuItem, MenuSeparator } from '@/components/overlays/Menu';
import { Divider } from '@/components/primitives/Divider';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { groupMessages, looksLikeSensitiveId } from './MessageThread.utils';
import type { DirectMessage, MessageParticipant } from './MessageThread.types';

export interface MessageThreadProps {
  participant: MessageParticipant;
  messages: readonly DirectMessage[];
  currentUserId: string;
  onSend: (body: string) => void | Promise<void>;
  onBlock?: () => void;
  onReport?: () => void;
  /** 상대가 쪽지를 받지 않는 설정이면 입력이 잠긴다 */
  disabled?: boolean;
  className?: string;
}

/**
 * 1:1 쪽지 대화.
 *
 * ⚠️ **이 기능은 안전 장치가 전제다.** 타깃 사용자는 언어가 불편하고 현지 지원망이
 * 없으며 체류자격이 걸려 있어 신고를 주저한다 — 일반 커뮤니티보다 피해 가능성이
 * 높고 회복이 어렵다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md
 *
 * 그래서 이 컴포넌트는 다음을 **항상** 포함한다:
 * - 안전 고지(금전·여권·외국인등록증 요구 거절)를 대화 상단에 상시 노출
 * - 차단과 신고를 대화 헤더에서 **한 번의 조작으로** 접근
 * - 개인정보로 보이는 문자열을 보내기 전에 경고
 *
 * 이 중 하나라도 빠지면 기능을 열지 않는다.
 */
export function MessageThread({
  participant,
  messages,
  currentUserId,
  onSend,
  onBlock,
  onReport,
  disabled,
  className,
}: MessageThreadProps) {
  const { t, formatDate } = useI18n();
  const [body, setBody] = useState('');
  const [pending, setPending] = useState(false);

  const groups = groupMessages(messages);
  const risky = looksLikeSensitiveId(body);

  const send = async () => {
    const trimmed = body.trim();
    if (!trimmed || pending) return;
    setPending(true);
    try {
      await onSend(trimmed);
      setBody('');
    } finally {
      setPending(false);
    }
  };

  return (
    <section
      aria-label={`${t('message.title')} — ${participant.nickname}`}
      className={cn('flex h-full flex-col', className)}
    >
      {/* 헤더 — 차단·신고가 한 번의 조작 안에 있다 */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Avatar name={participant.nickname} src={participant.avatarUrl} size="sm" />
        <span className="flex-1 truncate text-sm font-medium text-fg">
          {participant.nickname}
        </span>
        <Menu
          trigger={(p) => (
            <IconButton
              {...p}
              size="sm"
              icon={<ShieldAlert className="size-4" />}
              label={t('common.more')}
            />
          )}
        >
          {onReport ? (
            <MenuItem icon={<Flag className="size-4" />} onSelect={onReport}>
              {t('message.report')}
            </MenuItem>
          ) : null}
          {onBlock ? (
            <>
              <MenuSeparator />
              <MenuItem icon={<Ban className="size-4" />} destructive onSelect={onBlock}>
                {t('message.block')}
              </MenuItem>
            </>
          ) : null}
        </Menu>
      </header>

      {/* 안전 고지 — 닫을 수 없다. 사기가 가장 자주 시작되는 경로다. */}
      <Banner tone="warning" className="m-4">
        {t('message.safety')}
      </Banner>

      <div className="flex-1 overflow-y-auto px-4">
        {groups.length === 0 ? (
          <EmptyState title={t('message.conversationEmpty')} />
        ) : (
          groups.map((group, i) => {
            const mine = group.senderId === currentUserId;
            const showDate = i === 0 || groups[i - 1].date !== group.date;

            return (
              <div key={`${group.date}-${group.senderId}-${i}`}>
                {showDate ? (
                  <Divider
                    label={formatDate(group.date, { dateStyle: 'medium' })}
                    className="my-4"
                  />
                ) : null}

                <div className={cn('flex gap-2', mine && 'flex-row-reverse')}>
                  {!mine ? (
                    <Avatar
                      name={participant.nickname}
                      src={participant.avatarUrl}
                      size="sm"
                      className="mt-auto"
                    />
                  ) : null}

                  <ul className={cn('flex max-w-[75%] flex-col gap-1', mine && 'items-end')}>
                    {group.messages.map((message) => (
                      <li
                        key={message.id}
                        className={cn(
                          'rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                          mine
                            ? 'bg-brand-solid text-fg-on-solid'
                            : 'bg-surface-sunken text-fg',
                        )}
                      >
                        {message.body}
                      </li>
                    ))}
                    <li className="text-xs text-fg-subtle">
                      <RelativeTime value={group.messages[group.messages.length - 1].createdAt} />
                    </li>
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        className="flex flex-col gap-2 border-t border-border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        {/* 막지 않고 경고한다 — 오탐이 있을 수 있다 */}
        {risky ? (
          <Banner tone="danger">{t('message.safety')}</Banner>
        ) : null}

        <div className="flex items-end gap-2">
          <Textarea
            rows={2}
            value={body}
            disabled={disabled || pending}
            aria-label={t('message.placeholder')}
            placeholder={disabled ? t('message.disabled') : t('message.placeholder')}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            type="submit"
            loading={pending}
            disabled={disabled || body.trim().length === 0}
            iconStart={<Send className="size-4" />}
          >
            {t('message.send')}
          </Button>
        </div>
      </form>
    </section>
  );
}
