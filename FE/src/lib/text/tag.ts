import { slugify } from './slug';
import { TAG_NAMESPACES, type ParsedTag, type TagNamespace } from '@/types/tag';

/**
 * 태그 문자열 규칙 — **표현이 아니라 규칙**이라 `lib/text` 에 있다.
 *
 * `slugify` 와 같은 층에 두는 이유: 태그 정규화가 제목 slug·목차 앵커와
 * **같은 규칙**을 써야 표기가 갈라지지 않기 때문이다. 규칙이 갈라지면 같은 태그가
 * 두 표기로 저장돼 필터가 무너진다.
 *
 * 사람이 읽는 형태로 바꾸는 것(`formatTagLabel`·`NAMESPACE_LABEL`)은 표현이므로
 * 컴포넌트에 남는다.
 */

const isNamespace = (v: string): v is TagNamespace =>
  (TAG_NAMESPACES as readonly string[]).includes(v);

/**
 * 태그 문자열 정규화.
 *
 * 공용 `slugify` 에 네임스페이스 구분자(`:`)만 보존하도록 위임한다 —
 * 제목 slug·앵커 id 와 **같은 규칙**이어야 표기가 갈라지지 않는다.
 */
export function normalizeTag(raw: string): string {
  return slugify(raw, { keep: ':' });
}

/**
 * `visa:d-2` → `{ namespace: 'visa', value: 'd-2' }`
 *
 * 알려지지 않은 접두사(`foo:bar`)는 네임스페이스로 인정하지 않고 **자유 태그로 취급**한다.
 * 오타가 새 네임스페이스를 만들어내면 고정 어휘의 의미가 사라진다.
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
