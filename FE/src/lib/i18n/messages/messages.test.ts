import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { walkSource } from '@/lib/dev/reachable';
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

/**
 * 한국어는 **자리표시자 뒤에 조사를 붙이면 반드시 틀린다.**
 *
 * `'{name}으로 공감했습니다'` 가 실제로 있었다. 조사 `으로/로`·`은/는`·`이/가`·
 * `을/를` 은 앞 글자의 받침에 따라 갈리는데, 자리표시자에는 어떤 값이 올지
 * 모른다 — 그래서 **가능한 모든 값에서 문법이 틀린다.**
 *
 * 사전은 코드가 아니라 문구라 컴파일러가 못 잡고, 화면에는 자연스러워 보이는
 * 한국어가 뜨므로 눈으로도 잘 안 드러난다. 그래서 검사로 막는다.
 *
 * 고치는 방법은 조사를 문장에서 빼는 것이다:
 * `'{name} 공감을 눌렀습니다'` · `'내 공감: {name}'`
 */
describe('ko: 자리표시자 뒤에 조사를 붙이지 않는다', () => {
  const PARTICLE = /\{\w+\}\s*(은|는|이|가|을|를|와|과|으로|로|에게|한테)(?![가-힣])/;

  it('조사가 자리표시자에 붙은 값이 없다', () => {
    const offenders = Object.entries(MESSAGES.ko)
      .flatMap(([key, value]) =>
        (typeof value === 'string' ? [value] : Object.values(value)).map(
          (v) => [key, v] as const,
        ),
      )
      .filter(([, v]) => typeof v === 'string' && PARTICLE.test(v))
      .map(([key, v]) => `${key}: ${String(v)}`);

    expect(
      offenders,
      '조사를 문장에서 빼라 — 받침에 따라 갈리므로 어떤 값이 와도 틀린다',
    ).toEqual([]);
  });

  it('검사가 실제로 무는지 — 알려진 잘못된 모양을 잡는다', () => {
    expect(PARTICLE.test('{name}으로 공감했습니다')).toBe(true);
    expect(PARTICLE.test('{tag}을 구독')).toBe(true);
    expect(PARTICLE.test('{name}님에게 답글')).toBe(false); // 님 뒤라 안전하다
    expect(PARTICLE.test('{count}개')).toBe(false);
    expect(PARTICLE.test('{name} 공감을 눌렀습니다')).toBe(false);
  });
});

/**
 * **아무도 읽지 않는 사전 키**를 잡는다.
 *
 * 키가 네 언어에 다 번역돼 있는데 읽는 코드가 없으면, 번역자가 일을 다 해도
 * 화면은 안 바뀐다. 그리고 그 문구는 대개 **같은 글자로 컴포넌트에 영어로
 * 박혀 있다** — 실제로 `common.close`·`common.retry`·`common.previous` 가
 * 그랬고, `locale.machineTranslated`(미검수 판 경고)는 네 판 모두 번역돼
 * 있는데 렌더되는 곳이 없었다.
 *
 * 번역자에게는 자기가 한 일이 왜 반영이 안 되는지 보이지 않는다.
 */
describe('사전 키가 화면에서 실제로 읽힌다', () => {
  const SRC = resolve(import.meta.dirname, '..', '..', '..');  // = src/

  /**
   * 의도적으로 미리 넣어 둔 키. **각각 왜 남겨 두는지 적는다** —
   * 이유 없는 항목이 쌓이면 이 목록이 검사를 무력화한다.
   */
  /**
   * 아직 읽는 코드가 없는 키. **이유별로 묶는다** — 이유 없이 담으면
   * 이 목록이 검사를 무력화한다. 새 키를 넣으려면 읽는 코드를 만들거나
   * 왜 앞서 넣는지를 여기 적어야 한다.
   */
  const INTENTIONALLY_UNUSED = new Set([
    // ── 화면이 아직 없다. 생기면 홈 네비에 한 줄만 되돌린다 ──
    'nav.guides', // 가이드는 "반복 질문이 승격된 문서" 라 질문이 쌓여야 성립한다(Phase 2)
    'nav.meetups', // 색인 라우트 표에 아직 없다
    'spine.askFirst', // 작성 화면(/ask)이 생길 때 척추의 0건 자리가 쓴다

    // ── 지역화된 404 화면이 생길 때 쓴다 (감사 order 9) ──
    // src/app 에 not-found.tsx 가 하나도 없어서, 숨겨진 질문 링크를 받은
    // 베트남어 사용자가 스타일도 헤더도 없는 영어 404 를 만난다.
    'question.notFound',
    'question.backToList',

    // ── 번역 보조 기능이 생길 때 쓴다 ──
    // 사용자 글의 언어를 표시하고 번역을 제안하는 자리. ADR-0010 이
    // "언어는 벽이 아니라 가중치" 로 정한 방향의 UI 인데 아직 안 만들었다.
    'question.writtenIn',
    'question.translate',
    'locale.label',

    // ── Phase 2 기능. 컴포넌트는 있지만 화면에서 도달할 수 없다 ──
    // 도달 여부는 hardcodedText.test.ts 의 도달 그래프가 확인한다.
    'comment.replyCount',
    'comment.showReplies',
    'comment.hideReplies',
    'report.submitted',
    'message.new',
    'message.to',
    'question.follow',
    'question.yearsInKorea',
    'question.koreanTerm',

    // ── 아직 화면에서 도달 불가한 컴포넌트가 쓸 것들 ──
    // ⚠️ 이 일곱은 **문구가 그 컴포넌트에 영어로 박혀 있다**(LoadingState·ErrorState·
    // Pagination·PostEditor 등). 즉 번역이 이미 네 판에 있는데 코드가 안 읽는다.
    // 그 컴포넌트가 화면에 붙는 날 hardcodedText.test.ts 가 깨지고, 그때
    // 여기 있는 키를 읽게 만들면 된다 — 두 검사가 서로를 가리킨다.
    'common.save',
    'common.edit',
    'common.submit',
    'common.loading',
    'common.retry',
    'common.previous',
    'common.next',
  ]);

  it('en 의 모든 키가 어딘가에서 읽힌다', () => {
    const sources = walkSource(SRC)
      .filter((f) => !f.includes(`${'messages'}`))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');

    const unread = Object.keys(en)
      .filter((key) => !INTENTIONALLY_UNUSED.has(key))
      .filter((key) => {
        if (sources.includes(`'${key}'`) || sources.includes(`\`${key}\``)) return false;
        // `t(\`topic.${x}\`)` 처럼 동적으로 만드는 키는 접두사로 찾는다
        const prefix = key.slice(0, key.lastIndexOf('.') + 1);
        return !sources.includes(`\`${prefix}$`);
      });

    expect(
      unread,
      '읽는 코드를 만들거나, 왜 미리 넣었는지를 INTENTIONALLY_UNUSED 에 적는다',
    ).toEqual([]);
  });
});
