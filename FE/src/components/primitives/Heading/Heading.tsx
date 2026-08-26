import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** 문서 구조상의 레벨 — h1~h6 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** 시각적 크기 — 레벨과 **독립**이다 */
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<HeadingSize, string> = {
  xs: 'text-sm font-semibold',
  sm: 'text-base font-semibold',
  md: 'text-lg font-semibold',
  lg: 'text-xl font-semibold',
  xl: 'text-3xl font-bold tracking-tight',
};

/** 레벨을 안 주면 이 크기에 대응하는 기본 레벨을 쓴다 */
const DEFAULT_LEVEL: Record<HeadingSize, HeadingLevel> = {
  xs: 4,
  sm: 4,
  md: 3,
  lg: 2,
  xl: 1,
};

export interface HeadingProps {
  children: ReactNode;
  /** 문서 구조. **크기 때문에 바꾸지 않는다.** */
  level?: HeadingLevel;
  /** 시각적 크기. 레벨과 독립적으로 정한다. */
  size?: HeadingSize;
  id?: string;
  className?: string;
}

/**
 * 제목 — **레벨과 크기를 분리한다.**
 *
 * 가장 흔한 접근성 사고가 "작게 보이고 싶어서 h2 대신 h4 를 쓰는 것"이다.
 * 스크린리더 사용자는 제목 레벨로 문서를 훑기 때문에, 레벨을 건너뛰면
 * 목차가 망가진다.
 *
 * 그래서 `level`(구조)과 `size`(외형)를 따로 받는다:
 * `<Heading level={2} size="sm">` — 구조상 h2, 보기엔 작게.
 * → docs/25-design/10-foundations/07-accessibility.md
 */
export function Heading({ children, level, size = 'md', id, className }: HeadingProps) {
  const Tag = `h${level ?? DEFAULT_LEVEL[size]}` as const;
  return (
    <Tag id={id} className={cn('text-fg', SIZE[size], className)}>
      {children}
    </Tag>
  );
}
