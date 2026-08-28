import type { UserSummary } from './user';

/**
 * 로그인 결과 — BE `AuthResult` 와 같은 모양이어야 한다.
 *
 * ⚠️ 필드 이름이 `token` 이다. `accessToken` 으로 짐작했다가 통합 테스트에서
 * 401 로 잡혔다 — 타입은 컴파일 타임에만 있어 응답 모양을 검사하지 않는다.
 */
export interface AuthResult {
  token: string;
  /** BE `RequestUser` — id 와 nickname 만 있다 */
  user: Pick<UserSummary, 'id' | 'nickname'>;
}

/** `/auth/me` 응답 */
export type CurrentUser = AuthResult['user'];
