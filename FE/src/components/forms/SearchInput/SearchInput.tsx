'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Size } from '@/types/ui';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Enter 또는 검색 제출 시. 폼 제출로 처리하므로 모바일 키보드에 "검색"이 뜬다. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: Size;
  /** 접근 가능한 이름. 시각적 레이블이 없으므로 필수다. */
  label?: string;
  className?: string;
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 ps-8 pe-8 text-sm',
  md: 'h-10 ps-9 pe-9 text-sm',
  lg: 'h-12 ps-11 pe-11 text-base',
};

/**
 * 검색 입력.
 *
 * `<form role="search">` + `<input type="search">` 를 쓴다:
 * - `role="search"` 는 랜드마크라 스크린리더가 바로 건너뛸 수 있다
 * - `type="search"` 는 모바일 키보드의 엔터를 "검색"으로 바꾼다
 * - 폼 제출이라 Enter 가 자연스럽게 동작한다
 *
 * 검색은 MVP P0 다 — 검색이 안 되면 축적이 무의미하다
 * (→ docs/20-product/02-core-features.md).
 *
 * 논리 속성(`ps-*`/`pe-*`)을 쓰므로 RTL 로케일이 추가돼도 아이콘 위치가 뒤집힌다.
 */
export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search questions and guides',
  size = 'md',
  label = 'Search',
  className,
}: SearchInputProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={cn('relative', className)}
    >
      <Search
        className="pointer-events-none absolute inset-inline-start-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
        style={{ insetInlineStart: '0.75rem' }}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-md border border-border-interactive bg-surface-sunken text-fg',
          'placeholder:text-fg-subtle',
          // 브라우저 기본 지우기 버튼을 숨긴다 — 우리 버튼과 겹친다
          '[&::-webkit-search-cancel-button]:appearance-none',
          SIZE[size],
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{ insetInlineEnd: '0.5rem' }}
          className="absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-fg-subtle hover:text-fg"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </form>
  );
}
