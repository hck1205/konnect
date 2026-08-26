import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  /** 숫자 열 등 오른쪽 정렬 */
  align?: 'start' | 'end';
}

export interface TableProps<T> {
  /** 표가 무엇인지. `<caption>` 으로 렌더된다 — 스크린리더가 먼저 읽는다. */
  caption: ReactNode;
  /** caption 을 시각적으로 숨길지. 주변에 이미 제목이 있으면 숨긴다. */
  hideCaption?: boolean;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T, index: number) => string;
  className?: string;
}

/**
 * 데이터 표 — **네이티브 `<table>`**.
 *
 * `<div>` 그리드로 표를 만들지 않는다. 스크린리더가 "3행 2열, 헤더: 비자 종류" 처럼
 * 좌표와 헤더를 읽어 주는 것이 표의 핵심 가치인데, div 로는 그게 사라진다.
 *
 * 넓은 표는 **자기 컨테이너 안에서 가로 스크롤**한다 — 페이지 본문이 가로로
 * 밀리면 안 된다. 스크롤 컨테이너에 `tabIndex={0}` 을 둬 키보드로도 스크롤된다.
 */
export function Table<T>({
  caption,
  hideCaption,
  columns,
  rows,
  rowKey,
  className,
}: TableProps<T>) {
  return (
    <div
      // 스크롤 가능한 영역은 키보드로도 닿아야 한다(WCAG 2.1.1)
      tabIndex={0}
      role="region"
      aria-label={typeof caption === 'string' ? caption : undefined}
      className={cn('overflow-x-auto rounded-lg border border-border', className)}
    >
      <table className="w-full border-collapse text-sm">
        <caption className={cn('px-4 py-3 text-start text-fg-muted', hideCaption && 'sr-only')}>
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-border bg-surface-sunken">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-2.5 font-medium text-fg-muted',
                  col.align === 'end' ? 'text-end' : 'text-start',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)} className="border-b border-border last:border-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-fg',
                    col.align === 'end' ? 'text-end tabular-nums' : 'text-start',
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
