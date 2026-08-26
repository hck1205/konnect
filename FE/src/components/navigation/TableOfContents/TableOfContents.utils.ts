import { slugify, uniqueSlugs } from '@/lib/text';

export interface TocEntry {
  id: string;
  label: string;
  /** 2 또는 3 — h1 은 페이지 제목이라 목차에 넣지 않는다 */
  level: 2 | 3;
}

/**
 * 제목 텍스트 → 앵커 id.
 *
 * 본문 렌더러와 목차가 **같은 규칙**을 써야 한다 — 갈라지면 목차 링크가 죽는다.
 * 그래서 구현을 갖지 않고 공용 `slugify` 에 위임한다.
 */
export const toAnchorId = (text: string): string => slugify(text);

/**
 * 같은 제목이 두 번 나오면 뒤에 번호를 붙여 id 충돌을 막는다.
 * 긴 가이드에서 "요약" 같은 제목은 실제로 반복된다.
 */
export const uniqueAnchors = (labels: readonly string[]): string[] =>
  uniqueSlugs(labels);
