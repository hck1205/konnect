/**
 * 문자열 primitive 유틸 — 순수 함수(부수효과 없음). BE utils와 철학을 공유한다.
 */

export const isBlank = (value: string): boolean => value.trim().length === 0;

export const capitalize = (value: string): string =>
  value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);

export const truncate = (value: string, max: number, ellipsis = '…'): string =>
  value.length <= max ? value : value.slice(0, max) + ellipsis;

export const normalizeWhitespace = (value: string): string =>
  value.trim().replace(/\s+/g, ' ');

/**
 * 제목 → URL slug.
 *
 * 구현은 `lib/text/slug` 하나뿐이다 — 태그 정규화·앵커 id 도 같은 규칙을 쓴다.
 * 규칙이 갈라지면 본문 앵커와 목차 링크가 어긋나고, 같은 태그가 두 표기로 갈라진다.
 * BE `utils/string.slugify` 와도 같은 규칙이어야 한다(slug 계약).
 */
export { slugify } from '@/lib/text';
