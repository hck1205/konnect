import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {
  label: ReactNode;
  description?: ReactNode;
}

/**
 * 켜고 끄는 토글.
 *
 * **네이티브 `<input type="checkbox">` 에 `role="switch"`** 를 얹는다.
 * div 로 스위치를 그리면 키보드 조작(Space)·폼 제출·스크린리더 상태 안내를
 * 전부 다시 만들어야 한다. 체크박스는 그걸 이미 한다.
 *
 * 체크박스와 스위치의 차이: 체크박스는 "제출하면 반영", 스위치는 **즉시 반영**이다.
 * 즉시 반영이 아니면 `Checkbox` 를 쓴다.
 */
export function Switch({ label, description, className, ...rest }: SwitchProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start justify-between gap-4',
        rest.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-fg">{label}</span>
        {description ? (
          <span className="text-sm text-fg-muted">{description}</span>
        ) : null}
      </span>

      <input
        type="checkbox"
        role="switch"
        className={cn(
          'peer sr-only',
        )}
        {...rest}
      />
      {/* 시각적 트랙 — 실제 상태는 위 input 이 들고 있다 */}
      <span
        aria-hidden="true"
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-border-strong transition-colors duration-150',
          'peer-checked:bg-brand-solid',
          // 포커스는 전역 :focus-visible 이 input 에 그리지만, sr-only 라 보이지 않는다
          // → peer 상태로 트랙에 링을 그린다
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
          'after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-surface after:transition-transform after:duration-150',
          'peer-checked:after:translate-x-4',
        )}
      />
    </label>
  );
}
