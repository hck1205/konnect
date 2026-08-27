/**
 * 부분 갱신에 **바뀌면 안 되는 필드**를 지킨다.
 *
 * 인메모리 저장소들이 `{ ...existing, ...patch, id: existing.id, authorId: existing.authorId, … }`
 * 를 각자 손으로 쓰고 있었다. 관례로만 지켜지는 규칙이라, 새 저장소에서
 * **`authorId` 를 빠뜨리면 patch 로 소유권이 넘어간다** — 그런 실수는 리뷰에서
 * 눈에 잘 띄지 않고, 터졌을 때 피해가 크다.
 *
 * `updatedAt` 은 여기서 채우지 않는다 — 저장소마다 시각 소스가 다를 수 있고
 * (DB 는 `@updatedAt` 이 한다), 이 함수는 **막는 일만** 한다.
 */
export function patchRecord<T extends object>(
  existing: T,
  patch: Partial<T>,
  immutable: readonly (keyof T)[],
): T {
  const next = { ...existing, ...patch };
  for (const key of immutable) {
    next[key] = existing[key];
  }
  return next;
}
