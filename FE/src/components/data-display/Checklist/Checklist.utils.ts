/**
 * 체크리스트 진행 계산 — 순수 함수.
 *
 * 진행 상태는 **로컬에 저장**한다는 전제다(계정 없이도 쓸 수 있어야 하고,
 * 체류 관련 정보를 서버에 쌓지 않기 위해서다).
 * → docs/20-product/03-user-journeys.md
 */

/** 알 수 없는 id 는 세지 않는다 — 저장된 상태가 오래돼 없어진 항목을 가리킬 수 있다 */
export function countCompleted(
  itemIds: readonly string[],
  checked: readonly string[],
): number {
  const set = new Set(checked);
  return itemIds.reduce((n, id) => (set.has(id) ? n + 1 : n), 0);
}

export function toggleChecked(
  checked: readonly string[],
  id: string,
  next: boolean,
): string[] {
  if (next) return checked.includes(id) ? [...checked] : [...checked, id];
  return checked.filter((c) => c !== id);
}
