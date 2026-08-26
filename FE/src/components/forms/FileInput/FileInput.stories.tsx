import type { Story } from '@ladle/react';
import { useState } from 'react';
import { FileInput } from './FileInput';
import { Field } from '@/components/forms/Field';

export default { title: 'Forms / FileInput' };

/**
 * 드래그 앤 드롭은 **보조 수단**이다 — 드롭만 되는 업로더는 키보드·터치
 * 사용자에게 존재하지 않는 기능이다. 버튼이 주 경로다.
 *
 * input 은 `sr-only` 로 숨긴다(`display:none` 이면 포커스를 못 받는다).
 */
export const Default: Story = () => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="max-w-md">
      <Field
        label="Attachments"
        description="Screenshots of the form you are stuck on help a lot."
      >
        {() => (
          <FileInput
            files={files}
            onChange={setFiles}
            multiple
            accept="image/*,.pdf"
            maxBytes={2 * 1024 * 1024}
          />
        )}
      </Field>
    </div>
  );
};

export const Disabled: Story = () => (
  <div className="max-w-md">
    <FileInput files={[]} onChange={() => {}} disabled />
  </div>
);
