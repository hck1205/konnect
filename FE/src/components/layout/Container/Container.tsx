import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 콘텐츠 폭 단계.
 * `prose` 는 **읽기 폭**(약 70자)이다 — 긴 줄은 다음 줄을 찾기 어렵고,
 * 제2언어 독자에게 특히 부담이다.
 * → docs/25-design/10-foundations/03-spacing-and-layout.md
 */
const WIDTH = {
  prose: 'max-w-3xl',
  content: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-none',
} as const;

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  width?: keyof typeof WIDTH;
  /** 시맨틱을 바꿔야 할 때 (`main`, `section`, `header` …) */
  as?: ElementType;
  children: ReactNode;
}

/**
 * 가운데 정렬 + 폭 제한 + 좌우 여백. 페이지의 기본 뼈대다.
 *
 * 나머지 props 는 그대로 전달한다 — `id`(SkipLink 대상), `tabIndex`,
 * `aria-*` 를 붙일 수 있어야 레이아웃 요소로 쓸모가 있다.
 */
export function Container({
  width = 'content',
  as: Tag = 'div',
  children,
  className,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full px-4 sm:px-6', WIDTH[width], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
