import { cn } from '@/lib/cn';
import { number } from '@/utils';

export interface ProgressProps {
  /** 완료 개수 */
  value: number;
  /** 전체 개수. 0이면 진행률은 0으로 수렴한다. */
  max: number;
  /** 접근 가능한 이름. 무엇의 진행률인지 알려준다. */
  label: string;
  /** 퍼센트 텍스트를 함께 보여줄지 */
  showValue?: boolean;
  className?: string;
}

/**
 * 진행률 표시 — **네이티브 `<progress>`**.
 *
 * div 두 개로 그리면 `role="progressbar"` 와 aria-value* 를 직접 붙여야 하고,
 * 빠뜨리기 쉽다. 네이티브 요소는 그걸 이미 한다.
 * 색은 전역 `accent-color` 토큰이 맞춰 준다.
 *
 * konnect 에서는 체크리스트 진행률(도착 전 / 정착기)에 쓴다.
 */
export function Progress({
  value,
  max,
  label,
  showValue,
  className,
}: ProgressProps) {
  const percent = number.percentage(value, max);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <progress
        value={value}
        max={max || 1}
        aria-label={label}
        className="h-2 flex-1 overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-surface-sunken [&::-webkit-progress-value]:bg-brand-solid [&::-moz-progress-bar]:bg-brand-solid"
      />
      {showValue ? (
        <span className="shrink-0 text-sm tabular-nums text-fg-muted">{percent}%</span>
      ) : null}
    </div>
  );
}
