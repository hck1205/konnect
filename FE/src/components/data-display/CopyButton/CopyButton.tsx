'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { IconButton } from '@/components/primitives/IconButton';
import type { Size } from '@/types/ui';

export interface CopyButtonProps {
  /** 복사할 문자열 */
  value: string;
  /** 무엇을 복사하는지 ("Copy 외국인등록증") */
  label?: string;
  size?: Size;
  className?: string;
}

/**
 * 클립보드 복사 버튼.
 *
 * konnect 에서 특히 쓸모가 있다: 한국어 행정 용어를 **그대로 복사해** 검색창이나
 * 서류에 붙여넣어야 하는 경우가 많다. 손으로 옮겨 적을 수 없는 사용자가 다수다.
 * → docs/25-design/10-foundations/08-native-platform.md
 *
 * 결과를 `aria-live` 로 알린다 — 아이콘이 체크로 바뀌는 것은 보이는 사용자에게만
 * 피드백이다.
 *
 * `navigator.clipboard` 는 보안 컨텍스트(HTTPS/localhost)에서만 동작한다.
 * 실패하면 조용히 넘어가지 않고 상태를 남긴다.
 */
export function CopyButton({ value, label, size = 'sm', className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = setTimeout(() => setState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  };

  return (
    <span className={className}>
      <IconButton
        icon={
          state === 'copied' ? (
            <Check className="size-4 text-success" />
          ) : (
            <Copy className="size-4" />
          )
        }
        label={label ?? `Copy ${value}`}
        size={size}
        onClick={() => void copy()}
      />
      {/* 시각적 피드백만으로는 부족하다 */}
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy' : ''}
      </span>
    </span>
  );
}
