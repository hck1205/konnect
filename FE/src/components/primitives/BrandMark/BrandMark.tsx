import { cn } from '@/lib/cn';

export interface BrandMarkProps {
  /** 워드마크(텍스트)를 함께 보여줄지 */
  showWordmark?: boolean;
  className?: string;
}

/**
 * 브랜드 마크.
 *
 * ⚠️ **임시 심볼이다.** 실제 로고가 정해지면 이 파일만 교체한다
 * (헤더·푸터·파비콘이 전부 여기를 거치므로 교체 지점이 하나다).
 *
 * 지금 형태: 두 고리가 맞물린 모양 — konnect(Korea + connect)의 "잇는다"를 뜻한다.
 * 색은 `currentColor` 라 놓인 자리의 텍스트 색을 따른다.
 */
export function BrandMark({ showWordmark = true, className }: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="size-5 text-brand"
        aria-hidden="true"
      >
        <path d="M9.5 14.5a4 4 0 0 1 0-5.66l2.12-2.12a4 4 0 0 1 5.66 5.66l-1.06 1.06" />
        <path d="M14.5 9.5a4 4 0 0 1 0 5.66l-2.12 2.12a4 4 0 0 1-5.66-5.66l1.06-1.06" />
      </svg>
      {showWordmark ? (
        <span className="text-base font-bold tracking-tight text-fg">konnect</span>
      ) : null}
      {/* 워드마크를 숨겨도 접근 가능한 이름은 남아야 한다 */}
      {showWordmark ? null : <span className="sr-only">konnect</span>}
    </span>
  );
}
