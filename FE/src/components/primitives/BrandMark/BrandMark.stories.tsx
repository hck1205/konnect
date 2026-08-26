import type { Story } from '@ladle/react';
import { BrandMark } from './BrandMark';

export default { title: 'Primitives / BrandMark' };

/**
 * ⚠️ **임시 심볼이다.** 실제 로고가 정해지면 이 컴포넌트만 교체한다 —
 * 헤더·푸터가 전부 여기를 거치므로 교체 지점이 하나다.
 */
export const Variants: Story = () => (
  <div className="flex flex-col gap-6">
    <BrandMark />
    <BrandMark showWordmark={false} />
    <div className="rounded-md bg-surface-sunken p-4">
      <BrandMark />
    </div>
  </div>
);
