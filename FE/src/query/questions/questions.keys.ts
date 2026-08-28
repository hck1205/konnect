import type { PageParams, QuestionFilter } from '@/types';

/**
 * 캐시 키 — **한 곳에 모은다.**
 *
 * 답변을 달면 그 질문의 상세와 답변 목록만 무효화해야 하는데, 키를 화면마다
 * 문자열로 흩뿌리면 **오타 하나에 캐시가 안 지워진다.** 화면엔 새 답변이 안
 * 보이는데 새로고침하면 있는, 원인 찾기 나쁜 버그가 된다.
 *
 * 계층을 접두사로 둬서 `invalidateQueries({ queryKey: questionKeys.all })` 처럼
 * **위에서 한 번에** 지울 수 있게 한다.
 */
export const questionKeys = {
  all: ['questions'] as const,

  lists: () => [...questionKeys.all, 'list'] as const,
  /** 필터가 다르면 다른 캐시다 — 객체를 그대로 키에 넣는다(react-query 가 구조 비교한다) */
  list: (filter?: QuestionFilter, page?: PageParams) =>
    [...questionKeys.lists(), { filter: filter ?? {}, page: page ?? {} }] as const,

  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,

  /** 답변은 질문에 **종속**이다 — 질문 캐시를 지우면 답변도 함께 지워져야 한다 */
  answers: (questionId: string) =>
    [...questionKeys.detail(questionId), 'answers'] as const,
} as const;
