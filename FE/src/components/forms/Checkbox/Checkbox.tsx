import { cn } from '@/lib/cn';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 옆 레이블. `<label>` 로 감싸므로 텍스트를 눌러도 토글된다. */
  label: ReactNode;
  description?: ReactNode;
}

/**
 * 체크박스 — **네이티브 `<input type="checkbox">`**.
 *
 * 커스텀 체크박스를 그리지 않는 이유는 `Select` 와 같다. 강조색은 전역
 * `accent-color` 토큰이 브랜드에 맞춰 주므로 재구현할 이유가 없다.
 *
 * `<label>` 로 감싸 히트 영역을 텍스트까지 넓힌다(터치 사용자에게 특히 중요).
 */
export function Checkbox({
  label,
  description,
  className,
  id,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5',
        rest.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-sm"
        {...rest}
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-fg">{label}</span>
        {description ? (
          <span className="text-sm text-fg-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
