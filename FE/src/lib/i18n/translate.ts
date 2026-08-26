import type { Locale } from './locales';

/**
 * 메시지 값.
 *
 * 복수형이 필요한 문구는 `Intl.PluralRules` 의 카테고리를 키로 갖는 객체다.
 * ICU 메시지 문법(`{count, plural, one {...}}`)을 파싱하지 않는 이유:
 * 파서를 직접 만들면 버그가 나고, 라이브러리를 넣으면 번들이 커진다.
 * **복수 규칙 자체는 브라우저가 이미 안다** — 그 부분만 Intl 에 맡긴다.
 */
export type MessageValue = string | Partial<Record<Intl.LDMLPluralRule, string>>;
export type Messages = Record<string, MessageValue>;

export type TranslateParams = Record<string, string | number>;

/**
 * `{name}` 자리를 채운다.
 *
 * 값이 없는 자리표시자는 **그대로 남긴다.** 빈 문자열로 지우면 "Posted by " 처럼
 * 어색한 문장이 나가고, 무엇이 빠졌는지 화면에서 알 수 없다.
 */
export function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  );
}

/**
 * 복수형 선택.
 *
 * 언어마다 카테고리가 다르다 — 영어는 one/other 둘뿐이지만 한국어는 **other 하나뿐**이고,
 * 아랍어는 여섯 개다. 그래서 카테고리를 우리가 정하지 않고 `Intl.PluralRules` 에 묻는다.
 *
 * 고른 카테고리가 번역에 없으면 `other` 로 떨어진다 — 모든 언어가 갖는 유일한 카테고리다.
 */
export function selectPlural(
  value: Exclude<MessageValue, string>,
  count: number,
  locale: Locale,
): string | undefined {
  const category = new Intl.PluralRules(locale).select(count);
  return value[category] ?? value.other;
}

/**
 * 번역 조회.
 *
 * 폴백 순서: 현재 로케일 → 기준 로케일(en) → 키 자체.
 * **키를 그대로 돌려주는 것이 의도다.** 빈 문자열을 반환하면 화면에서 문구가
 * 사라져 누락을 눈치채지 못한다. 키가 보이면 바로 드러난다.
 */
export function translate(
  messages: Messages,
  fallback: Messages,
  key: string,
  locale: Locale,
  params?: TranslateParams,
): string {
  const value = messages[key] ?? fallback[key];
  if (value === undefined) return key;

  if (typeof value === 'string') return interpolate(value, params);

  const count = typeof params?.count === 'number' ? params.count : 0;
  const picked = selectPlural(value, count, locale);
  if (picked === undefined) return key;

  return interpolate(picked, params);
}
