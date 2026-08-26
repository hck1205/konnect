'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TruncatedTextProps {
  children: ReactNode;
  /** 접었을 때 보여줄 줄 수 */
  lines?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 더 보기 버튼을 붙일지. 카드 미리보기처럼 펼칠 필요가 없으면 끈다. */
  expandable?: boolean;
  className?: string;
}

const CLAMP: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/**
 * 여러 줄 말줄임.
 *
 * `line-clamp` 는 **시각적으로만** 자른다 — 텍스트는 DOM 에 그대로 있어
 * 스크린리더와 페이지 내 검색(Ctrl+F)이 전체를 읽는다. 잘라낸 문자열을
 * `slice()` 로 만들면 그 정보가 사라진다.
 *
 * `expandable` 을 켜면 펼치기 버튼이 붙는다. `aria-expanded` 로 상태를 알린다.
 */
export function TruncatedText({
  children,
  lines = 3,
  expandable,
  className,
}: TruncatedTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <div className={cn(!expanded && CLAMP[lines])}>{children}</div>
      {expandable ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 cursor-pointer text-sm text-brand underline underline-offset-2"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
}
