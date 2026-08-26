import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ConfirmDialogHost } from './ConfirmDialogHost';
import { confirm } from './confirm.store';
import { Button } from '@/components/primitives/Button';

export default { title: 'Overlays / ConfirmDialog' };

/**
 * `window.confirm` 을 대체한다 — 브라우저 기본 confirm 은 스타일을 못 바꾸고,
 * 모바일에서 도메인이 노출되며, **Promise 를 돌려주지 않아** 흐름이 끊긴다.
 *
 * ```ts
 * if (await confirm({ title: 'Delete this question?', destructive: true })) { … }
 * ```
 *
 * Esc 는 **취소**로 해석한다. 파괴적 확인은 배경 클릭으로 닫히지 않는다.
 */
export const Await: Story = () => {
  const [result, setResult] = useState<string>('(아직 없음)');

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <Button
          onClick={async () => {
            const ok = await confirm({
              title: 'Post this question?',
              description: 'You can edit it afterwards.',
              confirmLabel: 'Post',
            });
            setResult(ok ? 'confirmed' : 'cancelled');
          }}
        >
          일반 확인
        </Button>

        <Button
          tone="danger"
          variant="outline"
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete this question?',
              description: 'Answers written by other people will be removed too.',
              confirmLabel: 'Delete',
              destructive: true,
            });
            setResult(ok ? 'deleted' : 'cancelled');
          }}
        >
          파괴적 확인
        </Button>

        <p className="text-sm text-fg-muted">결과: {result}</p>
      </div>
      <ConfirmDialogHost />
    </>
  );
};
