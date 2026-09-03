'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { cn } from '@/lib/cn';
import { TONE_SUBTLE } from '@/lib/tone';
import { CloseButton } from '@/components/primitives/CloseButton';
import { useI18n } from '@/lib/i18n';
import {
  dismissToast,
  getServerToasts,
  getToasts,
  subscribeToasts,
  type Toast,
} from './toast.store';

function ToastRow({ toast }: { toast: Toast }) {
  const { t } = useI18n();
  useEffect(() => {
    if (toast.durationMs <= 0) return;
    const timer = setTimeout(() => dismissToast(toast.id), toast.durationMs);
    return () => clearTimeout(timer);
  }, [toast.id, toast.durationMs]);

  return (
    <li
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-e3',
        TONE_SUBTLE[toast.tone],
      )}
    >
      <span className="flex-1">{toast.message}</span>
      <CloseButton
        label={t('a11y.dismiss')}
        onClick={() => dismissToast(toast.id)}
        className="-mr-1 shrink-0"
      />
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
