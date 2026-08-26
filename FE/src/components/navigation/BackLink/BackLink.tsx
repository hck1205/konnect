import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BackLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 상위로 돌아가는 링크.
 *
 * **`history.back()` 을 쓰지 않는다.** 검색으로 상세 페이지에 바로 착지한
 * 사용자에게는 "뒤"가 검색 결과 페이지이거나 아예 없다
 * (→ docs/20-product/03-user-journeys.md J1). 실제 상위 경로로 가는 링크여야
 * 새 탭 열기·주소 확인도 정상 동작한다.
 *
 * 화살표는 논리 방향(`ms/me`)이 아니라 아이콘이라 RTL 에서 뒤집어야 하지만,
 * 지금은 LTR 로케일만 지원한다(도입 시 `rtl:rotate-180` 을 붙인다).
 */
export function BackLink({ href, children = 'Back', className }: BackLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg',
        className,
      )}
    >
      <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      {children}
    </a>
  );
}
