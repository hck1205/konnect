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
 * 글의 종류 — 글쓴이가 **무엇을 하려는가**.
 *
 * `Topic`(무엇에 대한 글인가)과 다른 축이고, 게시판은 둘의 곱이다
 * (`/ko/visa?type=review`). 형식(Guide·Checklist)이 아니라 의도로 자른 이유는
 * 이 제품에 **전문가가 없기** 때문이다 — 권위 있는 안내 형식을 열면
 * 틀린 해석이 '가이드'라는 이름을 달고 쌓인다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * 지금 작성 폼이 있는 것은 `question` 뿐이다. 나머지 셋은 값만 있고 만들 경로가
 * 없다 — 미리 둔 이유는 나중에 열 때 마이그레이션을 한 번 더 하지 않기 위해서다.
 */
export const POST_TYPES = ['question', 'review', 'share', 'recruit'] as const;
export type PostType = (typeof POST_TYPES)[number];

/** 작성 폼이 아직 없는 종류를 막는다 — 값이 있다고 만들 수 있는 것은 아니다. */
export const CREATABLE_POST_TYPES = ['question'] as const;

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
  type: PostType;
  /** 정규화된 태그 목록 */
  tags: string[];
  /** 채택된 답변 id. 질문 작성자만 고를 수 있고 하나뿐이다. */
  acceptedAnswerId: string | null;
  status: QuestionStatus;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
}
