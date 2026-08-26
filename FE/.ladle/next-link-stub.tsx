import type { ComponentProps } from 'react';

/**
 * Ladle 전용 `next/link` 스텁.
 *
 * Ladle 은 Vite 로 도는데 `next/link` 는 Next 런타임(`process.env` 등)을 전제해
 * 스토리에서 `ReferenceError: process is not defined` 로 죽는다.
 * 스토리에서 필요한 건 **모양과 접근성**뿐이므로 평범한 앵커로 대체한다.
 *
 * 앱에서는 진짜 next/link 가 쓰여 클라이언트 내비게이션과 프리페치가 붙는다.
 */
export default function Link({
  href,
  children,
  ...rest
}: ComponentProps<'a'> & { href: string }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
