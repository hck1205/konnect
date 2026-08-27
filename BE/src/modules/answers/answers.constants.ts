/**
 * 답변 길이 제한.
 *
 * 최소 길이를 두는 이유: "저도 궁금해요" 같은 한 줄은 답변이 아니라 댓글이다.
 * 답변 목록이 그런 글로 채워지면 진짜 답을 찾기 어려워진다.
 */
export const ANSWER_BODY_MIN = 20;
export const ANSWER_BODY_MAX = 20_000;
