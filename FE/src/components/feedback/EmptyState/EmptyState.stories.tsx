import type { Story } from '@ladle/react';
import { SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/primitives/Button';

export default { title: 'Feedback / EmptyState' };

/** "결과 없음"만 띄우지 않는다 — 다음 행동을 준다 */
export const NoResults: Story = () => (
  <div className="max-w-xl">
    <EmptyState
      icon={<SearchX className="size-8" />}
      title="No questions match these filters"
      description="Try removing a tag, or ask this question yourself — someone here has probably been through it."
      action={<Button>Ask a question</Button>}
    />
  </div>
);

export const Minimal: Story = () => (
  <div className="max-w-xl">
    <EmptyState title="No notifications yet" />
  </div>
);
