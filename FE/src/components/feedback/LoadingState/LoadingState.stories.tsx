import type { Story } from '@ladle/react';
import { LoadingState } from './LoadingState';
import { Skeleton } from '@/components/primitives/Skeleton';

export default { title: 'Feedback / LoadingState' };

/**
 * **영역이** 로딩 상태를 알린다(스피너가 아니라). 스피너에 role 을 붙이면
 * 스피너가 사라질 때 안내도 함께 사라진다.
 *
 * 가능하면 스켈레톤을 넘긴다 — 스피너는 레이아웃이 얼마나 커질지 알려주지 않아
 * 로딩 후 화면이 튄다.
 */
export const WithSkeleton: Story = () => (
  <div className="max-w-md rounded-lg border border-border bg-surface-raised p-4">
    <LoadingState label="Loading questions">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton lines={3} />
      </div>
    </LoadingState>
  </div>
);

export const SpinnerFallback: Story = () => (
  <div className="max-w-md rounded-lg border border-border">
    <LoadingState label="Loading" />
  </div>
);
