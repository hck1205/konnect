/**
 * 문자열 → slug 정규화. **이 규칙의 단일 출처다.**
 *
 * 같은 규칙이 세 곳에 각자 있었다: `utils/string.slugify`(제목→URL),
 * `Tag.normalizeTag`(태그 저장 형태 — 지금은 옆의 `tag.ts`), `TableOfContents.toAnchorId`(앵커 id).
 * 규칙이 갈라지면 **본문의 앵커와 목차의 링크가 어긋나** 링크가 죽고,
 * 같은 태그가 두 표기로 갈라져 필터가 무너진다.
 *
 * 유니코드 글자·숫자를 보존한다 — 한국어 제목이 통째로 빈 문자열이 되면
 * 모든 앵커가 충돌하고, 한국어 자유 태그가 사라진다.
 */
export interface SlugifyOptions {
  /** 보존할 추가 문자(정규식 문자 클래스 조각). 태그의 네임스페이스 구분자 `:` 등 */
  keep?: string;
}

export function slugify(value: string, options: SlugifyOptions = {}): string {
  // 문자 클래스에 넣기 전에 이스케이프한다.
  // 하이픈은 **클래스 맨 끝**에 둔다 — 중간에 두면 `-:` 가 범위로 해석돼
  // `u` 플래그에서 SyntaxError 가 난다.
  const keep = (options.keep ?? '').replace(/[\\\]^-]/g, '\\$&');
  const strip = new RegExp(`[^\\p{L}\\p{N}${keep}-]+`, 'gu');

  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(strip, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 같은 라벨이 여러 번 나올 때 뒤에 번호를 붙여 id 충돌을 막는다.
 * 긴 가이드에서 "요약" 같은 제목은 실제로 반복된다.
 */
export function uniqueSlugs(labels: readonly string[], fallback = 'section'): string[] {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    const base = slugify(label) || fallback;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
