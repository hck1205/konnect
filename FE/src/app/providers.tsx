'use client';

import { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { createQueryClient } from '@/lib/query-client';

/**
 * 앱 전역 Provider.
 * - React Query: 서버 상태/캐시
 * - Jotai: 클라이언트 전역 상태(atoms)
 * 스타일은 Tailwind만 쓴다(런타임 CSS-in-JS 없음) — 스타일 Provider가 없는 이유다.
 */
export function Providers({ children }: PropsWithChildren) {
  // 클라이언트당 1개의 QueryClient 인스턴스 유지
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>{children}</JotaiProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
