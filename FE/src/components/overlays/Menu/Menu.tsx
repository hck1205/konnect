'use client';

import type { ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Popover, type PopoverTriggerProps } from '@/components/overlays/Popover';

export interface MenuProps {
  trigger: (props: PopoverTriggerProps) => ReactElement;
  children: ReactNode;
  className?: string;
}

export interface MenuItemProps {
  onSelect?: () => void;
  /** 파괴적 행동(삭제 등). 색과 함께 문구로도 구분되어야 한다. */
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * 드롭다운 메뉴 — `Popover` 위에 얹는다.
 *
 * ARIA 메모: 여기서 `role="menu"` 를 쓰지 **않는다**. 진짜 menu 롤은 화살표 키 로빙
 * 포커스까지 구현해야 정상 동작하는데, 그걸 안 하고 롤만 붙이면 스크린리더 사용자에게
 * 오히려 더 나쁘다. 버튼 목록으로 두면 Tab 으로 자연스럽게 순회된다.
 */
export function Menu({ trigger, children, className }: MenuProps) {
  return (
    <Popover trigger={trigger} className={className}>
      <div className="flex flex-col">{children}</div>
    </Popover>
  );
}

export function MenuItem({
  onSelect,
  destructive,
  disabled,
  icon,
  children,
}: MenuItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm',
        'hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-50',
        destructive ? 'text-danger' : 'text-fg',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

/** 메뉴 항목 사이 구분선 */
export function MenuSeparator() {
  return <hr className="my-1 border-border" />;
}
