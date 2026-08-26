import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { Divider } from '@/components/primitives/Divider';
import { EmptyState } from '@/components/feedback/EmptyState';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { groupMessages } from '../MessageThread.utils';
import type { DirectMessage, MessageParticipant } from '../MessageThread.types';

export interface MessageListProps {
  messages: readonly DirectMessage[];
  participant: MessageParticipant;
  currentUserId: string;
  className?: string;
}

/**
 * 메시지 목록 — 묶기와 날짜 구분선.
 *
 * 연속된 같은 사람의 메시지를 묶어 아바타·이름 반복을 없앤다(→ `groupMessages`).
 * 날짜가 바뀌면 구분선을 넣는다 — 대화가 며칠에 걸쳐 이어지는 서비스라
 * "언제 한 말인지"가 실제로 중요하다.
 */
export function MessageList({
  messages,
  participant,
  currentUserId,
  className,
}: MessageListProps) {
  const { t, formatDate } = useI18n();
  const groups = groupMessages(messages);

  if (groups.length === 0) {
    return (
      <div className={className}>
        <EmptyState title={t('message.conversationEmpty')} />
      </div>
    );
  }

  return (
    <div className={className}>
      {groups.map((group, i) => {
        const mine = group.senderId === currentUserId;
        const showDate = i === 0 || groups[i - 1].date !== group.date;
        const last = group.messages[group.messages.length - 1];

        return (
          <div key={`${group.date}-${group.senderId}-${i}`}>
            {showDate ? (
              <Divider label={formatDate(group.date, { dateStyle: 'medium' })} className="my-4" />
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
                      mine ? 'bg-brand-solid text-fg-on-solid' : 'bg-surface-sunken text-fg',
                    )}
                  >
                    {message.body}
                  </li>
                ))}
                <li className="text-xs text-fg-subtle">
                  <RelativeTime value={last.createdAt} />
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
