import { cn } from '@/lib/cn';
import type { SelectHTMLAttributes } from 'react';
import type { Size } from '@/types/ui';
import { controlVariants } from '@/components/forms/Input';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  size?: Size;
  options: readonly SelectOption[];
  /** 빈 값 안내. 값이 필수인 경우에 첫 항목으로 둔다. */
  placeholder?: string;
}

/**
 * 드롭다운 선택 — **네이티브 `<select>`** 를 쓴다.
 *
 * 커스텀 셀렉트는 키보드 조작·모바일 네이티브 피커·스크린리더 지원을 전부 다시
 * 만들어야 하고, 대부분 어딘가 빠진다. 네이티브는 그걸 이미 정확히 한다.
 * 강조색은 `accent-color` 전역 토큰이 맞춰 준다.
 * → docs/25-design/10-foundations/08-native-platform.md
 */
export function Select({
  size,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <select
      className={cn(
        controlVariants({ size, invalid: rest['aria-invalid'] === true }),
        'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
