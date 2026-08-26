import type { Story } from '@ladle/react';
import { FormActions } from './FormActions';
import { Button } from '@/components/primitives/Button';

export default { title: 'Forms / FormActions' };

/** 파괴적 행동은 **반대편 끝**에 둔다 — 제출 옆의 삭제 버튼은 언젠가 잘못 눌린다 */
export const WithDestructive: Story = () => (
  <div className="max-w-md rounded-lg border border-border p-4">
    <FormActions
      destructive={
        <Button variant="ghost" tone="danger">
          Delete question
        </Button>
      }
      secondary={
        <Button variant="ghost" tone="neutral">
          Cancel
        </Button>
      }
      primary={<Button>Save changes</Button>}
    />
  </div>
);

export const Simple: Story = () => (
  <div className="max-w-md rounded-lg border border-border p-4">
    <FormActions
      secondary={
        <Button variant="ghost" tone="neutral">
          Cancel
        </Button>
      }
      primary={<Button>Submit</Button>}
    />
  </div>
);
