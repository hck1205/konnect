'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { buildFieldAria } from './Field.utils';
import type { FieldProps } from './Field.types';

/**
 * 폼 필드 래퍼 — 레이블·설명·에러를 입력 요소에 **올바르게 연결**한다.
 *
 * 자식을 render prop 으로 받는 이유: 입력 요소가 `<input>`, `<textarea>`,
 * `<select>`, 커스텀 위젯 중 무엇이든 같은 배선을 받아야 하기 때문이다.
 * 자식을 복제(cloneElement)하는 방식은 타입이 무너지고 중첩에 취약하다.
 *
 * ```tsx
 * <Field label="Nickname" error={err}>
 *   {(aria) => <Input {...aria} value={v} onChange={...} />}
 * </Field>
 * ```
 */
export function Field({
  label,
  description,
  error,
  required = false,
  id,
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const aria = buildFieldAria({
    id: fieldId,
    hasDescription: Boolean(description),
    hasError: Boolean(error),
    required,
  });

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-fg">
        {label}
        {required ? (
          <>
            {' '}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </>
        ) : null}
      </label>

      {description ? (
        <p id={`${fieldId}-description`} className="text-sm text-fg-muted">
          {description}
        </p>
      ) : null}

      {children(aria)}

      {/* role="alert" 로 제출 후 나타난 에러를 스크린리더가 즉시 읽게 한다 */}
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
