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

/** 1,234 처럼 자릿수 구분 — 목록의 카운트 표기에 쓴다 */
export const formatCount = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);
