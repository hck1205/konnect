// 규칙은 lib/text 가 소유한다 — 다른 컴포넌트에서 가져오면 components→components
// 간선이 생기고, 그 컴포넌트를 옮길 때 상관없는 폼이 함께 깨진다.
import { normalizeTag } from '@/lib/text';

export interface AddTagResult {
  next: string[];
  /** 실제로 추가됐는지. 중복·빈값·정원초과면 false */
  added: boolean;
}

/**
 * 태그 추가 규칙 — 순수 함수.
 *
 * 컴포넌트가 아니라 여기에 두는 이유: 중복 판정·정원 초과·정규화는 UI 없이
 * 검증할 수 있고, 실제로 틀리기 쉬운 부분이 전부 여기 있기 때문이다.
 */
export function addTag(
  current: readonly string[],
  raw: string,
  max?: number,
): AddTagResult {
  const normalized = normalizeTag(raw);
  const list = [...current];

  if (!normalized) return { next: list, added: false };
  // 정규화 후 비교한다 — 'D-2' 와 'd_2' 는 같은 태그다
  if (list.includes(normalized)) return { next: list, added: false };
  if (max !== undefined && list.length >= max) return { next: list, added: false };

  return { next: [...list, normalized], added: true };
}

export function removeTag(current: readonly string[], target: string): string[] {
  return current.filter((t) => t !== target);
}

/**
 * 한 번에 여러 태그를 붙여넣는 경우(쉼표 구분) 분해한다.
 * `"visa:d-2, seoul, "` → `['visa:d-2', 'seoul']`
 */
export function splitTagInput(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
