/**
 * 질문 — BE `QuestionRecord` 와 **같은 모양이어야 한다.**
 *
 * 갈라지면 화면에서 `undefined` 로 터진다. 타입은 컴파일 타임에만 존재해
 * 런타임 응답을 검사하지 않으므로, 고정 어휘(`TOPICS`)만이라도
 * [`contracts/`](../../../contracts/README.md) 로 강제한다.
 * 나머지 필드는 통합 테스트(`*.integration.test.ts`)가 실제 응답으로 확인한다.
 */

/**
 * 주제 — 태그와 달리 **하나만** 고르고 필수다. 목록의 1차 분류이자 게시판의 축이다.
 *
 * `visa` 가 없는 것은 누락이 아니다 — 비자는 카테고리가 아니라 **축**이라 `visa:` 태그로만
 * 존재한다. `education` 이 없는 것도 결정이다(재학 중은 비타깃).
 * → docs/50-decisions/0012-topic-vocabulary.md
 */
export const TOPICS = [
  'residency',
  'work',
  'housing',
  'admin',
  'language',
  'social',
] as const;
export type Topic = (typeof TOPICS)[number];

/**
 * URL 세그먼트 → `Topic`. 모르는 값이면 `undefined`.
 *
 * 라우트 셸이 각자 갖고 있었다. 그런데 이건 **어휘에 대한 규칙**이지 라우팅이 아니다 —
 * 어휘 옆에 둬야 `TOPICS` 를 고칠 때 같이 보이고, 테스트가 닿는다.
 * `findVisaSpine` 이 데이터 옆에 사는 것과 같은 이유다.
 *
 * 좁히는 방식이 `includes` + 캐스트인 것은 `as const` 배열에서
 * `Array.includes` 가 `string` 을 받지 못하기 때문이다. 캐스트가 있으므로
 * 그 자리에 테스트를 둔다 — 이 저장소가 `topic` enum 매퍼에서 쓰는 원칙이다.
 */
export const isTopic = (raw: string): raw is Topic =>
  (TOPICS as readonly string[]).includes(raw);

/**
 * 글의 종류 — 글쓴이가 **무엇을 하려는가**. `Topic`(무엇에 대한 글인가)과 다른 축이고,
 * 게시판은 둘의 곱이다(`/ko/visa?type=review`).
 *
 * 형식(Guide·Checklist)이 아니라 의도로 자른 이유는 이 제품에 **전문가가 없기**
 * 때문이다 — 권위 있는 안내 형식을 열면 틀린 해석이 '가이드'라는 이름을 달고 쌓인다.
 *
 * 지금 작성 폼이 있는 것은 `question` 뿐이다. 나머지는 필터로만 쓰인다.
 */
export const POST_TYPES = ['question', 'review', 'share', 'recruit'] as const;
export type PostType = (typeof POST_TYPES)[number];

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
  type: PostType;
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
  /** 게시판의 두 번째 축. topic 과 함께 걸리면 `topic × type` 이 된다 */
  type?: PostType;
  /** 정규화된 태그. **AND** 로 걸린다 */
  tags?: string[];
  /**
   * 이 중 **하나라도** 가진 글 (OR). `tags`(AND) 와 함께 걸면 교집합이다.
   *
   * 여러 값을 하나로 묶어 보는 화면이 쓴다 — 관련 비자 묶음, 언어권, 별칭이 여럿인 태그.
   * AND 만으로는 표현 자체가 불가능하다.
   */
  anyTags?: string[];
  /** 검색어 */
  q?: string;
  /** 답변이 있는 것만 / 없는 것만 */
  answered?: boolean;
}

export interface CreateQuestionInput {
  title: string;
  body: string;
  topic: Topic;
  /** 생략하면 `question`. BE 는 지금 이 값만 받는다 — 작성 폼이 그것뿐이다 */
  type?: PostType;
  tags?: string[];
}

/**
 * 수정 — 보내는 필드만 바뀐다. `topic` 은 바꿀 수 있고 작성자는 못 바꾼다.
 *
 * `type` 도 못 바꾼다. 종류를 바꾸면 읽을 화면이 없는 글이 생기고, 질문에 붙어 있던
 * 채택·답변 수가 갈 곳을 잃는다 — BE 의 `UpdateQuestionDto` 와 같은 이유다.
 */
export type UpdateQuestionInput = Partial<
  Omit<CreateQuestionInput, 'type'>
>;
