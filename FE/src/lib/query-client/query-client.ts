import { QueryClient } from '@tanstack/react-query';

/**
 * React Query 클라이언트 팩토리.
 * SSR 안전을 위해 요청/렌더마다 새 인스턴스를 만들 수 있도록 함수로 제공한다.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분간 fresh
        gcTime: 5 * 60 * 1000, // 5분 후 GC
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
