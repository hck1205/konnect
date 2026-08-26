import type { AnswerRecord } from './entities/answer.entity';

/**
 * 답변 정렬 — **채택된 것이 맨 위**, 나머지는 오래된 순.
 *
 * 최신순이 아닌 이유: 답변은 대화가 아니라 후보다. 먼저 달린 답에 후속 논의가
 * 붙는 경우가 많아 시간순이 읽기 자연스럽다.
 *
 * id 로 정렬한다(UUIDv7 = 시간정렬) — createdAt 문자열은 같은 밀리초에서
 * 순서가 불안정하다.
 */
export function sortAnswers(
  answers: readonly AnswerRecord[],
  acceptedAnswerId: string | null,
): AnswerRecord[] {
  return [...answers].sort((a, b) => {
    if (a.id === acceptedAnswerId) return -1;
    if (b.id === acceptedAnswerId) return 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

/** 목록에 보일 답변만 — 숨김은 작성자에게만 보인다 */
export function visibleAnswers(
  answers: readonly AnswerRecord[],
  viewerId?: string,
): AnswerRecord[] {
  return answers.filter((a) => a.status === 'OPEN' || a.authorId === viewerId);
}
