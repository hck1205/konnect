import { describe, expect, it } from 'vitest';
import {
  decodeSlug,
  questionSlug,
  routes,
  SLUG_FALLBACK,
  SLUG_MAX_LENGTH,
} from './routes';

describe('questionSlug', () => {
  it('제목을 slug 로 바꾼다', () => {
    expect(questionSlug('Does volunteer work count toward F-2-7 points?')).toBe(
      'does-volunteer-work-count-toward-f-2-7-points',
    );
  });

  it('한국어 제목이 통째로 사라지지 않는다', () => {
    expect(questionSlug('안산에서 외국인 전세대출')).toBe(
      '안산에서-외국인-전세대출',
    );
  });

  it('길면 자르되 **단어 중간에서 끊지 않는다**', () => {
    const slug = questionSlug(
      'How long does it actually take to get permanent residence in Korea after switching from E-7',
    );
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(slug.endsWith('-')).toBe(false);
    // 잘린 지점이 하이픈 경계여야 한다
    expect(slug.split('-').every((part) => part.length > 0)).toBe(true);
  });

  /**
   * 빈 slug 를 그대로 두면 `routes.question` 이 slug 없는 경로를 내고,
   * slug 없는 라우트는 정규 URL 로 308 을 보내는데 **그 정규 URL 이 자기 자신**이라
   * 무한 루프가 된다. 실측으로 재현했다 — 같은 주소로 308 이 계속 나온다.
   */
  it('slug 가 될 게 없으면 고정 폴백을 쓴다 — 빈 slug 는 308 루프를 만든다', () => {
    expect(questionSlug('???')).toBe(SLUG_FALLBACK);
    expect(questionSlug('   ')).toBe(SLUG_FALLBACK);
    expect(questionSlug('🎉🎉🎉')).toBe(SLUG_FALLBACK);
  });
});

describe('routes.question', () => {
  it('정규 URL 은 로케일 · id · slug 순이다', () => {
    expect(routes.question('en', 'q1', 'Hello World')).toBe(
      '/en/questions/q1/hello-world',
    );
  });

  it('slug 가 될 게 없어도 세그먼트를 만든다', () => {
    expect(routes.question('ko', 'q1', '???')).toBe(
      `/ko/questions/q1/${SLUG_FALLBACK}`,
    );
  });

  /**
   * 회귀 방지. 이 두 주소가 같아지는 순간 slug 없는 라우트의 308 이 자기 자신을
   * 가리켜 무한 루프가 된다 — 500 도 404 도 아니라 로그에 남지 않는다.
   */
  it('정규 URL 이 slug 없는 주소와 절대 같지 않다', () => {
    for (const title of ['???', '   ', '🎉🎉🎉', 'Hello World']) {
      expect(routes.question('en', 'ID', title)).not.toBe('/en/questions/ID');
    }
  });
});

describe('decodeSlug', () => {
  it('퍼센트 인코딩된 비ASCII slug 를 되돌린다', () => {
    expect(decodeSlug(encodeURIComponent('안산-전세'))).toBe('안산-전세');
  });

  it('잘못된 인코딩은 원문 그대로 — 던지지 않는다', () => {
    expect(decodeSlug('%zz')).toBe('%zz');
  });
});
