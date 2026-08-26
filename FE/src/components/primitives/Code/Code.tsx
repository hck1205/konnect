import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CodeProps {
  children: ReactNode;
  /** 블록 형태(여러 줄). 기본은 인라인. */
  block?: boolean;
  /**
   * 이 코드가 한국어 원문인 경우. `lang="ko" translate="no"` 가 붙는다.
   * konnect 에서는 행정 서식명·관청명을 원문 그대로 보여줘야 하는 경우가 흔하다.
   * → docs/25-design/10-foundations/08-native-platform.md
   */
  korean?: boolean;
  className?: string;
}

/**
 * 코드·식별자 표시.
 *
 * `translate="no"` 가 기본이다 — 코드나 고유명이 브라우저 번역기에 번역되면
 * 사용자가 그 문자열을 실제로 쓸 수 없다.
 */
export function Code({ children, block, korean, className }: CodeProps) {
  const shared = cn(
    'rounded-sm bg-surface-sunken font-mono text-fg',
    block ? 'block overflow-x-auto p-3 text-sm' : 'px-1 py-0.5 text-[0.9em]',
    className,
  );

  const code = (
    <code
      translate="no"
      lang={korean ? 'ko' : undefined}
      className={block ? 'font-mono' : shared}
    >
      {children}
    </code>
  );

  // 블록은 <pre> 로 감싸 공백과 줄바꿈을 보존한다
  if (block) return <pre className={shared}>{code}</pre>;
  return code;
}
