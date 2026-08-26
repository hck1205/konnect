import type { Story } from '@ladle/react';
import { Checkbox } from './Checkbox';

export default { title: 'Forms / Checkbox' };

/** 강조색은 전역 `accent-color` 토큰이 맞춘다 — 컨트롤을 재구현하지 않는다 */
export const Default: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Checkbox label="Notify me when someone answers" defaultChecked />
    <Checkbox
      label="Subscribe to this tag"
      description="You will get a notification when a new question is tagged D-2."
    />
    <Checkbox label="Disabled option" disabled />
    <Checkbox label="Disabled and checked" disabled defaultChecked />
  </div>
);
