'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { Size } from '@/types/ui';

export interface SegmentOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 접근 가능한 그룹 이름 */
  label: string;
  options: readonly SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: Exclude<Size, 'lg'>;
  className?: string;
}

const SIZE = {
  sm: 'text-xs [&_label]:px-2.5 [&_label]:py-1',
  md: 'text-sm [&_label]:px-3 [&_label]:py-1.5',
} as const;

/**
 * 분절 컨트롤(세그먼티드 컨트롤).
 *
 * **라디오 버튼이다** — 보이는 모양만 다르다. 버튼 그룹으로 만들면
 * 화살표 키 이동·상호 배타·폼 제출을 다시 구현해야 하고, 스크린리더가
 * "3개 중 2번째 선택됨"을 읽어 주지 못한다.
 *
 * `Tabs` 와의 차이: Tabs 는 **화면 영역을 바꾸는** 내비게이션이고,
 * 이건 **값을 고르는** 입력이다. 정렬 기준·기간 선택 같은 데 쓴다.
 */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps) {
  const name = useId();

  return (
    <fieldset
      className={cn(
        'inline-flex rounded-md border border-border bg-surface-sunken p-0.5',
        SIZE[size],
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-sm font-medium transition-colors duration-150',
              'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring',
              selected
                ? 'bg-surface text-fg shadow-e1'
                : 'text-fg-muted hover:text-fg',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}
