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

/**
 * **서버(node)에서 쓸 base.**
 *
 * 상세 페이지는 SSR 이어야 한다 — [검색이 유일한 유입](../../docs/20-product/20-prd/08-seo-strategy.md)
 * 이라 본문이 HTML 에 실려야 색인된다. 그런데 서버에는 `/api` 를 프록시해 줄
 * Next rewrites 가 없다(그건 브라우저 요청에만 붙는다). **상대 경로로 부르면
 * 서버에서 그대로 실패한다.**
 *
 * 규칙:
 * 1. `NEXT_PUBLIC_API_BASE_URL` 이 **절대 주소**면 그대로 쓴다 (배포·통합테스트)
 * 2. 아니면 `API_INTERNAL_URL` (서버 전용 — 컨테이너 내부 주소를 넣는 자리)
 * 3. 그것도 없으면 로컬 BE
 */
export interface ServerApiEnv {
  NEXT_PUBLIC_API_BASE_URL?: string;
  /** 서버 전용 — 컨테이너 내부 주소를 넣는 자리 */
  API_INTERNAL_URL?: string;
}

export function resolveServerApiBase(env: ServerApiEnv = readServerApiEnv()): string {
  const publicBase = resolveApiBase(env.NEXT_PUBLIC_API_BASE_URL);
  if (isAbsolute(publicBase)) return publicBase;

  const internal = (env.API_INTERNAL_URL ?? '').trim().replace(/\/+$/, '');
  return internal || 'http://localhost:4000';
}

const isAbsolute = (value: string): boolean => /^https?:\/\//i.test(value);

/**
 * `process.env` 를 그대로 넘기지 않고 **읽는 키만** 꺼낸다.
 * Next 가 `ProcessEnv` 를 좁게 타이핑해 통째로는 대입되지 않고,
 * 좁혀 두면 이 함수가 무엇에 의존하는지도 시그니처에 드러난다.
 */
function readServerApiEnv(): ServerApiEnv {
  return {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
  };
}
