import { describe, expect, it } from 'vitest';
import { interpolate, selectPlural, splitAtSlot, translate, type Messages } from './translate';

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

describe('splitAtSlot', () => {
  it('자리표시자 앞뒤로 쪼갠다', () => {
    expect(splitAtSlot('ARC ({arc}), visas', 'arc')).toEqual({
      before: 'ARC (',
      after: '), visas',
    });
  });

  it('문장 맨 앞의 자리표시자 — before 가 빈 문자열이다(한국어 판이 이 모양이다)', () => {
    expect(splitAtSlot('{arc}, 비자, 집', 'arc')).toEqual({ before: '', after: ', 비자, 집' });
  });

  it('자리표시자가 없으면 after 가 null 이다 — 슬롯을 그리지 않는다는 신호다', () => {
    // 빈 문자열이면 "뒤가 비었다" 와 구분되지 않아 슬롯이 잘못 그려진다
    expect(splitAtSlot('no slot here', 'arc')).toEqual({ before: 'no slot here', after: null });
  });

  it('다른 이름의 자리표시자는 건드리지 않는다', () => {
    expect(splitAtSlot('{count} of {arc}', 'arc')).toEqual({ before: '{count} of ', after: '' });
  });
});

describe('0 은 카테고리가 아니라 정확값으로 고른다', () => {
  // 네 사전이 전부 zero 를 적었는데 어느 언어에서도 선택되지 않았다.
  // en 은 zero 카테고리가 없고, ko·zh·vi 는 카테고리가 other 하나뿐이다.
  const answers = { zero: 'No answers', one: '{count} answer', other: '{count} answers' };

  it.each(['en', 'ko', 'zh', 'vi'] as const)('%s 에서 0 이면 zero 를 쓴다', (locale) => {
    expect(selectPlural(answers, 0, locale)).toBe('No answers');
  });

  it('zero 가 없으면 평소대로 카테고리를 따른다', () => {
    expect(selectPlural({ other: '{count}개' }, 0, 'ko')).toBe('{count}개');
  });

  it('0 이 아니면 zero 를 쓰지 않는다', () => {
    expect(selectPlural(answers, 1, 'en')).toBe('{count} answer');
    expect(selectPlural(answers, 3, 'en')).toBe('{count} answers');
  });
});
