import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ReportDialog } from './ReportDialog';
import { Button } from '@/components/primitives/Button';
import type { ReportSubmission } from './ReportDialog.types';

export default { title: 'Community / ReportDialog' };

/**
 * 사유를 고르면 **긴급 트랙인지 즉시 알려준다** — 신고가 어딘가로 사라지는 느낌을
 * 주지 않는 것이 중요하다. 사기 피해를 당하는 중인 사용자에게 "먼저 검토됩니다"는
 * 실질적인 안심이다.
 *
 * 사기·개인정보·괴롭힘을 고르면 안내 배너가 나타나고, 스팸·광고를 고르면 사라진다.
 */
export const Default: Story = () => {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<ReportSubmission | null>(null);

  return (
    <div className="flex flex-col items-start gap-3">
      <Button tone="danger" variant="outline" onClick={() => setOpen(true)}>
        신고 창 열기
      </Button>
      {last ? (
        <pre className="rounded-md bg-surface-sunken p-3 font-mono text-xs text-fg-muted">
          {JSON.stringify(last, null, 2)}
        </pre>
      ) : null}
      <ReportDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={setLast}
        targetLabel="Can I change from D-2 to E-7 before I graduate?"
      />
    </div>
  );
};
