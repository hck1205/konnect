import type { Story } from '@ladle/react';
import { Stat } from './Stat';

export default { title: 'Data display / Stat' };

/**
 * **증가가 항상 좋은 것은 아니다.** "첫 답변까지 시간"은 줄어야 좋다.
 * 화살표는 **변화의 방향**을, 색은 **좋고 나쁨**을 나타낸다 —
 * 아래 두 번째 카드는 화살표가 아래인데 색이 초록이다.
 * → docs/20-product/05-metrics.md
 */
export const Metrics: Story = () => (
  <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
    <Stat label="Answered questions" value="78%" delta={6} hint="지난 30일" />
    <Stat
      label="Time to first answer"
      value="4.2h"
      delta={-18}
      higherIsBetter={false}
      hint="중앙값"
    />
    <Stat label="Answerers returning" value="41%" delta={-3} hint="7일 내 재방문" />
  </div>
);

export const WithoutDelta: Story = () => (
  <div className="max-w-xs">
    <Stat label="Open reports" value={3} hint="긴급 트랙 1건" />
  </div>
);
