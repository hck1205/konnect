import type { ReactNode } from 'react';

export interface TabItem {
  /** URL 쿼리에 그대로 실리는 값 — 탭 상태의 단일 출처는 URL 이다 */
  value: string;
  label: string;
  /** 개수 배지 (선택) */
  count?: number;
  icon?: ReactNode;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
