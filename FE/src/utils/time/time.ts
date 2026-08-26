/**
 * 시간 primitive 유틸 — 순수 함수. **로케일과 무관한 계산만** 둔다.
 * 표시 형식(상대 시각, 날짜 포맷)은 로케일이 필요하므로 `lib/i18n/format` 이 맡는다.
 */

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * 두 시각 사이의 개월 수(내림).
 *
 * 30일을 한 달로 근사한다 — 최신성 판정("6개월 이상 지났나")에 쓰이므로
 * 달력상 정확한 개월 수가 필요 없고, 근사가 오히려 경계에서 안정적이다.
 * 미래 시각이면 0.
 */
export function monthsBetween(from: Date | string, now: Date): number {
  const target = typeof from === 'string' ? new Date(from) : from;
  if (Number.isNaN(target.getTime())) return 0;
  const ms = now.getTime() - target.getTime();
  return ms <= 0 ? 0 : Math.floor(ms / MONTH_MS);
}
