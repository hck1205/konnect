import { cn } from '@/lib/cn';
import type { Size } from '@/types/ui';

const SIZE: Record<Size, string> = {
  sm: 'size-3.5 border-2',
  md: 'size-4 border-2',
  lg: 'size-5 border-2',
};

export interface SpinnerProps {
  size?: Size;
  className?: string;
  /**
   * 스크린리더에 읽힐 로딩 문구. 버튼 안처럼 **바깥에 이미 상태 안내가 있으면**
   * 생략한다(중복 안내가 된다).
   */
  label?: string;
}

/**
 * 로딩 인디케이터.
 *
 * `currentColor` 를 쓰므로 부모의 text 색을 그대로 따른다 —
 * 버튼 안에 넣어도 별도 색 지정이 필요 없다.
 */
export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full',
        'border-current border-r-transparent',
        SIZE[size],
        className,
      )}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
