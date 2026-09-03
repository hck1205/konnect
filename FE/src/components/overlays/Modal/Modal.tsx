'use client';

import { useId, type MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from '@/components/primitives/CloseButton';
import { useDialogElement } from './hooks';
import type { ModalProps } from './Modal.types';

/**
 * 모달 — **네이티브 `<dialog>`**.
 *
 * 포커스 트랩·포커스 복귀·Esc 닫기·top layer·배경 비활성화를 브라우저가 한다.
 * 직접 구현하면 거의 항상 어딘가 빠진다.
 * → docs/25-design/10-foundations/08-native-platform.md
 *
 * `::backdrop` 스타일은 `--scrim` 토큰을 쓴다(색을 하드코딩하지 않는다).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnBackdrop = true,
  className,
  closeLabel,
}: ModalProps) {
  const ref = useDialogElement(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  /**
   * 배경 클릭 판정: `<dialog>` 자체가 클릭 대상이면 배경을 누른 것이다
   * (내용은 안쪽 컨테이너가 받는다). getBoundingClientRect 좌표 비교보다 견고하다.
   */
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return;
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      onClick={handleClick}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'm-auto w-[min(32rem,calc(100vw-2rem))] rounded-xl bg-surface-overlay p-0 text-fg shadow-e4',
        'backdrop:bg-scrim',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-5">
        <div>
          <h2 id={titleId} className="text-lg font-semibold text-fg">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-1 text-sm text-fg-muted">
              {description}
            </p>
          ) : null}
        </div>
        <CloseButton label={closeLabel} onClick={onClose} className="-mt-1 -mr-1" />
      </div>

      {children ? <div className="px-5 py-4 text-sm">{children}</div> : null}

      {footer ? (
        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
