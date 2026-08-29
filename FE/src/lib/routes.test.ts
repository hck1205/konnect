import { describe, expect, it } from 'vitest';
import { decodeSlug, questionSlug, routes, SLUG_MAX_LENGTH } from './routes';

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

  it('slug 가 될 게 없으면 빈 문자열이다 — 그때는 id 만 쓴다', () => {
    expect(questionSlug('???')).toBe('');
    expect(questionSlug('   ')).toBe('');
  });
});

describe('routes.question', () => {
  it('정규 URL 은 로케일 · id · slug 순이다', () => {
    expect(routes.question('en', 'q1', 'Hello World')).toBe(
      '/en/questions/q1/hello-world',
    );
  });

  it('slug 가 없으면 id 까지만 — 빈 세그먼트를 만들지 않는다', () => {
    expect(routes.question('ko', 'q1', '???')).toBe('/ko/questions/q1');
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
