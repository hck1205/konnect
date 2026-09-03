'use client';

import { useId, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from '@/components/primitives/CloseButton';
import { useDialogElement } from '@/components/overlays/Modal';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** 닫기 버튼의 접근 이름. 아이콘뿐이라 이 문구가 유일한 단서다 */
  closeLabel: string;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** 어느 쪽에서 나올지. 논리 방향이라 RTL 에서 자동으로 뒤집힌다. */
  side?: 'start' | 'end';
  className?: string;
}

/**
 * 측면 시트 — **`<dialog>`** 를 옆에 붙여 쓴다.
 *
 * Modal 과 같은 요소를 쓰는 이유: 포커스 트랩·Esc·top layer 가 전부 필요한데,
 * 그건 `<dialog>` 가 이미 한다. 다른 건 **위치와 크기뿐**이라 별도 구현을 만들지 않고
 * `useDialogElement` 훅을 그대로 재사용한다.
 *
 * 긴 필터 목록이나 모바일 네비게이션처럼 **내용이 길고 스크롤이 필요할 때** 쓴다.
 * 짧은 확인은 `Modal` 이 맞다.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'end',
  className,
  closeLabel,
}: DrawerProps) {
  const ref = useDialogElement(open, onClose);
  const titleId = useId();

  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      onClick={handleClick}
      aria-labelledby={titleId}
      className={cn(
        'h-dvh max-h-none w-[min(24rem,calc(100vw-3rem))] max-w-none bg-surface-overlay p-0 text-fg shadow-e4',
        // 기본 중앙 정렬을 풀고 한쪽 끝에 붙인다
        'm-0 flex flex-col',
        side === 'end' ? 'ms-auto' : 'me-auto',
        'backdrop:bg-scrim',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 id={titleId} className="text-base font-semibold text-fg">
          {title}
        </h2>
        <CloseButton label={closeLabel} onClick={onClose} className="-mr-1" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">{children}</div>

      {footer ? (
        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
