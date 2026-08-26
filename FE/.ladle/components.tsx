import type { GlobalProvider } from '@ladle/react';
import { useEffect } from 'react';
import '../src/app/globals.css';
import './ladle.css';

/**
 * Ladle 전역 래퍼.
 *
 * Ladle 의 테마 토글은 `<html data-theme="dark">` 를 세팅하는데,
 * konnect 의 다크 전략은 `.dark` 클래스다(docs/25-design/10-foundations/01-color.md).
 * 두 신호를 여기서 동기화해, 스토리에서 실제 앱과 같은 방식으로 다크를 검증한다.
 */
export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      globalState.theme === 'dark',
    );
  }, [globalState.theme]);

  return <div className="min-h-dvh bg-surface p-6 text-fg">{children}</div>;
};
