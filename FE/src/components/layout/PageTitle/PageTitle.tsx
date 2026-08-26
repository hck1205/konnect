import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Heading } from '@/components/primitives/Heading';

export interface PageTitleProps {
  title: ReactNode;
  description?: ReactNode;
  /** 제목 위에 오는 경로 표시(Breadcrumb) 또는 BackLink */
  above?: ReactNode;
  /** 제목 줄 오른쪽 액션 */
  actions?: ReactNode;
  /** 제목 아래 메타(태그, 작성자, 최신성) */
  meta?: ReactNode;
  className?: string;
}

/**
 * 페이지 제목 블록.
 *
 * 페이지마다 제목·설명·액션의 배치가 다르면 사용자가 매번 화면을 다시 읽어야 한다.
 * 한 곳에 고정한다.
 *
 * 제목은 항상 **`<h1>`** 이다 — 페이지당 하나. 크기를 줄여야 한다면 `Heading` 의
 * `size` 를 쓰지 레벨을 낮추지 않는다.
 */
export function PageTitle({
  title,
  description,
  above,
  actions,
  meta,
  className,
}: PageTitleProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {above}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Heading level={1} size="xl">
            {title}
          </Heading>
          {description ? (
            <p className="mt-2 max-w-[70ch] text-fg-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
    </div>
  );
}
