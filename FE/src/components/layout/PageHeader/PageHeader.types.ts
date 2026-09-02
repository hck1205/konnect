import type { ReactNode } from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

export interface PageHeaderProps {
  /**
   * 브랜드 로고의 목적지. **로케일이 붙은 홈**(`routes.home(locale)`)을 넘긴다.
   *
   * 기본값이 없다 — `/` 로 두면 프록시가 Accept-Language 로 다시 협상해서
   * `/en` 을 보던 사용자가 `/ko` 로 튕긴다. 조용히 틀리느니 컴파일이 막는 편이 낫다.
   */
  homeHref: string;
  /** 상단 네비게이션 항목. 데스크톱은 가로, 모바일은 시트로 접힌다. */
  nav?: readonly NavItem[];
  /** 현재 경로. `aria-current` 판정에 쓴다. */
  currentPath?: string;
  /** 로그인 상태에 따라 달라지는 오른쪽 영역(아바타 메뉴 / 로그인 버튼) */
  actions?: ReactNode;
  className?: string;
}
