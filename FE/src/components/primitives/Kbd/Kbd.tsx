import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

/**
 * 키보드 키 표시 — `<kbd>` 시맨틱 요소.
 *
 * `<span>` 으로 흉내 내지 않는다. 보조 기술이 "키 입력"으로 인식한다.
 */
export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex min-w-6 items-center justify-center rounded-sm border border-border-strong bg-surface-sunken px-1.5 py-0.5',
        'font-mono text-xs text-fg-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
