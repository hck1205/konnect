import type { Story } from '@ladle/react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from './Badge';
import type { Tone } from '@/types/ui';

export default { title: 'Primitives / Badge' };

const TONES: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'];

export const Tones: Story = () => (
  <div className="flex flex-wrap gap-2">
    {TONES.map((tone) => (
      <Badge key={tone} tone={tone}>
        {tone}
      </Badge>
    ))}
  </div>
);

/** 최신성 표시 — 색만으로 구분하지 않기 위해 아이콘을 함께 둔다 */
export const Freshness: Story = () => (
  <div className="flex flex-wrap gap-2">
    <Badge tone="success" icon={<CheckCircle2 className="size-3" />}>
      Verified 2 months ago
    </Badge>
    <Badge tone="warning" icon={<Clock className="size-3" />}>
      Verified 8 months ago
    </Badge>
    <Badge tone="danger" icon={<AlertTriangle className="size-3" />}>
      Verified 2 years ago
    </Badge>
  </div>
);
