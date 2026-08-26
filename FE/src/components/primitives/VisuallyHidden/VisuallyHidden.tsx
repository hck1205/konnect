import type { PropsWithChildren } from 'react';

/**
 * 화면에는 안 보이지만 스크린리더는 읽는 텍스트.
 *
 * `display: none` 이나 `visibility: hidden` 은 **접근성 트리에서도 제거**되므로
 * 이 목적에 쓸 수 없다. Tailwind 의 `sr-only` 가 올바른 구현을 제공한다.
 */
export function VisuallyHidden({ children }: PropsWithChildren) {
  return <span className="sr-only">{children}</span>;
}
