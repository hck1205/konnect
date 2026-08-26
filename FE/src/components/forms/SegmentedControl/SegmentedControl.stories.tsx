import type { Story } from '@ladle/react';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

export default { title: 'Forms / SegmentedControl' };

/**
 * **라디오 버튼이다** — 보이는 모양만 다르다. 스크린리더가
 * "3개 중 2번째 선택됨"을 읽고, 화살표 키로 이동한다.
 *
 * `Tabs` 와의 차이: Tabs 는 화면 영역을 바꾸는 **내비게이션**, 이건 값을 고르는 **입력**이다.
 */
export const SortOrder: Story = () => {
  const [sort, setSort] = useState('recent');
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl
        label="Sort questions by"
        value={sort}
        onChange={setSort}
        options={[
          { value: 'recent', label: 'Recent' },
          { value: 'unanswered', label: 'Unanswered' },
          { value: 'active', label: 'Active' },
        ]}
      />
      <SegmentedControl
        size="sm"
        label="Time range"
        value={sort}
        onChange={setSort}
        options={[
          { value: 'recent', label: 'Week' },
          { value: 'unanswered', label: 'Month' },
          { value: 'active', label: 'All time' },
        ]}
      />
    </div>
  );
};
