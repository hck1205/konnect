import type { Story } from '@ladle/react';
import { CloseButton } from './CloseButton';

export default { title: 'Primitives / CloseButton' };

/**
 * 한 화면에 닫기 버튼이 여럿이면 **무엇을 닫는지** 넣는다 —
 * 스크린리더 사용자가 버튼 목록만 훑을 때 "Close" 가 셋이면 구분할 수 없다.
 */
export const Labels: Story = () => (
  <div className="flex items-center gap-4">
    <CloseButton />
    <CloseButton label="Close filters" />
    <CloseButton label="Dismiss notification" tone="danger" />
  </div>
);
