import { slugify } from '@/lib/text';
import { TAG_NAMESPACES, type ParsedTag, type TagNamespace } from './Tag.types';

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

/** `d-2` → `D-2` (체류자격 코드는 전부 대문자) */
const upperAll = (v: string) => v.toUpperCase();

/** `seoul-national-university` → `Seoul National University` */
const titleCase = (v: string) =>
  v
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

/**
 * 저장 형태 → 사람이 읽는 표시 형태.
 *
 * 저장은 항상 정규화된 소문자이고, **표시할 때만** 사람이 읽는 형태로 올린다.
 * 이 방향을 뒤집으면(표시 형태로 저장) 같은 태그가 여러 표기로 갈라진다.
 */
export function formatTagLabel(raw: string): string {
  const { namespace, value } = parseTag(raw);
  if (!value) return '';
  // 비자 코드(F-2)와 국적 코드(VN)는 대문자다. 타이틀케이스로 올리면 `Vn` 이 된다.
  if (namespace === 'visa' || namespace === 'nationality') return upperAll(value);
  if (namespace === null) return value;
  return titleCase(value);
}

/** 네임스페이스의 사람이 읽는 이름 — 배지 접두사로 쓴다 */
export const NAMESPACE_LABEL: Record<TagNamespace, string> = {
  visa: 'Visa',
  topic: 'Topic',
  region: 'Region',
  nationality: 'Nationality',
  school: 'School',
  lang: 'Language',
};
