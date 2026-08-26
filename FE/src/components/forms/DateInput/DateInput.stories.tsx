import type { Story } from '@ladle/react';
import { DateInput } from './DateInput';
import { Field } from '@/components/forms/Field';

export default { title: 'Forms / DateInput' };

/**
 * 네이티브 피커라 **사용자의 로케일 형식**을 따른다.
 * konnect 사용자는 국적이 제각각이라 이게 특히 중요하다 —
 * `03/04` 가 3월 4일인지 4월 3일인지는 나라마다 다르다.
 *
 * 값은 항상 `YYYY-MM-DD`(ISO) 라 서버로 보낼 때 변환이 필요 없다.
 */
export const Default: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Field label="Arrival date">{(aria) => <DateInput {...aria} />}</Field>
    <Field
      label="Meetup starts at"
      description="Times are shown in your local timezone."
    >
      {(aria) => <DateInput {...aria} withTime />}
    </Field>
  </div>
);
