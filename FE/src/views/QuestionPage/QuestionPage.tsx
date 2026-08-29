'use client';

import { useQuestion } from '@/query/questions';
import { useAnswers } from '@/query/answers';
import type { Answer, Question } from '@/types';
import { QuestionView } from './QuestionView';

export interface QuestionPageProps {
  /** 서버에서 받아 온 데이터 — **HTML 에 본문이 실려야 색인된다** */
  question: Question;
  answers: Answer[];
  pathname: string;
}

/**
 * 질문 상세 — business 레이어.
 *
 * 서버가 받아 온 데이터를 **`initialData` 로 캐시에 심는다.** 그래서:
 * - 첫 HTML 에 본문이 그대로 실린다(SEO)
 * - 동시에 react-query 캐시에 들어가므로 답변 작성·채택 같은 변경이
 *   **같은 캐시를 무효화**해 화면이 갱신된다
 *
 * 서버 데이터를 그냥 props 로만 넘기면 두 번째가 안 된다 — 변경 후에도
 * 화면이 그대로다.
 */
export function QuestionPage({ question, answers, pathname }: QuestionPageProps) {
  const { data: live } = useQuestion(question.id, { initialData: question });
  const { data: liveAnswers } = useAnswers(question.id, { initialData: answers });

  return (
    <QuestionView
      question={live ?? question}
      answers={liveAnswers ?? answers}
      pathname={pathname}
    />
  );
}
