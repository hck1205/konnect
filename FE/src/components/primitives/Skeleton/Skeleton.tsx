import { cn } from '@/lib/cn';

export interface SkeletonProps {
  className?: string;
  /** 여러 줄 텍스트 자리 표시자. 마지막 줄은 짧게 잘라 실제 문단처럼 보이게 한다. */
  lines?: number;
}

/**
 * 로딩 자리 표시자.
 *
 * `aria-hidden` 이다 — 스크린리더에 "빈 상자"를 읽어줄 이유가 없다.
 * 로딩 상태 안내는 이걸 감싸는 영역이 `aria-busy` 로 알린다.
 *
 * 애니메이션은 `prefers-reduced-motion` 전역 규칙이 자동으로 멈춘다.
 */
export function Skeleton({ className, lines }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 animate-pulse rounded-sm bg-surface-sunken',
              i === lines - 1 && 'w-2/3',
              className,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('h-4 animate-pulse rounded-sm bg-surface-sunken', className)}
    />
  );
}
