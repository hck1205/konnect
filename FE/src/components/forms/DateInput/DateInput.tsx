import { cn } from '@/lib/cn';
import type { InputHTMLAttributes } from 'react';
import type { Size } from '@/types/ui';
import { controlVariants } from '@/lib/forms';

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: Size;
  /** 시각까지 받을지 */
  withTime?: boolean;
}

/**
 * 날짜 입력 — **네이티브 `<input type="date">`**.
 *
 * 캘린더 위젯을 직접 만들지 않는 이유:
 * - 브라우저·OS 기본 피커는 **사용자의 로케일 형식**을 따른다.
 *   konnect 사용자는 국적이 제각각이라 이게 특히 중요하다 —
 *   `03/04`가 3월 4일인지 4월 3일인지는 나라마다 다르다.
 * - 키보드 조작·스크린리더 지원을 브라우저가 이미 한다
 * - 모바일에서 네이티브 피커가 뜬다
 *
 * ⚠️ 값은 항상 `YYYY-MM-DD`(ISO) 다 — 표시 형식과 무관하다.
 * 서버로 보낼 때 변환이 필요 없다.
 */
export function DateInput({ size, withTime, className, ...rest }: DateInputProps) {
  return (
    <input
      type={withTime ? 'datetime-local' : 'date'}
      className={cn(
        controlVariants({ size, invalid: rest['aria-invalid'] === true }),
        className,
      )}
      {...rest}
    />
  );
}
