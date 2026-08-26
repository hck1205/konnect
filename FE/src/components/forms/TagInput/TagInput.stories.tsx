import type { Story } from '@ladle/react';
import { useState } from 'react';
import { TagInput } from './TagInput';
import { Field } from '@/components/forms/Field';

export default { title: 'Forms / TagInput' };

/**
 * Enter · 쉼표 · 붙여넣기(쉼표 구분) · Backspace 를 전부 받는다.
 * 태그는 P0 이라 입력 마찰을 낮추는 것이 이 컴포넌트의 목적이다.
 */
export const Default: Story = () => {
  const [tags, setTags] = useState<string[]>(['visa:d-2', 'region:seoul']);
  return (
    <div className="max-w-md">
      <TagInput value={tags} onChange={setTags} />
      <p className="mt-2 text-xs text-fg-subtle">저장 형태: {JSON.stringify(tags)}</p>
    </div>
  );
};

/** 정규화 후 비교하므로 `D-2` 와 `d_2` 는 같은 태그로 취급되어 중복 추가되지 않는다 */
export const Normalization: Story = () => {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div className="max-w-md">
      <p className="mb-2 text-sm text-fg-muted">
        <code>Visa D_2</code> 와 <code>visa-d-2</code> 를 차례로 입력해 보세요.
      </p>
      <TagInput value={tags} onChange={setTags} />
      <p className="mt-2 text-xs text-fg-subtle">저장 형태: {JSON.stringify(tags)}</p>
    </div>
  );
};

export const WithMaxAndField: Story = () => {
  const [tags, setTags] = useState<string[]>(['visa:e-7']);
  return (
    <div className="max-w-md">
      <Field
        label="Tags"
        description="Add up to 3 tags so the right people can find your question."
        error={tags.length === 0 ? 'At least one tag is required.' : undefined}
      >
        {(aria) => <TagInput {...aria} value={tags} onChange={setTags} max={3} />}
      </Field>
    </div>
  );
};

export const Disabled: Story = () => (
  <div className="max-w-md">
    <TagInput value={['visa:d-2']} onChange={() => {}} disabled />
  </div>
);
