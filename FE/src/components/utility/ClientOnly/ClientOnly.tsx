'use client';

import type { ReactNode } from 'react';
import { useHydrated } from '@/hooks';

export interface ClientOnlyProps {
  children: ReactNode;
  /** 하이드레이션 전에 보여줄 것. 레이아웃이 튀지 않게 같은 크기로 두면 좋다. */
  fallback?: ReactNode;
}

/**
 * 클라이언트에서만 렌더.
 *
 * 서버와 클라이언트의 결과가 **본질적으로 다른** 것에만 쓴다:
 * 현재 시각, localStorage, `window` 크기, 브라우저 기능 감지.
 *
 * ⚠️ 하이드레이션 경고를 없애려고 아무 데나 두르지 않는다. 그러면 그 부분이
 * 서버 렌더에서 빠져 **검색엔진이 못 읽는다** — 검색 유입이 주 채널인
 * 이 서비스에서는 실질적 손해다.
 * → docs/20-product/03-user-journeys.md
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  return useHydrated() ? <>{children}</> : <>{fallback}</>;
}
