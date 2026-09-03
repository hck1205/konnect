import type { Story } from '@ladle/react';
import { SkipLink } from './SkipLink';

export default { title: 'Layout / SkipLink' };

/**
 * **Tab 키를 눌러 보세요.** 평소에는 화면 밖에 있다가 포커스를 받으면 나타난다.
 *
 * `display:none` 으로 숨기면 포커스를 받을 수 없어 목적이 사라진다.
 */
export const Default: Story = () => (
  <div className="relative">
    <SkipLink>Skip to content</SkipLink>
    <p className="mt-2 text-sm text-fg-muted">
      이 스토리에 포커스를 두고 Tab 을 누르면 좌측 상단에 링크가 나타납니다.
    </p>
    <div id="main-content" tabIndex={-1} className="mt-8 rounded-md bg-surface-sunken p-4 text-sm">
      main-content (tabIndex=-1 이라 포커스를 받을 수 있다)
    </div>
  </div>
);
