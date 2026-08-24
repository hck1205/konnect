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
 * 제목 → URL slug. 유니코드 글자/숫자는 보존한다.
 * BE utils/string.slugify와 동일 규칙 — slug 계약의 단일 출처.
 */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
