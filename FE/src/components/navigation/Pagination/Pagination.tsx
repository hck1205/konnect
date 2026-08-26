import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/primitives/Button';
import type { PaginationProps } from './Pagination.types';

/**
 * 키셋(커서) 페이지네이션 컨트롤.
 *
 * 페이지 **번호가 없다.** 커서 방식은 전체 개수를 모르기 때문이다 —
 * 그건 한계가 아니라 의도다. 시간순 목록에 새 글이 계속 들어오는 상황에서
 * offset 페이지는 중복·누락을 만든다
 * (→ docs/30-architecture/03-api-conventions.md).
 *
 * 커서 스택 조작은 `Pagination.utils` 의 순수 함수가 담당한다.
 */
export function Pagination({
  nextCursor,
  hasPrevious,
  onNext,
  onPrevious,
  loading,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-between gap-3', className)}
    >
      <Button
        variant="outline"
        tone="neutral"
        size="sm"
        disabled={!hasPrevious || loading}
        onClick={onPrevious}
        iconStart={<ChevronLeft className="size-4" />}
      >
        Previous
      </Button>

      <Button
        variant="outline"
        tone="neutral"
        size="sm"
        disabled={nextCursor === null || loading}
        onClick={onNext}
        iconEnd={<ChevronRight className="size-4" />}
      >
        Next
      </Button>
    </nav>
  );
}
