import type { Story } from '@ladle/react';
import { StatusDot } from './StatusDot';
import type { Tone } from '@/types/ui';

export default { title: 'Primitives / StatusDot' };

const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

/**
 * 점 자체는 색뿐이라 **접근 가능한 이름이 필수**다.
 * 색각 이상 사용자에게 초록 점과 빨강 점은 같은 회색 점이다.
 */
export const Tones: Story = () => (
  <div className="flex flex-col gap-2">
    {TONES.map((tone) => (
      <span key={tone} className="flex items-center gap-2 text-sm text-fg">
        <StatusDot tone={tone} label={`Status: ${tone}`} />
        {tone}
      </span>
    ))}
  </div>
);

/** 옆에 같은 뜻의 텍스트가 이미 있으면 `decorative` — 두 번 읽히지 않게 */
export const Decorative: Story = () => (
  <p className="flex items-center gap-2 text-sm text-fg">
    <StatusDot tone="success" label="Answered" decorative />
    Answered
  </p>
);
