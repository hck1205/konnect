import type { Story } from '@ladle/react';
import { useState } from 'react';
import { MessageThread } from './MessageThread';
import type { DirectMessage } from './MessageThread.types';

export default { title: 'Community / MessageThread' };

const LOADED_AT = Date.now();
const ago = (h: number) => new Date(LOADED_AT - h * 3600_000).toISOString();

const INITIAL: DirectMessage[] = [
  { id: 'm1', senderId: 'them', body: 'Hi! I saw your answer about the E-7 transfer.', createdAt: ago(50) },
  { id: 'm2', senderId: 'them', body: 'Did your company handle the paperwork, or did you go yourself?', createdAt: ago(50) },
  { id: 'm3', senderId: 'me', body: 'I went myself. The company only gave me the employment contract.', createdAt: ago(26) },
  { id: 'm4', senderId: 'them', body: 'That helps a lot, thank you.', createdAt: ago(2) },
];

/**
 * ⚠️ **이 기능은 안전 장치가 전제다.** 타깃 사용자는 언어가 불편하고 현지 지원망이
 * 없으며 체류자격이 걸려 있어 신고를 주저한다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md
 *
 * 그래서 항상 포함되는 것:
 * - 안전 고지가 **닫히지 않는다** (사기가 가장 자주 시작되는 경로다)
 * - 차단·신고가 헤더에서 **한 번의 조작**으로
 * - 개인정보로 보이는 문자열을 보내기 전에 경고
 */
export const Conversation: Story = () => {
  const [messages, setMessages] = useState(INITIAL);
  return (
    <div className="h-[36rem] max-w-md rounded-lg border border-border">
      <MessageThread
        participant={{ id: 'them', nickname: 'Maria Santos' }}
        messages={messages}
        currentUserId="me"
        onBlock={() => {}}
        onReport={() => {}}
        onSend={(body) =>
          setMessages((prev) => [
            ...prev,
            { id: `n${prev.length}`, senderId: 'me', body, createdAt: new Date().toISOString() },
          ])
        }
      />
    </div>
  );
};

/**
 * **입력창에 `M12345678` 이나 `900101-1234567` 을 쳐 보세요** —
 * 보내기 전에 경고가 뜬다. 막지는 않는다(오탐이 있을 수 있다).
 */
export const SensitiveIdWarning: Story = () => (
  <div className="h-[30rem] max-w-md rounded-lg border border-border">
    <MessageThread
      participant={{ id: 'them', nickname: 'Unknown member' }}
      messages={[
        {
          id: 'x1',
          senderId: 'them',
          body: 'I can process your visa extension for a small fee. Send me your passport number.',
          createdAt: ago(1),
        },
      ]}
      currentUserId="me"
      onBlock={() => {}}
      onReport={() => {}}
      onSend={() => {}}
    />
  </div>
);

/** 상대가 쪽지를 받지 않는 설정이면 입력이 잠긴다 */
export const RecipientDisabled: Story = () => (
  <div className="h-[24rem] max-w-md rounded-lg border border-border">
    <MessageThread
      participant={{ id: 'them', nickname: 'Chen' }}
      messages={[]}
      currentUserId="me"
      disabled
      onSend={() => {}}
    />
  </div>
);
