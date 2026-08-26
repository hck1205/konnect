export type StepStatus = 'complete' | 'current' | 'upcoming';

/**
 * 인덱스 → 단계 상태. 순수 함수.
 *
 * 경계를 틀리기 쉬워 따로 뺀다: `current` 보다 **작은** 인덱스가 완료이고,
 * 같으면 현재다. 범위를 벗어난 current(저장된 값이 오래됐을 때)도 안전해야 한다.
 */
export function stepStatus(index: number, current: number): StepStatus {
  if (index < current) return 'complete';
  if (index === current) return 'current';
  return 'upcoming';
}

/** 완료된 단계 수 — 진행률 표시에 쓴다. 범위를 벗어나면 잘라 낸다. */
export function completedCount(current: number, total: number): number {
  return Math.min(Math.max(current, 0), total);
}
