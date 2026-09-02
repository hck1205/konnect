'use client';

import NextLink from 'next/link';
import { Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { BrandMark } from '@/components/primitives/BrandMark';
import { IconButton } from '@/components/primitives/IconButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Popover } from '@/components/overlays/Popover';
import { HeaderNav } from './HeaderNav';
import type { PageHeaderProps } from './PageHeader.types';

/** sticky 헤더 높이 — 앵커 이동 시 제목이 가리지 않게 globals.css 가 이 값을 읽는다 */
const HEADER_HEIGHT = '3.5rem';

/**
 * 사이트 상단 헤더.
 *
 * `<header>` + `<nav>` 랜드마크를 쓴다 — 스크린리더 사용자가 랜드마크로 건너뛴다.
 *
 * 모바일에서는 네비를 팝오버로 접는다. Popover API 라 **열림 상태 JS 가 없다**.
 * 데스크톱·모바일이 `HeaderNav` 하나를 공유하므로 항목을 추가할 때 한쪽을 빠뜨릴 수 없다.
 *
 * `--header-h` 를 여기서 세팅한다 — `scroll-margin-block-start` 가 이 값을 쓴다.
 */
export function PageHeader({ homeHref, nav = [], currentPath, actions, className }: PageHeaderProps) {
  const hasNav = nav.length > 0;

  return (
    <header
      style={{ '--header-h': HEADER_HEIGHT } as React.CSSProperties}
      className={cn(
        'sticky top-0 z-30 h-14 border-b border-border bg-surface/90 backdrop-blur',
        className,
      )}
    >
      <Container width="wide" className="flex h-full items-center gap-4">
        {/* 내부 이동은 next/link 로 — 클라이언트 내비게이션과 프리페치가 붙는다.
            (Ladle 은 Next 런타임이 없어 vite alias 로 평범한 <a> 스텁을 물린다) */}
        <NextLink href={homeHref} aria-label="konnect — home">
          <BrandMark />
        </NextLink>

        {hasNav ? (
          <nav aria-label="Main" className="hidden md:block">
            <HeaderNav items={nav} currentPath={currentPath} />
          </nav>
        ) : null}

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle size="sm" />
          {actions}

          {hasNav ? (
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
                <nav aria-label="Main">
                  <HeaderNav items={nav} currentPath={currentPath} vertical />
                </nav>
              </Popover>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
