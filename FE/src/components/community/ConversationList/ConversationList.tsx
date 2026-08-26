'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { TruncatedText } from '@/components/data-display/TruncatedText';
import type { Conversation } from '@/types';

export interface ConversationListProps {
  conversations: readonly Conversation[];
  /** 현재 열린 대화 */
  activeId?: string;
  onSelect: (conversation: Conversation) => void;
  className?: string;
}

/**
 * 쪽지 대화 목록.
 *
 * 안 읽음 개수를 **숫자와 함께 텍스트로도** 알린다 — 배지 숫자만으로는
 * 스크린리더 사용자가 그게 무슨 숫자인지 알 수 없다.
 */
export function ConversationList({
  conversations,
  activeId,
  onSelect,
  className,
}: ConversationListProps) {
  const { t } = useI18n();

  if (conversations.length === 0) {
    return (
      <EmptyState
        className={className}
        title={t('message.empty')}
        description={t('message.emptyHint')}
      />
    );
  }

  return (
    <ul aria-label={t('message.title')} className={cn('flex flex-col', className)}>
      {conversations.map((conversation) => {
        const active = conversation.id === activeId;
        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'flex w-full cursor-pointer items-start gap-3 border-b border-border px-4 py-3 text-start',
                active ? 'bg-brand-subtle' : 'hover:bg-surface-sunken',
              )}
            >
              <Avatar
                name={conversation.participant.nickname}
                src={conversation.participant.avatarUrl}
                size="md"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm font-medium text-fg">
                    {conversation.participant.nickname}
                  </span>
                  {conversation.lastMessage ? (
                    <RelativeTime
                      value={conversation.lastMessage.createdAt}
                      className="ms-auto shrink-0 text-xs text-fg-subtle"
                    />
                  ) : null}
                </div>

                {conversation.lastMessage ? (
                  <TruncatedText lines={1} className="mt-0.5 text-sm text-fg-muted">
                    {conversation.lastMessage.body}
                  </TruncatedText>
                ) : null}
              </div>

              {conversation.unreadCount > 0 ? (
                <Badge tone="brand" className="mt-0.5 shrink-0">
                  <span aria-hidden="true">{conversation.unreadCount}</span>
                  <span className="sr-only">
                    {t('message.unread', { count: conversation.unreadCount })}
                  </span>
                </Badge>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
