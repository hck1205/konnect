import { httpClient, unwrap, orNull, type ApiEnvelope } from '../client';
import { setAuthToken, clearAuthToken } from '@/lib/auth-token';
import type { AuthResult, CurrentUser } from '@/types';

/**
 * 인증 API.
 *
 * ⚠️ **`/auth/login` 은 임시 통로다.** 운영(`NODE_ENV=production`)에서는
 * 라우트 자체가 없어 404 다 — 소셜 OAuth 로 대체될 때까지 개발·검증용이다.
 * → docs/30-architecture/05-authentication.md
 */

/** 로그인하고 **토큰을 저장까지** 한다 — 호출부가 저장을 잊는 실수를 없앤다 */
export async function testLogin(nickname: string): Promise<AuthResult> {
  const result = unwrap(
    await httpClient.post<ApiEnvelope<AuthResult>>('/auth/login', { nickname }),
  );
  setAuthToken(result.token);
  return result;
}

/** 토큰이 없거나 만료면 예외가 아니라 `null` 이다 — 비로그인은 정상 흐름이다 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  return orNull(
    httpClient.get<ApiEnvelope<CurrentUser>>('/auth/me').then(unwrap),
    [401, 403],
  );
}

export function logout(): void {
  clearAuthToken();
}
