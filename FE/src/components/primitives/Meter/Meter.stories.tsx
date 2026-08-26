import type { Story } from '@ladle/react';
import { Meter } from './Meter';
import { Progress } from '@/components/primitives/Progress';

export default { title: 'Primitives / Meter' };

/**
 * `<progress>` 와 헷갈리기 쉬운데 **의미가 다르다**:
 * - `progress` — 작업의 진행률 (0에서 100%로 간다)
 * - `meter` — 알려진 범위 안의 측정값 (정원 대비 신청자, 점수)
 *
 * 진행이 아닌 값에 progress 를 쓰면 스크린리더가 "진행 중"으로 읽는다.
 */
export const MeterVsProgress: Story = () => (
  <div className="flex max-w-md flex-col gap-6">
    <div>
      <p className="mb-1 text-sm text-fg">Meetup capacity (meter)</p>
      <Meter value={8} max={12} low={4} high={10} optimum={10} label="Meetup capacity" />
      <p className="mt-1 text-xs text-fg-subtle">8 / 12 신청 — 측정값이다</p>
    </div>
    <div>
      <p className="mb-1 text-sm text-fg">Checklist progress (progress)</p>
      <Progress value={3} max={8} label="Checklist progress" showValue />
      <p className="mt-1 text-xs text-fg-subtle">3 / 8 완료 — 진행률이다</p>
    </div>
  </div>
);
