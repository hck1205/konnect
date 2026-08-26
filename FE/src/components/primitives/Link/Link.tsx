import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 외부 링크 표시. 아이콘과 `rel` 안전장치가 붙는다. */
  external?: boolean;
  /** 밑줄 없이 색만. 카드 제목처럼 주변이 이미 링크임을 알려줄 때. */
  subtle?: boolean;
  children: ReactNode;
}

/**
 * 텍스트 링크.
 *
 * 기본이 **밑줄 있음**이다. 본문 안에서 색만으로 링크를 구분하면 색각 이상 사용자에게
 * 링크가 보이지 않는다 → docs/25-design/10-foundations/07-accessibility.md
 *
 * 외부 링크에는 아이콘과 함께 접근 가능한 안내를 붙인다 — 새 창이 열린다는 것을
 * 시각적으로만 알리면 스크린리더 사용자는 예고 없이 맥락을 잃는다.
 * konnect 는 공식 출처 링크를 자주 걸기 때문에(R1 콘텐츠 규칙) 이 경로가 흔하다.
 */
export function Link({
  external,
  subtle,
  children,
  className,
  target,
  rel,
  ...rest
}: LinkProps) {
  return (
    <a
      // noopener 는 새 탭이 window.opener 로 원본 페이지를 조작하는 것을 막는다
      target={external ? '_blank' : target}
      rel={external ? cn('noopener noreferrer', rel) : rel}
      className={cn(
        'text-brand hover:opacity-80',
        subtle ? 'no-underline' : 'underline underline-offset-2',
        className,
      )}
      {...rest}
    >
      {children}
      {external ? (
        <>
          <ExternalLink
            className="ml-0.5 inline-block size-3 align-baseline"
            aria-hidden="true"
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}
