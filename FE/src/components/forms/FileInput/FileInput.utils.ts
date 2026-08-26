export interface FileSelection {
  accepted: File[];
  /** 크기 초과로 걸러진 파일 이름 */
  rejected: string[];
}

/**
 * 파일 선택 결과를 걸러낸다 — 순수 함수.
 *
 * 컴포넌트 안에 있으면 검증할 수 없는데, **여기가 실제로 틀리기 쉬운 부분**이다:
 * 단일 선택인데 여러 개를 받거나, 기존 목록에 덮어쓰거나, 걸러진 이유를
 * 사용자에게 안 알리거나.
 */
export function selectFiles(
  current: readonly File[],
  incoming: readonly File[],
  options: { multiple?: boolean; maxBytes?: number } = {},
): FileSelection {
  const { multiple = false, maxBytes } = options;

  const accepted: File[] = [];
  const rejected: string[] = [];

  for (const file of incoming) {
    if (maxBytes !== undefined && file.size > maxBytes) rejected.push(file.name);
    else accepted.push(file);
  }

  // 단일 선택이면 **기존을 대체**한다. 이어붙이면 max 가 없는 것과 같아진다.
  return {
    accepted: multiple ? [...current, ...accepted] : accepted.slice(0, 1),
    rejected,
  };
}

/**
 * 바이트 → 사람이 읽는 크기.
 *
 * 로케일 숫자 형식을 따른다 — 베트남어는 소수점이 쉼표다.
 * 단위(B/KB/MB)는 번역하지 않는다. 국제적으로 통용되는 표기이고,
 * 번역하면 오히려 못 알아본다.
 */
export function formatBytes(bytes: number, locale = 'en'): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = Math.max(bytes, 0);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  return `${formatted} ${units[unit]}`;
}
