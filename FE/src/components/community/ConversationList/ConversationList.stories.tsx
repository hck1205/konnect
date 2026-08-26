import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ConversationList } from './ConversationList';
import type { Conversation } from '@/components/community/MessageThread';

export default { title: 'Community / ConversationList' };

const LOADED_AT = Date.now();
const ago = (h: number) => new Date(LOADED_AT - h * 3600_000).toISOString();

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participant: { id: 'u1', nickname: 'Maria Santos' },
    lastMessage: { id: 'm', senderId: 'u1', body: 'That helps a lot, thank you.', createdAt: ago(2) },
    unreadCount: 2,
  },
  {
    id: 'c2',
    participant: { id: 'u2', nickname: '김민지' },
    lastMessage: {
      id: 'm',
      senderId: 'me',
      body: 'I will bring the certificate of admission and the bank statement.',
      createdAt: ago(20),
    },
    unreadCount: 0,
  },
  {
    id: 'c3',
    participant: { id: 'u3', nickname: 'Chen' },
    lastMessage: { id: 'm', senderId: 'u3', body: '고마워요!', createdAt: ago(72) },
    unreadCount: 0,
  },
];

/** 안 읽음 개수는 숫자와 **텍스트 양쪽**으로 알린다 — 배지 숫자만으로는 의미가 없다 */
export const WithUnread: Story = () => {
  const [active, setActive] = useState('c1');
  return (
    <div className="max-w-sm rounded-lg border border-border">
      <ConversationList
        conversations={CONVERSATIONS}
        activeId={active}
        onSelect={(c) => setActive(c.id)}
      />
    </div>
  );
};

export const Empty: Story = () => (
  <div className="max-w-sm">
    <ConversationList conversations={[]} onSelect={() => {}} />
  </div>
);
