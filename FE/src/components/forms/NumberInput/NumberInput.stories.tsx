import type { Story } from '@ladle/react';
import { NumberInput } from './NumberInput';
import { Field } from '@/components/forms/Field';

export default { title: 'Forms / NumberInput' };

/**
 * ⚠️ 숫자를 **세는** 값에만 쓴다.
 * 전화번호·계좌번호 같은 **식별자**는 앞자리 0 이 사라지고 스피너가 무의미하다 —
 * 그건 `Input` + `inputMode="numeric"` 을 쓴다.
 */
export const Default: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Field label="Months in Korea">
      {(aria) => <NumberInput {...aria} min={0} max={120} defaultValue={6} />}
    </Field>
    <Field label="Monthly rent" description="Enter the amount without commas.">
      {(aria) => <NumberInput {...aria} min={0} step={10000} suffix="KRW" defaultValue={600000} />}
    </Field>
  </div>
);
