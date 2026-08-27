import type { Page } from '../../../common';
import { paginateByCursor, patchRecord } from '../../../common';
import type { QuestionRecord } from '../entities/question.entity';
import { matchesFilter, sortNewestFirst } from '../questions.utils';
import type {
  QuestionListFilter,
  QuestionsRepository,
} from './questions.repository';

/**
 * 인메모리 질문 저장소.
 *
 * `DB_DRIVER` 미설정(테스트 포함)일 때 쓰인다 — **DB 없이 전체 흐름이 돌아간다**.
 * 필터·정렬 규칙은 `questions.utils` 의 순수 함수를 쓴다: Prisma 구현이
 * 같은 의미를 SQL 로 옮길 때 그 함수의 테스트가 기준이 된다.
 */
/** patch 로 바뀌면 안 되는 필드 — authorId 가 빠지면 소유권이 넘어간다 */
const QUESTION_IMMUTABLE = ['id', 'authorId', 'createdAt'] as const;

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private readonly records = new Map<string, QuestionRecord>();

  create(record: QuestionRecord): Promise<QuestionRecord> {
    this.records.set(record.id, record);
    return Promise.resolve(record);
  }

  findById(id: string): Promise<QuestionRecord | null> {
    return Promise.resolve(this.records.get(id) ?? null);
  }

  list(filter: QuestionListFilter): Promise<Page<QuestionRecord>> {
    const matched = [...this.records.values()].filter((r) =>
      matchesFilter(r, filter),
    );
    return Promise.resolve(paginateByCursor(sortNewestFirst(matched), filter));
  }

  update(
    id: string,
    patch: Partial<QuestionRecord>,
  ): Promise<QuestionRecord | null> {
    const existing = this.records.get(id);
    if (!existing) return Promise.resolve(null);

    // 불변 필드는 patchRecord 가 지킨다 — 손으로 나열하면 언젠가 하나를 빠뜨린다
    const next: QuestionRecord = {
      ...patchRecord(existing, patch, QUESTION_IMMUTABLE),
      updatedAt: new Date().toISOString(),
    };
    this.records.set(id, next);
    return Promise.resolve(next);
  }
}
