import type { PrismaService } from '../../../prisma/prisma.service';
import type { AnswerRecord } from '../entities/answer.entity';
import type { AnswersRepository } from './answers.repository';

/**
 * Prisma 답변 저장소.
 *
 * ⚠️ **아직 구현되지 않았다** — `PrismaQuestionsRepository` 와 같은 이유다.
 * 조용히 실패하지 않고 즉시 던진다.
 */
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(_record: AnswerRecord): Promise<AnswerRecord> {
    return Promise.reject(notImplemented());
  }

  findById(_id: string): Promise<AnswerRecord | null> {
    return Promise.reject(notImplemented());
  }

  listByQuestion(_questionId: string): Promise<AnswerRecord[]> {
    return Promise.reject(notImplemented());
  }

  update(
    _id: string,
    _patch: Partial<AnswerRecord>,
  ): Promise<AnswerRecord | null> {
    return Promise.reject(notImplemented());
  }
}

function notImplemented(): Error {
  return new Error(
    'PrismaAnswersRepository is not implemented yet — add the Answer model to prisma/schema.prisma first. Use DB_DRIVER=memory until then.',
  );
}
