/**
 * 커서(키셋) 페이지.
 *
 * offset 을 쓰지 않는 이유: 새 글이 계속 들어오므로 페이지 사이에 중복·누락이 생긴다.
 * id 가 UUIDv7(시간정렬)이라 **커서 = 마지막 id 하나**로 성립한다.
 * → docs/30-architecture/03-api-conventions.md
 */
export interface Page<T> {
  items: T[];
  /** 다음 페이지 커서. `null` 이면 마지막이다 */
  nextCursor: string | null;
}

/** 목록 요청의 페이지 부분 */
export interface PageParams {
  /** 이 id **다음**부터. 없으면 첫 페이지 */
  cursor?: string;
  limit?: number;
}
