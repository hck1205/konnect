import type { Story } from '@ladle/react';
import { Progress } from './Progress';

export default { title: 'Primitives / Progress' };

/** 네이티브 `<progress>` 다 — aria-value* 를 직접 붙이지 않아도 된다 */
export const Steps: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Progress value={0} max={8} label="Before arrival checklist" showValue />
    <Progress value={3} max={8} label="Before arrival checklist" showValue />
    <Progress value={8} max={8} label="Before arrival checklist" showValue />
  </div>
);

/** max 가 0이어도 0%로 수렴한다 — 0으로 나누지 않는다 */
export const EmptyList: Story = () => (
  <div className="max-w-md">
    <Progress value={0} max={0} label="Empty checklist" showValue />
  </div>
);
