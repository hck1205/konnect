'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { Fieldset } from '@/components/forms/Fieldset';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend: string;
  description?: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** 폼 제출용 name. 미지정 시 자동 생성. */
  name?: string;
  className?: string;
}

/**
 * 라디오 그룹 — **네이티브 `<input type="radio">`** + `<fieldset>`.
 *
 * 같은 `name` 을 공유하면 브라우저가 상호 배타·화살표 키 이동·폼 제출을 전부 처리한다.
 * `role="radiogroup"` 을 직접 붙이고 키보드를 만드는 것보다 훨씬 견고하다.
 *
 * 셀렉트와의 선택 기준: 항목이 **5개 이하이고 전부 보여주는 게 나으면** 라디오,
 * 그보다 많으면 `Select`.
 */
export function RadioGroup({
  legend,
  description,
  options,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <Fieldset legend={legend} description={description} className={className}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer items-start gap-2.5',
            option.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <input
            type="radio"
            name={groupName}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm text-fg">{option.label}</span>
            {option.description ? (
              <span className="text-sm text-fg-muted">{option.description}</span>
            ) : null}
          </span>
        </label>
      ))}
    </Fieldset>
  );
}
