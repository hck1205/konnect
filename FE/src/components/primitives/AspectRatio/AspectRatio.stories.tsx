import type { Story } from '@ladle/react';
import { AspectRatio } from './AspectRatio';

export default { title: 'Primitives / AspectRatio' };

/** 로딩 전에 자리를 잡아 **레이아웃이 밀리는 것**을 막는다 */
export const Ratios: Story = () => (
  <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
    {[
      [16 / 9, '16 / 9'],
      [1, '1 / 1'],
      [4 / 3, '4 / 3'],
    ].map(([ratio, label]) => (
      <div key={String(label)}>
        <AspectRatio ratio={ratio as number} className="rounded-md bg-surface-sunken">
          <div className="flex h-full items-center justify-center text-sm text-fg-subtle">
            {label}
          </div>
        </AspectRatio>
      </div>
    ))}
  </div>
);
