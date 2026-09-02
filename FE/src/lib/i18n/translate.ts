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
 *
 * ## 0 은 카테고리가 아니라 **정확값**으로 먼저 본다
 *
 * `zero` 는 복수 **카테고리**이고 우리 네 언어 중 아무도 갖고 있지 않다
 * (`Intl.PluralRules('en').select(0)` 은 `'other'` 다. ko·zh·vi 는 카테고리가
 * `other` 하나뿐이다). 그런데 **네 사전이 전부 `zero` 를 적어 놨다** —
 * `'No answers'` · `'답변 없음'` · `'暂无回答'` · `'Chưa có trả lời'`.
 * 어느 언어에서도 선택되지 않아 화면에는 `0 answers` · `답변 0개` 가 나갔다.
 *
 * 번역자 넷이 같은 의도를 적었는데 코드가 못 고르는 것이므로 **코드를 고친다.**
 * ICU 도 정확값(`=0`)과 카테고리(`zero`)를 따로 둔다 — 여기서는 이름 하나로
 * 둘을 겸한다(사전이 이미 그렇게 쓰였다). 아랍어처럼 `zero` 가 진짜 카테고리인
 * 언어에서는 `select(0)` 이 어차피 `'zero'` 라 결과가 같다.
 */
export function selectPlural(
  value: Exclude<MessageValue, string>,
  count: number,
  locale: Locale,
): string | undefined {
  if (count === 0 && value.zero !== undefined) return value.zero;
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

/**
 * 번역문을 자리표시자 하나를 기준으로 **앞/뒤로 쪼갠다.**
 *
 * 왜 필요한가: 문장 가운데 한 낱말만 다른 태그로 감싸야 할 때가 있다.
 * 홈의 "Alien Registration Card (외국인등록증)" 이 그렇다 — 그 낱말은
 * `lang="ko" translate="no"` 여야 한다(사용자가 **실제 서류에서 이 글자를
 * 눈으로 찾는다**. 브라우저 번역기가 바꿔 버리면 찾을 수 없다).
 *
 * 태그를 사전 안에 넣지 않는 이유: 번역자가 마크업을 손대게 되고, 사전이
 * HTML 을 담기 시작하면 XSS 표면이 된다. **사전은 문구만, 태그는 화면이.**
 *
 * 자리표시자가 없으면 `after` 가 `null` 이다 — 있고 없고를 화면이 구분할 수 있어야
 * 슬롯을 그릴지 말지 정한다. 빈 문자열로 뭉개면 그 판정이 사라진다.
 */
export function splitAtSlot(
  text: string,
  name: string,
): { before: string; after: string | null } {
  const at = text.indexOf(`{${name}}`);
  if (at < 0) return { before: text, after: null };
  return { before: text.slice(0, at), after: text.slice(at + name.length + 2) };
}
