import type { Story } from '@ladle/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

export default { title: 'Forms / RadioGroup' };

/**
 * 네이티브 라디오다 — 화살표 키 이동과 상호 배타를 브라우저가 처리한다.
 *
 * Select 와의 선택 기준: 항목이 **5개 이하이고 전부 보여주는 게 나으면** 라디오.
 */
export const Default: Story = () => {
  const [value, setValue] = useState('urgent');
  return (
    <div className="max-w-md">
      <RadioGroup
        legend="Why are you reporting this?"
        description="Urgent reports are reviewed first."
        value={value}
        onChange={setValue}
        options={[
          {
            value: 'urgent',
            label: 'Scam or personal information',
            description: 'Money is being asked for, or someone posted an ID.',
          },
          { value: 'harassment', label: 'Harassment or hate speech' },
          { value: 'spam', label: 'Spam or advertising' },
          { value: 'other', label: 'Something else' },
        ]}
      />
      <p className="mt-3 text-xs text-fg-subtle">선택: {value}</p>
    </div>
  );
};
