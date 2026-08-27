import { ForbiddenException, NotFoundException } from '@nestjs/common';

/**
 * 존재 + 소유 확인.
 *
 * 질문과 답변이 **글자 하나 다른 같은 코드**를 각자 갖고 있었다.
 * 앞으로 댓글·신고가 추가되면 네 벌이 된다 — 그중 하나에서 `!==` 를 `===` 로
 * 잘못 쓰면 남의 글을 고칠 수 있게 되는데, 그런 실수는 리뷰에서 눈에 잘 안 띈다.
 *
 * **없으면 404, 남의 것이면 403** 이다. 404 로 통일하지 않는 이유:
 * 작성자에게는 "권한이 없다"가 실제로 다른 정보이고(로그인 계정을 잘못 골랐을 수 있다),
 * 이 리소스들은 어차피 공개 조회가 가능해 존재를 숨겨서 얻는 것이 없다.
 *
 * `userId` 를 받는다(`RequestUser` 가 아니라) — `common` 이 `modules/auth` 를
 * import 하면 의존 방향이 뒤집힌다.
 */
export function assertOwned<T extends { authorId: string }>(
  record: T | null | undefined,
  userId: string,
  entity: string,
): T {
  if (!record) throw new NotFoundException(`${entity} not found`);
  if (record.authorId !== userId) {
    throw new ForbiddenException(
      `Only the author can modify this ${entity.toLowerCase()}`,
    );
  }
  return record;
}
