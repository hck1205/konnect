import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** 다음 행동. 빈 화면에서 사용자가 **무엇을 할 수 있는지** 알려주는 것이 이 컴포넌트의 핵심이다. */
  action?: ReactNode;
  className?: string;
}

/**
 * 빈 목록 안내.
 *
 * "결과 없음"만 띄우고 끝내지 않는다. 검색 유입이 주 채널이라 빈 화면이
 * 첫인상이 되는 경우가 있고, 거기서 이탈하면 다시 오지 않는다.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-border px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="text-fg-subtle">
          {icon}
        </span>
      ) : null}
      <p className="text-base font-medium text-fg">{title}</p>
      {description ? (
        <p className="max-w-[45ch] text-sm text-fg-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
