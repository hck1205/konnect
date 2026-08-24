/**
 * 라우트 경로의 단일 출처.
 * 링크/리다이렉트는 문자열 리터럴 대신 이 헬퍼를 사용한다 —
 * 경로가 바뀌어도 이 파일만 고치면 된다.
 */
export const routes = {
  home: () => '/',
} as const;

/**
 * URL 파라미터 → slug. 비ASCII slug는 퍼센트 인코딩되어 들어오므로 디코드한다.
 * 잘못된 인코딩(%zz 등)은 원문을 그대로 돌려준다.
 */
export function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
