import type { Story } from '@ladle/react';
import { Popover } from './Popover';
import { Button } from '@/components/primitives/Button';

export default { title: 'Overlays / Popover' };

/**
 * 위치는 CSS 앵커 위치 지정을 쓴다. 미지원 브라우저에서는 화면 상단 중앙으로
 * 떨어지되 **내용은 그대로 읽을 수 있다**(점진적 향상).
 */
export const Default: Story = () => (
  <div className="flex h-48 items-start">
    <Popover
      trigger={(p) => (
        <Button {...p} variant="outline" tone="neutral">
          Filter by visa
        </Button>
      )}
    >
      <p className="px-2 py-1.5 text-sm text-fg-muted">
        Non-modal — the page behind stays interactive.
      </p>
    </Popover>
  </div>
);
