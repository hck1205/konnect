import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/primitives/Avatar';

export interface QuoteProps {
  children: ReactNode;
  /** 누가 한 말인지 */
  author?: string;
  /** 맥락 ("D-2, Seoul, 2025") */
  context?: ReactNode;
  /**
   * 개인 경험 표시.
   *
   * R1 콘텐츠에서 **"규정은 이렇다"와 "내 경우엔 이랬다"는 시각적으로 구분**되어야 한다.
   * 개인 사례를 규정으로 오해하면 실제 피해가 난다.
   * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
   */
  personalExperience?: boolean;
  className?: string;
}

/**
 * 인용 블록 — `<blockquote>` + `<figcaption>`.
 *
 * 출처가 있으면 `<figure>` 로 감싼다. `<blockquote>` 안에 출처를 넣는 것은
 * "출처도 인용문의 일부"라는 뜻이 되어 잘못이다.
 */
export function Quote({
  children,
  author,
  context,
  personalExperience,
  className,
}: QuoteProps) {
  const quote = (
    <blockquote
      className={cn(
        'border-s-2 ps-4 text-sm',
        personalExperience
          ? 'border-info bg-info-subtle py-3 pe-3 text-info-on-subtle'
          : 'border-border-strong text-fg-muted',
      )}
    >
      {personalExperience ? (
        <p className="mb-1 text-xs font-semibold uppercase">Personal experience</p>
      ) : null}
      {children}
    </blockquote>
  );

  if (!author) return <div className={className}>{quote}</div>;

  return (
    <figure className={cn('flex flex-col gap-2', className)}>
      {quote}
      <figcaption className="flex items-center gap-2 ps-4 text-xs text-fg-subtle">
        <Avatar name={author} size="sm" />
        <span>{author}</span>
        {context ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{context}</span>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}
