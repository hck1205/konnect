import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/primitives/Spinner';

export interface LoadingStateProps {
  /** 무엇을 불러오는 중인지. 스크린리더에 읽힌다. */
  label?: string;
  /** 스켈레톤 등 자리 표시자. 주면 스피너 대신 이걸 보여준다. */
  children?: ReactNode;
  className?: string;
}

/**
 * 로딩 중인 영역.
 *
 * `aria-busy` + `aria-live="polite"` 라 로딩이 끝났을 때 스크린리더가 알 수 있다.
 * 스피너 자체가 아니라 **영역이** 로딩 상태를 알리는 것이 핵심이다 —
 * 스피너에 role 을 붙이면 스피너가 사라질 때 안내도 함께 사라진다.
 *
 * 가능하면 `children` 에 `Skeleton` 을 넘긴다. 스피너는 레이아웃이 얼마나
 * 커질지 알려주지 않아 로딩 후 화면이 튄다.
 */
export function LoadingState({
  label = 'Loading',
  children,
  className,
}: LoadingStateProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(children ? undefined : 'flex items-center justify-center py-10', className)}
    >
      <span className="sr-only">{label}</span>
      {children ?? <Spinner size="lg" />}
    </div>
  );
}
