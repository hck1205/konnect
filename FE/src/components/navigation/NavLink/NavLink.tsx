import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/cn';

export interface NavLinkProps {
  href: string;
  /** 현재 페이지인지. `aria-current="page"` 로도 반영된다. */
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 네비게이션 링크.
 *
 * 현재 위치를 **색 굵기만으로 표시하지 않는다** — `aria-current="page"` 를 함께 세팅해
 * 스크린리더에도 "현재 페이지"가 전달되게 한다.
 *
 * 내부 이동은 `next/link` 로 한다. 평범한 `<a>` 였을 때는 헤더의 "Questions" 를
 * 누를 때마다 **문서 전체가 새로 로드**됐다 — 같은 헤더에서 브랜드 로고만
 * 클라이언트 내비게이션이라 동작이 갈려 있었다.
 * (Ladle 은 Next 런타임이 없어 vite alias 로 평범한 `<a>` 스텁을 물린다)
 */
export function NavLink({ href, active, icon, children, className }: NavLinkProps) {
  return (
    <NextLink
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150',
        active
          ? 'bg-brand-subtle font-medium text-brand-on-subtle'
          : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </NextLink>
  );
}
