/**
 * 상대 시각 포맷 — `Intl.RelativeTimeFormat` 을 쓴다.
 *
 * "3 days ago" 를 직접 조립하지 않는 이유: 로케일마다 복수형·어순이 다르고,
 * konnect 는 다국어로 확장할 예정이다(→ docs/30-architecture/06-i18n-strategy.md).
 * 직접 만들면 언어를 추가할 때마다 이 로직을 다시 써야 한다.
 *
 * 사용자가 여러 시간대에 흩어져 있으므로 절대 시각은 항상 ISO(UTC 기준)로 받는다.
 */

const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** 1분 미만은 단위를 바꾸지 않고 "just now" 로 수렴시킨다 */
const JUST_NOW_MS = 60 * 1000;

/**
 * @param from 대상 시각
 * @param now  기준 시각 — **인자로 받는다.** `Date.now()` 를 안에서 부르면
 *             테스트가 시스템 시계에 의존하게 된다.
 */
export function formatRelativeTime(
  from: Date | string,
  now: Date,
  locale = 'en',
): string {
  const target = typeof from === 'string' ? new Date(from) : from;
  if (Number.isNaN(target.getTime())) return '';

  const diff = target.getTime() - now.getTime();
  const abs = Math.abs(diff);

  if (abs < JUST_NOW_MS) return 'just now';

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const [unit, ms] of UNITS) {
    if (abs >= ms) {
      // 과거는 음수, 미래는 양수 — Intl 이 "ago"/"in" 을 알아서 붙인다
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return 'just now';
}

/** 두 시각 사이의 개월 수 (내림). 최신성 판정에 쓴다. */
export function monthsBetween(from: Date | string, now: Date): number {
  const target = typeof from === 'string' ? new Date(from) : from;
  if (Number.isNaN(target.getTime())) return 0;
  const ms = now.getTime() - target.getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / (30 * 24 * 60 * 60 * 1000));
}
