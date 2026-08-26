import type { Story } from '@ladle/react';
import { Textarea } from './Textarea';

export default { title: 'Forms / Textarea' };

export const Default: Story = () => (
  <div className="max-w-md">
    <Textarea placeholder="Describe your situation…" />
  </div>
);

/** `field-sizing: content` 지원 브라우저에서는 입력에 따라 높이가 자동으로 늘어난다 */
export const AutoGrow: Story = () => (
  <div className="max-w-md">
    <Textarea defaultValue={'입력을 늘려 보세요.\n지원 브라우저에서는 높이가 따라 늘어납니다.'} />
  </div>
);

export const Invalid: Story = () => (
  <div className="max-w-md">
    <Textarea aria-invalid defaultValue="Too short" />
  </div>
);
