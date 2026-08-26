/**
 * 키셋(커서) 페이지네이션.
 *
 * offset 을 쓰지 않는 이유: 목록이 시간순이고 새 글이 계속 들어오므로
 * "2페이지"를 요청하는 사이에 앞에 글이 추가되면 **중복과 누락**이 생긴다.
 * → docs/30-architecture/03-api-conventions.md
 *
 * id 가 UUIDv7(시간정렬)이라 **커서 = id 하나**로 시간순 키셋이 성립한다.
 * 별도 정렬 키를 커서에 인코딩할 필요가 없다.
 */

export interface PageQuery {
  /** 이 id **다음**부터. 없으면 첫 페이지. */
  cursor?: string;
  limit: number;
}

export interface Page<T> {
  items: T[];
  /** 다음 페이지 커서. null 이면 마지막이다. */
  nextCursor: string | null;
}

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

/** 요청 limit 을 안전 범위로 자른다. 클라이언트가 10000 을 보내도 서버가 죽지 않는다. */
export function clampLimit(raw: number | undefined): number {
  if (raw === undefined || Number.isNaN(raw)) return DEFAULT_PAGE_LIMIT;
  return Math.min(Math.max(Math.trunc(raw), 1), MAX_PAGE_LIMIT);
}

/**
 * 정렬된 배열을 커서로 자른다 — 인메모리 저장소용.
 *
 * **limit + 1 개를 가져와** 다음 페이지 존재 여부를 판단한다.
 * 별도 count 쿼리를 하지 않는 것이 키셋의 이점이다(전체 개수를 모르는 대신 빠르다).
 *
 * 커서가 목록에 없으면(삭제됐거나 필터가 바뀌었으면) **첫 페이지로 떨어진다** —
 * 빈 결과를 주면 사용자가 막다른 길에 갇힌다.
 */
export function paginateByCursor<T extends { id: string }>(
  sorted: readonly T[],
  query: PageQuery,
): Page<T> {
  const limit = clampLimit(query.limit);

  let start = 0;
  if (query.cursor) {
    const index = sorted.findIndex((item) => item.id === query.cursor);
    start = index >= 0 ? index + 1 : 0;
  }

  const slice = sorted.slice(start, start + limit + 1);
  const items = slice.slice(0, limit);
  const hasMore = slice.length > limit;

  return {
    items,
    nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
  };
}
