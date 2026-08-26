import type { Page, PageQuery } from '../../../common';
import type { QuestionRecord, Topic } from '../entities/question.entity';

export const QUESTIONS_REPOSITORY = Symbol('QUESTIONS_REPOSITORY');

export interface QuestionListFilter extends PageQuery {
  topic?: Topic;
  /** 이 태그를 **모두** 가진 질문 (AND). OR 이면 필터가 넓어져 쓸모가 없다. */
  tags?: string[];
  /** 정규화된 검색어. null 이면 필터 없음. */
  query?: string | null;
  /** 답변 유무 필터 — "아직 답 없는 질문"을 찾는 답변자용 */
  answered?: boolean;
  authorId?: string;
}

export interface QuestionsRepository {
  create(record: QuestionRecord): Promise<QuestionRecord>;
  findById(id: string): Promise<QuestionRecord | null>;
  list(filter: QuestionListFilter): Promise<Page<QuestionRecord>>;
  update(
    id: string,
    patch: Partial<QuestionRecord>,
  ): Promise<QuestionRecord | null>;
}
