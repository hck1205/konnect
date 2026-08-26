'use client';

import { useHydrated } from '@/hooks/useHydrated';
import { formatRelativeTime } from './RelativeTime.utils';

export interface RelativeTimeProps {
  /** ISO 문자열 권장 — 사용자가 여러 시간대에 흩어져 있다 */
  value: string | Date;
  locale?: string;
  className?: string;
}

/**
 * "3 days ago" 표시.
 *
 * `<time datetime>` 시맨틱 요소를 쓴다 — 기계가 읽을 수 있는 절대 시각이 남는다.
 * `title` 에 절대 시각을 넣어 마우스로 정확한 값을 확인할 수 있게 한다.
 *
 * **하이드레이션 주의**: 서버와 클라이언트의 "지금"이 달라 서버 렌더 결과와
 * 어긋날 수 있다. 그래서 하이드레이션 전에는 절대 시각을, 이후에 상대 시각을 보여준다.
 * (`suppressHydrationWarning` 으로 덮는 것은 불일치를 숨길 뿐 고치지 않는다)
 */
export function RelativeTime({ value, locale, className }: RelativeTimeProps) {
  const hydrated = useHydrated();
  const date = typeof value === 'string' ? new Date(value) : value;
  const iso = Number.isNaN(date.getTime()) ? undefined : date.toISOString();

  return (
    <time dateTime={iso} title={iso} className={className}>
      {hydrated ? formatRelativeTime(date, new Date(), locale) : (iso?.slice(0, 10) ?? '')}
    </time>
  );
}
