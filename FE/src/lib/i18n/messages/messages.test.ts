import { describe, expect, it } from 'vitest';
import { MESSAGES, en } from './index';
import { LOCALES, DEFAULT_LOCALE } from '../locales';
import type { Messages } from '../translate';

/**
 * 사전 무결성.
 *
 * 폴백은 누락을 **조용히 덮는다** — ko 에 `comment.reply` 를 `comment.replay` 로
 * 잘못 적으면 화면에는 영어가 나오고, 아무도 눈치채지 못한 채 배포된다.
 * 그런 오타를 여기서 잡는다.
 *
 * 반대로 "번역이 아직 없는 키"는 정상이다(의도된 폴백). 그건 검사하지 않는다.
 */

const pluralCategories = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;

function isPluralShape(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return Object.keys(value).every((k) =>
    (pluralCategories as readonly string[]).includes(k),
  );
}

describe('메시지 사전', () => {
  it('기준 사전(en)이 비어 있지 않다', () => {
    expect(Object.keys(en).length).toBeGreaterThan(0);
  });

  it.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))(
    '%s 에 기준 사전에 없는 키가 없다 — 오타는 조용히 영어로 폴백된다',
    (locale) => {
      const unknown = Object.keys(MESSAGES[locale]).filter((key) => !(key in en));
      expect(unknown).toEqual([]);
    },
  );

  it.each(LOCALES)('%s 의 복수형 메시지는 최소한 other 를 갖는다', (locale) => {
    const missing = Object.entries(MESSAGES[locale] as Messages)
      .filter(([, v]) => typeof v !== 'string')
      .filter(([, v]) => !(v as Record<string, string>).other)
      .map(([k]) => k);
    // other 는 모든 언어가 갖는 유일한 카테고리다 — 없으면 폴백할 곳이 없다
    expect(missing).toEqual([]);
  });

  it.each(LOCALES)('%s 의 값이 문자열이거나 올바른 복수형 객체다', (locale) => {
    const bad = Object.entries(MESSAGES[locale] as Messages)
      .filter(([, v]) => typeof v !== 'string' && !isPluralShape(v))
      .map(([k]) => k);
    expect(bad).toEqual([]);
  });

  it.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))(
    '%s 의 복수형 여부가 기준 사전과 일치한다',
    (locale) => {
      // en 이 문자열인데 번역이 복수형 객체면(또는 그 반대면) 런타임에 키가 그대로 뜬다
      const mismatched = Object.entries(MESSAGES[locale] as Messages)
        .filter(([key, value]) => {
          const base = (en as Messages)[key];
          if (base === undefined) return false; // 위 테스트가 잡는다
          return typeof base !== typeof value;
        })
        .map(([k]) => k);
      expect(mismatched).toEqual([]);
    },
  );

  it.each(LOCALES)('%s 의 자리표시자가 기준 사전과 같다', (locale) => {
    const placeholders = (v: unknown): string[] => {
      const text = typeof v === 'string' ? v : Object.values(v as object).join(' ');
      return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    };

    // 번역에 {count} 를 빠뜨리면 "댓글 개" 처럼 숫자 없는 문장이 나간다
    const mismatched = Object.entries(MESSAGES[locale] as Messages)
      .filter(([key, value]) => {
        const base = (en as Messages)[key];
        if (base === undefined) return false;
        const a = new Set(placeholders(base));
        const b = new Set(placeholders(value));
        return [...a].some((p) => !b.has(p));
      })
      .map(([k]) => k);

    expect(mismatched).toEqual([]);
  });
});
