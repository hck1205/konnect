'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type {
  CreateQuestionInput,
  Page,
  PageParams,
  Question,
  QuestionFilter,
  UpdateQuestionInput,
} from '@/types';
import {
  createQuestion,
  fetchQuestion,
  fetchQuestions,
  hideQuestion,
  updateQuestion,
} from './questions.api';
import { questionKeys } from './questions.keys';

/**
 * 화면이 쓰는 것. **이 파일만 React 를 안다.**
 *
 * 훅은 얇게 유지한다 — 키와 호출을 잇는 것 말고 로직을 두지 않는다.
 * 로직이 생기면 `.api.ts`(순수 함수) 로 내려 테스트한다.
 */

type QueryOpts<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

export function useQuestions(
  filter?: QuestionFilter,
  page?: PageParams,
  options?: QueryOpts<Page<Question>>,
) {
  return useQuery({
    queryKey: questionKeys.list(filter, page),
    queryFn: () => fetchQuestions(filter, page),
    ...options,
  });
}

export function useQuestion(id: string, options?: QueryOpts<Question | null>) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => fetchQuestion(id),
    // 빈 id 로 라우팅되는 순간이 있다 — 그때 요청을 보내지 않는다
    enabled: id.length > 0,
    ...options,
  });
}

export function useCreateQuestion() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateQuestionInput) => createQuestion(input),
    // 새 글은 어떤 필터의 목록에도 들어갈 수 있다 — 목록 전체를 무효화한다
    onSuccess: () => client.invalidateQueries({ queryKey: questionKeys.lists() }),
  });
}

export function useUpdateQuestion(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateQuestionInput) => updateQuestion(id, input),
    onSuccess: (updated) => {
      // 상세는 응답으로 바로 갈아끼운다 — 왕복 한 번을 아낀다
      client.setQueryData(questionKeys.detail(id), updated);
      // 제목·태그가 바뀌면 목록 표시도 달라진다
      void client.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}

export function useHideQuestion(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => hideQuestion(id),
    onSuccess: (hidden) => {
      client.setQueryData(questionKeys.detail(id), hidden);
      void client.invalidateQueries({ queryKey: questionKeys.lists() });
    },
  });
}
