import type { Story } from '@ladle/react';
import { ToastHost } from './ToastHost';
import { clearToasts, showToast } from './toast.store';
import { Button } from '@/components/primitives/Button';

export default { title: 'Feedback / Toast' };

/**
 * 스토어가 모듈 단위라 **React 밖에서도** 띄울 수 있다 —
 * react-query 의 `onError` 는 컴포넌트가 아니라 라이브러리가 부르는 콜백이라
 * 훅을 쓸 수 없기 때문이다.
 *
 * `ToastHost` 는 앱 루트에 **한 번만** 둔다.
 */
export const Tones: Story = () => (
  <>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => showToast('Your question was posted.', { tone: 'success' })}>
        success
      </Button>
      <Button size="sm" tone="neutral" variant="outline" onClick={() => showToast('Tag subscription updated.')}>
        info
      </Button>
      <Button size="sm" tone="neutral" variant="outline" onClick={() => showToast('This guide was last verified 14 months ago.', { tone: 'warning' })}>
        warning
      </Button>
      <Button size="sm" tone="danger" variant="outline" onClick={() => showToast('Could not save. Check your connection.', { tone: 'danger' })}>
        danger (자동으로 안 사라짐)
      </Button>
      <Button size="sm" tone="neutral" variant="ghost" onClick={clearToasts}>
        모두 지우기
      </Button>
    </div>
    <ToastHost />
  </>
);

/** 최대 3개까지만 유지하고 오래된 것을 밀어낸다 — 화면을 토스트로 덮지 않는다 */
export const MaxVisible: Story = () => (
  <>
    <Button
      onClick={() => {
        clearToasts();
        for (let i = 1; i <= 5; i++) showToast(`Message ${i}`, { durationMs: 0 });
      }}
    >
      5개 띄우기 → 3개만 남는다
    </Button>
    <ToastHost />
  </>
);
