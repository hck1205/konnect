import { cn } from '@/lib/cn';

export interface MeterProps {
  value: number;
  min?: number;
  max?: number;
  /** 이 값 아래는 낮음(경고)으로 본다 */
  low?: number;
  /** 이 값 위는 높음으로 본다 */
  high?: number;
  /** 이상적인 값. 브라우저가 이걸 기준으로 색을 정한다. */
  optimum?: number;
  label: string;
  className?: string;
}

/**
 * 측정값 표시 — **네이티브 `<meter>`**.
 *
 * `<progress>` 와 헷갈리기 쉬운데 의미가 다르다:
 * - `<progress>` : 작업의 **진행률** (0에서 시작해 100%로 간다)
 * - `<meter>`    : 알려진 범위 안의 **측정값** (디스크 사용량, 점수, 정원 대비 신청자)
 *
 * 진행이 아닌 값에 progress 를 쓰면 스크린리더가 "진행 중"으로 읽는다.
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  label,
  className,
}: MeterProps) {
  return (
    <meter
      value={value}
      min={min}
      max={max}
      low={low}
      high={high}
      optimum={optimum}
      aria-label={label}
      className={cn('h-2 w-full', className)}
    >
      {value} / {max}
    </meter>
  );
}
