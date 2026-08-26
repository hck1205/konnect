import { slugify } from '../../utils/string';
import {
  TAG_NAMESPACES,
  type ParsedTag,
  type TagNamespace,
} from './tags.types';

const isNamespace = (v: string): v is TagNamespace =>
  (TAG_NAMESPACES as readonly string[]).includes(v);

/**
 * 태그 정규화.
 *
 * 공용 `slugify` 에 네임스페이스 구분자(`:`)만 보존하도록 위임한다 —
 * FE `Tag.normalizeTag` 와 **같은 규칙**이어야 한다.
 * 갈라지면 같은 태그가 두 표기로 저장되어 필터가 무너진다.
 */
export function normalizeTag(raw: string): string {
  return slugify(raw, { keep: ':' });
}

/**
 * `visa:d-2` → `{ namespace: 'visa', value: 'd-2' }`
 *
 * 알려지지 않은 접두사(`viza:d-2`)는 네임스페이스로 인정하지 않고
 * **자유 태그로 취급**한다. 오타가 새 네임스페이스를 만들어내면
 * 고정 어휘의 의미가 사라진다.
 */
export function parseTag(raw: string): ParsedTag {
  const normalized = normalizeTag(raw);
  const idx = normalized.indexOf(':');

  if (idx <= 0) return { namespace: null, value: normalized, raw: normalized };

  const head = normalized.slice(0, idx);
  const rest = normalized.slice(idx + 1);

  if (!isNamespace(head) || rest.length === 0) {
    return { namespace: null, value: normalized, raw: normalized };
  }
  return { namespace: head, value: rest, raw: normalized };
}

/**
 * 입력 태그 목록 → 저장 형태.
 *
 * 정규화 → 빈 값 제거 → **중복 제거**(정규화 후 비교) → 상한 적용.
 * 순서를 유지한다: 사용자가 먼저 적은 것이 더 중요할 가능성이 높고,
 * 순서가 흔들리면 목록이 리렌더마다 달라 보인다.
 */
export function normalizeTagList(
  raw: readonly string[],
  max: number,
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of raw) {
    const normalized = normalizeTag(item);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= max) break;
  }
  return result;
}
