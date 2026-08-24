/**
 * API base 정규화 — httpClient 외의 경로(전체 페이지 이동, fetch로 여는 SSE)에서
 * BE 주소를 조립할 때 쓰는 **단일 규칙**.
 *
 * - 미설정/공백이면 `'/api'`로 떨어진다 → next.config의 rewrites(/api/* → BE)가 프록시한다.
 *   httpClient(query/client.ts)의 기본값과 같아야 한다. 규칙이 갈라지면 "API는 되는데
 *   로그인/스트림만 404" 같은 어긋남이 생긴다.
 * - 끝의 슬래시는 정리한다(`host/` + `/auth/..` = `//auth/..` 방지).
 *
 * 결과에는 경로를 그대로 이어 붙일 수 있다: `` `${resolveApiBase(raw)}/auth/google` ``.
 */
export function resolveApiBase(raw?: string): string {
  const base = (raw ?? '').trim().replace(/\/+$/, '');
  return base || '/api';
}
