'use client';

import { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { createQueryClient } from '@/lib/query-client';
import { ToastHost } from '@/components/feedback/Toast';

/**
 * 앱 전역 Provider.
 * - React Query: 서버 상태/캐시
 * - Jotai: 클라이언트 전역 상태(atoms)
 * - ToastHost: 토스트가 렌더되는 **단 하나의 지점**. 상태는 외부 스토어가 들고 있어
 *   Provider 가 아니라 '호스트'다 — 그래서 react-query onError 처럼 React 밖에서도
 *   토스트를 띄울 수 있다.
 *
 * 테마는 여기에 없다. `useSyncExternalStore` 기반이라 Provider 가 필요 없고,
 * Context 로 감싸면 테마가 바뀔 때 하위 전체가 리렌더된다.
 *
 * 스타일은 Tailwind만 쓴다(런타임 CSS-in-JS 없음) — 스타일 Provider가 없는 이유다.
 */
export function Providers({ children }: PropsWithChildren) {
  // 클라이언트당 1개의 QueryClient 인스턴스 유지
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        {children}
        <ToastHost />
      </JotaiProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
