export interface PaginationProps {
  /** 다음 페이지 커서. null 이면 마지막 페이지다. */
  nextCursor: string | null;
  /** 이전 페이지로 돌아갈 수 있는지 (커서 스택이 비어 있지 않은지) */
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  loading?: boolean;
  className?: string;
}
