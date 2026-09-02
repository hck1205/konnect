/**
 * 공유 도메인 모델.
 *
 * **컴포넌트가 아니라 여기가 소유한다.** 서버 통신 계층(`query/`)과 화면(`views/`)이
 * 같은 타입을 봐야 하는데, 컴포넌트 안에 두면 API 코드가 UI 를 import 하게 된다
 * (의존 방향이 뒤집힌다).
 *
 * UI 전용 타입(Size, Tone)은 `ui.ts`, 이모지·라벨 같은 표현은 컴포넌트가 갖는다.
 */
export type { Size, Tone, StatusTone } from './ui';
export type { UserSummary } from './user';
export { REACTION_KINDS } from './reaction';
export type { ReactionKind, ReactionCounts } from './reaction';
export type { Comment, CommentNode } from './comment';
export type { DirectMessage, Conversation } from './message';
export type { ReportReason, ReportTrack, ReportSubmission } from './report';
export type { PostDraft } from './post';

// ── BE 와 모양을 맞춰야 하는 것 (contracts/ 가 고정 어휘를 강제한다)
export { TAG_NAMESPACES } from './tag';
export type { TagNamespace, ParsedTag } from './tag';

export { TOPICS, POST_TYPES } from './question';
export type {
  Topic,
  PostType,
  QuestionStatus,
  Question,
  QuestionFilter,
  CreateQuestionInput,
  UpdateQuestionInput,
} from './question';
export type {
  AnswerStatus,
  Answer,
  CreateAnswerInput,
  UpdateAnswerInput,
} from './answer';
export type { Page, PageParams } from './page';
export type { AuthResult, CurrentUser } from './auth';
