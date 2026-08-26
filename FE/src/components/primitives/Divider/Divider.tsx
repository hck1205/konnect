import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DividerProps {
  /** 가운데 라벨 ("or" 등). 주면 선이 갈라지고 텍스트가 들어간다. */
  label?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * 구분선.
 *
 * 라벨이 없으면 `<hr>` 이다 — 시맨틱하게 "주제 전환"을 뜻하고, 스크린리더도 그렇게 읽는다.
 * 장식용이므로 `border` 토큰(비텍스트 대비 3:1 대상 아님)을 쓴다
 * → docs/25-design/02-tokens.md
 */
export function Divider({ label, orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-border', className)}
      />
    );
  }

  if (!label) return <hr className={cn('border-border', className)} />;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <hr className="flex-1 border-border" />
      <span className="text-xs text-fg-subtle">{label}</span>
      <hr className="flex-1 border-border" />
    </div>
  );
}
