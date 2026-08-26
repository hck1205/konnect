export interface TocEntry {
  id: string;
  label: string;
  /** 2 또는 3 — h1 은 페이지 제목이라 목차에 넣지 않는다 */
  level: 2 | 3;
}

/**
 * 제목 텍스트 → 앵커 id.
 *
 * `utils/string.slugify` 와 같은 규칙을 쓴다 — 서버에서 렌더된 본문의 id 와
 * 목차의 링크가 **같은 규칙으로** 만들어져야 한다. 규칙이 갈라지면 링크가 죽는다.
 *
 * 유니코드 글자를 보존하는 이유도 같다: 한국어 제목이 통째로 빈 문자열이 되면
 * 모든 앵커가 충돌한다.
 */
export function toAnchorId(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 같은 제목이 두 번 나오면 뒤에 번호를 붙여 id 충돌을 막는다.
 * 긴 가이드에서 "요약" 같은 제목은 실제로 반복된다.
 */
export function uniqueAnchors(labels: readonly string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    const base = toAnchorId(label) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
