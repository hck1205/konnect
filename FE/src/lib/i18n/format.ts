import type { Locale } from './locales';

/**
 * 로케일별 포맷 — 전부 `Intl` 에 맡긴다.
 *
 * 직접 조립하지 않는 이유: 천 단위 구분자·소수점·어순·목록 접속사가 언어마다 다르다.
 * 독일어는 `1.234,5`, 베트남어는 `1.234,5`, 영어는 `1,234.5` 다.
 * 우리가 규칙을 갖고 있으면 언어를 추가할 때마다 이 로직을 다시 써야 한다.
 *
 * 포맷터 생성은 비싸므로 캐시한다(같은 로케일·옵션이 반복 호출된다).
 */

const numberCache = new Map<string, Intl.NumberFormat>();
const dateCache = new Map<string, Intl.DateTimeFormat>();
const listCache = new Map<string, Intl.ListFormat>();

function cached<T>(map: Map<string, T>, key: string, create: () => T): T {
  const hit = map.get(key);
  if (hit) return hit;
  const made = create();
  map.set(key, made);
  return made;
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  const key = `${locale}:${JSON.stringify(options ?? {})}`;
  return cached(numberCache, key, () => new Intl.NumberFormat(locale, options)).format(value);
}

/**
 * 금액.
 *
 * 통화 기호의 **위치**도 로케일이 정한다 — `₩1,000` / `1.000 ₩`.
 * konnect 에서는 주로 KRW 지만, 사용자가 자국 통화로 환산해 보는 경우가 있어
 * 통화를 인자로 받는다.
 */
export function formatCurrency(
  value: number,
  locale: Locale,
  currency = 'KRW',
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
    // KRW 는 소수 단위가 없다 — Intl 이 통화별로 알아서 처리한다
  });
}

/**
 * 날짜.
 *
 * ⚠️ 사용자가 여러 시간대에 흩어져 있다. 값은 항상 UTC 기준 ISO 로 받고,
 * 표시할 때 브라우저 시간대로 변환한다(`timeZone` 을 지정하지 않으면 그렇게 된다).
 */
export function formatDate(
  value: Date | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const key = `${locale}:${JSON.stringify(options)}`;
  return cached(dateCache, key, () => new Intl.DateTimeFormat(locale, options)).format(date);
}

/**
 * 목록 나열 — "A, B, and C" / "A、B和C".
 *
 * 쉼표로 join 하면 영어의 "and" 나 한국어의 "및" 이 빠진다.
 * 태그·참가자 목록을 문장 안에 넣을 때 쓴다.
 */
export function formatList(
  items: readonly string[],
  locale: Locale,
  type: Intl.ListFormatType = 'conjunction',
): string {
  const key = `${locale}:${type}`;
  return cached(listCache, key, () =>
    new Intl.ListFormat(locale, { style: 'long', type }),
  ).format(items);
}

/**
 * 상대 시각. 기준 시각을 **인자로 받는다** — 안에서 `Date.now()` 를 부르면
 * 테스트가 시스템 시계에 의존한다.
 */
export function formatRelative(
  value: Date | string,
  now: Date,
  locale: Locale,
): string {
  const target = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(target.getTime())) return '';

  const diff = target.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const MINUTE = 60_000;

  if (abs < MINUTE) {
    // "지금"은 상대 단위가 없다 — 각 로케일 사전이 'time.justNow' 로 제공한다
    return '';
  }

  const units: readonly [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 365 * 24 * 3600_000],
    ['month', 30 * 24 * 3600_000],
    ['week', 7 * 24 * 3600_000],
    ['day', 24 * 3600_000],
    ['hour', 3600_000],
    ['minute', MINUTE],
  ];

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, ms] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return '';
}
