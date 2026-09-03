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

/** 이 제품의 날짜 기준 시간대 */
export const DISPLAY_TIME_ZONE = 'Asia/Seoul';

/**
 * 날짜.
 *
 * ## 시간대를 **한국으로 못 박는다**
 *
 * ⚠️ 예전에는 `timeZone` 을 지정하지 않아 "브라우저 시간대" 로 갔다. 두 가지가 깨졌다:
 *
 * 1. **SSR 과 클라이언트가 다른 날짜를 그린다.** 서버 컨테이너는 UTC 이고
 *    사용자 브라우저는 KST 라, 15:00Z 이후 값은 **하루가 다르다**.
 *    React 하이드레이션 불일치와 함께 사용자 눈앞에서 날짜가 바뀐다.
 * 2. 그리고 애초에 **틀린 날짜다.** 이 제품이 다루는 날짜는 체류기간·신고기한·
 *    개정일 같은 **한국 행정 날짜**다. 베트남에 있는 사용자가 보고 싶은 것은
 *    자기 지역 시각으로 환산한 값이 아니라 **한국 기준 날짜**다.
 *
 * 상대 시각(`formatRelative`)은 시간대와 무관하므로 이 문제가 없다 — 두 시각의
 * 차이만 쓴다.
 */
export function formatDate(
  value: Date | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  // 부르는 쪽이 명시하면 존중한다. 안 하면 한국 기준이다.
  const resolved: Intl.DateTimeFormatOptions = {
    timeZone: DISPLAY_TIME_ZONE,
    ...options,
  };
  const key = `${locale}:${JSON.stringify(resolved)}`;
  return cached(dateCache, key, () => new Intl.DateTimeFormat(locale, resolved)).format(date);
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
 *
 * ## 반환값이 셋이다
 *
 * | 값 | 뜻 |
 * | --- | --- |
 * | `null` | **파싱 실패.** 언제인지 모른다 — 부르는 쪽이 판단한다 |
 * | `''` | 1분 미만. 상대 단위가 없으니 사전의 `common.justNow` 를 쓰라는 뜻 |
 * | 문자열 | 그 상대 시각 |
 *
 * ⚠️ 예전에는 파싱 실패도 `''` 였다. 그래서 부르는 쪽의 `|| t('common.justNow')`
 * 가 **깨진 timestamp 를 "방금" 으로 승격**시켰다 — 가능한 값 중 가장 신선한 것으로.
 *
 * 이 제품에서 그게 위험한 이유: R1 리스크의 실체가 **정보가 오래되는 것**이다.
 * 모르는 것을 "방금" 이라고 말하는 것은 위험을 정확히 반대 방향으로 접는 것이다.
 */
export function formatRelative(
  value: Date | string,
  now: Date,
  locale: Locale,
): string | null {
  const target = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(target.getTime())) return null;

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
