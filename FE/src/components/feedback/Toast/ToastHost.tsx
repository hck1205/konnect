'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StatusTone } from '@/types/ui';
import {
  dismissToast,
  getServerToasts,
  getToasts,
  subscribeToasts,
  type Toast,
} from './toast.store';

const TONE: Record<StatusTone, string> = {
  success: 'bg-success-subtle text-success-on-subtle',
  warning: 'bg-warning-subtle text-warning-on-subtle',
  danger: 'bg-danger-subtle text-danger-on-subtle',
  info: 'bg-info-subtle text-info-on-subtle',
};

function ToastRow({ toast }: { toast: Toast }) {
  useEffect(() => {
    if (toast.durationMs <= 0) return;
    const timer = setTimeout(() => dismissToast(toast.id), toast.durationMs);
    return () => clearTimeout(timer);
  }, [toast.id, toast.durationMs]);

  return (
    <li
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-e3',
        TONE[toast.tone],
      )}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 shrink-0 cursor-pointer rounded-sm p-0.5 opacity-70 hover:opacity-100"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </li>
  );
}

/**
 * 토스트가 렌더되는 **단 하나의 지점**. 앱 루트에 한 번만 둔다.
 *
 * `aria-live="polite"` 영역이라 새 토스트가 스크린리더에 자동으로 읽힌다 —
 * 사용자가 포커스를 옮기지 않아도 결과를 알 수 있다. `assertive` 를 쓰지 않는 이유는
 * 진행 중인 읽기를 끊어 오히려 방해가 되기 때문이다.
 *
 * 컨테이너는 `pointer-events-none` 이라 토스트가 없는 영역의 클릭을 막지 않는다.
 */
export function ToastHost() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4"
    >
      <ul className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastRow key={t.id} toast={t} />
        ))}
      </ul>
    </div>
  );
}
