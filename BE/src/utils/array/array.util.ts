/**
 * 배열 primitive 유틸 — 순수 함수(원본 불변).
 */

export const head = <T>(list: readonly T[]): T | undefined => list[0];

export const last = <T>(list: readonly T[]): T | undefined =>
  list[list.length - 1];

export const compact = <T>(
  list: readonly (T | null | undefined | false | 0 | '')[],
): T[] => list.filter(Boolean) as T[];

export const unique = <T>(list: readonly T[]): T[] => [...new Set(list)];

export const chunk = <T>(list: readonly T[], size: number): T[][] => {
  if (size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
};

export const groupBy = <T, K extends PropertyKey>(
  list: readonly T[],
  keyFn: (item: T) => K,
): Record<K, T[]> =>
  list.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
