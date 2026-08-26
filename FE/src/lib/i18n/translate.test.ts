import { describe, expect, it } from 'vitest';
import { interpolate, selectPlural, translate, type Messages } from './translate';

const EN: Messages = {
  'common.cancel': 'Cancel',
  'comment.greeting': 'Hi {name}, welcome to {place}',
  'comment.count': { one: '{count} comment', other: '{count} comments' },
  'only.in.english': 'English only',
};

const KO: Messages = {
  'common.cancel': '취소',
  'comment.greeting': '{name}님, {place}에 오신 것을 환영합니다',
  // 한국어에는 복수 구분이 없다 — other 하나뿐이다
  'comment.count': { other: '댓글 {count}개' },
};

describe('interpolate', () => {
  it('자리표시자를 채운다', () => {
    expect(interpolate('Hi {name}', { name: 'Amar' })).toBe('Hi Amar');
  });

  it('값이 없는 자리표시자는 그대로 남긴다 — 지우면 누락을 알 수 없다', () => {
    expect(interpolate('Hi {name}', {})).toBe('Hi {name}');
    expect(interpolate('Hi {name}')).toBe('Hi {name}');
  });

  it('같은 자리표시자가 여러 번 나와도 모두 채운다', () => {
    expect(interpolate('{a} and {a}', { a: 'x' })).toBe('x and x');
  });

  it('숫자도 문자열로 넣는다', () => {
    expect(interpolate('{count} items', { count: 3 })).toBe('3 items');
  });
});

describe('selectPlural', () => {
  it('영어는 one / other 를 구분한다', () => {
    const v = { one: 'one thing', other: 'many things' };
    expect(selectPlural(v, 1, 'en')).toBe('one thing');
    expect(selectPlural(v, 0, 'en')).toBe('many things');
    expect(selectPlural(v, 5, 'en')).toBe('many things');
  });

  it('한국어는 other 하나뿐이라 항상 같은 문구다', () => {
    const v = { other: '{count}개' };
    expect(selectPlural(v, 1, 'ko')).toBe('{count}개');
    expect(selectPlural(v, 5, 'ko')).toBe('{count}개');
  });

  it('고른 카테고리가 없으면 other 로 떨어진다', () => {
    // one 이 빠진 영어 번역에 count=1
    expect(selectPlural({ other: 'fallback' }, 1, 'en')).toBe('fallback');
  });
});

describe('translate', () => {
  it('현재 로케일의 문구를 쓴다', () => {
    expect(translate(KO, EN, 'common.cancel', 'ko')).toBe('취소');
  });

  it('번역이 없으면 기준 로케일로 폴백한다', () => {
    expect(translate(KO, EN, 'only.in.english', 'ko')).toBe('English only');
  });

  it('양쪽에 다 없으면 **키를 그대로** 돌려준다 — 빈 문자열이면 누락을 못 본다', () => {
    expect(translate(KO, EN, 'nope.missing', 'ko')).toBe('nope.missing');
  });

  it('자리표시자를 로케일별 어순 그대로 채운다', () => {
    expect(translate(EN, EN, 'comment.greeting', 'en', { name: 'Amar', place: 'konnect' })).toBe(
      'Hi Amar, welcome to konnect',
    );
    expect(translate(KO, EN, 'comment.greeting', 'ko', { name: '아마르', place: 'konnect' })).toBe(
      '아마르님, konnect에 오신 것을 환영합니다',
    );
  });

  it('복수형과 보간을 함께 처리한다', () => {
    expect(translate(EN, EN, 'comment.count', 'en', { count: 1 })).toBe('1 comment');
    expect(translate(EN, EN, 'comment.count', 'en', { count: 4 })).toBe('4 comments');
    expect(translate(KO, EN, 'comment.count', 'ko', { count: 4 })).toBe('댓글 4개');
  });

  it('count 가 없으면 0 으로 본다 — 던지지 않는다', () => {
    expect(translate(EN, EN, 'comment.count', 'en')).toBe('{count} comments');
  });
});
