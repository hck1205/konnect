import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Steps } from './Steps';
import { Button } from '@/components/primitives/Button';

export default { title: 'Navigation / Steps' };

const ITEMS = [
  { id: 'write', label: 'Write', description: 'Title and details' },
  { id: 'tag', label: 'Add tags', description: 'Visa, region, school' },
  { id: 'review', label: 'Review', description: 'Check before posting' },
];

/**
 * `Timeline` 과의 차이: Timeline 은 **일어난 일의 기록**, Steps 는
 * **지금 진행 중인 절차**의 위치다.
 *
 * 완료 여부를 아이콘·색뿐 아니라 **텍스트로도** 알린다(sr-only).
 */
export const Wizard: Story = () => {
  const [current, setCurrent] = useState(1);
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Steps label="Post a question" items={ITEMS} current={current} />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          tone="neutral"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={current >= ITEMS.length}
          onClick={() => setCurrent((c) => c + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const AllComplete: Story = () => (
  <div className="max-w-2xl">
    <Steps label="Post a question" items={ITEMS} current={ITEMS.length} />
  </div>
);
