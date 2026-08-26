import { cn } from '@/lib/cn';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  /** 현재 값을 사람이 읽는 형태로. 없으면 raw 값을 쓴다. */
  formatValue?: (value: number) => ReactNode;
  /** 양끝 라벨 */
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
}

/**
 * 범위 슬라이더 — **네이티브 `<input type="range">`**.
 *
 * div 로 만들면 `role="slider"` + `aria-valuenow/min/max` + 화살표/Home/End/PageUp
 * 키보드 조작을 전부 다시 만들어야 한다. 네이티브는 그걸 이미 한다.
 * 트랙 색은 전역 `accent-color` 토큰이 맞춘다.
 *
 * 현재 값을 **텍스트로도 보여준다** — 슬라이더 위치만으로는 정확한 값을 알 수 없고,
 * 확대해서 보는 사용자에게 특히 그렇다.
 */
export function Slider({
  label,
  formatValue,
  minLabel,
  maxLabel,
  className,
  value,
  ...rest
}: SliderProps) {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-fg">{label}</span>
        <span className="text-sm tabular-nums text-fg-muted">
          {formatValue ? formatValue(numeric) : numeric}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        className="w-full cursor-pointer"
        {...rest}
      />
      {minLabel || maxLabel ? (
        <div className="flex justify-between text-xs text-fg-subtle">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
