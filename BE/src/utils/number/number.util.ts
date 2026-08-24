/**
 * 숫자 primitive 유틸 — 순수 함수.
 */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/** 0으로 나누기를 0으로 수렴시키는 안전한 백분율(0~100, 반올림) */
export const percentage = (part: number, total: number): number =>
  total <= 0 ? 0 : Math.round(clamp(part / total, 0, 1) * 100);

/** 파싱 실패(NaN 포함)를 fallback 으로 수렴시키는 정수 파서 — 쿼리 파라미터용 */
export const toInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
};
