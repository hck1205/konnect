import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container, type ContainerProps } from '@/components/layout/Container';
import { SkipLink } from '@/components/layout/SkipLink';

export interface AppShellProps {
  header: ReactNode;
  footer?: ReactNode;
  /** 본문 옆 사이드바(목차·필터). 좁은 화면에서는 본문 아래로 내려간다. */
  aside?: ReactNode;
  children: ReactNode;
  width?: ContainerProps['width'];
  className?: string;
}

/**
 * 페이지 골격 — SkipLink + 헤더 + 본문(+사이드바) + 푸터.
 *
 * 화면마다 이 배선을 반복하면 어딘가에서 `SkipLink` 나 `id="main-content"`,
 * `tabIndex={-1}` 을 빠뜨린다. 셋은 **함께 있어야만** 동작한다:
 * 링크가 있어도 대상에 tabIndex 가 없으면 포커스가 옮겨지지 않는다.
 *
 * 사이드바는 `<aside>` 랜드마크다 — 본문과 구분되어 훑을 수 있어야 한다.
 */
export function AppShell({
  header,
  footer,
  aside,
  children,
  width = 'wide',
  className,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-dvh flex-col', className)}>
      <SkipLink />
      {header}

      <Container
        as="main"
        id="main-content"
        // 이게 없으면 SkipLink 를 눌러도 포커스가 옮겨지지 않는다
        tabIndex={-1}
        width={width}
        className={cn(
          'flex-1 py-8',
          aside && 'lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10',
        )}
      >
        <div className="min-w-0">{children}</div>
        {aside ? (
          <aside aria-label="Page sidebar" className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-20">{aside}</div>
          </aside>
        ) : null}
      </Container>

      {footer}
    </div>
  );
}
