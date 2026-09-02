import type { Question, QuestionFilter } from '@/types';
import { fetchQuestions } from './questions.api';

/** 척추/허브 한 판에 싣는 관련 질문 수 */
const SPINE_QUESTION_LIMIT = 10;

/**
 * **프리렌더 중에 죽지 않는** 질문 조회.
 *
 * ⚠️ 감싸지 않은 `fetchQuestions` 를 프리렌더 경로에서 부르면 CI 의 `next build`
 * 가 **통째로 죽는다.** `generateStaticParams` 가 48판을 빌드 시점에 만드는데
 * 러너에는 BE 가 없어 ECONNREFUSED 가 난다. 실제로 그렇게 죽었고, 로컬에서는
 * BE 가 떠 있어 화면이 200 으로 보였다 — **화면이 떠도 빌드는 죽을 수 있다.**
 *
 * 두 라우트 셸이 이걸 각자 갖고 있었다. 다음 척추 라우트를 만드는 사람은
 * 옆 파일을 보고 베끼거나, 안 베낀다. **안 베끼면 빌드가 죽는다** — 그런 종류의
 * 코드는 셸마다 두면 안 된다.
 *
 * 척추의 본체는 공식 출처다. 질문은 살이라 못 가져와도 페이지는 성립해야 한다
 * ("질문 0건에서도 성립한다" 가 척추의 존재 이유다).
 * 다만 **조용히 삼키지 않는다** — 서버 로그에 남겨야 "질문이 원래 없는 것" 과
 * "가져오기가 실패한 것" 을 구분할 수 있다.
 *
 * @param label 로그에 남길 이름. 어느 판이 실패했는지 알아야 한다
 */
export async function fetchSpineQuestions(
  label: string,
  filter: QuestionFilter,
): Promise<Question[]> {
  try {
    return (await fetchQuestions(filter, { limit: SPINE_QUESTION_LIMIT })).items;
  } catch (error) {
    console.error('[spine] fetchQuestions failed', { label, error });
    return [];
  }
}
