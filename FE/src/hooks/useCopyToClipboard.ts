'use client';

import { useEffect, useState } from 'react';

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * 클립보드 복사 + 결과 상태.
 *
 * `navigator.clipboard` 는 **보안 컨텍스트(HTTPS/localhost)에서만** 동작한다.
 * 실패를 조용히 삼키면 사용자는 복사된 줄 알고 빈 클립보드를 붙여넣는다 —
 * 그래서 `failed` 를 상태로 남긴다.
 *
 * 상태는 일정 시간 뒤 스스로 `idle` 로 돌아간다.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = setTimeout(() => setState('idle'), resetAfterMs);
    return () => clearTimeout(timer);
  }, [state, resetAfterMs]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  };

  return { state, copy };
}
