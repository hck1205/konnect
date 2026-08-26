import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/primitives/Button';
import { Card, CardTitle } from '@/components/data-display/Card';

export default { title: 'Utility / ErrorBoundary' };

function Boom({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Comments failed to render');
  return <p className="text-sm text-fg-muted">댓글 목록이 정상 렌더된 상태입니다.</p>;
}

/**
 * 경계를 **화면 단위가 아니라 영역 단위**로 두는 것이 요령이다.
 * 아래에서 댓글이 깨져도 질문 본문은 남는다 — 검색으로 들어온 사용자가
 * 답을 못 읽으면 안 된다.
 *
 * ⚠️ 이벤트 핸들러·비동기 코드의 에러는 잡지 못한다(React 의 한계).
 */
export const IsolatesOneRegion: Story = () => {
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Button size="sm" variant="outline" tone="danger" onClick={() => setBroken(true)}>
        댓글 영역 깨뜨리기
      </Button>

      <Card>
        <CardTitle>Can I change from D-2 to E-7 before I graduate?</CardTitle>
        <p className="mt-2 text-sm text-fg-muted">
          이 본문은 댓글이 깨져도 그대로 남아야 한다.
        </p>
      </Card>

      <ErrorBoundary>
        <Boom shouldThrow={broken} />
      </ErrorBoundary>
    </div>
  );
};
