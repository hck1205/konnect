'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { MessageHeader } from './MessageHeader';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { SafetyNotice } from './SafetyNotice';
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
 * 1:1 쪽지 대화 — 조립만 한다.
 *
 * ⚠️ **이 기능은 안전 장치가 전제다.** 타깃 사용자는 언어가 불편하고 현지 지원망이
 * 없으며 체류자격이 걸려 있어 신고를 주저한다 — 일반 커뮤니티보다 피해 가능성이
 * 높고 회복이 어렵다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md
 *
 * 안전 장치를 **각 하위 컴포넌트가 갖는다**: 고지는 `SafetyNotice`(닫기 없음),
 * 차단·신고는 `MessageHeader`, 민감정보 경고는 `MessageComposer`.
 * 이렇게 나눈 이유는 파일 길이가 아니라 **빠뜨릴 수 없게** 하기 위해서다 —
 * 각 장치가 자기 컴포넌트의 존재 이유라 지우면 컴포넌트가 빈다.
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
  const { t } = useI18n();

  return (
    <section
      aria-label={`${t('message.title')} — ${participant.nickname}`}
      className={cn('flex h-full flex-col', className)}
    >
      <MessageHeader participant={participant} onBlock={onBlock} onReport={onReport} />
      <SafetyNotice className="m-4" />
      <MessageList
        className="flex-1 overflow-y-auto px-4"
        messages={messages}
        participant={participant}
        currentUserId={currentUserId}
      />
      <MessageComposer onSend={onSend} disabled={disabled} />
    </section>
  );
}
