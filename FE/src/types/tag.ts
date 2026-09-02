/**
 * 태그 네임스페이스 — **관리자가 관리하는 고정 어휘**.
 *
 * 사용자가 새로 만들 수 없다. 표기가 갈라지면(`D-2` / `d2` / `D2 visa`) 필터가 무너진다.
 * 목록은 [`contracts/tag-namespaces.json`](../../../contracts/README.md) 이 소유하고
 * **BE 와 같아야 한다** — `lib/text/slug.contract.test.ts` 가 그것을 강제한다.
 *
 * `nationality` 는 **공간이 아니라 태그**다 → ADR-0008.
 *
 * ## 왜 컴포넌트가 아니라 여기 있나
 *
 * 예전에는 `components/data-display/Tag/Tag.types.ts` 가 이 어휘를 소유했다.
 * 그런데 이건 **BE 와 대조되는 도메인 어휘**이지 그 컴포넌트의 것이 아니다.
 * 그 결과 `lib/text` 의 계약 테스트가 `components/` 를 import 하는 **역방향 간선**이
 * 생겼다 — 화면 컴포넌트를 지우거나 옮기면 BE 와의 계약 검사가 함께 깨지는 구조였다.
 *
 * → docs/20-product/10-features/05-search-and-tagging.md
 */
export const TAG_NAMESPACES = [
  'visa',
  'topic',
  'region',
  'nationality',
  'school',
  'lang',
] as const;

export type TagNamespace = (typeof TAG_NAMESPACES)[number];

export interface ParsedTag {
  /** 고정 어휘 네임스페이스. 자유 태그면 `null` */
  namespace: TagNamespace | null;
  /** 정규화된 값 (`d-2`, `seoul`) */
  value: string;
  /** 원본 문자열 (`visa:d-2`) */
  raw: string;
}
