/**
 * 태그 네임스페이스 — **관리자가 관리하는 고정 어휘**.
 * 사용자가 새로 만들 수 없다. 표기가 갈라지면(D-2 / d2 / D2 visa) 필터가 무너지기 때문이다.
 * → docs/10-domain/10-visa-immigration/01-visa-types.md
 */
export const TAG_NAMESPACES = ['visa', 'region', 'school', 'topic', 'lang'] as const;

export type TagNamespace = (typeof TAG_NAMESPACES)[number];

export interface ParsedTag {
  /** 고정 어휘 네임스페이스. 자유 태그면 null */
  namespace: TagNamespace | null;
  /** 정규화된 값 (`d-2`, `seoul`) */
  value: string;
  /** 원본 문자열 (`visa:d-2`) */
  raw: string;
}
