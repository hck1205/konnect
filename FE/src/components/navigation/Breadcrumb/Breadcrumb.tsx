import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  /** 마지막 항목(현재 페이지)에는 주지 않는다 — 자기 자신으로 가는 링크는 무의미하다 */
  href?: string;
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
  className?: string;
}

/**
 * 경로 표시.
 *
 * `<nav aria-label>` + `<ol>` 을 쓴다 — 순서가 의미인 목록이다.
 * 마지막 항목은 링크가 아니라 `aria-current="page"` 텍스트다.
 * 구분자(›)는 `aria-hidden` — 스크린리더가 "꺾쇠"를 읽을 이유가 없다.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <a href={item.href} className="text-fg-muted hover:text-fg hover:underline">
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(isLast ? 'text-fg' : 'text-fg-muted')}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight className="size-3.5 text-fg-subtle" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
