import type { ReactNode } from 'react';

export interface ChecklistItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** 이 항목을 자세히 설명하는 가이드 링크 */
  href?: string;
}

export interface ChecklistProps {
  title: string;
  description?: ReactNode;
  items: readonly ChecklistItem[];
  /** 완료된 항목 id 집합 */
  checked: readonly string[];
  onToggle: (id: string, checked: boolean) => void;
  className?: string;
}
