import { httpClient, unwrap, type ApiEnvelope } from '../client';
import type { Answer, CreateAnswerInput, Question, UpdateAnswerInput } from '@/types';

/**
 * 답변 API.
 *
 * 경로가 두 갈래인 것이 BE 설계 그대로다:
 * - **생성·채택**은 질문 아래(`/questions/:id/answers`) — 질문에 종속된 행위다
 * - **수정·숨김**은 답변 자체(`/answers/:id`) — 질문을 몰라도 되는 행위다
 *
 * 채택은 **질문 작성자**의 권한이고 수정·숨김은 **답변 작성자**의 권한이다.
 * 경로가 다른 이유가 그것이다.
 */

/**
 * 질문의 답변 전체.
 *
 * ⚠️ **페이지가 아니라 배열이다.** 질문 하나의 답변 수는 한정적이고,
 * 채택된 답변이 맨 위에 와야 하므로 BE 가 정렬해서 통째로 준다 —
 * 커서로 잘라 주면 채택 답변이 다음 페이지에 있을 수 있다.
 *
 * (`Page<Answer>` 로 짐작했다가 통합 테스트에서 `items` 가 undefined 로 잡혔다.)
 */
export async function fetchAnswers(questionId: string): Promise<Answer[]> {
  return unwrap(
    await httpClient.get<ApiEnvelope<Answer[]>>(`/questions/${questionId}/answers`),
  );
}

export async function createAnswer(
  questionId: string,
  input: CreateAnswerInput,
): Promise<Answer> {
  return unwrap(
    await httpClient.post<ApiEnvelope<Answer>>(
      `/questions/${questionId}/answers`,
      input,
    ),
  );
}

/** 채택 — 질문이 바뀐다(`acceptedAnswerId`), 답변이 아니라 */
export async function acceptAnswer(
  questionId: string,
  answerId: string,
): Promise<Question> {
  return unwrap(
    await httpClient.post<ApiEnvelope<Question>>(
      `/questions/${questionId}/answers/${answerId}/accept`,
      {},
    ),
  );
}

export async function unacceptAnswer(questionId: string): Promise<Question> {
  return unwrap(
    await httpClient.delete<ApiEnvelope<Question>>(
      `/questions/${questionId}/answers/accepted`,
    ),
  );
}

export async function updateAnswer(
  id: string,
  input: UpdateAnswerInput,
): Promise<Answer> {
  return unwrap(await httpClient.patch<ApiEnvelope<Answer>>(`/answers/${id}`, input));
}

/** 숨김이다. 채택된 답변을 숨기면 BE 가 채택도 함께 푼다 */
export async function hideAnswer(id: string): Promise<Answer> {
  return unwrap(await httpClient.delete<ApiEnvelope<Answer>>(`/answers/${id}`));
}
