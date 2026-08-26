import type { Story } from '@ladle/react';
import { Fieldset } from './Fieldset';
import { Checkbox } from '@/components/forms/Checkbox';

export default { title: 'Forms / Fieldset' };

/**
 * 스크린리더가 그룹 안의 각 입력을 읽을 때 legend 를 함께 읽는다
 * ("Notifications, Email notifications" 처럼). `<div>` + `<h3>` 로는 그 연결이 없다.
 */
export const Default: Story = () => (
  <div className="max-w-md">
    <Fieldset
      legend="Notifications"
      description="You can change these at any time."
    >
      <Checkbox label="Someone answers my question" defaultChecked />
      <Checkbox label="Someone mentions me" />
      <Checkbox label="Weekly digest" />
    </Fieldset>
  </div>
);

/** `disabled` 하나로 안쪽 입력이 전부 비활성화된다 — 브라우저가 처리한다 */
export const DisabledGroup: Story = () => (
  <div className="max-w-md">
    <Fieldset legend="Notifications" description="Sign in to change these." disabled>
      <Checkbox label="Someone answers my question" defaultChecked />
      <Checkbox label="Weekly digest" />
    </Fieldset>
  </div>
);
