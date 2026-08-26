import type { Story } from '@ladle/react';
import { Bell, MoreHorizontal, Trash2 } from 'lucide-react';
import { IconButton } from './IconButton';

export default { title: 'Primitives / IconButton' };

/**
 * `label` 은 **필수 prop** 이다 — 아이콘만으로는 의미가 전달되지 않는다.
 * a11y 애드온을 켜고 확인하면 접근 가능한 이름이 붙어 있는 것을 볼 수 있다.
 */
export const Default: Story = () => (
  <div className="flex items-center gap-3">
    <IconButton icon={<Bell className="size-4" />} label="Notifications" />
    <IconButton icon={<MoreHorizontal className="size-4" />} label="More actions" />
    <IconButton
      icon={<Trash2 className="size-4" />}
      label="Delete question"
      tone="danger"
    />
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <IconButton icon={<Bell className="size-3.5" />} label="Notifications" size="sm" />
    <IconButton icon={<Bell className="size-4" />} label="Notifications" size="md" />
    <IconButton icon={<Bell className="size-5" />} label="Notifications" size="lg" />
  </div>
);

export const Variants: Story = () => (
  <div className="flex items-center gap-3">
    <IconButton icon={<Bell className="size-4" />} label="Ghost" variant="ghost" />
    <IconButton icon={<Bell className="size-4" />} label="Subtle" variant="subtle" />
    <IconButton icon={<Bell className="size-4" />} label="Outline" variant="outline" />
    <IconButton
      icon={<Bell className="size-4" />}
      label="Solid"
      variant="solid"
      tone="brand"
    />
  </div>
);
