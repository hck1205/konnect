/**
 * 불리언 primitive 유틸 — 순수 함수.
 */

/** 'true'|'1'|'yes'|'on' (대소문자 무시)만 true. 그 외/미설정은 fallback */
export const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
