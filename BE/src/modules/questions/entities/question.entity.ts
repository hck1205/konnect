/**
 * 주제 — [10-domain](docs/10-domain/) 의 6영역과 대응한다.
 * 태그와 달리 **하나만** 고르고 필수다. 목록의 1차 분류다.
 */
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
 * 공개 상태.
 *
 * `HIDDEN` 이 있고 물리 삭제가 없는 이유: 답변이 달린 질문을 지우면 **링크가 죽고**
 * 그 답변들이 무엇에 대한 답인지 알 수 없게 된다. 검색 유입이 주 채널이라
 * 죽은 링크는 그대로 손실이다.
 * → docs/20-product/10-features/02-qna.md
 */
export type QuestionStatus = 'OPEN' | 'HIDDEN';

export interface QuestionRecord {
  id: string;
  authorId: string;
  authorNickname: string;
  title: string;
  body: string;
  topic: Topic;
  /** 정규화된 태그 목록 */
  tags: string[];
  /** 채택된 답변 id. 질문 작성자만 고를 수 있고 하나뿐이다. */
  acceptedAnswerId: string | null;
  status: QuestionStatus;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
}
