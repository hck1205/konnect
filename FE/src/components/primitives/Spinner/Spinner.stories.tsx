import type { Story } from '@ladle/react';
import { Spinner } from './Spinner';

export default { title: 'Primitives / Spinner' };

/** `currentColor` 를 따르므로 부모의 text 색이 그대로 적용된다 */
export const Sizes: Story = () => (
  <div className="flex items-center gap-4 text-fg">
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>
);

export const InheritsColor: Story = () => (
  <div className="flex items-center gap-4">
    <span className="text-brand">
      <Spinner />
    </span>
    <span className="text-danger">
      <Spinner />
    </span>
    <span className="text-fg-subtle">
      <Spinner />
    </span>
  </div>
);
