export interface MessageParticipant {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  /** 상대가 읽은 시각. null 이면 안 읽음. */
  readAt?: string | null;
}

export interface Conversation {
  id: string;
  /** 나를 제외한 상대 — 1:1 이므로 한 명이다 */
  participant: MessageParticipant;
  lastMessage?: DirectMessage;
  unreadCount: number;
}
