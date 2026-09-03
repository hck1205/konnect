import type { ReactNode } from 'react';
import { AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/primitives/Button';

export interface ErrorStateProps {
  /**
   * **필수다.** 기본값을 두면 부르는 쪽이 아무것도 안 해도 화면이 그려지고,
   * 그 화면은 모든 로케일에서 영어다. `AppShell.asideLabel` 과 같은 규칙이다.
   */
  title: ReactNode;
  description: ReactNode;
  /** 다시 시도 핸들러. 주면 버튼이 붙는다. */
  onRetry?: () => void;
  /** `onRetry` 를 줄 때 함께 준다 — 버튼 문구다 */
  retryLabel?: string;
  /** 개발 환경에서만 보여줄 원인. 사용자에게 스택을 보여주지 않는다. */
  detail?: string;
  className?: string;
}

/**
 * 오류가 난 영역.
 *
 * 원칙: **사용자에게 기술적 메시지를 보여주지 않는다.** "Request failed with
 * status code 500" 은 사용자가 할 수 있는 일을 알려주지 않는다.
 * 무엇을 할 수 있는지(다시 시도, 새로고침)를 준다.
 *
 * `detail` 은 개발 환경에서만 렌더한다 — 운영에서 내부 정보를 노출하지 않는다.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  detail,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-border px-6 py-10 text-center',
        className,
      )}
    >
      <AlertOctagon className="size-6 text-danger" aria-hidden="true" />
      <p className="text-base font-medium text-fg">{title}</p>
      <p className="max-w-[45ch] text-sm text-fg-muted">{description}</p>
      {onRetry ? (
        <Button variant="outline" tone="neutral" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
      {detail && process.env.NODE_ENV === 'development' ? (
        <pre className="mt-2 max-w-full overflow-x-auto rounded-md bg-surface-sunken p-2 text-start font-mono text-xs text-fg-subtle">
          {detail}
        </pre>
      ) : null}
    </div>
  );
}
