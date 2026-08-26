import type { AnswerRecord } from '../entities/answer.entity';
import type { AnswersRepository } from './answers.repository';

/** 인메모리 답변 저장소 — `DB_DRIVER` 미설정(테스트 포함)일 때 쓰인다 */
export class InMemoryAnswersRepository implements AnswersRepository {
  private readonly records = new Map<string, AnswerRecord>();

  create(record: AnswerRecord): Promise<AnswerRecord> {
    this.records.set(record.id, record);
    return Promise.resolve(record);
  }

  findById(id: string): Promise<AnswerRecord | null> {
    return Promise.resolve(this.records.get(id) ?? null);
  }

  listByQuestion(questionId: string): Promise<AnswerRecord[]> {
    return Promise.resolve(
      [...this.records.values()].filter((r) => r.questionId === questionId),
    );
  }

  update(
    id: string,
    patch: Partial<AnswerRecord>,
  ): Promise<AnswerRecord | null> {
    const existing = this.records.get(id);
    if (!existing) return Promise.resolve(null);

    const next: AnswerRecord = {
      ...existing,
      ...patch,
      id: existing.id,
      questionId: existing.questionId,
      authorId: existing.authorId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(id, next);
    return Promise.resolve(next);
  }
}
