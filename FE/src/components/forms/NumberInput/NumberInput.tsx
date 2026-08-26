import { cn } from '@/lib/cn';
import type { InputHTMLAttributes } from 'react';
import type { Size } from '@/types/ui';
import { controlVariants } from '@/components/forms/Input';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: Size;
  /** 단위 표시 ("KRW", "months"). 입력값에는 포함되지 않는다. */
  suffix?: string;
}

/**
 * 숫자 입력 — **네이티브 `<input type="number">`**.
 *
 * 브라우저가 위/아래 화살표 키 증감, 모바일 숫자 키패드, 유효성 검사를 처리한다.
 *
 * `inputMode="decimal"` 을 함께 주는 이유: `type="number"` 만으로는 일부
 * 모바일 브라우저가 문자 키패드를 띄운다.
 *
 * 숫자를 세는 게 아니라 **식별자**(전화번호, 계좌번호)라면 `type="number"` 를
 * 쓰지 않는다 — 앞자리 0 이 사라지고 스피너가 의미 없다. 그건 `Input` 에
 * `inputMode="numeric"` 을 준다.
 */
export function NumberInput({ size, suffix, className, ...rest }: NumberInputProps) {
  const input = (
    <input
      type="number"
      inputMode="decimal"
      className={cn(
        controlVariants({ size, invalid: rest['aria-invalid'] === true }),
        suffix && 'pe-14',
        'tabular-nums',
        className,
      )}
      {...rest}
    />
  );

  if (!suffix) return input;

  return (
    <div className="relative">
      {input}
      <span
        aria-hidden="true"
        style={{ insetInlineEnd: '0.75rem' }}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-fg-subtle"
      >
        {suffix}
      </span>
    </div>
  );
}
