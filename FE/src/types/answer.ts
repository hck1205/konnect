/**
 * 답변 — BE `AnswerRecord` 와 같은 모양이어야 한다.
 * → `types/question.ts` 의 같은 주의
 */
export type AnswerStatus = 'OPEN' | 'HIDDEN';

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorNickname: string;
  body: string;
  status: AnswerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnswerInput {
  body: string;
}

export type UpdateAnswerInput = CreateAnswerInput;
