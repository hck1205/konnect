import { cva } from 'class-variance-authority';

/**
 * 입력 요소 공용 클래스. Input·Textarea·Select 가 공유한다.
 *
 * 테두리에 `border-interactive` 를 쓰는 이유: 입력의 경계는 장식이 아니라
 * **어디를 눌러야 하는지 알려주는 정보**라 WCAG 비텍스트 대비 3:1 대상이다.
 * → docs/25-design/02-tokens.md
 */
export const controlVariants = cva(
  [
    'w-full rounded-md border bg-surface-sunken text-fg',
    'placeholder:text-fg-subtle',
    'transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // 포커스링은 전역 :focus-visible 이 담당한다
    'aria-invalid:border-danger',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 px-2.5 py-1.5 text-sm',
        md: 'min-h-10 px-3 py-2 text-sm',
        lg: 'min-h-12 px-4 py-3 text-base',
      },
      invalid: { true: 'border-danger', false: 'border-border-interactive' },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);
