import type { Story } from '@ladle/react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { IconButton } from '@/components/primitives/IconButton';

export default { title: 'Overlays / Tooltip' };

/**
 * ⚠️ **필수 정보를 툴팁에 두지 않는다.**
 * 터치 기기에는 hover 가 없고, 화면 확대 시 잘리며, 인지 부담을 늘린다.
 * 꼭 필요한 설명은 `Field` 의 `description` 처럼 항상 보이는 곳에 둔다.
 *
 * 이 툴팁은 hover 뿐 아니라 **클릭·키보드로도 열린다**(Popover API).
 * hover 전용 툴팁은 터치·키보드 사용자에게 존재하지 않는 것과 같다.
 */
export const Default: Story = () => (
  <div className="flex h-40 items-start gap-3">
    <Tooltip
      content="Cursor pagination has no page numbers because the total count is unknown."
      trigger={(p) => (
        <IconButton {...p} icon={<Info className="size-4" />} label="Why no page numbers?" />
      )}
    />
    <p className="text-sm text-fg-muted">아이콘을 클릭하거나 Tab 후 Enter 를 눌러 보세요.</p>
  </div>
);
