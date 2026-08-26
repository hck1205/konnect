import type { Story } from '@ladle/react';
import { Divider } from './Divider';

export default { title: 'Primitives / Divider' };

export const Variants: Story = () => (
  <div className="flex max-w-md flex-col gap-6">
    <Divider />
    <Divider label="or" />
    <div className="flex h-8 items-center gap-3 text-sm text-fg-muted">
      <span>3 answers</span>
      <Divider orientation="vertical" />
      <span>Seoul</span>
      <Divider orientation="vertical" />
      <span>2 days ago</span>
    </div>
  </div>
);
