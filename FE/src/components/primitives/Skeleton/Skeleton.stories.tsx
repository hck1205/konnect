import type { Story } from '@ladle/react';
import { Skeleton } from './Skeleton';

export default { title: 'Primitives / Skeleton' };

export const TextLines: Story = () => (
  <div className="max-w-md">
    <Skeleton lines={4} />
  </div>
);

/** 실제 목록 카드의 골격을 흉내 낸다 — 로딩 후 레이아웃이 튀지 않아야 한다 */
export const CardPlaceholder: Story = () => (
  <div className="max-w-md rounded-lg border border-border bg-surface-raised p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="mt-4">
      <Skeleton lines={3} />
    </div>
  </div>
);
