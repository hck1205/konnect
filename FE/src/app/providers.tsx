'use client';

import { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { createQueryClient } from '@/lib/query-client';
import { LocaleProvider, type Locale } from '@/lib/i18n';
import { ToastHost } from '@/components/feedback/Toast';
import { ConfirmDialogHost } from '@/components/overlays/ConfirmDialog';

/**
 * 앱 전역 Provider.
 * - LocaleProvider: 번역·포맷 (로케일은 서버에서 URL 세그먼트로 결정되어 내려온다)
 * - React Query: 서버 상태/캐시
 * - Jotai: 클라이언트 전역 상태(atoms)
 * - ToastHost / ConfirmDialogHost: 각각이 렌더되는 **단 하나의 지점**.
 *   상태는 외부 스토어가 들고 있어 Provider 가 아니라 '호스트'다 — 그래서
 *   react-query onError 처럼 React 밖에서도 띄울 수 있다.
 *
 * 테마는 여기에 없다. `useSyncExternalStore` 기반이라 Provider 가 필요 없고,
 * Context 로 감싸면 테마가 바뀔 때 하위 전체가 리렌더된다.
 */
export function Providers({
  locale,
  children,
}: PropsWithChildren<{ locale: Locale }>) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <LocaleProvider locale={locale}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          {children}
          <ToastHost />
          <ConfirmDialogHost />
        </JotaiProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </LocaleProvider>
  );
}
