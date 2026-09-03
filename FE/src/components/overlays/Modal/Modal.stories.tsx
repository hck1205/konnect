import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/primitives/Button';

export default { title: 'Overlays / Modal' };

/**
 * 네이티브 `<dialog>` 다. 열고 나서 확인해 보세요:
 * Tab 이 모달 안에 갇히고, Esc 로 닫히고, 닫으면 트리거로 포커스가 돌아온다.
 * **그 코드는 우리 저장소에 없다** — 브라우저가 한다.
 */
export const Default: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeLabel="Close"
        title="Report this post"
        description="Tell us what is wrong. We review urgent reports first."
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button tone="danger" onClick={() => setOpen(false)}>
              Submit report
            </Button>
          </>
        }
      >
        <p className="text-fg-muted">
          Reports about scams or personal information are handled on an urgent track.
        </p>
      </Modal>
    </>
  );
};

/** 파괴적 확인에서는 배경 클릭으로 닫히지 않게 한다 */
export const DestructiveConfirm: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button tone="danger" variant="outline" onClick={() => setOpen(true)}>
        Delete question
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeLabel="Close"
        closeOnBackdrop={false}
        title="Delete this question?"
        description="Answers written by other people will be removed too."
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button tone="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
};
