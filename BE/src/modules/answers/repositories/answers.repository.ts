import type { AnswerRecord } from '../entities/answer.entity';

export const ANSWERS_REPOSITORY = Symbol('ANSWERS_REPOSITORY');

export interface AnswersRepository {
  create(record: AnswerRecord): Promise<AnswerRecord>;
  findById(id: string): Promise<AnswerRecord | null>;
  /**
   * 한 질문의 답변 전부.
   *
   * **페이지네이션하지 않는다.** 답변은 질문당 수십 건을 넘는 일이 드물고,
   * 채택 답변을 맨 위로 올리려면 어차피 전체를 봐야 한다.
   * 수백 건이 되는 질문이 생기면 그때 다시 본다.
   */
  listByQuestion(questionId: string): Promise<AnswerRecord[]>;
  update(
    id: string,
    patch: Partial<AnswerRecord>,
  ): Promise<AnswerRecord | null>;
}
