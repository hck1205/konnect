import { cn } from '@/lib/cn';
import type { TextareaHTMLAttributes } from 'react';
import type { Size } from '@/types/ui';
import { controlVariants } from '@/components/forms/Input';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: Size;
}

/**
 * 여러 행 텍스트 입력.
 *
 * `field-sizing: content` 를 쓰면 JS 없이 내용에 맞춰 높이가 늘어난다.
 * 지원하지 않는 브라우저는 `rows` 기본값으로 떨어지므로 안전한 점진적 향상이다.
 * → docs/25-design/10-foundations/08-native-platform.md
 */
export function Textarea({ size, className, rows = 4, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        controlVariants({ size, invalid: rest['aria-invalid'] === true }),
        'resize-y [field-sizing:content]',
        className,
      )}
      {...rest}
    />
  );
}
