import { cn } from '@/lib/cn';
import type { TocEntry } from './TableOfContents.utils';

export interface TableOfContentsProps {
  entries: readonly TocEntry[];
  /** 현재 읽고 있는 절의 id (스크롤 위치로 결정 — 화면이 계산해 넘긴다) */
  activeId?: string;
  className?: string;
}

/**
 * 문서 목차.
 *
 * 긴 가이드에서 필요하다 — 사용자는 문서를 처음부터 읽지 않고 **자기 상황에
 * 해당하는 절만** 찾는다.
 *
 * 앵커로 이동했을 때 제목이 고정 헤더에 가리지 않는 것은
 * `globals.css` 의 `scroll-margin-block-start` 가 처리한다(`--header-h` 사용).
 *
 * 활성 절 계산은 **여기서 하지 않는다** — 스크롤 관찰은 화면의 책임이고,
 * 이 컴포넌트는 결과만 받아 그린다(테스트 가능한 경계를 유지한다).
 */
export function TableOfContents({
  entries,
  activeId,
  className,
}: TableOfContentsProps) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn('text-sm', className)}>
      <p className="mb-2 font-medium text-fg">On this page</p>
      <ul className="flex flex-col gap-1">
        {entries.map((entry) => (
          <li key={entry.id} className={cn(entry.level === 3 && 'ps-4')}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === activeId ? 'location' : undefined}
              className={cn(
                'block border-s-2 py-0.5 ps-3 transition-colors duration-150',
                entry.id === activeId
                  ? 'border-brand font-medium text-brand'
                  : 'border-border text-fg-muted hover:text-fg',
              )}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
