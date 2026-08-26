import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionProps {
  /** 섹션 제목. 주면 `<h2>` 로 렌더되고 `<section>` 에 연결된다. */
  title?: ReactNode;
  description?: ReactNode;
  /** 제목 줄 오른쪽 액션 (더 보기 링크 등) */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 제목이 붙는 콘텐츠 묶음.
 *
 * 제목이 있으면 `<section aria-labelledby>` 로 연결한다 — 스크린리더가 랜드마크를
 * 훑을 때 "무엇에 대한 섹션인지" 읽어 준다. 제목 없는 `<section>` 은 랜드마크로서
 * 쓸모가 없어 `<div>` 로 떨어뜨린다.
 */
export function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  const headingId = title ? `section-${String(title).slice(0, 24)}` : undefined;

  const body = (
    <>
      {title ? (
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id={headingId} className="text-xl font-semibold text-fg">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-fg-muted">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </>
  );

  if (!title) return <div className={cn('py-6', className)}>{body}</div>;

  return (
    <section aria-labelledby={headingId} className={cn('py-6', className)}>
      {body}
    </section>
  );
}
