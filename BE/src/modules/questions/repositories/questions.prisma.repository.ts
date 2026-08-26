import type { PrismaService } from '../../../prisma/prisma.service';
import type { Page } from '../../../common';
import type { QuestionRecord } from '../entities/question.entity';
import type {
  QuestionListFilter,
  QuestionsRepository,
} from './questions.repository';

/**
 * Prisma 질문 저장소.
 *
 * ⚠️ **아직 구현되지 않았다.** 스키마에 모델이 없어서다
 * (→ `prisma/schema.prisma`). `DB_DRIVER=prisma` 로 두면 여기서 즉시 던진다 —
 * 조용히 빈 배열을 돌려주면 "DB 연결은 됐는데 글이 안 보인다"로 오해하게 된다.
 *
 * 인메모리 구현이 계약의 정의이고, 필터·정렬 의미는 `questions.utils` 의
 * 순수 함수와 그 테스트가 기준이다. SQL 로 옮길 때 그 테스트를 통과시켜야 한다.
 */
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(_record: QuestionRecord): Promise<QuestionRecord> {
    return Promise.reject(notImplemented());
  }

  findById(_id: string): Promise<QuestionRecord | null> {
    return Promise.reject(notImplemented());
  }

  list(_filter: QuestionListFilter): Promise<Page<QuestionRecord>> {
    return Promise.reject(notImplemented());
  }

  update(
    _id: string,
    _patch: Partial<QuestionRecord>,
  ): Promise<QuestionRecord | null> {
    return Promise.reject(notImplemented());
  }
}

function notImplemented(): Error {
  return new Error(
    'PrismaQuestionsRepository is not implemented yet — add the Question model to prisma/schema.prisma first. Use DB_DRIVER=memory until then.',
  );
}
