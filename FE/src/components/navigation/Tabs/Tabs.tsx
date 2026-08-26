'use client';

import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { nextTabIndex } from './Tabs.utils';
import type { TabsProps } from './Tabs.types';

/**
 * 탭 목록.
 *
 * `role="tablist"` 를 쓰면 **화살표 키 로빙 포커스가 의무**가 된다 —
 * 롤만 붙이고 키보드 동작을 안 만들면 스크린리더 사용자에게 오히려 더 나쁘다.
 * 그래서 여기서는 롤과 함께 화살표 이동·Home/End 를 실제로 구현한다.
 * (구현할 생각이 없으면 롤을 붙이지 않고 링크 목록으로 두는 게 옳다 — `Menu` 가 그 경우다)
 *
 * 패널은 이 컴포넌트가 렌더하지 않는다. 탭 상태의 단일 출처는 보통 URL 이고,
 * 패널 내용은 화면이 직접 그리는 편이 자연스럽기 때문이다.
 */
export function Tabs({ items, value, onChange, className }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const currentIndex = items.findIndex((t) => t.value === value);

  const focusTab = (index: number) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[index]?.focus();
    onChange(items[index].value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusTab(nextTabIndex(currentIndex, items.length, 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusTab(nextTabIndex(currentIndex, items.length, -1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusTab(items.length - 1);
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn('flex gap-1 border-b border-border', className)}
    >
      {items.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            // 선택된 탭만 Tab 키로 닿는다 — 로빙 tabindex 의 핵심
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              '-mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors duration-150',
              selected
                ? 'border-brand font-medium text-brand'
                : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {tab.icon ? (
              <span aria-hidden="true" className="inline-flex">
                {tab.icon}
              </span>
            ) : null}
            {tab.label}
            {tab.count !== undefined ? (
              <span className="rounded-sm bg-surface-sunken px-1.5 text-xs text-fg-muted">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
