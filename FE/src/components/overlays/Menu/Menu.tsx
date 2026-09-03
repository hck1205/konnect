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
  /**
   * 주면 **링크로 그린다**(`<a>`). 항목이 이동이면 버튼이 아니라 링크여야 한다.
   *
   * ⚠️ 예전에는 `MenuItem` 이 무조건 `<button>` 이었고, 이동 항목은 그 **안에**
   * `<a>` 를 넣어 썼다(언어 전환기가 그랬다). 결과가 셋이다:
   *
   * 1. `<a>` 안의 `<button>` 은 **HTML 콘텐츠 모델 위반**이라 브라우저 동작이
   *    보장되지 않는다(파서가 재배치할 수 있다)
   * 2. 항목마다 **탭 스톱이 2개**가 된다 — 버튼과 앵커
   * 3. **첫 Enter 가 아무 일도 안 한다** — 포커스가 바깥 버튼에 있고 그 `onClick`
   *    은 `onSelect`(undefined)다. 한 번 더 Tab 해야 링크에 닿는다
   *
   * 언어 전환기는 **잘못된 언어로 착지한 사용자가 가장 먼저 쓰는 컨트롤**이다.
   */
  href?: string;
  /** 링크 대상의 언어. 언어 전환기가 쓴다 */
  hrefLang?: string;
  /** 현재 선택된 항목인지 — `aria-current` 로 반영된다 */
  current?: boolean;
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
  href,
  hrefLang,
  current,
  destructive,
  disabled,
  icon,
  children,
}: MenuItemProps) {
  const shell = cn(
    'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm',
    'hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-50',
    destructive ? 'text-danger' : 'text-fg',
    current && 'font-medium',
  );

  const body = (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );

  // 이동 항목. **평범한 `<a>` 를 쓴다** — 로케일 전환처럼 서버가 다른 언어로
  // 다시 렌더해야 하는 이동은 클라이언트 내비게이션으로 가로채면 안 된다.
  if (href !== undefined) {
    return (
      <a
        href={href}
        hrefLang={hrefLang}
        aria-current={current ? 'true' : undefined}
        onClick={onSelect}
        className={shell}
      >
        {body}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onSelect} className={shell}>
      {body}
    </button>
  );
}

/** 메뉴 항목 사이 구분선 */
export function MenuSeparator() {
  return <hr className="my-1 border-border" />;
}
