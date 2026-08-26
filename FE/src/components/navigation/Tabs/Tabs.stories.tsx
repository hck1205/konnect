import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Tabs } from './Tabs';

export default { title: 'Navigation / Tabs' };

const ITEMS = [
  { value: 'questions', label: 'Questions', count: 12 },
  { value: 'answers', label: 'Answers', count: 34 },
  { value: 'guides', label: 'Guides', count: 3 },
];

/**
 * `role="tablist"` 를 쓰므로 **화살표 키가 실제로 동작해야 한다**.
 * ← → 로 이동하고 Home/End 로 양끝으로 갑니다. Tab 키는 탭 목록 밖으로 나갑니다.
 */
export const Default: Story = () => {
  const [tab, setTab] = useState('questions');
  return (
    <div className="max-w-xl">
      <Tabs items={ITEMS} value={tab} onChange={setTab} />
      <div className="p-4 text-sm text-fg-muted">선택된 탭: {tab}</div>
    </div>
  );
};

export const WithoutCounts: Story = () => {
  const [tab, setTab] = useState('all');
  return (
    <div className="max-w-xl">
      <Tabs
        items={[
          { value: 'all', label: 'All' },
          { value: 'unanswered', label: 'Unanswered' },
          { value: 'mine', label: 'Mine' },
        ]}
        value={tab}
        onChange={setTab}
      />
    </div>
  );
};
