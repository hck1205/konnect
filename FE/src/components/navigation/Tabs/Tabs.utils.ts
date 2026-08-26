/**
 * URL 등 외부에서 들어온 탭 값을 검증한다.
 *
 * 탭 상태의 단일 출처는 URL 이라 임의의 문자열이 들어올 수 있다.
 * 모르는 값이면 첫 탭으로 수렴시킨다 — 빈 화면을 보여주는 것보다 낫다.
 */
export function parseTabValue<T extends string>(
  raw: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (raw && (allowed as readonly string[]).includes(raw)) return raw as T;
  return fallback;
}

/**
 * 좌우 화살표 키로 이동할 다음 인덱스. 양끝에서 순환한다.
 * (탭 리스트의 키보드 관습 — Tab 키는 탭 목록 **밖으로** 나가야 한다)
 */
export function nextTabIndex(current: number, total: number, delta: 1 | -1): number {
  if (total === 0) return 0;
  return (current + delta + total) % total;
}
