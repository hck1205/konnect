import type { Story } from '@ladle/react';
import { ClientOnly } from './ClientOnly';
import { Skeleton } from '@/components/primitives/Skeleton';

export default { title: 'Utility / ClientOnly' };

/**
 * 서버와 클라이언트의 결과가 **본질적으로 다른** 것에만 쓴다:
 * 현재 시각, localStorage, window 크기, 기능 감지.
 *
 * ⚠️ 하이드레이션 경고를 없애려고 아무 데나 두르지 않는다.
 * 그러면 그 부분이 서버 렌더에서 빠져 **검색엔진이 못 읽는다** —
 * 검색 유입이 주 채널인 이 서비스에서는 실질적 손해다.
 */
export const Default: Story = () => (
  <div className="max-w-md text-sm text-fg">
    <ClientOnly fallback={<Skeleton className="h-5 w-48" />}>
      <p>
        Viewport width: <strong>{window.innerWidth}px</strong>
      </p>
    </ClientOnly>
  </div>
);
