'use client';

import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks';
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
 *
 * 결과를 `aria-live` 로 알린다 — 아이콘이 체크로 바뀌는 것은 보이는 사용자에게만
 * 피드백이다. 복사 자체는 `useCopyToClipboard` 가 맡는다(실패 상태 포함).
 */
export function CopyButton({ value, label, size = 'sm', className }: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard();

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
        onClick={() => void copy(value)}
      />
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy' : ''}
      </span>
    </span>
  );
}
