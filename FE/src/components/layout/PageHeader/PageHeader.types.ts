import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

export interface PageHeaderProps {
  /** 상단 네비게이션 항목. 데스크톱은 가로, 모바일은 시트로 접힌다. */
  nav?: readonly NavItem[];
  /** 현재 경로. `aria-current` 판정에 쓴다. */
  currentPath?: string;
  /** 로그인 상태에 따라 달라지는 오른쪽 영역(아바타 메뉴 / 로그인 버튼) */
  actions?: ReactNode;
  className?: string;
}
