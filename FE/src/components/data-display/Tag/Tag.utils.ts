import { parseTag } from '@/lib/text';
import type { TagNamespace } from '@/types/tag';
import type { MessageKey } from '@/lib/i18n';

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

/**
 * 네임스페이스 → **사전 키**. 배지 접두사로 쓴다.
 *
 * ⚠️ 예전에는 영어 문자열을 직접 담았다. 그러면 목록·상세의 **모든 태그 칩**이
 * 네 로케일 전부에서 `Visa`·`Region` 같은 영어 접두사를 달고 나간다.
 *
 * 이 파일이 `.utils.ts` 라는 것이 함정의 절반이었다 — 하드코딩 검사가
 * `.tsx` 만 읽어서 **문구를 옆 파일로 옮기면 검사에서 사라지는** 우회로가
 * 열려 있었다. 지금은 `.ts` 도 읽는다.
 */
export const NAMESPACE_LABEL_KEY: Record<TagNamespace, MessageKey> = {
  visa: 'tag.namespace.visa',
  topic: 'tag.namespace.topic',
  region: 'tag.namespace.region',
  nationality: 'tag.namespace.nationality',
  school: 'tag.namespace.school',
  lang: 'tag.namespace.lang',
};
