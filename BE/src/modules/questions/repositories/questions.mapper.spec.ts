import { ContentStatus, Topic as PrismaTopic } from '@prisma/client';
import { TOPICS } from '../entities/question.entity';
import { toDomainTopic, toPrismaTopic } from './questions.mapper';

/**
 * 도메인 enum ↔ Prisma enum 계약.
 *
 * 변환이 `toUpperCase() as PrismaTopic` 캐스팅이라 **타입 검사가 잡아주지 못한다**.
 * `TOPICS` 에 주제를 하나 추가하고 스키마에 안 넣으면(또는 반대면) 컴파일은
 * 통과하고 **DB 에 넣는 순간 터진다** — 가장 늦게 발견되는 종류다.
 *
 * 여기서 양쪽 목록이 정확히 대응하는지 못박는다.
 */
describe('Topic 계약 — 도메인 ↔ Prisma', () => {
  it('양쪽 개수가 같다', () => {
    expect(TOPICS.length).toBe(Object.keys(PrismaTopic).length);
  });

  it('모든 도메인 주제가 Prisma enum 에 있다', () => {
    for (const topic of TOPICS) {
      expect(Object.keys(PrismaTopic)).toContain(topic.toUpperCase());
    }
  });

  it('모든 Prisma 주제가 도메인 목록에 있다 — 한쪽만 추가하는 것을 막는다', () => {
    for (const key of Object.keys(PrismaTopic)) {
      expect(TOPICS as readonly string[]).toContain(key.toLowerCase());
    }
  });

  it('왕복 변환이 원래 값을 돌려준다', () => {
    for (const topic of TOPICS) {
      expect(toDomainTopic(toPrismaTopic(topic))).toBe(topic);
    }
  });
});

describe('ContentStatus 계약', () => {
  it('도메인이 쓰는 상태가 Prisma enum 에 그대로 있다', () => {
    // 도메인은 문자열 리터럴 그대로 쓴다(변환 없음) — 그래서 값이 같아야 한다
    expect(Object.keys(ContentStatus).sort()).toEqual(['HIDDEN', 'OPEN']);
  });
});
