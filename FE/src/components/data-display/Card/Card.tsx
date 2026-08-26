import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps {
  children: ReactNode;
  /**
   * 카드 전체가 링크인 경우의 대상. 주면 카드가 `<a>` 로 렌더된다.
   *
   * 카드 안에 또 다른 링크/버튼을 넣으려면 이걸 쓰지 말고, 제목만 링크로 만든다 —
   * 중첩 인터랙티브 요소는 키보드·스크린리더에서 깨진다.
   */
  href?: string;
  className?: string;
}

/**
 * 목록 항목 컨테이너.
 *
 * 층은 `surface-raised` 로 만든다. 다크에서 그림자는 거의 보이지 않으므로
 * **표면 밝기 차이**가 층의 주 수단이다.
 * → docs/25-design/10-foundations/04-radius-and-elevation.md
 */
export function Card({ children, href, className }: CardProps) {
  const classes = cn(
    'block rounded-lg border border-border bg-surface-raised p-4',
    href && 'transition-colors duration-150 hover:border-border-strong',
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-2 flex items-start justify-between gap-3', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-semibold text-fg', className)}>{children}</h3>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mt-3 flex items-center gap-2 text-sm text-fg-subtle', className)}>{children}</div>;
}
