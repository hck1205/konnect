import { cn } from '@/lib/cn';
import type { InputHTMLAttributes } from 'react';
import type { Size } from '@/types/ui';
import { controlVariants } from './Input.utils';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** HTML 의 size 속성(문자 수)이 아니라 디자인 시스템의 크기 단계다 */
  size?: Size;
}

/**
 * 단일 행 텍스트 입력.
 *
 * 레이블은 붙이지 않는다 — `Field` 가 담당한다. placeholder 를 레이블 대신 쓰지 않는다
 * (입력을 시작하면 사라져 무엇을 넣는 칸인지 알 수 없게 된다).
 */
export function Input({ size, className, ...rest }: InputProps) {
  return (
    <input
      className={cn(
        controlVariants({ size, invalid: rest['aria-invalid'] === true }),
        className,
      )}
      {...rest}
    />
  );
}
