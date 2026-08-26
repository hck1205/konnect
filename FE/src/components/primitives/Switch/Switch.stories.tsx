import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Switch } from './Switch';

export default { title: 'Primitives / Switch' };

/**
 * 체크박스와의 차이: 체크박스는 "제출하면 반영", 스위치는 **즉시 반영**이다.
 * 즉시 반영이 아니면 `Checkbox` 를 쓴다.
 */
export const Default: Story = () => {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Switch
        label="Email notifications"
        description="Get an email when someone answers your question."
        checked={email}
        onChange={(e) => setEmail(e.target.checked)}
      />
      <Switch
        label="Push notifications"
        checked={push}
        onChange={(e) => setPush(e.target.checked)}
      />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled and on" disabled defaultChecked />
    </div>
  );
};
