import { httpClient, unwrap, orNull, type ApiEnvelope } from '../client';
import type {
  CreateQuestionInput,
  Page,
  PageParams,
  Question,
  QuestionFilter,
  UpdateQuestionInput,
} from '@/types';

/**
 * 질문 API — **HTTP 를 아는 유일한 곳**이다.
 *
 * URL·봉투(`{data,timestamp}`)·상태코드는 여기서 끝난다. 화면과 훅은
 * `httpClient` 를 모른다 — BE 가 경로를 바꿔도 고칠 곳이 이 파일 하나다.
 *
 * React 를 import 하지 않는다. 그래야 통합 테스트가 node 에서 그대로 부를 수 있다
 * (`questions.integration.test.ts`).
 */

/**
 * 목록 쿼리 문자열.
 *
 * ⚠️ **배열을 axios 기본 직렬화에 맡기면 안 된다.** 기본값은 `tags[]=a&tags[]=b` 로
 * 나가는데 BE 는 `tags` 키를 읽으므로 **필터가 조용히 빠진다.**
 * BE 가 쉼표 구분(`?tags=a,b`)을 받으므로 그 형태로 고정한다.
 *
 * `answered` 는 BE 가 `IsBooleanString` 으로 받는다 → 문자열로 보낸다.
 */
export function buildListParams(
  filter: QuestionFilter = {},
  page: PageParams = {},
): Record<string, string> {
  const params: Record<string, string> = {};

  if (page.cursor) params.cursor = page.cursor;
  if (page.limit !== undefined) params.limit = String(page.limit);

  if (filter.topic) params.topic = filter.topic;
  // 게시판의 두 번째 축. topic 과 함께 걸리면 topic × type 이다
  if (filter.type) params.type = filter.type;
  if (filter.tags?.length) params.tags = filter.tags.join(',');
  // OR 축. tags(AND) 와 다른 키라 둘을 함께 보낼 수 있다
  if (filter.anyTags?.length) params.anyTags = filter.anyTags.join(',');

  // 공백만 있는 검색어는 필터 없음으로 수렴한다 (BE 도 트림한다)
  const q = filter.q?.trim();
  if (q) params.q = q;

  if (filter.answered !== undefined) params.answered = String(filter.answered);

  return params;
}

export async function fetchQuestions(
  filter?: QuestionFilter,
  page?: PageParams,
): Promise<Page<Question>> {
  const response = await httpClient.get<ApiEnvelope<Page<Question>>>('/questions', {
    params: buildListParams(filter, page),
  });
  return unwrap(response);
}

/** 없는 질문은 예외가 아니라 `null` 이다 — 화면의 notFound 분기로 간다 */
export async function fetchQuestion(id: string): Promise<Question | null> {
  return orNull(
    httpClient
      .get<ApiEnvelope<Question>>(`/questions/${id}`)
      .then(unwrap),
  );
}

export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  return unwrap(
    await httpClient.post<ApiEnvelope<Question>>('/questions', input),
  );
}

export async function updateQuestion(
  id: string,
  input: UpdateQuestionInput,
): Promise<Question> {
  return unwrap(
    await httpClient.patch<ApiEnvelope<Question>>(`/questions/${id}`, input),
  );
}

/** 물리 삭제가 아니라 숨김이다 — 링크와 답변의 맥락을 남긴다 */
export async function hideQuestion(id: string): Promise<Question> {
  return unwrap(await httpClient.delete<ApiEnvelope<Question>>(`/questions/${id}`));
}
