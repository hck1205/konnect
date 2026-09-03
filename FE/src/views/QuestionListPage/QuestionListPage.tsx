import { QuestionListView } from './QuestionListView';
import type { Question, Topic } from '@/types';

/**
 * 질문 목록 — business 레이어.
 * 데이터는 서버 컴포넌트가 이미 받아 왔다. 여기서는 화면에 넘기기만 한다.
 */
export function QuestionListPage(props: {
  questions: Question[];
  /** 데이터를 못 가져왔는지. `questions` 가 비어 있는 것과 **다른 상태**다 */
  unavailable?: boolean;
  topic?: Topic;
  nextCursor: string | null;
  pathname: string;
}) {
  return <QuestionListView {...props} />;
}
