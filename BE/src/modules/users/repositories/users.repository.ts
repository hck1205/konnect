import type { UserRecord } from '../entities/user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

/**
 * 사용자 저장소.
 *
 * OAuth 가 들어오면 `findByIdentity(provider, providerId)` 와
 * `createWithIdentity` 가 추가된다 — 지금은 **질문·답변의 작성자 FK 를 만족시키는
 * 최소한**만 있다. 없으면 Prisma 모드에서 질문 생성이 외래키 위반으로 실패한다.
 */
export interface UsersRepository {
  findById(id: string): Promise<UserRecord | null>;
  create(record: UserRecord): Promise<UserRecord>;
}
