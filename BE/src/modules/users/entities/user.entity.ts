export type UserRole = 'USER' | 'ADMIN';

/**
 * 사용자.
 *
 * **민감정보를 담지 않는다** — 체류자격·학교·직장·실명·국적이 여기 없는 것은
 * 누락이 아니라 결정이다. 저장하는 순간 보관 책임이 생기고, 우리 타깃은
 * 그 정보가 노출됐을 때 피해가 큰 위치에 있다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * **비밀번호도 없다.** 로그인은 OAuth 전용이다
 * (→ docs/30-architecture/05-authentication.md).
 */
export interface UserRecord {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}
