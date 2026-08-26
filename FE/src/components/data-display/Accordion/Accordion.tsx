import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItemProps {
  summary: ReactNode;
  children: ReactNode;
  /**
   * 같은 `name` 을 가진 항목끼리는 **하나만 열린다**(배타 아코디언).
   * 브라우저가 처리하므로 상태 관리 JS 가 필요 없다.
   */
  name?: string;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * 아코디언 항목 — **네이티브 `<details>`/`<summary>`**.
 *
 * 키보드 조작·접근성 롤·열림 상태를 전부 브라우저가 처리한다.
 * 같은 `name` 을 주면 배타 동작까지 공짜다.
 * → docs/25-design/10-foundations/08-native-platform.md
 *
 * 접힌 내용도 브라우저의 페이지 내 검색(Ctrl+F)으로 찾을 수 있게 `hidden="until-found"`
 * 를 쓰고 싶다면, 그건 `<details>` 가 아니라 별도 접기 UI 에 해당한다 —
 * `<details>` 는 최신 브라우저에서 이미 검색 시 자동으로 펼쳐진다.
 */
export function AccordionItem({
  summary,
  children,
  name,
  defaultOpen,
  className,
}: AccordionItemProps) {
  return (
    <details
      name={name}
      open={defaultOpen}
      className={cn('group border-b border-border', className)}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 py-3 text-sm font-medium text-fg',
          // 기본 삼각형 마커를 지우고 우리 아이콘을 쓴다
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <ChevronRight
          className="size-4 shrink-0 text-fg-subtle transition-transform duration-150 group-open:rotate-90"
          aria-hidden="true"
        />
        {summary}
      </summary>
      <div className="pb-4 pl-6 text-sm text-fg-muted">{children}</div>
    </details>
  );
}

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('border-t border-border', className)}>{children}</div>;
}
