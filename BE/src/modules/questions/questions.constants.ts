/**
 * 질문 길이 제한.
 *
 * create 와 update DTO 가 **같은 값을 각자** 갖고 있었다 — 한쪽만 고치면
 * "새로 쓸 때는 되는데 수정하면 400" 같은 어긋남이 생긴다.
 *
 * 답변과 값이 같더라도 공유하지 않는다: 우연히 같을 뿐이고, 질문 본문 상한을
 * 바꾼다고 답변 상한이 따라 바뀌어야 하는 것은 아니다.
 */
export const QUESTION_TITLE_MIN = 10;
export const QUESTION_TITLE_MAX = 200;

export const QUESTION_BODY_MIN = 20;
export const QUESTION_BODY_MAX = 20_000;
