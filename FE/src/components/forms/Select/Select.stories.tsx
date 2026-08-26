import type { Story } from '@ladle/react';
import { Select } from './Select';

export default { title: 'Forms / Select' };

const VISA_OPTIONS = [
  { value: 'd-2', label: 'D-2 (Student)' },
  { value: 'd-4', label: 'D-4 (General trainee)' },
  { value: 'e-7', label: 'E-7 (Specific activity)' },
  { value: 'd-10', label: 'D-10 (Job seeker)' },
  { value: 'f-2', label: 'F-2 (Residence)' },
];

/** 네이티브 `<select>` 다 — 모바일에서는 OS 기본 피커가 뜬다 */
export const Default: Story = () => (
  <div className="max-w-md">
    <Select options={VISA_OPTIONS} defaultValue="d-2" />
  </div>
);

export const WithPlaceholder: Story = () => (
  <div className="max-w-md">
    <Select options={VISA_OPTIONS} placeholder="Select your visa type" defaultValue="" />
  </div>
);

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Select options={VISA_OPTIONS} />
    <Select options={VISA_OPTIONS} aria-invalid />
    <Select options={VISA_OPTIONS} disabled />
  </div>
);
