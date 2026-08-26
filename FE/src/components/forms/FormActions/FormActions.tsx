import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FormActionsProps {
  /** 주요 행동(제출). 오른쪽에 놓인다. */
  primary: ReactNode;
  /** 보조 행동(취소). 왼쪽에 놓인다. */
  secondary?: ReactNode;
  /** 파괴적 행동(삭제). 반대편 끝에 떨어뜨려 실수로 누르는 것을 막는다. */
  destructive?: ReactNode;
  className?: string;
}

/**
 * 폼 하단 액션 줄.
 *
 * 배치 규칙을 한 곳에 고정한다 — 화면마다 취소/제출 순서가 다르면
 * 사용자가 매번 읽어야 한다.
 *
 * 파괴적 행동은 **반대편 끝**에 둔다. 제출 버튼 바로 옆의 삭제 버튼은
 * 언젠가 잘못 눌린다.
 */
export function FormActions({
  primary,
  secondary,
  destructive,
  className,
}: FormActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {destructive ? <div className="me-auto">{destructive}</div> : null}
      <div className="ms-auto flex items-center gap-2">
        {secondary}
        {primary}
      </div>
    </div>
  );
}
