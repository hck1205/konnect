import type { Story } from '@ladle/react';
import { Input } from './Input';

export default { title: 'Forms / Input' };

export const Sizes: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Input size="sm" placeholder="Small" />
    <Input size="md" placeholder="Medium" />
    <Input size="lg" placeholder="Large" />
  </div>
);

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Input placeholder="Default" />
    <Input defaultValue="With a value" />
    <Input placeholder="Invalid" aria-invalid />
    <Input placeholder="Disabled" disabled />
  </div>
);

/** 한글 입력도 폰트 폴백이 적용되어 자간이 튀지 않아야 한다 */
export const Multilingual: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Input defaultValue="Alien Registration Card" />
    <Input defaultValue="외국인등록증" />
    <Input defaultValue="D-2 비자 연장 questions" />
  </div>
);
