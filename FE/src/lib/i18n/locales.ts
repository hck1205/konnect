/**
 * 지원 로케일.
 *
 * 순서는 [i18n 전략](docs/30-architecture/06-i18n-strategy.md)의 우선순위를 따른다.
 * 실제 추가 순서는 사용자 분포를 보고 정하되, 구조는 처음부터 열어 둔다 —
 * 나중에 끼워 넣으면 이미 하드코딩된 문구를 전부 찾아내야 한다.
 */
export const LOCALES = ['en', 'ko', 'zh', 'vi'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * 기준 언어. 번역이 없는 키는 여기로 폴백한다.
 * → docs/50-decisions/0003-english-first-multilingual.md
 */
export const DEFAULT_LOCALE: Locale = 'en';

/** 언어 선택기에 보여줄 이름 — **그 언어로** 적는다(영어 이름을 나열하면 못 찾는다) */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  zh: '中文',
  vi: 'Tiếng Việt',
};

/**
 * `<html lang>` 에 넣을 BCP 47 태그.
 * 로케일 코드와 다를 수 있다(지역 변종을 추가하면 여기만 바꾼다).
 */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  ko: 'ko-KR',
  zh: 'zh-CN',
  vi: 'vi-VN',
};

/**
 * 오른쪽에서 왼쪽으로 읽는 로케일.
 * 지금은 없지만 **목록을 미리 둔다** — 컴포넌트가 논리 속성(`ms/me`, `ps/pe`)을
 * 쓰는 이유가 이것이다. 아랍어를 추가할 때 레이아웃을 다시 짜지 않아도 된다.
 */
export const RTL_LOCALES: readonly Locale[] = [];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}
