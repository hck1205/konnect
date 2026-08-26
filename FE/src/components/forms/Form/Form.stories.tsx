import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Form } from './Form';
import { FormActions } from '@/components/forms/FormActions';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { Button } from '@/components/primitives/Button';

export default { title: 'Forms / Form' };

/**
 * `pending` 중에는 **`<fieldset disabled>`** 로 안쪽을 통째로 잠근다 —
 * 각 입력에 disabled 를 내려보내는 것보다 정확하고 이중 제출을 막는다.
 *
 * 제출 버튼을 눌러 보세요(2초간 잠깁니다).
 */
export const WithPendingState: Story = () => {
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <div className="max-w-md">
      <Form
        pending={pending}
        onSubmit={() => {
          setPending(true);
          setTimeout(() => setPending(false), 2000);
        }}
      >
        <Field label="Title" required>
          {(aria) => (
            <Input
              {...aria}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Can I change from D-2 to E-7?"
            />
          )}
        </Field>
        <Field label="Details">
          {(aria) => <Textarea {...aria} placeholder="Describe your situation…" />}
        </Field>
        <FormActions
          secondary={
            <Button variant="ghost" tone="neutral" type="button">
              Cancel
            </Button>
          }
          primary={
            <Button type="submit" loading={pending} loadingLabel="Posting">
              Post question
            </Button>
          }
        />
      </Form>
    </div>
  );
};
