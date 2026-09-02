import { parseTag } from '@/lib/text';
import type { TagNamespace } from '@/types/tag';

/**
 * 태그의 **표시 형태**. 규칙(`normalizeTag`·`parseTag`)은 `lib/text/tag.ts` 에 있다.
 *
 * 이 파일에 남은 것은 전부 사람에게 보이는 문제다 — 저장 형태를 어떻게 읽게 할 것인가.
 */

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
