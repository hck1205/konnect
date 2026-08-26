import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  /** 보조 설명 */
  hint?: ReactNode;
  /** 변화량. 부호에 따라 방향 아이콘이 붙는다. */
  delta?: number;
  /** 증가가 좋은 지표인지. 응답 시간처럼 **감소가 좋은** 지표도 있다. */
  higherIsBetter?: boolean;
  className?: string;
}

/**
 * 지표 한 칸.
 *
 * `<dl>` 로 만든다 — 이름-값 쌍이다. `<div>` 두 개로 만들면 스크린리더가
 * 숫자와 라벨의 관계를 알 수 없다.
 *
 * **증가가 항상 좋은 것은 아니다.** "첫 답변까지 시간"은 줄어야 좋다
 * (→ docs/20-product/05-metrics.md). 그래서 `higherIsBetter` 로 색을 뒤집는다.
 * 화살표 방향은 **변화의 방향**을, 색은 **좋고 나쁨**을 나타낸다.
 */
export function Stat({
  label,
  value,
  hint,
  delta,
  higherIsBetter = true,
  className,
}: StatProps) {
  const up = delta !== undefined && delta > 0;
  const good = delta === undefined ? null : up === higherIsBetter;
  const Arrow = up ? ArrowUp : ArrowDown;

  return (
    <dl className={cn('rounded-lg border border-border bg-surface-raised p-4', className)}>
      <dt className="text-sm text-fg-muted">{label}</dt>
      <dd className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums text-fg">{value}</span>
        {delta !== undefined && delta !== 0 ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-sm tabular-nums',
              good ? 'text-success' : 'text-danger',
            )}
          >
            <Arrow className="size-3.5" aria-hidden="true" />
            {Math.abs(delta)}%
            {/* 색만으로 좋고 나쁨을 전달하지 않는다 */}
            <span className="sr-only">{good ? ' (improved)' : ' (worse)'}</span>
          </span>
        ) : null}
      </dd>
      {hint ? <dd className="mt-1 text-xs text-fg-subtle">{hint}</dd> : null}
    </dl>
  );
}
