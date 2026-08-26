import { describe, expect, it } from 'vitest';
import { negotiateLocale, splitLocalePath, withLocale } from './resolveLocale';

describe('splitLocalePath', () => {
  it('앞의 로케일 세그먼트를 떼어낸다', () => {
    expect(splitLocalePath('/ko/questions/123')).toEqual({
      locale: 'ko',
      rest: '/questions/123',
    });
  });

  it('로케일 루트는 / 가 남는다', () => {
    expect(splitLocalePath('/ko')).toEqual({ locale: 'ko', rest: '/' });
  });

  it('로케일이 없으면 경로를 그대로 돌려준다', () => {
    expect(splitLocalePath('/questions')).toEqual({ locale: null, rest: '/questions' });
  });

  it('로케일처럼 생긴 다른 세그먼트를 로케일로 오해하지 않는다', () => {
    expect(splitLocalePath('/enterprise/x').locale).toBeNull();
  });
});

describe('withLocale', () => {
  it('로케일만 바꾼다', () => {
    expect(withLocale('/ko/questions/123', 'vi')).toBe('/vi/questions/123');
  });

  it('로케일이 없던 경로에도 붙인다', () => {
    expect(withLocale('/questions', 'ko')).toBe('/ko/questions');
  });

  it('루트는 로케일만 남는다 — //로 끝나지 않는다', () => {
    expect(withLocale('/', 'ko')).toBe('/ko');
    expect(withLocale('/en', 'ko')).toBe('/ko');
  });
});

describe('negotiateLocale', () => {
  it('지원 언어를 그대로 고른다', () => {
    expect(negotiateLocale('ko')).toBe('ko');
  });

  it('지역 태그는 기본 태그로 떨어진다', () => {
    expect(negotiateLocale('zh-CN')).toBe('zh');
    expect(negotiateLocale('vi-VN,vi;q=0.9')).toBe('vi');
  });

  it('품질값 순서를 존중한다 — 앞에 있다고 이기는 게 아니다', () => {
    expect(negotiateLocale('fr;q=0.9,ko;q=1.0')).toBe('ko');
  });

  it('지원하지 않는 언어만 있으면 기준 로케일', () => {
    expect(negotiateLocale('fr-FR,de;q=0.8')).toBe('en');
  });

  it('헤더가 없거나 이상해도 던지지 않는다', () => {
    expect(negotiateLocale(null)).toBe('en');
    expect(negotiateLocale('')).toBe('en');
    expect(negotiateLocale(';;;')).toBe('en');
  });
});
