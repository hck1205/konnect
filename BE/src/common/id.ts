import { uuidv7 } from 'uuidv7';

/**
 * 공용 식별자 생성기 — UUIDv7(시간정렬).
 *
 * randomUUID()(UUIDv4, 완전 랜덤) 대신 UUIDv7을 쓰는 이유:
 * - 상위 비트가 밀리초 타임스탬프라 사전식=시간순 → B-tree 삽입이 append-only에
 *   가까워 페이지 스플릿·인덱스 블로트를 줄인다.
 * - 시간정렬이라 커서=id 하나로 시간순 키셋 페이지네이션이 성립한다.
 *
 * id는 API에서 불투명값이라 포맷 변경이 안전하다. 모든 id 생성 지점이 이 함수를
 * 공유해 저장소 구현이 갈라져도 계약을 동일하게 유지한다.
 */
export function newId(): string {
  return uuidv7();
}
