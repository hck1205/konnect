'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { Answer, CreateAnswerInput, UpdateAnswerInput } from '@/types';
import { questionKeys } from '../questions';
import {
  acceptAnswer,
  createAnswer,
  fetchAnswers,
  hideAnswer,
  unacceptAnswer,
  updateAnswer,
} from './answers.api';

/**
 * 답변 변경 훅.
 *
 * **답변은 자기 캐시 키를 갖지 않는다.** 답변 목록은 `questionKeys.answers(id)`
 * 아래에 있고, 채택은 질문(`acceptedAnswerId`)을 바꾼다. 그래서 무효화 대상이
 * 전부 질문 키다 — 답변용 키를 따로 만들면 두 계층이 서로를 모르게 되어
 * 채택 후 질문 상세가 갱신되지 않는다.
 */

/** 답변 수가 바뀌므로 목록도 함께 무효화한다 (`answered` 필터가 있다) */
function invalidateAround(
  client: ReturnType<typeof useQueryClient>,
  questionId: string,
) {
  void client.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
  void client.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
  void client.invalidateQueries({ queryKey: questionKeys.lists() });
}

/**
 * 답변 목록. 캐시 키는 **질문 아래**에 있다 — 질문을 지우면 함께 지워진다.
 *
 * `options.initialData` 로 서버에서 받아 온 값을 심을 수 있다 — 상세 페이지는
 * SSR 이어야 색인되는데, 그 데이터를 캐시에 넣어야 이후 변경이 화면에 반영된다.
 */
export function useAnswers(
  questionId: string,
  options?: Omit<UseQueryOptions<Answer[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: questionKeys.answers(questionId),
    queryFn: () => fetchAnswers(questionId),
    enabled: questionId.length > 0,
    ...options,
  });
}

export function useCreateAnswer(questionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAnswerInput) => createAnswer(questionId, input),
    onSuccess: () => invalidateAround(client, questionId),
  });
}

export function useAcceptAnswer(questionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (answerId: string) => acceptAnswer(questionId, answerId),
    onSuccess: (question) => {
      client.setQueryData(questionKeys.detail(questionId), question);
      void client.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useUnacceptAnswer(questionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => unacceptAnswer(questionId),
    onSuccess: (question) => {
      client.setQueryData(questionKeys.detail(questionId), question);
      void client.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useUpdateAnswer(questionId: string, answerId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAnswerInput) => updateAnswer(answerId, input),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: questionKeys.answers(questionId) }),
  });
}

/** 채택된 답변을 숨기면 질문의 `acceptedAnswerId` 도 풀린다 — 상세도 무효화한다 */
export function useHideAnswer(questionId: string, answerId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => hideAnswer(answerId),
    onSuccess: () => invalidateAround(client, questionId),
  });
}
