/**
 * 쪽지 도메인 타입은 `types/message` 가 소유한다.
 * `ConversationList` 가 `MessageThread` 에서 타입을 가져오던 의존 역전을 없앤다.
 */
export type {
  DirectMessage,
  Conversation,
  UserSummary as MessageParticipant,
} from '@/types';
