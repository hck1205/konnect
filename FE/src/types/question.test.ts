import { describe, expect, it } from 'vitest';
import { POST_TYPES, TOPICS, isTopic } from './question';

/**
 * 주제 어휘의 **좁히기**를 지킨다.
 *
 * `isTopic` 은 `as const` 배열에서 `Array.includes` 가 `string` 을 못 받아
 * 캐스트로 좁힌다. 캐스트는 컴파일러에게 <믿어라> 라고 말하는 것이라
 * 그 자리에 런타임 검사를 놓는다 — `questions.mapper.spec.ts` 와 같은 원칙이다.
 *
 * 이게 실제로 중요한 이유: `/[locale]/topics/[topic]` 이 이 함수로 404 를 가른다.
 * 너무 넓으면 없는 주제가 200 으로 열려 **빈 페이지가 색인된다**.
 * 너무 좁으면 멀쩡한 주제가 404 가 된다.
 */
describe('isTopic', () => {
  it.each([...TOPICS])('%s 는 주제다', (topic) => {
    expect(isTopic(topic)).toBe(true);
  });

  /**
   * `visa` 와 `education` 이 여기 있는 것이 요점이다 — 둘 다 **예전에 주제였다**.
   * 되살아나면 ADR-0012 가 되돌려진 것이므로 이 테스트가 알려 준다.
   */
  it.each(['visa', 'education', 'Residency', 'RESIDENCY', '', ' work', 'work ', 'jobs'])(
    "'%s' 는 주제가 아니다",
    (raw) => {
      expect(isTopic(raw)).toBe(false);
    },
  );

  it('프로토타입 오염에 걸리지 않는다 — URL 세그먼트가 그대로 들어온다', () => {
    expect(isTopic('constructor')).toBe(false);
    expect(isTopic('toString')).toBe(false);
    expect(isTopic('__proto__')).toBe(false);
  });

  it('어휘가 여섯이고 중복이 없다 — 축이 닫혀 있어야 척추가 성립한다', () => {
    expect(TOPICS).toHaveLength(6);
    expect(new Set(TOPICS).size).toBe(TOPICS.length);
  });

  it('주제와 글 종류는 다른 축이라 값이 겹치지 않는다', () => {
    const overlap = (TOPICS as readonly string[]).filter((t) =>
      (POST_TYPES as readonly string[]).includes(t),
    );
    expect(overlap).toEqual([]);
  });
});
