import { patchRecord } from '../../../common';
import type { AnswerRecord } from '../entities/answer.entity';
import type { AnswersRepository } from './answers.repository';

/** 인메모리 답변 저장소 — `DB_DRIVER` 미설정(테스트 포함)일 때 쓰인다 */
/**
 * patch 로 바뀌면 안 되는 필드.
 * `questionId` 도 포함한다 — 답변이 다른 질문으로 옮겨가면 채택 검증이 무너진다.
 */
const ANSWER_IMMUTABLE = ['id', 'questionId', 'authorId', 'createdAt'] as const;

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
      ...patchRecord(existing, patch, ANSWER_IMMUTABLE),
      updatedAt: new Date().toISOString(),
    };
    this.records.set(id, next);
    return Promise.resolve(next);
  }
}
