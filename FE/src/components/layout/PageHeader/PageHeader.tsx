'use client';

import NextLink from 'next/link';
import { Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { NavLink } from '@/components/navigation/NavLink';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { IconButton } from '@/components/primitives/IconButton';
import { Popover } from '@/components/overlays/Popover';
import { isNavActive } from './PageHeader.utils';
import type { PageHeaderProps } from './PageHeader.types';

/**
 * 사이트 상단 헤더.
 *
 * `<header>` + `<nav>` 랜드마크를 쓴다 — 스크린리더 사용자가 랜드마크로 건너뛴다.
 *
 * 모바일에서는 네비를 팝오버로 접는다. Popover API 라 **열림 상태 JS 가 없다**.
 * `sticky` 로 고정되므로 `--header-h` 토큰을 여기서 세팅한다 — 앵커로 이동했을 때
 * 제목이 헤더에 가리지 않게 하는 `scroll-margin-block-start` 가 이 값을 쓴다.
 */
export function PageHeader({
  nav = [],
  currentPath,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      // globals.css 의 scroll-margin 계산이 이 값을 읽는다
      style={{ '--header-h': '3.5rem' } as React.CSSProperties}
      className={cn(
        'sticky top-0 z-30 h-14 border-b border-border bg-surface/90 backdrop-blur',
        className,
      )}
    >
      <Container width="wide" className="flex h-full items-center gap-4">
        {/* 내부 이동은 next/link 로 — 클라이언트 내비게이션과 프리페치가 붙는다.
            (Ladle 은 Next 런타임이 없어 vite alias 로 평범한 <a> 스텁을 물린다) */}
        <NextLink href="/" className="text-base font-bold tracking-tight text-fg">
          konnect
        </NextLink>

        {/* 데스크톱 네비 */}
        {nav.length > 0 ? (
          <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                active={isNavActive(item.href, currentPath)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle size="sm" />
          {actions}

          {/* 모바일 네비 — 팝오버로 접는다 */}
          {nav.length > 0 ? (
            <div className="md:hidden">
              <Popover
                trigger={(p) => (
                  <IconButton
                    {...p}
                    size="sm"
                    icon={<MenuIcon className="size-4" />}
                    label="Open menu"
                  />
                )}
              >
                <nav aria-label="Main" className="flex flex-col">
                  {nav.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      active={isNavActive(item.href, currentPath)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </Popover>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
