/**
 * 질문 — BE `QuestionRecord` 와 **같은 모양이어야 한다.**
 *
 * 갈라지면 화면에서 `undefined` 로 터진다. 타입은 컴파일 타임에만 존재해
 * 런타임 응답을 검사하지 않으므로, 고정 어휘(`TOPICS`)만이라도
 * [`contracts/`](../../../contracts/README.md) 로 강제한다.
 * 나머지 필드는 통합 테스트(`*.integration.test.ts`)가 실제 응답으로 확인한다.
 */

/** 주제 — 태그와 달리 **하나만** 고르고 필수다. 목록의 1차 분류다. */
export const TOPICS = [
  'visa',
  'language',
  'education',
  'housing',
  'work',
  'social',
] as const;
export type Topic = (typeof TOPICS)[number];

/**
 * 공개 상태. **물리 삭제가 없다** — 답변이 달린 질문을 지우면 링크가 죽고
 * 그 답변이 무엇에 대한 답인지 알 수 없게 된다.
 */
export type QuestionStatus = 'OPEN' | 'HIDDEN';

export interface Question {
  id: string;
  authorId: string;
  authorNickname: string;
  title: string;
  body: string;
  topic: Topic;
  /** 정규화된 태그 (`visa:f-2`) — 표시 형태로 저장하지 않는다 */
  tags: string[];
  /** 채택된 답변 id. 질문 작성자만 고를 수 있고 하나뿐이다 */
  acceptedAnswerId: string | null;
  status: QuestionStatus;
  answerCount: number;
  /** ISO 8601 UTC. 표시할 때만 브라우저 시간대로 옮긴다 */
  createdAt: string;
  updatedAt: string;
}

/** 목록 필터 — 전부 선택이다. 아무것도 없으면 최신순 전체다. */
export interface QuestionFilter {
  topic?: Topic;
  /** 정규화된 태그. **AND** 로 걸린다 */
  tags?: string[];
  /** 검색어 */
  q?: string;
  /** 답변이 있는 것만 / 없는 것만 */
  answered?: boolean;
}

export interface CreateQuestionInput {
  title: string;
  body: string;
  topic: Topic;
  tags?: string[];
}

/** 수정 — 보내는 필드만 바뀐다. `topic` 은 바꿀 수 있고 작성자는 못 바꾼다 */
export type UpdateQuestionInput = Partial<CreateQuestionInput>;
