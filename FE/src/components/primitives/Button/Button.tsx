import { cn } from '@/lib/cn';
import { Spinner } from '@/components/primitives/Spinner';
import { buttonVariants } from './Button.utils';
import type { ButtonProps } from './Button.types';

/**
 * 기본 버튼.
 *
 * 접근성 메모
 * - `loading` 중에는 `disabled` + `aria-busy` 를 함께 세팅한다. disabled 만 걸면
 *   스크린리더가 "왜 못 누르는지" 알 수 없다.
 * - 아이콘만 두지 않는다. 텍스트 없이 아이콘만 필요하면 `IconButton` 을 쓴다
 *   (그쪽은 레이블을 **필수 prop** 으로 강제한다).
 * - 포커스링은 전역 `:focus-visible` 이 담당한다. 여기서 outline 을 지우지 않는다.
 */
export function Button({
  variant,
  tone,
  size,
  fullWidth,
  loading = false,
  loadingLabel,
  iconStart,
  iconEnd,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      // 명시하지 않으면 form 안에서 submit 으로 동작해 의도치 않게 제출된다
      type={type}
      className={cn(buttonVariants({ variant, tone, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={size ?? 'md'} label={loadingLabel} />
      ) : (
        iconStart
      )}
      {children}
      {loading ? null : iconEnd}
    </button>
  );
}
