import type { Story } from '@ladle/react';
import { Kbd } from './Kbd';

export default { title: 'Primitives / Kbd' };

export const Default: Story = () => (
  <p className="text-sm text-fg-muted">
    <Kbd>Enter</Kbd> 또는 <Kbd>,</Kbd> 로 태그를 확정하고, 입력이 빈 상태에서{' '}
    <Kbd>Backspace</Kbd> 로 마지막 태그를 지웁니다.
  </p>
);
