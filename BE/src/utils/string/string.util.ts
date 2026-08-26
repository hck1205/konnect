/**
 * 문자열 primitive 유틸 — 순수 함수(부수효과 없음). FE utils와 철학을 공유한다.
 */

export const isBlank = (value: string): boolean => value.trim().length === 0;

export const capitalize = (value: string): string =>
  value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);

export const truncate = (value: string, max: number, ellipsis = '…'): string =>
  value.length <= max ? value : value.slice(0, max) + ellipsis;

export const normalizeWhitespace = (value: string): string =>
  value.trim().replace(/\s+/g, ' ');

/**
 * 목록 검색어(q) 정규화 — 트림 후 빈 문자열이면 null(필터 없음).
 *
 * "q 없음"과 "빈/공백 q"를 같은 동작으로 맞춘다. 이걸 안 하면 검색창을 비웠을 때
 * 빈 문자열로 필터가 걸려 **결과가 0건**이 된다.
 */
export const normalizeQuery = (value?: string | null): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export interface SlugifyOptions {
  /** 보존할 추가 문자. 태그의 네임스페이스 구분자 `:` 등 */
  keep?: string;
}

/**
 * 문자열 → slug.
 *
 * **FE `lib/text/slug` 와 같은 규칙이어야 한다** — BE 가 만든 slug 로 FE 가 링크를
 * 만들고, FE 가 만든 앵커를 BE 가 저장한다. 갈라지면 링크가 죽고 같은 태그가
 * 두 표기로 저장된다. 양쪽 테스트가 **같은 케이스**를 갖고 있어 한쪽만 고치면 깨진다.
 *
 * 유니코드 글자/숫자는 보존한다 — 한국어 제목이 통째로 빈 문자열이 되면
 * 모든 slug 가 충돌하고 한국어 자유 태그가 사라진다.
 */
export const slugify = (
  value: string,
  options: SlugifyOptions = {},
): string => {
  // 문자 클래스에 넣기 전에 이스케이프하고, 하이픈은 **클래스 맨 끝**에 둔다 —
  // 중간에 두면 `-:` 가 범위로 해석돼 `u` 플래그에서 SyntaxError 가 난다.
  const keep = (options.keep ?? '').replace(/[\\\]^-]/g, '\\$&');
  const strip = new RegExp(`[^\\p{L}\\p{N}${keep}-]+`, 'gu');

  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(strip, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
};
