import type { QuestionListFilter } from './repositories/questions.repository';
import type { QuestionRecord } from './entities/question.entity';

/**
 * 목록 필터 적용 — 순수 함수.
 *
 * 인메모리 저장소가 쓰지만, **여기 있는 것이 규칙의 정의**다.
 * Prisma 저장소는 같은 의미를 SQL 로 옮겨야 하고, 이 테스트가 그 기준이 된다.
 */
export function matchesFilter(
  record: QuestionRecord,
  filter: QuestionListFilter,
): boolean {
  // 숨김 글은 목록에 나오지 않는다 — 상세는 직접 접근 시 정책에 따라 다르다
  if (record.status !== 'OPEN') return false;

  if (filter.topic && record.topic !== filter.topic) return false;
  if (filter.authorId && record.authorId !== filter.authorId) return false;

  // 태그는 AND — OR 이면 태그를 더할수록 결과가 넓어져 필터의 의미가 없다
  if (filter.tags?.length) {
    const owned = new Set(record.tags);
    if (!filter.tags.every((tag) => owned.has(tag))) return false;
  }

  if (filter.answered !== undefined) {
    const hasAnswer = record.answerCount > 0;
    if (hasAnswer !== filter.answered) return false;
  }

  if (filter.query) {
    const haystack = `${record.title}\n${record.body}\n${record.tags.join(' ')}`;
    if (!haystack.toLowerCase().includes(filter.query.toLowerCase()))
      return false;
  }

  return true;
}

/**
 * 최신순 정렬 — id 가 UUIDv7(시간정렬)이라 **id 역순 = 최신순**이다.
 *
 * createdAt 문자열로 정렬하지 않는 이유: 같은 밀리초에 만들어진 두 글의 순서가
 * 불안정해지고, 그러면 키셋 페이지네이션이 항목을 건너뛰거나 반복한다.
 */
export function sortNewestFirst(
  records: readonly QuestionRecord[],
): QuestionRecord[] {
  return [...records].sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
}
