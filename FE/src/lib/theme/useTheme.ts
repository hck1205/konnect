'use client';

import { useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  setTheme,
  subscribe,
} from './theme.store';

/**
 * 현재 테마와 변경 함수.
 *
 * `theme` 은 사용자가 고른 값('system' 포함), `resolvedTheme` 은 실제 적용값이다.
 * 아이콘을 그릴 때는 `theme`(선택을 보여줘야 하므로), 색을 계산할 때는 `resolvedTheme`.
 */
export function useTheme() {
  const { theme, resolved } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { theme, resolvedTheme: resolved, setTheme };
}
