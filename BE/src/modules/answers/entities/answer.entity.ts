export type AnswerStatus = 'OPEN' | 'HIDDEN';

export interface AnswerRecord {
  id: string;
  questionId: string;
  authorId: string;
  authorNickname: string;
  body: string;
  status: AnswerStatus;
  createdAt: string;
  updatedAt: string;
}
