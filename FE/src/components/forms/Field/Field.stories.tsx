import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Field } from './Field';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';

export default { title: 'Forms / Field' };

/**
 * Field 는 레이블·설명·에러를 입력에 **올바르게 연결**하는 것이 전부다.
 * render prop 으로 받은 aria 를 그대로 펼치면 배선이 끝난다.
 */
export const Anatomy: Story = () => (
  <div className="flex max-w-md flex-col gap-6">
    <Field label="Nickname">{(aria) => <Input {...aria} placeholder="Amar" />}</Field>

    <Field
      label="Nickname"
      description="This is how other members will see you. You can change it later."
      required
    >
      {(aria) => <Input {...aria} placeholder="Amar" />}
    </Field>

    <Field
      label="Nickname"
      description="Letters, numbers, and hyphens only."
      error="This nickname is already taken."
      required
    >
      {(aria) => <Input {...aria} defaultValue="amar" />}
    </Field>
  </div>
);

/** placeholder 를 레이블 대신 쓰지 않는다 — 입력을 시작하면 사라진다 */
export const WithTextarea: Story = () => {
  const [value, setValue] = useState('');
  return (
    <div className="max-w-md">
      <Field
        label="What is your question?"
        description="Include your visa type and how long you have been in Korea."
        error={value.length > 0 && value.length < 20 ? 'Please add more detail.' : undefined}
      >
        {(aria) => (
          <Textarea
            {...aria}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="I am on a D-2 visa and…"
          />
        )}
      </Field>
    </div>
  );
};
