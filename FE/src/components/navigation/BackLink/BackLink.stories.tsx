import type { Story } from '@ladle/react';
import { BackLink } from './BackLink';

export default { title: 'Navigation / BackLink' };

/**
 * **`history.back()` 을 쓰지 않는다.** 검색으로 상세에 바로 착지한 사용자에게는
 * "뒤"가 검색 결과이거나 아예 없다. 실제 상위 경로로 가는 링크여야
 * 새 탭 열기·주소 확인도 정상 동작한다.
 */
export const Default: Story = () => (
  <div className="flex flex-col items-start gap-3">
    <BackLink href="/questions" />
    <BackLink href="/guides/visa">Back to visa guides</BackLink>
  </div>
);
