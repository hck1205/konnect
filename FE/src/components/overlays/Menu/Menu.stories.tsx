import type { Story } from '@ladle/react';
import { Flag, Link2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Menu, MenuItem, MenuSeparator } from './Menu';
import { IconButton } from '@/components/primitives/IconButton';

export default { title: 'Overlays / Menu' };

/**
 * 네이티브 Popover API 위에 얹었다 — **열림 상태를 위한 JS 가 없다.**
 * 바깥 클릭과 Esc 를 브라우저가 처리한다.
 */
export const Default: Story = () => (
  <div className="flex h-48 items-start">
    <Menu
      trigger={(p) => (
        <IconButton
          {...p}
          icon={<MoreHorizontal className="size-4" />}
          label="More actions"
        />
      )}
    >
      <MenuItem icon={<Link2 className="size-4" />}>Copy link</MenuItem>
      <MenuItem icon={<Flag className="size-4" />}>Report</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Trash2 className="size-4" />} destructive>
        Delete
      </MenuItem>
    </Menu>
  </div>
);
