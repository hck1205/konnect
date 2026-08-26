import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DescriptionListItem {
  term: ReactNode;
  description: ReactNode;
}

export interface DescriptionListProps {
  items: readonly DescriptionListItem[];
  className?: string;
}

/**
 * 이름-값 목록 — **`<dl>`/`<dt>`/`<dd>` 의미 구조를 유지**하면서 CSS Grid 로 표처럼 정렬한다.
 *
 * `<table>` 을 쓰지 않는 이유: 이건 2차원 데이터가 아니라 **속성 목록**이다.
 * `<div>` 로 만들지 않는 이유: 스크린리더가 "용어-정의" 쌍으로 읽어 준다.
 * → docs/25-design/10-foundations/08-native-platform.md
 *
 * konnect 에서 질문/가이드 메타(체류자격, 지역, 마지막 확인일)를 보여주는 데 쓴다.
 */
export function DescriptionList({ items, className }: DescriptionListProps) {
  return (
    <dl
      className={cn(
        'grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-4 gap-y-2 text-sm',
        className,
      )}
    >
      {items.map((item, i) => (
        // term 이 ReactNode 라 키로 쓸 수 없다. 목록 순서가 곧 정체성이다.
        <div key={i} className="col-span-2 grid grid-cols-subgrid">
          <dt className="text-fg-subtle">{item.term}</dt>
          <dd className="text-fg">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
